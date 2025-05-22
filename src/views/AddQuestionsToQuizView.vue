<template>
  <div class="quiz-creator">
    <main class="main-content">
      <div class="creator-container">
        <!-- Header Section -->
        <div class="creator-header">
          <h1 class="creator-title">{{ quizData.title || 'Star Wars' }}</h1>
          
          <div class="creator-actions">
            <n-button type="success" class="publish-button" @click="publishQuiz">
              Opublikuj
            </n-button>
            
            <n-button type="error" class="cancel-button" @click="cancelCreation">
              Anuluj Tworzenie
            </n-button>
          </div>
        </div>
        
        <!-- Current Question Display Section -->
        <div class="question-display-section">
          <div class="question-preview" :style="{ backgroundImage: `url(${currentQuestionData.image || '/api/placeholder/600/400'})` }">
            <div class="question-container">
              <div class="question-input-wrapper">
                <n-input 
                  v-model:value="currentQuestionData.text"
                  placeholder="[Dodaj pytanie]"
                  class="question-input"
                  size="large"
                />
              </div>
              
              <div class="answers-grid">
                <div 
                  v-for="(answer, index) in currentQuestionData.answers" 
                  :key="index"
                  class="answer-card"
                  :class="{ 'correct': currentQuestionData.correctAnswer === index }"
                  @click="setCorrectAnswer(index)"
                >
                  <div class="answer-label">{{ ['A', 'B', 'C', 'D'][index] }}</div>
                  <n-input 
                    v-model:value="currentQuestionData.answers[index]"
                    :placeholder="`[Dodaj odpowiedź ${['A', 'B', 'C', 'D'][index]}]`"
                    class="answer-input"
                    @click.stop
                  />
                </div>
              </div>
              
              <div class="question-actions">
                <n-upload
                  :file-list="[]"
                  :show-file-list="false"
                  @change="handleImageUpload"
                  accept="image/*"
                >
                  <n-button type="primary" ghost>
                    <template #icon>
                      <n-icon><ImageIcon /></n-icon>
                    </template>
                    Edycja tła
                  </n-button>
                </n-upload>
                
                <div class="correct-answer-hint">
                  <n-text depth="3">Kliknij odpowiedź, aby oznaczyć jako poprawną</n-text>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quiz Statistics -->
        <div class="quiz-stats">
          <n-card class="stats-card">
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">Opis Quizu</div>
                <div class="stat-description">
                  {{ quizData.description || 'Brak opisu' }}
                </div>
              </div>
              
              <div class="stat-item">
                <div class="stat-label">Ilość punktów za pytanie</div>
                <n-input-number 
                  v-model:value="quizData.pointsPerQuestion" 
                  :min="1" 
                  :max="1000"
                  size="small"
                />
              </div>
              
              <div class="stat-item">
                <div class="stat-label">Ilość czasu na pytanie</div>
                <div class="time-input">
                  <n-input-number 
                    v-model:value="quizData.timePerQuestion" 
                    :min="10" 
                    :max="300"
                    size="small"
                  />
                  <span>s</span>
                </div>
              </div>
            </div>
          </n-card>
        </div>
      </div>
    </main>
    
    <!-- Questions List Sidebar -->
    <div class="questions-sidebar">
      <div class="sidebar-header">Lista pytań</div>
      
      <div class="questions-list">
        <div 
          v-for="(question, index) in quizData.questions" 
          :key="index"
          class="question-item"
          :class="{ 'active': currentQuestionIndex === index }"
          @click="selectQuestion(index)"
        >
          <div class="question-number">{{ index + 1 }}</div>
          <div class="question-thumbnail" :style="{ backgroundImage: `url(${question.image || '/api/placeholder/200/120'})` }">
            <div class="question-preview-text">
              {{ question.text || `Pytanie ${index + 1}` }}
            </div>
          </div>
          
          <n-button 
            quaternary 
            circle 
            size="small" 
            class="delete-question-btn"
            @click.stop="deleteQuestion(index)"
          >
            <template #icon>
              <n-icon><TrashIcon /></n-icon>
            </template>
          </n-button>
        </div>
        
        <!-- Add Question Button -->
        <div class="add-question-item" @click="addQuestion">
          <div class="add-question-content">
            <n-icon size="24"><PlusIcon /></n-icon>
            <span>Dodaj pytanie</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { 
  NCard, 
  NButton, 
  NInput,
  NInputNumber,
  NIcon,
  NUpload,
  NText
} from 'naive-ui';
import { 
  Image as ImageIcon,
  Add as PlusIcon,
  Trash as TrashIcon
} from '@vicons/ionicons5';

// Quiz data structure
const quizData = reactive({
  title: 'Star Wars', // Przykładowy tytuł z Pinia storage
  description: 'To jest przykładowy opis quizu. Możesz przeczytać ten opis, aby dowiedzieć się więcej o tym quizie.', // Z Pinia storage
  pointsPerQuestion: 1000,
  timePerQuestion: 30,
  questions: [
    {
      text: '',
      answers: ['', '', '', ''],
      correctAnswer: 0,
      image: ''
    }
  ]
});

const currentQuestionIndex = ref(0);

// Current question computed property
const currentQuestionData = computed(() => {
  return quizData.questions[currentQuestionIndex.value];
});

// Methods
const selectQuestion = (index: number) => {
  currentQuestionIndex.value = index;
};

const addQuestion = () => {
  quizData.questions.push({
    text: '',
    answers: ['', '', '', ''],
    correctAnswer: 0,
    image: ''
  });
  currentQuestionIndex.value = quizData.questions.length - 1;
};

const deleteQuestion = (index: number) => {
  if (quizData.questions.length > 1) {
    quizData.questions.splice(index, 1);
    if (currentQuestionIndex.value >= quizData.questions.length) {
      currentQuestionIndex.value = quizData.questions.length - 1;
    }
  } else {
    alert('Quiz musi mieć przynajmniej jedno pytanie');
  }
};

const setCorrectAnswer = (index: number) => {
  currentQuestionData.value.correctAnswer = index;
};

const handleImageUpload = (data: any) => {
  // Handle image upload logic here
  if (data.file && data.file.file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        currentQuestionData.value.image = e.target.result as string;
      }
    };
    reader.readAsDataURL(data.file.file);
  }
};

const publishQuiz = () => {
  // Check if all questions have text and at least one answer
  for (let i = 0; i < quizData.questions.length; i++) {
    const question = quizData.questions[i];
    if (!question.text.trim()) {
      alert(`Pytanie ${i + 1} nie ma tekstu`);
      return;
    }
    
    const hasAnswer = question.answers.some(answer => answer.trim() !== '');
    if (!hasAnswer) {
      alert(`Pytanie ${i + 1} nie ma żadnej odpowiedzi`);
      return;
    }
  }
  
  // Here you would send the data to your backend
  console.log('Publishing quiz:', quizData);
  alert('Quiz został opublikowany!');
};

const cancelCreation = () => {
  // Logic to cancel and go back
  if (confirm('Czy na pewno chcesz anulować tworzenie quizu? Wszystkie zmiany zostaną utracone.')) {
    // Navigate back or reset form
    console.log('Cancelling quiz creation');
  }
};
</script>

<style scoped>
.quiz-creator {
  display: flex;
  background-color: #333;
  color: white;
  height: calc(100vh - 60px);
  overflow: hidden;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: calc(100% - 280px);
  overflow-y: auto;
}

.creator-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* Header Styles */
.creator-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
}

.creator-title {
  font-size: 42px;
  margin: 0;
  font-weight: bold;
  color: white;
}

.creator-actions {
  display: flex;
  gap: 12px;
}

.publish-button {
  background-color: #22c55e !important;
  border-radius: 12px !important;
  padding: 5px 22px !important;
  font-size: 16px !important;
  font-weight: bold !important;
  transition: all 0.3s ease !important;
  height: 50px !important;
}

.publish-button:hover {
  transform: scale(1.05) !important;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5) !important;
}

.cancel-button {
  background-color: #ef4444 !important;
  border-radius: 12px !important;
  padding: 5px 22px !important;
  font-size: 16px !important;
  font-weight: bold !important;
  transition: all 0.3s ease !important;
  height: 50px !important;
}

.cancel-button:hover {
  transform: scale(1.05) !important;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5) !important;
}

/* Basic Info Section */
.quiz-basic-info {
  margin-bottom: 20px;
}

.info-card {
  background-color: #444 !important;
  border-radius: 12px !important;
}

.info-card h3 {
  color: white;
  margin-bottom: 16px;
  font-size: 18px;
}

.basic-info-grid {
  display: grid;
  gap: 16px;
}

.info-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-field label {
  color: white;
  font-weight: bold;
}

/* Question Display Section */
.question-display-section {
  margin-bottom: 20px;
}

.question-preview {
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  min-height: 350px;
  border: 2px solid #22c55e;
}

.question-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.question-container {
  position: relative;
  z-index: 2;
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.question-input-wrapper {
  margin-bottom: 24px;
}

.question-input {
  background-color: #22c55e !important;
  border-radius: 10px !important;
}

.question-input :deep(.n-input__input-el) {
  background-color: #22c55e !important;
  color: white !important;
  font-size: 20px !important;
  font-weight: bold !important;
  padding: 18px !important;
}

.question-input :deep(.n-input__input-el)::placeholder {
  color: rgba(255, 255, 255, 0.9) !important;
}

.answers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  margin-bottom: 20px;
  flex: 1;
}

.answer-card {
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
  border-radius: 10px;
  padding: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.answer-card:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.answer-card.correct {
  background-color: #22c55e;
  color: black;
  border-color: #16a34a;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.5);
}

.answer-label {
  font-weight: bold;
  font-size: 22px;
  margin-right: 18px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #22c55e;
  color: white;
  border-radius: 50%;
  flex-shrink: 0;
}

.answer-card.correct .answer-label {
  background-color: white;
  color: #22c55e;
}

.answer-input {
  flex: 1;
}

.answer-input :deep(.n-input__input-el) {
  background-color: transparent !important;
  border: none !important;
  color: black;
  color: inherit !important;
  font-size: 16px !important;
}

.answer-input :deep(.n-input__input-el)::placeholder {
  color: rgba(0, 0, 0, 0.5) !important;
}

.answer-card.correct .answer-input :deep(.n-input__input-el) {
  color: black !important;
}

.answer-card.correct .answer-input :deep(.n-input__input-el)::placeholder {
  color: rgba(255, 255, 255, 0.7) !important;
}

.question-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.correct-answer-hint {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

/* Stats Section */
.quiz-stats {
  margin-top: 20px;
}

.stats-card {
  background-color: #444 !important;
  border-radius: 12px !important;
}

.stats-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.stat-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.4;
}

.time-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-input span {
  color: white;
  font-size: 14px;
}

/* Questions Sidebar */
.questions-sidebar {
  width: 280px;
  background-color: #222;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  font-size: 20px;
  font-weight: bold;
  padding: 12px;
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #22c55e;
  color: white;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.question-item {
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.question-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.question-item.active {
  border-color: #22c55e;
  transform: scale(1.03);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.5), 0 4px 10px rgba(0, 0, 0, 0.4);
}

.question-number {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  font-size: 16px;
  font-weight: bold;
}

.question-thumbnail {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.question-thumbnail::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

.question-preview-text {
  position: relative;
  z-index: 2;
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  hyphens: auto;
}

.delete-question-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 3;
  background-color: rgba(239, 68, 68, 0.8) !important;
  color: white !important;
}

.delete-question-btn:hover {
  background-color: rgba(239, 68, 68, 1) !important;
}

.add-question-item {
  height: 120px;
  border-radius: 10px;
  border: 2px dashed #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgba(34, 197, 94, 0.1);
}

.add-question-item:hover {
  background-color: rgba(34, 197, 94, 0.2);
  transform: scale(1.02);
}

.add-question-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #22c55e;
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 768px) {
  .quiz-creator {
    flex-direction: column;
  }
  
  .main-content {
    max-width: 100%;
  }
  
  .questions-sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
  }
  
  .questions-list {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .question-item,
  .add-question-item {
    min-width: 180px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .answers-grid {
    grid-template-columns: 1fr;
  }
  
  .creator-title {
    font-size: 24px;
  }
  
  .creator-header {
    flex-direction: column;
    gap: 12px;
  }
}
</style>