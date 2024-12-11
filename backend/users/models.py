# backend/users/models.py
"""用戶模型定義模塊"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """自定義用戶模型

    擴展 Django 的默認用戶模型，添加額外的字段和時間戳
    """

    email = models.EmailField(unique=True, verbose_name="電子郵件")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="創建時間")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新時間")

    groups = models.ManyToManyField(
        "auth.Group", verbose_name="groups", blank=True, related_name="custom_user_set"
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        verbose_name="user permissions",
        blank=True,
        related_name="custom_user_set",
    )

    def __str__(self) -> str:
        """返回用戶的字符串表示"""
        return str(self.username)

    class Meta:
        """模型的元數據"""

        verbose_name = "用戶"
        verbose_name_plural = "用戶"
