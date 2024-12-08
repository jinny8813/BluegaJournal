# backend/api/models.py
from django.db import models
from django.conf import settings

class Todo(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='todos'
    )
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        # 可以添加索引
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]
        # 可以添加權限
        permissions = [
            ("view_own_todo", "Can view own todo"),
        ]

    def __str__(self):
        return f"{self.title} (by {self.user.username})"

    def save(self, *args, **kwargs):
        # 可以在這裡添加額外的保存邏輯
        super().save(*args, **kwargs)