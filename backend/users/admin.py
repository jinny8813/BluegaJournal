# users/admin.py
"""用戶管理界面配置"""
from django.contrib import admin
from django.contrib.auth import get_user_model

User = get_user_model()


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """用戶模型的管理界面配置"""

    list_display = ("username", "email", "is_active", "is_staff")
    search_fields = ("username", "email")
