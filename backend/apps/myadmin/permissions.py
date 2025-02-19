from rest_framework.permissions import BasePermission, IsAuthenticated

class IsAdminUser(BasePermission):
    """
    只允許管理員訪問的權限類
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

class IsSuperAdminUser(BasePermission):
    """
    只允許超級管理員訪問的權限類
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_superuser)