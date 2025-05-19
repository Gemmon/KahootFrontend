<template>
  <section class="question-container">
    <div class="question-wrapper">
      <img :src="backgroundImage" class="background-image" alt="" />
      <div class="question-content">
        <h2 class="question-text">{{ question }}</h2>
        <div class="answers-grid">
          <div class="answers-row">
            <div class="answer-column">
              <div class="answer-option">
                <span class="option-letter">A</span>
                <p class="option-text">{{ answers[0].text }}</p>
              </div>
            </div>
            <div class="answer-column">
              <div class="answer-option">
                <span class="option-letter">B</span>
                <p class="option-text">{{ answers[1].text }}</p>
              </div>
            </div>
          </div>
          <div class="answers-row">
            <div class="answer-column">
              <div class="answer-option">
                <span class="option-letter">C</span>
                <p class="option-text">{{ answers[2].text }}</p>
              </div>
            </div>
            <div class="answer-column">
              <div class="answer-option">
                <span class="option-letter">D</span>
                <p class="option-text">{{ answers[3].text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

defineProps<{
  question: string;
  answers: {
    id: string;
    text: string;
  }[];
  backgroundImage: string;
}>();
</script>

<style scoped>
.question-container {
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
  gap: 20px;
  margin: 0;
  width: 100%;
}

.answer-column {
  width: 50%;
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
    margin-top: 38px;
  }

  .question-content {
    padding: 37px 20px;
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
