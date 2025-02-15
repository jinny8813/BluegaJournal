from django.utils.translation import gettext_lazy as _


class Gender:
    MALE = 'M'
    FEMALE = 'F'
    OTHER = 'O'
    PREFER_NOT_TO_SAY = 'N'

    CHOICES = [
        (MALE, _('Male')),
        (FEMALE, _('Female')),
        (OTHER, _('Other')),
        (PREFER_NOT_TO_SAY, _('Prefer not to say')),
    ]


class AccountStatus:
    ACTIVE = 'A'
    INACTIVE = 'I'
    SUSPENDED = 'S'
    DELETED = 'D'

    CHOICES = [
        (ACTIVE, _('Active')),
        (INACTIVE, _('Inactive')),
        (SUSPENDED, _('Suspended')),
        (DELETED, _('Deleted')),
    ]