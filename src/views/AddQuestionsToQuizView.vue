<template>
  <div class="quiz-creator">
    <main class="main-content">
      <div class="creator-container">
        <!-- Header Section -->
        <div class="creator-header">
          <h1 class="creator-title">{{ quizData.title || 'Nowy Quiz' }}</h1>
          
          <div class="creator-actions">
            <n-button type="info" class="edit-description-button" @click="showDescriptionModal = true">
              <template #icon>
                <n-icon><EditIcon /></n-icon>
              </template>
              Edytuj Opis
            </n-button>
            
            <n-button 
              :type="isEditMode ? 'warning' : 'success'" 
              class="action-button" 
              @click="isEditMode ? saveChanges() : publishQuiz()"
            >
              <template #icon>
                <n-icon>
                  <component :is="isEditMode ? SaveIcon : PublishIcon" />
                </n-icon>
              </template>
              {{ isEditMode ? 'Zapisz Zmiany' : 'Opublikuj' }}
            </n-button>
            
            <n-button type="error" class="cancel-button" @click="cancelAction">
              {{ isEditMode ? 'Anuluj Edycję' : 'Anuluj Tworzenie' }}
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
      <div class="sidebar-header">Lista Pytań</div>
      
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

    <!-- Description Edit Modal -->
    <n-modal v-model:show="showDescriptionModal">
      <n-card
        style="width: 600px"
        title="Edytuj Opis Quizu"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <div class="description-edit-form">
          <div class="form-field">
            <label>Tytuł Quizu</label>
            <n-input 
              v-model:value="editForm.title"
              placeholder="Wprowadź tytuł quizu"
              size="large"
            />
          </div>
          
          <div class="form-field">
            <label>Opis Quizu</label>
            <n-input
              v-model:value="editForm.description"
              type="textarea"
              placeholder="Wprowadź opis quizu"
              :rows="4"
            />
          </div>
          
          <div class="form-field">
            <label>Zdjęcie Quizu</label>
            <n-upload
              :file-list="[]"
              :show-file-list="false"
              @change="handleQuizImageUpload"
              accept="image/*"
            >
              <n-button type="primary" ghost>
                <template #icon>
                  <n-icon><ImageIcon /></n-icon>
                </template>
                Wybierz zdjęcie
              </n-button>
            </n-upload>
            <div v-if="editForm.image" class="image-preview">
              <img :src="editForm.image" alt="Quiz preview" />
            </div>
          </div>
        </div>
        
        <template #footer>
          <div class="modal-actions">
            <n-button @click="showDescriptionModal = false">Anuluj</n-button>
            <n-button type="primary" @click="saveDescription">Zapisz</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { 
  NCard, 
  NButton, 
  NInput,
  NInputNumber,
  NIcon,
  NUpload,
  NText,
  NModal
} from 'naive-ui';
import { 
  Image as ImageIcon,
  Add as PlusIcon,
  Trash as TrashIcon,
  Create as EditIcon,
  Save as SaveIcon,
  CloudUpload as PublishIcon
} from '@vicons/ionicons5';

// Props to determine if we're in edit mode and what quiz to edit
interface Props {
  editMode?: boolean;
  quizToEdit?: any; // Typ quizu z Twojej aplikacji
}

const props = withDefaults(defineProps<Props>(), {
  editMode: false,
  quizToEdit: null
});

// Reactive state
const isEditMode = ref(props.editMode);
const showDescriptionModal = ref(false);

// Form for editing description/basic info
const editForm = reactive({
  title: '',
  description: '',
  image: ''
});

// Quiz data structure - will be populated based on mode
const quizData = reactive({
  title: '',
  description: '',
  image: '',
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

// Initialize data based on mode
onMounted(() => {
  if (isEditMode.value && props.quizToEdit) {
    // Load existing quiz data
    Object.assign(quizData, props.quizToEdit);
    Object.assign(editForm, {
      title: props.quizToEdit.title,
      description: props.quizToEdit.description,
      image: props.quizToEdit.image
    });
  } else {
    // Initialize with default data for new quiz
    Object.assign(editForm, {
      title: quizData.title || '',
      description: quizData.description || '',
      image: quizData.image || ''
    });
  }
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
  // Handle question image upload
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

const handleQuizImageUpload = (data: any) => {
  // Handle quiz main image upload
  if (data.file && data.file.file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        editForm.image = e.target.result as string;
      }
    };
    reader.readAsDataURL(data.file.file);
  }
};

const saveDescription = () => {
  quizData.title = editForm.title;
  quizData.description = editForm.description;
  quizData.image = editForm.image;
  showDescriptionModal.value = false;
};

const validateQuiz = () => {
  // Check if quiz has title
  if (!quizData.title.trim()) {
    alert('Quiz musi mieć tytuł');
    return false;
  }

  // Check if all questions have text and at least one answer
  for (let i = 0; i < quizData.questions.length; i++) {
    const question = quizData.questions[i];
    if (!question.text.trim()) {
      alert(`Pytanie ${i + 1} nie ma tekstu`);
      return false;
    }
    
    const hasAnswer = question.answers.some(answer => answer.trim() !== '');
    if (!hasAnswer) {
      alert(`Pytanie ${i + 1} nie ma żadnej odpowiedzi`);
      return false;
    }
  }
  
  return true;
};

const publishQuiz = () => {
  if (!validateQuiz()) return;
  
  // Here you would send the data to your backend
  console.log('Publishing quiz:', quizData);
  alert('Quiz został opublikowany!');
};

const saveChanges = () => {
  if (!validateQuiz()) return;
  
  // Here you would update the existing quiz in your backend
  console.log('Saving changes to quiz:', quizData);
  alert('Zmiany zostały zapisane!');
};

const cancelAction = () => {
  const message = isEditMode.value 
    ? 'Czy na pewno chcesz anulować edycję? Wszystkie niezapisane zmiany zostaną utracone.'
    : 'Czy na pewno chcesz anulować tworzenie quizu? Wszystkie zmiany zostaną utracone.';
    
  if (confirm(message)) {
    console.log(isEditMode.value ? 'Cancelling quiz edit' : 'Cancelling quiz creation');
    // Navigate back or reset form
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

.edit-description-button {
  background-color: #3b82f6 !important;
  border-radius: 12px !important;
  padding: 5px 22px !important;
  font-size: 16px !important;
  font-weight: bold !important;
  transition: all 0.3s ease !important;
  height: 50px !important;
}

.edit-description-button:hover {
  transform: scale(1.05) !important;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5) !important;
}

.action-button {
  border-radius: 12px !important;
  padding: 5px 22px !important;
  font-size: 16px !important;
  font-weight: bold !important;
  transition: all 0.3s ease !important;
  height: 50px !important;
}

.action-button:hover {
  transform: scale(1.05) !important;
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
  border: 2px solid #004d1a;
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
  background-color: #004d1a !important;
  border-radius: 10px !important;
}

.question-input :deep(.n-input__input-el) {
  background-color: #004d1a !important;
  color: white !important;
  font-size: 20px !important;
  font-weight: bold !important;
  margin: 10px 5px;
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
  background-color: #004d1a;
  color: white;
  border-color: #003311;
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
  flex-shrink: 0;
}

.answer-card.correct .answer-label {
  background-color: white;
  color: #004d1a;
}

.answer-input {
  flex: 1;
}

.answer-input :deep(.n-input__input-el) {
  background-color: transparent !important;
  border: none !important;
  color: inherit !important;
  font-size: 16px !important;
}

.answer-input :deep(.n-input__input-el)::placeholder {
  color: rgba(0, 0, 0, 0.5) !important;
}

.answer-card.correct .answer-input :deep(.n-input__input-el)::placeholder {
  color: rgba(255, 255, 255, 0.7) !important;
}

.question-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.correct-answer-hint {
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
}

/* Quiz Statistics */
.quiz-stats {
  color: white;
  margin-top: 24px;
}

.stats-card {
  color: white;
  background-color: #444 !important;
  border-radius: 12px !important;
}

.stats-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 24px;
  align-items: start;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-weight: bold;
  font-size: 16px;
  color: white;
}

.stat-description {
  padding: 12px;
  background-color: #333;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
}

.time-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-input span {
  color: white;
  font-weight: bold;
}

/* Questions Sidebar */
.questions-sidebar {
  width: 280px;
  background-color: #222;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  font-size: 20px;
  font-weight: bold;
  padding: 12px;
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #004d1a;
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
  border-color: #004d1a;
  transform: scale(1.03);
  box-shadow: 0 0 0 3px rgba(0, 77, 26, 0.5), 0 4px 10px rgba(0, 0, 0, 0.4);
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
  display: flex;
  align-items: flex-end;
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
  z-index: 1;
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
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
  border: 2px dashed #004d1a;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgba(0, 77, 26, 0.1);
}

.add-question-item:hover {
  background-color: rgba(0, 77, 26, 0.2);
  border-color: #006b24;
}

.add-question-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #004d1a;
  font-weight: bold;
}

/* Modal Styles */
.description-edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field label {
  font-weight: bold;
  color: #333;
}

.image-preview {
  margin-top: 10px;
}

.image-preview img {
  width: 100%;
  max-width: 200px;
  height: auto;
  border-radius: 8px;
  border: 2px solid #ddd;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Responsive */
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
  }
  
  .questions-list {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .question-item {
    min-width: 180px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .creator-title {
    font-size: 24px;
  }
}
</style>