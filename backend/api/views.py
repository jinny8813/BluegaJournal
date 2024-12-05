from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from .models import Todo
from .serializers import TodoSerializer
import logging

logger = logging.getLogger(__name__)

class TodoListCreateView(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """獲取所有待辦事項，按創建時間倒序排序"""
        try:
            return Todo.objects.all().order_by('-created_at')
        except Exception as e:
            logger.error(f"Error in get_queryset: {str(e)}")
            return Todo.objects.none()

    def list(self, request, *args, **kwargs):
        """列出所有待辦事項"""
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in list: {str(e)}")
            return Response(
                {"error": "Failed to fetch todos"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request, *args, **kwargs):
        """創建新的待辦事項"""
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                todo = serializer.save()
                return Response(
                    serializer.data,
                    status=status.HTTP_200_OK  # 改為 200
                )
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValidationError as e:
            logger.error(f"Validation error in create: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error in create: {str(e)}")
            return Response(
                {"error": "Failed to create todo"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TodoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [AllowAny]

    def retrieve(self, request, *args, **kwargs):
        """獲取單個待辦事項"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Todo.DoesNotExist:
            logger.warning(f"Todo not found with id: {kwargs.get('pk')}")
            return Response(
                {"error": "Todo not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error in retrieve: {str(e)}")
            return Response(
                {"error": "Failed to fetch todo"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, *args, **kwargs):
        """更新待辦事項"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
            if serializer.is_valid():
                todo = serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        except Todo.DoesNotExist:
            logger.warning(f"Todo not found with id: {kwargs.get('pk')}")
            return Response(
                {"error": "Todo not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error in update: {str(e)}")
            return Response(
                {"error": "Failed to update todo"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def destroy(self, request, *args, **kwargs):
        """刪除待辦事項"""
        try:
            instance = self.get_object()
            instance.delete()
            return Response(
                {"message": "Todo deleted successfully"},
                status=status.HTTP_200_OK  # 改為 200
            )
        except Todo.DoesNotExist:
            logger.warning(f"Todo not found with id: {kwargs.get('pk')}")
            return Response(
                {"error": "Todo not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error in destroy: {str(e)}")
            return Response(
                {"error": "Failed to delete todo"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )