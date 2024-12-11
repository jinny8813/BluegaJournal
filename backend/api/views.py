# backend/api/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Todo
from .serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    """
    待辦事項的 ViewSet

    提供列表、創建、檢索、更新和刪除功能
    支持按完成狀態過濾和標題搜索
    """

    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """獲取當前用戶的待辦事項，支持過濾和搜索"""
        queryset = Todo.objects.filter(user=self.request.user)

        # 完成狀態過濾
        completed = self.request.query_params.get("completed")
        if completed is not None:
            completed = completed.lower() == "true"
            queryset = queryset.filter(completed=completed)

        # 標題搜索
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(title__icontains=search)

        return queryset

    def perform_create(self, serializer):
        """創建時自動設置用戶"""
        serializer.save(user=self.request.user)
