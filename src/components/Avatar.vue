
<template>
    <n-dropdown trigger="click" :options="isLogged ? dropdownOptionsLogged : dropdownOptionsLoggedOut" @select="handleSelect">
        <div class="user-profile">
            <n-avatar round src="https://placehold.co/40" />
        </div>
    </n-dropdown>
</template>

<script setup lang="ts" >

import { ref } from 'vue'
import { 
  NAvatar, 
  NDropdown, 
} from 'naive-ui'


const props = defineProps<{
  isLogged: Boolean
}>()

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


const handleSelect = (key: String) => {
  console.log(`Selected: ${key}`)
}


</script>

<style scoped>
.user-profile {
  cursor: pointer;
}

</style>