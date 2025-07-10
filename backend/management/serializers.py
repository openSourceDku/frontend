from rest_framework import serializers
from django.contrib.auth.hashers import make_password

from .models import Fixture, Class, Student, Teacher
from teacher.models import Todo

# ────────────────────────────── Fixture ──────────────────────────────
class FixtureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fixture
        fields = '__all__'


# ────────────────────────────── Teacher ──────────────────────────────
class TeacherSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    teacherId = serializers.CharField(source='teacher_id')
    name = serializers.CharField(source='teacher_name')
    passwd = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Teacher
        fields = ('id', 'teacherId', 'passwd', 'name', 'age', 'position', 'sex')

    def create(self, validated):
        pwd = validated.pop('passwd', '').strip()
        if not pwd:
            raise serializers.ValidationError({'passwd': 'Password is required for new teacher.'})
        validated['passwd'] = make_password(pwd)
        return super().create(validated)

    def update(self, inst, validated):
        pwd = validated.pop('passwd', '').strip()
        if pwd:
            validated['passwd'] = make_password(pwd)
        return super().update(inst, validated)


# ────────────────────────────── Student ──────────────────────────────
class StudentSerializer(serializers.ModelSerializer):
    """클라이언트 → camelCase(JSON) | 모델 → snake_case(DB)
    * 프런트: classId / birthDate 로 보냄 ↔ 모델: class_obj / birth_date
    """

    # 읽기용: 현재 배정된 클래스 PK
    class_id = serializers.SerializerMethodField(read_only=True)

    # 프런트에서 오는 필드들 (write‑only)
    classId   = serializers.CharField(write_only=True, required=False, allow_blank=True)
    birthDate = serializers.DateField(write_only=False, source='birth_date')

    class Meta:
        model  = Student
        fields = (
            'id',
            'class_id',  # read‑only
            'classId',   # write‑only
            'name',
            'email',
            'birthDate', # read‑write (maps to birth_date)
            'gender',
        )

    # -------- READ helper --------
    def get_class_id(self, obj):
        return obj.class_obj.id if obj.class_obj else None

    # -------- CREATE --------
    def create(self, validated):
        # classId 처리 → FK 연결
        class_id_raw = validated.pop('classId', '')
        if class_id_raw:
            try:
                class_id_int = int(class_id_raw)
                validated['class_obj'] = Class.objects.get(id=class_id_int)
            except (ValueError, Class.DoesNotExist):
                raise serializers.ValidationError({'classId': 'Invalid Class ID'})
        return super().create(validated)

    # -------- UPDATE --------
    def update(self, instance, validated):
        class_id_raw = validated.pop('classId', None)
        if class_id_raw is not None:  # ''(빈값) → 연결 해제
            if class_id_raw == '':
                instance.class_obj = None
            else:
                try:
                    class_id_int = int(class_id_raw)
                    instance.class_obj = Class.objects.get(id=class_id_int)
                except (ValueError, Class.DoesNotExist):
                    raise serializers.ValidationError({'classId': 'Invalid Class ID'})
        return super().update(instance, validated)


# ───────────────── Todo (nested write) ─────────────────
class _TodoWriteSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class_obj = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Todo
        fields = ('id', 'date', 'todoTitle', 'description', 'class_obj')


# ────────────────────────────── Class ────────────────────────────────
class ClassSerializer(serializers.ModelSerializer):
    classId = serializers.IntegerField(source='id', read_only=True)
    teacher = serializers.SerializerMethodField()
    students = serializers.SerializerMethodField()
    daysOfWeek = serializers.SerializerMethodField()
    todos = _TodoWriteSerializer(many=True, required=False)

    class Meta:
        model = Class
        fields = ('classId', 'className', 'teacher', 'daysOfWeek', 'students', 'todos', 'classroom')

    def get_teacher(self, obj):
        if not obj.teacher:
            return None
        return {
            'id': obj.teacher.id,
            'teacherId': obj.teacher.teacher_id,
            'name': obj.teacher.teacher_name,
            'age': obj.teacher.age,
            'position': obj.teacher.position,
            'sex': obj.teacher.sex,
        }

    def get_students(self, obj):
        return [{'id': s.id, 'name': s.name} for s in obj.students.all()]

    def get_daysOfWeek(self, obj):
        return obj.classTime.split(',') if obj.classTime else []

    # ---------- CREATE ----------
    def create(self, validated_data):
        nested_teacher = self.initial_data.get('teacher', {})
        nested_students = self.initial_data.get('students', [])
        nested_days = self.initial_data.get('daysOfWeek', [])
        todos_data = validated_data.pop('todos', [])

        teacher_inst = None
        if nested_teacher.get('id'):
            teacher_inst = Teacher.objects.get(id=nested_teacher['id'])
        elif nested_teacher.get('teacherId'):
            teacher_inst = Teacher.objects.get(teacher_id=nested_teacher['teacherId'])

        instance = Class.objects.create(
            className=validated_data.get('className'),
            classroom=validated_data.get('classroom'),
            teacher=teacher_inst,
            classTime=','.join(nested_days),
        )

        for s in nested_students:
            try:
                stu = Student.objects.get(id=s['id'])
                stu.class_obj = instance
                stu.save()
            except Student.DoesNotExist:
                continue

        for todo_item in todos_data:
            Todo.objects.create(class_obj=instance, **todo_item)

        return instance

    # ---------- UPDATE ----------
    def update(self, instance, validated_data):
        nested_teacher = self.initial_data.get('teacher', {})
        nested_students = self.initial_data.get('students')
        nested_days = self.initial_data.get('daysOfWeek')
        todos_data = validated_data.pop('todos', [])

        if nested_teacher.get('id'):
            instance.teacher = Teacher.objects.get(id=nested_teacher['id'])
        elif nested_teacher.get('teacherId'):
            instance.teacher = Teacher.objects.get(teacher_id=nested_teacher['teacherId'])

        if nested_days is not None:
            instance.classTime = ','.join(nested_days)

        instance.className = validated_data.get('className', instance.className)
        instance.classroom = validated_data.get('classroom', instance.classroom)
        instance.save()

        if nested_students is not None:
            Student.objects.filter(class_obj=instance).update(class_obj=None)
            for s in nested_students:
                try:
                    stu = Student.objects.get(id=s['id'])
                    stu.class_obj = instance
                    stu.save()
                except Student.DoesNotExist:
                    continue

        existing_todos = {todo.id: todo for todo in instance.todos.all()}
        for todo_item in todos_data:
            if 'id' in todo_item and todo_item['id'] in existing_todos:
                todo = existing_todos.pop(todo_item['id'])
                for key, value in todo_item.items():
                    setattr(todo, key, value)
                todo.save()
            else:
                Todo.objects.create(class_obj=instance, **todo_item)

        for todo in existing_todos.values():
            todo.delete()

        return instance
