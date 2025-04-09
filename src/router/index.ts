import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/lobby-guest',
      name: 'lobby-guest',
      component: () => import('../views/LobbyGuestView.vue')
    },
    {
      path: '/lobby-host',
      name: 'lobby-host',
      component: () => import('../views/LobbyHostView.vue')
    }
  ],
})

export default router
