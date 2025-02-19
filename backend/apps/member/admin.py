from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Member, MemberProfile

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_active', 'is_verified', 'date_joined', 'last_login')
    list_filter = ('is_active', 'is_verified', 'date_joined', 'last_login')
    search_fields = ('email', 'name')
    ordering = ('-date_joined',)
    readonly_fields = ('date_joined', 'last_login')
    
    fieldsets = (
        (None, {'fields': ('email', 'name', 'password')}),
        (_('Profile'), {'fields': ('avatar',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_verified')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2'),
        }),
    )

    def get_fieldsets(self, request, obj=None):
        if not obj:
            return self.add_fieldsets
        return super().get_fieldsets(request, obj)

@admin.register(MemberProfile)
class MemberProfileAdmin(admin.ModelAdmin):
    list_display = ('member', 'phone', 'birth_date', 'address')
    list_filter = ('birth_date',)
    search_fields = ('member__email', 'phone', 'address')
    ordering = ('-id',)
    readonly_fields = ('member',)
    
    fieldsets = (
        (_('Basic Info'), {
            'fields': ('member', 'bio')
        }),
        (_('Contact Info'), {
            'fields': ('phone', 'address')
        }),
        (_('Personal Info'), {
            'fields': ('birth_date',)
        }),
    )

    def has_add_permission(self, request):
        return False  # 禁止直接添加 Profile，應該通過 Member 創建時自動生成

    def has_delete_permission(self, request, obj=None):
        return False  # 禁止刪除 Profile，應該通過刪除 Member 時自動刪除