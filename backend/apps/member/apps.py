# apps/member/apps.py
from django.apps import AppConfig

class MemberConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.member'
    verbose_name = '會員管理'
