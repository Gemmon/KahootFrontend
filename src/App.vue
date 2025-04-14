<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header.vue';

const isLogged = ref(false)
</script>

<template>
  <Header v-bind:isLogged="isLogged" />
  <div class="page-content">
    <RouterView v-slot="{ Component }">
      <component :is="Component" :isLogged="isLogged" />
    </RouterView>
  </div>
</template>

<style scoped>
.page-content {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px);
  height: 100%;
}
</style>
