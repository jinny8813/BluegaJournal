from functools import wraps
from django.core.exceptions import PermissionDenied

def admin_permission_required(permission_codename):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(self, request, *args, **kwargs):
            if not request.user.is_authenticated:
                raise PermissionDenied
            
            if not hasattr(request.user, 'has_permission'):
                raise PermissionDenied
                
            if not request.user.has_permission(permission_codename):
                raise PermissionDenied
                
            return view_func(self, request, *args, **kwargs)
        return _wrapped_view
    return decorator
