from rest_framework import status
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .models import AdminUser, AdminRole, AdminPermission, AdminLog
from .serializers import (
    AdminUserSerializer,
    AdminRoleSerializer,
    AdminPermissionSerializer,
    AdminLogSerializer
)
from utils.mixins import APIViewMixin
from .mixins import AdminAPIViewMixin

class AdminUserViewSet(AdminAPIViewMixin, APIViewMixin, ModelViewSet):
    """管理員用戶管理"""
    queryset = AdminUser.objects.all()
    serializer_class = AdminUserSerializer
    permission_required = 'admin_user_manage'

    def perform_create(self, serializer):
        instance = serializer.save()
        self.log_admin_action(
            self.request,
            'CREATE',
            'AdminUser',
            instance.id,
            f"創建管理員: {instance.email}"
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        self.log_admin_action(
            self.request,
            'UPDATE',
            'AdminUser',
            instance.id,
            f"更新管理員: {instance.email}"
        )

    def perform_destroy(self, instance):
        self.log_admin_action(
            self.request,
            'DELETE',
            'AdminUser',
            instance.id,
            f"刪除管理員: {instance.email}"
        )
        instance.delete()

class AdminRoleViewSet(AdminAPIViewMixin, APIViewMixin, ModelViewSet):
    """管理員角色管理"""
    queryset = AdminRole.objects.all()
    serializer_class = AdminRoleSerializer
    permission_required = 'admin_role_manage'

class AdminPermissionViewSet(AdminAPIViewMixin, APIViewMixin, ModelViewSet):
    """權限管理"""
    queryset = AdminPermission.objects.all()
    serializer_class = AdminPermissionSerializer
    permission_required = 'admin_permission_manage'

class AdminLogView(AdminAPIViewMixin, APIViewMixin, APIView):
    """管理記錄查詢"""
    permission_required = 'admin_log_view'

    def get(self, request):
        # 支援多種篩選條件
        admin_id = request.query_params.get('admin_id')
        action = request.query_params.get('action')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        logs = AdminLog.objects.all()
        
        if admin_id:
            logs = logs.filter(admin_id=admin_id)
        if action:
            logs = logs.filter(action=action)
        if start_date:
            logs = logs.filter(created_at__gte=start_date)
        if end_date:
            logs = logs.filter(created_at__lte=end_date)

        serializer = AdminLogSerializer(logs, many=True)
        return self.success_response(data=serializer.data)
