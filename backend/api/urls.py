from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    path('todos/', views.TodoListCreateView.as_view(), name='todo-list-create'),
    path('todos/<int:pk>/', views.TodoDetailView.as_view(), name='todo-detail'),
]
