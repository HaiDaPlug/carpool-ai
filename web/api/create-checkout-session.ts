import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

export const config = { runtime: 'nodejs' };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20'
});

type Body = {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY" in environment' });
      return;
    }

    const { priceId, successUrl, cancelUrl, customerEmail } = (req.body ?? {}) as Body;

    if (!priceId || !successUrl || !cancelUrl) {
      res.status(400).json({ error: 'Missing required fields: priceId, successUrl, cancelUrl' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      allow_promotion_codes: true
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
}
