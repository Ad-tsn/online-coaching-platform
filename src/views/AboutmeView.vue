<template>
  <main class="mx-auto px-6 py-16">
    <!-- Titre -->
    <h1 class="text-cyan-300 text-4xl sm:text-5xl md:text-7xl font-semibold text-center mb-12 md:mb-16">
      ABOUT ME
    </h1>

    <!-- Intro: texte + image -->
    <section class="mx-auto max-w-7xl mb-12 md:mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div class="flex justify-center md:justify-start flex-col">
        <h2 class="text-cyan-300 text-3xl sm:text-4xl md:text-6xl font-semibold mb-4 md:mb-8">
          Ayoub 'RaGeVl' Boukhari
        </h2>
        <p class="text-sm sm:text-base md:text-lg font-semibold text-slate-800">
          Streamer, content creator Valorant
        </p>
      </div>
      <div class="flex justify-center md:justify-end">
        <img
          src="../assets/img/images.jpg"
          alt="RaGeVl"
          class="w-full max-w-md md:max-w-lg rounded-3xl shadow-lg ring-1 ring-black/5"
        />
      </div>
    </section>

    <!-- CS GO ERA -->
    <section class="relative min-h-[320px] md:h-[40vh] overflow-hidden rounded-2xl md:rounded-3xl mb-12 md:mb-16">
      <div
        class="absolute inset-0 -z-10
               bg-[url('assets/img/csgo.png')] bg-no-repeat bg-center bg-[length:110%]
               sm:bg-[length:90%] md:bg-[length:70%]
               blur-md opacity-50"
      ></div>
      <div class="relative mx-auto max-w-7xl h-full flex flex-col justify-center pt-8 md:pt-12">
        <h2 class="text-3xl sm:text-4xl md:text-5xl text-orange-300 font-bold mb-4 md:mb-8">
          CS GO ERA
        </h2>
        <p class="text-base sm:text-lg md:text-xl font-semibold max-w-5xl text-slate-900">
          J'ai commencé CS:GO très jeune et j'y ai consacré des années d'entraînement.
          Entre grind et étude du jeu, j'ai regardé d'innombrables compétitions professionnelles pour analyser les meilleures équipes.
          Au total, j'ai accumulé plus de 10 000 heures de jeu et atteint le niveau 10 sur FACEIT, avec une solide compréhension du jeu et de la prise de décision.
        </p>
      </div>
    </section>

    <!-- VALORANT ERA -->
    <section class="relative min-h-[320px] md:h-[40vh] overflow-hidden rounded-2xl md:rounded-3xl mb-12 md:mb-16">
      <div
        class="absolute inset-0 -z-10
               bg-[url('assets/img/valorant.png')] bg-no-repeat bg-center bg-[length:110%]
               sm:bg-[length:90%] md:bg-[length:70%]
               blur-md opacity-50"
      ></div>
      <div class="relative mx-auto max-w-7xl h-full flex flex-col justify-center pt-8 md:pt-12">
        <h2 class="text-3xl sm:text-4xl md:text-5xl text-red-400 font-bold mb-4 md:mb-8">
          VALORANT ERA
        </h2>
        <p class="text-base sm:text-lg md:text-xl font-semibold max-w-5xl text-slate-900">
          Après une pause de quelques années loin du gaming, je suis revenu en 2023 sur VALORANT et j'ai lancé les streams.
          J'ai grindé jusqu'à Immortal 3 sur mon main, avec un second compte peak Immortal 3 — 450 RR.
          Récemment, en live et en mode chill, je suis passé d'un compte non classé à Immortal en 7 jours.
          Aujourd'hui, je suis Riot Partner : je fais des watchparties des matchs VCT et je me rends sur place aux tournois en tant que créateur de contenu.
        </p>
      </div>
    </section>

    <!-- Sponsors -->
    <section class="max-w-7xl mx-auto">
      <h2 class="text-cyan-300 text-3xl sm:text-4xl md:text-5xl mb-6 md:mb-8 font-semibold">
        Mes sponsors
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <article class="rounded-2xl bg-white shadow ring-1 ring-black/5 p-6">
          <div class="flex flex-col items-center">
            <div class="w-full h-24 sm:h-28 md:h-32 flex items-center justify-center">
              <img
                src="../assets/img/redbull.png"
                alt="Red Bull"
                class="h-full w-auto max-w-[70%] object-contain"
              />
            </div>
            <p class="mt-4 font-medium">Red Bull</p>
          </div>
        </article>

        <article class="rounded-2xl bg-white shadow ring-1 ring-black/5 p-6">
          <div class="flex flex-col items-center">
            <div class="w-full h-24 sm:h-28 md:h-32 flex items-center justify-center">
              <img
                src="../assets/img/fut-logo.png"
                alt="FUT Esports"
                class="h-full w-auto max-w-[70%] object-contain"
              />
            </div>
            <p class="mt-4 font-medium">FUT Esports</p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
</script>
