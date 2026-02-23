<template>
  <main class="mx-auto max-w-3xl px-6 py-12">
    <h1 class="text-2xl font-semibold mb-6">Finaliser la commande</h1>

    <div v-if="erreur" class="rounded bg-red-50 text-red-700 p-3 mb-4">
      {{ erreur }}
    </div>
    <div v-else-if="loading" class="text-slate-500">Chargement…</div>

    <section v-else class="rounded-2xl ring-1 ring-slate-200 bg-white p-5 shadow-sm">
      <!-- Étapes -->
      <div class="mb-5 text-sm text-slate-600">
        Étape {{ step }} / 4
      </div>

      <!-- ÉTAPE 1 — Récap -->
      <template v-if="step === 1">
        <h2 class="text-xl font-semibold text-slate-900">{{ formule.titre_formule }}</h2>
        <p class="mt-2 text-slate-700">
          Prix : <span class="font-medium">{{ formule.prix_formule }} €</span>
        </p>
        <div class="mt-6 flex items-center gap-3">
          <button @click="goNext" class="inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-cyan-300 hover:bg-cyan-300 text-white font-medium shadow hover:shadow-md transition">
            Continuer
          </button>
        </div>
      </template>

      <!-- ÉTAPE 2 — Cal.com -->
      <template v-else-if="step === 2">
        <h2 class="text-xl font-semibold text-slate-900 mb-3">Choisis ton créneau</h2>
        <div v-if="needsCal">
          <div class="mb-4">
            <Calcom
              :namespace="`formule-${formuleId}`"
              :calLink="calLinkWithMeta"
              :metadata="{}"
              theme="light"
              brandColor="#23c0f6"
              layout="week_view"
            />
          </div>
          <label class="flex items-start gap-3 text-sm text-slate-700">
            <input type="checkbox" v-model="calConfirmed" class="mt-1">
            <span>J’ai réservé un créneau sur Cal.com et je confirme l’heure choisie.</span>
          </label>
        </div>
        <div v-else class="text-slate-600">Cette formule ne nécessite pas de prise de rendez-vous.</div>

        <div class="mt-6 flex items-center gap-3">
          <button @click="goPrev" class="rounded-2xl px-5 py-3 ring-1 ring-slate-200">Retour</button>
          <button :disabled="needsCal && !calConfirmed" @click="goNext"
                  class="inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-cyan-300 hover:bg-cyan-500 text-white font-medium shadow hover:shadow-md transition disabled:opacity-60">
            Continuer
          </button>
        </div>
      </template>

      <!-- ÉTAPE 3 — Infos client -->
      <template v-else-if="step === 3">
        <h2 class="text-xl font-semibold text-slate-900 mb-3">Tes informations</h2>

        <div class="space-y-4">
          <label class="block">
            <span class="text-sm text-slate-700">Email <span class="text-red-500">*</span></span>
            <input v-model.trim="form.email" type="email" placeholder="ex: toi@email.com"
                   class="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>

          <label class="block">
            <span class="text-sm text-slate-700">Pseudo Discord <span class="text-red-500">*</span></span>
            <input v-model.trim="form.discord" type="text" placeholder="ex: ragecoach#1234"
                   class="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>

          <label class="block">
            <span class="text-sm text-slate-700">Note (optionnel)</span>
            <textarea v-model.trim="form.note" rows="3" placeholder="URL youtube, Objectifs, contraintes, etc."
                      class="mt-1 w-full rounded-lg border px-3 py-2"></textarea>
          </label>
        </div>

        <p v-if="formError" class="mt-3 text-sm text-red-600">{{ formError }}</p>

        <div class="mt-6 flex items-center gap-3">
          <button @click="goPrev" class="rounded-2xl px-5 py-3 ring-1 ring-slate-200">Retour</button>
          <button @click="goNext" class="inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-cyan-300 hover:bg-cyan-500 text-white font-medium shadow hover:shadow-md transition">
            Continuer
          </button>
        </div>
      </template>

      <!-- ÉTAPE 4 — Paiement -->
      <template v-else-if="step === 4">
        <h2 class="text-xl font-semibold text-slate-900">Paiement sécurisé</h2>
        <p class="mt-2 text-slate-700">Montant : <span class="font-medium">{{ formule.prix_formule }} €</span></p>

        <div class="mt-6 flex items-center gap-3">
          <button @click="goPrev" class="rounded-2xl px-5 py-3 ring-1 ring-slate-200">Retour</button>
          <button :disabled="paying" @click="payer"
                  class="inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-cyan-300 hover:bg-cyan-500 text-white font-medium shadow hover:shadow-md transition disabled:opacity-60">
            {{ paying ? 'Redirection vers Stripe…' : 'Payer' }}
          </button>
        </div>

        <p v-if="payError" class="mt-3 text-sm text-red-600">{{ payError }}</p>
      </template>
    </section>

    <div class="mt-6">
      <RouterLink to="/formules" class="text-cyan-300 underline">Retour aux formules</RouterLink>
    </div>
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, watchEffect, computed } from 'vue'
import { supabase } from '../supabase'
import Calcom from '../components/Calcom.vue'

const route = useRoute()

const loading = ref(true)
const erreur = ref(null)
const formule = ref(null)

const step = ref(1)
const formError = ref('')
const payError = ref('')
const paying = ref(false)

const form = ref({
  email: '',
  discord: '',
  note: '',
})

const formuleId = computed(() => Number(route.query.formule))
const needsCal = computed(() => [1, 3, 4].includes(formuleId.value))
const calConfirmed = ref(false)

const calLinkWithMeta = computed(() => {
  const base = calLinks[Number(formuleId.value)]
  return `${base}?metadata[formule_id]=${formuleId.value}`
})

const calLinks = {
  1: 'aaa-ab67k5/formule-1',
  3: 'aaa-ab67k5/formule-3',
  4: 'aaa-ab67k5/formule-4',
}

async function fetchFormule(id) {
  loading.value = true
  erreur.value = null
  formule.value = null

  if (!id) {
    erreur.value = 'Formule introuvable.'
    loading.value = false
    return
  }

  const { data, error } = await supabase
    .from('formules')
    .select('id, titre_formule, prix_formule')
    .eq('id', Number(id))
    .single()

  if (error || !data) {
    erreur.value = 'Formule introuvable.'
  } else {
    formule.value = data
  }
  loading.value = false
}

// contrôles d'étapes
function goPrev() { step.value = Math.max(1, step.value - 1) }
function goNext() {
  if (step.value === 2 && needsCal.value && !calConfirmed.value) return
  if (step.value === 3) {
    if (!form.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      formError.value = 'Merci de renseigner un email valide.'
      return
    }
    if (!form.value.discord?.trim()) {
    formError.value = 'Ton pseudo Discord est requis.'
    return
    }
    formError.value = ''
  }
  step.value = Math.min(4, step.value + 1)
}

// création de la session Checkout
async function payer() {
  try {
    payError.value = ''
    paying.value = true

    const successUrl = `${window.location.origin}/commande/succes?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl  = `${window.location.origin}/commande?formule=${formuleId.value}`

    const { data, error } = await supabase.functions.invoke('checkout-session', {
      body: {
        amountEuros: Number(formule.value.prix_formule),
        productName: `${formule.value.titre_formule}`,
        email: form.value.email,
        successUrl,
        cancelUrl,
        formuleId: String(formuleId.value),
        prixFormule: Number(formule.value.prix_formule),
        discord: form.value.discord || '',
        note: form.value.note || '',
        reservationId: '',
        debutAt: '',
        finAt: '',
      },
    })
    if (error) throw error
    if (!data?.url) throw new Error('Pas d’URL Checkout')

    window.location = data.url
  } catch (e) {
    payError.value = e?.message || String(e)
  } finally {
    paying.value = false
  }
}

// recharger si ?formule= change
watchEffect(() => {
  step.value = 1
  calConfirmed.value = false
  form.value = { email: '', discord: '', note: '' }
  fetchFormule(formuleId.value)
})
</script>
