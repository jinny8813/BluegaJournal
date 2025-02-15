from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from .models import Member, MemberProfile


@receiver(post_save, sender=Member)
def create_member_profile(sender, instance, created, **kwargs):
    """當新會員創建時自動創建對應的檔案"""
    if created:
        MemberProfile.objects.create(member=instance)


@receiver(post_save, sender=Member)
def save_member_profile(sender, instance, **kwargs):
    """確保會員檔案被保存"""
    if not hasattr(instance, 'profile'):
        MemberProfile.objects.create(member=instance)
    instance.profile.save()