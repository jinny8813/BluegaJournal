from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import Member, MemberProfile


@admin.register(Member)
class MemberAdmin(UserAdmin):
    list_display = ('email', 'username', 'nickname', 'is_active', 'is_staff', 'created_at')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'groups')
    search_fields = ('email', 'username', 'nickname', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {
            'fields': ('username', 'nickname', 'first_name', 'last_name', 'avatar', 'bio')
        }),
        (_('Status'), {
            'fields': ('is_active', 'is_verified', 'last_login_ip')
        }),
        (_('Permissions'), {
            'fields': ('is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')
        }),
    )
    readonly_fields = ('created_at', 'updated_at', 'last_login', 'date_joined')
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )


@admin.register(MemberProfile)
class MemberProfileAdmin(admin.ModelAdmin):
    list_display = ('member', 'phone', 'gender', 'birth_date', 'created_at')
    list_filter = ('gender',)
    search_fields = ('member__email', 'phone', 'address')
    ordering = ('-created_at',)
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('member', 'phone', 'address')
        }),
        (_('Personal Details'), {
            'fields': ('birth_date', 'gender')
        }),
        (_('Preferences'), {
            'fields': ('preferences',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')