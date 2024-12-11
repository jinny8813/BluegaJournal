# users/tests/test_views.py
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class AuthViewsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse("users:register")
        self.logout_url = reverse("users:logout")
        self.update_profile_url = reverse("users:update_profile")
        self.change_password_url = reverse("users:change_password")

        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "password2": "testpass123",
        }

    def test_register_user(self):
        """測試用戶註冊"""
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(User.objects.count(), 1)

    def test_register_with_invalid_data(self):
        """測試無效數據註冊"""
        invalid_data = self.user_data.copy()
        invalid_data["password2"] = "wrongpass"
        response = self.client.post(self.register_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout(self):
        """測試用戶登出"""
        # 創建用戶並獲取令牌
        user = User.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"],
        )
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        response = self.client.post(self.logout_url, {"refresh": str(refresh)})
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    def test_update_profile(self):
        """測試更新用戶資料"""
        user = User.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"],
        )
        self.client.force_authenticate(user=user)

        update_data = {"email": "newemail@example.com"}
        response = self.client.patch(self.update_profile_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], update_data["email"])

    def test_change_password(self):
        """測試修改密碼"""
        user = User.objects.create_user(
            username=self.user_data["username"],
            email=self.user_data["email"],
            password=self.user_data["password"],
        )
        self.client.force_authenticate(user=user)

        password_data = {
            "old_password": self.user_data["password"],
            "new_password": "newpass123!",
            "new_password2": "newpass123!",
        }
        response = self.client.post(self.change_password_url, password_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 驗證密碼已更改
        user.refresh_from_db()
        self.assertTrue(user.check_password(password_data["new_password"]))
