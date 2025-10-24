// api/auth/callback.js
import fetch from "node-fetch";
import { setCookie } from "cookies-next";

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("Missing code");

  const tokenRes = await fetch("https://whop.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      client_id: process.env.WHOP_CLIENT_ID,
      client_secret: process.env.WHOP_CLIENT_SECRET,
      redirect_uri: process.env.WHOP_REDIRECT_URI
    })
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    return res.status(500).send("Token exchange failed: " + text);
  }

  const tokenJson = await tokenRes.json(); // { access_token, refresh_token, expires_in }
  // Option A: store entire token in encrypted DB and set sessionId cookie.
  // Quick (but acceptable for many): store token in signed cookie (HttpOnly).
  setCookie("whop_session", JSON.stringify({
    access_token: tokenJson.access_token,
    refresh_token: tokenJson.refresh_token
  }), { req, res, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });

  res.writeHead(302, { Location: "/portalusuario" });
  res.end();
}
