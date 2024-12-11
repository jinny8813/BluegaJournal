from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

app_name = "users"

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", views.logout, name="logout"),
    path("profile/", views.update_profile, name="update_profile"),
    path("change-password/", views.change_password, name="change_password"),
]
