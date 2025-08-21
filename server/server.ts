// server/server.ts
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // shiprocket API call

const app = express();
app.use(bodyParser.json());

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

let shiprocketToken: string | null = null;
let tokenExpiry: number | null = null;

async function shiprocketLogin(): Promise<string> {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }

  const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "ajha55172@gmail.com", // set in .env in CSB
      password: "Anand@raj98",
    }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Login failed");

  shiprocketToken = data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
  return shiprocketToken!;
}

app.post("/api/shiprocket/order", async (req, res) => {
  try {
    const token = await shiprocketLogin();

    const response = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
