from django.db import models

class MembershipPlan(models.Model):
    CATEGORY_CHOICES = [('men', "Men's"), ('women', "Women's"), ('mixed', 'Mixed')]
    name = models.CharField(max_length=60)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='mixed')
    duration_days = models.PositiveIntegerField(default=30)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    description = models.TextField(blank=True, default='')
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['name', 'category', 'duration_days'], name='unique_plan_product')]
