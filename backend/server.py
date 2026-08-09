"""
Shiprocket Integration API Server
Provides real-time order tracking and shipment management
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import httpx
import os
from enum import Enum

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
    """
    try:
        token = await get_shiprocket_token()
        
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
