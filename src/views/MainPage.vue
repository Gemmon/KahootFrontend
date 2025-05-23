<template>
    <LoggedHome v-if="!props.isLogged" />
    <GuestHome v-else/>
</template>

<script setup lang="ts">
import GuestHome from '@/views/GuestHome.vue';
import LoggedHome from '@/views/LoggedHome.vue';

const props = defineProps<{
    isLogged: Boolean
}>();

</script>