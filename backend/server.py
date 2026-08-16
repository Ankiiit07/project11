"""
Shiprocket Integration API Server
Provides real-time order tracking and shipment management
Plus email notifications for shipment status updates
"""

from fastapi import FastAPI, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import httpx
import os
import asyncio
import logging
from enum import Enum
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Email integration
import resend

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Cafe at Once - Shiprocket Integration",
    description="Real-time order tracking and shipment management",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shiprocket Configuration
SHIPROCKET_EMAIL = os.environ.get("SHIPROCKET_EMAIL", "cafeatonce@gmail.com")
SHIPROCKET_PASSWORD = os.environ.get("SHIPROCKET_PASSWORD", "D4sjQZ#W8BUl@xbgBjOujs@kqSvRMxBo")
SHIPROCKET_API_URL = "https://apiv2.shiprocket.in"

# Email Configuration (Resend)
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
resend.api_key = RESEND_API_KEY

# Token cache
_token_cache = {
    "token": None,
    "expiry": None
}

class ShipmentStatus(str, Enum):
    PENDING = "pending"
    PICKED = "picked"
    IN_TRANSIT = "in_transit"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    FAILED = "failed"
    CANCELLED = "cancelled"
    RTO = "rto"

class TrackingCheckpoint(BaseModel):
    date: str
    activity: str
    location: Optional[str] = None
    status: Optional[str] = None

class TrackingResponse(BaseModel):
    success: bool
    order_id: Optional[str] = None
    awb_code: Optional[str] = None
    courier_name: Optional[str] = None
    current_status: Optional[str] = None
    current_status_description: Optional[str] = None
    shipment_status: Optional[int] = None
    delivered_date: Optional[str] = None
    estimated_delivery: Optional[str] = None
    pickup_date: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    checkpoints: List[TrackingCheckpoint] = []
    tracking_url: Optional[str] = None
    message: Optional[str] = None
    error: Optional[str] = None

class CreateShipmentRequest(BaseModel):
    order_id: str
    order_date: str
    pickup_location: str = "Primary"
    channel_id: Optional[int] = None
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_address: str
    customer_city: str
    customer_state: str
    customer_pincode: str
    customer_country: str = "India"
    items: List[Dict[str, Any]]
    payment_method: str = "prepaid"
    sub_total: float
    weight: float = 0.5
    length: float = 10
    breadth: float = 10
    height: float = 10

class CreateShipmentResponse(BaseModel):
    success: bool
    order_id: Optional[int] = None
    shipment_id: Optional[int] = None
    awb_code: Optional[str] = None
    courier_name: Optional[str] = None
    message: Optional[str] = None
    error: Optional[str] = None


async def get_shiprocket_token() -> str:
    """Get or refresh Shiprocket authentication token"""
    global _token_cache
    
    # Check if token is still valid
    if _token_cache["token"] and _token_cache["expiry"]:
        if datetime.utcnow() < _token_cache["expiry"]:
            return _token_cache["token"]
    
    # Get new token
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{SHIPROCKET_API_URL}/v1/external/auth/login",
                json={
                    "email": SHIPROCKET_EMAIL,
                    "password": SHIPROCKET_PASSWORD
                },
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            
            _token_cache["token"] = data.get("token")
            # Token valid for ~10 days, but refresh after 23 hours to be safe
            _token_cache["expiry"] = datetime.utcnow() + timedelta(hours=23)
            
            return _token_cache["token"]
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Failed to authenticate with Shiprocket: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Shiprocket authentication error: {str(e)}"
            )


def map_shiprocket_status(status_code: int) -> dict:
    """Map Shiprocket status codes to readable status"""
    status_map = {
        1: {"status": "AWB_ASSIGNED", "description": "AWB Assigned"},
        2: {"status": "LABEL_GENERATED", "description": "Label Generated"},
        3: {"status": "PICKUP_SCHEDULED", "description": "Pickup Scheduled"},
        4: {"status": "PICKUP_QUEUED", "description": "Pickup Queued"},
        5: {"status": "MANIFESTED", "description": "Manifested"},
        6: {"status": "SHIPPED", "description": "Shipped - In Transit"},
        7: {"status": "DELIVERED", "description": "Delivered"},
        8: {"status": "CANCELLED", "description": "Cancelled"},
        9: {"status": "RTO_INITIATED", "description": "RTO Initiated"},
        10: {"status": "RTO_DELIVERED", "description": "RTO Delivered"},
        11: {"status": "PENDING", "description": "Pending"},
        12: {"status": "LOST", "description": "Lost"},
        13: {"status": "PICKUP_ERROR", "description": "Pickup Error"},
        14: {"status": "RTO_ACKNOWLEDGED", "description": "RTO Acknowledged"},
        15: {"status": "OUT_FOR_PICKUP", "description": "Out For Pickup"},
        16: {"status": "PICKED", "description": "Picked Up"},
        17: {"status": "OUT_FOR_DELIVERY", "description": "Out For Delivery"},
        18: {"status": "IN_TRANSIT", "description": "In Transit"},
        19: {"status": "REACHED_DEST_HUB", "description": "Reached Destination Hub"},
        20: {"status": "UNDELIVERED", "description": "Undelivered - Delivery Attempt Failed"},
    }
    return status_map.get(status_code, {"status": "UNKNOWN", "description": f"Status Code: {status_code}"})


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "service": "shiprocket-integration", "version": "1.0.0"}


@app.get("/api/health")
async def health_check():
    """Health check for API"""
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.get("/api/shiprocket/tracking/{awb_code}", response_model=TrackingResponse)
async def track_by_awb(awb_code: str):
    """
    Get real-time tracking information by AWB code
    """
    try:
        token = await get_shiprocket_token()
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SHIPROCKET_API_URL}/v1/external/courier/track/awb/{awb_code}",
                headers={"Authorization": f"Bearer {token}"},
                timeout=30.0
            )
            
            # Check for HTTP errors
            if response.status_code == 404:
                return TrackingResponse(
                    success=False,
                    awb_code=awb_code,
                    message="No tracking information found for this AWB number. Please check the AWB and try again.",
                    error="AWB not found"
                )
            
            response.raise_for_status()
            data = response.json()
            
            tracking_data = data.get("tracking_data", {}) or {}
            shipment_track = tracking_data.get("shipment_track", []) or []
            
            # Check for error in tracking data
            tracking_error = tracking_data.get("error", "")
            if tracking_error:
                return TrackingResponse(
                    success=False,
                    awb_code=awb_code,
                    message=tracking_error,
                    error="AWB not found"
                )
            
            # If no tracking data found
            if not shipment_track or (shipment_track and not shipment_track[0].get("awb_code")):
                return TrackingResponse(
                    success=False,
                    awb_code=awb_code,
                    message="No tracking information available for this AWB. The shipment may not have been dispatched yet.",
                    error="No tracking data"
                )
            
            # Parse checkpoints
            checkpoints = []
            track_activities = tracking_data.get("shipment_track_activities", []) or []
            for activity in track_activities:
                checkpoints.append(TrackingCheckpoint(
                    date=activity.get("date", ""),
                    activity=activity.get("activity", ""),
                    location=activity.get("location", ""),
                    status=activity.get("sr-status-label", "")
                ))
            
            # Get current status
            current_status_code = tracking_data.get("shipment_status", 0)
            status_info = map_shiprocket_status(current_status_code)
            
            # Get track info
            track_info = shipment_track[0] if shipment_track else {}
            
            return TrackingResponse(
                success=True,
                order_id=str(track_info.get("order_id", "")),
                awb_code=awb_code,
                courier_name=track_info.get("courier_name", ""),
                current_status=status_info["status"],
                current_status_description=status_info["description"],
                shipment_status=current_status_code,
                delivered_date=track_info.get("delivered_date"),
                estimated_delivery=track_info.get("edd"),
                pickup_date=track_info.get("pickup_date"),
                origin=track_info.get("origin", ""),
                destination=track_info.get("destination", ""),
                checkpoints=checkpoints,
                tracking_url=f"https://www.shiprocket.in/shipment-tracking/?awb={awb_code}",
                message="Tracking information retrieved successfully"
            )
            
    except httpx.HTTPStatusError as e:
        # If authentication fails, return error
        if e.response.status_code in [401, 403]:
            return TrackingResponse(
                success=False,
                awb_code=awb_code,
                error="Authentication failed with Shiprocket",
                message="Unable to authenticate with shipping provider. Please contact support."
            )
        return TrackingResponse(
            success=False,
            awb_code=awb_code,
            error=f"Shiprocket API error: {e.response.status_code}",
            message="Failed to fetch tracking information"
        )
    except Exception as e:
        return TrackingResponse(
            success=False,
            awb_code=awb_code,
            error=str(e),
            message="An error occurred while fetching tracking information"
        )


def get_demo_tracking(awb_code: str) -> TrackingResponse:
    """Return demo tracking data for testing when API is unavailable"""
    from datetime import datetime, timedelta
    
    # Generate realistic demo data based on AWB
    now = datetime.utcnow()
    
    demo_checkpoints = [
        TrackingCheckpoint(
            date=(now - timedelta(hours=2)).isoformat(),
            activity="Shipment Out for Delivery",
            location="Mumbai Hub",
            status="OUT_FOR_DELIVERY"
        ),
        TrackingCheckpoint(
            date=(now - timedelta(hours=8)).isoformat(),
            activity="Arrived at Destination Hub",
            location="Mumbai Hub",
            status="REACHED_DEST_HUB"
        ),
        TrackingCheckpoint(
            date=(now - timedelta(days=1)).isoformat(),
            activity="In Transit - Moving to Destination",
            location="Pune Sorting Center",
            status="IN_TRANSIT"
        ),
        TrackingCheckpoint(
            date=(now - timedelta(days=1, hours=12)).isoformat(),
            activity="Shipment Picked Up",
            location="Warehouse - Pune",
            status="PICKED"
        ),
        TrackingCheckpoint(
            date=(now - timedelta(days=2)).isoformat(),
            activity="Order Confirmed - Ready for Pickup",
            location="Cafe at Once Warehouse",
            status="MANIFESTED"
        ),
    ]
    
    return TrackingResponse(
        success=True,
        order_id=f"CAO{awb_code[-6:]}",
        awb_code=awb_code,
        courier_name="Delhivery Express",
        current_status="OUT_FOR_DELIVERY",
        current_status_description="Out For Delivery",
        shipment_status=17,
        delivered_date=None,
        estimated_delivery=(now + timedelta(hours=4)).strftime("%Y-%m-%d"),
        pickup_date=(now - timedelta(days=1, hours=12)).strftime("%Y-%m-%d %H:%M"),
        origin="Pune, Maharashtra",
        destination="Mumbai, Maharashtra",
        checkpoints=demo_checkpoints,
        tracking_url=f"https://www.shiprocket.in/shipment-tracking/?awb={awb_code}",
        message="Demo tracking data (Shiprocket credentials need to be updated)"
    )


@app.get("/api/shiprocket/tracking/order/{order_id}", response_model=TrackingResponse)
async def track_by_order_id(order_id: str):
    """
    Get tracking information by Shiprocket order ID
    """
    try:
        token = await get_shiprocket_token()
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SHIPROCKET_API_URL}/v1/external/courier/track",
                params={"order_id": order_id},
                headers={"Authorization": f"Bearer {token}"},
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            
            # Parse response
            if not data or len(data) == 0:
                return TrackingResponse(
                    success=False,
                    order_id=order_id,
                    message="No tracking data found for this order"
                )
            
            tracking_info = data[0] if isinstance(data, list) else data
            
            # Get AWB and fetch detailed tracking
            awb_code = tracking_info.get("awb_code")
            if awb_code:
                return await track_by_awb(awb_code)
            
            return TrackingResponse(
                success=True,
                order_id=order_id,
                current_status=tracking_info.get("current_status", "PENDING"),
                message="Basic tracking info available"
            )
            
    except Exception as e:
        return TrackingResponse(
            success=False,
            order_id=order_id,
            error=str(e),
            message="Failed to fetch tracking"
        )


@app.post("/api/shiprocket/shipment/create", response_model=CreateShipmentResponse)
async def create_shipment(request: CreateShipmentRequest):
    """
    Create a new shipment order in Shiprocket
    """
    try:
        token = await get_shiprocket_token()
        
        # Prepare order items
        order_items = []
        for item in request.items:
            order_items.append({
                "name": item.get("name", "Coffee Product"),
                "sku": item.get("sku", item.get("id", "SKU001")),
                "units": item.get("quantity", 1),
                "selling_price": item.get("price", 0),
                "discount": 0,
                "tax": 0,
                "hsn": ""
            })
        
        # Create order payload
        order_payload = {
            "order_id": request.order_id,
            "order_date": request.order_date,
            "pickup_location": request.pickup_location,
            "billing_customer_name": request.customer_name,
            "billing_last_name": "",
            "billing_address": request.customer_address,
            "billing_address_2": "",
            "billing_city": request.customer_city,
            "billing_pincode": request.customer_pincode,
            "billing_state": request.customer_state,
            "billing_country": request.customer_country,
            "billing_email": request.customer_email,
            "billing_phone": request.customer_phone,
            "shipping_is_billing": True,
            "order_items": order_items,
            "payment_method": request.payment_method.upper(),
            "sub_total": request.sub_total,
            "length": request.length,
            "breadth": request.breadth,
            "height": request.height,
            "weight": request.weight
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SHIPROCKET_API_URL}/v1/external/orders/create/adhoc",
                json=order_payload,
                headers={"Authorization": f"Bearer {token}"},
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            
            return CreateShipmentResponse(
                success=True,
                order_id=data.get("order_id"),
                shipment_id=data.get("shipment_id"),
                awb_code=data.get("awb_code"),
                courier_name=data.get("courier_name"),
                message="Shipment created successfully"
            )
            
    except httpx.HTTPStatusError as e:
        error_detail = ""
        try:
            error_detail = e.response.json()
        except Exception:
            error_detail = str(e)
        return CreateShipmentResponse(
            success=False,
            error=f"Shiprocket API error: {error_detail}",
            message="Failed to create shipment"
        )
    except Exception as e:
        return CreateShipmentResponse(
            success=False,
            error=str(e),
            message="An error occurred"
        )


@app.get("/api/shiprocket/couriers")
async def get_courier_serviceability(
    pickup_pincode: str,
    delivery_pincode: str,
    weight: float = 0.5,
    cod: int = 0
):
    """
    Check courier serviceability for a pincode
    """
    try:
        token = await get_shiprocket_token()
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SHIPROCKET_API_URL}/v1/external/courier/serviceability/",
                params={
                    "pickup_postcode": pickup_pincode,
                    "delivery_postcode": delivery_pincode,
                    "weight": weight,
                    "cod": cod
                },
                headers={"Authorization": f"Bearer {token}"},
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            
            couriers = data.get("data", {}).get("available_courier_companies", [])
            
            return {
                "success": True,
                "serviceable": len(couriers) > 0,
                "couriers": [
                    {
                        "id": c.get("courier_company_id"),
                        "name": c.get("courier_name"),
                        "rate": c.get("rate"),
                        "estimated_days": c.get("estimated_delivery_days"),
                        "cod_available": c.get("cod") == 1,
                        "min_weight": c.get("min_weight"),
                        "rating": c.get("rating")
                    }
                    for c in couriers[:5]  # Return top 5 couriers
                ]
            }
            
    except Exception as e:
        return {
            "success": False,
            "serviceable": False,
            "couriers": [],
            "error": str(e)
        }


@app.get("/api/shiprocket/orders")
async def get_orders(page: int = 1, per_page: int = 20):
    """
    Get list of orders from Shiprocket
    """
    try:
        token = await get_shiprocket_token()
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SHIPROCKET_API_URL}/v1/external/orders",
                params={"page": page, "per_page": per_page},
                headers={"Authorization": f"Bearer {token}"},
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            
            return {
                "success": True,
                "orders": data.get("data", []),
                "meta": data.get("meta", {})
            }
            
    except Exception as e:
        return {
            "success": False,
            "orders": [],
            "error": str(e)
        }


@app.post("/api/shiprocket/awb/generate")
async def generate_awb(shipment_id: int, courier_id: int):
    """
    Generate AWB for a shipment
    """
    try:
        token = await get_shiprocket_token()
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SHIPROCKET_API_URL}/v1/external/courier/assign/awb",
                json={
                    "shipment_id": shipment_id,
                    "courier_id": courier_id
                },
                headers={"Authorization": f"Bearer {token}"},
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            
            return {
                "success": True,
                "awb_code": data.get("response", {}).get("data", {}).get("awb_code"),
                "courier_name": data.get("response", {}).get("data", {}).get("courier_name"),
                "message": "AWB generated successfully"
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Failed to generate AWB"
        }


class CreateOrderWithAWBRequest(BaseModel):
    """Request model for creating order with automatic AWB assignment"""
    order_id: str
    order_date: str
    pickup_location: str = "Primary"
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_address: str
    customer_city: str
    customer_state: str
    customer_pincode: str
    customer_country: str = "India"
    items: List[Dict[str, Any]]
    payment_method: str = "prepaid"  # prepaid or cod
    sub_total: float
    shipping_charges: float = 0
    weight: float = 0.5  # in kg
    length: float = 10  # in cm
    breadth: float = 10  # in cm
    height: float = 10  # in cm


class CreateOrderWithAWBResponse(BaseModel):
    """Response model for order with AWB"""
    success: bool
    order_id: Optional[str] = None
    shiprocket_order_id: Optional[int] = None
    shipment_id: Optional[int] = None
    awb_code: Optional[str] = None
    courier_name: Optional[str] = None
    courier_id: Optional[int] = None
    label_url: Optional[str] = None
    estimated_delivery: Optional[str] = None
    message: Optional[str] = None
    error: Optional[str] = None


@app.post("/api/shiprocket/order/create-with-awb", response_model=CreateOrderWithAWBResponse)
async def create_order_with_awb(request: CreateOrderWithAWBRequest):
    """
    Create a new order in Shiprocket and automatically assign AWB.
    This is a complete flow that:
    1. Creates the order in Shiprocket
    2. Gets available couriers
    3. Assigns AWB for the shipment
    4. Returns complete shipping details
    5. Caches customer info for webhook notifications
    """
    try:
        token = await get_shiprocket_token()
        
        # Cache customer info for webhook notifications
        cache_order_customer_info(
            order_id=request.order_id,
            customer_email=request.customer_email,
            customer_name=request.customer_name
        )
        
        # Step 1: Prepare order items
        order_items = []
        for item in request.items:
            order_items.append({
                "name": item.get("name", "Coffee Product"),
                "sku": item.get("sku", item.get("id", f"SKU-{request.order_id}")),
                "units": item.get("quantity", 1),
                "selling_price": item.get("price", 0),
                "discount": 0,
                "tax": 0,
                "hsn": ""
            })
        
        # Step 2: Create order payload
        order_payload = {
            "order_id": request.order_id,
            "order_date": request.order_date,
            "pickup_location": request.pickup_location,
            "billing_customer_name": request.customer_name,
            "billing_last_name": "",
            "billing_address": request.customer_address,
            "billing_address_2": "",
            "billing_city": request.customer_city,
            "billing_pincode": request.customer_pincode,
            "billing_state": request.customer_state,
            "billing_country": request.customer_country,
            "billing_email": request.customer_email,
            "billing_phone": request.customer_phone,
            "shipping_is_billing": True,
            "order_items": order_items,
            "payment_method": request.payment_method.upper(),
            "shipping_charges": request.shipping_charges,
            "sub_total": request.sub_total,
            "length": request.length,
            "breadth": request.breadth,
            "height": request.height,
            "weight": request.weight
        }
        
        async with httpx.AsyncClient() as client:
            # Step 3: Create order in Shiprocket
            create_response = await client.post(
                f"{SHIPROCKET_API_URL}/v1/external/orders/create/adhoc",
                json=order_payload,
                headers={"Authorization": f"Bearer {token}"},
                timeout=30.0
            )
            
            if create_response.status_code != 200:
                error_data = create_response.json() if create_response.text else {}
                return CreateOrderWithAWBResponse(
                    success=False,
                    order_id=request.order_id,
                    error=f"Failed to create order: {error_data}",
                    message="Order creation failed in Shiprocket"
                )
            
            create_data = create_response.json()
            shiprocket_order_id = create_data.get("order_id")
            shipment_id = create_data.get("shipment_id")
            
            if not shipment_id:
                return CreateOrderWithAWBResponse(
                    success=True,
                    order_id=request.order_id,
                    shiprocket_order_id=shiprocket_order_id,
                    message="Order created but shipment ID not generated. AWB will be assigned when ready.",
                )
            
            # Step 4: Get available couriers for this shipment
            # Shiprocket warehouse pincode (default to Mumbai warehouse)
            pickup_pincode = "400001"  # Can be configured based on actual warehouse
            
            courier_response = await client.get(
                f"{SHIPROCKET_API_URL}/v1/external/courier/serviceability/",
                params={
                    "pickup_postcode": pickup_pincode,
                    "delivery_postcode": request.customer_pincode,
                    "weight": request.weight,
                    "cod": 1 if request.payment_method.lower() == "cod" else 0
                },
                headers={"Authorization": f"Bearer {token}"},
                timeout=30.0
            )
            
            courier_data = courier_response.json() if courier_response.status_code == 200 else {}
            available_couriers = courier_data.get("data", {}).get("available_courier_companies", [])
            
            if not available_couriers:
                return CreateOrderWithAWBResponse(
                    success=True,
                    order_id=request.order_id,
                    shiprocket_order_id=shiprocket_order_id,
                    shipment_id=shipment_id,
                    message="Order created but no couriers available for this pincode. AWB will be assigned manually.",
                )
            
            # Select the best courier (lowest rate with good rating)
            # Sort by a combination of rate and rating
            sorted_couriers = sorted(
                available_couriers,
                key=lambda c: (c.get("rate", 999), -c.get("rating", 0))
            )
            selected_courier = sorted_couriers[0]
            courier_id = selected_courier.get("courier_company_id")
            courier_name = selected_courier.get("courier_name")
            estimated_days = selected_courier.get("estimated_delivery_days", "3-5")
            
            # Step 5: Assign AWB
            awb_response = await client.post(
                f"{SHIPROCKET_API_URL}/v1/external/courier/assign/awb",
                json={
                    "shipment_id": shipment_id,
                    "courier_id": courier_id
                },
                headers={"Authorization": f"Bearer {token}"},
                timeout=30.0
            )
            
            if awb_response.status_code != 200:
                return CreateOrderWithAWBResponse(
                    success=True,
                    order_id=request.order_id,
                    shiprocket_order_id=shiprocket_order_id,
                    shipment_id=shipment_id,
                    courier_name=courier_name,
                    courier_id=courier_id,
                    message="Order created but AWB assignment failed. It will be assigned when the courier picks up.",
                )
            
            awb_data = awb_response.json()
            awb_response_data = awb_data.get("response", {}).get("data", {})
            awb_code = awb_response_data.get("awb_code")
            label_url = awb_response_data.get("label_url")
            
            # Calculate estimated delivery date
            from datetime import datetime, timedelta
            try:
                days = int(estimated_days.split("-")[0]) if "-" in str(estimated_days) else int(estimated_days)
            except (ValueError, AttributeError):
                days = 5
            estimated_delivery = (datetime.utcnow() + timedelta(days=days)).strftime("%Y-%m-%d")
            
            return CreateOrderWithAWBResponse(
                success=True,
                order_id=request.order_id,
                shiprocket_order_id=shiprocket_order_id,
                shipment_id=shipment_id,
                awb_code=awb_code,
                courier_name=courier_name,
                courier_id=courier_id,
                label_url=label_url,
                estimated_delivery=estimated_delivery,
                message="Order created and AWB assigned successfully"
            )
            
    except httpx.HTTPStatusError as e:
        error_detail = ""
        try:
            error_detail = e.response.json()
        except Exception:
            error_detail = str(e)
        return CreateOrderWithAWBResponse(
            success=False,
            order_id=request.order_id,
            error=f"Shiprocket API error: {error_detail}",
            message="Failed to create order with AWB"
        )
    except Exception as e:
        return CreateOrderWithAWBResponse(
            success=False,
            order_id=request.order_id,
            error=str(e),
            message="An error occurred while processing the order"
        )


@app.get("/api/shiprocket/pickup-locations")
async def get_pickup_locations():
    """
    Get all pickup locations configured in Shiprocket
    """
    try:
        token = await get_shiprocket_token()
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SHIPROCKET_API_URL}/v1/external/settings/company/pickup",
                headers={"Authorization": f"Bearer {token}"},
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()
            
            locations = data.get("data", {}).get("shipping_address", [])
            
            return {
                "success": True,
                "locations": [
                    {
                        "id": loc.get("id"),
                        "pickup_location": loc.get("pickup_location"),
                        "name": loc.get("name"),
                        "address": loc.get("address"),
                        "city": loc.get("city"),
                        "state": loc.get("state"),
                        "pincode": loc.get("pin_code"),
                        "phone": loc.get("phone"),
                        "is_primary": loc.get("status") == 1
                    }
                    for loc in locations
                ]
            }
            
    except Exception as e:
        return {
            "success": False,
            "locations": [],
            "error": str(e)
        }


# =============================================
# EMAIL NOTIFICATION ENDPOINTS
# =============================================

class EmailNotificationRequest(BaseModel):
    """Request model for sending shipment notification email"""
    recipient_email: EmailStr
    customer_name: str
    order_id: str
    awb_code: Optional[str] = None
    status: str
    status_description: str
    courier_name: Optional[str] = None
    estimated_delivery: Optional[str] = None
    tracking_url: Optional[str] = None


class EmailResponse(BaseModel):
    """Response model for email operations"""
    success: bool
    message: str
    email_id: Optional[str] = None
    error: Optional[str] = None


def generate_shipment_email_html(
    customer_name: str,
    order_id: str,
    status: str,
    status_description: str,
    awb_code: Optional[str] = None,
    courier_name: Optional[str] = None,
    estimated_delivery: Optional[str] = None,
    tracking_url: Optional[str] = None
) -> str:
    """Generate HTML email content for shipment status updates"""
    
    # Status colors
    status_colors = {
        "DELIVERED": "#10B981",  # Green
        "OUT_FOR_DELIVERY": "#3B82F6",  # Blue
        "IN_TRANSIT": "#F59E0B",  # Yellow/Amber
        "SHIPPED": "#F59E0B",
        "PICKED": "#8B5CF6",  # Purple
        "PENDING": "#6B7280",  # Gray
        "CANCELLED": "#EF4444",  # Red
        "RTO": "#F97316",  # Orange
    }
    status_color = status_colors.get(status.upper(), "#6B7280")
    
    tracking_section = ""
    if tracking_url and awb_code:
        tracking_section = f"""
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="text-align: center;">
                            <a href="{tracking_url}" target="_blank" style="background-color: #8B7355; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                Track Your Order
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        """
    
    delivery_info = ""
    if estimated_delivery:
        delivery_info = f"""
        <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
                <strong style="color: #374151;">Estimated Delivery:</strong>
                <span style="color: #6B7280; float: right;">{estimated_delivery}</span>
            </td>
        </tr>
        """
    
    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shipment Update - Cafe at Once</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F9FAFB;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #8B7355 0%, #6B5344 100%); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
                            <h1 style="margin: 0; color: white; font-size: 24px; font-weight: bold;">☕ Cafe at Once</h1>
                            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Premium Coffee Concentrates</p>
                        </td>
                    </tr>
                    
                    <!-- Status Banner -->
                    <tr>
                        <td style="padding: 25px 30px; text-align: center; background-color: #FEF3C7;">
                            <div style="display: inline-block; background-color: {status_color}; color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold; font-size: 14px; text-transform: uppercase;">
                                {status_description}
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">
                            <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                Hi <strong>{customer_name}</strong>,
                            </p>
                            <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                Great news! Your order status has been updated.
                            </p>
                            
                            <!-- Order Details Card -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F9FAFB; border-radius: 12px; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
                                                    <strong style="color: #374151;">Order ID:</strong>
                                                    <span style="color: #6B7280; float: right;">{order_id}</span>
                                                </td>
                                            </tr>
                                            {f'''<tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
                                                    <strong style="color: #374151;">AWB Number:</strong>
                                                    <span style="color: #6B7280; float: right;">{awb_code}</span>
                                                </td>
                                            </tr>''' if awb_code else ''}
                                            {f'''<tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
                                                    <strong style="color: #374151;">Courier:</strong>
                                                    <span style="color: #6B7280; float: right;">{courier_name}</span>
                                                </td>
                                            </tr>''' if courier_name else ''}
                                            <tr>
                                                <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
                                                    <strong style="color: #374151;">Current Status:</strong>
                                                    <span style="color: {status_color}; float: right; font-weight: bold;">{status_description}</span>
                                                </td>
                                            </tr>
                                            {delivery_info}
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            {tracking_section}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 30px; background-color: #F9FAFB; border-radius: 0 0 16px 16px; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">
                                Questions? Contact us at <a href="mailto:support@cafeatonce.com" style="color: #8B7355; text-decoration: none;">support@cafeatonce.com</a>
                            </p>
                            <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                                © 2026 Cafe at Once. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""


async def send_email_async(params: dict) -> dict:
    """Send email asynchronously using thread to avoid blocking"""
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        return {"success": False, "error": str(e)}


@app.post("/api/notifications/shipment-status", response_model=EmailResponse)
async def send_shipment_status_notification(
    request: EmailNotificationRequest,
    background_tasks: BackgroundTasks
):
    """
    Send email notification for shipment status updates.
    Supports all shipment statuses: PENDING, PICKED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, RTO
    """
    if not RESEND_API_KEY:
        return EmailResponse(
            success=False,
            message="Email service not configured",
            error="RESEND_API_KEY not set"
        )
    
    try:
        # Generate email HTML
        html_content = generate_shipment_email_html(
            customer_name=request.customer_name,
            order_id=request.order_id,
            status=request.status,
            status_description=request.status_description,
            awb_code=request.awb_code,
            courier_name=request.courier_name,
            estimated_delivery=request.estimated_delivery,
            tracking_url=request.tracking_url
        )
        
        # Prepare email parameters
        params = {
            "from": SENDER_EMAIL,
            "to": [request.recipient_email],
            "subject": f"Order Update: {request.status_description} - Order #{request.order_id}",
            "html": html_content
        }
        
        # Send email asynchronously (non-blocking)
        result = await send_email_async(params)
        
        if result["success"]:
            logger.info(f"Shipment notification sent to {request.recipient_email} for order {request.order_id}")
            return EmailResponse(
                success=True,
                message=f"Notification email sent to {request.recipient_email}",
                email_id=result.get("result", {}).get("id")
            )
        else:
            return EmailResponse(
                success=False,
                message="Failed to send notification email",
                error=result.get("error")
            )
            
    except Exception as e:
        logger.error(f"Notification email error: {str(e)}")
        return EmailResponse(
            success=False,
            message="An error occurred while sending notification",
            error=str(e)
        )


@app.post("/api/notifications/order-confirmation", response_model=EmailResponse)
async def send_order_confirmation_email(
    request: EmailNotificationRequest
):
    """
    Send order confirmation email when a new order is placed.
    """
    if not RESEND_API_KEY:
        return EmailResponse(
            success=False,
            message="Email service not configured",
            error="RESEND_API_KEY not set"
        )
    
    try:
        # Generate email HTML with order confirmation styling
        html_content = generate_shipment_email_html(
            customer_name=request.customer_name,
            order_id=request.order_id,
            status="PENDING",
            status_description="Order Confirmed",
            awb_code=request.awb_code,
            courier_name=request.courier_name,
            estimated_delivery=request.estimated_delivery,
            tracking_url=request.tracking_url
        )
        
        # Prepare email parameters
        params = {
            "from": SENDER_EMAIL,
            "to": [request.recipient_email],
            "subject": f"Order Confirmed! Your Order #{request.order_id} is being processed",
            "html": html_content
        }
        
        # Send email
        result = await send_email_async(params)
        
        if result["success"]:
            logger.info(f"Order confirmation sent to {request.recipient_email} for order {request.order_id}")
            return EmailResponse(
                success=True,
                message=f"Order confirmation email sent to {request.recipient_email}",
                email_id=result.get("result", {}).get("id")
            )
        else:
            return EmailResponse(
                success=False,
                message="Failed to send order confirmation",
                error=result.get("error")
            )
            
    except Exception as e:
        logger.error(f"Order confirmation email error: {str(e)}")
        return EmailResponse(
            success=False,
            message="An error occurred while sending confirmation",
            error=str(e)
        )


# =============================================
# SHIPROCKET WEBHOOK ENDPOINTS
# =============================================

class ShiprocketWebhookPayload(BaseModel):
    """Model for Shiprocket webhook payload"""
    awb: Optional[str] = None
    courier_name: Optional[str] = None
    current_status: Optional[str] = None
    current_status_id: Optional[int] = None
    shipment_status: Optional[str] = None
    shipment_status_id: Optional[int] = None
    order_id: Optional[str] = None
    etd: Optional[str] = None  # Estimated Time of Delivery
    current_timestamp: Optional[str] = None
    # Additional fields that may be present
    scans: Optional[List[Dict[str, Any]]] = None
    
    class Config:
        extra = "allow"  # Allow additional fields


# In-memory store for order customer info (In production, use a database)
# This stores customer info keyed by order_id for webhook notifications
_order_customer_cache: Dict[str, Dict[str, str]] = {}


def cache_order_customer_info(order_id: str, customer_email: str, customer_name: str):
    """Store customer info for an order to send email notifications on webhook"""
    _order_customer_cache[order_id] = {
        "email": customer_email,
        "name": customer_name
    }
    logger.info(f"Cached customer info for order {order_id}")


def get_cached_customer_info(order_id: str) -> Optional[Dict[str, str]]:
    """Retrieve cached customer info for an order"""
    return _order_customer_cache.get(order_id)


@app.post("/api/webhooks/shiprocket")
async def shiprocket_webhook(
    payload: ShiprocketWebhookPayload,
    background_tasks: BackgroundTasks
):
    """
    Webhook endpoint for Shiprocket status updates.
    Shiprocket sends POST requests when shipment status changes.
    
    Configure this URL in Shiprocket Dashboard:
    Settings > API > Webhooks > Add Webhook URL
    
    Supported events: All shipment status changes
    """
    try:
        logger.info(f"Received Shiprocket webhook: {payload.model_dump()}")
        
        order_id = payload.order_id
        awb_code = payload.awb
        status = payload.current_status or payload.shipment_status or "UNKNOWN"
        status_id = payload.current_status_id or payload.shipment_status_id
        courier_name = payload.courier_name
        estimated_delivery = payload.etd
        
        # Get status description
        status_info = map_shiprocket_status(status_id) if status_id else {"status": status, "description": status}
        status_description = status_info.get("description", status)
        
        # Try to get customer info from cache
        customer_info = get_cached_customer_info(order_id) if order_id else None
        
        if customer_info and RESEND_API_KEY:
            # Send email notification in background
            tracking_url = f"https://www.shiprocket.in/shipment-tracking/?awb={awb_code}" if awb_code else None
            
            async def send_notification():
                try:
                    html_content = generate_shipment_email_html(
                        customer_name=customer_info["name"],
                        order_id=order_id,
                        status=status,
                        status_description=status_description,
                        awb_code=awb_code,
                        courier_name=courier_name,
                        estimated_delivery=estimated_delivery,
                        tracking_url=tracking_url
                    )
                    
                    params = {
                        "from": SENDER_EMAIL,
                        "to": [customer_info["email"]],
                        "subject": f"Shipment Update: {status_description} - Order #{order_id}",
                        "html": html_content
                    }
                    
                    result = await send_email_async(params)
                    if result["success"]:
                        logger.info(f"Webhook notification sent for order {order_id}")
                    else:
                        logger.error(f"Webhook notification failed: {result.get('error')}")
                except Exception as e:
                    logger.error(f"Error sending webhook notification: {str(e)}")
            
            background_tasks.add_task(send_notification)
            
            return {
                "status": "received",
                "message": "Webhook processed, notification queued",
                "order_id": order_id,
                "awb": awb_code,
                "current_status": status,
                "notification_sent": True
            }
        else:
            # Log the event but no email (customer info not cached or email not configured)
            logger.info(f"Webhook received but no notification sent (no cached customer or no email config)")
            return {
                "status": "received",
                "message": "Webhook processed, no notification sent",
                "order_id": order_id,
                "awb": awb_code,
                "current_status": status,
                "notification_sent": False,
                "reason": "No customer info cached" if not customer_info else "Email service not configured"
            }
            
    except Exception as e:
        logger.error(f"Webhook processing error: {str(e)}")
        # Always return 200 to Shiprocket to prevent retries
        return {
            "status": "error",
            "message": str(e),
            "notification_sent": False
        }


@app.get("/api/webhooks/shiprocket/info")
async def webhook_info():
    """
    Get information about the webhook endpoint for Shiprocket configuration.
    """
    return {
        "webhook_url": "/api/webhooks/shiprocket",
        "method": "POST",
        "content_type": "application/json",
        "supported_events": [
            "AWB_ASSIGNED",
            "PICKUP_SCHEDULED",
            "PICKED",
            "IN_TRANSIT",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
            "RTO_INITIATED",
            "RTO_DELIVERED"
        ],
        "setup_instructions": {
            "step_1": "Login to Shiprocket Dashboard",
            "step_2": "Go to Settings > API > Webhooks",
            "step_3": "Click 'Add Webhook URL'",
            "step_4": "Enter your webhook URL (e.g., https://your-domain.com/api/webhooks/shiprocket)",
            "step_5": "Select events to subscribe to",
            "step_6": "Save and test the webhook"
        },
        "note": "Ensure your webhook URL is publicly accessible for Shiprocket to send events"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
