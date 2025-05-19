<template>
  <section class="timer-section">
    <h3 class="timer-label">Pozostały czas</h3>
    <div class="timer-bar">
      <div class="timer-progress" :style="{ width: progressPercent + '%' }"></div>
      <div class="timer-text">{{ timeRemaining }} sekund</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  timeRemaining: number;
  timeLimit: number;
}>();

const progressPercent = computed(() => {
  return (props.timeRemaining / props.timeLimit) * 100;
});

</script>

<style scoped>
.timer-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* wyśrodkowanie zawartości */
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
  overflow: hidden;
  align-items: center;
  width: 100%; 
  max-width: 600px;
  position: relative;
} 

.timer-progress {
  border-radius: 2px;
  background-color: #17bd30;
  height: 40px; /* wysokość paska */
  width: 50%; /* ustaw to dynamicznie inline style z JS */
  transition: width 0.3s ease; /* animacja zmiany szerokości */
  position: relative;
} 

.timer-text {
  position: absolute;
  width: 100%;
  text-align: center;
  font-family: "Libre Franklin", -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  pointer-events: none; /* żeby nie przeszkadzało klikaniu */
}

@media (max-width: 991px) {
  .timer-bar {
    padding-right: 0px;
  }

  .timer-progress {
    padding: 18px 0;
  }
}
</style>
