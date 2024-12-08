# backend/api/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Todo

User = get_user_model()

class TodoUserSerializer(serializers.ModelSerializer):
    """用於嵌套在 TodoSerializer 中顯示用戶信息"""
    class Meta:
        model = User
        fields = ['id', 'username']

class TodoSerializer(serializers.ModelSerializer):
    user = TodoUserSerializer(read_only=True)  # 添加這行
    
    class Meta:
        model = Todo
        fields = ['id', 'user', 'title', 'completed', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']