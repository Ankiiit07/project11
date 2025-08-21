# Razorpay Integration Setup Guide

## 🚀 Current Status

✅ **Frontend Integration Complete**
- Razorpay test key configured: `rzp_test_Glauu4hA3vRcyV`
- Callback URL set: `https://eneqd3r9zrjok.x.pipedream.net/`
- Direct payment integration working
- Test page available at `/razorpay-test`

## ⚠️ Issues Resolved

### Problem 1: CORS Error
```
Access to fetch at 'http://localhost:5001/api/v1/payments/create-order' 
from origin 'http://localhost:5180' has been blocked by CORS policy
```

### Problem 2: Razorpay 400 Error
```
Failed to load resource: the server responded with a status of 400 (Bad Request)
```

### Root Causes
1. **CORS**: Backend server at `localhost:5001` not running/configured
2. **Razorpay 400**: Mock order IDs not valid in Razorpay system

### Solutions

#### Option 1: Start Backend Server (Recommended)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm run dev
```

#### Option 2: Configure CORS in Backend
If backend is running but CORS is not configured, add this to your backend:

```javascript
// In your backend server (Express.js example)
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5180', 'http://localhost:3000'],
  credentials: true
}));
```

#### Option 3: Use Direct Integration (Current - RECOMMENDED)
The current implementation bypasses the backend and uses direct Razorpay integration without order IDs. Razorpay creates orders automatically.

## 🧪 Testing

### Test Page
Visit: `http://localhost:5180/razorpay-test`

### Test Cards
- **Success**: `4111 1111 1111 1111` (any future expiry, any CVV)
- **Failure**: `4000 0000 0000 0002` (triggers payment failure)

### Expected Behavior
1. **Payment Success**: Shows 3 alerts (Payment ID, Order ID, Signature)
2. **Payment Failure**: Shows detailed error alerts
3. **Callback**: Data sent to Pipedream URL
4. **WhatsApp**: Notification sent for successful payments

## 🔧 Configuration

### Environment Variables
```env
VITE_RAZORPAY_KEY_ID=rzp_test_Glauu4hA3vRcyV
```

### Key Files
- `src/services/razorpay.ts` - Main payment service
- `src/hooks/useRazorpay.ts` - React hook for payments
- `src/pages/RazorpayTestPage.tsx` - Test interface
- `src/types/razorpay.d.ts` - TypeScript definitions

## 🎯 Features

### ✅ Implemented
- Direct Razorpay integration
- Payment success/failure handling
- Callback URL support
- WhatsApp notifications
- Error handling with alerts
- Test interface
- Mobile responsive design

### 🔄 Development Mode
- Uses mock orders for testing
- Bypasses backend dependency
- Always returns successful verification
- Real-time test results

## 🚀 Production Setup

For production, you'll need:

1. **Real Razorpay Key**: Replace test key with live key
2. **Backend Server**: Implement proper order creation
3. **Payment Verification**: Server-side signature verification
4. **Error Handling**: Proper error logging and monitoring
5. **Security**: HTTPS, proper CORS, input validation

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Razorpay key is correct
3. Ensure backend server is running (if using backend integration)
4. Test with provided test cards
5. Check Pipedream callback URL for payment data

## 🔗 Useful Links

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Test Cards](https://razorpay.com/docs/payments/payments/test-mode/test-cards/)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) 