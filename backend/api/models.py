# backend/api/models.py
"""Todo 應用的模型定義"""
from django.conf import settings
from django.db import models


class Todo(models.Model):
    """待辦事項模型

    用於存儲用戶的待辦事項，包含標題、完成狀態等信息
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="todos",
        help_text="待辦事項的創建者",
    )
    title = models.CharField(max_length=200, help_text="待辦事項標題")
    completed = models.BooleanField(default=False, help_text="完成狀態")
    created_at = models.DateTimeField(auto_now_add=True, help_text="創建時間")
    updated_at = models.DateTimeField(auto_now=True, help_text="更新時間")

    class Meta:
        """模型配置"""

        ordering = ["-created_at"]
        verbose_name = "待辦事項"
        verbose_name_plural = "待辦事項列表"

    def __str__(self) -> str:
        """返回待辦事項的字符串表示"""
        return str(self.title)
