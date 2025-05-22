<template>
  <div class="create-quiz-view">
    <main class="main-content">
      <div class="create-quiz-container">
        <!-- Header Section -->
        <div class="quiz-header">
          <h1 class="page-title">Stwórz Quiz</h1>
          <div class="step-indicator">
            <span class="step-text">Krok 1 - Podstawowe Informacje</span>
          </div>
          
          <div class="header-actions">
            <n-button type="default" circle class="back-button" @click="goBack">
              <template #icon>
                <n-icon><ArrowBackIcon /></n-icon>
              </template>
            </n-button>
          </div>
        </div>
        
        <!-- Form Section -->
        <div class="form-section">
          <!-- Messages -->
          <div v-if="errorMessage" class="message error-message">
            <n-icon class="message-icon"><CloseIcon /></n-icon>
            {{ errorMessage }}
          </div>
          
          <div v-if="successMessage" class="message success-message">
            <n-icon class="message-icon"><CheckmarkIcon /></n-icon>
            {{ successMessage }}
          </div>
          
          <n-card class="form-card">
            <div class="form-content">
              <!-- Left Column - Form Fields -->
              <div class="form-fields">
                <div class="field-group">
                  <label class="field-label">Nazwa</label>
                  <n-input 
                    v-model:value="quizData.title" 
                    placeholder="Przykładowy Quiz..."
                    class="quiz-input"
                    size="large"
                    :maxlength="100"
                    show-count
                  />
                </div>
                
                <div class="field-group">
                  <label class="field-label">Opis</label>
                  <n-input 
                    v-model:value="quizData.description"
                    type="textarea" 
                    placeholder="Opis quizu..."
                    class="quiz-textarea"
                    :rows="8"
                    :maxlength="500"
                    show-count
                  />
                </div>
              </div>
              
              <!-- Right Column - Image Upload -->
              <div class="image-section">
                <label class="field-label">Miniatura Quizu</label>
                <div class="image-upload-container">
                  <div 
                    class="image-upload-area" 
                    :class="{ 'has-image': quizData.image }"
                    @click="triggerFileInput"
                    @dragover.prevent
                    @drop.prevent="handleDrop"
                  >
                    <div v-if="!quizData.image" class="upload-placeholder">
                      <n-icon size="48" class="upload-icon">
                        <ImageIcon />
                      </n-icon>
                      <p class="upload-text">Kliknij lub przeciągnij obraz</p>
                      <p class="upload-hint">PNG, JPG do 5MB</p>
                    </div>
                    
                    <div v-else class="image-preview">
                      <img :src="quizData.image" alt="Quiz thumbnail" />
                      <div class="image-overlay">
                        <n-button 
                          circle 
                          class="remove-image-btn"
                          @click.stop="removeImage"
                        >
                          <template #icon>
                            <n-icon><CloseIcon /></n-icon>
                          </template>
                        </n-button>
                      </div>
                    </div>
                  </div>
                  
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="handleFileSelect"
                  />
                </div>
              </div>
            </div>
          </n-card>
        </div>
        
        <!-- Action Section -->
        <div class="action-section">
          <n-button 
            type="primary" 
            size="large"
            class="next-button"
            :disabled="!isFormValid"
            @click="proceedToNext"
          >
            Dalej
            <template #icon>
              <n-icon><ArrowForwardIcon /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { 
  NCard, 
  NButton, 
  NInput,
  NIcon
} from 'naive-ui';
import { 
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Image as ImageIcon,
  Close as CloseIcon,
  Checkmark as CheckmarkIcon
} from '@vicons/ionicons5';
import { useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quizStore';

const router = useRouter();
const quizStore = useQuizStore();

// Types
interface QuizData {
  title: string;
  description: string;
  image: string | null;
}

// Reactive state
const quizData = reactive<QuizData>({
  title: '',
  description: '',
  image: null
});

const fileInput = ref<HTMLInputElement | null>(null);
const errorMessage = ref<string>('');
const successMessage = ref<string>('');

// Computed properties
const isFormValid = computed(() => {
  return quizData.title.trim().length > 0 && 
         quizData.description.trim().length > 0;
});

// Methods
const goBack = () => {
  // Logic to go back to previous page
  console.log('Going back...');
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    handleFile(file);
  }
};

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0];
  
  if (file) {
    handleFile(file);
  }
};

const handleFile = (file: File) => {
  // Clear previous messages
  errorMessage.value = '';
  successMessage.value = '';
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Proszę wybrać plik obrazu';
    return;
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'Plik jest za duży. Maksymalny rozmiar to 5MB';
    return;
  }
  
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    quizData.image = e.target?.result as string;
    successMessage.value = 'Obraz został załadowany';
    setTimeout(() => successMessage.value = '', 3000);
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  quizData.image = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const proceedToNext = () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Proszę wypełnić wszystkie wymagane pola';
    return;
  }
  
  errorMessage.value = '';
  //successMessage.value = 'Przechodzimy do następnego kroku!';
  
  quizStore.setBasicData({
    title: quizData.title.trim(),
    description: quizData.description.trim(),
    image: quizData.image,
  });

  router.push('/create-quiz/questions');
  
  // Clear success message after delay
  //setTimeout(() => successMessage.value = '', 3000);
};
</script>

<style scoped>
.create-quiz-view {
  background-color: #333;
  color: white;
  height: calc(100vh - 60px);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.create-quiz-container {
  color: white;
}

/* Header Styles */
.quiz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding: 10px 0;
}

.page-title {
  font-size: 42px;
  margin: 0;
  font-weight: bold;
  color: white;
}

.step-indicator {
  flex: 1;
  text-align: center;
}

.step-text {
  background-color: #004d1a;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 12px;
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

.back-button:hover {
  background-color: rgba(85, 85, 85, 0.3) !important;
  transform: scale(1.05);
}

/* Form Section Styles */
.form-section {
  margin-bottom: 30px;
}

/* Message Styles */
.message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-weight: 500;
}

.error-message {
  background-color: rgba(255, 77, 77, 0.2);
  border: 1px solid rgba(255, 77, 77, 0.3);
  color: #ff6b6b;
}

.success-message {
  background-color: rgba(0, 77, 26, 0.2);
  border: 1px solid rgba(0, 77, 26, 0.3);
  color: #4caf50;
}

.message-icon {
  font-size: 18px;
}

.form-card {
  background-color: #444 !important;
  border-radius: 12px !important;
  border: 2px solid #004d1a !important;
}

.form-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  padding: 10px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.quiz-input {
  background-color: #555 !important;
  border-radius: 8px !important;
}

.quiz-input :deep(.n-input__input-el) {
  color: white !important;
  background-color: transparent !important;
}

.quiz-input :deep(.n-input__placeholder) {
  color: #aaa !important;
}

.quiz-textarea {
  background-color: #555 !important;
  border-radius: 8px !important;
}

.quiz-textarea :deep(.n-input__input-el) {
  color: white !important;
  background-color: transparent !important;
  resize: vertical;
}

.quiz-textarea :deep(.n-input__placeholder) {
  color: #aaa !important;
}

/* Image Section Styles */
.image-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-upload-container {
  flex: 1;
}

.image-upload-area {
  width: 100%;
  height: 290px;
  border: 2px dashed #666;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.image-upload-area:hover {
  border-color: #004d1a;
  background-color: rgba(0, 77, 26, 0.1);
}

.image-upload-area.has-image {
  border: 2px solid #004d1a;
  padding: 0;
}

.upload-placeholder {
  text-align: center;
  color: #aaa;
}

.upload-icon {
  color: #666;
  margin-bottom: 12px;
}

.upload-text {
  font-size: 16px;
  margin: 8px 0 4px 0;
  color: #ccc;
}

.upload-hint {
  font-size: 14px;
  color: #888;
  margin: 0;
}

.image-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.image-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.remove-image-btn {
  background-color: rgba(255, 0, 0, 0.8) !important;
  color: white !important;
  border: none !important;
  width: 32px !important;
  height: 32px !important;
}

.remove-image-btn:hover {
  background-color: rgba(255, 0, 0, 1) !important;
}

/* Action Section Styles */
.action-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.next-button {
  background-color: #004d1a !important;
  border-radius: 12px !important;
  padding: 12px 32px !important;
  font-size: 18px !important;
  font-weight: bold !important;
  height: 56px !important;
  transition: all 0.3s ease !important;
}

.next-button:hover:not(:disabled) {
  transform: scale(1.05) !important;
  box-shadow: 0 0 15px rgba(0, 77, 26, 0.6) !important;
}

.next-button:disabled {
  background-color: #666 !important;
  cursor: not-allowed !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .quiz-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .header-actions {
    order: -1;
    align-self: flex-start;
  }
}
</style>