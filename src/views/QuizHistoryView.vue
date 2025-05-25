<template>
  <div class="main">
    <n-tabs v-model:value="activeTab" type="segment" animated class="tabs custom-tabs">
      <n-tab-pane name="history" tab="Historia Quizów">
        <div class="history-wrapper">
          <div class="history-header">
            <p class="info-text">
              Sprawdź 12 ostatnich quizów, w które grałeś! Możesz również usunąć swoją historię,
              jeżeli chcesz zmienić sugerowane quizy.
            </p>
            <n-button type="error" @click="clearHistory">Wyczyść historię</n-button>
          </div>

          <div class="slider-container">
            <div class="quiz-cards" :style="{ transform: `translateX(-${currentPage * 100}%)` }">
              <div class="cards-page" v-for="(chunk, chunkIndex) in quizChunks" :key="chunkIndex">
                <div class="quiz-card" v-for="(quiz, index) in chunk" :key="index">
                  <div class="quiz-image" :style="{ backgroundImage: `url(${quiz.image})` }">
                    <div class="quiz-actions">
                      <n-button quaternary circle>
                        <template #icon>
                          <n-icon><HeartOutline /></n-icon>
                        </template>
                      </n-button>
                    </div>
                    <div class="quiz-title">{{ quiz.title }}</div>
                    <n-button class="start-btn" block type="primary" @click="startQuiz(quiz)">
                      Start
                      <template #icon>
                        <n-icon><PlayIcon /></n-icon>
                      </template>
                    </n-button>
                  </div>
                </div>
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
      </n-tab-pane>

      <n-tab-pane name="settings" tab="Ustawienia">
        <div class="settings-panel">Ustawienia użytkownika (placeholder)</div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  NButton, NIcon, NCard, NTabs, NTabPane
} from 'naive-ui'
import {
  Heart as HeartOutline,
  Play as PlayIcon,
  ChevronBack as ChevronBackIcon,
  ChevronForward as ChevronForwardIcon
} from '@vicons/ionicons5'

const router = useRouter()
const activeTab = ref('history')

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

const currentPage = ref(0)
const itemsPerPage = 6

const chunkArray = (arr: any[], size: number) => {
  const chunked = []
  for (let i = 0; i < arr.length; i += size) {
    chunked.push(arr.slice(i, i + size))
  }
  return chunked
}

const quizChunks = computed(() => chunkArray(quizzes.value, itemsPerPage))

const nextPage = () => {
  if (currentPage.value < quizChunks.value.length - 1) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 0) currentPage.value--
}
const goToPage = (index: number) => {
  currentPage.value = index
}

// Nawigacja
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

.info-text {
  color: white;
  font-size: 14px;
  margin-bottom: 16px;
}

.tabs {
  background-color: transparent;
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

.quiz-cards {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
}

.cards-page {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  flex: 0 0 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.quiz-card {
  width: 300px;
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
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
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

.settings-panel {
  background-color: #444;
  padding: 20px;
  border-radius: 8px;
  color: white;
  text-align: center;
}

/* Zakładki */
:deep(.custom-tabs .n-tabs-tab) {
  background-color: #555;
  color: white;
  border-radius: 6px;
  padding: 6px 16px;
  transition: all 0.3s ease;
}

:deep(.custom-tabs .n-tabs-tab--active) {
  background-color: #00cc66 !important;
  color: white;
}

:deep(.n-tabs-segment),
:deep(.n-tabs-wrapper),
:deep(.n-tabs-nav-scroll-content),
:deep(.n-tabs-segment-type) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.hamburger-btn),
:deep(.menu-toggle),
:deep(.drawer-trigger) {
  display: none !important;
}
</style>
