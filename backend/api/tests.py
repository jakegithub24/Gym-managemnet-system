from django.test import TestCase

from apps.members.models import MemberProfile
from apps.plans.models import MembershipPlan
from apps.subscriptions.models import Subscription, Trial
from apps.users.models import User


class AuthApiTests(TestCase):
    def test_health_endpoint(self):
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'ok')

    def test_register_validates_required_fields_and_password_length(self):
        missing = self.client.post('/api/auth/register/', {'email': 'demo@example.com'}, content_type='application/json')
        short_password = self.client.post('/api/auth/register/', {'email': 'demo@example.com', 'full_name': 'Demo User', 'password': 'short'}, content_type='application/json')
        self.assertEqual(missing.status_code, 400)
        self.assertEqual(short_password.status_code, 400)

    def test_register_and_login_flow(self):
        response = self.client.post('/api/auth/register/', {'email': 'demo@example.com', 'password': 'pass1234', 'full_name': 'Demo User'}, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['role'], 'member')
        self.assertTrue(response.json()['access_token'])
        duplicate = self.client.post('/api/auth/register/', {'email': 'DEMO@example.com', 'password': 'pass1234', 'full_name': 'Duplicate'}, content_type='application/json')
        self.assertEqual(duplicate.status_code, 400)
        login = self.client.post('/api/auth/login/', {'email': 'demo@example.com', 'password': 'pass1234'}, content_type='application/json')
        self.assertEqual(login.status_code, 200)
        self.assertTrue(login.json()['access_token'])

    def test_invalid_login_is_rejected(self):
        User.objects.create_user(username='member@example.com', email='member@example.com', password='pass1234', role='member')
        response = self.client.post('/api/auth/login/', {'email': 'member@example.com', 'password': 'wrongpass'}, content_type='application/json')
        self.assertEqual(response.status_code, 401)


class GymWorkflowApiTests(TestCase):
    def setUp(self):
        self.member = User.objects.create_user(username='member@example.com', email='member@example.com', password='pass1234', first_name='Member', role='member')
        MemberProfile.objects.create(user=self.member, member_id='MEM-00001')
        self.staff = User.objects.create_user(username='staff@example.com', email='staff@example.com', password='pass1234', first_name='Staff', role='master_admin')
        self.plan = MembershipPlan.objects.create(name='Monthly', duration_days=30, price=999)
        self.member_token = self._login(self.member.email)
        self.staff_token = self._login(self.staff.email)

    def _login(self, email):
        return self.client.post('/api/auth/login/', {'email': email, 'password': 'pass1234'}, content_type='application/json').json()['access_token']

    def test_plans_are_public_and_staff_can_create(self):
        public = self.client.get('/api/plans/')
        self.assertEqual(public.status_code, 200)
        self.assertEqual(len(public.json()['plans']), 1)
        forbidden = self.client.post('/api/plans/', {'name': 'Annual', 'duration_days': 365, 'price': 9000}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {self.member_token}')
        self.assertEqual(forbidden.status_code, 403)
        created = self.client.post('/api/plans/', {'name': 'Annual', 'duration_days': 365, 'price': 9000}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {self.staff_token}')
        self.assertEqual(created.status_code, 201)

    def test_member_payment_and_staff_verification_flow(self):
        payment = self.client.post('/api/payments/', {'plan_id': self.plan.id, 'transaction_reference': 'UTR123'}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {self.member_token}')
        self.assertEqual(payment.status_code, 201)
        self.assertEqual(payment.json()['status'], 'pending')
        member_payments = self.client.get('/api/payments/', HTTP_AUTHORIZATION=f'Bearer {self.member_token}')
        self.assertEqual(member_payments.status_code, 200)
        self.assertEqual(len(member_payments.json()['payments']), 1)
        verify = self.client.post(f"/api/payments/{payment.json()['id']}/verify/", {'status': 'verified'}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {self.member_token}')
        self.assertEqual(verify.status_code, 403)
        reject = self.client.post(f"/api/payments/{payment.json()['id']}/verify/", {'status': 'rejected'}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {self.staff_token}')
        self.assertEqual(reject.status_code, 200)
        self.assertEqual(reject.json()['status'], 'rejected')

    def test_staff_dashboard_and_member_listing_require_staff(self):
        member_summary = self.client.get('/api/dashboard/summary/', HTTP_AUTHORIZATION=f'Bearer {self.member_token}')
        member_list = self.client.get('/api/members/', HTTP_AUTHORIZATION=f'Bearer {self.member_token}')
        self.assertEqual(member_summary.status_code, 403)
        self.assertEqual(member_list.status_code, 403)
        staff_summary = self.client.get('/api/dashboard/summary/', HTTP_AUTHORIZATION=f'Bearer {self.staff_token}')
        staff_list = self.client.get('/api/members/', HTTP_AUTHORIZATION=f'Bearer {self.staff_token}')
        self.assertEqual(staff_summary.status_code, 200)
        self.assertEqual(staff_summary.json()['total_members'], 1)
        self.assertEqual(staff_list.status_code, 200)
        self.assertEqual(staff_list.json()['members'][0]['member_id'], 'MEM-00001')

    def test_verified_payment_activates_member_and_creates_subscription(self):
        payment = self.client.post('/api/payments/', {'plan_id': self.plan.id, 'transaction_reference': 'UTR456'}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {self.member_token}')
        verify = self.client.post(f"/api/payments/{payment.json()['id']}/verify/", {'status': 'verified'}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {self.staff_token}')
        self.assertEqual(verify.status_code, 200)
        self.member.refresh_from_db()
        self.assertEqual(self.member.member_profile.status, 'active')
        subscription = Subscription.objects.get(member=self.member.member_profile)
        self.assertEqual(subscription.end_date, subscription.start_date + __import__('datetime').timedelta(days=30))

    def test_trial_phone_is_rejected_by_database_unique_constraint(self):
        from django.db import IntegrityError
        from django.utils import timezone
        Trial.objects.create(phone='9999999999', start_date=timezone.localdate(), end_date=timezone.localdate())
        with self.assertRaises(IntegrityError):
            Trial.objects.create(phone='9999999999', start_date=timezone.localdate(), end_date=timezone.localdate())

    def test_public_inquiry_is_created_and_staff_can_read_it(self):
        created = self.client.post('/api/inquiries/', {'name': 'Lead', 'phone': '8888888888', 'fitness_goal': 'Strength'}, content_type='application/json')
        self.assertEqual(created.status_code, 201)
        leads = self.client.get('/api/inquiries/', HTTP_AUTHORIZATION=f'Bearer {self.staff_token}')
        self.assertEqual(leads.status_code, 200)
        self.assertEqual(leads.json()['inquiries'][0]['name'], 'Lead')

    def test_unauthenticated_payment_access_is_rejected(self):
        response = self.client.get('/api/payments/')
        self.assertEqual(response.status_code, 401)
