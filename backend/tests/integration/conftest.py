# backend/api/tests/conftest.py
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from api.models import Todo

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def test_user():
    user = User.objects.create_user(
        username="testuser", email="test@example.com", password="testpass123"
    )
    return user


@pytest.fixture
def authenticated_client(api_client, test_user):
    api_client.force_authenticate(user=test_user)
    return api_client


@pytest.fixture
def test_todo(test_user):
    todo = Todo.objects.create(user=test_user, title="Test Todo", completed=False)
    return todo


@pytest.fixture
def test_todo_data():
    return {"title": "New Todo", "completed": False}


@pytest.fixture
def test_user_data():
    return {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "testpass123",
        "password2": "testpass123",
    }
