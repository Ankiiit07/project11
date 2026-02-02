// Manual test of shipping calculator functionality
const { calculateShipping, formatWeight, DEFAULT_SHIPPING_RATES } = require('./src/utils/shippingCalculator.ts');

console.log('🧮 Testing Shipping Calculator Logic...\n');

// Test data based on products.ts
const testItems = [
  { weight: 100, quantity: 1, price: 199 }, // Americano
  { weight: 100, quantity: 1, price: 199 }, // Latte
];

console.log('📦 Test Scenario 1: Two 100g items (₹398 total)');
console.log('Items:', testItems);

const result1 = calculateShipping(testItems, 398);
console.log('Shipping Result:', result1);
console.log('Expected: Base ₹50 + Item charge ₹10 = ₹60');
console.log('Actual shipping charge:', result1.shippingCharge);
console.log('Total weight:', formatWeight(result1.totalWeight));
console.log('Is free shipping:', result1.isFreeShipping);
console.log('Breakdown:', result1.breakdown);

console.log('\n📦 Test Scenario 2: High value order (₹1200 total)');
const result2 = calculateShipping(testItems, 1200);
console.log('Shipping Result:', result2);
console.log('Expected: Free shipping (above ₹1000)');
console.log('Actual shipping charge:', result2.shippingCharge);
console.log('Is free shipping:', result2.isFreeShipping);

console.log('\n📦 Test Scenario 3: Heavy items (600g total)');
const heavyItems = [
  { weight: 300, quantity: 2, price: 699 }, // Trial pack
];
const result3 = calculateShipping(heavyItems, 699);
console.log('Items:', heavyItems);
console.log('Shipping Result:', result3);
console.log('Expected: Base ₹50 + Weight charge ₹30 + Item charge ₹10 = ₹90');
console.log('Actual shipping charge:', result3.shippingCharge);
console.log('Total weight:', formatWeight(result3.totalWeight));
console.log('Breakdown:', result3.breakdown);

console.log('\n✅ Shipping calculator test completed');