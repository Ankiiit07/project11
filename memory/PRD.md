# Cafe at Once - PRD (Product Requirements Document)

## Original Problem Statement
1. Add shipping charges with order based on weight/quantity of items
2. Add shipping estimates by pincode
3. Add express shipping option with 1-day delivery only for Mumbai location
4. Integrate Shiprocket for real-time order tracking

## Architecture & Implementation

### Shipping Calculator (`/app/src/utils/shippingCalculator.ts`)
- **Base Rate**: ₹50 (includes first 500g)
- **Per KG Rate**: ₹30 per additional kg
- **Per Item Rate**: ₹10 per additional item after first
- **Free Shipping Threshold**: Orders above ₹1000
- **Express Shipping**: ₹99 (Mumbai only)

### Shiprocket Integration (`/app/backend/server.py`)
- FastAPI backend for Shiprocket API integration
- Real-time tracking by AWB code
- Tracking by order ID
- Courier serviceability check
- Shipment creation
- AWB generation

**API Endpoints:**
- `GET /api/shiprocket/tracking/{awb_code}` - Track by AWB
- `GET /api/shiprocket/tracking/order/{order_id}` - Track by order ID
- `POST /api/shiprocket/shipment/create` - Create shipment
- `GET /api/shiprocket/couriers` - Check courier availability
- `POST /api/shiprocket/awb/generate` - Generate AWB

**Note**: Shiprocket credentials need to be updated with valid API credentials.
Current credentials returning 403 - using demo data for testing.

### Delivery Zones
| Zone | Pincodes | Standard Days | Express Available | Express Days |
|------|----------|---------------|-------------------|--------------|
| Mumbai | 400001-400104, 401101-401210 | 2-3 | ✅ Yes | 1 |
| Metro Cities | Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad | 3-5 | ❌ No | - |
| Rest of India | All others | 5-7 | ❌ No | - |

### Product Weight
All products have a `weight` property (in grams):
- Latte Concentrate: 100g
- Americano: 100g
- Cold Brew: 120g
- Mocha: 110g
- Jasmine Tea: 80g
- Espresso Shot: 50g
- Corn Silk: 50g
- Trial Pack: 300g

### Updated Files
1. `/app/src/data/products.ts` - Added weight property to all products
2. `/app/src/context/CartContextOptimized.tsx` - Added weight to CartItem interface
3. `/app/src/utils/shippingCalculator.ts` - Shipping calculation with pincode zones & express option
4. `/app/src/pages/CartPage.tsx` - Shows shipping with weight breakdown
5. `/app/src/pages/CheckoutPage.tsx` - Delivery options UI with Standard/Express selection
6. `/app/src/pages/ThankYouPage.tsx` - Shows shipping in order confirmation
7. `/app/src/pages/OrderDetailsPage.tsx` - Shows shipping breakdown
8. `/app/src/pages/OrderTrackingPage.tsx` - **NEW** - Real-time Shiprocket tracking page
9. `/app/backend/server.py` - **NEW** - FastAPI backend for Shiprocket integration
10. `/app/src/App.tsx` - Added /track route
11. `/app/src/components/Footer.tsx` - Added "Track Your Order" link

## What's Been Implemented
- [x] Weight-based shipping calculation
- [x] Quantity-based shipping calculation  
- [x] Free shipping for orders above ₹1000
- [x] Pincode validation (6-digit Indian pincodes)
- [x] Zone-based delivery estimates
- [x] Express Delivery option for Mumbai (₹99, next day)
- [x] Delivery date estimates shown at checkout
- [x] Dynamic shipping option selection
- [x] Order summary updates with selected shipping method
- [x] Shiprocket API integration for tracking
- [x] Real-time shipment tracking page
- [x] Tracking timeline with checkpoints
- [x] Auto-refresh tracking option

## User Personas
- **Mumbai Customers**: Can choose Express (1-day) or Standard (2-3 days) delivery
- **Metro City Customers**: Standard delivery in 3-5 days
- **Other Customers**: Standard delivery in 5-7 days

## Core Requirements (Static)
- Shipping calculated based on product weight and quantity
- Free shipping threshold at ₹1000
- Express delivery ONLY for Mumbai addresses
- Display delivery estimates based on pincode
- Real-time order tracking via Shiprocket

## Prioritized Backlog

### P0 - Completed
- Weight-based shipping calculation
- Free shipping threshold
- Pincode-based delivery estimates
- Express shipping for Mumbai
- Shiprocket tracking integration

### P1 - Future
- [ ] Valid Shiprocket API credentials (current demo mode)
- [ ] SMS notifications for delivery updates
- [ ] Automatic shipment creation when order is placed
- [ ] Webhook for status updates

### P2 - Nice to Have
- [ ] Multiple delivery addresses per user
- [ ] Gift wrapping option
- [ ] Delivery notes/instructions
- [ ] Live map tracking

## Next Tasks
1. Get valid Shiprocket API credentials from client
2. Connect order placement flow to create Shiprocket shipment
3. Add webhook for automatic status updates
4. Add SMS notifications via Twilio

---
Last Updated: 2026-02-02
