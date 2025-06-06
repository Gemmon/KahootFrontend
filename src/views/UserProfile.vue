<template>
    <div class="main">
        <n-card title="Profil Użytkownika" class="profile-container">
            <div class="content">
                <div class="prof-user-name f-child">
                    <n-avatar></n-avatar>
                    <span> Nazwa użytkownika</span>
                </div>
                <div class="prof-user-stats-main f-child">
                    <n-card title="Statystyki użytkownika">
                        <div class="prof-user-stats-content">
                            <div class="stats-blocks">
                                <div id="games-played" class="stat">
                                    <n-card title="Liczba zagranych gier">{{ userStats?.gamesPlayed }}</n-card>
                                </div>
                                <div id="games-won" class="stat">
                                    <n-card title="Liczba wygranych gier">{{ userStats?.gamesWon }}</n-card>
                                </div>
                                <div id="quizes-created" class="stat">
                                    <n-card title="Liczba stworzonych gier">{{ userStats?.gamesMade }}</n-card>
                                </div>
                                <div id="avg-quizes-rate" class="stat">
                                    <n-card title="Średnia oceń quizów">{{ userStats?.gamesPlayed }}</n-card>
                                </div>
                            </div>
                            <div class="quizes-created">
                                <n-card class="quiz-section" content-style="padding: 0">
                                    <div class="quiz-section-header">
                                        <n-h3>Suggested Quizzes</n-h3>
                                        <div class="sort-dropdown">
                                            <span>Sort by</span>
                                            <n-select v-model:value="suggestedSort" :options="suggestedSortOptions"
                                                size="small" />
                                        </div>
                                    </div>

                                    <div class="quiz-cards-container">
                                        <transition :name="`fade-slide-${transitionDirection}`" mode="out-in">
                                            <div :key="CurrentPage">
                                                <div class="cards-page"
                                                    :style="{ '--itemsPerRow': itemsPerRow, '--itemsPerColumn': itemsPerColumn }">
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
                                        <n-button quaternary circle class="slider-arrow prev" @click="prevPage()"
                                            :disabled="CurrentPage === 0">
                                            <template #icon>
                                                <n-icon>
                                                    <ChevronBackIcon />
                                                </n-icon>
                                            </template>
                                        </n-button>

                                        <!-- Pagination Dots on the bottom  -->
                                        <div class="pagination-dots">
                                            <span v-for="(_, index) in QuizChunks" :key="'dot--' + index" class="dot"
                                                :class="{ 'active': CurrentPage === index }"
                                                @click="goToPage(index)"></span>
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
                        </div>
                    </n-card>
                </div>
            </div>
        </n-card>
    </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NAvatar } from 'naive-ui';
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
const yourQuizzesPage = ref(0);
const suggestedSort = ref('Najnowsze');
const suggestedCurrentPage = ref(0);
const yourQuizChunks = computed(() => chunkArray(yourQuizzes, itemsPerPage));
const itemsPerPage = 4;
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

const goToPage = (pageIndex: number) => {
        suggestedCurrentPage.value = pageIndex;
};

const prevPage = () => {
    if (suggestedCurrentPage.value > 0) {
        suggestedCurrentPage.value--;
    }
};

const nextPage = () => {
    if (suggestedCurrentPage.value < yourQuizChunks.value.length - 1) {
        suggestedCurrentPage.value++;
    }
};
</script>



<style scoped>
.main {
    background-color: #333;
    color: white;
    height: calc(100vh - 60px);
    width: 100%;
    display: flex;
    justify-content: center;
}

.profile-container {
    max-width: 1200px;
    width: 100%;
    margin: 1rem auto;
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
    background-color: #444;
    border-radius: 8px;
}

.prof-user-stats-main {
    background-color: transparent;
}

.stats-blocks {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    width: 100%;
    flex-wrap: wrap;
}

.stat {
    flex: 1;
    min-width: 250px;
}

.f-child {
    flex: 1;
}

/* Quiz Slider */
.quiz-section {
    margin-top: 1rem;
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

.sort-dropdown {
    display: flex;
    align-items: center;
    gap: 10px;
}

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
    gap: 15px;
    padding: 0 40px;
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

/* QuizCard component assumed styles */
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


@media (max-width: 768px) {
    .quiz-cards {
        padding: 0 10px;
        gap: 10px;
    }
}

@media (max-width: 480px) {
    .quiz-cards {
        flex-direction: column;
        padding: 0 5px;
    }
}
</style>