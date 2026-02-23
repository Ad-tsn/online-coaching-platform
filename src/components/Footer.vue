<template>
  <footer class="mt-16 border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-7xl px-6 py-10 grid gap-6 md:grid-cols-3">
      <div>
        <div class="text-xl font-semibold">RageCoaching</div>
        <p class="mt-2 text-sm text-slate-600 mb-8">
          Coaching Valorant personnalisé, analyses VOD et suivi de progression.
        </p>
        <div class="flex items-center gap-4 text-sm ">
            <a href="https://youtube.com/@ragecoaching" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-300">YouTube</a>
            <a href="https://www.tiktok.com/@ragecoaching" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-300">TikTok</a>
            <a href="https://x.com/ragecoaching" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-300">X (Twitter)</a>
            <a href="https://instagram.com/ragecoaching" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-300">Instagram</a>
        </div>

      </div>

      <nav class="text-sm">
        <div class="font-medium text-slate-900">Navigation</div>
        <ul class="mt-2 space-y-1">
          <li><RouterLink  class="hover:text-cyan-300" to="/">Accueil</RouterLink></li>
          <li><RouterLink  class="hover:text-cyan-300" to="/formules">Formules</RouterLink></li>
          <li><RouterLink  class="hover:text-cyan-300" to="/aboutme">À propos</RouterLink></li>
          <li><RouterLink  class="hover:text-cyan-300" to="/avis">Avis</RouterLink></li>
          <li><RouterLink  class="hover:text-cyan-300" to="/cgvretour">CGV & Retours</RouterLink></li>
        </ul>
      </nav>

      <div class="text-sm">
        <div class="font-medium text-slate-900">Contact</div>
        <ul class="mt-2 space-y-1">
          <li><a class="hover:text-[#23c0f6]" href="mailto:contact@ragecoaching.gg">norageboukhari1234@outlook.fr </a></li>
          <li class="text-slate-600">Discord : <span class="font-medium">ragecoach</span></li>
        </ul>
      </div>
    </div>

    <div class="border-t border-slate-200">
      <div class="mx-auto max-w-7xl px-6 py-4 text-xs text-slate-500 flex items-center justify-between">
        <span>© 2025 RageCoaching. Tous droits réservés.</span>
      </div>
    </div>
  </footer>
</template>

<script setup>

</script>
