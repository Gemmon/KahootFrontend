<template>
  <n-dropdown trigger="click" :options="authStore.isAuthenticated ? dropdownOptionsLogged : dropdownOptionsLoggedOut"
    @select="handleSelect">
    <div class="user-profile">
      <n-avatar round src="https://placehold.co/40" />
    </div>
  </n-dropdown>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NAvatar,
  NDropdown,
} from 'naive-ui'

import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const userHasQuizHistory = ref(true) // TODO: zastąp prawdziwym warunkiem czy uzytkownik ma historię quizów

const dropdownOptionsLogged = [
  {
    label: 'Profil',
    key: 'profile'
  },
  {
    label: 'Historia',
    key: 'history'
  },
  {
    label: 'Przełącz konto',
    key: 'switch-accounts'
  },
  {
    label: 'Wyloguj',
    key: 'logout'
  }
]

const dropdownOptionsLoggedOut = [
  {
    label: 'Log In',
    key: 'login'
  },
  {
    label: 'Sign Up',
    key: 'signup'
  }
]

const goToLogin = () => {
  router.push('/login')
}

const goToSignup = () => {
  router.push('/signup')
}

const logout = () => {
  authStore.clearToken()
  router.push('/')
}

const handleSelect = (key: string) => {
  console.log(`Selected: ${key}`)

  switch (key) {
    case 'history':
      if (userHasQuizHistory.value) {
        router.push('/history')
      } else {
        router.push('/history-empty')
      }
      break
    
    case 'login':
      goToLogin()
      break
    
    case 'signup':
      goToSignup()
      break
    
    case 'logout':
      logout()
      break
    
    case 'profile':
      router.push('/profile')
      break
    
    case 'switch-accounts':
      // Implementuj logikę przełączania kont
      console.log('Switch accounts functionality')
      break
    
    default:
      console.log(`Unhandled action: ${key}`)
  }
}
</script>

<style scoped>
.user-profile {
  cursor: pointer;
}
</style>