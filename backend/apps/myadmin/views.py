from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from .serializers import (
    AdminLoginSerializer, AdminSerializer,
    AdminCreateSerializer, AdminLoginLogSerializer
)
from .models import Admin, AdminLoginLog
from .permissions import IsAdminUser
from .utils import get_client_ip, get_user_agent

class AdminAuthViewSet(viewsets.GenericViewSet):
    queryset = Admin.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'login':
            return AdminLoginSerializer
        elif self.action == 'create':
            return AdminCreateSerializer
        return AdminSerializer

    def get_permissions(self):
        if self.action == 'login':
            return []
        return [permission() for permission in self.permission_classes]

    @action(detail=False, methods=['post'])
    def login(self, request):
        """管理員登入"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            
            # 記錄登入日誌
            log_data = {
                'admin': user,
                'ip_address': get_client_ip(request),
                'user_agent': get_user_agent(request),
                'status': 'success' if user else 'failed'
            }
            AdminLoginLog.objects.create(**log_data)

            if user and user.is_staff:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'message': _('Login successful'),
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                })
            return Response({
                'message': _('Invalid credentials')
            }, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """管理員登出"""
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': _('Logout successful')})
        except Exception:
            return Response({'message': _('Invalid token')}, 
                          status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def profile(self, request):
        """獲取管理員資料"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        """更新管理員資料"""
        serializer = self.get_serializer(
            request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """修改密碼"""
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not old_password or not new_password:
            return Response({
                'message': _('Both old and new password are required')
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not request.user.check_password(old_password):
            return Response({
                'message': _('Old password is incorrect')
            }, status=status.HTTP_400_BAD_REQUEST)
        
        request.user.set_password(new_password)
        request.user.save()
        
        return Response({
            'message': _('Password changed successfully')
        })

class AdminManagementViewSet(viewsets.ModelViewSet):
    """管理員管理"""
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'create':
            return AdminCreateSerializer
        return AdminSerializer

class AdminLoginLogViewSet(viewsets.ReadOnlyModelViewSet):
    """登入日誌"""
    queryset = AdminLoginLog.objects.all()
    serializer_class = AdminLoginLogSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = super().get_queryset()
        # 添加日期過濾
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(login_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(login_at__lte=end_date)
        return queryset