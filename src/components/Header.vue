<template>
  <n-layout-header class="main-header">
    <div class="header-left">
      <div class="logo" @click="goToHome">
        <span class="logo-letter">G</span>
      </div>
      <nav class="main-nav">
        <n-button class="nav-btn" quaternary type="primary">
          <template #icon><n-icon><AddIcon /></n-icon></template>
          Create
        </n-button>
        <!-- Join Button with custom dropdown -->
        <n-popover 
          trigger="click" 
          placement="bottom" 
          :show="showJoinPopover"
          @update:show="showJoinPopover = $event"
          raw
          class="join-popover"
        >
          <template #trigger>
            <n-button class="nav-btn" quaternary type="primary">
              <template #icon><n-icon><PersonAddIcon /></n-icon></template>
              Join
            </n-button>
          </template>
          <div class="join-popover-content">
            <h3 class="join-title">Enter Code</h3>
            <n-input 
              v-model:value="joinCode" 
              type="text" 
              placeholder="Code" 
              class="join-input"
            />
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <n-button type="primary" class="join-button" @click="handleJoin">Join</n-button>
          </div>
        </n-popover>
        <n-button @click="goToExplore" class="nav-btn" quaternary type="primary">
          <template #icon><n-icon><CompassOutlineIcon /></n-icon></template>
          Explore
        </n-button>
      </nav>
    </div>
    <div class="header-right">
      <n-dropdown trigger="click" :options="dropdownOptions" @select="handleSelect">
        <div class="user-profile">
          <n-avatar round src="https://placehold.co/40" />
        </div>
      </n-dropdown>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { 
  NButton, 
  NIcon, 
  NAvatar, 
  NDropdown, 
  NLayoutHeader,
  NPopover,
  NInput
} from 'naive-ui'
import { 
  Add as AddIcon, 
  PersonAdd as PersonAddIcon 
} from '@vicons/ionicons5'
import { CompassOutline as CompassOutlineIcon } from '@vicons/ionicons5'

const joinCode = ref('')
const showJoinPopover = ref(false)
const errorMessage = ref('')

const dropdownOptions = [
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

const handleSelect = (key) => {
  console.log(`Selected: ${key}`)
}

const handleJoin = () => {
  if (joinCode.value.trim()) {
    console.log(`Joining with code: ${joinCode.value}`)
    errorMessage.value = ''
    showJoinPopover.value = false

  } else {
    errorMessage.value = 'No such game!'
    console.log('No code entered')
  }
}
const router = useRouter();

const goToHome = () =>{

router.push('/')
}
const goToExplore = () =>{

  router.push('/explore')
}
</script>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #004d1a;
  padding: 10px 20px;
  color: white;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  margin-right: 15px;
}

.logo-letter {
  color: #004d1a;
  font-weight: bold;
  font-size: 20px;
}

.main-nav {
  display: flex;
  gap: 15px;
}

.nav-btn {
  color: white !important;
  font-size: 16px;
}

.user-profile {
  cursor: pointer;
}

:deep(.n-dropdown-menu) {
  min-width: 180px;
}

/* Join popover styling */
.join-popover {
  border: none;
  padding: 0;
}

.join-popover :deep(.n-popover-content) {
  background-color: transparent;
  box-shadow: none;
  margin: 0;
  padding: 0;
}

.join-popover-content {
  width: 280px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #4a4a4a;
  border-radius: 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.join-title {
  color: white;
  font-size: 18px;
  margin: 0 0 12px 0;
  align-self: flex-start;
}

.join-input {
  width: 100%;
  margin-bottom: 16px;
}

.join-input :deep(input) {
  height: 36px;
  font-size: 16px;
}

.join-button {
  min-width: 100px;
  margin-top: 8px;
  background-color: #333;
  color: white;
  border: 1px solid #006622;
  border-radius: 4px;
  padding: 6px 20px;
  transition: background-color 0.2s;
}

.join-button:hover {
  background-color: #444;
}

.error-message {
  color: #ff3333;
  font-size: 14px;
  margin: 4px 0;
  align-self: center;
  font-weight: bold;
}
</style>