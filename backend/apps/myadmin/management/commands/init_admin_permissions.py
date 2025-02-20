# apps/myadmin/management/commands/init_admin_permissions.py
from django.core.management.base import BaseCommand
from apps.myadmin.models import AdminPermission, AdminRole, RolePermission

class Command(BaseCommand):
    help = '初始化管理員權限'

    def handle(self, *args, **kwargs):
        # 創建基本權限
        permissions_data = [
            # 會員管理
            {
                'name': '查看會員列表',
                'codename': 'view_member_list',
                'module': '會員管理',
                'description': '可以查看會員列表'
            },
            {
                'name': '編輯會員資料',
                'codename': 'edit_member',
                'module': '會員管理',
                'description': '可以編輯會員資料'
            },
            # 可以繼續添加其他權限...
        ]
        
        for perm_data in permissions_data:
            AdminPermission.objects.get_or_create(
                codename=perm_data['codename'],
                defaults=perm_data
            )
        
        # 創建角色
        roles = [
            'superadmin',
            'level_1',
            'level_2',
            'level_3'
        ]
        
        for role_name in roles:
            AdminRole.objects.get_or_create(name=role_name)
