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
      component: () => import('../views/LobbyHostView.vue')
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
    {
      path: '/restore-password',
      name: 'restore-password',
      component: () => import('../views/RestorePasswordPageView.vue')
    },
    {
      path: '/individual',
      name: 'individual',
      component: () => import('../views/InvidualQuiz.vue')
    },
    {
      path: '/create-quiz',
      name: 'create-quiz',
      component: () => import('../views/CreateQuizView.vue')
    },
    {
      path: '/quiz-questions',
      name: 'quiz-questions',
      component: () => import('../views/AddQuestionsToQuizView.vue')
    },
    {
      path: '/history-empty',
      name: 'history-empty',
      component: () => import('../views/QuizHistoryViewEmpty.vue'),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/QuizHistoryView.vue'),
    },
    {
      path: '/current-ranking',
      name: 'current-ranking',
      component: () => import('../views/CurrentRanking.vue'),
    },
    {
      path: '/final-ranking-host',
      name: 'final-ranking-host',
      component: () => import('../views/FinalRankingHost.vue'),
    },
    {
      path: '/final-ranking-guest',
      name: 'final-ranking-guest',
      component: () => import('../views/FinalRankingGuest.vue'),
    },
    {
      path: '/question',
      name: 'question',
      component: () => import('../views/QuizQuestion.vue')
    },
  ],
})

export default router

