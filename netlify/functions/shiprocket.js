import fetch from "node-fetch";

let shiprocketToken = null;
let tokenExpiry = null;

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

// LOGIN FUNCTION WITH TOKEN CACHING
async function loginToShiprocket() {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log("✅ Using cached Shiprocket token");
    return shiprocketToken;
  }

  console.log("🔑 Logging in to Shiprocket...");
  const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "cafeatonce@gmail.com",
      password: "H7cJ33rk*0$p23c7",
    }),
  });

  const data = await res.json();
  console.log("📥 Shiprocket login response:", data);

  if (!res.ok) {
    throw new Error(`Login failed: ${data.message}`);
  }

  shiprocketToken = data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 hours caching
  console.log("✅ Shiprocket token cached");
  return shiprocketToken;
}

export async function handler(event) {
  try {
    console.log("📡 Incoming event body:", event.body);

    const body = event.body ? JSON.parse(event.body) : {};
    const { action, payload } = body;

    console.log("⚡ Action:", action);
    console.log("📦 Payload:", payload);

    if (!action) {
      console.error("❌ Missing 'action' in request body");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'action' in request body" }),
      };
    }

    const token = await loginToShiprocket();
    let data;

    if (action === "createOrder") {
      console.log("🚚 Sending order to Shiprocket...");
      console.log("📤 Payload to Shiprocket:", payload);

      const res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text(); // Get raw response to debug 400
      console.log("📥 Raw Shiprocket response:", text);

      data = JSON.parse(text);

      if (!res.ok) {
        console.error("❌ Shiprocket createOrder error:", data);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: data }),
        };
      }
    } else if (action === "track") {
      if (!payload?.awb) {
        console.error("❌ Missing AWB number in payload");
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing AWB number in payload" }),
        };
      }

      console.log("📦 Tracking AWB:", payload.awb);

      const res = await fetch(
        `${SHIPROCKET_BASE_URL}/courier/track/awb/${payload.awb}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const text = await res.text();
      console.log("📥 Track response:", text);
      data = JSON.parse(text);

      if (!res.ok) {
        console.error("❌ Shiprocket track error:", data);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: data }),
        };
      }
    } else {
      console.error("❌ Invalid action:", action);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid action. Use 'createOrder' or 'track'.",
        }),
      };
    }

    console.log("✅ Shiprocket response:", data);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("💥 Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
