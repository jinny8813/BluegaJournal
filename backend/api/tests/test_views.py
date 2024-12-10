# backend/api/tests/test_views.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from api.models import Todo

User = get_user_model()

class TodoViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.todo = Todo.objects.create(
            user=self.user,
            title='Test Todo',
            completed=False
        )
        self.list_url = reverse('api:todo-list')
        self.detail_url = reverse('api:todo-detail', args=[self.todo.id])

    def test_create_todo(self):
        """測試創建 Todo"""
        data = {'title': 'New Todo', 'completed': False}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Todo.objects.count(), 2)
        self.assertEqual(response.data['title'], 'New Todo')

    def test_list_todos(self):
        """測試獲取 Todo 列表"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_todo(self):
        """測試獲取單個 Todo"""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Todo')

    def test_update_todo(self):
        """測試更新 Todo"""
        data = {'completed': True}
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['completed'])

    def test_delete_todo(self):
        """測試刪除 Todo"""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Todo.objects.count(), 0)

    def test_unauthorized_access(self):
        """測試未授權訪問"""
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_todo_user_isolation(self):
        """測試用戶只能訪問自己的 Todo"""
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=other_user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)