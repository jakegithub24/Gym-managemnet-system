from django.db import models

class MembershipPlan(models.Model):
    name = models.CharField(max_length=60)
    duration_days = models.PositiveIntegerField(default=30)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    description = models.TextField(blank=True, default='')
    is_active = models.BooleanField(default=True)
