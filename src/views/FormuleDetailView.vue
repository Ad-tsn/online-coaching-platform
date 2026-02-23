<template>
  <main class="mx-auto max-w-7xl px-6 py-12">
    <!-- ÉTATS -->
    <div v-if="loading" class="space-y-6">
      <div class="h-10 w-64 bg-slate-200 rounded animate-pulse"></div>
      <div class="grid gap-8 md:grid-cols-2 items-start">
        <div class="aspect-video bg-slate-200 rounded-2xl animate-pulse"></div>
        <div class="space-y-3">
          <div class="h-8 w-80 bg-slate-200 rounded animate-pulse"></div>
          <div class="h-20 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="text-red-600">
      Erreur : {{ error.message }}
    </div>

    <template v-else>
      <!-- TITRE -->
      <h1 class="text-5xl md:text-6xl text-cyan-300 font-semibold mb-10">
        FORMULE {{ formule.id || 'Formule' }}
      </h1>

      <!-- HERO : vidéo + titre/CTA -->
      <section class="grid gap-8 md:grid-cols-2 items-start">
        <!-- Vidéo -->
        <div v-if="video" class="rounded-2xl ring-1 ring-slate-200 overflow-hidden shadow-sm">
          <div class="aspect-video bg-slate-100">
            <iframe
              class="w-full h-full"
              :src="video.url_embed"
              :title="`Présentation — ${formule?.titre_formule || 'Formule'}`"
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <!-- Header texte/CTA -->
        <div class="flex flex-col justify-center h-full">
          <div class="flex items-center justify-between">
            <h2 class="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              {{ formule?.titre_formule || 'Formule' }}
            </h2>
          </div>

          <!-- Petit pitch-->
          <p v-if="simples.length" class="mt-4 text-slate-600" v-html="simples[0].texte_bloc"></p>

          <div class="mt-7 flex flex-wrap items-center gap-3">
            <button
              class="inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-cyan-300 hover:bg-cyan-500 text-white font-medium shadow hover:shadow-md transition"
              @click="commander"
            >
              Réserver coaching
            </button>
            <span v-if="formule?.prix_formule" class="text-sm text-slate-500">
              À partir de <strong>{{ priceEuros }}</strong>
            </span>
          </div>
        </div>
      </section>

      <div class="my-12 border-t border-slate-200"></div>

      <!-- CONTENU -->
      <section aria-labelledby="details-title">
        <h2 id="details-title" class="text-2xl font-semibold text-slate-900">Ce que comprend la formule</h2>

        <!-- Cartes bloc_simple (on ignore le premier si utilisé comme intro) -->
        <div class="mt-6 grid gap-6">
          <div
            v-for="b in simplesCards"
            :key="b.ordre"
            class="rounded-2xl ring-1 ring-slate-200 bg-white p-5"
          >
            <h3 class="font-semibold text-slate-900" v-if="b.titre_bloc">{{ b.titre_bloc }}</h3>
            <p class="mt-1 text-slate-700 leading-relaxed" v-if="b.texte_bloc" v-html="b.texte_bloc"></p>
          </div>
        </div>

        <!-- Deux encarts bloc_info -->
        <div class="mt-10 grid md:grid-cols-2 gap-6">
          <article
            v-if="infos[0]"
            class="rounded-2xl ring-1 ring-slate-200 bg-white p-5"
          >
            <h3 class="font-semibold text-slate-900">{{ infos[0].titre_bloc }}</h3>
            <div class="mt-3 text-slate-700" v-html="infos[0].texte_bloc"></div>
          </article>

          <article
            v-if="infos[1]"
            class="rounded-2xl ring-1 ring-slate-200 bg-white p-5"
          >
            <h3 class="font-semibold text-slate-900">{{ infos[1].titre_bloc }}</h3>
            <div class="mt-2 text-slate-700" v-html="infos[1].texte_bloc"></div>
          </article>
        </div>

        <!-- Note finale -->
        <p v-if="note" class="mt-8 text-sm text-slate-500" v-html="note.titre_bloc"></p>
      </section>
    </template>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../supabase'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)

const loading = ref(true)
const error = ref(null)

const formule = ref(null)
const blocs = ref([])

onMounted(async () => {
  try {
    // 1) fiche formule
    const { data: f, error: e1 } = await supabase
      .from('formules')
      .select('id, titre_formule, prix_formule')
      .eq('id', id)
      .single()
    if (e1) throw e1
    if (!f) throw new Error('Formule introuvable')
    formule.value = f

    // 2) blocs triés
    const { data: c, error: e2 } = await supabase
      .from('contenu_formule')
      .select('type, titre_bloc, texte_bloc, url_embed, ordre')
      .eq('formule_id', id)
      .order('ordre', { ascending: true })
    if (e2) throw e2
    blocs.value = c || []
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
})

// Découpes
const video = computed(() => blocs.value.find(b => b.type === 'video') || null)
const simples = computed(() => blocs.value.filter(b => b.type === 'bloc_simple'))
const simplesCards = computed(() => (simples.value.length ? simples.value.slice(1) : []))
const infos = computed(() => blocs.value.filter(b => b.type === 'bloc_info'))
const note = computed(() => blocs.value.find(b => b.type === 'note') || null)

const priceEuros = computed(() => {
  const p = Number(formule.value?.prix_formule ?? 0)
  return p % 1 === 0 ? `${p}€` : `${p.toFixed(2)}€`
})

function commander() {
  router.push({ name: 'commande', query: { formule: id } })
}
console.log('route id =', route.params.id)
</script>
