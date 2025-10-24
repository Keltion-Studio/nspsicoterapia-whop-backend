// api/webhooks.js
import rawBody from 'raw-body';

export default async function handler(req, res) {
  const body = await rawBody(req);
  // Validar signature si Whop provee X-Hub-Signature (revisa docs)
  const event = JSON.parse(body.toString());
  // Maneja event.type === 'membership.created' etc.
  console.log("Webhook event:", event);
  res.status(200).send("ok");
}
