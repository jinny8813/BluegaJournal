from rest_framework import serializers
from .models import Member, MemberProfile
from django.contrib.auth.password_validation import validate_password

class MemberRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Member
        fields = ('email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "兩次密碼不相符"})
        return attrs

    def create(self, validated_data):
        user = Member.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        MemberProfile.objects.create(member=user)
        return user

class MemberProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='member.email', read_only=True)

    class Meta:
        model = MemberProfile
        fields = ('email', 'name', 'nickname', 'phone', 'gender', 
                 'birthday', 'address', 'avatar')

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "兩次新密碼不相符"})
        return attrs
