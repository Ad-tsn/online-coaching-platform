<template>
  <main>
    <!-- Hero -->
    <section class="text-center flex items-center justify-center min-h-[60vh] md:min-h-[90vh] px-6">
      <div class="space-y-6 max-w-3xl">
        <h1 class="text-cyan-300 text-4xl sm:text-5xl md:text-7xl font-bold">RAGE COACHING</h1>
        <p class="font-semibold text-base md:text-lg text-slate-800">
          Il est temps de devenir la meilleure version de vous-même.
        </p>
        <RouterLink
          to="/formules"
          class="inline-block px-5 py-3 bg-cyan-300 text-white text-sm md:text-base font-semibold rounded-full shadow-md hover:bg-cyan-500 transition"
        >
          RÉSERVER UN COACHING
        </RouterLink>
      </div>
    </section>

    <!-- Pourquoi coaching -->
    <section class="mx-auto max-w-7xl px-6 py-16">
      <div class="mb-10 max-w-2xl">
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-cyan-300 mb-6">
          Pourquoi prendre un coaching ?
        </h2>
        <p class="font-semibold text-slate-700">
          Le coaching, c'est un raccourci : tu bénéficies de conseils personnalisés, d'un suivi régulier
          et d'outils concrets pour avancer étape par étape, sans te perdre.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="group rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm hover:shadow-md transition p-8">
          <h3 class="text-lg font-semibold mb-3">Accompagnement personnalisé</h3>
          <p class="text-slate-600 font-semibold">Un suivi adapté à ton profil et à tes objectifs précis.</p>
        </div>
        <div class="group rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm hover:shadow-md transition p-8">
          <h3 class="text-lg font-semibold mb-3">Suivi régulier</h3>
          <p class="text-slate-600 font-semibold">Un cadre motivant avec des feedbacks constants pour ne jamais décrocher.</p>
        </div>
        <div class="group rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm hover:shadow-md transition p-8">
          <h3 class="text-lg font-semibold mb-3">Résultats concrets</h3>
          <p class="text-slate-600 font-semibold">Des progrès visibles et mesurables étape par étape.</p>
        </div>
      </div>
    </section>

    <div class="border-t border-slate-200"></div>

    <!-- Coach -->
    <section class="mx-auto max-w-7xl px-6 py-16">
      <div class="grid items-center gap-10 grid-cols-1 md:grid-cols-2">
        <img
          src="../assets/img/images.jpg"
          alt="ragevl"
          class="w-full aspect-[4/3] object-cover rounded-3xl shadow-lg ring-1 ring-black/5"
        />
        <div class="text-left md:text-right">
          <h2 class="text-3xl md:text-4xl font-bold text-cyan-300 mb-6">Ton Coach</h2>
          <p class="font-semibold text-slate-700 mb-8 max-w-xl md:ml-auto">
            Je suis un passionné des FPS avec plus de 10 000 heures de jeu (CSGO, Valorant).
            Aujourd'hui, je mets à profit mon expérience pour t’aider à progresser avec méthode.
          </p>
          <RouterLink
            to="/aboutme"
            class="inline-block rounded-full px-6 py-3 bg-cyan-300 text-white font-semibold shadow hover:shadow-md hover:brightness-110 transition"
          >
            À PROPOS DE MOI
          </RouterLink>
        </div>
      </div>
    </section>

    <div class="border-t border-slate-200"></div>

    <!-- Fonctionnement -->
    <section class="mx-auto max-w-7xl px-6 py-16">
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-cyan-300 text-center mb-12">Fonctionnement</h2>

      <ol class="grid gap-6 grid-cols-1 sm:grid-cols-3">
        <li class="rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm p-8 text-center">
          <div class="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-300 text-white font-bold">1</div>
          <p class="font-semibold text-slate-700">Tu choisis ton créneau et réserves ta séance</p>
        </li>
        <li class="rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm p-8 text-center">
          <div class="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-300 text-white font-bold">2</div>
          <p class="font-semibold text-slate-700">On définit ensemble tes objectifs</p>
        </li>
        <li class="rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm p-8 text-center">
          <div class="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-300 text-white font-bold">3</div>
          <p class="font-semibold text-slate-700">Tu savoures tes gains de RR</p>
        </li>
      </ol>
    </section>

    <div class="border-t border-slate-200"></div>

    <!-- Formules -->
    <section class="mx-auto max-w-7xl px-6 py-16">
      <h2 class="text-3xl md:text-4xl font-bold text-cyan-300 mb-10">FORMULES</h2>

      <div v-if="errFormules" class="text-red-600 mb-6">{{ errFormules }}</div>
      <div v-else-if="loadingFormules" class="text-slate-500">Chargement…</div>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="f in formules"
          :key="f.id"
          class="rounded-3xl bg-white ring-1 ring-slate-200 shadow-sm hover:shadow-md transition p-8 flex flex-col"
        >
          <h3 class="text-lg font-semibold mb-2">{{ f.titre_formule }}</h3>
          <p class="text-slate-600 mb-6">Tarif : <span class="font-medium">{{ formatPrice(f.prix_formule) }}</span></p>
          <RouterLink
            :to="{ name:'formule-detail', params:{ id: f.id } }"
            class="mt-auto inline-flex items-center justify-center rounded-2xl px-4 py-2 bg-cyan-300 hover:bg-cyan-500 text-white font-medium shadow hover:shadow-md transition"
          >
            Plus de détails
          </RouterLink>
        </article>
      </div>
    </section>

    <!-- AVIS (3 plus récents) -->
    <section class="mx-auto max-w-7xl px-6 py-16">
      <h2 class="text-cyan-300 text-3xl md:text-4xl font-bold mb-8">Témoignages</h2>
      <p class="font-semibold mb-8 text-lg text-slate-800">Ce que disent les élèves.</p>

      <div v-if="errAvis" class="text-red-600 mb-6">{{ errAvis }}</div>
      <div v-else-if="loadingAvis" class="text-slate-500">Chargement…</div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <article
          v-for="(i, a) in avis"
          :key="a"
          class="rounded-2xl bg-white shadow ring-1 ring-black/5 p-6"
        >
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
              {{ initiales(i.nom_avis) }}
            </div>
            <div class="font-medium">
              {{ i.nom_avis || 'Anonyme' }}
            </div>
          </div>
          <p class="mt-3 text-slate-700">{{ truncateWords(i.texte, 20) }}</p>
        </article>
      </div>

      <div class="flex items-center justify-center w-full mt-8">
        <RouterLink
          to="/avis"
          class="px-4 py-2 bg-cyan-300 text-white text-md font-semibold rounded-full shadow-md hover:bg-cyan-500"
        >
          Voir tous les avis
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'


function formatPrice(p) {
  const n = Number(p ?? 0)
  return Number.isFinite(n) ? `${n}€` : `${p}€`
}
function initiales(nom) {
  const s = (nom || 'A').trim()
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map(p => p[0]?.toUpperCase() || '').join('') || 'A'
}
function truncateWords(str, maxWords = 20) {
  if (!str) return ''
  const words = String(str).split(/\s+/)
  if (words.length <= maxWords) return str
  return words.slice(0, maxWords).join(' ') + '…'
}


const formules = ref([])
const loadingFormules = ref(true)
const errFormules = ref('')


const avis = ref([])
const loadingAvis = ref(true)
const errAvis = ref('')

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('formules')
      .select('id, titre_formule, prix_formule')
      .order('id', { ascending: true })
      .limit(4)

    if (error) throw error
    formules.value = data || []
  } catch (e) {
    errFormules.value = e?.message || 'Erreur chargement formules'
  } finally {
    loadingFormules.value = false
  }

  // avis
  try {
    const { data, error } = await supabase
      .from('avis')
      .select('commande_id, nom_avis, texte, cree_at')
      .order('cree_at', { ascending: false })
      .limit(3)

    if (error) throw error

    avis.value = (data || []).map(r => ({ ...r, formule_label: 'Formule' }))
  } catch (e) {
    errAvis.value = e?.message || 'Erreur chargement avis'
  } finally {
    loadingAvis.value = false
  }
})
</script>
