<template>
  <header class="bg-cyan-400 shadow">
    <div class="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">

      <RouterLink
            
            to="/"
            class="hover:text-cyan-800 transition-colors text-xl font-bold text-white"
        >
          Accueil
        </RouterLink>

      <!-- Navigation -->
      <nav class="flex md:gap-6 gap-2 text-md font-medium text-white">

        <RouterLink
          to="/formules"
          class="hover:text-cyan-800 transition-colors"
        >
          Formules
        </RouterLink>
        <RouterLink
          to="/aboutme"
          class="hover:text-cyan-800 transition-colors"
        >
          About Me
        </RouterLink>
        <RouterLink
          to="/avis"
          class="hover:text-cyan-800 transition-colors"
        >
          Avis
        </RouterLink>
        <RouterLink
          to="/cgvretour"
          class="hover:text-cyan-800 transition-colors"
        >
          CGV & Retour
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
