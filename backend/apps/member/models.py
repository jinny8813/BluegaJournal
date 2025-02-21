from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class MemberManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email 必須提供')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, password, **extra_fields)

class Member(AbstractBaseUser, PermissionsMixin):
    """會員基本資料"""
    email = models.EmailField(unique=True, verbose_name='電子信箱')
    is_active = models.BooleanField(default=True, verbose_name='啟用狀態')
    is_staff = models.BooleanField(default=False, verbose_name='職員狀態')
    date_joined = models.DateTimeField(default=timezone.now, verbose_name='註冊時間')
    last_login = models.DateTimeField(null=True, blank=True, verbose_name='最後登入時間')
    
    objects = MemberManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    class Meta:
        verbose_name = '會員'
        verbose_name_plural = '會員'
        
    def __str__(self):
        return self.email

class MemberProfile(models.Model):
    """會員個人資料"""
    GENDER_CHOICES = (
        ('M', '男'),
        ('F', '女'),
        ('O', '其他'),
    )
    
    member = models.OneToOneField(
        Member, 
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name='會員'
    )
    name = models.CharField(max_length=50, blank=True, verbose_name='姓名')
    nickname = models.CharField(max_length=50, blank=True, verbose_name='暱稱')
    phone = models.CharField(max_length=20, blank=True, verbose_name='電話')
    gender = models.CharField(
        max_length=1, 
        choices=GENDER_CHOICES,
        blank=True,
        verbose_name='性別'
    )
    birthday = models.DateField(null=True, blank=True, verbose_name='生日')
    address = models.CharField(max_length=200, blank=True, verbose_name='地址')
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True,
        verbose_name='頭像'
    )
    
    class Meta:
        verbose_name = '會員資料'
        verbose_name_plural = '會員資料'
        
    def __str__(self):
        return f"{self.member.email}的個人資料"

# 在檔案最底部添加
@receiver(post_save, sender=Member)
def create_or_update_member_profile(sender, instance, created, **kwargs):
    """當 Member 被創建時自動建立 Profile"""
    if created:
        MemberProfile.objects.create(member=instance)