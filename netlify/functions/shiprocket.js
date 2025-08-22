import fetch from "node-fetch";

let shiprocketToken: string | null = null;
let tokenExpiry: number | null = null;

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

// LOGIN FUNCTION WITH TOKEN CACHING
async function loginToShiprocket() {
  console.log("🔑 Logging in to Shiprocket...");

  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log("✅ Using cached Shiprocket token");
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

  const text = await res.text();
  console.log("📥 Shiprocket login raw response:", text);

  const data = JSON.parse(text);

  if (!res.ok) {
    console.error("❌ Login failed:", data);
    throw new Error(`Login failed: ${data.message || text}`);
  }

  shiprocketToken = data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 hours caching
  console.log("✅ Login successful, token cached");
  return shiprocketToken;
}

export async function handler(event: any) {
  try {
    console.log("📦 Incoming event:", event);

    const body = event.body ? JSON.parse(event.body) : {};
    const { action, payload } = body;

    if (!action) {
      console.warn("⚠️ Missing 'action' in request body");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'action' in request body" }),
      };
    }

    console.log("🛠 Action:", action);
    console.log("📤 Payload:", JSON.stringify(payload, null, 2));

    const token = await loginToShiprocket();
    let data: any;

    if (action === "createOrder") {
      const res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();
      console.log("📥 Shiprocket createOrder raw response:", rawText);

      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.error("❌ Failed to parse Shiprocket response as JSON", parseErr);
        data = { raw: rawText };
      }

      if (!res.ok) {
        console.error("❌ Shiprocket createOrder returned error:", data);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: data }),
        };
      }
    } else if (action === "track") {
      if (!payload?.awb) {
        console.warn("⚠️ Missing AWB number in payload");
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing AWB number in payload" }),
        };
      }

      const res = await fetch(
        `${SHIPROCKET_BASE_URL}/courier/track/awb/${payload.awb}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const rawText = await res.text();
      console.log("📥 Shiprocket track raw response:", rawText);

      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.error("❌ Failed to parse Shiprocket track response as JSON", parseErr);
        data = { raw: rawText };
      }

      if (!res.ok) {
        console.error("❌ Shiprocket track returned error:", data);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: data }),
        };
      }
    } else {
      console.warn("⚠️ Invalid action:", action);
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid action. Use 'createOrder' or 'track'.",
        }),
      };
    }

    console.log("✅ Shiprocket API call successful:", data);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err: any) {
    console.error("🔥 Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || err.toString() }),
    };
  }
}
