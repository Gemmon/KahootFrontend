<template>
  <div class="main">
    <h1 class="page-title">Historia Quizów</h1>

    <div class="history-wrapper">
      <div class="history-header">
        <p class="info-text">
          Sprawdź 12 ostatnich quizów, w które grałeś! Możesz również usunąć swoją historię,
          jeżeli chcesz zmienić sugerowane quizy.
        </p>
        <n-button type="error" @click="clearHistory">Wyczyść historię</n-button>
      </div>

      <div class="slider-container">
        <!-- Pojedyncza strona quizów -->
        <div class="cards-page" :style="{ '--itemsPerRow': itemsPerRow, '--itemsPerColumn': itemsPerColumn }">
          <div class="quiz-card" v-for="(quiz, index) in activeChunk" :key="index">
            <QuizCard :quiz="quiz" :id="quiz.id" :imageURL="quiz.image" :title="quiz.title" @start="startQuiz(quiz)" />
          </div>
        </div>
      </div>

      <div class="slider-controls">
        <n-button
            quaternary
            circle
            class="slider-arrow prev"
            @click="prevPage"
            :disabled="currentPage === 0"
        >
          <template #icon>
            <n-icon><ChevronBackIcon /></n-icon>
          </template>
        </n-button>

        <div class="pagination-dots">
          <span
              v-for="(_, index) in quizChunks"
              :key="index"
              class="dot"
              :class="{ active: currentPage === index }"
              @click="goToPage(index)"
          ></span>
        </div>

        <n-button
            quaternary
            circle
            class="slider-arrow next"
            @click="nextPage"
            :disabled="currentPage >= quizChunks.length - 1"
        >
          <template #icon>
            <n-icon><ChevronForwardIcon /></n-icon>
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  NButton, NIcon
} from 'naive-ui'
import {
  ChevronBack as ChevronBackIcon,
  ChevronForward as ChevronForwardIcon
} from '@vicons/ionicons5'

import QuizCard from '@/components/QuizCard.vue'

const router = useRouter()

const quizzes = ref([
  { title: 'Star Wars', image: 'https://placehold.co/300x150/0000FF/FFFFFF?text=Star%20Wars' },
  { title: 'Marvel', image: 'https://placehold.co/300x150/FF0000/FFFFFF?text=Marvel' },
  { title: 'DC Comics', image: 'https://placehold.co/300x150/00FF00/FFFFFF?text=DC%20Comics' },
  { title: 'Harry Potter', image: 'https://placehold.co/300x150/FFFF00/000000?text=Harry%20Potter' },
  { title: 'LOTR', image: 'https://placehold.co/300x150/FF00FF/FFFFFF?text=LOTR' },
  { title: 'GoT', image: 'https://placehold.co/300x150/00FFFF/000000?text=GoT' },
  { title: 'Breaking Bad', image: 'https://placehold.co/300x150/FFFFFF/000000?text=Breaking%20Bad' },
  { title: 'Stranger Things', image: 'https://placehold.co/300x150/888888/FFFFFF?text=Stranger%20Things' },
  { title: 'The Office', image: 'https://placehold.co/300x150/123456/FFFFFF?text=The%20Office' },
  { title: 'Geography', image: 'https://placehold.co/300x150/0000FF/FFFFFF?text=Geography' },
  { title: 'Science', image: 'https://placehold.co/300x150/FF0000/FFFFFF?text=Science' },
  { title: 'Music', image: 'https://placehold.co/300x150/00FFCC/000000?text=Music' }
])

const itemsPerRow = ref(3)
const itemsPerColumn = ref(2)   //3 x 2 = 6 quizów na stronę
const currentPage = ref(0)

const chunkArray = (arr: any[], size: number) => {
  const chunked = []
  for (let i = 0; i < arr.length; i += size) {
    chunked.push(arr.slice(i, i + size))
  }
  return chunked
}

const itemsPerPage = computed(() => itemsPerRow.value * itemsPerColumn.value)
const quizChunks = computed(() => chunkArray(quizzes.value, itemsPerPage.value))
const activeChunk = computed(() => quizChunks.value[currentPage.value] || [])

const nextPage = () => {
  if (currentPage.value < quizChunks.value.length - 1) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 0) currentPage.value--
}
const goToPage = (index: number) => {
  currentPage.value = index
}

const clearHistory = () => {
  router.push('/history-empty')
}
const startQuiz = (quiz: { title: string; image: string }) => {
  router.push({
    path: '/create-lobby',
    query: {
      title: quiz.title,
      image: quiz.image
    }
  })
}
</script>

<style scoped>
.main {
  min-height: 100vh;
  background-color: #333;
  color: white;
  padding: 20px;
}

.page-title {
  color: white;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
}

.history-wrapper {
  background-color: #444;
  padding: 20px;
  border-radius: 8px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.info-text {
  color: white;
  font-size: 14px;
  margin-bottom: 16px;
}

.cards-page {
  --grid-min-col-size: 200px;
  --grid-gap: 1rem;
  --grid-col-size-calc: calc((100% - var(--grid-gap) * var(--itemsPerRow)) / var(--itemsPerRow));
  --grid-col-min-size-calc: min(100%, max(var(--grid-min-col-size), var(--grid-col-size-calc)));

  display: grid;
  gap: var(--grid-gap);
  grid-template-columns: repeat(auto-fit, minmax(var(--grid-col-min-size-calc), 1fr));
  width: 100%;
}

.quiz-card {
  height: 20vh;
  width: 50vh;
}

.slider-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.slider-arrow {
  background-color: rgba(0, 0, 0, 0.5) !important;
  color: white !important;
  font-size: 24px !important;
  width: 40px !important;
  height: 40px !important;
}

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #777;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background-color: #00cc66;
  transform: scale(1.2);
}
</style>
