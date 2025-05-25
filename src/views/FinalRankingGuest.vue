<template>
  <div class="home">
    <div class="ranking-card">
      <h2 class="quiz-title">{{ quizTitle }}</h2>

      <div class="main-section">
        <!-- Podium -->
        <div class="podium">
          <div class="podium-wrapper">
            <div class="place-info">
              <span class="place-label">3 miejsce</span>
              <span class="points">{{ podium[2].score }}</span>
            </div>
            <div class="podium-column place-3">
              <img class="avatar-img" :src="avatarUrl" alt="User Avatar" />
              <div class="username">{{ podium[2].name }}</div>
            </div>
          </div>

          <div class="podium-wrapper">
            <div class="place-info">
              <span class="place-label">1 miejsce</span>
              <span class="points">{{ podium[0].score }}</span>
            </div>
            <div class="podium-column place-1">
              <img class="avatar-img" :src="avatarUrl" alt="User Avatar" />
              <div class="username">{{ podium[0].name }}</div>
            </div>
          </div>

          <div class="podium-wrapper">
            <div class="place-info">
              <span class="place-label">2 miejsce</span>
              <span class="points">{{ podium[1].score }}</span>
            </div>
            <div class="podium-column place-2">
              <img class="avatar-img" :src="avatarUrl" alt="User Avatar" />
              <div class="username">{{ podium[1].name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Local user -->
      <div class="local-user-wrapper">
        <div class="local-user-summary">
          <div class="local-user-avatar">
            <img class="avatar-img" :src="avatarUrl" alt="User Avatar" />
            <span class="local-username">{{ localUser.name }}</span>
          </div>
          <span class="summary-text">
            Uzyskałeś {{ localUser.place }} miejsce, zdobywając {{ localUser.score }} punktów.
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const quizTitle = 'Star Wars'

const avatarUrl = 'https://s3-alpha-sig.figma.com/img/7f45/3b75/be0afd72a8da912ec198876da8f6d800?...'

const podium = ref([
  { name: 'User 1', score: 100000 },
  { name: 'User 2', score: 75000 },
  { name: 'User 3', score: 50000 },
])

const localUser = ref({
  name: 'User 4',
  place: 10,
  score: 10000
})

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
