<template>
    <LoggedHome v-if="props.isLogged" />
    <GuestHome v-else/>
</template>

<script setup lang="ts">
import GuestHome from '@/components/GuestHome.vue';
import LoggedHome from '@/components/LoggedHome.vue';

const props = defineProps<{
    isLogged: Boolean
}>();

</script>