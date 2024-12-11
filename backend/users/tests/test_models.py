# users/tests/test_models.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError

User = get_user_model()


class UserModelTests(TestCase):
    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_create_user(self):
        """測試創建用戶"""
        self.assertEqual(self.user.username, self.user_data["username"])
        self.assertEqual(self.user.email, self.user_data["email"])
        self.assertTrue(self.user.check_password(self.user_data["password"]))

    def test_email_unique(self):
        """測試郵箱唯一性"""
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                username="anotheruser",
                email=self.user_data["email"],
                password="anotherpass123",
            )

    def test_user_str_representation(self):
        """測試用戶字符串表示"""
        self.assertEqual(str(self.user), self.user_data["username"])

    def test_timestamps(self):
        """測試時間戳字段"""
        self.assertIsNotNone(self.user.created_at)
        self.assertIsNotNone(self.user.updated_at)
