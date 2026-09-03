from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('master_admin', 'Master Admin'),
        ('staff', 'Staff'),
        ('receptionist', 'Receptionist'),
        ('trainer', 'Trainer'),
        ('member', 'Member'),
    ]
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='member')
    phone = models.CharField(max_length=20, blank=True, default='')
    avatar_url = models.URLField(blank=True, default='')
