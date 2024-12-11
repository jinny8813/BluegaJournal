# backend/users/urls.py
"""用戶 URL 配置"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

app_name = "users"

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.CustomTokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", views.logout, name="logout"),
    path("profile/", views.user_profile, name="profile"),
]
