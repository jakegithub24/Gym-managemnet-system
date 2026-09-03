from django.urls import path
from . import views
from .ninja_api import api as ninja_api

urlpatterns = [
    path('docs/', ninja_api.urls),
    path('health/', views.health, name='health'),
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('plans/', views.plans, name='plans'),
    path('members/', views.members, name='members'),
    path('payments/', views.payments, name='payments'),
    path('payments/<int:payment_id>/verify/', views.verify_payment, name='verify_payment'),
    path('dashboard/summary/', views.dashboard_summary, name='dashboard_summary'),
    path('inquiries/', views.inquiries, name='inquiries'),
    path('trials/', views.trials, name='trials'),
    path('attendance/check-in/', views.check_in, name='check_in'),
    path('workouts/', views.workouts, name='workouts'),
    path('members/<int:member_id>/assign-trainer/', views.assign_trainer, name='assign_trainer'),
]
