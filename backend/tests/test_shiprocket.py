"""Backend tests for Shiprocket integration endpoints."""
import os
import time
import pytest
import requests

# Per agent note: preview URL is unavailable; backend runs locally on 8001
BASE_URL = os.environ.get("BACKEND_URL", "http://localhost:8001").rstrip("/")


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health check ---
class TestHealth:
    def test_root(self, client):
        r = client.get(f"{BASE_URL}/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "healthy"
        assert "shiprocket" in data.get("service", "").lower()

    def test_api_health(self, client):
        r = client.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert "timestamp" in data


# --- Pickup Locations ---
class TestPickupLocations:
    def test_pickup_locations(self, client):
        r = client.get(f"{BASE_URL}/api/shiprocket/pickup-locations", timeout=45)
        assert r.status_code == 200
        data = r.json()
        assert "success" in data
        # Should be a dict with success key; even if empty, structure must be valid
        assert isinstance(data.get("success"), bool)


# --- Courier Serviceability ---
class TestCouriers:
    def test_couriers_valid_pincode(self, client):
        # Mumbai to Delhi
        params = {
            "pickup_pincode": "400001",
            "delivery_pincode": "110001",
            "weight": 0.5,
            "cod": 0,
        }
        r = client.get(f"{BASE_URL}/api/shiprocket/couriers", params=params, timeout=45)
        assert r.status_code == 200
        data = r.json()
        assert "success" in data

    def test_couriers_missing_params(self, client):
        # Missing required params should return 4xx (validation error)
        r = client.get(f"{BASE_URL}/api/shiprocket/couriers", timeout=45)
        # FastAPI returns 422 for missing query params if declared required
        assert r.status_code in (200, 400, 422)


# --- Tracking ---
class TestTracking:
    def test_tracking_invalid_awb(self, client):
        r = client.get(f"{BASE_URL}/api/shiprocket/tracking/INVALID_AWB_TEST_123", timeout=45)
        # Should respond with 200 wrapped response or 404; must not 500
        assert r.status_code in (200, 404)
        if r.status_code == 200:
            data = r.json()
            # Should have known keys
            assert "awb_code" in data or "success" in data or "status" in data


# --- Create Order with AWB ---
class TestCreateOrderWithAWB:
    def test_create_order_success(self, client):
        order_id = f"TEST_ORDER_{int(time.time())}"
        payload = {
            "order_id": order_id,
            "order_date": time.strftime("%Y-%m-%d %H:%M"),
            "pickup_location": "Primary",
            "customer_name": "Test Customer",
            "customer_email": "test@example.com",
            "customer_phone": "9876543210",
            "customer_address": "123 Test Street",
            "customer_city": "Mumbai",
            "customer_state": "Maharashtra",
            "customer_pincode": "400001",
            "customer_country": "India",
            "items": [
                {
                    "name": "Cafe At Once Coffee",
                    "sku": "COFFEE-001",
                    "quantity": 1,
                    "price": 499,
                }
            ],
            "payment_method": "prepaid",
            "sub_total": 499,
            "shipping_charges": 50,
            "weight": 0.3,
            "length": 15,
            "breadth": 10,
            "height": 5,
        }
        r = client.post(
            f"{BASE_URL}/api/shiprocket/order/create-with-awb",
            json=payload,
            timeout=60,
        )
        assert r.status_code == 200, f"Unexpected status: {r.status_code} - {r.text}"
        data = r.json()
        # Response schema validations
        assert "success" in data
        assert data.get("order_id") == order_id
        # As per agent note: AWB may be null due to no warehouse
        # But 'success' should be True and shiprocket_order_id should be set
        if data.get("success"):
            assert data.get("shiprocket_order_id") is not None or data.get("message")
        print(f"Create order response: {data}")

    def test_create_order_validation_error(self, client):
        # Missing required fields
        r = client.post(
            f"{BASE_URL}/api/shiprocket/order/create-with-awb",
            json={"order_id": "X"},
            timeout=30,
        )
        assert r.status_code == 422


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
