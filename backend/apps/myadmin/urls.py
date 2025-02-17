from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminViewSet

router = DefaultRouter()
router.register('member', AdminViewSet, basename='admin-member')

urlpatterns = [
    path('', include(router.urls)),
]