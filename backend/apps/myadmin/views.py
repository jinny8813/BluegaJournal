from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Q
from apps.member.mixins import JWTValidationMixin
from apps.member.models import Member
from .serializers import AdminMemberSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication

class AdminViewSet(JWTValidationMixin, viewsets.GenericViewSet):
    queryset = Member.objects.all()
    serializer_class = AdminMemberSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['email', 'name']
    ordering_fields = ['date_joined', 'last_login']
    ordering = ['-date_joined']
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        permission_classes = [IsAuthenticated, IsAdminUser]
        return [permission() for permission in permission_classes]

    def list(self, request):
        """獲取會員列表"""
        user = self.validate_jwt_token(request)
        if not user or not user.is_staff:
            return Response(
                {'detail': '需要管理員權限'},
                status=status.HTTP_403_FORBIDDEN
            )

        queryset = self.queryset
        search = request.query_params.get('search', '')
        if search:
            queryset = queryset.filter(
                Q(email__icontains=search) |
                Q(name__icontains=search)
            )

        ordering = request.query_params.get('ordering', '-date_joined')
        if ordering:
            queryset = queryset.order_by(ordering)

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """獲取特定會員"""
        user = self.validate_jwt_token(request)
        if not user or not user.is_staff:
            return Response(
                {'detail': '需要管理員權限'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            member = self.queryset.get(pk=pk)
        except Member.DoesNotExist:
            return Response(
                {'detail': '會員不存在'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.serializer_class(member)
        return Response(serializer.data)

    def update(self, request, pk=None):
        """更新特定會員"""
        user = self.validate_jwt_token(request)
        if not user or not user.is_staff:
            return Response(
                {'detail': '需要管理員權限'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            member = self.queryset.get(pk=pk)
        except Member.DoesNotExist:
            return Response(
                {'detail': '會員不存在'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.serializer_class(
            member,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def destroy(self, request, pk=None):
        """刪除特定會員"""
        user = self.validate_jwt_token(request)
        if not user or not user.is_staff:
            return Response(
                {'detail': '需要管理員權限'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            member = self.queryset.get(pk=pk)
        except Member.DoesNotExist:
            return Response(
                {'detail': '會員不存在'},
                status=status.HTTP_404_NOT_FOUND
            )

        member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)