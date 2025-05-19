<template>
  <section class="timer-section">
    <h3 class="timer-label">Pozostały czas</h3>
    <div class="timer-bar">
      <div class="timer-progress">{{ timeText }}</div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  timeText: string;
}>();
</script>

<style scoped>
.timer-section {
  width: 100%;
}

.timer-label {
  color: #fff;
  font-family: "Libre Franklin", -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 32px;
  font-weight: 600;
  margin: 8px 0 8px;
}

.timer-bar {
  border-radius: 12px;
  border: 8px solid #47424e;
  background-color: #242227;
  display: flex;
  padding: 1px;
  flex-direction: column;
  overflow: hidden;
  align-items: stretch;
  justify-content: center;
}

.timer-progress {
  border-radius: 2px;
  background-color: #17bd30;
  padding: 18px 24px;
  overflow: hidden;
  font-family: "Libre Franklin", -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 32px;
  color: #242227;
  font-weight: 900;
}

@media (max-width: 991px) {
  .timer-bar {
    max-width: 100%;
    padding-right: 20px;
  }

  .timer-progress {
    padding: 18px 20px;
  }
}
</style>
