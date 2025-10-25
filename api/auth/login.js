// api/auth/login.js

export default async function handler(req, res) {
  const { WHOP_CLIENT_ID, WHOP_REDIRECT_URI } = process.env;
  console.log("Client ID que se usa:", WHOP_CLIENT_ID)
  console.log("Redirect URI que se usa:", WHOP_REDIRECT_URI)

  if (!WHOP_CLIENT_ID || !WHOP_REDIRECT_URI) {
    return res.status(500).json({ error: "Missing environment variables" });
  }

  const whopAuthUrl = `https://whop.com/oauth?client_id=${WHOP_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    WHOP_REDIRECT_URI
  )}&response_type=code&scope=identity%20email`;

  return res.redirect(302, whopAuthUrl);
}
