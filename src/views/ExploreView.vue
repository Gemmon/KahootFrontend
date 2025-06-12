<template>
  <div class="main">
    <n-card class="quiz-section" content-style="padding: 0">
      <div class="quiz-section-header">
        <h3>Znajdz quizy.</h3>
        <h4>Wybierz quiz, który zmieni twoje życie!</h4>

        <div class="toolbar-container">
          <!-- <div id="search">
            <n-input placeholder="Search..." v-model:value="SearchFor" size="small" :clearable="true" />
          </div> -->
          <div id="dropdown-options">
            <div class="dropdown" id="sort">
              <span>Sort by:</span>
              <n-select v-model:value="SortBy" :options="SortOptions" size="small" />
            </div>
            <!-- <div class="dropdown" id="filter">
              <span>Filter by:</span>
              <n-select v-model:value="FilterBy" :options="FilterOptions" size="small" />
            </div> -->
          </div>
        </div>
      </div>

      <div class="quiz-cards-container">
        <transition :name="`fade-slide-${transitionDirection}`" mode="out-in">
          <div :key="CurrentPage">
            <div class="cards-page" :style="{ '--itemsPerRow': itemsPerRow, '--itemsPerColumn': itemsPerColumn }">
              <div class="quiz-card" v-for="(quiz, index) in activeChunk"
                :key="'quiz-' + CurrentPage + '-' + index">
                <QuizCard :quiz="quiz" :imageURL="quiz.image" :title="quiz.title" :id="quiz.id" @start="goToQuiz" @like="toggleLike"/>
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
import axios from 'axios';
import { ref, computed,watch,onMounted } from 'vue'
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
import { useRoute, useRouter } from 'vue-router';
const router = useRouter()
const SearchFor = ref("");
const SortBy = ref("Alfabetycznie");
const SortOptions = [
  { label: 'Czas dodania', value: 'created_at' },
  { label: 'Oceny', value: 'likes' },
  { label: 'Alfabetycznie', value: 'title' }
];
// const FilterBy = ref("Category");
// const FilterOptions = [
//   { label: 'Category', value: 'category' },
//   { label: 'Recently Added', value: 'recent' },
//   { label: 'Alphabetical', value: 'alphabetical' }
// ];

// Pagination state
const CurrentPage = ref(0);
const itemsPerRow = ref(3);
const itemsPerColumn = ref(3);

// Quiz data - static for testing
const Quizzes = ref([]);

const goToQuiz = (id: number): void => {
  console.log("Przekazuje id " + id);
  router.push({ name: 'individual', query: { quizId: id} });
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
const QuizChunks = computed(() => chunkArray(Quizzes.value, (itemsPerRow.value * itemsPerColumn.value)));
const activeChunk = computed(() => QuizChunks.value[CurrentPage.value]);


const transitionDirection = ref<'left' | 'right'>('left');
const toggleLike = async (quiz: any) => {
  try {
    if (quiz.isLiked) {
      await axios.delete(`/quizes/${quiz.id}/favourite`);
      quiz.isLiked = false;
    } else {
      await axios.post(`/quizes/${quiz.id}/favourite`);
      quiz.isLiked = true;
    }
  } catch (err: any) {
    console.error('Błąd przy toggle like:', err);
    alert("Wystąpił błąd przy próbie polubienia quizu")
  }
};
// Navigation methods
const nextPage = () => {
  if (CurrentPage.value < QuizChunks.value.length - 1) {
    transitionDirection.value = 'left';
    CurrentPage.value++;
  }
};

const prevPage = () => {
  if (CurrentPage.value > 0) {
    transitionDirection.value = 'right';
    CurrentPage.value--;
  }
};

const goToPage = (pageIndex: number) => {
  if (CurrentPage.value > pageIndex)
    transitionDirection.value = 'right';
  else
    transitionDirection.value = 'left';

  CurrentPage.value = pageIndex;
};


const fetchSuggestedQuizzes = async () => {
  try {
    const limit = 12;
    const offset = 0;

    const res = await axios.get(
      `/quizes/suggested?sort_by=${SortBy.value}&limit=${limit}&offset=${offset}`
    );
    Quizzes.value = res.data.data;
    CurrentPage.value = 0;
  } catch (err) {
    console.error("Błąd podczas pobierania sugerowanych quizów:", err);
  }
};



watch(SortBy, () => {
  fetchSuggestedQuizzes();
});


onMounted(() => {
  fetchSuggestedQuizzes();
});
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
}

.quiz-cards-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
}


.cards-page {

  --grid-min-col-size: 200px;
  --grid-gap: 1rem;

  --grid-col-size-calc: calc((100% - var(--grid-gap) * var(--itemsPerRow)) / var(--itemsPerRow));
  --grid-col-min-size-calc: min(100%, max(var(--grid-min-col-size), var(--grid-col-size-calc)));


  width: 100%;
  display: grid;
  gap: var(--grid-gap);
  grid-template-columns: repeat(auto-fit, minmax(var(--grid-col-min-size-calc),1fr));

}

.quiz-card {
  height: 20vh;
}

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
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 1rem 0;
  gap: 1rem;
}

#dropdown-options {
  display: flex;
  flex-wrap: wrap;
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
  width: 20ch;
}

/* Slide left (next) */
.fade-slide-left-enter-active,
.fade-slide-left-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-left-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.fade-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Slide right (prev) */
.fade-slide-right-enter-active,
.fade-slide-right-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
.fade-slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

</style>
