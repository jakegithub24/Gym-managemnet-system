# Gym Management Backend

Django API for inquiries, member onboarding, plans, UPI payment verification, subscriptions, attendance, trainer assignment, workouts, and expiry reminders.

## Local commands

```bash
python manage.py migrate
python manage.py runserver
python manage.py test api
python manage.py scan_expiring
```

Open Django Ninja API documentation at `/api/docs/`. Configure PostgreSQL with `DB_ENGINE=postgres`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT`; local development defaults to SQLite.
