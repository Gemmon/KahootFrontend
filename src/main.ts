import './main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

import { useAuthStore } from '@/stores/auth'

axios.defaults.baseURL = import.meta.env.VITE_API_URL

axios.interceptors.request.use(
  (config) => {
    try {
      const authStore = useAuthStore()
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
      }
    } catch (error) {
      console.warn('Auth store not available:', error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

app.mount('#app')