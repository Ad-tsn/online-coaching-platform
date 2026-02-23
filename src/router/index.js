
import { createRouter, createWebHistory } from "vue-router"

import HomeView from "../views/HomeView.vue"
import FormulesListView from "../views/FormulesListView.vue"
import AboutmeView from "../views/AboutmeView.vue"
import CgvRetourView from "../views/CgvRetourView.vue"
import AvisView from "../views/AvisView.vue"
import FormuleDetail from "../views/FormuleDetailView.vue"
import CommandeView from "../views/CommandeView.vue"
import SuccesCommandeView from "../views/SuccesCommandeView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/formules',
      name: 'formules',
      component: FormulesListView,
    },
    {
      path: '/aboutme',
      name: 'aboutme',
      component: AboutmeView,
    },
    {
      path: '/cgvretour',
      name: 'cgvretour',
      component: CgvRetourView,
    },
    {
      path: '/avis',
      name: 'avis',
      component: AvisView,
    },
    {
      path: '/formules/:id',
      name: 'formule-detail',
      component: FormuleDetail ,
    },
    {
      path: '/commande',
      name: 'commande',
      component: CommandeView,
    },
    {
      path: '/commande/succes',
      name: 'commande-succes',
      component: SuccesCommandeView,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router
