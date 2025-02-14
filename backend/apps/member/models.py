from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from typing import Optional
from datetime import datetime

class TypedModel(models.Model):
    """為所有 model 提供類型提示的基礎類"""
    created_at: datetime = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at: datetime = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        abstract = True

class Member(AbstractUser, TypedModel):
    """用戶模型"""
    # 解決反向關係衝突
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name='member_set',  # 修改這裡
        related_query_name='member'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name='member_set',  # 修改這裡
        related_query_name='member'
    )
    
    # 基本資料
    email: str = models.EmailField(
        _('email address'),
        unique=True,
        help_text=_('Required. Must be a valid email address.')
    )
    nickname: str = models.CharField(
        _('nickname'),
        max_length=50,
        blank=True,
        help_text=_('Optional. Max length 50 characters.')
    )
    avatar: Optional[str] = models.ImageField(
        _('avatar'),
        upload_to='avatars/',
        null=True,
        blank=True,
        help_text=_('Optional. User profile picture.')
    )
    bio: str = models.TextField(
        _('biography'),
        max_length=500,
        blank=True,
        help_text=_('Optional. Max length 500 characters.')
    )
    
    # 帳戶狀態
    is_verified: bool = models.BooleanField(
        _('verified'),
        default=False,
        help_text=_('Indicates if the user has verified their email address.')
    )
    last_login_ip: Optional[str] = models.GenericIPAddressField(
        _('last login IP'),
        null=True,
        blank=True,
        help_text=_('The IP address of the last login.')
    )

    USERNAME_FIELD = 'email'  # 使用 email 作為登入帳號
    REQUIRED_FIELDS = ['username']  # username 仍然是必填欄位

    class Meta:
        db_table = 'member'  # 修改表名，更符合慣例
        verbose_name = _('member')
        verbose_name_plural = _('members')
        indexes = [
            models.Index(fields=['email'], name='member_email_idx'),
            models.Index(fields=['username'], name='member_username_idx'),
            models.Index(fields=['created_at'], name='member_created_at_idx'),
        ]

    def __str__(self) -> str:
        return self.email

    @property
    def full_name(self) -> str:
        """返回用戶全名"""
        return f"{self.first_name} {self.last_name}".strip() or self.username

class MemberProfile(TypedModel):
    """用戶檔案模型"""
    # 性別選項
    class Gender(models.TextChoices):
        MALE = 'M', _('Male')
        FEMALE = 'F', _('Female')
        OTHER = 'O', _('Other')
        PREFER_NOT_TO_SAY = 'N', _('Prefer not to say')

    # 關聯
    member: Member = models.OneToOneField(
        Member,
        on_delete=models.CASCADE,
        related_name='profile',
        help_text=_('The member this profile belongs to.')
    )
    
    # 基本資料
    phone: str = models.CharField(
        _('phone number'),
        max_length=20,
        blank=True,
        help_text=_('Optional. Phone number in international format.')
    )
    address: str = models.TextField(
        _('address'),
        blank=True,
        help_text=_('Optional. Full address.')
    )
    birth_date: Optional[datetime] = models.DateField(
        _('birth date'),
        null=True,
        blank=True,
        help_text=_('Optional. Date of birth.')
    )
    gender: str = models.CharField(
        _('gender'),
        max_length=1,
        choices=Gender.choices,
        default=Gender.PREFER_NOT_TO_SAY,
        help_text=_('Optional. Gender identification.')
    )
    
    # 偏好設置
    preferences: dict = models.JSONField(
        _('preferences'),
        default=dict,
        blank=True,
        help_text=_('User preferences stored as JSON.')
    )

    class Meta:
        db_table = 'member_profile'  # 保持一致的命名
        verbose_name = _('member profile')
        verbose_name_plural = _('member profiles')
        indexes = [
            models.Index(fields=['phone'], name='member_profile_phone_idx'),
            models.Index(fields=['gender'], name='member_profile_gender_idx'),
        ]

    def __str__(self) -> str:
        return f"{self.member.email}'s profile"