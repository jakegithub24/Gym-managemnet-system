from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health, name='health'),
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('plans/', views.plans, name='plans'),
    path('members/', views.members, name='members'),
    path('payments/', views.payments, name='payments'),
    path('payments/<int:payment_id>/verify/', views.verify_payment, name='verify_payment'),
    path('dashboard/summary/', views.dashboard_summary, name='dashboard_summary'),
]
