# backend/users/serializers.py
"""用戶相關序列化器模塊"""
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """基本用戶信息序列化器"""

    class Meta:
        """序列化器配置"""

        model = User
        fields = ("id", "username", "email")


class RegisterSerializer(serializers.ModelSerializer):
    """用戶註冊序列化器"""

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        """序列化器配置"""

        model = User
        fields = ("username", "password", "password2", "email")

    def validate(self, attrs):
        """驗證密碼匹配"""
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        """創建新用戶"""
        validated_data.pop("password2")
        user = User.objects.create_user(**validated_data)
        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    """用戶資料更新序列化器"""

    class Meta:
        """序列化器配置"""

        model = User
        fields = ("username", "email")
        extra_kwargs = {"username": {"required": False}, "email": {"required": False}}

    def validate_email(self, value):
        """驗證電子郵件唯一性"""
        user = self.context["request"].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_username(self, value):
        """驗證用戶名唯一性"""
        user = self.context["request"].user
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("This username is already in use.")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    """密碼更改序列化器"""

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        """驗證新密碼匹配"""
        if attrs["new_password"] != attrs["new_password2"]:
            raise serializers.ValidationError(
                {"new_password": "Password fields didn't match."}
            )
        return attrs
