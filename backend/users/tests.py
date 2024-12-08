# backend/users/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, RegisterSerializer, UpdateUserSerializer, ChangePasswordSerializer

User = get_user_model()

class UserSerializerTests(TestCase):
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
        }
        self.user = User.objects.create_user(
            **self.user_data,
            password='testpass123'
        )
        
    def test_user_serializer(self):
        """測試 UserSerializer"""
        serializer = UserSerializer(self.user)
        self.assertEqual(set(serializer.data.keys()), set(['id', 'username', 'email']))
        self.assertEqual(serializer.data['username'], self.user_data['username'])
        self.assertEqual(serializer.data['email'], self.user_data['email'])

class RegisterSerializerTests(TestCase):
    def setUp(self):
        self.valid_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'StrongPass123!',
            'password2': 'StrongPass123!'
        }

    def test_valid_registration(self):
        """測試有效的註冊數據"""
        serializer = RegisterSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())

    def test_password_mismatch(self):
        """測試密碼不匹配"""
        invalid_data = self.valid_data.copy()
        invalid_data['password2'] = 'DifferentPass123!'
        serializer = RegisterSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)

class UpdateUserSerializerTests(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='pass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='pass123'
        )
        # 創建一個模擬的 request 對象
        self.request = type('Request', (), {'user': self.user1})

    def test_validate_duplicate_email(self):
        """測試重複的電子郵件"""
        context = {'request': self.request}
        serializer = UpdateUserSerializer(
            self.user1,
            data={'email': 'user2@example.com'},
            context=context
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_validate_duplicate_username(self):
        """測試重複的用戶名"""
        context = {'request': self.request}
        serializer = UpdateUserSerializer(
            self.user1,
            data={'username': 'user2'},
            context=context
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn('username', serializer.errors)

class UserAPITests(APITestCase):
    def setUp(self):
        """每個測試前的初始化"""
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password2': 'testpass123'
        }
        self.user = User.objects.create_user(
            username='existinguser',
            email='existing@example.com',
            password='existingpass123'
        )

    def test_register_success(self):
        """測試成功註冊新用戶"""
        url = reverse('users:register')
        response = self.client.post(url, self.user_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['user']['username'], self.user_data['username'])
        self.assertEqual(response.data['user']['email'], self.user_data['email'])

    def test_register_with_invalid_data(self):
        """測試使用無效數據註冊"""
        url = reverse('users:register')
        invalid_data = self.user_data.copy()
        invalid_data['password2'] = 'wrongpass'  # 密碼不匹配
        response = self.client.post(url, invalid_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_existing_username(self):
        """測試使用已存在的用戶名註冊"""
        url = reverse('users:register')
        data = self.user_data.copy()
        data['username'] = 'existinguser'
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout_success(self):
        """測試成功登出"""
        self.client.force_authenticate(user=self.user)
        refresh = RefreshToken.for_user(self.user)
        url = reverse('users:logout')
        response = self.client.post(url, {'refresh': str(refresh)}, format='json')

        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    def test_logout_without_token(self):
        """測試沒有token的登出請求"""
        self.client.force_authenticate(user=self.user)
        url = reverse('users:logout')
        response = self.client.post(url, {}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_profile_success(self):
        """測試成功更新用戶資料"""
        self.client.force_authenticate(user=self.user)
        url = reverse('users:update_profile')
        update_data = {
            'email': 'newemail@example.com',
            'username': 'newusername'
        }
        response = self.client.patch(url, update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], update_data['email'])
        self.assertEqual(response.data['username'], update_data['username'])

    def test_update_profile_unauthenticated(self):
        """測試未認證用戶更新資料"""
        url = reverse('users:update_profile')
        update_data = {'email': 'newemail@example.com'}
        response = self.client.patch(url, update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_password_success(self):
        """測試成功修改密碼"""
        self.client.force_authenticate(user=self.user)
        url = reverse('users:change_password')
        password_data = {
            'old_password': 'existingpass123',
            'new_password': 'NewStrongPass123!',
            'new_password2': 'NewStrongPass123!'
        }
        response = self.client.post(url, password_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

    def test_change_password_wrong_old_password(self):
        """測試使用錯誤的舊密碼"""
        self.client.force_authenticate(user=self.user)
        url = reverse('users:change_password')
        password_data = {
            'old_password': 'wrongpass',
            'new_password': 'newpass123',
            'new_password2': 'newpass123'
        }
        response = self.client.post(url, password_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_change_password_unauthenticated(self):
        """測試未認證用戶修改密碼"""
        url = reverse('users:change_password')
        password_data = {
            'old_password': 'existingpass123',
            'new_password': 'newpass123',
            'new_password2': 'newpass123'
        }
        response = self.client.post(url, password_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_profile_invalid_email(self):
        """測試使用無效的電子郵件更新資料"""
        self.client.force_authenticate(user=self.user)
        url = reverse('users:update_profile')
        update_data = {'email': 'invalid-email'}
        response = self.client.patch(url, update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_short_password(self):
        """測試使用過短的密碼註冊"""
        url = reverse('users:register')
        data = self.user_data.copy()
        data['password'] = data['password2'] = '123'  # 過短的密碼
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_invalid_email(self):
        """測試使用無效的電子郵件註冊"""
        url = reverse('users:register')
        data = self.user_data.copy()
        data['email'] = 'invalid-email'
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password_validation(self):
        """測試密碼驗證"""
        self.client.force_authenticate(user=self.user)
        url = reverse('users:change_password')
        password_data = {
            'old_password': 'existingpass123',
            'new_password': '123',  # 太短的密碼
            'new_password2': '123'
        }
        response = self.client.post(url, password_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_profile_duplicate_email(self):
        """測試更新時使用重複的電子郵件"""
        # 創建另一個用戶
        User.objects.create_user(
            username='anotheruser',
            email='another@example.com',
            password='pass123'
        )
        
        self.client.force_authenticate(user=self.user)
        url = reverse('users:update_profile')
        update_data = {'email': 'another@example.com'}
        response = self.client.patch(url, update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_update_profile_duplicate_username(self):
        """測試更新時使用重複的用戶名"""
        # 創建另一個用戶
        User.objects.create_user(
            username='anotheruser',
            email='another@example.com',
            password='pass123'
        )
        
        self.client.force_authenticate(user=self.user)
        url = reverse('users:update_profile')
        update_data = {'username': 'anotheruser'}
        response = self.client.patch(url, update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
    
    def test_update_profile_unauthenticated(self):
        """測試未認證用戶更新資料"""
        url = reverse('users:update_profile')
        update_data = {'email': 'newemail@example.com'}
        response = self.client.patch(url, update_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
