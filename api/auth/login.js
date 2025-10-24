// api/auth/login.js
export default function handler(req, res) {
  const clientId = process.env.WHOP_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.WHOP_REDIRECT_URI);
  const scope = encodeURIComponent("read"); // ajusta scopes
  const url = `https://whop.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  res.writeHead(302, { Location: url });
  res.end();
}
