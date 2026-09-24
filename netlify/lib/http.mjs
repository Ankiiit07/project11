// Small response/validation helpers shared by the Netlify functions.

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Content-Type': 'application/json',
};

export const reply = (statusCode, body) => ({ statusCode, headers: HEADERS, body: JSON.stringify(body) });

export const str = (v, max = 300) => String(v ?? '').trim().slice(0, max);
export const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ''));

export function parseBody(event) {
  try {
    return JSON.parse(event.body || '{}');
  } catch {
    return null;
  }
}
