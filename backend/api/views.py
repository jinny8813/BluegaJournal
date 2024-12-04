from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Todo
from .serializers import TodoSerializer

class TodoListCreateView(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Todo.objects.all().order_by('-created_at')

class TodoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [AllowAny]