# backend/users/models.py
"""用戶模型定義模塊"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """自定義用戶模型"""

    class UserType(models.TextChoices):
        """用戶類型選項"""

        REGULAR = "regular", _("Regular User")
        PREMIUM = "premium", _("Premium User")
        ADMIN = "admin", _("Admin User")

    email = models.EmailField(
        _("email address"),
        unique=True,
        error_messages={
            "unique": _("A user with that email already exists."),
        },
    )
    user_type = models.CharField(
        _("user type"),
        max_length=20,
        choices=UserType.choices,
        default=UserType.REGULAR,
        null=True,  # 添加這個使其向後兼容
        blank=True,  # 添加這個使其向後兼容
    )
    phone = models.CharField(_("phone number"), max_length=20, blank=True, null=True)
    avatar = models.ImageField(_("avatar"), upload_to="avatars/", blank=True, null=True)
    bio = models.TextField(_("biography"), max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("updated at"), auto_now=True)
    last_active = models.DateTimeField(_("last active"), null=True, blank=True)

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.email} ({self.get_user_type_display()})"
