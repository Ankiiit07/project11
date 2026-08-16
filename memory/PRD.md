# Cafe at Once - PRD (Product Requirements Document)

## Original Problem Statement
1. Add shipping charges with order based on weight/quantity of items
2. Add shipping estimates by pincode
3. Add express shipping option with 1-day delivery only for Mumbai location
4. Integrate Shiprocket for real-time order tracking
5. Integrate Shiprocket "Create Order" API for automatic AWB generation
6. Email notifications when shipment status changes
7. Webhook receiver for automatic status updates from Shiprocket

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
- Shipment creation with automatic AWB assignment
- AWB generation

**API Endpoints:**
- `GET /api/shiprocket/tracking/{awb_code}` - Track by AWB
- `GET /api/shiprocket/tracking/order/{order_id}` - Track by order ID
- `POST /api/shiprocket/shipment/create` - Create shipment
- `POST /api/shiprocket/order/create-with-awb` - Create order + assign AWB automatically
- `GET /api/shiprocket/couriers` - Check courier availability
- `POST /api/shiprocket/awb/generate` - Generate AWB
- `GET /api/shiprocket/pickup-locations` - Get pickup locations

### Email Notification Service (`/app/backend/server.py`)
- Resend API integration for transactional emails
- Beautiful HTML email templates with status-based styling
- Non-blocking async email sending

**Email Endpoints:**
- `POST /api/notifications/shipment-status` - Send shipment status update email
- `POST /api/notifications/order-confirmation` - Send order confirmation email

### Shiprocket Webhook Integration (`/app/backend/server.py`)
- Receives real-time status updates from Shiprocket
- Automatically sends email notifications on status change
- Caches customer info for webhook notifications

**Webhook Endpoints:**
- `POST /api/webhooks/shiprocket` - Receives Shiprocket status webhooks
- `GET /api/webhooks/shiprocket/info` - Webhook setup instructions

**Shiprocket Credentials:**
- Email: cafeatonce@gmail.com
- Password: D4sjQZ#W8BUl@xbgBjOujs@kqSvRMxBo (Live credentials)

**Resend Email Credentials:**
- API Key: re_6Jicmms1_Q2icpBcr7an3vLDj4vPykFPt
- Sender: onboarding@resend.dev (Test mode)

### Delivery Zones
| Zone | Pincodes | Standard Days | Express Available | Express Days |
|------|----------|---------------|-------------------|--------------|
| Mumbai | 400001-400104, 401101-401210 | 2-3 | Yes | 1 |
| Metro Cities | Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad | 3-5 | No | - |
| Rest of India | All others | 5-7 | No | - |

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
5. `/app/src/pages/CheckoutPage.tsx` - Delivery options UI + Shiprocket order creation + Email notifications
6. `/app/src/pages/ThankYouPage.tsx` - Shows shipping in order confirmation
7. `/app/src/pages/OrderDetailsPage.tsx` - Shows shipping breakdown
8. `/app/src/pages/OrderTrackingPage.tsx` - Real-time Shiprocket tracking page
9. `/app/backend/server.py` - FastAPI backend for Shiprocket + Email + Webhook integration
10. `/app/src/App.tsx` - Added /track route
11. `/app/src/components/Footer.tsx` - Added "Track Your Order" link
12. `/app/src/services/shiprocketService.ts` - Frontend service for Shiprocket API calls
13. `/app/src/services/emailService.ts` - **NEW** - Frontend service for email notifications

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
- [x] Automatic Shiprocket order creation on checkout
- [x] **NEW** Email notifications for shipment status updates (via Resend)
- [x] **NEW** Order confirmation emails sent on checkout
- [x] **NEW** Shiprocket webhook receiver for automatic status updates

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
- Email notifications when shipment status changes

## Prioritized Backlog

### P0 - Completed
- Weight-based shipping calculation
- Free shipping threshold
- Pincode-based delivery estimates
- Express shipping for Mumbai
- Shiprocket tracking integration
- Shiprocket order creation on checkout
- Email notifications (Resend integration)
- Shiprocket webhook for automatic status updates

### P1 - In Progress / Next
- [ ] Order History Tracking - Show AWB number and tracking link in user's order history page
- [ ] Pickup location configuration in admin panel

### P2 - Future
- [ ] SMS notifications for delivery updates (Twilio integration)
- [ ] Multiple delivery addresses per user
- [ ] Gift wrapping option
- [ ] Delivery notes/instructions
- [ ] Live map tracking

## Notes
- Shiprocket integration is fully functional with live credentials
- Order creation automatically assigns AWB when couriers are available
- If AWB assignment fails, orders are still created and AWB can be assigned manually
- The tracking page gracefully handles "AWB not found" errors
- Email notifications use Resend API in test mode (only verified emails work)
- Webhook URL must be configured in Shiprocket Dashboard: Settings > API > Webhooks
- **IMPORTANT**: Shiprocket account lacks warehouse configuration, so AWB/shipment_id may be null

---
Last Updated: 2026-08-16
