# backend/api/urls.py
"""API URL 配置"""
from django.urls import path

from . import views

app_name = "api"

urlpatterns = [
    path("todos/", views.todo_list, name="todo-list"),
    path("todos/<int:pk>/", views.todo_detail, name="todo-detail"),
]
