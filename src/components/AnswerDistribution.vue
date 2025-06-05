<template>
  <div class="answer-distribution">
    <div
      v-for="(answer, index) in answers"
      :key="answer.id"
      class="distribution-bar"
      :class="{
        correct: answer.id === correctAnswerId,
        wrong: answer.id !== correctAnswerId,
        selected: answer.id === selectedAnswerId
      }"
      :style="{
        width: 'calc(' + getBarWidth(answer.id) + '% - 4vh)', // skrócone o 6vh
        backgroundColor: getBarColor(answer.id)
    }"
    >
      <span class="label">{{ String.fromCharCode(65 + index) }}</span>
      <span class="votes">{{ votes[answer.id] || 0 }}</span>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  answers: { id: string; text: string }[];
  correctAnswerId: string;
  selectedAnswerId: string | null;
  votes: Record<string, number>;
}>();

function getBarWidth(id: string) {
  const allVotes = Object.values(props.votes);
  const max = Math.max(...allVotes, 1); // jak nic nie ma, to przynajmniej 1
  const value = props.votes[id] ?? 0;
  return (value / max) * 100;
}

function getBarColor(id: string) {
  if (id === props.correctAnswerId) return '#00b7ff';
  if (id === props.selectedAnswerId) return '#f44336';
  return '#ccc'; // neutralny
}
</script>

<style scoped>
.answer-distribution {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2vh;
  height: 100%;
  padding: 1vh 2vh;
  background-color: #2d2a33;
  box-sizing: border-box;
}

.distribution-bar {
  height: 10vh;
  border-radius: 12px;
  padding: 1vh 2vh;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #555;
  color: #fff;
  transition: width 0.3s ease;
  position: relative;
  transform: translateX(-100%);
  opacity: 0;
  animation: slideIn 0.6s ease forwards;
}

.distribution-bar:nth-child(1) {
  animation-delay: 0.1s;
}
.distribution-bar:nth-child(2) {
  animation-delay: 0.2s;
}
.distribution-bar:nth-child(3) {
  animation-delay: 0.3s;
}
.distribution-bar:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes slideIn {
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* poprawna odpowiedź */
.correct {
  background-color: #3ca7ff;
}

/* błędna odpowiedź */
.wrong {
  background-color: #b83838;
}

/* opcjonalnie: zaznaczenie użytkownika */
.selected::after {
  content: "✓";
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
}

.label {
  font-size: 20px;
  width: 30px;
}

.votes {
  margin-left: 16px;
}
</style>

