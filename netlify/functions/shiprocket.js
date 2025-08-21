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
  console.error("Shiprocket error:", data); // log the error
  return {
    statusCode: 400,
    body: JSON.stringify({ error: data }),
  };
}
  console.log("Shiprocket Response:", data);


  if (!res.ok) {
    throw new Error(`Login failed: ${data.message}`);
  }

  shiprocketToken = data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
  return shiprocketToken;
}

export async function handler(event) {
  try {
    // If body is empty, default to empty object
    const body = event.body ? JSON.parse(event.body) : {};
    const { action, payload } = body;

    const token = await loginToShiprocket();
    let data = {};

    if (action === "createOrder") {
      const res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      data = await res.json();
    } else if (action === "track") {
      const res = await fetch(
        `${SHIPROCKET_BASE_URL}/courier/track/awb/${payload?.awb}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      data = await res.json();
    } else {
      data = { message: "Send an action: createOrder or track" };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
