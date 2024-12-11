# backend/api/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Todo

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class TodoSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Todo
        fields = [
            "id",
            "title",
            "completed",
            "user",
            "user_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
