from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminAuthViewSet, AdminManagementViewSet, AdminLoginLogViewSet

router = DefaultRouter()
router.register('auth', AdminAuthViewSet, basename='admin-auth')
router.register('admins', AdminManagementViewSet, basename='admin-management')
router.register('logs', AdminLoginLogViewSet, basename='admin-logs')

urlpatterns = [
    path('', include(router.urls)),
]