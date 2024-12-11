# backend/api/tests/test_models.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from api.models import Todo

User = get_user_model()


class TodoModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.todo = Todo.objects.create(
            user=self.user, title="Test Todo", completed=False
        )

    def test_todo_creation(self):
        """測試 Todo 創建"""
        self.assertEqual(self.todo.title, "Test Todo")
        self.assertEqual(self.todo.user, self.user)
        self.assertFalse(self.todo.completed)

    def test_todo_ordering(self):
        """測試 Todo 的排序"""
        Todo.objects.create(user=self.user, title="Another Todo", completed=True)
        todos = Todo.objects.all()
        self.assertEqual(todos[0].title, "Another Todo")  # 因為是按 created_at 降序排序

    def test_todo_user_cascade_delete(self):
        """測試刪除用戶時級聯刪除 Todo"""
        self.user.delete()
        self.assertEqual(Todo.objects.count(), 0)
