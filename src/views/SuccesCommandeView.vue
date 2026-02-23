<template>
  <main class="mx-auto max-w-3xl px-6 py-12">
    <h1 class="text-2xl font-semibold mb-4">Paiement confirmé</h1>

    <div v-if="err" class="rounded bg-red-50 text-red-700 p-3">{{ err }}</div>
    <div v-else-if="loading" class="text-slate-500">Chargement…</div>

    <section v-else class="rounded-2xl ring-1 ring-slate-200 bg-white p-5 shadow-sm space-y-2">
      <p><span class="font-medium">Formule :</span> {{ cmd?.formule_id }}</p>
      <p><span class="font-medium">Montant :</span> {{ cmd?.prix_formule ?? paiement?.montant }} €</p>
      <p><span class="font-medium">Email :</span> {{ cmd?.email_client }}</p>
      <p><span class="font-medium">Discord :</span> {{ cmd?.discord_name || '—' }}</p>
      <p><span class="font-medium">Note :</span> {{ cmd?.note_client || '—' }}</p>
      <p v-if="cmd?.debut_at">
        <span class="font-medium">Créneau :</span> {{ formatDate(cmd.debut_at) }} → {{ formatDate(cmd.fin_at) }}
      </p>

      <h2 class="font-semibold text-xl mt-6">Ton code d’avis</h2>
      <div v-if="genError" class="text-red-600 text-sm mb-2">{{ genError }}</div>
      <div v-if="codeAvis" class="text-2xl font-mono tracking-widest">{{ codeAvis }}</div>

      <button
        class="mt-3 rounded-2xl px-4 py-2 bg-[#23c0f6] text-white"
        :disabled="genLoading"
        @click="genererCode"
      >
        {{ genLoading ? 'Génération…' : (codeAvis ? 'Régénérer' : 'Générer mon code') }}
      </button>
    </section>

    <RouterLink to="/formules" class="inline-block mt-4 text-cyan-300 underline">Retour aux formules</RouterLink>
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const route = useRoute()
const loading = ref(true)
const err = ref('')
const paiement = ref(null)
const cmd = ref(null)

const codeAvis = ref('')
const genLoading = ref(false)
const genError = ref('')


function formatDate(iso) {
  try { return new Date(iso).toLocaleString() } catch { return iso }
}


onMounted(async () => {
  try {
    const sessionId = route.query.session_id
    if (!sessionId) { err.value = 'Session Stripe manquante.'; return }

    const { data: pay, error: e1 } = await supabase
      .from('paiement')
      .select('id, commande_id, montant, statut, session_id')
      .eq('session_id', String(sessionId))
      .maybeSingle()
    if (e1 || !pay) { err.value = 'Paiement introuvable.'; return }
    paiement.value = pay

    const { data: c, error: e2 } = await supabase
      .from('commande')
      .select('id, formule_id, prix_formule, statut, email_client, discord_name, note_client, debut_at, fin_at')
      .eq('id', pay.commande_id)
      .single()
    if (e2) { err.value = 'Commande introuvable.'; return }
    cmd.value = c
  } catch (e) {
    err.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
})


function make4() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0')
}


async function genererCode() {
  genError.value = ''
  if (!cmd.value?.id) { genError.value = 'Commande introuvable.'; return }
  if (cmd.value.statut !== 'payé') { genError.value = 'Commande non payée.'; return }

  genLoading.value = true
  try {
    // 1) existe déjà un token non utilisé ?
    const { data: existing, error: e1 } = await supabase
      .from('token_avis')
      .select('id, code_hash')
      .eq('commande_id', cmd.value.id)
      .is('utilisation', null)
      .limit(1)
    if (e1) throw e1

    if (existing?.length) {
      codeAvis.value = existing[0].code_hash
      return
    }

    // 2) sinon on essaie de générer un code libre
    let tries = 0
    while (tries < 10) {
      const candidate = make4()

      const { data: clash, error: e2 } = await supabase
        .from('token_avis')
        .select('id')
        .eq('code_hash', candidate)
        .is('utilisation', null)
        .limit(1)
      if (e2) throw e2

      if (!clash?.length) {
        const { error: e3 } = await supabase
          .from('token_avis')
          .insert({
            commande_id: cmd.value.id,
            code_hash: candidate,      
            utilisation: null,
          })
        if (e3) { tries++; continue } 
        codeAvis.value = candidate
        return
      }
      tries++
    }

    genError.value = 'Impossible de générer un code, réessaie.'
  } catch (e) {
    genError.value = e?.message || String(e)
  } finally {
    genLoading.value = false
  }
}
</script>
