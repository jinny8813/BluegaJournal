# backend/api/urls.py
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"todos", views.TodoViewSet, basename="todo")

app_name = "api"

urlpatterns = [
    path("", include(router.urls)),
]
