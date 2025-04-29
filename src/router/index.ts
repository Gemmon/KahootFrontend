import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/MainPage.vue'),
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../views/ExploreView.vue'),
    },
    {
      path: '/create-lobby',
      name: 'create-lobby',
      component: () => import('../views/CreateLobbyView.vue'),
    },
    {
      path: '/lobby-host',
      name: 'lobby-host',
      component: () => import('../views/LobbyHostView.vue'),
    },
    {
      path: '/lobby-guest',
      name: 'lobby-guest',
      component: () => import('../views/LobbyGuestView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LogInPageView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpPageView.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordPageView.vue')
    },
  ],
})

export default router

