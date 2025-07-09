from django.db import models

class Fixture(models.Model):
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    count = models.IntegerField()

    def __str__(self):
        return self.name

class Teacher(models.Model):
    teacher_id = models.CharField(max_length=50, unique=True)
    passwd = models.CharField(max_length=100)
    teacher_name = models.CharField(max_length=100)
    age = models.IntegerField()
    position = models.CharField(max_length=100)
    sex = models.CharField(max_length=10)

    def __str__(self):
        return self.teacher_name

class Class(models.Model):
    className = models.CharField(max_length=100)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True)
    classTime = models.CharField(max_length=100, blank=True, null=True) # 월 수 금
    classroom = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.className

class Student(models.Model):
    class_obj = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    name = models.CharField(max_length=100)
    birth_date = models.DateField()
    email = models.EmailField()
    gender = models.CharField(max_length=10)

    def __str__(self):
        return self.name