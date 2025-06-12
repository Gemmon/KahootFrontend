<template>
    <div class="main">
        <n-card title="Profil Użytkownika" class="profile-container">
            <div class="content">
                <div class="prof-user-name f-child">
                    <div style="display: flex; justify-content: center;align-items: center;width: 80px; height: 80px;">
                        <ImageUploader v-if="isEditingProfile" v-model="avatarImage" />
                        <n-avatar v-else :size="60" round :src="avatarImage || undefined"
                            style="background-color: grey; color: white;">
                            {{ userName.charAt(0).toUpperCase() }}
                        </n-avatar>

                    </div>

                    <div class="username-container">
                        <template v-if="isEditingProfile">
                            <n-input v-model:value="editableName" size="medium" style="max-width: 250px;" />
                        </template>
                        <template v-else>
                            <span>{{ userName }}</span>
                        </template>
                    </div>

                    <n-button size="small" @click="toggleEditProfile">
                        {{ isEditingProfile ? 'Anuluj' : 'Edytuj' }}
                    </n-button>

                    <n-button size="small" type="primary" v-if="isEditingProfile" @click="saveProfileChanges">
                        Zapisz
                    </n-button>
                </div>

                <div class="prof-user-stats-main f-child">
                    <n-card title="Statystyki użytkownika" class="prof-user-stats-content">
                        <div class="stats-blocks">
                            <n-card class="stat" title="Liczba zagranych gier">
                                <n-spin v-if="isStatsLoading" :show="isStatsLoading"></n-spin>
                                <strong v-else>{{ userStats?.gamesPlayed }}</strong>
                            </n-card>
                            <n-card class="stat" title="Liczba wygranych gier">
                                <n-spin v-if="isStatsLoading" :show="isStatsLoading"></n-spin>
                                <strong v-else>{{ userStats?.gamesWon }}</strong>
                            </n-card>
                            <n-card class="stat" title="Liczba stworzonych gier">
                                <n-spin v-if="isStatsLoading" :show="isStatsLoading"></n-spin>
                                <strong v-else>{{ userStats?.gamesMade }}</strong>
                            </n-card>
                            <n-card class="stat" title="Średnia oceń quizów">
                                <n-spin v-if="isStatsLoading" :show="isStatsLoading"></n-spin>
                                <strong v-else>{{ userStats?.avgQuizRate }}</strong>
                            </n-card>
                        </div>
                        <div class="quizes-created">
                            <n-card title="Twoje Quizy" class="quiz-section">
                                <div class="toolbar-container">
                                    <div id="search">
                                        <n-input class="input" placeholder="Search..." v-model:value="SearchFor"
                                            size="small" :clearable="true" />
                                    </div>
                                    <div id="dropdown-options">
                                        <div class="dropdown" id="sort">
                                            <span>Sort by:</span>
                                            <n-select class="input" v-model:value="SortBy" :options="SortOptions"
                                                size='small' />
                                        </div>
                                    </div>
                                </div>


                                <div v-if="isQuizzesLoading" class="quiz-spinner-container">
                                    <n-spin size="large" />
                                </div>
                                <div v-else class="quiz-cards-container">
                                    <div v-if="yourQuizzes.length === 0" class="no-quizzes-message">
                                        Brak quizów
                                    </div>
                                    <transition v-else :name="`fade-slide-${transitionDirection}`" mode="out-in">
                                        <div :key="yourQuizzesPage">
                                            <div class="cards-page"
                                                :style="{ '--itemsPerRow': itemsPerRow, '--itemsPerColumn': itemsPerColumn }">
                                                <div class="quiz-card f-child" v-for="(quiz, index) in activeChunk"
                                                    :key="'quiz-' + yourQuizzesPage + '-' + index">
                                                    <QuizCard :imageURL="quiz.image" :title="quiz.title" @like="toggleLike" :quiz="quiz" @start="goToQuiz" :id="quiz.id" />
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
                                        <span v-for="(_, index) in yourQuizChunks" :key="'dot--' + index" class="dot"
                                            :class="{ 'active': yourQuizzesPage === index }"
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
import axios from 'axios';
import { ref, computed } from 'vue'
import { NCard, NAvatar, NIcon, NButton, NSelect, NInput, NSpin } from 'naive-ui';
import QuizCard from '@/components/QuizCard.vue'
import {
    ChevronBack as ChevronBackIcon,
    ChevronForward as ChevronForwardIcon
} from '@vicons/ionicons5';
import ImageUploader from '@/components/ImageUploader.vue'


const isEditingProfile = ref(false);
const editableName = ref(''); // temporary editable name

const userName = ref('Nazwa użytkownika'); // real displayed name
const avatarImage = ref<string | null>(null); // profile photo

const toggleEditProfile = () => {
    if (!isEditingProfile.value) {
        editableName.value = userName.value;
    }
    isEditingProfile.value = !isEditingProfile.value;
};

const saveProfileChanges = async () => {
    const payload: { name?: string; avatar?: string } = {};

    if (editableName.value.trim() && editableName.value !== userName.value) {
        payload.name = editableName.value.trim();
    }

    if (avatarImage.value) {
        payload.avatar = avatarImage.value;
    }

    if (!payload.name && !payload.avatar) {
        alert("Brak zmian do zapisania.");
        return;
    }

    try {
        const res = await axios.put('/me', payload);

        if (res.data.success) {
            if (payload.name) userName.value = payload.name;
            isEditingProfile.value = false;
            alert("Dane profilu zostały zaktualizowane.");
        } else {
            alert("Aktualizacja nie powiodła się.");
        }
    } catch (err) {
        console.error("Błąd podczas zapisywania zmian profilu:", err);
        alert("Wystąpił błąd podczas aktualizacji profilu.");
    }
};

const router = useRouter()
const goToQuiz = (id: number): void => {
  console.log("Przekazuje id " + id);
  router.push({ name: 'individual', query: { quizId: id} });
};
interface Stats {
    gamesPlayed: number
    gamesWon: number
    gamesMade: number
    avgQuizRate: number
}
const SearchFor = ref<string>('')
const SortBy = ref<string>('Alfabetycznie')
const isStatsLoading = ref(true);
const isQuizzesLoading = ref(true);


const userStats = ref<Stats | null>(null)
const yourQuizzesPage = ref(0);
const yourQuizChunks = computed(() => chunkArray(yourQuizzes.value, (itemsPerRow.value * itemsPerColumn.value)));
const activeChunk = computed(() => yourQuizChunks.value[yourQuizzesPage.value]);
const itemsPerRow = ref(3);
const itemsPerColumn = ref(1);
const transitionDirection = ref<'left' | 'right'>('left');

const SortOptions = [
    { label: 'Najnowsze', value: 'created_at' }, // na podstawie created_at z tabeli Quizzes
    { label: 'Alfabetycznie', value: 'title' },  // na podstawie title z tabeli Quizzes
    { label: 'Popularne', value: 'popularity' }  //  można obliczyć na podstawie liczby Game_players/Games dla danego quiz_id
];

const yourQuizzes = ref([]);

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



const fetchYourQuizzes = async () => {
  try {
    const limit = 12;
    const offset = 0;

    const res = await axios.get(
      `/quizes/own?sort_by=${SortBy.value}&limit=${limit}&offset=${offset}`
    );

    yourQuizzes.value = res.data.data;
    yourQuizzesPage.value = 0;
  } catch (err) {
    console.error("Błąd podczas pobierania Twoich quizów:", err);
  }
};
const toggleLike = async (quiz: any) => {
  try {
    if (quiz.isLiked) {
      await axios.delete(`/quizes/${quiz.id}/favourite`);
      quiz.isLiked = false;
    } else {
      await axios.post(`/quizes/${quiz.id}/favourite`);
      quiz.isLiked = true;
    }

    fetchYourQuizzes();

  } catch (err: any) {
    console.error('Błąd przy toggle like:', err);
    alert("Wystąpił błąd przy próbie polubienia quizu")
  }
};


import { onMounted } from 'vue'
import { useRouter } from 'vue-router';

onMounted(async () => {
    setTimeout(() => {
        userStats.value = {
            gamesPlayed: 20,
            gamesWon: 12,
            gamesMade: 5,
            avgQuizRate: 4.3
        };
        isStatsLoading.value = false;
    }, 1000);
        await fetchYourQuizzes()
        isQuizzesLoading.value = false;


});


</script>



<style scoped>
:deep(.n-card-header__main) {
    color: white !important;
}

:deep(.n-button__content) {
    color: white;
}

strong {
    color: white;
    font-size: 2rem;
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

:deep(.profile-container > .n-card-header) {
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
    background-color: #00891D;
}

.prof-user-stats-main {
    background-color: transparent;
}

:deep(.stats-blocks > .n-card-header) {
    --n-padding-left: 0;
    --n-padding-right: 0;
    --n-padding-bottom: 0;
    --n-padding-top: 0;
}

.stats-blocks {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 0;
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
    word-break: keep-all;
}

.f-child {
    flex: 1;
}

.cards-page {
    display: flex;
    gap: 1rem;
}

:deep(.prof-user-stats-content > .n-card-header) {
    --n-padding-left: 0;
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
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
}

:deep(.n-select) {
    width: 20ch;
}

:deep(.n-card__content) {
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

.prof-user-stats-content {
    background-color: transparent;
    border: none;
    padding: 0 1rem;
}

.quiz-section {
    background-color: #322E38;
    padding: 0;
    border: none;
    margin: 0.5rem 0;
    border-radius: 10px;
}

.username-container {
    display: flex;
    align-items: center;
    margin-left: 1rem;
    font-size: 20px;
    font-weight: bold;
    color: white;
}

.quiz-spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    /* or whatever height makes sense visually */
    width: 100%;
}
</style>