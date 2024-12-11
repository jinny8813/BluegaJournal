# users/tests/test_serializers.py
from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIRequestFactory

from users.serializers import (ChangePasswordSerializer, RegisterSerializer,
                               UpdateUserSerializer, UserSerializer)

User = get_user_model()


class UserSerializerTests(TestCase):
    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
        }
        self.user = User.objects.create_user(**self.user_data)
        self.serializer = UserSerializer(instance=self.user)

    def test_contains_expected_fields(self):
        """測試序列化器包含預期的字段"""
        data = self.serializer.data
        self.assertCountEqual(data.keys(), ["id", "username", "email"])


class RegisterSerializerTests(TestCase):
    def setUp(self):
        self.valid_data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpass123!",
            "password2": "newpass123!",
        }

    def test_valid_registration(self):
        """測試有效的註冊數據"""
        serializer = RegisterSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())

    def test_password_mismatch(self):
        """測試密碼不匹配"""
        invalid_data = self.valid_data.copy()
        invalid_data["password2"] = "wrongpass"
        serializer = RegisterSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)

    def test_create_user(self):
        """測試創建用戶"""
        serializer = RegisterSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.username, self.valid_data["username"])
        self.assertEqual(user.email, self.valid_data["email"])


class UpdateUserSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.factory = APIRequestFactory()
        self.request = self.factory.get("/")
        self.request.user = self.user

    def test_validate_email_unique(self):
        """測試郵箱唯一性驗證"""
        User.objects.create_user(
            username="another", email="another@example.com", password="testpass123"
        )
        serializer = UpdateUserSerializer(
            self.user,
            data={"email": "another@example.com"},
            context={"request": self.request},
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)


class ChangePasswordSerializerTests(TestCase):
    def setUp(self):
        self.valid_data = {
            "old_password": "oldpass123",
            "new_password": "newpass123!",
            "new_password2": "newpass123!",
        }

    def test_passwords_match(self):
        """測試新密碼匹配"""
        serializer = ChangePasswordSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())

    def test_passwords_mismatch(self):
        """測試新密碼不匹配"""
        invalid_data = self.valid_data.copy()
        invalid_data["new_password2"] = "wrongpass"
        serializer = ChangePasswordSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
