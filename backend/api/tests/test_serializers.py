# backend/api/tests/test_serializers.py
from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIRequestFactory

from api.models import Todo
from api.serializers import TodoSerializer

User = get_user_model()


class TodoSerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.todo = Todo.objects.create(
            user=self.user, title="Test Todo", completed=False
        )
        self.serializer = TodoSerializer(instance=self.todo)

    def test_contains_expected_fields(self):
        """測試序列化器包含預期的字段"""
        data = self.serializer.data
        self.assertCountEqual(
            data.keys(),
            ["id", "user", "title", "completed", "created_at", "updated_at"],
        )

    def test_user_field_content(self):
        """測試用戶字段的內容"""
        data = self.serializer.data
        self.assertEqual(data["user"]["username"], self.user.username)

    def test_title_field_content(self):
        """測試標題字段的內容"""
        data = self.serializer.data
        self.assertEqual(data["title"], "Test Todo")

    def test_completed_field_content(self):
        """測試完成狀態字段的內容"""
        data = self.serializer.data
        self.assertEqual(data["completed"], False)

    def test_validate_empty_title(self):
        """測試空標題驗證"""
        serializer = TodoSerializer(data={"title": ""})
        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)

    def test_validate_long_title(self):
        """測試過長標題驗證"""
        serializer = TodoSerializer(data={"title": "a" * 201})  # 超過 200 字符
        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)

    def test_create_todo_with_valid_data(self):
        """測試使用有效數據創建 Todo"""
        valid_data = {"title": "New Todo", "completed": False, "user": self.user.id}
        serializer = TodoSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())
