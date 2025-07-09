from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (('Custom fields', {'fields': ('role',)}),)
    add_fieldsets = UserAdmin.add_fieldsets + (('Custom fields', {'fields': ('role',)}),)