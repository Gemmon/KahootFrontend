<template>
  <div class="main">
    <n-card class="quiz-section" content-style="padding: 0">
      <div class="quiz-section-header">
        <h3>Quiz Explorer</h3>
        <h4>Search, sort and filter for quizzes you want to play</h4>

        <div class="toolbar-container">
          <div id="search">
            <n-input placeholder="Search..." v-model:value="SearchFor" size="small" :clearable="true" />
          </div>
          <div id="dropdown-options">
            <div class="dropdown" id="sort">
              <span>Sort by:</span>
              <n-select v-model:value="SortBy" :options="SortOptions" size="small" />
            </div>
            <div class="dropdown" id="filter">
              <span>Filter by:</span>
              <n-select v-model:value="FilterBy" :options="FilterOptions" size="small" />
            </div>
          </div>
        </div>
      </div>

      <div class="quiz-cards-container">
        <transition name="fade-slide" mode="out-in">
          <div :key="CurrentPage">
            <div class="cards-page" :style="{ '--itemsPerRow': itemsPerRow, '--itemsPerColumn': itemsPerColumn }">
              <div class="quiz-card" v-for="(quiz, index) in activeChunk"
                :key="'quiz-' + CurrentPage + '-' + index">
                <QuizCard :imageURL="quiz.image" :title="quiz.title" />
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Right arrow to scroll quizes -->
      <div class="arrows-container">
        <n-button quaternary circle class="slider-arrow prev" @click="prevPage()" :disabled="CurrentPage === 0">
          <template #icon>
            <n-icon>
              <ChevronBackIcon />
            </n-icon>
          </template>
        </n-button>

        <!-- Pagination Dots on the bottom  -->
        <div class="pagination-dots">
          <span v-for="(_, index) in QuizChunks" :key="'dot--' + index" class="dot"
            :class="{ 'active': CurrentPage === index }" @click="goToPage(index)"></span>
        </div>

        <n-button quaternary circle class="slider-arrow next" @click="nextPage()"
          :disabled="CurrentPage >= QuizChunks.length - 1">
          <template #icon>
            <n-icon>
              <ChevronForwardIcon />
            </n-icon>
          </template>
        </n-button>
      </div>


    </n-card>
  </div>
</template>


<script setup lang="ts">

import { ref, computed } from 'vue'
import {
  NCard,
  NButton,
  NModal,
  NInput,
  NSelect,
  NH2,
  NH3,
  NH4,
  NIcon,
  NText
} from 'naive-ui';
import { ChevronBack as ChevronBackIcon, ChevronForward as ChevronForwardIcon } from '@vicons/ionicons5';

import QuizCard from '@/components/QuizCard.vue';

const SearchFor = ref("");
const SortBy = ref("Alphabetical");
const SortOptions = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Reviews', value: 'reviews' },
  { label: 'Recently Added', value: 'recent' },
  { label: 'Alphabetical', value: 'alphabetical' }
];
const FilterBy = ref("Category");
const FilterOptions = [
  { label: 'Category', value: 'category' },
  { label: 'Recently Added', value: 'recent' },
  { label: 'Alphabetical', value: 'alphabetical' }
];

// Pagination state
const CurrentPage = ref(0);
const itemsPerRow = ref(3);
const itemsPerColumn = ref(3);

// Quiz data - static for testing
const Quizzes = ref([
  { title: 'Star Wars', image: 'https://placehold.co/300x150/0000FF/FFFFFF?text=Star%20Wars' },
  { title: 'Marvel', image: 'https://placehold.co/300x150/FF0000/FFFFFF?text=Marvel' },
  { title: 'DC Comics', image: 'https://placehold.co/300x150/00FF00/FFFFFF?text=DC%20Comics' },
  { title: 'Harry Potter', image: 'https://placehold.co/300x150/FFFF00/000000?text=Harry%20Potter' },
  { title: 'Lord of the Rings', image: 'https://placehold.co/300x150/FF00FF/FFFFFF?text=LOTR' },
  { title: 'Game of Thrones', image: 'https://placehold.co/300x150/00FFFF/000000?text=GoT' },
  { title: 'Breaking Bad', image: 'https://placehold.co/300x150/FFFFFF/000000?text=Breaking%20Bad' },
  { title: 'Stranger Things', image: 'https://placehold.co/300x150/888888/FFFFFF?text=Stranger%20Things' },
  { title: 'The Office', image: 'https://placehold.co/300x150/123456/FFFFFF?text=The%20Office' },

  { title: 'Geography', image: 'https://placehold.co/300x150/0000FF/FFFFFF?text=Geography' },
  { title: 'Science', image: 'https://placehold.co/300x150/FF0000/FFFFFF?text=Science' },
  { title: 'History', image: 'https://placehold.co/300x150/00FF00/FFFFFF?text=History' },
  { title: 'Literature', image: 'https://placehold.co/300x150/FFFF00/000000?text=Literature' },
  { title: 'Music', image: 'https://placehold.co/300x150/FF00FF/FFFFFF?text=Music' },
  { title: 'Movies', image: 'https://placehold.co/300x150/00FFFF/000000?text=Movies' },
  { title: 'Sports', image: 'https://placehold.co/300x150/FFFFFF/000000?text=Sports' },
  { title: 'JavaScript', image: 'https://placehold.co/300x150/F7DF1E/000000?text=JavaScript' },
  { title: 'Python', image: 'https://placehold.co/300x150/3776AB/FFFFFF?text=Python' },
  
  
]);


// Helper function to chunk an array into smaller arrays
const chunkArray = (array, size: number) => {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

// Computed properties for chunked quiz arrays
const QuizChunks = computed(() => chunkArray(Quizzes.value, (itemsPerRow.value * itemsPerColumn.value)));
const activeChunk = computed(() => QuizChunks.value[CurrentPage.value]);

// Navigation methods
const nextPage = () => {
  if (CurrentPage.value < QuizChunks.value.length - 1) {
    CurrentPage.value++;
  }
};

const prevPage = () => {
  if (CurrentPage.value > 0) {
    CurrentPage.value--;
  }
};

const goToPage = (pageIndex: number) => {
  CurrentPage.value = pageIndex;
};


</script>


<style scoped>
.main {
  height: 100%;
  background-color: #333;
  color: white;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.quiz-section {
  color: white;
  background-color: #444 !important;
  margin: auto auto;
  width: 80vw;
  padding: 10px 20px;
  height: 100%;
}

.quiz-cards-container {
  width: 100%;
  height: 100%;
}


.cards-page {
  width: 100%;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(var(--itemsPerColumn), 1fr);
  grid-template-rows: repeat(var(--itemsPerRow), 1fr);
}

.quiz-card {
  height: 20vh;
}

/* .cards-page {
  display: flex;
  gap: 15px;
  flex: 1 1 1;
  padding: 0 40px;
  justify-content: flex-start;
} */

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  bottom: 5px;
  left: 0;
  right: 0;
}


.dot {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: #777;
  cursor: pointer;
  transition: all 0.3s ease;
}



.dot.active {
  background-color: #004d1a;
  transform: scale(1.2);
}

.arrows-container {
  padding-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.toolbar-container {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
}

#dropdown-options {
  display: flex;
  gap: 1rem;

}

#search {
  max-width: 40%;
}

.dropdown {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-wrap: nowrap;
}

.slider-arrow {
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

h3 {
  color: white;
  margin: 0
}

h4 {
  font-weight: normal;
  margin: 0;
}

:deep(.n-select) {
  width: max-content;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
