<script setup>
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"
</script>

<template>
  <header>
    <Header />
  </header>
  <main>
    <RouterView />
  </main>
  <footer>
    <Footer />
  </footer>
</template>

