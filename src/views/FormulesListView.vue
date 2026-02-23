<template>
    <main class="md:p-16 p-8">
        <h1 class="text-cyan-300 text-7xl font-bold text-center mb-16">NOS FORMULES</h1>
        <!-- Première carte - basic -->
        <article
        class="mx-auto max-w-6xl rounded-[28px] bg-white shadow-xl ring-1 ring-black/5 p-8 md:p-12 mb-16"
        >
            <div class="grid md:grid-cols-2 gap-10 items-center">

                <div>
                    <div class="flex items-center justify-between">
                        <span class="text-3xl md:text-4xl font-extrabold tracking-tight">01</span>


                        <span
                        class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium
                                text-white shadow-md bg-cyan-300"
                        >
                        € 50
                        </span>
                    </div>

                    <h2 class="mt-6 text-3xl md:text-5xl font-bold leading-tight">
                        Coaching a l'heure
                    </h2>

                    <ul class="mt-6 space-y-4">
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Analyse de VOD</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Analyse et conseils</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Session question / éponse</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Suivi personnalisé</span>
                        </li>
                    </ul>

                    <RouterLink
                        :to="{ name:'formule-detail', params:{ id : '1' } }"
                        class="mt-6 inline-flex items-center justify-center rounded-2xl px-5 py-3
                            bg-cyan-300 hover:bg-cyan-500 text-white font-medium shadow hover:shadow-lg transition"
                    >
                        Plus de détails
                    </RouterLink>
                </div>


                <figure class="relative">
                    <img
                        src="../assets/img/miniaCoach1.jpg"
                        alt="aperçu"
                        class="w-full h-[300px] md:h-[440px] object-cover rounded-2xl shadow-lg ring-1 ring-black/5"
                    />
                </figure>
            </div>
        </article>
        <!-- Deuxième carte - vod -->
        <article
        class="mx-auto max-w-6xl rounded-[28px] bg-white shadow-xl ring-1 ring-black/5 p-8 md:p-12 mb-16"
        >
            <div class="grid md:grid-cols-2 gap-10 items-center">
               
                <figure class="relative">
                    <img
                        src="../assets/img/miniaCoach2.jpg"
                        alt="aperçu"
                        class="w-full h-[300px] md:h-[440px] object-cover rounded-2xl shadow-lg ring-1 ring-black/5"
                    />
                </figure>
                
                <div>
                    <div class="flex items-center justify-between">
                        <span class="text-3xl md:text-4xl font-extrabold tracking-tight">02</span>

                        <span
                        class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium
                                text-white shadow-md bg-cyan-300"
                        >
                        € 30
                        </span>
                    </div>

                    <h2 class="mt-6 text-3xl md:text-5xl font-bold leading-tight">
                        Analyse VOD
                    </h2>

                    <ul class="mt-6 space-y-4">
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Tu envoies une VOD d'une partie entière.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Analyse filmée : erreurs clés + alternatives optimales.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Vidéo de retour fournie.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Traitement plus rapide.</span>
                        </li>
                    </ul>

                    <RouterLink
                        :to="{ name:'formule-detail', params:{ id : '2' } }"
                        class="mt-6 inline-flex items-center justify-center rounded-2xl px-5 py-3
                            bg-cyan-300 hover:bg-cyan-500 text-white font-medium shadow hover:shadow-lg transition"
                    >
                        Plus de détails
                    </RouterLink>
                </div>

                
            </div>
        </article>
        <!-- troisième carte - aim -->
        <article
        class="mx-auto max-w-6xl rounded-[28px] bg-white shadow-xl ring-1 ring-black/5 p-8 md:p-12 mb-16"
        >
            <div class="grid md:grid-cols-2 gap-10 items-center">

                <div>
                    <div class="flex items-center justify-between">
                        <span class="text-3xl md:text-4xl font-extrabold tracking-tight">03</span>

                        <span
                        class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium
                                text-white shadow-md bg-cyan-300"
                        >
                        € 40
                        </span>
                    </div>

                    <h2 class="mt-6 text-3xl md:text-5xl font-bold leading-tight">
                        Coaching Aim
                    </h2>

                    <ul class="mt-6 space-y-4">
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Crosshair placement.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Tracking & Flicks.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Mouvements & peeks.</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Réglages perso.</span>
                        </li>
                    </ul>

                    <RouterLink
                        :to="{ name:'formule-detail', params:{ id : '3' } }"
                        class="mt-6 inline-flex items-center justify-center rounded-2xl px-5 py-3
                            bg-cyan-300 hover:bg-cyan-500 text-white font-medium shadow hover:shadow-lg transition"
                    >
                        Plus de détails
                    </RouterLink>
                </div>

                <figure class="relative">
                    <img
                        src="../assets/img/miniaCoach3.jpg"
                        alt="aperçu"
                        class="w-full h-[300px] md:h-[440px] object-cover rounded-2xl shadow-lg ring-1 ring-black/5"
                    />
                </figure>
            </div>
        </article>
        <!-- quatrième carte - agent poll -->
        <article
        class="mx-auto max-w-6xl rounded-[28px] bg-white shadow-xl ring-1 ring-black/5 p-8 md:p-12 mb-16"
        >
            <div class="grid md:grid-cols-2 gap-10 items-center">

                <figure class="relative">
                    <img
                        src="../assets/img/miniaCoach4.jpg"
                        alt="aperçu"
                        class="w-full h-[300px] md:h-[440px] object-cover rounded-2xl shadow-lg ring-1 ring-black/5"
                    />
                </figure>
                
                <div>
                    <div class="flex items-center justify-between">
                        <span class="text-3xl md:text-4xl font-extrabold tracking-tight">04</span>

                        <span
                        class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium
                                text-white shadow-md bg-cyan-300"
                        >
                        € 40
                        </span>
                    </div>

                    <h2 class="mt-6 text-3xl md:text-5xl font-bold leading-tight">
                        Maîtriser ton Agent Pool
                    </h2>

                    <ul class="mt-6 space-y-4">
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Audit personnalisé</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Recommandations par carte</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Optimisation de ton main</span>
                        </li>
                        <li class="flex items-start gap-3">
                            <img src="../assets/img/checkbleu.png" alt="check" class="w-[24px] h-[24px]">
                            <span class="text-lg">Teamplay & synergies</span>
                        </li>
                    </ul>

                    <RouterLink
                        :to="{ name:'formule-detail', params:{ id : '4' } }"
                        class="mt-6 inline-flex items-center justify-center rounded-2xl px-5 py-3
                            bg-cyan-300 hover:bg-cyan-500 text-white font-medium shadow hover:shadow-lg transition"
                    >
                        Plus de détails
                    </RouterLink>
                </div>
            </div>
        </article>
    </main>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>