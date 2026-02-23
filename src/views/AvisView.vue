<template>
  <section class="px-4 py-14">
    <h1 class="text-cyan-300 text-7xl font-bold text-center mb-8">LES AVIS</h1>

    <div class="mx-auto max-w-6xl mb-8 flex justify-center">
      <button
        class="rounded-2xl px-5 py-3 bg-cyan-300 hover:bg-cyan-500 text-white font-medium shadow hover:shadow-md transition"
        @click="showForm = true"
      >
        Ajouter un avis
      </button>
    </div>

    <!-- erreurs globales -->
    <p v-if="err" class="text-center text-red-600 mb-6">{{ err }}</p>

    <div class="mx-auto max-w-6xl columns-1 sm:columns-2 lg:columns-3 gap-6">
      <article
        v-for="(i, a) in avis"
        :key="a"
        class="mb-6 break-inside-avoid rounded-2xl bg-white shadow ring-1 ring-black/5 p-6"
      >
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm">
            {{ initiales(i.nom_avis) }}
          </div>
          <div class="font-medium">
            {{ i.nom_avis || 'Anonyme' }}
          </div>
        </div>
        <p class="mt-3 text-slate-700 whitespace-pre-line">{{ i.texte }}</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <span class="px-2 py-0.5 rounded bg-slate-100 text-xs">
            {{ i.formule_label || 'Formule' }}
          </span>
        </div>
      </article>
    </div>

    <!-- form ajout avis -->
    <div v-if="showForm" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Ajouter un avis</h2>
          <button class="text-slate-500 hover:text-slate-700" @click="closeForm">✕</button>
        </div>

        <div v-if="formErr" class="rounded bg-red-50 text-red-700 p-2 mb-3 text-sm">{{ formErr }}</div>
        <div v-if="formOk" class="rounded bg-green-50 text-green-700 p-2 mb-3 text-sm">
          Merci ! Ton avis a bien été publié.
        </div>

        <div class="space-y-3">
          <label class="block">
            <span class="text-sm text-slate-700">Nom (optionnel)</span>
            <input v-model="form.nom" class="mt-1 w-full rounded-lg border px-3 py-2" />
          </label>
          <label class="block">
            <span class="text-sm text-slate-700">Message *</span>
            <textarea v-model="form.texte" rows="4" class="mt-1 w-full rounded-lg border px-3 py-2"></textarea>
          </label>
          <label class="block">
            <span class="text-sm text-slate-700">Code d’avis *</span>
            <input v-model="form.code" class="mt-1 w-full rounded-lg border px-3 py-2 font-mono" placeholder="ex : 0472" />
          </label>
        </div>

        <div class="mt-5 flex items-center justify-end gap-3">
          <button class="rounded-2xl px-4 py-2 ring-1 ring-slate-200" @click="closeForm">Annuler</button>
          <button
            class="rounded-2xl px-4 py-2 bg-[#23c0f6] text-white disabled:opacity-60"
            :disabled="sending"
            @click="submitAvis"
          >
            {{ sending ? 'Envoi…' : 'Publier' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const avis = ref([])         
const err = ref('')
const showForm = ref(false)
const form = ref({ nom: '', texte: '', code: '' })
const formErr = ref('')
const formOk = ref(false)
const sending = ref(false)


function initiales(nom) {
  const s = (nom || 'A').trim()
  const parts = s.split(/\s+/).slice(0, 2)
  return parts.map(p => p[0]?.toUpperCase() || '').join('') || 'A'
}

// charge la liste des avis
async function loadAvis() {
  err.value = ''
  const { data, error } = await supabase
    .from('avis')
    .select('commande_id, nom_avis, texte, cree_at')
    .order('cree_at', { ascending: false })
  if (error) { err.value = error.message || 'Erreur chargement avis'; return }
  avis.value = (data || []).map(r => ({
    ...r,
    formule_label: 'Formule', 
  }))
}

// soumission d’un avis
async function submitAvis() {
  formErr.value = ''
  formOk.value = false

  const code = form.value.code?.trim()
  const texte = form.value.texte?.trim()
  const nom = form.value.nom?.trim() || null

  if (!code || !texte) {
    formErr.value = 'Le code et le message sont obligatoires.'
    return
  }

  sending.value = true
  try {
    // 1) trouver un token non utilisé par code
    const { data: tokens, error: e1 } = await supabase
      .from('token_avis')
      .select('id, commande_id')
      .eq('code_hash', code)
      .is('utilisation', null)
      .limit(1)
    if (e1) throw e1
    if (!tokens?.length) { formErr.value = 'Code invalide ou déjà utilisé.'; return }
    const token = tokens[0]

    // 2) vérifier que la commande est payée
    const { data: cmd, error: e2 } = await supabase
      .from('commande')
      .select('id, statut')
      .eq('id', token.commande_id)
      .single()
    if (e2) throw e2
    if (cmd.statut !== 'payé') { formErr.value = "La commande liée n'est pas payée."; return }

    // 3) insérer l’avis
    const { error: e3 } = await supabase
      .from('avis')
      .insert({
        commande_id: token.commande_id,
        nom_avis: nom,
        texte: texte,
      })

    if (e3) {
      formErr.value = "Code d'avis est déjà utilisé ou une erreur d'enregistrement s'est produite."
      return
    }

    // 4) marquer le token comme utilisé
    await supabase
      .from('token_avis')
      .update({ utilisation: new Date().toISOString() })
      .eq('id', token.id)

    formOk.value = true
    form.value = { nom: '', texte: '', code: '' }
    await loadAvis()
  } catch (e) {
    formErr.value = e?.message || String(e)
  } finally {
    sending.value = false
  }
}

function closeForm() {
  showForm.value = false
  formErr.value = ''
  formOk.value = false
}

onMounted(loadAvis)
</script>