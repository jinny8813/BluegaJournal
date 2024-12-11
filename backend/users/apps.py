# users/apps.py
"""用戶應用程序配置"""
from django.apps import AppConfig


class UsersConfig(AppConfig):
    """用戶應用程序的配置類"""

    default_auto_field = "django.db.models.BigAutoField"
    name = "users"
