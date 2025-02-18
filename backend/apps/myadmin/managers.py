from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _

class AdminManager(BaseUserManager):
    def create_user(self, email, username, name, password=None, **extra_fields):
        """
        創建普通管理員用戶
        """
        if not email:
            raise ValueError(_('The Email field must be set'))
        if not username:
            raise ValueError(_('The Username field must be set'))
        if not name:
            raise ValueError(_('The Name field must be set'))

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            username=username,
            name=name,
            **extra_fields
        )

        if password:
            user.set_password(password)
        else:
            raise ValueError(_('Password must be set for admin users'))

        user.is_staff = True  # 確保所有管理員都有staff權限
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, name, password=None, **extra_fields):
        """
        創建超級管理員
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, username, name, password, **extra_fields)

    def get_active_admins(self):
        """
        獲取所有活躍的管理員
        """
        return self.filter(is_active=True)

    def get_superusers(self):
        """
        獲取所有超級管理員
        """
        return self.filter(is_superuser=True)

    def create_staff(self, email, username, name, password=None, **extra_fields):
        """
        創建普通職員（有限權限的管理員）
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', False)
        return self.create_user(email, username, name, password, **extra_fields)