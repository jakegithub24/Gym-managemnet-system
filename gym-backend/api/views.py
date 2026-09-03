from datetime import timedelta
import json

import jwt
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

from apps.members.models import MemberProfile
from apps.payments.models import PaymentRecord
from apps.plans.models import MembershipPlan

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
    payment.status = status
    payment.save(update_fields=['status'])
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
