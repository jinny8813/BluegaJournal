# apps/myadmin/admin.py
from django.contrib import admin
from .models import AdminRole, AdminPermission, RolePermission, AdminUser

@admin.register(AdminRole)
class AdminRoleAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']

@admin.register(AdminPermission)
class AdminPermissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'codename', 'module', 'is_active']
    list_filter = ['module', 'is_active']
    search_fields = ['name', 'codename']

@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ['role', 'permission']
    list_filter = ['role']
