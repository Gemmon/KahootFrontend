<template>
  <div class="quiz-view" v-if="!loading">
    <main class="main-content">
      <div class="quiz-container">
        <!-- Quiz Header Section -->
        <div class="quiz-header">
          
          <h1 class="quiz-title">{{ quiz.title }}</h1>
          
          <div class="quiz-actions">
            <n-button quaternary circle class="like-button" :class="{ 'liked': isLiked }" @click="toggleLike" v-if="!quiz.isOwner">
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

            <n-button type="warning" class="edit-button" @click="editQuiz" v-if="quiz.isOwner">
              Edit
              <template #icon>
                <n-icon><EditIcon /></n-icon>
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
        <div class="question-section" v-if="currentQuestion" :style="{ backgroundImage: `url(${quiz.image})` }">
          <div class="question-container">
            <div class="question-text">{{ currentQuestion.text }}</div>
            
            <div class="answers-grid">
              <div 
                v-for="(answer, index) in currentQuestion.answers" 
                :key="index"
                class="answer-card"
                :class="{ 
                  'selected': quiz.isOwner ? currentQuestion.correctAnswer === index : selectedAnswer === index,
                  'disabled': quiz.isOwner
                }"
                @click="!quiz.isOwner && selectAnswer(index)"
              >
                <div class="answer-label">{{ ['A', 'B', 'C', 'D'][index] }}</div>
                <div class="answer-text">{{ answer.text }}</div>
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
              
              <div class="rating-section" v-if="!quiz.isOwner">
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
              
              <div class="rating-section" v-else>
                <h3>Statystyki</h3>
                <div class="stats-display">
                  <div class="stat-item">
                    <span class="stat-label">Pytania:</span>
                    <span class="stat-value">{{ quiz.questions.length }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Ocena:</span>
                    <div class="stars-display">
                      <n-rate v-model:value="quiz.rating" readonly />
                    </div>
                  </div>
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
            'completed': !quiz.isOwner && completedQuestions.includes(index)
          }"
          @click="navigateToQuestion(index)"
        >
          <div class="question-number">{{ index + 1 }}</div>
          <div class="question-thumbnail" :style="{ backgroundImage: `url(${quiz.image})` }"></div>
        </div>
      </div>
      
    </div>
  </div>
  
  <!-- Loading state -->
  <div v-else class="loading-container">
    <n-spin size="large" />
    <p>Ładowanie quizu...</p>
  </div>
  
  <!-- Error state -->
  <div v-if="error" class="error-container">
    <n-alert title="Błąd" type="error" :description="error" />
    <n-button @click="fetchQuiz">Spróbuj ponownie</n-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { 
  NCard, 
  NButton, 
  NAvatar, 
  NIcon,
  NRate,
  NSpin,
  NAlert
} from 'naive-ui';
import { 
  Heart as HeartOutline, 
  Play as PlayIcon,
  GameController as GameControllerOutline,
  ArrowBack as ArrowBackIcon,
  Pencil as EditIcon
} from '@vicons/ionicons5';
import { HeartFilled } from '@vicons/antd';
import router from '@/router';
import axios from 'axios';
import { quizStore } from '@/stores/quizStore';
const route = useRoute();
import { useGameStore } from '@/stores/gameStore';

// Test variable 
const mine = ref(true);
const gameStore = useGameStore();

// Reactive state
const loading = ref(true);
const error = ref<string | null>(null);
const isLiked = ref(false);
const currentQuestionIndex = ref<number>(0);
const selectedAnswer = ref<number | null>(null);
const completedQuestions = ref<number[]>([]);
const userRating = ref(0);

// Quiz data structure
const quiz = reactive({
  id: 0,
  title: '',
  description: '',
  image: 'https://placehold.co/600x400/0000FF/FFFFFF?text=Quiz',
  authorAvatar: '/api/placeholder/50/50',
  rating: 0,
  isOwner: false,
  ownerId: 0,
  questions: [] as Array<{
    id: number;
    text: string;
    answers: Array<{
      id?: number;
      text: string;
      is_correct?: boolean;
    }>;
    correctAnswer?: number;
  }>
});

const currentQuestion = computed(() => {
  if (!quiz.questions.length) return null;
  return quiz.questions[currentQuestionIndex.value];
});

// Fetch quiz data from backend
const fetchQuiz = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const quizId = route.query.quizId;
    if (!quizId) {
      throw new Error('Brak ID quizu');
    }

    const response = await axios.get(`/quizes/${quizId}`);
    const data = response.data.quiz;
    
    // Update quiz data
    Object.assign(quiz, {
      id: data.quizId,
      title: data.title,
      description: data.description,
      isOwner: data.isOwner,
      ownerId: data.ownerId,
      questions: data.questions.map((question: any) => {
        let correctAnswer = undefined;
        if (data.isOwner && question.answers) {
          correctAnswer = question.answers.findIndex((answer: any) => answer.is_correct);
        }
        
        return {
          id: question.id,
          text: question.content,
          answers: (question.answers || []).map((a: any) => ({
            id: a.id,
            text: a.content,
            is_correct: a.is_correct
          })),
          correctAnswer
        };
      })
    });
    
    console.log(quiz);


  } catch (err: any) {
    console.error('Error fetching quiz:', err);
    error.value = err.response?.data?.message || err.message || 'Wystąpił błąd podczas ładowania quizu';
  } finally {
    loading.value = false;
  }
};

// Methods
const toggleLike = async () => {
  try {
    if (isLiked.value) {
      await axios.delete(`/quizes/${quiz.id}/favourite`);
      isLiked.value = false;
    } else {
      await axios.post(`/quizes/${quiz.id}/favourite`);
      isLiked.value = true;
    }
  } catch (err: any) {
    console.error('Błąd przy toggle like:', err);
    error.value = 'Nie udało się zmienić polubienia quizu.';
  }
};

const startQuiz = async () => {
  // Logic to start the quiz
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  completedQuestions.value.length = 0;

  try {
    if (await gameStore.hostGame(quiz.id)) {
      router.push('/lobby-host')
    }
  } catch (error) {
    console.error('Error starting the quiz:', error);
  }
};

const editQuiz = () => {
  quizStore.currentQuiz = JSON.parse(JSON.stringify(quiz));
  router.push({ name: 'quiz-questions', query: { mode: 'edit', id: quiz.id } });
};

const selectAnswer = (index: number) => {
  selectedAnswer.value = index;
  if (!completedQuestions.value.includes(currentQuestionIndex.value)) {
    completedQuestions.value.push(currentQuestionIndex.value);
  }
};

const navigateToQuestion = (index: number) => {
  if (index >= 0 && index < quiz.questions.length) {
    currentQuestionIndex.value = index;
    if (!quiz.isOwner) {
      selectedAnswer.value = null;
    }
  }
};

const goBack = () => {
  router.back();
};


onMounted(() => {
  fetchQuiz();
});
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

.edit-button {
  background-color: #ff8c00 !important;
  border-radius: 12px !important;
  padding: 5px 22px !important;
  font-size: 16px !important;
  font-weight: bold !important;
  transition: all 0.3s ease !important;
  height: 50px !important;
  color: white !important;
}

.edit-button:hover {
  transform: scale(1.05) !important;
  box-shadow: 0 0 10px rgba(255, 140, 0, 0.5) !important;
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

.answer-card:hover:not(.disabled) {
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

.answer-card.disabled {
  cursor: default;
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
  gap: 18px;
}

.stars-display {
  font-size: 28px;
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

.stats-display {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #333;
  border-radius: 8px;
}

.stat-label {
  font-weight: bold;
  font-size: 16px;
}

.stat-value {
  font-size: 18px;
  color: white;
  font-weight: bold;

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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 60px);
  background-color: #222;
  color: white;
  text-align: center;
  gap: 16px;
}

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