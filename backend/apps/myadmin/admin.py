from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import AdminLog, AdminSetting


@admin.register(AdminLog)
class AdminLogAdmin(admin.ModelAdmin):
    list_display = ['admin', 'action', 'model_type', 'object_id', 'ip_address', 'created_at']
    list_filter = ['action', 'model_type', 'created_at']
    search_fields = ['admin__email', 'model_type', 'object_id', 'ip_address']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {
            'fields': ('admin', 'action', 'model_type', 'object_id')
        }),
        (_('Details'), {
            'fields': ('detail', 'ip_address')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(AdminSetting)
class AdminSettingAdmin(admin.ModelAdmin):
    list_display = ['key', 'is_active', 'updated_at']
    list_filter = ['is_active']
    search_fields = ['key', 'description']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['key']
    
    fieldsets = (
        (None, {
            'fields': ('key', 'value', 'is_active')
        }),
        (_('Additional Information'), {
            'fields': ('description',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )