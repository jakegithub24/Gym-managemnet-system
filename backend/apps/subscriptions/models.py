import uuid
from django.db import models
from apps.members.models import MemberProfile
from apps.plans.models import MembershipPlan

class Subscription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member = models.ForeignKey(MemberProfile, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(MembershipPlan, on_delete=models.PROTECT, related_name='subscriptions')
    start_date = models.DateField()
    end_date = models.DateField()

class Trial(models.Model):
    STATUS_CHOICES = [('active','Active'), ('expired','Expired'), ('converted','Converted')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=20, unique=True)
    member = models.ForeignKey(MemberProfile, null=True, blank=True, on_delete=models.SET_NULL, related_name='trials')
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    def save(self, *args, **kwargs):
        if self.start_date:
            from datetime import timedelta
            self.end_date = self.start_date + timedelta(days=2)
        super().save(*args, **kwargs)
