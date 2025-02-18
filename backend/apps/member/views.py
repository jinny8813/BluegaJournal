from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.db import transaction
from .serializers import (
    RegisterSerializer, LoginSerializer,
    MemberDetailSerializer, MemberProfileSerializer
)
from .models import Member, MemberProfile
from django.utils import timezone
from .mixins import JWTValidationMixin
from rest_framework_simplejwt.authentication import JWTAuthentication

class MemberViewSet(JWTValidationMixin, viewsets.GenericViewSet):
    queryset = Member.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.action == 'register':
            return RegisterSerializer
        elif self.action == 'login':
            return LoginSerializer
        elif self.action == 'update_profile':
            return MemberProfileSerializer
        return MemberDetailSerializer

    def get_permissions(self):
        """
        動態設置權限
        """
        if self.action in ['register', 'login']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @transaction.atomic
    @action(detail=False, methods=['post'])
    def register(self, request):
        """會員註冊"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                # 創建對應的 profile
                MemberProfile.objects.create(member=user)
                
                refresh = RefreshToken.for_user(user)
                return Response({
                    'message': _('Registration successful'),
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'message': _('Registration failed'),
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        """會員登入"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            if user and user.is_active:
                refresh = RefreshToken.for_user(user)
                # 更新最後登入時間和IP
                user.last_login = timezone.now()
                user.save(update_fields=['last_login'])
                
                return Response({
                    'message': _('Login successful'),
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                })
            return Response({
                'message': _('Invalid credentials or account inactive')
            }, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get', 'put'])
    def profile(self, request):
        """獲取或更新用戶資料"""
        user = self.validate_jwt_token(request)
        if not user:
            return Response({
                'message': _('Invalid or expired token')
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if request.method == 'GET':
            serializer = MemberDetailSerializer(user)
            return Response(serializer.data)
        
        serializer = MemberProfileSerializer(
            user,
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
        user = self.validate_jwt_token(request)
        if not user:
            return Response({
                'message': _('Invalid or expired token')
            }, status=status.HTTP_401_UNAUTHORIZED)
    
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        
        if not all([old_password, new_password, confirm_password]):
            return Response({
                'message': _('All password fields are required')
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if new_password != confirm_password:
            return Response({
                'message': _('New passwords do not match')
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.check_password(old_password):
            return Response({
                'message': _('Old password is incorrect')
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user.set_password(new_password)
            user.save()
            
            # 更新後重新生成 token
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': _('Password changed successfully'),
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        except Exception as e:
            return Response({
                'message': _('Password change failed'),
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)