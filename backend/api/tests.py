# backend/api/tests.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from .models import Todo

User = get_user_model()

class TodoTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        """初始化測試數據（只運行一次）"""
        cls.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass'
        )
        cls.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpass'
        )
        cls.todo_data = {'title': 'Test Todo', 'completed': False}
        cls.todo = Todo.objects.create(user=cls.user, **cls.todo_data)

    def setUp(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_todo_with_user(self):
        """測試創建的 Todo 包含正確的用戶信息"""
        url = reverse('api:todo-list')
        data = {'title': 'New Todo', 'completed': False}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['username'], self.user.username)
        self.assertEqual(Todo.objects.last().user, self.user)

    def test_get_todo_with_user(self):
        """測試獲取的 Todo 包含用戶信息"""
        url = reverse('api:todo-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['user']['username'], self.user.username)

    def test_user_can_only_access_own_todos(self):
        """測試用戶只能訪問自己的 Todo"""
        # 創建其他用戶的 Todo
        other_todo = Todo.objects.create(
            user=self.other_user,
            title='Other User Todo'
        )

        # 嘗試訪問其他用戶的 Todo
        url = reverse('api:todo-detail', args=[other_todo.pk])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_only_shows_user_todos(self):
        """測試列表只顯示當前用戶的 Todo"""
        # 創建其他用戶的 Todo
        Todo.objects.create(
            user=self.other_user,
            title='Other User Todo'
        )

        url = reverse('api:todo-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # 只應該看到自己的一個 Todo
        self.assertEqual(response.data[0]['user']['username'], self.user.username)