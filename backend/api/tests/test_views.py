# backend/api/tests/test_views.py
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from api.models import Todo

User = get_user_model()


class TodoViewSetTests(APITestCase):
    def setUp(self):
        """測試準備工作"""
        # 創建測試用戶
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

        # 創建測試數據
        self.todos = [
            Todo.objects.create(user=self.user, title="Test Todo 0", completed=False),
            Todo.objects.create(user=self.user, title="Test Todo 1", completed=True),
            Todo.objects.create(user=self.user, title="Test Todo 2", completed=False),
        ]

        # 設置 URL
        self.list_url = reverse("api:todo-list")
        self.detail_url = reverse("api:todo-detail", args=[self.todos[0].id])

    def test_list_todos(self):
        """測試獲取待辦事項列表"""
        # 測試基本列表
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

        # 測試完成狀態過濾 - 已完成
        response = self.client.get(f"{self.list_url}?completed=true")
        self.assertEqual(len(response.data), 1)
        self.assertTrue(all(todo["completed"] for todo in response.data))

        # 測試完成狀態過濾 - 未完成
        response = self.client.get(f"{self.list_url}?completed=false")
        self.assertEqual(len(response.data), 2)
        self.assertTrue(all(not todo["completed"] for todo in response.data))

        # 測試搜索功能
        response = self.client.get(f"{self.list_url}?search=Todo 1")
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Test Todo 1")

    def test_create_todo(self):
        """測試創建待辦事項"""
        data = {"title": "New Todo", "completed": False}
        response = self.client.post(self.list_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Todo.objects.count(), 4)
        self.assertEqual(response.data["title"], "New Todo")
        self.assertEqual(response.data["user"]["id"], self.user.id)
        self.assertEqual(response.data["user"]["username"], self.user.username)

    def test_retrieve_todo(self):
        """測試獲取單個待辦事項"""
        response = self.client.get(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Test Todo 0")

    def test_update_todo(self):
        """測試更新待辦事項"""
        # 測試部分更新
        response = self.client.patch(self.detail_url, {"completed": True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["completed"])

        # 測試完整更新
        response = self.client.put(
            self.detail_url, {"title": "Updated Todo", "completed": False}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated Todo")
        self.assertFalse(response.data["completed"])

    def test_delete_todo(self):
        """測試刪除待辦事項"""
        response = self.client.delete(self.detail_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Todo.objects.count(), 2)

    def test_unauthorized_access(self):
        """測試未授權訪問"""
        self.client.force_authenticate(user=None)

        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_todo_user_isolation(self):
        """測試用戶數據隔離"""
        # 創建另一個用戶
        other_user = User.objects.create_user(
            username="otheruser", email="other@example.com", password="testpass123"
        )
        self.client.force_authenticate(user=other_user)

        # 測試無法訪問其他用戶的待辦事項
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # 測試只能看到自己的待辦事項
        Todo.objects.create(user=other_user, title="Other User's Todo", completed=False)
        response = self.client.get(self.list_url)
        self.assertEqual(len(response.data), 1)
