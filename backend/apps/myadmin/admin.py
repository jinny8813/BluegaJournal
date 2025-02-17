from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Admin, AdminLoginLog  # 修改這裡

@admin.register(Admin)
class AdminAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'name', 'is_active', 'is_staff', 'date_joined', 'last_login')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login')
    search_fields = ('email', 'username', 'name')
    ordering = ('-date_joined',)
    readonly_fields = ('date_joined', 'last_login')
    fieldsets = (
        (None, {'fields': ('email', 'username', 'name', 'password')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                     'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'name', 'password1', 'password2'),
        }),
    )

@admin.register(AdminLoginLog)
class AdminLoginLogAdmin(admin.ModelAdmin):
    list_display = ('admin', 'ip_address', 'login_at', 'status', 'browser_info')
    list_filter = ('status', 'login_at')
    search_fields = ('admin__email', 'admin__username', 'ip_address')
    ordering = ('-login_at',)
    readonly_fields = ('admin', 'ip_address', 'user_agent', 'login_at', 'status')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def browser_info(self, obj):
        return obj.browser_info
    browser_info.short_description = _('Browser')