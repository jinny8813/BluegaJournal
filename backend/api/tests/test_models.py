from django.test import TestCase
from api.models import Todo

class TodoModelTest(TestCase):
    def setUp(self):
        self.todo = Todo.objects.create(
            title="Test Todo",
            completed=False
        )

    def test_todo_creation(self):
        """Test todo model creation"""
        self.assertEqual(self.todo.title, "Test Todo")
        self.assertFalse(self.todo.completed)
        self.assertIsNotNone(self.todo.created_at)

    def test_todo_str_method(self):
        """Test todo string representation"""
        self.assertEqual(str(self.todo), "Test Todo")