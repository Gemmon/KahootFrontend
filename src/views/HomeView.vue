<template>
  <div class="home">
    <Header />
    
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
                    <div class="quiz-card" v-for="(quiz, index) in chunk" :key="'liked-'+chunkIndex+'-'+index">
                      <div class="quiz-image" :style="{ backgroundImage: `url(${quiz.image})` }">
                        <div class="quiz-actions">
                          <n-button quaternary circle>
                            <template #icon>
                              <n-icon><HeartFilled /></n-icon>
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
              @click="nextPage('liked')"
              :disabled="likedCurrentPage >= likedQuizChunks.length - 1"
            >
              <template #icon>
                <n-icon><ChevronForwardIcon /></n-icon>
              </template>
            </n-button>
            
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

<script setup>
import { ref, computed } from 'vue';
import Header from '@/components/Header.vue';
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

// Reactive state
const showJoinModal = ref(false);
const likedSort = ref('popularity');
const suggestedSort = ref('timeCreated');
const yourSort = ref('reviews');

// Pagination state
const likedCurrentPage = ref(0);
const suggestedCurrentPage = ref(0);
const yourCurrentPage = ref(0);
const itemsPerPage = 4; // Number of cards visible at once

// Select options
const likedSortOptions = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Recently Added', value: 'recent' },
  { label: 'Alphabetical', value: 'alphabetical' }
];

const suggestedSortOptions = [
  { label: 'Time Created', value: 'timeCreated' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Relevance', value: 'relevance' }
];

const yourSortOptions = [
  { label: 'Reviews', value: 'reviews' },
  { label: 'Recently Added', value: 'recent' },
  { label: 'Popularity', value: 'popularity' }
];

// Quiz data - added more items to demonstrate pagination
const likedQuizzes = ref([
  { title: 'Star Wars', image: 'https://via.placeholder.com/300x150/0000FF/FFFFFF?text=Star+Wars' },
  { title: 'Marvel', image: 'https://via.placeholder.com/300x150/FF0000/FFFFFF?text=Marvel' },
  { title: 'DC Comics', image: 'https://via.placeholder.com/300x150/00FF00/FFFFFF?text=DC+Comics' },
  { title: 'Harry Potter', image: 'https://via.placeholder.com/300x150/FFFF00/000000?text=Harry+Potter' },
  { title: 'Lord of the Rings', image: 'https://via.placeholder.com/300x150/FF00FF/FFFFFF?text=LOTR' },
  { title: 'Game of Thrones', image: 'https://via.placeholder.com/300x150/00FFFF/000000?text=GoT' },
  { title: 'Breaking Bad', image: 'https://via.placeholder.com/300x150/FFFFFF/000000?text=Breaking+Bad' },
  { title: 'Stranger Things', image: 'https://via.placeholder.com/300x150/888888/FFFFFF?text=Stranger+Things' },
  { title: 'The Office', image: 'https://via.placeholder.com/300x150/123456/FFFFFF?text=The+Office' }
]);

const suggestedQuizzes = ref([
  { title: 'Geography', image: 'https://via.placeholder.com/300x150/0000FF/FFFFFF?text=Geography' },
  { title: 'Science', image: 'https://via.placeholder.com/300x150/FF0000/FFFFFF?text=Science' },
  { title: 'History', image: 'https://via.placeholder.com/300x150/00FF00/FFFFFF?text=History' },
  { title: 'Literature', image: 'https://via.placeholder.com/300x150/FFFF00/000000?text=Literature' },
  { title: 'Music', image: 'https://via.placeholder.com/300x150/FF00FF/FFFFFF?text=Music' },
  { title: 'Movies', image: 'https://via.placeholder.com/300x150/00FFFF/000000?text=Movies' },
  { title: 'Sports', image: 'https://via.placeholder.com/300x150/FFFFFF/000000?text=Sports' }
]);

const yourQuizzes = ref([
  { title: 'JavaScript', image: 'https://via.placeholder.com/300x150/F7DF1E/000000?text=JavaScript' },
  { title: 'Python', image: 'https://via.placeholder.com/300x150/3776AB/FFFFFF?text=Python' },
  { title: 'Vue.js', image: 'https://via.placeholder.com/300x150/4FC08D/FFFFFF?text=Vue.js' },
  { title: 'React', image: 'https://via.placeholder.com/300x150/61DAFB/000000?text=React' },
  { title: 'Angular', image: 'https://via.placeholder.com/300x150/DD0031/FFFFFF?text=Angular' },
  { title: 'Node.js', image: 'https://via.placeholder.com/300x150/339933/FFFFFF?text=Node.js' }
]);

// Helper function to chunk an array into smaller arrays
const chunkArray = (array, size) => {
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
const nextPage = (section) => {
  if (section === 'liked' && likedCurrentPage.value < likedQuizChunks.value.length - 1) {
    likedCurrentPage.value++;
  } else if (section === 'suggested' && suggestedCurrentPage.value < suggestedQuizChunks.value.length - 1) {
    suggestedCurrentPage.value++;
  } else if (section === 'your' && yourCurrentPage.value < yourQuizChunks.value.length - 1) {
    yourCurrentPage.value++;
  }
};

const prevPage = (section) => {
  if (section === 'liked' && likedCurrentPage.value > 0) {
    likedCurrentPage.value--;
  } else if (section === 'suggested' && suggestedCurrentPage.value > 0) {
    suggestedCurrentPage.value--;
  } else if (section === 'your' && yourCurrentPage.value > 0) {
    yourCurrentPage.value--;
  }
};

const goToPage = (section, pageIndex) => {
  if (section === 'liked') {
    likedCurrentPage.value = pageIndex;
  } else if (section === 'suggested') {
    suggestedCurrentPage.value = pageIndex;
  } else if (section === 'your') {
    yourCurrentPage.value = pageIndex;
  }
};

// Modal methods
const toggleJoinModal = () => {
  showJoinModal.value = !showJoinModal.value;
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #333;
  color: white;
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
  flex: 0 0 100%;
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