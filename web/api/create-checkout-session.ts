import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { priceId, customerEmail } = (req.body ?? {}) as {
      priceId?: string;
      customerEmail?: string;
    };

    if (!priceId) {
      return res.status(400).json({ error: "Missing priceId" });
    }

    const successUrl = `${process.env.VITE_PUBLIC_APP_URL ?? "http://localhost:5173"}/account?status=success`;
    const cancelUrl = `${process.env.VITE_PUBLIC_APP_URL ?? "http://localhost:5173"}/account?status=cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
    });

    return res.status(200).json({ url: session.url });
  } catch (e: any) {
    console.error("create-checkout-session error:", e);
    return res.status(500).json({ error: "Internal error" });
  }
}
