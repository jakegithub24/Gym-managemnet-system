from django.db import models
from apps.users.models import User

class MemberProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='member_profile')
    member_id = models.CharField(max_length=20, unique=True)
    gender = models.CharField(max_length=20, blank=True, default='')
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True, default='')
    emergency_contact = models.CharField(max_length=50, blank=True, default='')
    join_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, default='active')
    notes = models.TextField(blank=True, default='')
