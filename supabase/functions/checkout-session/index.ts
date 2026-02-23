// functions/checkout-session/index.ts
import Stripe from "npm:stripe@^16.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

type Body = {
  amountEuros: number;          // ex: 50
  productName: string;          // ex: "Formule 1 — Coaching 1h"
  email?: string;               // mail saisi côté front (facultatif si tu le prends via Cal)
  successUrl: string;           // DOIT contenir ?session_id={CHECKOUT_SESSION_ID}
  cancelUrl: string;
  // méta utiles pour les webhooks
  formuleId?: string | number;  // 1..4
  discord?: string;             // pseudo discord
  note?: string;                // note client
  reservationId?: string;       // si tu l’as
  debutAt?: string;             // ISO si tu l’as
  finAt?: string;               // ISO si tu l’as
  commandeId?: string | number; // si un jour tu crées la commande avant
};

Deno.serve(async (req) => {
  // CORS basique
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = (await req.json()) as Body;

    const amount = Math.max(0, Math.round(Number(body.amountEuros || 0)));
    if (!amount || !body.productName || !body.successUrl || !body.cancelUrl) {
      return new Response("Missing fields", { status: 400 });
    }

    // Important: Stripe remplace {CHECKOUT_SESSION_ID} automatiquement
    // ex: https://tonsite.com/commande/succes?session_id={CHECKOUT_SESSION_ID}
    if (!body.successUrl.includes("{CHECKOUT_SESSION_ID}")) {
      console.warn("⚠️ successUrl should include {CHECKOUT_SESSION_ID}");
    }

    // Prépare les metadata pour nos webhooks (FR)
    const metadata: Record<string, string> = {
      // identifiants fonctionnels
      ...(body.formuleId ? { formule_id: String(body.formuleId) } : {}),
      ...(body.commandeId ? { commande_id: String(body.commandeId) } : {}),
      ...(body.reservationId ? { reservation_id: String(body.reservationId) } : {}),
      // infos complémentaires
      ...(body.discord ? { discord_name: body.discord } : {}),
      ...(body.note ? { note_client: body.note } : {}),
      // prix "côté produit" (en euros), utile si la commande a été créée par Cal sans prix
      prix_formule: String(amount),
      // à défaut, l’email peut être utile aux rattachements
      ...(body.email ? { email_client: body.email } : {}),
      // créneaux éventuels
      ...(body.debutAt ? { debut_at: body.debutAt } : {}),
      ...(body.finAt ? { fin_at: body.finAt } : {}),
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      // si tu utilises des Price IDs côté Stripe, remplace par line_items: [{ price: "price_xxx", quantity: 1 }]
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: amount * 100,
            product_data: { name: body.productName },
          },
          quantity: 1,
        },
      ],
      // Stripe ajoutera automatiquement ?session_id=cs_xxx à successUrl si placeholder présent
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
      customer_email: body.email || undefined, // garde si tu le veux côté Stripe
      metadata, // <— super important : alimente nos webhooks
      // (optionnel) utiliser client_reference_id pour passer un id maison
      // client_reference_id: body.commandeId ? String(body.commandeId) : undefined,
      // (optionnel) payment_intent_data: { metadata }, // si tu veux répliquer les metas sur PI
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    });
  } catch (e: any) {
    console.error("checkout-session error:", e?.message || e);
    return new Response("server error", { status: 500 });
  }
});
