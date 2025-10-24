// api/whop/products.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const companyId = process.env.WHOP_COMPANY_ID;
  const appKey = process.env.WHOP_APP_API_KEY; // server-side only
  const r = await fetch(`https://api.whop.com/api/v1/products?company_id=${companyId}`, {
    headers: { Authorization: `Bearer ${appKey}` }
  });
  const data = await r.json();
  res.status(200).json(data);
}
