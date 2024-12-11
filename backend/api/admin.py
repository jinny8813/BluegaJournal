# api/admin.py
"""API 應用的管理界面配置"""
from django.contrib import admin

from .models import Todo


@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    """Todo 模型的管理界面配置"""

    list_display = ("title", "completed", "created_at", "user")
    list_filter = ("completed", "created_at")
    search_fields = ("title",)
