from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in, user_logged_out
from .models import AdminLog
from apps.member.models import Member


@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    if user.is_staff:
        AdminLog.objects.create(
            admin=user,
            action=AdminLog.ActionType.LOGIN,
            model_type='Member',
            object_id=str(user.id),
            ip_address=request.META.get('REMOTE_ADDR'),
            detail={'message': 'Admin login successful'}
        )


@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    if user and user.is_staff:
        AdminLog.objects.create(
            admin=user,
            action=AdminLog.ActionType.LOGOUT,
            model_type='Member',
            object_id=str(user.id),
            ip_address=request.META.get('REMOTE_ADDR'),
            detail={'message': 'Admin logout successful'}
        )