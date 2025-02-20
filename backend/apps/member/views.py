from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout
from .serializers import (
    MemberRegisterSerializer,
    MemberProfileSerializer,
    ChangePasswordSerializer
)
from .models import Member, MemberProfile

class MemberRegisterView(generics.CreateAPIView):
    queryset = Member.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = MemberRegisterSerializer

class MemberLoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)

class MemberLogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "登出成功"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"detail": "登出失敗"}, status=status.HTTP_400_BAD_REQUEST)

class MemberProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = MemberProfileSerializer

    def get_object(self):
        return self.request.user.profile

class ChangePasswordView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.data.get("old_password")):
            return Response(
                {"old_password": "舊密碼不正確"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(serializer.data.get("new_password"))
        user.save()
        return Response({"detail": "密碼修改成功"}, status=status.HTTP_200_OK)
