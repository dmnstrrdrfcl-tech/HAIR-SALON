"""Backend regression tests for SERENDIPITY salon API."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://beauty-salon-pro-10.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Catalog endpoints ----------
class TestCatalog:
    def test_services(self, session):
        r = session.get(f"{API}/services", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        ids = {s["id"] for s in data}
        assert {"corte", "tinte", "peinado", "tratamiento"}.issubset(ids)
        assert len(data) == 4
        for s in data:
            assert {"id", "name", "description", "duration", "price"}.issubset(s.keys())

    def test_stylists(self, session):
        r = session.get(f"{API}/stylists", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 4
        assert {"sofia", "mateo", "luna", "diego"} == {s["id"] for s in data}

    def test_gallery(self, session):
        r = session.get(f"{API}/gallery", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list) and len(data) > 0
        assert all("url" in x and "id" in x for x in data)

    def test_testimonials(self, session):
        r = session.get(f"{API}/testimonials", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list) and len(data) > 0
        assert all("text" in t and "name" in t for t in data)


# ---------- Bookings ----------
class TestAvailability:
    def test_availability_format(self, session):
        r = session.get(f"{API}/bookings/availability", params={"stylist_id": "sofia", "date": "2026-01-15"}, timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert data["stylist_id"] == "sofia"
        assert data["date"] == "2026-01-15"
        assert isinstance(data["slots"], list)
        assert len(data["slots"]) == 10
        for s in data["slots"]:
            assert "time" in s and "available" in s
            assert isinstance(s["available"], bool)


class TestBookingFlow:
    # Use unique date for this run to avoid collisions
    UNIQUE_DATE = f"2027-0{(uuid.uuid4().int % 9) + 1}-15"
    UNIQUE_TIME = "11:00"
    STYLIST = "luna"
    SERVICE = "corte"

    def test_create_booking_and_persist(self, session):
        payload = {
            "service_id": self.SERVICE,
            "stylist_id": self.STYLIST,
            "date": self.UNIQUE_DATE,
            "time": self.UNIQUE_TIME,
            "name": "TEST_User",
            "email": "test_user@example.com",
            "phone": "+34123456789",
            "notes": "TEST_booking",
        }
        r = session.post(f"{API}/bookings", json=payload, timeout=20)
        assert r.status_code == 200, r.text
        booking = r.json()
        assert booking["service_id"] == self.SERVICE
        assert booking["stylist_id"] == self.STYLIST
        assert booking["date"] == self.UNIQUE_DATE
        assert booking["time"] == self.UNIQUE_TIME
        assert booking["status"] == "confirmed"
        assert "id" in booking and len(booking["id"]) > 0
        assert "_id" not in booking

        # Verify availability now reports booked
        a = session.get(f"{API}/bookings/availability", params={"stylist_id": self.STYLIST, "date": self.UNIQUE_DATE}).json()
        slot = next(x for x in a["slots"] if x["time"] == self.UNIQUE_TIME)
        assert slot["available"] is False

        # Verify GET /bookings includes it
        listing = session.get(f"{API}/bookings", timeout=20)
        assert listing.status_code == 200
        ids = [b["id"] for b in listing.json()]
        assert booking["id"] in ids

    def test_conflict_returns_409(self, session):
        payload = {
            "service_id": self.SERVICE,
            "stylist_id": self.STYLIST,
            "date": self.UNIQUE_DATE,
            "time": self.UNIQUE_TIME,
            "name": "TEST_User2",
            "email": "test_user2@example.com",
            "phone": "+34123456789",
        }
        r = session.post(f"{API}/bookings", json=payload, timeout=20)
        assert r.status_code == 409, r.text

    def test_invalid_service(self, session):
        payload = {
            "service_id": "invalid_service",
            "stylist_id": "sofia",
            "date": "2027-05-20",
            "time": "10:00",
            "name": "x", "email": "x@x.com", "phone": "1",
        }
        r = session.post(f"{API}/bookings", json=payload)
        assert r.status_code == 400

    def test_invalid_stylist(self, session):
        payload = {
            "service_id": "corte",
            "stylist_id": "nope",
            "date": "2027-05-20",
            "time": "10:00",
            "name": "x", "email": "x@x.com", "phone": "1",
        }
        r = session.post(f"{API}/bookings", json=payload)
        assert r.status_code == 400

    def test_invalid_time(self, session):
        payload = {
            "service_id": "corte",
            "stylist_id": "sofia",
            "date": "2027-05-20",
            "time": "14:00",  # not in slots
            "name": "x", "email": "x@x.com", "phone": "1",
        }
        r = session.post(f"{API}/bookings", json=payload)
        assert r.status_code == 400


class TestContact:
    def test_create_contact(self, session):
        r = session.post(f"{API}/contact", json={
            "name": "TEST_Contact",
            "email": "test_contact@example.com",
            "message": "TEST_message hello",
        }, timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "TEST_Contact"
        assert data["email"] == "test_contact@example.com"
        assert "id" in data
        assert "_id" not in data
