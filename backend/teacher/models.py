from django.db import models
from management.models import Class, Student

class Todo(models.Model):
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='todos')
    todoTitle = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    date = models.DateField()

    def __str__(self):
        return f"{self.class_obj.className} - {self.todoTitle}"

class Report(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='reports')
    common_subject = models.CharField(max_length=200, blank=True, null=True)
    common_content = models.TextField(blank=True, null=True)
    personal_message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report for {self.student.name} on {self.created_at.strftime('%Y-%m-%d')}"