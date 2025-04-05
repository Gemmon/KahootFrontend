<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header.vue';
</script>

<template>
  <Header />
  <div class="page-content">
    <RouterView />
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
