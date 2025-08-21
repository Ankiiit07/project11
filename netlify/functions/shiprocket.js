// netlify/functions/shiprocket.js
import fetch from "node-fetch";

let shiprocketToken = null;
let tokenExpiry = null;

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

async function loginToShiprocket() {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "ajha55172@gmail.com",
      password: "Anand@raj98",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Login failed: ${data.message}`);
  }

  shiprocketToken = data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
  return shiprocketToken;
}

export async function handler(event) {
  try {
    const { action, payload } = JSON.parse(event.body);

    const token = await loginToShiprocket();
    let res, data;

    if (action === "createOrder") {
      res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      data = await res.json();
    }

    if (action === "track") {
      res = await fetch(
        `${SHIPROCKET_BASE_URL}/courier/track/awb/${payload.awb}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      data = await res.json();
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
