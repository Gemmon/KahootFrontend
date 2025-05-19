<template>
  <main class="quiz-host">
    <section class="quiz-content">
      <div class="quiz-container">
        <div class="quiz-header">
          <h1 class="quiz-title">{{ title }}</h1>
          <p class="question-counter">Pytanie {{ questionNumber }}/{{ totalQuestions }}</p>
        </div>

        <div class="quiz-main">
          <div class="quiz-columns">
            <div class="question-column">
              <QuestionCard
                :question="question"
                :answers="answers"
                :backgroundImage="backgroundImage"
              />
            </div>
            <div class="image-column">
              <div class="right-image-container">
                <img :src="rightImage" alt="" class="right-image" />
              </div>
            </div>
          </div>
        </div>

        <TimerBar :timeText="timeRemaining + ' sekund'" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import QuestionCard from '../components/QuestionCard.vue';
import TimerBar from '../components/TimeBar.vue';

defineProps<{
  title: string;
  questionNumber: number;
  totalQuestions: number;
  question: string;
  answers: {
    id: string;
    text: string;
  }[];
  timeRemaining: number;
  backgroundImage: string;
  rightImage: string;
}>();

const mockProps = {
  title: 'Geografia Świata',
  questionNumber: 3,
  totalQuestions: 10,
  question: 'Które z poniższych miast jest stolicą Francji?',
  answers: [
    { id: 'A', text: 'Berlin' },
    { id: 'B', text: 'Madryt' },
    { id: 'C', text: 'Paryż' },
    { id: 'D', text: 'Rzym' },
  ],
  timeRemaining: 15,
  backgroundImage: '/assets/Paris.jpg',
  rightImage: '/assets/Paris.jpg',
};

const {
  title,
  questionNumber,
  totalQuestions,
  question,
  answers,
  timeRemaining,
  backgroundImage,
  rightImage,
} = mockProps;

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
    margin-top: 38px;
  }

  .right-image {
    max-width: 100%;
  }
}
</style>
