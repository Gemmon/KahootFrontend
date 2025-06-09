<template>
  <div class="home">
    <div class="ranking-card">
      <h2 class="quiz-title">{{ quizTitle }}</h2>

      <div class="main-section">
        <!-- Podium -->
        <div class="podium">
          <div class="podium-wrapper" v-if="podium[2]">
            <div class="place-info">
              <span class="place-label">3 miejsce</span>
              <span class="points">{{ podium[2].points }}</span>
            </div>
            <div class="podium-column place-3">
              <img class="avatar-img" :src="getAvatarUrl(podium[2].username)" alt="User Avatar" />
              <div class="username">{{ podium[2].username }}</div>
            </div>
          </div>

          <div class="podium-wrapper" v-if="podium[0]">
            <div class="place-info">
              <span class="place-label">1 miejsce</span>
              <span class="points">{{ podium[0].points }}</span>
            </div>
            <div class="podium-column place-1">
              <img class="avatar-img" :src="getAvatarUrl(podium[0].username)" alt="User Avatar" />
              <div class="username">{{ podium[0].username }}</div>
            </div>
          </div>

          <div class="podium-wrapper" v-if="podium[1]">
            <div class="place-info">
              <span class="place-label">2 miejsce</span>
              <span class="points">{{ podium[1].points }}</span>
            </div>
            <div class="podium-column place-2">
              <img class="avatar-img" :src="getAvatarUrl(podium[1].username)" alt="User Avatar" />
              <div class="username">{{ podium[1].username }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Local user -->
      <div class="local-user-wrapper">
        <div class="local-user-summary">
          <div class="local-user-avatar">
            <img class="avatar-img" :src="getAvatarUrl(localUser.username)" alt="User Avatar" />
            <span class="local-username">{{ localUser.username }}</span>
          </div>
          <span class="summary-text">
            Uzyskałeś {{ localUser.place }} miejsce, zdobywając {{ localUser.points }} punktów.
          </span>
        </div>
      </div>

      <div class="button-row">
        <button class="danger-button" @click="leaveLobby">Wyjdź z lobby</button>
        <button class="success-button" @click="continuePlaying">Graj dalej</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { getAvatarUrl } from '@/utils'

const router = useRouter()
const gameStore = useGameStore()
if (gameStore.socket === null) {
  router.push('/')
}

const quizTitle = gameStore.quiz?.title || "Gahut Quiz" 

const podium = computed(() => gameStore.ranking.slice(0, 3))

const others = computed(() => gameStore.ranking.slice(3));

const localUser = computed(() => {
  const user = gameStore.ranking.find(u => u.uuid === gameStore.uuid);
  return {
    username: user?.username || 'Ty',
    points: user?.points || 0,
    place: user ? gameStore.ranking.indexOf(user) + 1 : 0
  };
});

const leaveLobby = () => {
  router.push('/home')
}
const continuePlaying = () => {
  router.push('/quiz-select')
}
</script>

<style scoped>
/* Powtórka stylów jak z FinalRankingHost.vue, ale bez stylów dla sekcji innych graczy */
.home {
  background-color: #1e1e1e;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.ranking-card {
  background-color: #2a2730;
  border-radius: 12px;
  padding: 30px;
  max-width: 850px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.quiz-title {
  color: white;
  font-size: 26px;
  font-weight: bold;
}
.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
}
.podium-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
}
.place-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 4px;
  font-size: 13px;
  color: white;
  font-weight: bold;
}
.podium-column {
  width: 160px;
  border-radius: 12px;
  padding: 15px 10px;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}
.place-1 { height: 320px; background: linear-gradient(to bottom, #fdbb2d, #f3904f); }
.place-2 { height: 260px; background: linear-gradient(to bottom, #c9d6ff, #e2e2e2); }
.place-3 { height: 220px; background: linear-gradient(to bottom, #b66d0d, #5c2c00); }
.username {
  font-weight: bold;
  font-size: 15px;
  margin-top: 8px;
}
.avatar-img {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid black;
}
.local-user-wrapper {
  display: flex;
  justify-content: flex-start;
}
.local-user-summary {
  background-color: #ccc;
  color: black;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  border-radius: 8px;
  width: 100%;
}
.local-user-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.local-username {
  font-size: 14px;
  font-weight: bold;
}
.summary-text {
  font-size: 15px;
}
.button-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.danger-button {
  background-color: #c0392b;
  color: white;
  padding: 12px 20px;
  border: none;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
}
.success-button {
  background-color: #27ae60;
  color: white;
  padding: 12px 20px;
  border: none;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
