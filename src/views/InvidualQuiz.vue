<template>
  <div class="quiz-view">
    <main class="main-content">
      <div class="quiz-container">
        <!-- Quiz Header Section -->
        <div class="quiz-header">
          
          <h1 class="quiz-title">{{ quiz.title }}</h1>
          
          <div class="quiz-actions">
            <n-button quaternary circle class="like-button" :class="{ 'liked': isLiked }" @click="toggleLike">
              <template #icon>
                <n-icon>
                  <component :is="isLiked ? HeartFilled : HeartOutline" />
                </n-icon>
              </template>
            </n-button>
            
            <n-button type="primary" class="start-button" @click="startQuiz">
              Start
              <template #icon>
                <n-icon><PlayIcon /></n-icon>
              </template>
            </n-button>
            
            <n-button type="default" circle class="back-button" @click="goBack">
              <template #icon>
                <n-icon><ArrowBackIcon /></n-icon>
              </template>
            </n-button>
          </div>
        </div>
        
        <!-- Question Display Section -->
        <div class="question-section" :style="{ backgroundImage: `url(${quiz.image})` }">
          <div class="question-container">
            <div class="question-text">{{ currentQuestion.text }}</div>
            
            <div class="answers-grid">
              <div 
                v-for="(answer, index) in currentQuestion.answers" 
                :key="index"
                class="answer-card"
                :class="{ 'selected': selectedAnswer === index }"
                @click="selectAnswer(index)"
              >
                <div class="answer-label">{{ ['A', 'B', 'C', 'D'][index] }}</div>
                <div class="answer-text">{{ answer }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quiz Information Section -->
        <div class="quiz-info-section">
          <n-card class="info-card">
            <div class="info-sections">
              <div class="description-section">
                <h3>Opis</h3>
                <div class="description-content">
                  <p>{{ quiz.description }}</p>
                </div>
              </div>
              
              <div class="rating-section">
                <h3>Ocena</h3>
                <div class="stars-display">
                  <n-rate v-model:value="quiz.rating" readonly />
                </div>
                
                <div class="author-info">
                  <n-avatar size="medium" :src="quiz.authorAvatar" />
                  <span>Autor</span>
                </div>
                
                <div class="rate-quiz">
                  <h4>Oceń ten Quiz</h4>
                  <n-rate v-model:value="userRating" />
                </div>
              </div>
            </div>
          </n-card>
        </div>
      </div>
    </main>
    
    <!-- Question Navigation Sidebar -->
    <div class="question-list">
      <div class="list-header">Lista Pytań</div>
      
      <div class="questions-grid">
        <div 
          v-for="(question, index) in quiz.questions" 
          :key="index"
          class="question-nav-item"
          :class="{ 
            'active': currentQuestionIndex === index,
            'completed': completedQuestions.includes(index)
          }"
          @click="navigateToQuestion(index)"
        >
          <div class="question-number">{{ index + 1 }}</div>
          <div class="question-thumbnail" :style="{ backgroundImage: `url(${quiz.image})` }"></div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { 
  NCard, 
  NButton, 
  NAvatar, 
  NIcon,
  NRate
} from 'naive-ui';
import { 
  Heart as HeartOutline, 
  Play as PlayIcon,
  GameController as GameControllerOutline,
  ArrowBack as ArrowBackIcon
} from '@vicons/ionicons5';
import { HeartFilled } from '@vicons/antd';

// Reactive state
const isLiked = ref(false);
const currentQuestionIndex = ref<number>(0);
const selectedAnswer = ref<number | null>(null);
const completedQuestions = ref<number[]>([])
const userRating = ref(0);

// Mock data for the quiz
const quiz = reactive({
  id: 1,
  title: 'Star Wars',
  image: 'https://placehold.co/600x400/0000FF/FFFFFF?text=Star%20Wars',
  authorAvatar: '/api/placeholder/50/50',
  description: 'To jest przykładowy opis quizu. Możesz przeczytać ten opis, aby dowiedzieć się więcej o tym quizie.',
  rating: 3,
  questions: [
    {
      id: 1,
      text: 'Przykładowe pytanie?',
      answers: [
        'Przykładowa odpowiedź',
        'Przykładowa odpowiedź',
        'Przykładowa odpowiedź',
        'Przykładowa odpowiedź'
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      text: 'Drugie pytanie quizu?',
      answers: [
        'Odpowiedź A',
        'Odpowiedź B',
        'Odpowiedź C',
        'Odpowiedź D'
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      text: 'Trzecie pytanie quizu?',
      answers: [
        'Odpowiedź 1',
        'Odpowiedź 2',
        'Odpowiedź 3',
        'Odpowiedź 4'
      ],
      correctAnswer: 2
    },
    {
      id: 4,
      text: 'Czwarte pytanie quizu?',
      answers: [
        'Pierwsza odpowiedź',
        'Druga odpowiedź',
        'Trzecia odpowiedź',
        'Czwarta odpowiedź'
      ],
      correctAnswer: 3
    }
  ]
});

// Computed property for current question
const currentQuestion = computed(() => {
  return quiz.questions[currentQuestionIndex.value];
});

// Methods
const toggleLike = () => {
  isLiked.value = !isLiked.value;
};

const startQuiz = () => {
  // Logic to start the quiz
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  completedQuestions.value.length = 0;
};

const selectAnswer = (index: number) => {
  selectedAnswer.value = index;
  if (!completedQuestions.value.includes(currentQuestionIndex.value)) {
    completedQuestions.value.push(currentQuestionIndex.value);
  }
};

const navigateToQuestion = (index: number) => {
  currentQuestionIndex.value = index;
  selectedAnswer.value = null;
};

const goBack = () => {
  // Logic to go back to previous page
};

const goToHome = () => {
  // Logic to navigate home
};
</script>

<style scoped>
.quiz-view {
  display: flex;
  background-color: #333;
  color: white;
  height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
}

.main-content {
  color: white;
  flex: 1;
  padding: 20px;
  max-width: calc(100% - 280px); 
}

.quiz-container {
  color: white;
  max-width: 1000px;
  margin: 0 auto;
}

/* Quiz Header Styles */
.quiz-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
}

.quiz-logo {
  margin-right: 15px;
}

.quiz-title {
  flex: 1;
  font-size: 42px;
  margin: 0;
  font-weight: bold;
}

.quiz-actions {
  display: flex;
  gap: 12px;
}

.like-button {
  color: white !important;
  font-size: 22px !important;
  border: 3px solid #004d1a !important;
  border-radius: 50% !important;
  width: 50px !important;
  height: 50px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s ease !important;
  background-color: transparent !important;
}

.like-button:hover {
  background-color: rgba(0, 77, 26, 0.2) !important;
}

.like-button.liked {
  background-color: #004d1a !important;
  color: white !important;
  border-color: #004d1a !important;
  box-shadow: 0 0 8px rgba(0, 77, 26, 0.6) !important;
}

.like-button.liked:hover {
  background-color: #003d15 !important;
  scale: 1.03;
}

.start-button {
  background-color: #004d1a !important;
  border-radius: 12px !important;
  padding: 5px 22px !important;
  font-size: 16px !important;
  font-weight: bold !important;
  transition: all 0.3s ease !important;
  height: 50px !important;
}

.start-button:hover {
  transform: scale(1.05) !important;
  box-shadow: 0 0 10px rgba(0, 77, 26, 0.5) !important;
}

.back-button {
  color: white !important;
  font-size: 18px !important;
  border: 2px solid #555 !important;
  background-color: rgba(0, 0, 0, 0.3) !important;
  width: 50px !important;
  height: 50px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s ease !important;
}

/* Question Section Styles */
.question-section {
  background-size: cover;
  background-position: center;
  border-radius: 12px; 
  overflow: auto;
  margin-bottom: 20px;
  position: relative;
  min-height: 300px;
  border: 2px solid #004d1a;
}

.question-section::before {
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
}

.question-text {
  background-color: #004d1a;
  padding: 18px;
  border-radius: 10px;
  font-size: 20px; 
  font-weight: bold;
  margin-bottom: 24px;
}

.answers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px; 
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
  font-size: 16px; 
}

.answer-card:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.answer-card.selected {
  background-color: #004d1a;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 77, 26, 0.5);
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
  background-color: #004d1a;
  color: white;
  border-radius: 50%;
}

.answer-card.selected .answer-label {
  background-color: white;
  color: #004d1a;
}

.answer-text {
  flex: 1;
}

/* Quiz Information Section Styles */
.quiz-info-section {
  color: white;
  margin-top: 24px;
}

.info-card {
  color: white;
  background-color: #444 !important;
  border-radius: 12px !important;
}

.info-sections {
  color: white;
  display: flex;
  gap: 24px;
}

.description-section {
  flex: 1;
  background-color: #333;
  padding: 18px; 
  border-radius: 10px;
}

.description-section h3, .rating-section h3 {
  font-size: 20px;
  margin-bottom: 12px;
}

.description-content {
  font-size: 16px; 
  line-height: 1.6;
}

.rating-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px; /* Zwiększono odstęp */
}

.stars-display {
  font-size: 28px; /* Zwiększono rozmiar */
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
}

.rate-quiz {
  text-align: center;
  width: 100%;
  margin-top: 10px;
}

.rate-quiz h4 {
  font-size: 18px;
  margin-bottom: 8px;
}

/* Question List Sidebar Styles */
.question-list {
  width: 280px; 
  background-color: #222;
  padding: 32px 24px; 
  display: flex;
  flex-direction: column;
}

.list-header {
  font-size: 20px;
  font-weight: bold;
  padding: 12px;
  text-align: center;
  margin-bottom: 20px; 
  border-bottom: 2px solid #004d1a;
}

.questions-grid {
  display: flex;
  flex-direction: column;
  gap: 16px; 
  flex: 1;
}

.question-nav-item {
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.question-nav-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.question-nav-item.active {
  border-color: #004d1a;
  transform: scale(1.03); 
  box-shadow: 0 0 0 3px rgba(0, 77, 26, 0.5), 0 4px 10px rgba(0, 0, 0, 0.4);
  border-radius: 11px;
}

.question-nav-item.completed::after {
  content: '✓';
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #004d1a;
  color: white;
  width: 24px; 
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  z-index: 3;
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
  z-index: 2;
  font-size: 16px;
  font-weight: bold;
}

.question-thumbnail {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
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

.question-nav-item.active .question-thumbnail::before {
  background: rgba(0, 77, 26, 0.3); 
}

.back-home-btn {
  margin-top: 24px;
  color: white !important;
  font-size: 16px !important;
  padding: 10px !important;
  border-radius: 8px !important;
}

.back-home-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .quiz-view {
    flex-direction: column;
  }
  
  .main-content {
    max-width: 100%;
  }
  
  .question-list {
    width: 100%;
    height: auto;
  }
  
  .questions-grid {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .question-nav-item {
    min-width: 180px;
  }
  
  .info-sections {
    flex-direction: column;
  }
  
  .answers-grid {
    grid-template-columns: 1fr;
  }
  
  .quiz-title {
    font-size: 24px; 
  }
}
</style>