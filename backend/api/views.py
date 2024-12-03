from rest_framework import viewsets
from .models import Todo
from .serializers import TodoSerializer
from rest_framework.permissions import AllowAny

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [AllowAny]