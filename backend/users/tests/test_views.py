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
        self.login_url = reverse("users:login")
        self.logout_url = reverse("users:logout")
        self.profile_url = reverse("users:profile")
        self.update_profile_url = reverse("users:update_profile")
        self.change_password_url = reverse("users:change_password")

        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "password2": "testpass123",
        }

        # 創建一個測試用戶
        self.test_user = User.objects.create_user(
            username="existinguser",
            email="existing@example.com",
            password="existing123",
        )

    def test_register_user(self):
        """測試用戶註冊"""
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(User.objects.count(), 2)  # 包含 setUp 中創建的用戶

    def test_register_with_invalid_data(self):
        """測試無效數據註冊"""
        # 測試密碼不匹配
        invalid_data = self.user_data.copy()
        invalid_data["password2"] = "wrongpass"
        response = self.client.post(self.register_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

        # 測試郵箱格式無效
        invalid_data = self.user_data.copy()
        invalid_data["email"] = "invalid-email"
        response = self.client.post(self.register_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

        # 測試密碼太短
        invalid_data = self.user_data.copy()
        invalid_data["password"] = "short"
        invalid_data["password2"] = "short"
        response = self.client.post(self.register_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_register_duplicate_user(self):
        """測試註冊重複用戶"""
        # 測試重複用戶名
        duplicate_data = self.user_data.copy()
        duplicate_data["username"] = "existinguser"
        response = self.client.post(self.register_url, duplicate_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)

        # 測試重複郵箱
        duplicate_data = self.user_data.copy()
        duplicate_data["email"] = "existing@example.com"
        response = self.client.post(self.register_url, duplicate_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_login(self):
        """測試用戶登入"""
        # 測試使用郵箱登入
        login_data = {"email": "existing@example.com", "password": "existing123"}
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

        # 測試使用錯誤密碼登入
        login_data["password"] = "wrongpass"
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout(self):
        """測試用戶登出"""
        refresh = RefreshToken.for_user(self.test_user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        # 測試正常登出
        response = self.client.post(self.logout_url, {"refresh": str(refresh)})
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

        # 測試使用無效的令牌登出
        response = self.client.post(self.logout_url, {"refresh": "invalid-token"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_profile_operations(self):
        """測試用戶資料操作"""
        self.client.force_authenticate(user=self.test_user)

        # 測試獲取資料
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.test_user.email)

        # 測試更新資料
        update_data = {"email": "newemail@example.com", "username": "newusername"}
        response = self.client.patch(self.update_profile_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], update_data["email"])
        self.assertEqual(response.data["username"], update_data["username"])

        # 測試未認證用戶無法訪問
        self.client.force_authenticate(user=None)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_password(self):
        """測試修改密碼"""
        self.client.force_authenticate(user=self.test_user)

        # 測試正常修改密碼
        password_data = {
            "old_password": "existing123",
            "new_password": "newpass123!",
            "new_password2": "newpass123!",
        }
        response = self.client.post(self.change_password_url, password_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 驗證密碼已更改
        self.test_user.refresh_from_db()
        self.assertTrue(self.test_user.check_password(password_data["new_password"]))

        # 測試舊密碼錯誤
        password_data = {
            "old_password": "wrongpass",
            "new_password": "newpass123!",
            "new_password2": "newpass123!",
        }
        response = self.client.post(self.change_password_url, password_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # 測試新密碼不匹配
        password_data = {
            "old_password": "existing123",
            "new_password": "newpass123!",
            "new_password2": "different123!",
        }
        response = self.client.post(self.change_password_url, password_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_token_refresh(self):
        """測試令牌刷新"""
        refresh = RefreshToken.for_user(self.test_user)

        # 測試正常刷新令牌
        response = self.client.post(
            reverse("users:token_refresh"), {"refresh": str(refresh)}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

        # 測試使用無效的刷新令牌
        response = self.client.post(
            reverse("users:token_refresh"), {"refresh": "invalid-token"}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
