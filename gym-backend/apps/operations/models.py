import uuid
from django.db import models
from apps.users.models import User
from apps.members.models import MemberProfile

class Receptionist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='receptionist_profile')
    shift_timing = models.CharField(max_length=100, blank=True, default='')

class Trainer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='trainer_profile')
    specialization = models.CharField(max_length=120, blank=True, default='')

class Inquiry(models.Model):
    STATUS_CHOICES = [('new','New'), ('contacted','Contacted'), ('interested','Interested'), ('closed','Closed')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20)
    fitness_goal = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    handled_by = models.ForeignKey(Receptionist, null=True, blank=True, on_delete=models.SET_NULL, related_name='inquiries')
    created_at = models.DateTimeField(auto_now_add=True)

class Attendance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member = models.ForeignKey(MemberProfile, on_delete=models.CASCADE, related_name='attendance_records')
    session_date = models.DateField()
    class Meta:
        constraints = [models.UniqueConstraint(fields=['member','session_date'], name='unique_member_session_date')]

class WorkoutDietPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member = models.ForeignKey(MemberProfile, on_delete=models.CASCADE, related_name='workout_diet_plans')
    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE, related_name='workout_diet_plans')
    workout_text = models.TextField(blank=True, default='')
    diet_text = models.TextField(blank=True, default='')
    updated_at = models.DateTimeField(auto_now=True)
