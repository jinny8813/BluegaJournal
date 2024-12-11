# backend/api/serializers.py
"""Todo 應用的序列化器定義"""
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Todo

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """用戶序列化器"""

    class Meta:
        """序列化器配置"""

        model = User
        fields = ["id", "username"]


class TodoSerializer(serializers.ModelSerializer):
    """待辦事項序列化器"""

    user = UserSerializer(read_only=True)

    class Meta:
        """序列化器配置"""

        model = Todo
        fields = ["id", "title", "completed", "user", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]
