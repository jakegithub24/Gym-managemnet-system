from decimal import Decimal
from django.db import models
from apps.users.models import User
from apps.plans.models import MembershipPlan

class PaymentRecord(models.Model):
    STATUS_CHOICES = [('pending', 'Pending'), ('verified', 'Verified'), ('rejected', 'Rejected')]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    plan = models.ForeignKey(MembershipPlan, on_delete=models.PROTECT, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    transaction_reference = models.CharField(max_length=100, blank=True, default='')
    payment_method = models.CharField(max_length=30, default='upi')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
