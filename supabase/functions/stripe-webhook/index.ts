import Stripe from "npm:stripe@^16.0.0";
import { createClient } from "npm:@supabase/supabase-js@^2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  const whSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!sig || !whSecret) return new Response("Missing signature", { status: 400 });

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, whSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response("ignored", { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const amountCents = session.amount_total ?? 0;
  const montantEuros = Math.round(amountCents / 100);
  const paymentIntentId = String(session.payment_intent || "");
  const emailSession =
    session.customer_details?.email ||
    session.customer_email ||
    "";

  const md = session.metadata || {};
  let commandeId = md["commande_id"] ? Number(md["commande_id"]) : null;
  const formuleIdMeta = md["formule_id"] ? Number(md["formule_id"]) : null;
  const prixMeta = md["prix_formule"] ? Number(md["prix_formule"]) : null;
  const discordMeta = md["discord_name"] || null;
  const noteMeta = md["note_client"] || null; // <-- NOTE: on récupère la note

  // Helper pour compléter prix_formule si manquant
  async function computePrixFormuleIfNeeded(
    currentPrix: number | null,
    currentFormuleId: number | null
  ): Promise<number | null> {
    if (currentPrix != null) return currentPrix;
    if (prixMeta != null) return prixMeta;

    const fid = currentFormuleId ?? formuleIdMeta ?? null;
    if (fid) {
      const { data: f } = await supabase
        .from("formules")
        .select("prix_formule")
        .eq("id", fid)
        .maybeSingle();
      if (f?.prix_formule != null) return f.prix_formule;
    }
    return montantEuros ?? null;
  }

  // ====== Rattacher / créer la commande ======
  if (!commandeId) {
    // 1) tenter par email (commande non payée la plus récente)
    let foundId: number | null = null;
    if (emailSession) {
      const { data: found } = await supabase
        .from("commande")
        .select("id, statut")
        .eq("email_client", emailSession)
        .neq("statut", "payé")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (found?.id) foundId = found.id;
    }

    // 2) sinon par formule_id (dernière en_attente_paiement)
    if (!foundId && formuleIdMeta) {
      const { data: found2 } = await supabase
        .from("commande")
        .select("id, statut")
        .eq("formule_id", formuleIdMeta)
        .eq("statut", "en_attente_paiement")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (found2?.id) foundId = found2.id;
    }

    if (foundId) {
      // On complète les champs manquants + statut payé
      const { data: cmd } = await supabase
        .from("commande")
        .select("id, prix_formule, discord_name, note_client, formule_id, email_client")
        .eq("id", foundId)
        .single();

      const patch: Record<string, any> = { statut: "payé" };

      // prix_formule
      const prix = await computePrixFormuleIfNeeded(cmd?.prix_formule ?? null, cmd?.formule_id ?? null);
      if (prix != null) patch.prix_formule = prix;

      // discord_name
      if (discordMeta && !cmd?.discord_name) patch.discord_name = discordMeta;

      // NOTE: écriture de la note si fournie (on peut écraser si tu veux, ici on écrase si non renseignée)
      if (noteMeta && !cmd?.note_client) patch.note_client = noteMeta;

      // email (au cas où vide)
      if (emailSession && !cmd?.email_client) patch.email_client = emailSession;

      const { error: upErr } = await supabase
        .from("commande")
        .update(patch)
        .eq("id", foundId);
      if (upErr) console.error("commande update (link) error:", upErr);

      commandeId = foundId;
    } else {
      // 3) aucun match → création de la commande payée (fallback)
      const prixIns = await computePrixFormuleIfNeeded(null, formuleIdMeta ?? null);

      const toInsert = {
        formule_id: formuleIdMeta ?? null,
        prix_formule: prixIns,
        statut: "payé",
        email_client: md["email_client"] || emailSession || null,
        reservation_id: md["reservation_id"] || null,
        debut_at: md["debut_at"] || null,
        fin_at: md["fin_at"] || null,
        discord_name: discordMeta,
        note_client: noteMeta, // <-- NOTE: on enregistre la note à l'insert
      };
      const { data, error } = await supabase
        .from("commande")
        .insert(toInsert)
        .select("id")
        .single();
      if (error) console.error("commande insert error:", error);
      commandeId = data?.id ?? null;
    }
  } else {
    // commande_id fourni -> MAJ directe (+ compléter champs)
    const { data: cmd } = await supabase
      .from("commande")
      .select("id, prix_formule, discord_name, note_client, formule_id, email_client")
      .eq("id", Number(commandeId))
      .single();

    const patch: Record<string, any> = { statut: "payé" };

    const prix = await computePrixFormuleIfNeeded(cmd?.prix_formule ?? null, cmd?.formule_id ?? null);
    if (prix != null) patch.prix_formule = prix;

    if (discordMeta && !cmd?.discord_name) patch.discord_name = discordMeta;

    // NOTE: ici on écrase seulement si vide ; si tu veux écraser dans tous les cas, retire la condition
    if (noteMeta && !cmd?.note_client) patch.note_client = noteMeta;

    if (emailSession && !cmd?.email_client) patch.email_client = emailSession;

    const { error: upErr } = await supabase
      .from("commande")
      .update(patch)
      .eq("id", Number(commandeId));
    if (upErr) console.error("commande update (id) error:", upErr);
  }

  // ====== Insérer le paiement ======
  const { error: payErr } = await supabase.from("paiement").insert({
    commande_id: commandeId,
    fournisseur_reference: paymentIntentId || session.id,
    montant: montantEuros,
    statut: "réussi",
    cree_at: new Date().toISOString(),
    session_id: session.id,
  });
  if (payErr) console.error("paiement insert error:", payErr);

  return new Response("ok", { status: 200 });
});
