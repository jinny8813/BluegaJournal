# backend/api/models.py
"""API 應用的數據模型定義"""
from django.conf import settings
from django.db import models


class Todo(models.Model):
    """待辦事項模型

    用於存儲用戶的待辦事項，包含標題、完成狀態和時間戳等信息
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="todos",
        verbose_name="用戶",
    )
    title = models.CharField(max_length=200, verbose_name="標題")
    completed = models.BooleanField(default=False, verbose_name="是否完成")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="創建時間")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新時間")

    class Meta:
        """模型的元數據"""

        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
        ]
        permissions = [
            ("view_own_todo", "Can view own todo"),
        ]
        verbose_name = "待辦事項"
        verbose_name_plural = "待辦事項"

    def __str__(self) -> str:
        """返回待辦事項的字符串表示"""
        return str(f"{self.title} (by {self.user.username})")

    def save(self, *args, **kwargs) -> None:
        """保存模型實例

        可以在這裡添加額外的保存邏輯
        """
        super().save(*args, **kwargs)
