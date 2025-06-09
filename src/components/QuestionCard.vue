<template>
  <section class="question-container">
    <div class="question-wrapper">
      <!-- <img :src="backgroundImage" class="background-image" alt="" /> -->
      <div class="question-content">
        <h2 class="question-text">{{ question }}</h2>
        <div class="answers-grid">
          <div class="answers-row">
            <div
              class="answer-column"
              v-for="(answer, index) in answers"
              :key="answer.id"
            >
              <div
                class="answer-option"
                :class="{
                  selected: selectedAnswerId === answer.id && !showResult,
                  correct: showResult && answer.is_correct,
                  wrong: showResult && selectedAnswerId === answer.id && !answer.is_correct,
                  disabled: showResult || selectedAnswerId !== null
                }"
                @click="selectAnswer(answer.id)"
              >
                <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
                <p class="option-text">{{ answer.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps<{
  question: string;
  answers: Answer[];
  backgroundImage: string;
  showResult: boolean;
}>();

const emit = defineEmits<{
  (e: "answerSelected", answerId: number): void;
}>();

const selectedAnswerId = defineModel<number | null>({ required: true });

function selectAnswer(id: number) {
  if (props.showResult || selectedAnswerId.value !== null) {
    // Jeśli pokazujemy wynik, blokujemy zmianę wyboru
    return;
  }
  selectedAnswerId.value = id;
  console.log("Wybrano odpowiedź:", id);
  emit("answerSelected", id);
}
</script>

<style scoped>
.question-container {
  cursor: pointer;
  border-radius: 12px;
  border: 8px solid #47424e;
  background-color: #fff;
  display: flex;
  flex-grow: 1;
  padding: 2px;
  flex-direction: column;
  overflow: hidden;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.answer-option:hover {
  background-color: #98c977;
}

.answer-option.selected {
  background-color: #17a935;
  color: white;
  font-weight: 700;
  box-shadow: 0 0 15px #17a935;
}

.answer-option.correct {
  background-color: #80d4ff;
  border: 2px solid #0088cc;
}

.answer-option.wrong {
  background-color: #f88;
  border: 2px solid #cc0000;
}

.answer-option.disabled {
  cursor: not-allowed;
  pointer-events: none; /* blokuje całkowicie kliknięcia */
  user-select: none; /* blokuje zaznaczanie */
}


.question-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.background-image {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}

.question-content {
  position: relative;
  background-color: rgba(30, 30, 30, 0.25);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 10px;
  max-height: calc(100vh - 50px);
  box-sizing: border-box;
  overflow-x: hidden;
}

.question-text {
  border-radius: 12px;
  box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.5);
  background-color: #17a935;
  padding: 24px 20px;
  overflow: hidden;
  font-family: "Libre Franklin", -apple-system, Roboto, Helvetica, sans-serif;
  font-size: large;
  color: #fff;
  font-weight: 600;
  margin: 0;
}

.answers-grid {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 23px;
}

.answers-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  margin: 0;
}

.answer-column {
  width: calc(50% - 10px); /* 2 kolumny, uwzględniając gap */
  box-sizing: border-box;
}

.answer-option {
  border-radius: 12px;
  box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.5);
  background-color: #b7adad;
  display: flex;
  flex-direction: column;
  padding: 0 18px 10px;
  overflow: hidden;
  font-family: "Libre Franklin", -apple-system, Roboto, Helvetica, sans-serif;
  color: #000;
  font-weight: 600;
  box-sizing: border-box;
}

.option-letter {
  font-size:xx-large;
}

.option-text {
  font-size: large;
  margin-bottom: 0;
}

@media (max-width: 991px) {
  .question-container {
    max-width: 100%;
  }

  .question-content {
    padding: 10px 10px;
  }

  .answers-row {
    flex-direction: column;
  }

  .answer-column {
    width: 100%;
    margin-top: 23px;
  }

  .answer-option {
    padding-right: 20px;
  }
}
</style>
