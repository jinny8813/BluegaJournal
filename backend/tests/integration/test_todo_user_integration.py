# backend/tests/integration/test_todo_user_integration.py
from django.test import TestCase, tag
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from api.models import Todo

User = get_user_model()


@tag("integration")
class TodoUserIntegrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # 創建測試用戶
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.client.force_authenticate(user=self.user)

        # 創建另一個用戶
        self.other_user = User.objects.create_user(
            username="otheruser", email="other@example.com", password="testpass123"
        )

    @tag("integration")
    def test_todo_user_workflow(self):
        """測試完整的 Todo 創建和用戶互動流程"""
        # 1. 創建一個新的 Todo
        create_url = reverse("api:todo-list")
        todo_data = {"title": "Integration Test Todo", "completed": False}
        response = self.client.post(create_url, todo_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        todo_id = response.data["id"]

        # 2. 驗證 Todo 與用戶的關聯
        todo = Todo.objects.get(id=todo_id)
        self.assertEqual(todo.user, self.user)

        # 3. 更新 Todo
        update_url = reverse("api:todo-detail", args=[todo_id])
        update_data = {"completed": True}
        response = self.client.patch(update_url, update_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["completed"])

        # 4. 其他用戶嘗試訪問該 Todo
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(update_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @tag("integration")
    def test_user_todos_isolation(self):
        """測試用戶之間的 Todo 隔離"""
        # 1. 第一個用戶創建 Todo
        self.client.force_authenticate(user=self.user)
        url = reverse("api:todo-list")
        todo_data = {"title": "User 1 Todo", "completed": False}
        self.client.post(url, todo_data)

        # 2. 第二個用戶創建 Todo
        self.client.force_authenticate(user=self.other_user)
        todo_data = {"title": "User 2 Todo", "completed": False}
        self.client.post(url, todo_data)

        # 3. 驗證第一個用戶只能看到自己的 Todo
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "User 1 Todo")

        # 4. 驗證第二個用戶只能看到自己的 Todo
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(url)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "User 2 Todo")


@tag("integration")
class UserAuthenticationIntegrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "testpass123",
            "password2": "testpass123",
        }

    @tag("integration")
    def test_user_registration_login_todo_workflow(self):
        """測試用戶註冊、登錄和創建 Todo 的完整流程"""
        # 1. 註冊新用戶
        register_url = reverse("users:register")
        response = self.client.post(register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # 獲取訪問令牌
        access_token = response.data["access"]

        # 2. 使用令牌創建 Todo
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        todo_url = reverse("api:todo-list")
        todo_data = {"title": "First Todo After Registration", "completed": False}
        response = self.client.post(todo_url, todo_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], todo_data["title"])

        # 3. 獲取用戶的 Todo 列表
        response = self.client.get(todo_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    @tag("integration")
    def test_user_profile_todo_integration(self):
        """測試用戶資料更新和 Todo 管理的集成"""
        # 1. 註冊用戶
        register_url = reverse("users:register")
        response = self.client.post(register_url, self.user_data)
        access_token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        # 2. 更新用戶資料
        update_url = reverse("users:update_profile")
        update_data = {"email": "updated@example.com"}
        response = self.client.patch(update_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 3. 創建多個 Todo
        todo_url = reverse("api:todo-list")
        todos = [{"title": f"Todo {i}", "completed": False} for i in range(3)]

        for todo in todos:
            response = self.client.post(todo_url, todo)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # 4. 驗證所有 Todo 都與更新後的用戶關聯
        response = self.client.get(todo_url)
        self.assertEqual(len(response.data), 3)
