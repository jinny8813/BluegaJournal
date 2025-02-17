from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from .models import Admin, AdminLoginLog
from .utils import mask_ip

class AdminLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                              email=email, password=password)
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
            if not user.is_active:
                msg = _('Account is disabled.')
                raise serializers.ValidationError(msg, code='authorization')
            if not user.is_staff:
                msg = _('Account does not have admin privileges.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs

class AdminSerializer(serializers.ModelSerializer):
    last_login_ip = serializers.CharField(read_only=True)
    login_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Admin
        fields = ('id', 'email', 'username', 'name', 'avatar', 
                 'is_active', 'is_staff', 'is_superuser',
                 'date_joined', 'last_login', 'last_login_ip',
                 'login_count')
        read_only_fields = ('id', 'email', 'date_joined', 'last_login',
                           'is_staff', 'is_superuser')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # 移除敏感信息
        request = self.context.get('request')
        if not request or not request.user.is_superuser:
            data.pop('is_superuser', None)
        return data

class AdminCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = Admin
        fields = ('email', 'username', 'name', 'password', 
                 'confirm_password', 'is_active', 'is_superuser')

    def validate_email(self, value):
        if Admin.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("This email is already registered."))
        return value

    def validate_username(self, value):
        if Admin.objects.filter(username=value).exists():
            raise serializers.ValidationError(_("This username is already taken."))
        return value

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({
                'confirm_password': _("Passwords don't match")
            })
        if len(data.get('password', '')) < 8:
            raise serializers.ValidationError({
                'password': _("Password must be at least 8 characters long")
            })
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        # 只有超級管理員可以創建超級管理員
        request = self.context.get('request')
        if not request or not request.user.is_superuser:
            validated_data['is_superuser'] = False
        return Admin.objects.create_user(**validated_data)

class AdminLoginLogSerializer(serializers.ModelSerializer):
    admin_email = serializers.CharField(source='admin.email', read_only=True)
    admin_name = serializers.CharField(source='admin.name', read_only=True)
    masked_ip = serializers.SerializerMethodField()
    browser_info = serializers.CharField(read_only=True)

    class Meta:
        model = AdminLoginLog
        fields = ('id', 'admin_email', 'admin_name', 'masked_ip',
                 'browser_info', 'login_at', 'status')

    def get_masked_ip(self, obj):
        return mask_ip(obj.ip_address)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # 只有超級管理員可以看到完整IP
        request = self.context.get('request')
        if not request or not request.user.is_superuser:
            data.pop('ip_address', None)
        return data