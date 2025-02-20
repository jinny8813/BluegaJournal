from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminUserViewSet,
    AdminRoleViewSet,
    AdminPermissionViewSet,
    AdminLogView
)

router = DefaultRouter()
router.register('users', AdminUserViewSet)
router.register('roles', AdminRoleViewSet)
router.register('permissions', AdminPermissionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('logs/', AdminLogView.as_view(), name='admin-logs'),
]
