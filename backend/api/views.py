# backend/api/views.py
"""Todo 應用的視圖定義"""
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Todo
from .serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    """待辦事項的 ViewSet

    提供列表、創建、檢索、更新和刪除功能
    支持按完成狀態過濾和標題搜索
    """

    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]
    queryset = Todo.objects.none()  # 初始化空查詢集

    def get_queryset(self):
        """獲取當前用戶的待辦事項，支持過濾和搜索"""
        queryset = Todo.objects.filter(user=self.request.user)

        completed = self.request.query_params.get("completed")
        if completed is not None:
            completed = completed.lower() == "true"
            queryset = queryset.filter(completed=completed)

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(title__icontains=search)

        return queryset

    def perform_create(self, serializer):
        """創建時自動設置用戶"""
        serializer.save(user=self.request.user)
