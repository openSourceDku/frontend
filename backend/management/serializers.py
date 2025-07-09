# backend/management/serializers.py
from rest_framework import serializers
from django.contrib.auth.hashers import make_password

from .models import Fixture, Class, Student, Teacher
from teacher.serializers import TodoSerializer   # TodoSerializer 그대로 사용


# ────────────────────────────── Fixture ──────────────────────────────
class FixtureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fixture
        fields = '__all__'


# ────────────────────────────── Teacher ──────────────────────────────
class TeacherSerializer(serializers.ModelSerializer):
    # PK (서버에서 자동 생성) → 조회 전용
    id         = serializers.IntegerField(read_only=True)

    # 로그인용 Teacher ID  (쓰기/읽기)
    teacherId  = serializers.CharField(source='teacher_id')

    # 표시용 이름 (쓰기/읽기)
    name       = serializers.CharField(source='teacher_name')

    # 비밀번호: 새 등록 때 필수, 수정 때는 선택
    passwd     = serializers.CharField(write_only=True,
                                       required=False,
                                       allow_blank=True)

    class Meta:
        model  = Teacher
        fields = ('id', 'teacherId', 'passwd', 'name',
                  'age', 'position', 'sex')

    # ---------- CREATE ----------
    def create(self, validated):
        pwd = validated.pop('passwd', '').strip()
        if not pwd:
            raise serializers.ValidationError(
                {'passwd': 'Password is required for new teacher.'}
            )
        validated['passwd'] = make_password(pwd)
        return super().create(validated)

    # ---------- UPDATE ----------
    def update(self, inst, validated):
        pwd = validated.pop('passwd', '').strip()
        if pwd:
            validated['passwd'] = make_password(pwd)
        return super().update(inst, validated)


# ────────────────────────────── Student ──────────────────────────────
# ───────────────── StudentSerializer ─────────────────
class StudentSerializer(serializers.ModelSerializer):
    class_id = serializers.SerializerMethodField()

    class Meta:
        model  = Student
        fields = ('id', 'class_id',  # 조회용 PK 들
                  'name', 'email', 'birth_date', 'gender')

    def get_class_id(self, obj):
        return obj.class_obj.id if obj.class_obj else None

    # -------- CREATE --------
    def create(self, validated):
        # 선택 사항: classId 로 FK 연결
        class_id = self.initial_data.get('classId') or self.initial_data.get('class_id')
        if class_id:
            try:
                validated['class_obj'] = Class.objects.get(id=class_id)
            except Class.DoesNotExist:
                raise serializers.ValidationError({'classId': 'Invalid Class ID'})
        return super().create(validated)

    # -------- UPDATE --------
    def update(self, instance, validated):
        class_id = self.initial_data.get('classId') or self.initial_data.get('class_id')
        if class_id is not None:        # ''(빈값) → 연결 해제
            if class_id == '':
                instance.class_obj = None
            else:
                try:
                    instance.class_obj = Class.objects.get(id=class_id)
                except Class.DoesNotExist:
                    raise serializers.ValidationError({'classId': 'Invalid Class ID'})
        return super().update(instance, validated)

# ────────────────────────────── Class ────────────────────────────────
class ClassSerializer(serializers.ModelSerializer):
    classId    = serializers.IntegerField(source='id', read_only=True)
    teacher    = serializers.SerializerMethodField()
    students   = serializers.SerializerMethodField()
    daysOfWeek = serializers.SerializerMethodField()
    todos      = TodoSerializer(many=True)

    class Meta:
        model  = Class
        fields = ('classId', 'className', 'teacher',
                  'daysOfWeek', 'students', 'todos', 'classroom')

    # ---------- nested 출력 ----------
    def get_teacher(self, obj):
        if not obj.teacher:
            return None
        return {
            'id'       : obj.teacher.id,            # PK
            'teacherId': obj.teacher.teacher_id,    # 로그인 ID
            'name'     : obj.teacher.teacher_name,
            'age'      : obj.teacher.age,
            'position' : obj.teacher.position,
            'sex'      : obj.teacher.sex,
        }

    def get_students(self, obj):
        return [{'id': s.id, 'name': s.name} for s in obj.students.all()]

    def get_daysOfWeek(self, obj):
        return obj.classTime.split(',') if obj.classTime else []

    # ---------- CREATE ----------
    def create(self, validated_data):
        nested_teacher  = self.initial_data.get('teacher', {})
        nested_students = self.initial_data.get('students', [])
        nested_days     = self.initial_data.get('daysOfWeek', [])
        todos_data      = validated_data.pop('todos', [])

        # 1) teacher FK
        teacher_inst = None
        if nested_teacher.get('id'):
            teacher_inst = Teacher.objects.get(id=nested_teacher['id'])
        elif nested_teacher.get('teacherId'):
            teacher_inst = Teacher.objects.get(teacher_id=nested_teacher['teacherId'])

        # 2) Class 인스턴스
        instance = Class.objects.create(
            className = validated_data.get('className'),
            classroom = validated_data.get('classroom'),
            teacher   = teacher_inst,
            classTime = ','.join(nested_days),
        )

        # 3) students FK
        for s in nested_students:
            try:
                stu = Student.objects.get(id=s['id'])
                stu.class_obj = instance
                stu.save()
            except Student.DoesNotExist:
                continue

        # 4) todos
        for todo_item in todos_data:
            Todo.objects.create(class_obj=instance, **todo_item)

        return instance

    # ---------- UPDATE ----------
    def update(self, instance, validated_data):
        nested_teacher  = self.initial_data.get('teacher', {})
        nested_students = self.initial_data.get('students')
        nested_days     = self.initial_data.get('daysOfWeek')
        todos_data      = validated_data.pop('todos', [])

        # 1) teacher FK 갱신
        if nested_teacher.get('id'):
            instance.teacher = Teacher.objects.get(id=nested_teacher['id'])
        elif nested_teacher.get('teacherId'):
            instance.teacher = Teacher.objects.get(teacher_id=nested_teacher['teacherId'])

        # 2) 요일
        if nested_days is not None:
            instance.classTime = ','.join(nested_days)

        # 3) 기본 필드
        instance.className = validated_data.get('className', instance.className)
        instance.classroom = validated_data.get('classroom', instance.classroom)
        instance.save()

        # 4) students FK 갱신
        if nested_students is not None:
            Student.objects.filter(class_obj=instance).update(class_obj=None)
            for s in nested_students:
                try:
                    stu = Student.objects.get(id=s['id'])
                    stu.class_obj = instance
                    stu.save()
                except Student.DoesNotExist:
                    continue

        # 5) todos 병합: 같은 날짜가 없으면 추가
        existing_todos = {todo.id: todo for todo in instance.todos.all()}
        for todo_item in todos_data:
            if 'id' in todo_item and todo_item['id'] in existing_todos:
                todo = existing_todos.pop(todo_item['id'])
                for key, value in todo_item.items():
                    setattr(todo, key, value)
                todo.save()
            else:
                Todo.objects.create(class_obj=instance, **todo_item)

        # Delete remaining todos (those not in todos_data)
        for todo in existing_todos.values():
            todo.delete()

        return instance
