<script setup lang="ts">
import { useStore } from '../stores/store.ts'

const store = useStore()
</script>

<template>
  <button @click="store.count++">Clicks: {{ store.count }}</button>
</template>