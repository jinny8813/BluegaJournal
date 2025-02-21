from rest_framework import status
from django.core.exceptions import PermissionDenied
from .models import AdminLog

class AdminPermissionMixin:
    """管理員權限控制"""
    permission_required = None  # 需要的權限代碼

    def check_permission(self, request):
        if not isinstance(self.permission_required, (list, tuple, str)):
            raise ValueError("permission_required 必須是字串或列表")
            
        if not hasattr(request.user, 'has_permission'):
            raise PermissionDenied("非管理員用戶")
            
        if isinstance(self.permission_required, str):
            return request.user.has_permission(self.permission_required)
            
        return all(request.user.has_permission(perm) for perm in self.permission_required)

    def dispatch(self, request, *args, **kwargs):
        if not self.check_permission(request):
            return self.error_response(
                msg="權限不足",
                status_code=status.HTTP_403_FORBIDDEN
            )
        return super().dispatch(request, *args, **kwargs)

class AdminLogMixin:
    """管理員操作記錄"""
    def log_admin_action(self, request, action, target_model, target_id="", description=""):
        AdminLog.objects.create(
            admin=request.user,
            action=action,
            target_model=target_model,
            target_id=str(target_id),
            description=description,
            ip_address=request.META.get('REMOTE_ADDR')
        )

class AdminAPIViewMixin(AdminPermissionMixin, AdminLogMixin):
    """組合管理員所需的所有 Mixin"""
    pass
