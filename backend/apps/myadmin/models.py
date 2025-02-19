from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .managers import AdminManager

class Admin(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(_('username'), max_length=150, unique=True)
    name = models.CharField(_('name'), max_length=150)
    is_active = models.BooleanField(_('active'), default=True)
    is_staff = models.BooleanField(_('staff status'), default=True)
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    last_login = models.DateTimeField(_('last login'), null=True)
    avatar = models.ImageField(_('avatar'), upload_to='admin/avatars/', null=True, blank=True)
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        related_name='admin_set'  # 添加這個
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        related_name='admin_set'  # 添加這個
    )

    objects = AdminManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']

    class Meta:
        verbose_name = _('admin')
        verbose_name_plural = _('admins')

    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """
        返回管理員全名
        """
        return self.name

    def get_short_name(self):
        """
        返回管理員簡稱
        """
        return self.username

    def has_module_perms(self, app_label):
        """
        判斷是否有某個應用的權限
        """
        return self.is_active and (self.is_staff or self.is_superuser)

    def has_perm(self, perm, obj=None):
        """
        判斷是否有某個特定權限
        """
        return self.is_active and (self.is_staff or self.is_superuser)
    
    @property
    def login_count(self):
        """
        獲取登入次數
        """
        return self.login_logs.filter(status='success').count()

    @property
    def last_login_ip(self):
        """
        獲取最後登入IP
        """
        last_log = self.login_logs.filter(status='success').first()
        return last_log.ip_address if last_log else None

class AdminLoginLog(models.Model):
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, related_name='login_logs')
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    login_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20)  # success, failed
    
    class Meta:
        ordering = ['-login_at']

    def __str__(self):
        return f"{self.admin.email} - {self.login_at}"

    @property
    def masked_ip(self):
        """
        返回遮罩後的IP地址
        """
        from .utils import mask_ip
        return mask_ip(self.ip_address)

    @property
    def browser_info(self):
        """
        返回簡化的瀏覽器信息
        """
        import re
        if self.user_agent:
            browser = re.search(r'(Chrome|Firefox|Safari|Edge|MSIE|Opera)[/\s]([0-9.]+)', self.user_agent)
            if browser:
                return f"{browser.group(1)} {browser.group(2)}"
        return "Unknown Browser"