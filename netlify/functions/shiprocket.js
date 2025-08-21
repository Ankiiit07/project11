import fetch from "node-fetch";

let shiprocketToken = null;
let tokenExpiry = null;

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

// LOGIN FUNCTION WITH TOKEN CACHING
async function loginToShiprocket() {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "cafeatonce@gmail.com", // replace with env variable for security
      password: "H7cJ33rk*0$p23c7",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Login failed: ${data.message}`);
  }

  shiprocketToken = data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 hours caching
  return shiprocketToken;
}

// VALIDATE PAYLOAD FOR CREATE ORDER
function validateCreateOrderPayload(payload) {
  const requiredFields = [
    "order_id",
    "order_date",
    "pickup_location",
    "billing_customer_name",
    "billing_customer_email",
    "billing_customer_phone",
    "billing_address",
    "billing_city",
    "billing_pincode",
    "billing_state",
    "billing_country",
    "order_items",
    "payment_method",
  ];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

export async function handler(event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { action, payload } = body;

    if (!action) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'action' in request body" }),
      };
    }

    const token = await loginToShiprocket();
    let data;

    if (action === "createOrder") {
      validateCreateOrderPayload(payload);

      const res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      data = await res.json();

      if (!res.ok) {
        console.error("Shiprocket createOrder error:", data);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: data }),
        };
      }
    } else if (action === "track") {
      if (!payload?.awb) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing AWB number in payload" }),
        };
      }

      const res = await fetch(
        `${SHIPROCKET_BASE_URL}/courier/track/awb/${payload.awb}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      data = await res.json();

      if (!res.ok) {
        console.error("Shiprocket track error:", data);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: data }),
        };
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid action. Use 'createOrder' or 'track'.",
        }),
      };
    }

    // Return the real Shiprocket response
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
