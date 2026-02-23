import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function normalizeEventLabel(label: string | undefined | null): "created" | "rescheduled" | "cancelled" | "unknown" {
  if (!label) return "unknown";
  const l = label.toLowerCase();
  if (l.includes("créée") || l.includes("cree") || l.includes("créé")) return "created";
  if (l.includes("replanifi")) return "rescheduled";
  if (l.includes("annul")) return "cancelled";
  if (l.includes("booking_created")) return "created";
  if (l.includes("booking_rescheduled")) return "rescheduled";
  if (l.includes("booking_cancel")) return "cancelled";
  return "unknown";
}

Deno.serve(async (req) => {
  const raw = await req.text();
  console.log("CAL RAW:", raw);

  // Vérif signature
  const secret = Deno.env.get("CAL_WEBHOOK_SECRET") || "";
  if (secret) {
    const sent = req.headers.get("x-cal-signature-256") || "";
    if (!sent) return new Response("Missing signature header", { status: 401 });
    const good = await hmac(secret, raw);
    if (sent !== good) return new Response("Invalid signature", { status: 401 });
  }

  // Parse JSON
  let body: any;
  try { body = JSON.parse(raw); } catch { return new Response("bad json", { status: 400 }); }

  // Cal varie : parfois "type", parfois "triggerEvent", parfois FR
  const eventLabel: string =
    body?.triggerEvent ??
    body?.type ??
    body?.event?.type ??
    "UNKNOWN";

  const kind = normalizeEventLabel(eventLabel);
  console.log("CAL kind:", kind, " (label:", eventLabel, ")");

  // booking dans différents chemins
  const booking =
    body?.payload?.booking ??
    body?.booking ??
    body?.payload ?? {};

  // metadata passée depuis l’embed (via URL ?metadata[formule_id]=...)
  const meta = booking?.metadata ?? {};
  const commandeId = meta?.commande_id ? Number(meta.commande_id) : null;

  const reservationId = booking?.uid ?? booking?.id ?? null;
  const startIso = booking?.startTime ?? booking?.start ?? null;
  const endIso   = booking?.endTime   ?? booking?.end   ?? null;

  const email =
    booking?.attendees?.[0]?.email ??
    booking?.attendee?.email ??
    body?.payload?.email ??
    null;

  const patch: Record<string, any> = {
    email_client: email,
    reservation_id: reservationId,
    debut_at: startIso ? new Date(startIso).toISOString() : null,
    fin_at:   endIso   ? new Date(endIso).toISOString()   : null,
  };

  try {
    // === RÉSERVATION CRÉÉE ===
    if (kind === "created") {
      patch.statut = "en_attente_paiement";

      // 1) si on a un id commande
      if (commandeId) {
        const { error } = await supabase.from("commande").update(patch).eq("id", commandeId);
        if (error) { console.error("update commande (id) error:", error); return new Response("db error", { status: 500 }); }
        return new Response("ok", { status: 200 });
      }

      // 2) sinon si on retrouve par reservation_id
      if (reservationId) {
        const { data: found, error: selErr } = await supabase
          .from("commande").select("id").eq("reservation_id", reservationId).maybeSingle();
        if (selErr) { console.error("select by reservation_id error:", selErr); return new Response("db error", { status: 500 }); }
        if (found?.id) {
          const { error: upErr } = await supabase.from("commande").update(patch).eq("id", found.id);
          if (upErr) { console.error("update by reservation_id error:", upErr); return new Response("db error", { status: 500 }); }
          return new Response("ok", { status: 200 });
        }
      }

      // 3) sinon si on retrouve par email une commande non payée
      if (email) {
        const { data: foundByEmail, error: selErr2 } = await supabase
          .from("commande")
          .select("id, statut")
          .eq("email_client", email)
          .neq("statut", "payé")
          .order("id", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (selErr2) { console.error("select by email error:", selErr2); return new Response("db error", { status: 500 }); }
        if (foundByEmail?.id) {
          const { error: upErr2 } = await supabase.from("commande").update(patch).eq("id", foundByEmail.id);
          if (upErr2) { console.error("update by email error:", upErr2); return new Response("db error", { status: 500 }); }
          return new Response("ok", { status: 200 });
        }
      }

      // 4) sinon → INSERT (Modèle A)
      const toInsert = {
        formule_id: meta?.formule_id ? Number(meta.formule_id) : null,
        prix_formule: null,
        statut: "en_attente_paiement",
        email_client: email,
        reservation_id: reservationId,
        debut_at: patch.debut_at,
        fin_at: patch.fin_at,
        discord_name: null,
      };
      const { error: insErr } = await supabase.from("commande").insert(toInsert);
      if (insErr) { console.error("insert commande error:", insErr); return new Response("db error", { status: 500 }); }

      return new Response("ok", { status: 200 });
    }

    // === RÉSERVATION REPLANIFIÉE ===
    if (kind === "rescheduled") {
      if (!reservationId) return new Response("missing reservation id", { status: 400 });
      const { error: upErr } = await supabase
        .from("commande")
        .update({ debut_at: patch.debut_at, fin_at: patch.fin_at })
        .eq("reservation_id", reservationId);
      if (upErr) { console.error("reschedule update error:", upErr); return new Response("db error", { status: 500 }); }
      return new Response("ok", { status: 200 });
    }

    // === RÉSERVATION ANNULÉE ===
    if (kind === "cancelled") {
      if (!reservationId) return new Response("missing reservation id", { status: 400 });
      const { data: cmd } = await supabase
        .from("commande")
        .select("id, statut")
        .eq("reservation_id", reservationId)
        .maybeSingle();
      if (cmd?.id && cmd.statut !== "payé") {
        const { error: upErr } = await supabase
          .from("commande")
          .update({ statut: "annulé" })
          .eq("id", cmd.id);
        if (upErr) { console.error("cancel update error:", upErr); return new Response("db error", { status: 500 }); }
      }
      return new Response("ok", { status: 200 });
    }

    // Autres -> ignore
    return new Response("ignored", { status: 200 });
  } catch (e: any) {
    console.error("cal-webhook fatal error:", e?.message || e);
    return new Response("server error", { status: 500 });
  }
});
