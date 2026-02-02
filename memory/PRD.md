# Cafe at Once - PRD (Product Requirements Document)

## Original Problem Statement
1. Add shipping charges with order based on weight/quantity of items
2. Add shipping estimates by pincode
3. Add express shipping option with 1-day delivery only for Mumbai location

## Architecture & Implementation

### Shipping Calculator (`/app/src/utils/shippingCalculator.ts`)
- **Base Rate**: ₹50 (includes first 500g)
- **Per KG Rate**: ₹30 per additional kg
- **Per Item Rate**: ₹10 per additional item after first
- **Free Shipping Threshold**: Orders above ₹1000
- **Express Shipping**: ₹99 (Mumbai only)

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
8. `/app/src/components/ProductCard.tsx` - Passes weight when adding to cart
9. `/app/src/pages/ProductDetailPage.tsx` - Passes weight when adding to cart

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

## User Personas
- **Mumbai Customers**: Can choose Express (1-day) or Standard (2-3 days) delivery
- **Metro City Customers**: Standard delivery in 3-5 days
- **Other Customers**: Standard delivery in 5-7 days

## Core Requirements (Static)
- Shipping calculated based on product weight and quantity
- Free shipping threshold at ₹1000
- Express delivery ONLY for Mumbai addresses
- Display delivery estimates based on pincode

## Prioritized Backlog

### P0 - Completed
- Weight-based shipping calculation
- Free shipping threshold
- Pincode-based delivery estimates
- Express shipping for Mumbai

### P1 - Future
- [ ] Scheduled delivery time slots
- [ ] Real-time courier rate integration (Delhivery, Blue Dart)
- [ ] Order tracking integration

### P2 - Nice to Have
- [ ] Multiple delivery addresses per user
- [ ] Gift wrapping option
- [ ] Delivery notes/instructions

## Next Tasks
1. Integrate with Shiprocket for real tracking
2. Add order tracking page with live status
3. SMS notifications for delivery updates

---
Last Updated: 2026-02-02
