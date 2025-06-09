<template>
    <div class="home">
      <div class="main-content">
        <div class="header">
          <p>{{ store.username }}</p>
        </div>
        <div class="lobby-container">
          <n-scrollbar style="max-height: 50vh;">
          <div class="lobby-content">
            <!-- Renders each user row dynamically -->
            <div class="user-row">
              <!-- Renders each user card with specific class based on host or special guest -->
              <div class="user-card" :class="{ 'host-card': user.isHost, 'special-guest': user.uuid === store.uuid }" v-for="(user, idx) in store.players" :key="idx">
                <img class="avatar-img" :src="getAvatarUrl(user.username)" :alt="'Avatar of ' + user.username" />
                <p>{{ user.username }}</p>
              </div>
            </div>
          </div>
          </n-scrollbar>
        </div>
        <div class="bottom-section">
          <div class="quiz-side">
            <h3 class="quiz-heading">Wybrany quiz</h3>
            <!-- Displaying the selected quiz card -->
            <div class="quiz-card">
              <div class="quiz-image" :style="{ backgroundImage: `url(${quizImage})` }">
                <div class="quiz-title">{{ quizTitle }}
                  <div class="quiz-footer">
                    <div class="info-icon">
                      <n-icon size="20">
                        <InformationCircleOutline />
                      </n-icon>
                    </div>
                    <div class="quiz-author">
                      <span class="author-label">Autor</span>
                      <img class="avatar-small" :src="`/assets/default-avatar.jpg`" alt="Author Avatar" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="button-side">
            <!-- Leave button functionality -->
            <n-button type="error" size="large" @click="leaveLobby">
              Wyjdź
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { NScrollbar, NButton, NIcon } from 'naive-ui';
import { InformationCircleOutline } from '@vicons/ionicons5'
import { useGameStore } from '@/stores/gameStore'
import { getAvatarUrl } from '@/utils';

const router = useRouter()
const store = useGameStore()
if (store.socket === null) {
  router.push('/')
}
const quizImage = computed(() => `https://placehold.co/300x150/0000FF/FFFFFF?text=${encodeURIComponent(quizTitle.value)}`);
const quizTitle = computed(() => store.quiz?.title || 'Gahut Quiz');

function leaveLobby() {
  store.disconnectSocket()
  router.push('/')
}

watch(() => store.state, (newState) => {
  if (newState === 'playing') {
    router.push('/question');
  }
}, { immediate: true });
</script>

<style scoped>
div {
  text-align: center;
}

.home {
  min-height: 100%;
  background-color: #333;
  color: white;
  flex-grow: 1;
  overflow-x: hidden;
}

.main-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto; 
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-right: 100%;
  width: 100%;
}

.header h2 {
  color: white;
  margin: 0;
  font-size: 32px;
  white-space: nowrap;
  background-color: #4CAF50; 
  border-radius: 8px;
  padding: 15px 20px;
}

.header p {
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  align-self: center;
}

.lobby-container {
  background: linear-gradient(180deg, #47424e, #3a3a3a);
  border-radius: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 60%;
}

.n-scrollbar {
  overflow: hidden;
}

.user-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  margin-top: 15px;
}

.user-card {
  background-color: #6C6577;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  width: 130px;
  flex: 0 0 14%;
}

/* Host: golden gradient */
.user-card.host-card {
  background: linear-gradient(150.27deg, #FFA702 6.66%, #EAD693 49.28%, #624B00 91.9%);

}

/* Avatar with black border by default */
.avatar-img {
  width: 80%;
  height: auto;
  color: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 8px solid rgb(0, 0, 0);
  padding: 0px;
  font-size: 32px;
}

/* Special guest: blue border */
.user-card.special-guest .avatar-img {
  border-color: #129BD5;
}

.user-card p {
  color: white;
  font-size: 24px;
  margin: 0;
  font-weight: bold;
}

.bottom-section {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  flex-wrap: nowrap;
}

.quiz-side {
  flex: 1;
  min-width: 280px;
  max-width: 450px;
}

.quiz-heading {
  font-size: 28px;
  color: white;
  margin-bottom: 10px;
  text-align: left;
}

.quiz-card {
  background-color: #222;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border: 2px solid #004d1a;
}

.quiz-image {
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 180px;
  position: relative;
}

.quiz-title {
  padding-right: 0%;
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 4px black;
}

.quiz-footer {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  pointer-events: none;
}

.info-icon {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 6px;
  border-radius: 6px;
  pointer-events: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.quiz-author {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  pointer-events: auto;
}

.author-label {
  color: white;
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: -4px;
}

.avatar-small {
  width: 28px;
  height: 28px;
  border-radius: 10%;
  border: 2px solid black;
}

.button-side {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 0;
  margin-top: auto;
}

.button-side .n-button {
  margin-top: 10px;
  height: 60px;
  font-size: 30px;
  padding: 0 50px;
}
</style>


