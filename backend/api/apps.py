# api/apps.py
"""API 應用程序配置"""
from django.apps import AppConfig


class ApiConfig(AppConfig):
    """API 應用程序的配置類"""

    default_auto_field = "django.db.models.BigAutoField"
    name = "api"
