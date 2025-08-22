import fetch from "node-fetch";

let shiprocketToken = null;
let tokenExpiry = null;

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

// LOGIN FUNCTION WITH TOKEN CACHING
async function loginToShiprocket() {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log("Using cached Shiprocket token");
    return shiprocketToken;
  }

  console.log("Logging in to Shiprocket...");
  const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "cafeatonce@gmail.com",
      password: "H7cJ33rk*0$p23c7",
    }),
  });

  const data = await res.json();
  console.log("Login response:", data);

  if (!res.ok) {
    throw new Error(`Login failed: ${data.message}`);
  }

  shiprocketToken = data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
  return shiprocketToken;
}

export async function handler(event) {
  try {
    console.log("Event body:", event.body);
    const body = event.body ? JSON.parse(event.body) : {};
    const { action, payload } = body;

    if (!action) {
      console.error("Missing action in request");
      return { statusCode: 400, body: JSON.stringify({ error: "Missing 'action' in request body" }) };
    }

    const token = await loginToShiprocket();
    console.log("Using token:", token);

    let data;

    if (action === "createOrder") {
      console.log("Creating Shiprocket order with payload:", JSON.stringify(payload, null, 2));

      const res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // ✅ Send only payload, not {action, payload}
      });

      const text = await res.text(); // raw response
      console.log("Shiprocket raw response:", text);

      data = JSON.parse(text);

      if (!res.ok) {
        console.error("Shiprocket createOrder error:", data);
        return { statusCode: 400, body: JSON.stringify({ error: data }) };
      }
    } else if (action === "track") {
      if (!payload?.awb) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing AWB number in payload" }) };
      }

      console.log("Tracking AWB:", payload.awb);

      const res = await fetch(`${SHIPROCKET_BASE_URL}/courier/track/awb/${payload.awb}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      console.log("Shiprocket track raw response:", text);

      data = JSON.parse(text);

      if (!res.ok) {
        console.error("Shiprocket track error:", data);
        return { statusCode: 400, body: JSON.stringify({ error: data }) };
      }
    } else {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid action. Use 'createOrder' or 'track'." }) };
    }

    console.log("Shiprocket API response:", data);

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
