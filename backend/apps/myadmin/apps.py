from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class AdminConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.myadmin'
    verbose_name = _('後台管理')

    def ready(self):
        try:
            import apps.myadmin.signals  # noqa F401
        except ImportError:
            pass