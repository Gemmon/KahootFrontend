<template>
  <n-layout-header class="main-header">
    <div class="header-left">
      <div class="logo">
        <span class="logo-letter">G</span>
      </div>
      <nav class="main-nav">
        <n-button class="nav-btn" quaternary type="primary">
          <template #icon><n-icon><AddIcon /></n-icon></template>
          Create
        </n-button>
        <n-button class="nav-btn" quaternary type="primary">
          <template #icon><n-icon><PersonAddIcon /></n-icon></template>
          Join
        </n-button>
        <n-button class="nav-btn" quaternary type="primary">
          <template #icon><n-icon><CompassOutlineIcon /></n-icon></template>
          Explore
        </n-button>
      </nav>
    </div>
    <div class="header-right">
      <n-dropdown trigger="click" :options="dropdownOptions" @select="handleSelect">
        <div class="user-profile">
          <n-avatar round src="https://via.placeholder.com/40" />
        </div>
      </n-dropdown>
    </div>
  </n-layout-header>
</template>

<script setup>
import { ref } from 'vue'
import { NButton, NIcon, NDropdown, NAvatar, NLayoutHeader } from 'naive-ui'
import { Add as AddIcon, PersonAdd as PersonAddIcon } from '@vicons/ionicons5'
import { CompassOutline as CompassOutlineIcon } from '@vicons/ionicons5'

// Opcje ustawień przy kliknieciu profilu użytkownika
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
  // Tutaj Dodać logike do ustawień profilu
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
</style>