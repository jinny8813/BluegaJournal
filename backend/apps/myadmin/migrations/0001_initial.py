# Generated by Django 5.1.6 on 2025-02-20 06:12

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('member', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdminPermission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='權限名稱')),
                ('codename', models.CharField(max_length=100, unique=True, verbose_name='權限代碼')),
                ('description', models.TextField(blank=True, verbose_name='權限描述')),
                ('module', models.CharField(max_length=50, verbose_name='所屬模組')),
                ('is_active', models.BooleanField(default=True, verbose_name='啟用狀態')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='創建時間')),
            ],
            options={
                'verbose_name': '權限項目',
                'verbose_name_plural': '權限項目',
                'ordering': ['module', 'codename'],
            },
        ),
        migrations.CreateModel(
            name='AdminRole',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('superadmin', '超級管理員'), ('level_1', '一級管理員'), ('level_2', '二級管理員'), ('level_3', '三級管理員')], max_length=20, unique=True, verbose_name='角色名稱')),
                ('description', models.TextField(blank=True, verbose_name='角色描述')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='創建時間')),
            ],
            options={
                'verbose_name': '管理員角色',
                'verbose_name_plural': '管理員角色',
            },
        ),
        migrations.CreateModel(
            name='AdminUser',
            fields=[
                ('member_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('department', models.CharField(blank=True, max_length=50, verbose_name='部門')),
                ('position', models.CharField(blank=True, max_length=50, verbose_name='職位')),
                ('note', models.TextField(blank=True, verbose_name='備註')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='admin_users', to='myadmin.adminrole', verbose_name='管理員角色')),
            ],
            options={
                'verbose_name': '管理員',
                'verbose_name_plural': '管理員',
            },
            bases=('member.member',),
        ),
        migrations.CreateModel(
            name='AdminLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(choices=[('CREATE', '創建'), ('UPDATE', '更新'), ('DELETE', '刪除'), ('LOGIN', '登入'), ('LOGOUT', '登出'), ('OTHER', '其他')], max_length=10, verbose_name='操作類型')),
                ('target_model', models.CharField(max_length=50, verbose_name='目標模型')),
                ('target_id', models.CharField(blank=True, max_length=50, verbose_name='目標ID')),
                ('description', models.TextField(blank=True, verbose_name='操作描述')),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True, verbose_name='IP地址')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='操作時間')),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='myadmin.adminuser', verbose_name='管理員')),
            ],
            options={
                'verbose_name': '管理記錄',
                'verbose_name_plural': '管理記錄',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='RolePermission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('permission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myadmin.adminpermission', verbose_name='權限')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='role_permissions', to='myadmin.adminrole', verbose_name='角色')),
            ],
            options={
                'verbose_name': '角色權限',
                'verbose_name_plural': '角色權限',
                'unique_together': {('role', 'permission')},
            },
        ),
    ]
