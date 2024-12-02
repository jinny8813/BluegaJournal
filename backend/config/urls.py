from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import TodoViewSet

router = DefaultRouter()
router.register(r'todos', TodoViewSet, basename='todo')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]