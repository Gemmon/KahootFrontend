<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header.vue';
import { NConfigProvider, darkTheme, lightTheme, NNotificationProvider } from 'naive-ui'

const isLogged = ref(true)
</script>

<template>
  <n-config-provider :theme="lightTheme">
    <n-notification-provider>
      <Header v-bind:isLogged="isLogged" />
      <div class="page-content">
        <RouterView v-slot="{ Component }">
          <component :is="Component" :isLogged="isLogged" />
        </RouterView>
      </div>
    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px);
  background-color: #333;
}
</style>
