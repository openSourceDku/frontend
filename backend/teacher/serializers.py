from rest_framework import serializers
from .models import Todo, Report
from management.models import Class # Import Class model

class TodoSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='todoTitle', required=False, allow_blank=True)
    task = serializers.CharField(source='description', required=False, allow_blank=True)
    class_obj = serializers.PrimaryKeyRelatedField(queryset=Class.objects.all(), write_only=True)

    class Meta:
        model = Todo
        fields = ('id', 'class_obj', 'title', 'task', 'date')

    def create(self, validated_data):
        print("TodoSerializer validated_data before create:", validated_data)
        return Todo.objects.create(**validated_data)

class ReportSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = '__all__'

    def get_student(self, obj):
        from management.serializers import StudentSerializer
        return StudentSerializer(obj.student).data if obj.student else None

