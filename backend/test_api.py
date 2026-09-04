from fastapi.testclient import TestClient
from app.main import app
from app.core.security import get_password_hash, verify_password
from app.database import SessionLocal
from app.models.user import User

client = TestClient(app)


def test_argon2id_hashing():
    """Verify Argon2id hash generation and verification parameters."""
    pwd = "SecurePassword@2026!"
    hashed = get_password_hash(pwd)
    
    # Verify hash algorithm signature
    assert hashed.startswith("$argon2id$"), f"Expected $argon2id$ hash prefix, got {hashed[:15]}"
    assert "m=65536,t=3,p=4" in hashed, f"Expected OWASP memory/time/parallelism parameters, got {hashed}"
    
    # Verify valid and invalid checks
    assert verify_password(pwd, hashed) is True
    assert verify_password("WrongPassword@123", hashed) is False
    assert verify_password("", hashed) is False
    assert verify_password(pwd, "") is False
    print("✅ Argon2id hashing & verification tests passed ($argon2id$, m=65536, t=3, p=4)")


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    print("✅ /api/health passed")


def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["docs"] == "/api/docs"
    print("✅ / passed")


def test_plans():
    res = client.get("/api/plans")
    assert res.status_code == 200
    plans = res.json()
    assert len(plans) >= 4
    print(f"✅ /api/plans passed (retrieved {len(plans)} plans)")


def test_login_and_auth():
    # Admin login with email & password
    res = client.post("/api/auth/login", json={"email": "admin@gymforce.com", "password": "Admin@123"})
    assert res.status_code == 200
    token = res.json()["access_token"]
    assert token
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ /api/auth/login (Admin) passed")

    # Case-insensitive email login
    res_case = client.post("/api/auth/login", json={"email": "ADMIN@GYMFORCE.COM", "password": "Admin@123"})
    assert res_case.status_code == 200
    print("✅ /api/auth/login (Case-insensitive email) passed")

    # Invalid password login check
    res_bad = client.post("/api/auth/login", json={"email": "admin@gymforce.com", "password": "WrongPassword!"})
    assert res_bad.status_code == 401
    print("✅ /api/auth/login (Invalid password rejection) passed")

    # /api/auth/me
    res_me = client.get("/api/auth/me", headers=headers)
    assert res_me.status_code == 200
    assert res_me.json()["email"] == "admin@gymforce.com"
    print("✅ /api/auth/me passed")

    # /api/dashboard/summary
    res_dash = client.get("/api/dashboard/summary", headers=headers)
    assert res_dash.status_code == 200
    summary = res_dash.json()
    assert "total_members" in summary
    assert "total_revenue" in summary
    print(f"✅ /api/dashboard/summary passed (Revenue: ₹{summary['total_revenue']}, Members: {summary['total_members']})")

    # /api/members
    res_members = client.get("/api/members", headers=headers)
    assert res_members.status_code == 200
    print(f"✅ /api/members passed (Count: {len(res_members.json())})")


def test_user_registration():
    """Test registering a new user with email and password."""
    test_email = "newmember_argon2@gymforce.com"
    
    # Delete existing test user if any
    db = SessionLocal()
    existing = db.query(User).filter(User.email == test_email).first()
    if existing:
        db.delete(existing)
        db.commit()
    db.close()

    reg_payload = {
        "email": test_email,
        "password": "StrongMemberPassword#2026",
        "full_name": "Argon2 Test User",
        "phone": "+91 91234 56789",
        "gender": "male",
        "gym": "GymForce HQ",
    }
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 201, f"Registration failed: {res.text}"
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == test_email
    print("✅ /api/auth/register (Argon2id hashing) passed")

    # Verify stored hash format in database
    db = SessionLocal()
    user_in_db = db.query(User).filter(User.email == test_email).first()
    assert user_in_db is not None
    assert user_in_db.hashed_password.startswith("$argon2id$")
    db.close()
    print("✅ Verified database stores $argon2id$ hash for newly registered user")

    # Verify login with newly registered user
    login_res = client.post("/api/auth/login", json={
        "email": test_email,
        "password": "StrongMemberPassword#2026",
    })
    assert login_res.status_code == 200
    print("✅ /api/auth/login with newly registered user passed")


def test_public_inquiry_and_trial():
    # Submit inquiry
    res_inq = client.post("/api/inquiries", json={
        "name": "Test User",
        "email": "test@example.com",
        "phone": "+91 99999 11111",
        "interest": "Personal Training",
        "message": "Interested in a free consultation",
    })
    assert res_inq.status_code == 201
    print("✅ /api/inquiries (POST) passed")

    # Clean up test trial if exists to keep test idempotent
    from app.models.subscription import Trial
    db = SessionLocal()
    db.query(Trial).filter(Trial.phone == "+91 99999 22222").delete()
    db.commit()
    db.close()

    # Request trial
    res_trial = client.post("/api/subscriptions/trials", json={
        "phone": "+91 99999 22222",
    })
    assert res_trial.status_code == 201
    print("✅ /api/subscriptions/trials (POST) passed")



if __name__ == "__main__":
    print("🧪 Running FastAPI API endpoint and Argon2id security tests...")
    test_argon2id_hashing()
    test_health()
    test_root()
    test_plans()
    test_login_and_auth()
    test_user_registration()
    test_public_inquiry_and_trial()
    print("\n🎉 All tests passed successfully with Argon2id authentication!")

