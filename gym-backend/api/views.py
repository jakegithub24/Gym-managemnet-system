from datetime import timedelta
import json

import jwt
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db import IntegrityError, transaction

from apps.members.models import MemberProfile
from apps.payments.models import PaymentRecord
from apps.plans.models import MembershipPlan
from apps.operations.models import Attendance, Inquiry, Trainer, WorkoutDietPlan
from apps.subscriptions.models import Subscription, Trial

User = get_user_model()
STAFF_ROLES = {'master_admin', 'staff', 'receptionist'}


def _read_json(request):
    if request.content_type and 'application/json' in request.content_type:
        try:
            return json.loads(request.body.decode('utf-8') or '{}')
        except json.JSONDecodeError:
            return {}
    return request.POST or {}


def _token_user(request):
    header = request.headers.get('Authorization', '')
    if not header.startswith('Bearer '):
        return None
    try:
        payload = jwt.decode(header[7:], settings.SECRET_KEY, algorithms=['HS256'])
        return User.objects.get(id=payload['user_id'])
    except (jwt.PyJWTError, User.DoesNotExist, KeyError):
        return None


def _build_token(user):
    payload = {'user_id': user.id, 'email': user.email, 'role': user.role, 'exp': timezone.now() + timedelta(days=7)}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


def _user_payload(user):
    return {'id': user.id, 'email': user.email, 'full_name': user.get_full_name(), 'role': user.role}


def health(request):
    return JsonResponse({'status': 'ok', 'message': 'Gym backend is running'})


@csrf_exempt
def register(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    data = _read_json(request)
    full_name = (data.get('full_name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    phone = (data.get('phone') or '').strip()
    if not full_name or not email or len(password) < 8:
        return JsonResponse({'detail': 'full_name, email, and password of at least 8 characters are required'}, status=400)
    if User.objects.filter(email__iexact=email).exists():
        return JsonResponse({'detail': 'User already exists'}, status=400)
    names = full_name.split()
    user = User.objects.create_user(username=email, email=email, password=password, first_name=names[0], last_name=' '.join(names[1:]), phone=phone, role='member')
    MemberProfile.objects.create(user=user, member_id=f'MEM-{user.id:05d}', status='active')
    return JsonResponse({**_user_payload(user), 'access_token': _build_token(user)}, status=201)


@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    data = _read_json(request)
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    user = authenticate(request, username=email, password=password)
    if user is None:
        return JsonResponse({'detail': 'Invalid credentials'}, status=401)
    return JsonResponse({**_user_payload(user), 'access_token': _build_token(user)})


@csrf_exempt
def plans(request):
    if request.method == 'GET':
        data = list(MembershipPlan.objects.filter(is_active=True).values('id', 'name', 'duration_days', 'price', 'description'))
        return JsonResponse({'plans': data})
    user = _token_user(request)
    if request.method != 'POST' or not user or user.role not in STAFF_ROLES:
        return JsonResponse({'detail': 'Staff authorization required'}, status=403)
    data = _read_json(request)
    plan = MembershipPlan.objects.create(name=data.get('name', ''), duration_days=data.get('duration_days', 30), price=data.get('price', 0), description=data.get('description', ''))
    return JsonResponse({'id': plan.id, 'name': plan.name, 'duration_days': plan.duration_days, 'price': plan.price}, status=201)


def members(request):
    user = _token_user(request)
    if not user or user.role not in STAFF_ROLES:
        return JsonResponse({'detail': 'Staff authorization required'}, status=403)
    data = [{**_user_payload(member), 'member_id': getattr(member, 'member_profile', None).member_id if hasattr(member, 'member_profile') else None, 'status': getattr(member, 'member_profile', None).status if hasattr(member, 'member_profile') else None} for member in User.objects.filter(role='member').order_by('-date_joined')]
    return JsonResponse({'members': data})


@csrf_exempt
def payments(request):
    user = _token_user(request)
    if not user:
        return JsonResponse({'detail': 'Authentication required'}, status=401)
    if request.method == 'GET':
        query = PaymentRecord.objects.all() if user.role in STAFF_ROLES else PaymentRecord.objects.filter(user=user)
        data = list(query.values('id', 'user_id', 'plan_id', 'amount', 'transaction_reference', 'payment_method', 'status', 'created_at'))
        return JsonResponse({'payments': data})
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    data = _read_json(request)
    try:
        plan = MembershipPlan.objects.get(id=data.get('plan_id'), is_active=True)
    except MembershipPlan.DoesNotExist:
        return JsonResponse({'detail': 'Active membership plan not found'}, status=400)
    payment = PaymentRecord.objects.create(user=user, plan=plan, amount=plan.price, transaction_reference=data.get('transaction_reference', ''), payment_method='upi')
    return JsonResponse({'id': payment.id, 'status': payment.status, 'amount': payment.amount}, status=201)


@csrf_exempt
def verify_payment(request, payment_id):
    user = _token_user(request)
    if request.method != 'POST' or not user or user.role not in STAFF_ROLES:
        return JsonResponse({'detail': 'Staff authorization required'}, status=403)
    try:
        payment = PaymentRecord.objects.get(id=payment_id)
    except PaymentRecord.DoesNotExist:
        return JsonResponse({'detail': 'Payment not found'}, status=404)
    status = _read_json(request).get('status', 'verified')
    if status not in {'verified', 'rejected'}:
        return JsonResponse({'detail': 'status must be verified or rejected'}, status=400)
    with transaction.atomic():
        payment.status = status
        payment.save(update_fields=['status'])
        if status == 'verified':
            payment.user.member_profile.status = 'active'
            payment.user.member_profile.save(update_fields=['status'])
            start_date = timezone.localdate()
            Subscription.objects.create(member=payment.user.member_profile, plan=payment.plan, start_date=start_date, end_date=start_date + __import__('datetime').timedelta(days=payment.plan.duration_days))
    return JsonResponse({'id': payment.id, 'status': payment.status})


def dashboard_summary(request):
    user = _token_user(request)
    if not user or user.role not in STAFF_ROLES:
        return JsonResponse({'detail': 'Staff authorization required'}, status=403)
    total_members = User.objects.filter(role='member').count()
    active_members = MemberProfile.objects.filter(status='active').count()
    pending_payments = PaymentRecord.objects.filter(status='pending').count()
    total_revenue = sum((record.amount for record in PaymentRecord.objects.filter(status='verified')), 0)
    return JsonResponse({'total_members': total_members, 'active_members': active_members, 'pending_payments': pending_payments, 'total_revenue': total_revenue, 'summary': {'members': total_members, 'revenue': total_revenue, 'pending': pending_payments}})


def inquiries(request):
    user = _token_user(request)
    if request.method == 'GET':
        if not user or user.role not in STAFF_ROLES:
            return JsonResponse({'detail': 'Staff authorization required'}, status=403)
        return JsonResponse({'inquiries': list(Inquiry.objects.order_by('-created_at').values('id','name','phone','fitness_goal','status','created_at'))})
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    data = _read_json(request)
    name, phone, goal = (data.get('name') or '').strip(), (data.get('phone') or '').strip(), (data.get('fitness_goal') or '').strip()
    if not name or not phone or not goal:
        return JsonResponse({'detail': 'name, phone, and fitness_goal are required'}, status=400)
    inquiry = Inquiry.objects.create(name=name, phone=phone, fitness_goal=goal)
    return JsonResponse({'id': str(inquiry.id), 'status': inquiry.status}, status=201)


def trials(request):
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    data = _read_json(request)
    phone = (data.get('phone') or '').strip()
    if not phone:
        return JsonResponse({'detail': 'phone is required'}, status=400)
    try:
        trial = Trial.objects.create(phone=phone, start_date=timezone.localdate(), end_date=timezone.localdate(), status='active')
    except IntegrityError:
        return JsonResponse({'detail': 'A trial already exists for this phone number'}, status=409)
    return JsonResponse({'id': str(trial.id), 'start_date': trial.start_date, 'end_date': trial.end_date, 'status': trial.status}, status=201)


def check_in(request):
    user = _token_user(request)
    if request.method != 'POST' or not user or user.role not in STAFF_ROLES | {'member'}:
        return JsonResponse({'detail': 'Authentication required'}, status=401)
    data = _read_json(request)
    try:
        member = MemberProfile.objects.get(id=data.get('member_id'))
    except (MemberProfile.DoesNotExist, ValueError, TypeError):
        return JsonResponse({'detail': 'Member not found'}, status=404)
    if user.role == 'member' and member.user_id != user.id:
        return JsonResponse({'detail': 'Members can only check in themselves'}, status=403)
    attendance, created = Attendance.objects.get_or_create(member=member, session_date=timezone.localdate())
    return JsonResponse({'id': str(attendance.id), 'member_id': member.id, 'session_date': attendance.session_date, 'created': created}, status=201 if created else 200)


def assign_trainer(request, member_id):
    user = _token_user(request)
    if request.method != 'POST' or not user or user.role not in STAFF_ROLES:
        return JsonResponse({'detail': 'Staff authorization required'}, status=403)
    data = _read_json(request)
    try:
        member = MemberProfile.objects.get(id=member_id)
        trainer = Trainer.objects.get(id=data.get('trainer_id'))
    except (MemberProfile.DoesNotExist, Trainer.DoesNotExist, ValueError, TypeError):
        return JsonResponse({'detail': 'Member or trainer not found'}, status=404)
    member.notes = f'trainer:{trainer.id}'
    member.save(update_fields=['notes'])
    return JsonResponse({'member_id': member.id, 'trainer_id': str(trainer.id)})


def workouts(request):
    user = _token_user(request)
    if not user:
        return JsonResponse({'detail': 'Authentication required'}, status=401)
    data = _read_json(request)
    if request.method == 'GET':
        member_id = data.get('member_id') or request.GET.get('member_id')
        query = WorkoutDietPlan.objects.filter(member_id=member_id) if member_id else WorkoutDietPlan.objects.none()
        if user.role == 'member': query = query.filter(member__user=user)
        return JsonResponse({'plans': list(query.values('id','member_id','trainer_id','workout_text','diet_text','updated_at'))})
    if request.method != 'POST' or user.role != 'trainer':
        return JsonResponse({'detail': 'Trainer authorization required'}, status=403)
    try:
        plan, _ = WorkoutDietPlan.objects.update_or_create(member_id=data.get('member_id'), trainer__user=user, defaults={'trainer_id': data.get('trainer_id'), 'workout_text': data.get('workout_text',''), 'diet_text': data.get('diet_text','')})
    except (ValueError, TypeError, IntegrityError):
        return JsonResponse({'detail': 'Valid member_id and trainer_id are required'}, status=400)
    return JsonResponse({'id': str(plan.id), 'updated_at': plan.updated_at}, status=201)
