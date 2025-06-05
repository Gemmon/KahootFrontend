<template>
  <n-dropdown trigger="click" :options="isLogged ? dropdownOptionsLogged : dropdownOptionsLoggedOut"
    @select="handleSelect">
    <div class="user-profile">
      <n-avatar round src="https://placehold.co/40" />
    </div>
  </n-dropdown>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import {
  NAvatar,
  NDropdown,
} from 'naive-ui'

import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps<{
  isLogged: Boolean
}>()

const userHasQuizHistory = ref(true) // TODO: zastąp prawdziwym warunkiem czy uzytkownik ma historię quizów

const dropdownOptionsLogged = [
  {
    label: 'Settings',
    key: 'settings'
  },
  {
    label: 'History',
    key: 'history'
  },
  {
    label: 'Switch Accounts',
    key: 'switch-accounts'
  },
  {
    label: 'Log Out',
    key: 'logout'
  }
]

const dropdownOptionsLoggedOut = [
  {
    label: 'Log In',
    key: 'login'
  },
  {
    label: 'Log Out',
    key: 'logout'
  }
]

const goToLogin = () => {
  router.push('/login')
}
  const handleSelect = (key: string) => {
    console.log(`Selected: ${key}`)

    if (key === 'history') {
      if (userHasQuizHistory.value) {
        router.push('/history')
      } else {
        router.push('/history-empty')
      }
    }
    if (String(key) == 'login') {
      goToLogin()
    }
  }

</script>

<style scoped>
.user-profile {
  cursor: pointer;
}
</style>