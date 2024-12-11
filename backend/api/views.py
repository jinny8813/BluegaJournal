# backend/api/views.py
"""API 視圖函數定義"""
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Todo
from .serializers import TodoSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def todo_list(request):
    """
    待辦事項列表視圖

    GET: 獲取當前用戶的所有待辦事項
    POST: 創建新的待辦事項
    """
    if request.method == "GET":
        todos = Todo.objects.filter(user=request.user)
        serializer = TodoSerializer(todos, many=True)
        return Response(serializer.data)

    serializer = TodoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def todo_detail(request, pk):
    """
    待辦事項詳情視圖

    GET: 獲取特定待辦事項
    PUT/PATCH: 更新待辦事項
    DELETE: 刪除待辦事項
    """
    todo = get_object_or_404(Todo, pk=pk, user=request.user)

    if request.method == "GET":
        serializer = TodoSerializer(todo)
        return Response(serializer.data)

    if request.method in ["PUT", "PATCH"]:
        serializer = TodoSerializer(todo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        todo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
