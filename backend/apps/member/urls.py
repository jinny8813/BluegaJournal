from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    MemberRegisterView,
    MemberLoginView,
    MemberLogoutView,
    MemberProfileView,
    ChangePasswordView,
    GetCSRFToken
)

app_name = 'member'

urlpatterns = [
    path('register/', MemberRegisterView.as_view(), name='register'),
    path('login/', MemberLoginView.as_view(), name='login'),
    path('logout/', MemberLogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', MemberProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('csrf-cookie/', GetCSRFToken.as_view(), name='csrf_cookie'),
]
