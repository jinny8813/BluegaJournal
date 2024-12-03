from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Todo

class TodoViewsTest(APITestCase):
    def setUp(self):
        self.todo = Todo.objects.create(
            title="Test Todo",
            completed=False
        )
        self.url = '/api/todos/'  # 使用實際的URL路徑

    def test_create_todo(self):
        """Test creating a new todo"""
        data = {'title': 'New Todo'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Todo.objects.count(), 2)
        self.assertEqual(Todo.objects.get(title='New Todo').title, 'New Todo')

    def test_list_todos(self):
        """Test listing all todos"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_single_todo(self):
        """Test retrieving a single todo"""
        response = self.client.get(f'{self.url}{self.todo.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Todo')

    def test_update_todo(self):
        """Test updating a todo"""
        data = {'title': 'Updated Todo', 'completed': True}
        response = self.client.put(f'{self.url}{self.todo.id}/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.todo.refresh_from_db()
        self.assertEqual(self.todo.title, 'Updated Todo')
        self.assertTrue(self.todo.completed)

    def test_delete_todo(self):
        """Test deleting a todo"""
        response = self.client.delete(f'{self.url}{self.todo.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Todo.objects.count(), 0)