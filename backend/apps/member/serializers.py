from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from .models import MemberProfile
from datetime import date
from django.core.validators import RegexValidator

Member = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Member
        fields = ('email', 'name', 'password', 'confirm_password')

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(_("Passwords don't match"))
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = Member.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

from datetime import date
from django.core.validators import RegexValidator

class MemberProfileSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(
        max_length=20, 
        required=False,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message=_("Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
            )
        ]
    )
    birth_date = serializers.DateField(required=False)

    class Meta:
        model = MemberProfile
        fields = ('bio', 'birth_date', 'phone', 'address')

    def validate_birth_date(self, value):
        """驗證生日日期"""
        if value and value > date.today():
            raise serializers.ValidationError(
                _("Birth date cannot be in the future")
            )
        return value

    def validate_bio(self, value):
        """驗證個人簡介"""
        if len(value) > 500:  # 假設我們限制簡介最多 500 字
            raise serializers.ValidationError(
                _("Bio cannot exceed 500 characters")
            )
        return value

    def validate_address(self, value):
        """驗證地址"""
        if value and len(value) > 200:  # 假設地址限制 200 字
            raise serializers.ValidationError(
                _("Address cannot exceed 200 characters")
            )
        return value

    def update(self, instance, validated_data):
        """更新個人資料"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def to_representation(self, instance):
        """自定義輸出格式"""
        ret = super().to_representation(instance)
        # 如果電話號碼存在，格式化顯示
        if ret.get('phone'):
            # 這裡可以添加電話號碼格式化邏輯
            pass
        # 如果生日存在，計算年齡
        if ret.get('birth_date'):
            today = date.today()
            born = instance.birth_date
            age = today.year - born.year - ((today.month, today.day) < (born.month, born.day))
            ret['age'] = age
        return ret

class MemberDetailSerializer(serializers.ModelSerializer):
    profile = MemberProfileSerializer()

    class Meta:
        model = Member
        fields = ('id', 'email', 'name', 'avatar', 'profile', 'date_joined', 'last_login')
        read_only_fields = ('id', 'email', 'date_joined', 'last_login')

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        if profile_data:
            profile_serializer = MemberProfileSerializer(
                instance.profile,
                data=profile_data,
                partial=True
            )
            profile_serializer.is_valid(raise_exception=True)
            profile_serializer.save()
        return super().update(instance, validated_data)