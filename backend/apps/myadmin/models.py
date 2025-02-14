from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.member.models import TypedModel


class AdminLog(TypedModel):
    """管理員操作日誌"""
    
    class ActionType(models.TextChoices):
        CREATE = 'C', _('Create')
        UPDATE = 'U', _('Update')
        DELETE = 'D', _('Delete')
        LOGIN = 'L', _('Login')
        LOGOUT = 'O', _('Logout')
        OTHER = 'X', _('Other')

    admin = models.ForeignKey(
        'member.Member',
        on_delete=models.CASCADE,
        related_name='admin_logs',
        verbose_name=_('admin'),
        help_text=_('The admin who performed the action.')
    )
    action = models.CharField(
        max_length=1,
        choices=ActionType.choices,
        verbose_name=_('action'),
        help_text=_('The type of action performed.')
    )
    model_type = models.CharField(
        max_length=50,
        verbose_name=_('model type'),
        help_text=_('The type of model that was affected.')
    )
    object_id = models.CharField(
        max_length=50,
        verbose_name=_('object ID'),
        help_text=_('The ID of the object that was affected.')
    )
    detail = models.JSONField(
        default=dict,
        verbose_name=_('detail'),
        help_text=_('Additional details about the action.')
    )
    ip_address = models.GenericIPAddressField(
        verbose_name=_('IP address'),
        help_text=_('The IP address from which the action was performed.')
    )

    class Meta:
        db_table = 'admin_log'
        verbose_name = _('admin log')
        verbose_name_plural = _('admin logs')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['admin'], name='admin_log_admin_idx'),
            models.Index(fields=['action'], name='admin_log_action_idx'),
            models.Index(fields=['created_at'], name='admin_log_created_at_idx'),
        ]

    def __str__(self):
        return f"{self.admin.email} - {self.get_action_display()} - {self.created_at}"


class AdminSetting(TypedModel):
    """管理員設置"""
    
    key = models.CharField(
        max_length=50,
        unique=True,
        verbose_name=_('key'),
        help_text=_('The setting key.')
    )
    value = models.JSONField(
        verbose_name=_('value'),
        help_text=_('The setting value.')
    )
    description = models.TextField(
        blank=True,
        verbose_name=_('description'),
        help_text=_('Description of what this setting does.')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('active'),
        help_text=_('Whether this setting is currently active.')
    )

    class Meta:
        db_table = 'admin_setting'
        verbose_name = _('admin setting')
        verbose_name_plural = _('admin settings')
        ordering = ['key']
        indexes = [
            models.Index(fields=['key'], name='admin_setting_key_idx'),
            models.Index(fields=['is_active'], name='admin_setting_active_idx'),
        ]

    def __str__(self):
        return self.key