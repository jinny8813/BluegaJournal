from rest_framework import serializers
from .models import AdminUser, AdminRole, AdminPermission, AdminLog

class AdminRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminRole
        fields = ['id', 'name', 'description', 'created_at']

class AdminPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminPermission
        fields = ['id', 'name', 'codename', 'description', 'module', 'is_active']

class AdminUserSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.get_name_display', read_only=True)
    
    class Meta:
        model = AdminUser
        fields = [
            'id', 'email', 'role', 'role_name', 'department', 
            'position', 'is_active', 'date_joined', 'last_login'
        ]
        read_only_fields = ['date_joined', 'last_login']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = super().create(validated_data)
        if password:
            instance.set_password(password)
            instance.save()
        return instance

class AdminLogSerializer(serializers.ModelSerializer):
    admin_email = serializers.CharField(source='admin.email', read_only=True)
    
    class Meta:
        model = AdminLog
        fields = [
            'id', 'admin', 'admin_email', 'action', 'target_model',
            'target_id', 'description', 'ip_address', 'created_at'
        ]
