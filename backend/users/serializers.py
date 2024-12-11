# backend/users/serializers.py
"""用戶序列化器模塊"""
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """自定義令牌序列化器"""

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user_type"] = self.user.get_user_type_display()
        data["username"] = self.user.username
        return data


class UserSerializer(serializers.ModelSerializer):
    """用戶序列化器"""

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "user_type",
            "phone",
            "avatar",
            "bio",
            "created_at",
        )
        read_only_fields = ("created_at",)


class RegisterSerializer(serializers.ModelSerializer):
    """註冊序列化器"""

    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("email", "username", "password", "password2", "phone", "user_type")

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User.objects.create_user(**validated_data)
        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("email",)

    def validate_email(self, value):
        user = self.context["request"].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("此郵箱已被使用")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)

    def validate(self, data):
        if data["new_password"] != data["new_password2"]:
            raise serializers.ValidationError({"new_password": "新密碼不匹配"})
        return data

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("舊密碼不正確")
        return value
