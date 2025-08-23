// Add this function after your existing functions in CheckoutPage.tsx

const sendOrderConfirmationEmail = async (orderDetails: any, customerInfo: any) => {
  try {
    const response = await fetch('/.netlify/functions/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderDetails,
        customerInfo
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Order confirmation email sent successfully');
      notification.success('Order confirmation email sent to your email address');
    } else {
      console.error('❌ Failed to send confirmation email:', result.error);
      // Don't show error to user as order is still successful
    }
  } catch (error) {
    console.error('❌ Email service error:', error);
    // Don't show error to user as order is still successful
  }
};

// Update your handlePaymentSuccess function - add this after setOrderDetails(newOrder):

const handlePaymentSuccess = async (response: RazorpayResponse | { payment_method: "cod"; order_id: string }) => {
  // ... existing code ...

  const createOrderData = async () => {
    try {
      const customerInfo = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      };

      // ... existing payment info logic ...

      const newOrder = await createOrder(
        cartState.items,
        customerInfo,
        paymentInfo,
        cartState.total,
        shipping,
        tax
      );

      setOrderDetails(newOrder);
      setPaymentSuccess(true);

      // 🔥 ADD THIS - Send order confirmation email
      await sendOrderConfirmationEmail(newOrder, customerInfo);

      await updateProfile({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
      });

      // ... rest of existing code ...
    } catch (error) {
      // ... existing error handling ...
    }
  };

  createOrderData();
};
