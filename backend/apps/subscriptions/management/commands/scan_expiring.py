from datetime import timedelta
from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.utils import timezone
from apps.subscriptions.models import Subscription

class Command(BaseCommand):
    help = 'Email members whose subscriptions expire in exactly three days.'

    def handle(self, *args, **options):
        target = timezone.localdate() + timedelta(days=3)
        subscriptions = Subscription.objects.select_related('member__user').filter(end_date=target)
        sent = 0
        for subscription in subscriptions:
            email = subscription.member.user.email
            if email:
                send_mail('Gym membership expires soon', f'Your membership expires on {target}. Please contact the gym to renew.', None, [email], fail_silently=False)
                sent += 1
        self.stdout.write(self.style.SUCCESS(f'Processed {subscriptions.count()} expiring subscriptions; sent {sent} reminders.'))
