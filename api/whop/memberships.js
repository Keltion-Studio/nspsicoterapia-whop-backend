// api/whop/memberships.js
import fetch from "node-fetch";
import { getCookie } from "cookies-next";

export default async function handler(req, res) {
  const sessionCookie = getCookie("whop_session", { req, res });
  if (!sessionCookie) return res.status(401).json({ error: "Not authenticated" });

  const { access_token } = JSON.parse(sessionCookie);
  // Ajusta endpoint según la API disponible para memberships. Ejemplo genérico:
  const r = await fetch(`https://api.whop.com/api/v1/memberships`, {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  if (!r.ok) {
    const txt = await r.text();
    return res.status(r.status).send(txt);
  }
  const data = await r.json();
  res.status(200).json(data);
}
