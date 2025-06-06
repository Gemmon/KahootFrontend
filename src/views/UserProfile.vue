<template>
    <div class="main">
        <n-card title="Profil Użytkownika" class="profile-container">
            <div class="content">
                <div class="prof-user-name f-child">
                    <n-avatar></n-avatar>
                    <span> Nazwa użytkownika</span>
                </div>
                <div class="prof-user-stats-main f-child">
                    <n-card title="Statystyki użytkownika" class="prof-user-stats-content">
                            <div class="stats-blocks">
                                    <n-card class="stat" title="Liczba zagranych gier">{{ userStats?.gamesPlayed }}</n-card>
                                    <n-card class="stat" title="Liczba wygranych gier">{{ userStats?.gamesWon }}</n-card>
                                    <n-card class="stat" title="Liczba stworzonych gier">{{ userStats?.gamesMade }}</n-card>
                                    <n-card class="stat" title="Średnia oceń quizów">{{ userStats?.gamesPlayed }}</n-card>
                            </div>
                            <div class="quizes-created">
                                <n-card title="Twoje Quizy" class="quiz-section">
                                        <div class="toolbar-container">
                                            <div id="search">
                                                <n-input placeholder="Search..." v-model:value="SearchFor" size="small"
                                                    :clearable="true" />
                                            </div>
                                            <div id="dropdown-options">
                                                <div class="dropdown" id="sort">
                                                    <span>Sort by:</span>
                                                    <n-select v-model:value="SortBy" :options="SortOptions"
                                                        size='' />
                                                </div>
                                                <div class="dropdown" id="filter">
                                                    <span>Filter by:</span>
                                                    <n-select v-model:value="FilterBy" :options="FilterOptions"
                                                        size="small" />
                                                </div>
                                            </div>
                                        </div>


                                        <div class="quiz-cards-container">
                                            <transition :name="`fade-slide-${transitionDirection}`" mode="out-in">
                                                <div :key="yourQuizzesPage">
                                                    <div class="cards-page"
                                                        :style="{ '--itemsPerRow': itemsPerRow, '--itemsPerColumn': itemsPerColumn }">
                                                        <div class="quiz-card f-child"
                                                            v-for="(quiz, index) in activeChunk"
                                                            :key="'quiz-' + yourQuizzesPage + '-' + index">
                                                            <QuizCard :imageURL="quiz.image" :title="quiz.title" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </transition>
                                        </div>

                                        <!-- Right arrow to scroll quizes -->
                                        <div class="arrows-container">
                                            <n-button quaternary circle class="slider-arrow prev" @click="prevPage()"
                                                :disabled="yourQuizzesPage === 0">
                                                <template #icon>
                                                    <n-icon>
                                                        <ChevronBackIcon />
                                                    </n-icon>
                                                </template>
                                            </n-button>

                                            <!-- Pagination Dots on the bottom  -->
                                            <div class="pagination-dots">
                                                <span v-for="(_, index) in yourQuizChunks" :key="'dot--' + index"
                                                    class="dot" :class="{ 'active': yourQuizzesPage === index }"
                                                    @click="goToPage(index)"></span>
                                            </div>

                                            <n-button quaternary circle class="slider-arrow next" @click="nextPage()"
                                                :disabled="yourQuizzesPage >= yourQuizChunks.length - 1">
                                                <template #icon>
                                                    <n-icon>
                                                        <ChevronForwardIcon />
                                                    </n-icon>
                                                </template>
                                            </n-button>
                                        </div>
                                </n-card>
                            </div>
                    </n-card>
                </div>
            </div>
        </n-card>
    </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NAvatar, NIcon, NButton, NSelect, NInput } from 'naive-ui';
import QuizCard from '@/components/QuizCard.vue'
import {
    ChevronBack as ChevronBackIcon,
    ChevronForward as ChevronForwardIcon
} from '@vicons/ionicons5';

interface Stats {
    gamesPlayed: number
    gamesWon: number
    gamesMade: number
    avgQuizRate: number
}
const userStats = ref<Stats | null>(null)
const suggestedSort = ref('Najnowsze');
const yourQuizzesPage = ref(0);
const yourQuizChunks = computed(() => chunkArray(yourQuizzes, (itemsPerRow.value * itemsPerColumn.value)));
const activeChunk = computed(() => yourQuizChunks.value[yourQuizzesPage.value]);
const itemsPerRow = ref(3);
const itemsPerColumn = ref(1);
const transitionDirection = ref<'left' | 'right'>('left');

const suggestedSortOptions = [
    { label: 'Najnowsze', value: 'created_at' }, // na podstawie created_at z tabeli Quizzes
    { label: 'Alfabetycznie', value: 'title' },  // na podstawie title z tabeli Quizzes
    { label: 'Popularne', value: 'popularity' }  //  można obliczyć na podstawie liczby Game_players/Games dla danego quiz_id
];
const yourQuizzes = [
    { title: 'Geography', image: 'https://placehold.co/300x150/0000FF/FFFFFF?text=Geography' },
    { title: 'Science', image: 'https://placehold.co/300x150/FF0000/FFFFFF?text=Science' },
    { title: 'History', image: 'https://placehold.co/300x150/00FF00/FFFFFF?text=History' },
    { title: 'Literature', image: 'https://placehold.co/300x150/FFFF00/000000?text=Literature' },
    { title: 'Music', image: 'https://placehold.co/300x150/FF00FF/FFFFFF?text=Music' },
    { title: 'Movies', image: 'https://placehold.co/300x150/00FFFF/000000?text=Movies' },
    { title: 'Sports', image: 'https://placehold.co/300x150/FFFFFF/000000?text=Sports' },
    { title: 'JavaScript', image: 'https://placehold.co/300x150/F7DF1E/000000?text=JavaScript' },
    { title: 'Python', image: 'https://placehold.co/300x150/3776AB/FFFFFF?text=Python' },
]

const chunkArray = (array: any[], size: number) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }
    return chunked;
};

// Navigation methods
const nextPage = () => {
    if (yourQuizzesPage.value < yourQuizChunks.value.length - 1) {
        transitionDirection.value = 'left';
        yourQuizzesPage.value++;
    }
};

const prevPage = () => {
    if (yourQuizzesPage.value > 0) {
        transitionDirection.value = 'right';
        yourQuizzesPage.value--;
    }
};

const goToPage = (pageIndex: number) => {
    if (yourQuizzesPage.value > pageIndex)
        transitionDirection.value = 'right';
    else
        transitionDirection.value = 'left';

    yourQuizzesPage.value = pageIndex;
};
</script>



<style scoped>
:deep(*){
    color: white !important;
}
.main {
    background-color: #333;
    color: white;
    height: calc(100vh - 60px);
    width: 100%;
    display: flex;
    justify-content: center;
}

.profile-container {
    background-color: #444;
    max-width: 1200px;
    width: 100%;
    margin: 1rem auto;
    height: fit-content;
}
:deep(.profile-container > .n-card-header){
    --n-padding-left: 1rem;
}

.content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.prof-user-name {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    background-color: #00891D;
    border-radius: 8px;
}

.prof-user-stats-main {
    background-color: transparent;
}
:deep(.prof-user-stats-content > .n-card-header){
    --n-padding-left: 0;
}

.stats-blocks {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 0 ;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    box-sizing: border-box;
}

.stat {
    flex: 1;
    background-color: #322E38;
        border-radius: 10px;
        text-align: center;
}

.f-child {
    flex: 1;
}

.cards-page {
    display: flex;
    gap: 1rem;
}

.arrows-container {
    padding-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin: 0.5rem 0;
}

.pagination-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    bottom: 5px;
    left: 0;
    right: 0;
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

.quiz-card {
    height: 20vh;
}
.toolbar-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap:1rem;
    margin-bottom: 1rem ;
    padding: 0 0.5rem;
}
:deep(.n-select) {
  width: 20ch;
}

:deep(.n-card__content){
    --n-padding-top: 0;
    --n-padding-bottom: 0;
    --n-padding-left: 0;
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

#dropdown-options {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

}
.quiz-cards-container {
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding: 0 0.5rem;
  box-sizing: border-box;
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
.prof-user-stats-content{
    background-color: transparent;
    border: none;
    padding: 0 1rem;
}
.quiz-section{
    background-color: #322E38;
    padding: 0;
    border: none;
    margin: 0.5rem 0;
    border-radius: 10px;
}


</style>