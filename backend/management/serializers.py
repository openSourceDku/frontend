from rest_framework import serializers
from .models import Fixture, Class, Student, Teacher
from django.contrib.auth.hashers import make_password
from teacher.serializers import TodoSerializer # Import TodoSerializer

class FixtureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fixture
        fields = '__all__'

class TeacherSerializer(serializers.ModelSerializer):
    teacherId = serializers.IntegerField(source='id', read_only=True)
    name = serializers.CharField(source='teacher_name', read_only=True)
    passwd = serializers.CharField(write_only=True, required=False, allow_blank=True) # passwd 필드를 write_only로 설정

    class Meta:
        model = Teacher
        fields = ('teacherId', 'name', 'passwd', 'age', 'position', 'sex')

    def create(self, validated_data):
        # 비밀번호를 해싱하여 저장
        if 'passwd' in validated_data:
            validated_data['passwd'] = make_password(validated_data['passwd'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # 비밀번호를 해싱하여 업데이트
        if 'passwd' in validated_data:
            validated_data['passwd'] = make_password(validated_data['passwd'])
        return super().update(instance, validated_data)

class StudentSerializer(serializers.ModelSerializer):
    studentId = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = Student
        fields = ('studentId', 'name')

    def create(self, validated_data):
        print("StudentSerializer validated_data before save:", validated_data)
        return super().create(validated_data)

class ClassSerializer(serializers.ModelSerializer):
    classId = serializers.IntegerField(source='id', read_only=True)
    teacher = TeacherSerializer(read_only=True)
    daysOfWeek = serializers.SerializerMethodField()
    students = StudentSerializer(many=True, read_only=True)
    todos = TodoSerializer(many=True, read_only=True)

    class Meta:
        model = Class
        fields = ('classId', 'className', 'teacher', 'daysOfWeek', 'students', 'todos', 'classroom')

    def get_daysOfWeek(self, obj):
        return obj.classTime.split(',') if obj.classTime else []

    def is_valid(self, raise_exception=False):
        valid = super().is_valid(raise_exception=False)
        if not valid:
            print("ClassSerializer validation errors:", self.errors)
        if raise_exception and not valid:
            raise serializers.ValidationError(self.errors)
        return valid

    def create(self, validated_data):
        teacher_data = self.initial_data.get('teacher', None)
        students_data = self.initial_data.get('students', [])
        todos_data = validated_data.pop('todos', [])

        # Handle teacher
        teacher_instance = None
        if teacher_data and 'teacherId' in teacher_data:
            try:
                teacher_instance = Teacher.objects.get(id=teacher_data['teacherId'])
            except Teacher.DoesNotExist:
                raise serializers.ValidationError({"teacher": "Teacher with this ID does not exist."})
        validated_data['teacher'] = teacher_instance

        # Handle daysOfWeek (classTime)
        days_of_week = self.initial_data.get('daysOfWeek', [])
        validated_data['classTime'] = ','.join(days_of_week)

        print("ClassSerializer validated_data before create:", validated_data)

        class_instance = Class.objects.create(**validated_data)

        # Handle students
        for student_item in students_data:
            try:
                student = Student.objects.get(id=student_item['studentId'])
                student.class_obj = class_instance
                student.save()
            except Student.DoesNotExist:
                print(f"Student with ID {student_item['studentId']} not found.")
                # Optionally, raise an error or log this more formally

        # Handle todos
        for todo_data in todos_data:
            todo_serializer = TodoSerializer(data=todo_data)
            if todo_serializer.is_valid():
                todo_serializer.save(class_obj=class_instance)
            else:
                print("TodoSerializer validation errors in ClassSerializer create:", todo_serializer.errors)
                raise serializers.ValidationError({"todos": todo_serializer.errors})

        return class_instance

    def update(self, instance, validated_data):
        teacher_data = validated_data.pop('teacher', None)
        students_data = validated_data.pop('students', None)
        todos_data = validated_data.pop('todos', None)

        # Handle teacher update
        if teacher_data is not None:
            teacher_instance = None
            if 'teacherId' in teacher_data:
                try:
                    teacher_instance = Teacher.objects.get(id=teacher_data['teacherId'])
                except Teacher.DoesNotExist:
                    raise serializers.ValidationError({"teacher": "Teacher with this ID does not exist."})
            instance.teacher = teacher_instance

        # Handle daysOfWeek (classTime) update
        days_of_week = self.initial_data.get('daysOfWeek', None)
        if days_of_week is not None:
            validated_data['classTime'] = ','.join(days_of_week)

        # Update class fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        print("ClassSerializer validated_data before update (after processing initial_data):", validated_data)
        print("instance.teacher before save:", instance.teacher)
        instance.save()
        return instance