from django.db import models
from django.contrib.auth.models import Permission
from apps.member.models import Member
from django.utils import timezone

class AdminRole(models.Model):
    """管理員角色"""
    ROLE_CHOICES = (
        ('superadmin', '超級管理員'),
        ('level_1', '一級管理員'),
        ('level_2', '二級管理員'),
        ('level_3', '三級管理員'),
    )
    
    name = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        unique=True,
        verbose_name='角色名稱'
    )
    description = models.TextField(
        blank=True,
        verbose_name='角色描述'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='創建時間'
    )
    
    class Meta:
        verbose_name = '管理員角色'
        verbose_name_plural = '管理員角色'
        
    def __str__(self):
        return self.get_name_display()

class AdminPermission(models.Model):
    """管理員權限項目"""
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='權限名稱'
    )
    codename = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='權限代碼'
    )
    description = models.TextField(
        blank=True,
        verbose_name='權限描述'
    )
    module = models.CharField(
        max_length=50,
        verbose_name='所屬模組'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='啟用狀態'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='創建時間'
    )
    
    class Meta:
        verbose_name = '權限項目'
        verbose_name_plural = '權限項目'
        ordering = ['module', 'codename']
        
    def __str__(self):
        return f"{self.module} - {self.name}"

class RolePermission(models.Model):
    """角色權限關聯"""
    role = models.ForeignKey(
        AdminRole,
        on_delete=models.CASCADE,
        related_name='role_permissions',
        verbose_name='角色'
    )
    permission = models.ForeignKey(
        AdminPermission,
        on_delete=models.CASCADE,
        verbose_name='權限'
    )
    
    class Meta:
        verbose_name = '角色權限'
        verbose_name_plural = '角色權限'
        unique_together = ('role', 'permission')

class AdminUser(Member):
    """管理員用戶"""
    role = models.ForeignKey(
        AdminRole,
        on_delete=models.PROTECT,
        related_name='admin_users',
        verbose_name='管理員角色'
    )
    department = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='部門'
    )
    position = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='職位'
    )
    note = models.TextField(
        blank=True,
        verbose_name='備註'
    )
    
    class Meta:
        verbose_name = '管理員'
        verbose_name_plural = '管理員'
        
    def __str__(self):
        return f"{self.email} ({self.role.get_name_display()})"
    
    def has_permission(self, permission_codename):
        """檢查是否有特定權限"""
        if self.role.name == 'superadmin':
            return True
        return RolePermission.objects.filter(
            role=self.role,
            permission__codename=permission_codename,
            permission__is_active=True
        ).exists()

class AdminLog(models.Model):
    """管理員操作記錄"""
    ACTION_CHOICES = (
        ('CREATE', '創建'),
        ('UPDATE', '更新'),
        ('DELETE', '刪除'),
        ('LOGIN', '登入'),
        ('LOGOUT', '登出'),
        ('OTHER', '其他'),
    )
    
    admin = models.ForeignKey(
        AdminUser,
        on_delete=models.CASCADE,
        related_name='logs',
        verbose_name='管理員'
    )
    action = models.CharField(
        max_length=10,
        choices=ACTION_CHOICES,
        verbose_name='操作類型'
    )
    target_model = models.CharField(
        max_length=50,
        verbose_name='目標模型'
    )
    target_id = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='目標ID'
    )
    description = models.TextField(
        blank=True,
        verbose_name='操作描述'
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name='IP地址'
    )
    created_at = models.DateTimeField(
        default=timezone.now,
        verbose_name='操作時間'
    )
    
    class Meta:
        verbose_name = '管理記錄'
        verbose_name_plural = '管理記錄'
        ordering = ['-created_at']
