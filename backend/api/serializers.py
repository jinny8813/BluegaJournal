# backend/api/serializers.py
"""API 序列化器定義"""
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Todo

User = get_user_model()


class TodoUserSerializer(serializers.ModelSerializer):
    """用戶序列化器

    用於在待辦事項中顯示用戶信息的嵌套序列化器
    """

    class Meta:
        """序列化器配置"""

        model = User
        fields = ["id", "username"]


class TodoSerializer(serializers.ModelSerializer):
    """待辦事項序列化器

    處理待辦事項的序列化和反序列化
    """

    user = TodoUserSerializer(read_only=True)

    class Meta:
        """序列化器配置"""

        model = Todo
        fields = ["id", "user", "title", "completed", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]
