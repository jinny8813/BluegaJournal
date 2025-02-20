from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    MemberRegisterSerializer,
    MemberProfileSerializer,
    ChangePasswordSerializer
)
from apps.utils.mixins import APIViewMixin, ResponseMixin

class MemberRegisterView(ResponseMixin, APIView):
    """會員註冊"""
    def post(self, request):
        serializer = MemberRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return self.success_response(
                data={
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                msg="註冊成功"
            )
        return self.error_response(
            msg="註冊失敗",
            errors=serializer.errors
        )

class MemberLoginView(ResponseMixin, TokenObtainPairView):
    """會員登入"""
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                return self.success_response(
                    data=response.data,
                    msg="登入成功"
                )
        except Exception as e:
            return self.error_response(
                msg="登入失敗",
                errors=str(e)
            )

class MemberProfileView(APIViewMixin, APIView):
    """會員資料查看與修改"""
    def get(self, request):
        serializer = MemberProfileSerializer(request.user.profile)
        return self.success_response(
            data=serializer.data,
            msg="獲取資料成功"
        )

    def patch(self, request):
        serializer = MemberProfileSerializer(
            request.user.profile,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return self.success_response(
                data=serializer.data,
                msg="資料更新成功"
            )
        return self.error_response(
            msg="資料更新失敗",
            errors=serializer.errors
        )

class ChangePasswordView(APIViewMixin, APIView):
    """修改密碼"""
    def put(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return self.error_response(
                msg="資料驗證失敗",
                errors=serializer.errors
            )

        user = request.user
        if not user.check_password(serializer.data.get("old_password")):
            return self.error_response(msg="舊密碼不正確")

        user.set_password(serializer.data.get("new_password"))
        user.save()
        return self.success_response(msg="密碼修改成功")

class MemberLogoutView(APIViewMixin, APIView):
    """會員登出"""
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return self.error_response(msg="未提供 refresh token")
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            return self.success_response(msg="登出成功")
        except Exception as e:
            return self.error_response(
                msg="登出失敗",
                errors=str(e)
            )
