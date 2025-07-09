from django.contrib import admin
from .models import Fixture, Class, Student, Teacher

admin.site.register(Fixture)
admin.site.register(Class)
admin.site.register(Student)
admin.site.register(Teacher)