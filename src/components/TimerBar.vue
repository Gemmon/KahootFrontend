<template>
  <section class="timer-section">
    <h3 class="timer-label">Pozostały czas</h3>
    <div
      class="bar-container"
      :class="{
        correct: showResult && isCorrect,
        wrong: showResult && !isCorrect,
        countdown: !showResult
      }"
    >
      <div
        class="bar-fill"
        v-if="!showResult"
        :style="{ width: progressPercent + '%' }"
      ></div>
      <div class="bar-text">
        {{ showResult
          ? isCorrect
            ? `Zdobyłeś ${earnedPoints} punktów.`
            : 'Nie zdobyłeś żadnych punktów.'
          : timeRemaining + ' sekund'
        }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  timeRemaining: number;
  timeLimit: number;
  showResult: boolean;
  earnedPoints: number;
}>();

const progressPercent = computed(() => {
  return (props.timeRemaining / props.timeLimit) * 100;
});

const isCorrect = computed(() => {
  return props.earnedPoints > 0;
});
</script>

<style scoped>
.timer-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer-label {
  color: #fff;
  font-family: "Libre Franklin", -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 32px;
  font-weight: 600;
  margin: 8px 0;
}

.bar-container {
  border-radius: 12px;
  border: 8px solid #47424e;
  background-color: #242227;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  height: 40px;
  position: relative;
  overflow: hidden;
  padding: 1px;
  transition: background-color 0.3s ease;
}

.bar-container.countdown {
  background-color: #242227;
}

.bar-container.correct {
  background-color: #0066cc;
}

.bar-container.wrong {
  background-color: #cc0000;
}

.bar-fill {
  background-color: #17bd30;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: width 0.3s ease;
  z-index: 0;
}

.bar-text {
  position: relative;
  z-index: 1;
  font-family: "Libre Franklin", -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  width: 100%;
  text-align: center;
  pointer-events: none;
}

@media (max-width: 991px) {
  .bar-container {
    height: 60px;
  }
}
</style>
