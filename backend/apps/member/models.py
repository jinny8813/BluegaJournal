from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.validators import RegexValidator
from .managers import MemberManager

class Member(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    name = models.CharField(_('name'), max_length=150)
    avatar = models.ImageField(_('avatar'), upload_to='avatars/', null=True, blank=True)
    is_active = models.BooleanField(_('active'), default=True)
    is_verified = models.BooleanField(_('verified'), default=False)
    is_staff = models.BooleanField(_('staff status'), default=False)
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    last_login = models.DateTimeField(_('last login'), null=True, blank=True)
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        related_name='member_set'  # 添加這個
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        related_name='member_set'  # 添加這個
    )

    objects = MemberManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        verbose_name = _('member')
        verbose_name_plural = _('members')

    def __str__(self):
        return self.email

class MemberProfile(models.Model):
    member = models.OneToOneField(
        Member, 
        on_delete=models.CASCADE, 
        related_name='profile',
        verbose_name=_('member')
    )
    bio = models.TextField(
        _('bio'), 
        max_length=500,
        blank=True
    )
    birth_date = models.DateField(
        _('birth date'), 
        null=True, 
        blank=True
    )
    phone = models.CharField(
        _('phone number'), 
        max_length=20, 
        blank=True,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message=_("Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
            )
        ]
    )
    address = models.TextField(
        _('address'), 
        max_length=200,
        blank=True
    )

    class Meta:
        verbose_name = _('member profile')
        verbose_name_plural = _('member profiles')