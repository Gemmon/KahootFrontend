
<template>
    <LoggedHome v-if="authStore.isAuthenticated" />
    <GuestHome v-else />
</template>

<script setup lang="ts">
import GuestHome from '@/views/GuestHome.vue';
import LoggedHome from '@/views/LoggedHome.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>