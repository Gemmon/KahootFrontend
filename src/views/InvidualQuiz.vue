<template>
    <div class="quiz-view">
      <main class="main-content">
        <div class="quiz-container">
          <!-- Quiz Header Section -->
          <div class="quiz-header">
            <div class="quiz-logo">
              <n-avatar round size="large" :style="{ backgroundColor: '#004d1a' }">
                <template #icon>
                  <n-icon><GameControllerOutline /></n-icon>
                </template>
              </n-avatar>
            </div>
            
            <h1 class="quiz-title">{{ quiz.title }}</h1>
            
            <div class="quiz-actions">
              <n-button quaternary circle class="like-button" @click="toggleLike">
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
              
              <n-button quaternary circle class="back-button" @click="goBack">
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
                  <h3>Description</h3>
                  <div class="description-content">
                    <p>{{ quiz.description }}</p>
                  </div>
                </div>
                
                <div class="rating-section">
                  <h3>Rating</h3>
                  <div class="stars-display">
                    <n-rate v-model:value="quiz.rating" readonly />
                  </div>
                  
                  <div class="author-info">
                    <n-avatar size="medium" :src="quiz.authorAvatar" />
                    <span>Made by</span>
                  </div>
                  
                  <div class="rate-quiz">
                    <h4>Rate this Quiz</h4>
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
        <div class="list-header">Question List</div>
        
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
        
        <n-button quaternary class="back-home-btn" @click="goToHome">
          Go back
          <template #icon>
            <n-icon><ArrowBackIcon /></n-icon>
          </template>
        </n-button>
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
  const currentQuestionIndex = ref(0);
  const selectedAnswer = ref(null);
  const userRating = ref(0);
  const completedQuestions = reactive([]);
  
  // Mock data for the quiz
  const quiz = reactive({
    id: 1,
    title: 'Star Wars',
    image: 'https://placehold.co/600x400/0000FF/FFFFFF?text=Star%20Wars',
    authorAvatar: '/api/placeholder/50/50',
    description: 'This is an example description of the quiz. You can read this description and it will tell you about this quiz.',
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
    completedQuestions.length = 0;
  };
  
  const selectAnswer = (index) => {
    selectedAnswer.value = index;
    if (!completedQuestions.includes(currentQuestionIndex.value)) {
      completedQuestions.push(currentQuestionIndex.value);
    }
  };
  
  const navigateToQuestion = (index) => {
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
    min-height: 100vh;
    background-color: #333;
    color: white;
  }
  
  .main-content {
    flex: 1;
    padding: 20px;
    max-width: calc(100% - 220px);
  }
  
  .quiz-container {
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
    font-size: 24px;
    margin: 0;
  }
  
  .quiz-actions {
    display: flex;
    gap: 10px;
  }
  
  .like-button {
    color: white !important;
    font-size: 20px !important;
  }
  
  .start-button {
    background-color: #004d1a !important;
    border-radius: 4px !important;
    padding: 0 20px !important;
  }
  
  .back-button {
    color: white !important;
  }
  
  /* Question Section Styles */
  .question-section {
    background-size: cover;
    background-position: center;
    border-radius: 10px;
    overflow: hidden;
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
    padding: 20px;
  }
  
  .question-text {
    background-color: #004d1a;
    padding: 15px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .answers-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .answer-card {
    background-color: rgba(255, 255, 255, 0.8);
    color: black;
    border-radius: 8px;
    padding: 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .answer-card:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }
  
  .answer-card.selected {
    background-color: #004d1a;
    color: white;
  }
  
  .answer-label {
    font-weight: bold;
    font-size: 20px;
    margin-right: 15px;
    width: 30px;
    height: 30px;
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
    margin-top: 20px;
  }
  
  .info-card {
    background-color: #444 !important;
  }
  
  .info-sections {
    display: flex;
    gap: 20px;
  }
  
  .description-section {
    flex: 1;
    background-color: #333;
    padding: 15px;
    border-radius: 8px;
  }
  
  .rating-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .stars-display {
    font-size: 24px;
  }
  
  .author-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .rate-quiz {
    text-align: center;
    width: 100%;
  }
  
  /* Question List Sidebar Styles */
  .question-list {
    width: 220px;
    background-color: #222;
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
  }
  
  .list-header {
    font-size: 18px;
    font-weight: bold;
    padding: 10px;
    text-align: center;
    margin-bottom: 15px;
  }
  
  .questions-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    overflow-y: auto;
  }
  
  .question-nav-item {
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }
  
  .question-nav-item.active {
    border-color: #004d1a;
  }
  
  .question-nav-item.completed::after {
    content: '✓';
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: #004d1a;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
  
  .question-number {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
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
  
  .back-home-btn {
    margin-top: 20px;
    color: white !important;
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
      min-width: 150px;
    }
    
    .info-sections {
      flex-direction: column;
    }
    
    .answers-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>