# Cafe at Once - PRD (Product Requirements Document)

## Original Problem Statement
Add shipping charges with order based on weight/quantity of items. Display shipping on both checkout and order confirmation pages.

## Architecture & Implementation

### Shipping Calculator (`/app/src/utils/shippingCalculator.ts`)
- **Base Rate**: ₹50 (includes first 500g)
- **Per KG Rate**: ₹30 per additional kg
- **Per Item Rate**: ₹10 per additional item after first
- **Free Shipping Threshold**: Orders above ₹1000

### Product Weight
All products now have a `weight` property (in grams):
- Latte Concentrate: 100g
- Americano: 100g
- Cold Brew: 120g
- Mocha: 110g
- Jasmine Tea: 80g
- Espresso Shot: 50g
- Corn Silk: 50g
- Trial Pack: 300g

### Updated Files
1. `/app/src/data/products.ts` - Added weight property to Product interface and all products
2. `/app/src/context/CartContextOptimized.tsx` - Added weight to CartItem interface
3. `/app/src/utils/shippingCalculator.ts` - NEW - Shipping calculation utility
4. `/app/src/pages/CartPage.tsx` - Shows shipping with weight breakdown
5. `/app/src/pages/CheckoutPage.tsx` - Shows shipping details with free shipping badge
6. `/app/src/pages/ThankYouPage.tsx` - Shows shipping in order confirmation
7. `/app/src/pages/OrderDetailsPage.tsx` - Shows shipping breakdown in order details
8. `/app/src/components/ProductCard.tsx` - Passes weight when adding to cart
9. `/app/src/pages/ProductDetailPage.tsx` - Passes weight when adding to cart
10. `/app/src/pages/ProductsPage.tsx` - Updated addToCart to include weight

## What's Been Implemented
- [x] Weight-based shipping calculation
- [x] Quantity-based shipping calculation
- [x] Free shipping for orders above ₹1000
- [x] Weight display on Cart page (e.g., "Shipping (180 g): ₹60")
- [x] Weight display on Checkout page
- [x] Free shipping badge when order qualifies
- [x] Shipping breakdown details
- [x] "Add ₹X more for free shipping" message
- [x] Shipping shown in order confirmation

## User Personas
- **Customers**: Can see transparent shipping costs based on their cart weight
- **Returning customers**: Know how much more to add for free shipping

## Core Requirements (Static)
- Shipping must be calculated based on product weight and quantity
- Free shipping threshold at ₹1000
- Display shipping on cart and checkout
- Show weight breakdown to customers

## Prioritized Backlog

### P0 - Completed
- Weight-based shipping calculation
- Free shipping threshold
- Cart and checkout display

### P1 - Future
- [ ] Location-based shipping rates
- [ ] Express shipping option
- [ ] Shipping estimation by pincode

### P2 - Nice to Have
- [ ] Multiple delivery options (standard/express)
- [ ] Scheduled delivery
- [ ] Real-time courier rate integration

## Next Tasks
1. Add data-testid attributes for better testing
2. Consider adding shipping rate configuration in admin panel
3. Integrate with actual courier API for dynamic rates

---
Last Updated: 2026-02-02
