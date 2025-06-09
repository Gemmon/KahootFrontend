<template>
  <main class="quiz-host">
    <section class="quiz-content">
      <div class="quiz-container">
        <div class="quiz-header">
          <h1 class="quiz-title">{{ gameStore.quiz?.title }}</h1>
          <p class="question-counter">Pytanie {{ gameStore.questionNumber }}/{{ gameStore.quiz?.Question.length ?? 0 }}</p>
        </div>

        <div class="quiz-main">
          <div class="quiz-columns">
            <div class="question-column">
              <QuestionCard v-if="question"
                :question="question.content || ''"
                :answers="question.Answer"
                :backgroundImage="''"
                v-model="selectedAnswerId"
                :showResult="showResult"
                @answerSelected="sendAnswer"
              />
            </div>
            <div class="image-column">
              <div class="right-image-container">
                <AnswerDistribution
                  v-if="showResult"
                  :answers="question?.Answer || []"
                  :votes="gameStore.distribution"
                  :correctAnswerId="correctAnswerId"
                  :selectedAnswerId="selectedAnswerId"
                />
                <!-- <img v-else :src="''" alt="" class="right-image" /> -->
              </div>
            </div>
          </div>
        </div>
        <TimerBar 
          :timeRemaining="timeRemaining" 
          :timeLimit="TIME_LIMIT" 
          :showResult="showResult"
          :earned-points="earnedPoints"
        />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import QuestionCard from '../components/QuestionCard.vue';
import AnswerDistribution from '../components/AnswerDistribution.vue';
import TimerBar from '../components/TimerBar.vue';
import { useGameStore } from '@/stores/gameStore';
import { useRouter } from 'vue-router';

const gameStore = useGameStore();
const router = useRouter();
if (gameStore.socket === null) {
  router.push('/')
}

const selectedAnswerId = ref<number | null>(null);
const showResult = ref(false);
const question = computed(() => gameStore.currentQuestion);
const correctAnswerId = computed(() => {
  const correctAnswer = gameStore.currentQuestion?.Answer.find(a => a.is_correct);
  return correctAnswer ? correctAnswer.id : -1;
});

const TIME_LIMIT = parseInt(import.meta.env.VITE_QUESTION_ANSWER_TIME) || 15;
const RESULTS_TIME_LIMIT = parseInt(import.meta.env.VITE_QUESTION_RESULT_TIME) || 5;
const timeRemaining = ref(TIME_LIMIT);
const earnedPoints = ref(0);

let timerId: number | undefined;

onMounted(() => {
  startTimer();
});

onBeforeUnmount(() => {
  clearInterval(timerId);
});

function startTimer() {
  timeRemaining.value = TIME_LIMIT;
  clearInterval(timerId);
  timerId = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      clearInterval(timerId);
    }
  }, 1000);
}

watch(timeRemaining, (newVal) => {
  if (newVal === 0) {
    showResult.value = true;
    if (gameStore.hosting) {
      setTimeout(() => {
        gameStore.nextQuestion();
      }, RESULTS_TIME_LIMIT * 1000);
    }
  }
});

watch(() => gameStore.questionNumber, (newQuestion) => {
  if (newQuestion) {
    selectedAnswerId.value = null;
    showResult.value = false;
    earnedPoints.value = 0;
    startTimer();
  }
});

watch(() => gameStore.state, (newState) => {
  if (newState === 'finished') {
    if (gameStore.hosting)
      router.push('/final-ranking-host')
    else
      router.push('/final-ranking-guest');
  }
})

async function sendAnswer() {
  if (selectedAnswerId.value !== null) {
    earnedPoints.value = await gameStore.sendAnswer(selectedAnswerId.value);
  }
}
</script>

<style scoped>
.quiz-host {
  background-color: #242227;
  padding: 23px 58px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center; /* dodajemy, żeby środek był wycentrowany */
  height: 90vh; /* pełna wysokość okna */
}

.quiz-content {
  border-radius: 8px;
  background-color: #322e38;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  max-height: 80vh; /* <--- ważne */
  overflow: hidden; /* ukrycie nadmiaru */
  align-items: center;
  padding: 20px 40px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
}


.quiz-container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  height: 80vh;
  flex-direction: column;
  align-items: center; /* wycentrowanie zawartości */
}

.quiz-header {
  display: flex;
  align-items: center;
  gap: 20px;
  font-family: "Libre Franklin", -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 32px;
  color: #fff;
  font-weight: 600;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}

.quiz-title,
.question-counter {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
}

.quiz-main {
  margin-top: 15px;
  width: 100%;
  overflow-y: auto;
  flex-grow: 1;
}

.quiz-columns {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  height: 100%;
}

.question-column {
  width: 48%;
  background: #3a3643;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.image-column {
  width: 48%;
  background: #3a3643;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.right-image-container {
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  border: 8px solid #47424e;
  background-color: #fff;
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
}


.right-image {
  aspect-ratio: 0.87;
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}

@media (max-width: 991px) {
  .quiz-host {
    padding: 23px 20px;
  }

  .quiz-content {
    max-width: 100%;
    padding: 26px 20px 40px;
  }

  .quiz-container {
    max-width: 100%;
  }

  .quiz-header {
    margin-right: 4px;
  }

  .quiz-columns {
    flex-direction: column;
  }

  .question-column,
  .image-column {
    width: 100%;
  }

  .right-image-container {
    margin-top: 0px;
  }

  .right-image {
    max-width: 100%;
  }
}
</style>
