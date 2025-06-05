<template>
  <div class="home">
    
    <main class="main-content">
      <div class="quiz-collections">
        <div class="section-header">
          <n-h2>Quiz Collections</n-h2>
          <p>Find all quizzes you liked or made yourself.</p>
        </div>
        
        <n-card class="quiz-section" content-style="padding: 0">
          <div class="quiz-section-header">
            <n-h3>Liked Quizzes</n-h3>
            <div class="sort-dropdown">
              <span>Sort by</span>
              <n-select 
                v-model:value="likedSort" 
                :options="likedSortOptions" 
                size="small"
              />
            </div>
          </div>

          <!-- Left arrow to scroll quizes -->
          <div class="quiz-slider">
            <n-button 
              quaternary 
              circle 
              class="slider-arrow prev" 
              @click="prevPage('liked')"
              :disabled="likedCurrentPage === 0"
            >
              <template #icon>
                <n-icon><ChevronBackIcon /></n-icon>
              </template>
            </n-button>
            
            <div class="quiz-cards-container">
              <div class="quiz-cards" :style="{ transform: `translateX(-${likedCurrentPage * 100}%)` }">
                <template v-for="(chunk, chunkIndex) in likedQuizChunks" :key="'chunk-liked-'+chunkIndex">
                  <div 
                    class="cards-page" 
                    :class="{ 'active-page': likedCurrentPage === chunkIndex }"
                  >
                    <div class="quiz-card" v-for="(quiz, index) in chunk" :key="'liked-'+chunkIndex+'-'+index" >
                      <div class="quiz-image" :style="{ backgroundImage: `url(${quiz.image})` }">
                        <div class="quiz-actions">
                          <n-button quaternary circle>
                            <template #icon>
                              <n-icon><HeartFilled /></n-icon>
                            </template>
                          </n-button>
                        </div>
                        <div class="quiz-title">{{ quiz.title }}</div>
                        <n-button class="start-btn" block type="primary" @click="goToQuiz(index)">
                          Start 
                          <template #icon>
                            <n-icon><PlayIcon /></n-icon>
                          </template>
                        </n-button>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            
            <!-- Right arrow to scroll quizes -->
            <n-button 
              quaternary 
              circle 
              class="slider-arrow next" 
              @click="nextPage('liked')"
              :disabled="likedCurrentPage >= likedQuizChunks.length - 1"
            >
              <template #icon>
                <n-icon><ChevronForwardIcon /></n-icon>
              </template>
            </n-button>

            <!-- Pagination Dots on the bottom  -->
            <div class="pagination-dots">
              <span 
                v-for="(_, index) in likedQuizChunks" 
                :key="'dot-liked-'+index"
                class="dot"
                :class="{ 'active': likedCurrentPage === index }"
                @click="goToPage('liked', index)"
              ></span>
            </div>
          </div>
        </n-card>
        
        <n-card class="quiz-section" content-style="padding: 0">
          <div class="quiz-section-header">
            <n-h3>Suggested Quizzes</n-h3>
            <div class="sort-dropdown">
              <span>Sort by</span>
              <n-select 
                v-model:value="suggestedSort" 
                :options="suggestedSortOptions" 
                size="small"
              />
            </div>
          </div>
          
          <div class="quiz-slider">
            <n-button 
              quaternary 
              circle 
              class="slider-arrow prev" 
              @click="prevPage('suggested')"
              :disabled="suggestedCurrentPage === 0"
            >
              <template #icon>
                <n-icon><ChevronBackIcon /></n-icon>
              </template>
            </n-button>
            
            <div class="quiz-cards-container">
              <div class="quiz-cards" :style="{ transform: `translateX(-${suggestedCurrentPage * 100}%)` }">
                <template v-for="(chunk, chunkIndex) in suggestedQuizChunks" :key="'chunk-suggested-'+chunkIndex">
                  <div 
                    class="cards-page" 
                    :class="{ 'active-page': suggestedCurrentPage === chunkIndex }"
                  >
                    <div class="quiz-card" v-for="(quiz, index) in chunk" :key="'suggested-'+chunkIndex+'-'+index">
                      <div class="quiz-image" :style="{ backgroundImage: `url(${quiz.image})` }">
                        <div class="quiz-actions">
                          <n-button quaternary circle>
                            <template #icon>
                              <n-icon><HeartOutline /></n-icon>
                            </template>
                          </n-button>
                        </div>
                        <div class="quiz-title">{{ quiz.title }}</div>
                        <n-button class="start-btn" block type="primary">
                          Start 
                          <template #icon>
                            <n-icon><PlayIcon /></n-icon>
                          </template>
                        </n-button>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            
            <n-button 
              quaternary 
              circle 
              class="slider-arrow next" 
              @click="nextPage('suggested')"
              :disabled="suggestedCurrentPage >= suggestedQuizChunks.length - 1"
            >
              <template #icon>
                <n-icon><ChevronForwardIcon /></n-icon>
              </template>
            </n-button>
            
            <div class="pagination-dots">
              <span 
                v-for="(_, index) in suggestedQuizChunks" 
                :key="'dot-suggested-'+index"
                class="dot"
                :class="{ 'active': suggestedCurrentPage === index }"
                @click="goToPage('suggested', index)"
              ></span>
            </div>
          </div>
        </n-card>
        
        <n-card class="quiz-section" content-style="padding: 0">
          <div class="quiz-section-header">
            <n-h3>Your Quizzes</n-h3>
            <div class="sort-dropdown">
              <span>Sort by</span>
              <n-select 
                v-model:value="yourSort" 
                :options="yourSortOptions"
                size="small"
              />
            </div>
          </div>
          
          <div class="quiz-slider">
            <n-button 
              quaternary 
              circle 
              class="slider-arrow prev" 
              @click="prevPage('your')"
              :disabled="yourCurrentPage === 0"
            >
              <template #icon>
                <n-icon><ChevronBackIcon /></n-icon>
              </template>
            </n-button>
            
            <div class="quiz-cards-container">
              <div class="quiz-cards" :style="{ transform: `translateX(-${yourCurrentPage * 100}%)` }">
                <template v-for="(chunk, chunkIndex) in yourQuizChunks" :key="'chunk-your-'+chunkIndex">
                  <div 
                    class="cards-page" 
                    :class="{ 'active-page': yourCurrentPage === chunkIndex }"
                  >
                    <div class="quiz-card" v-for="(quiz, index) in chunk" :key="'your-'+chunkIndex+'-'+index">
                      <div class="quiz-image" :style="{ backgroundImage: `url(${quiz.image})` }">
                        <div class="quiz-actions">
                          <n-button quaternary circle>
                            <template #icon>
                              <n-icon><HeartOutline /></n-icon>
                            </template>
                          </n-button>
                        </div>
                        <div class="quiz-title">{{ quiz.title }}</div>
                        <n-button class="start-btn" block type="primary">
                          Start 
                          <template #icon>
                            <n-icon><PlayIcon /></n-icon>
                          </template>
                        </n-button>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            
            <n-button 
              quaternary 
              circle 
              class="slider-arrow next" 
              @click="nextPage('your')"
              :disabled="yourCurrentPage >= yourQuizChunks.length - 1"
            >
              <template #icon>
                <n-icon><ChevronForwardIcon /></n-icon>
              </template>
            </n-button>
            
            <div class="pagination-dots">
              <span 
                v-for="(_, index) in yourQuizChunks" 
                :key="'dot-your-'+index"
                class="dot"
                :class="{ 'active': yourCurrentPage === index }"
                @click="goToPage('your', index)"
              ></span>
            </div>
          </div>
        </n-card>
      </div>
    </main>
    
    <!-- Modal for Join -->
    <n-modal v-model:show="showJoinModal">
      <n-card
        style="width: 400px"
        :bordered="false"
        size="huge"
        role="dialog"
        title="Enter Code"
      >
        <n-input placeholder="Code" />
        <n-text type="error" style="display: block; text-align: center; margin-top: 10px;">
          Invalid game!
        </n-text>
        <template #footer>
          <n-button type="primary" block @click="showJoinModal = false">
            Join
          </n-button>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { 
  NCard, 
  NButton, 
  NModal, 
  NInput, 
  NSelect, 
  NH2, 
  NH3, 
  NIcon,
  NText
} from 'naive-ui';
import { 
  Heart as HeartOutline, 
  Play as PlayIcon,
  ChevronBack as ChevronBackIcon,
  ChevronForward as ChevronForwardIcon
} from '@vicons/ionicons5';
import { HeartFilled } from '@vicons/antd';
import router from '@/router';
// Reactive state
const showJoinModal = ref(false);
const likedSort = ref('Najnowsze');
const suggestedSort = ref('Najnowsze');
const yourSort = ref('Najnowsze');

// Pagination state
const likedCurrentPage = ref(0);
const suggestedCurrentPage = ref(0);
const yourCurrentPage = ref(0);
const itemsPerPage = 4; // Number of cards visible at once

// Select options
const likedSortOptions = [
  { label: 'Najnowsze', value: 'created_at' },  // na podstawie created_at z tabeli Quizzes
  { label: 'Alfabetycznie', value: 'title' },   // na podstawie title z tabeli Quizzes
  { label: 'Ocena', value: 'rating' }           // średnia z tabeli Ratings gdzie quiz_id = id quizu
];

const suggestedSortOptions = [
  { label: 'Najnowsze', value: 'created_at' }, // na podstawie created_at z tabeli Quizzes
  { label: 'Alfabetycznie', value: 'title' },  // na podstawie title z tabeli Quizzes
  { label: 'Popularne', value: 'popularity' }  //  można obliczyć na podstawie liczby Game_players/Games dla danego quiz_id
];

const yourSortOptions = [
  { label: 'Najnowsze', value: 'created_at' },  // na podstawie created_at z tabeli Quizzes
  { label: 'Alfabetycznie', value: 'title' },   // na podstawie title z tabeli Quizzes
  { label: 'Ocena', value: 'rating' }           // średnia z tabeli Ratings gdzie quiz_id = id quizu
];

const likedQuizzes = ref([]);
const suggestedQuizzes = ref([]);
const yourQuizzes = ref([]);

// Testowy token wygenerowany z pomocą Postmana
const token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImVtYWlsIjoibWljaGFsQGdtYWlsLmNvbSIsImlhdCI6MTc0OTEzMzA1OH0.fACyGl1pVlIdz3HMSU8JBm3ys2sJ0HH2Amt4faW19eA"

const headers = {
  Authorization: `Bearer ${token}`
}

const fetchLikedQuizzes = async () => {
  try {
    const res = await axios.get(
      `/quizes/liked?sort_by=${likedSort.value}`,
      { headers }
    );
    likedQuizzes.value = res.data;
    likedCurrentPage.value = 0;
  } catch (err) {
    console.error("Błąd podczas pobierania polubionych quizów:", err);
  }
};

const fetchSuggestedQuizzes = async () => {
  try {
    const limit = 12;
    const offset = 0;

    const res = await axios.get(
      `/quizes/suggested?sort_by=${suggestedSort.value}&limit=${limit}&offset=${offset}`,
      { headers }
    );
    suggestedQuizzes.value = res.data.data;
    suggestedCurrentPage.value = 0;
  } catch (err) {
    console.error("Błąd podczas pobierania sugerowanych quizów:", err);
  }
};

const fetchYourQuizzes = async () => {
  try {
    const limit = 12;
    const offset = 0;

    const res = await axios.get(
      `/quizes?limit=${limit}&offset=${offset}`,
      { headers }
    );

    yourQuizzes.value = res.data.data;
    yourCurrentPage.value = 0;
  } catch (err) {
    console.error("Błąd podczas pobierania Twoich quizów:", err);
  }
};


// Sprawdzanie czy sortowanie zostało zmienione 
watch(likedSort, () => {
  fetchLikedQuizzes();
});

watch(suggestedSort, () => {
  fetchSuggestedQuizzes();
});

watch(yourSort, () => {
  fetchYourQuizzes();
});


const goToQuiz = (id: number): void => {
  console.log("KLIK KLIK");
  router.push({ name: 'individual', query: { mine: "true"} });
};

// Helper function to chunk an array into smaller arrays
const chunkArray = (array: any[], size: number) => {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

// Computed properties for chunked quiz arrays
const likedQuizChunks = computed(() => chunkArray(likedQuizzes.value, itemsPerPage));
const suggestedQuizChunks = computed(() => chunkArray(suggestedQuizzes.value, itemsPerPage));
const yourQuizChunks = computed(() => chunkArray(yourQuizzes.value, itemsPerPage));

// Navigation methods
const nextPage = (section: any) => {
  if (section === 'liked' && likedCurrentPage.value < likedQuizChunks.value.length - 1) {
    likedCurrentPage.value++;
  } else if (section === 'suggested' && suggestedCurrentPage.value < suggestedQuizChunks.value.length - 1) {
    suggestedCurrentPage.value++;
  } else if (section === 'your' && yourCurrentPage.value < yourQuizChunks.value.length - 1) {
    yourCurrentPage.value++;
  }
};

const prevPage = (section: any) => {
  if (section === 'liked' && likedCurrentPage.value > 0) {
    likedCurrentPage.value--;
  } else if (section === 'suggested' && suggestedCurrentPage.value > 0) {
    suggestedCurrentPage.value--;
  } else if (section === 'your' && yourCurrentPage.value > 0) {
    yourCurrentPage.value--;
  }
};

const goToPage = (section: any, pageIndex: number) => {
  if (section === 'liked') {
    likedCurrentPage.value = pageIndex;
  } else if (section === 'suggested') {
    suggestedCurrentPage.value = pageIndex;
  } else if (section === 'your') {
    yourCurrentPage.value = pageIndex;
  }
};

const toggleJoinModal = () => {
  showJoinModal.value = !showJoinModal.value;
};

// Pobranie wszystkich potrzebnych danych przy wczytaniu strony
onMounted(() => {
  fetchLikedQuizzes();
  fetchSuggestedQuizzes();
  fetchYourQuizzes();
});

</script>

<style scoped>
.home {
  min-height: 100%;
  background-color: #333;
  color: white;
  flex-grow: 1;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.section-header {
  margin-bottom: 20px;
}

.section-header :deep(h2) {
  font-size: 24px;
  margin-bottom: 5px;
}

.section-header p {
  color: #ccc;
  font-size: 14px;
}

.quiz-section {
  margin-bottom: 30px;
  background-color: #444 !important;
  position: relative;
}

.quiz-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #444;
  padding: 10px 15px;
  border-radius: 4px;
}

.quiz-section-header :deep(h3) {
  font-size: 18px;
  margin: 0;
}

.sort-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Quiz Slider */
.quiz-slider {
  position: relative;
  padding: 10px 0 30px;
}

.quiz-cards-container {
  overflow: hidden;
  width: 100%;
}

.quiz-cards {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
}

.cards-page {
  display: flex;
  gap: 15px;
  flex: 0 0 93%;
  padding: 0 40px;
  justify-content: flex-start;
}

.slider-arrow {
  position: absolute !important;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5) !important;
  color: white !important;
  font-size: 24px !important;
  width: 40px !important;
  height: 40px !important;
}

.slider-arrow.prev {
  left: 5px;
}

.slider-arrow.next {
  right: 5px;
}

.slider-arrow:disabled {
  opacity: 0.5;
  cursor: default;
}

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #777;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background-color: #004d1a;
  transform: scale(1.2);
}

.quiz-card {
  min-width: calc(25% - 12px);
  height: 150px;
  background-color: #222;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border: 2px solid #004d1a;
}

.quiz-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.quiz-actions {
  position: absolute;
  top: 10px;
  right: 10px;
}

.quiz-title {
  background: rgba(0, 0, 0, 0.7);
  padding: 8px;
  font-weight: bold;
}

.start-btn {
  border-radius: 0 !important;
  background-color: #004d1a !important;
  display: flex;
  justify-content: space-between !important;
}

.sort-dropdown span {
  white-space: nowrap;
}

:deep(.n-modal) {
  background-color: rgba(0, 0, 0, 0.7);
}

:deep(.n-card) {
  background-color: #333;
  color: white;
}

:deep(.n-card-header) {
  background-color: #444;
}

:deep(.n-input) {
  background-color: #222;
}

:deep(.n-button--primary-type) {
  background-color: #004d1a;
}

:deep(.n-button--primary-type:hover) {
  background-color: #006622;
}

:deep(.n-select) {
  min-width: 150px;
}

:deep(.n-h2), :deep(.n-h3) {
  color: white;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .quiz-card {
    min-width: calc(50% - 8px);
  }
}

@media (max-width: 480px) {
  .quiz-card {
    min-width: 100%;
  }
}
</style>