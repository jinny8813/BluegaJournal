from django.utils.translation import gettext_lazy as _


class MemberError(Exception):
    """基礎會員異常類"""
    pass


class InvalidEmailError(MemberError):
    """無效的電子郵件地址"""
    def __init__(self, email):
        self.email = email
        self.message = _('Invalid email address: {0}').format(email)
        super().__init__(self.message)


class DuplicateEmailError(MemberError):
    """重複的電子郵件地址"""
    def __init__(self, email):
        self.email = email
        self.message = _('Email address already exists: {0}').format(email)
        super().__init__(self.message)


class InvalidPasswordError(MemberError):
    """無效的密碼"""
    def __init__(self, message=None):
        self.message = message or _('Invalid password')
        super().__init__(self.message)


class AccountNotActiveError(MemberError):
    """帳號未啟用"""
    def __init__(self, email):
        self.email = email
        self.message = _('Account is not active: {0}').format(email)
        super().__init__(self.message)