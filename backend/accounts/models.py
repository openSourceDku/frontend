from django.db import models
from django.contrib.auth.models import AbstractUser
from management.models import Teacher # Import Teacher model

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='teacher')
    
    # Add a OneToOneField to link to the Teacher model
    # related_name='user_account' allows you to access User from Teacher: teacher_instance.user_account
    teacher_profile = models.OneToOneField(Teacher, on_delete=models.SET_NULL, null=True, blank=True, related_name='user_account')

    def __str__(self):
        return self.username