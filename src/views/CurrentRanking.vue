<template>
  <div class="home">
    <div class="ranking-card">
      <h2 class="quiz-title">{{ quizTitle }}</h2>

      <div class="ranking-section">
        <h3 class="section-heading">Obecne wyniki</h3>

        <div class="ranking-list">
          <div
              class="ranking-row"
              v-for="(user, index) in normalizedUsers"
              :key="user.name"
          >
            <div
                class="bar-container"
                :class="{ 'local-user': user.isLocal }"
            >
              <div
                  class="bar-fill"
                  :style="{ background: user.color, width: user.barWidth }"
              ></div>
              <div class="row-content">
                <span class="username">{{ user.name }}</span>
                <span class="icon-score">
                  <span class="direction-icon">{{ user.direction === 'up' ? '⬆️' : '⬇️' }}</span>
                  {{ user.score }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="next-button" @click="goToNext">Następne pytanie</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const quizTitle = 'Star Wars'

const users = ref([
  { name: 'User 1', score: 100000, direction: 'up', color: 'linear-gradient(to right, #fdbb2d, #f3904f)', isLocal: false },
  { name: 'User 3', score: 75000, direction: 'down', color: 'linear-gradient(to right, #c9d6ff, #e2e2e2)', isLocal: false },
  { name: 'User 2', score: 65000, direction: 'neutral', color: 'linear-gradient(to right, #bc4e9c, #f80759)', isLocal: false },
  { name: 'User 10', score: 35000, direction: 'up', color: '#999', isLocal: true },  // 👈 lokalny użytkownik
  { name: 'User 15', score: 25000, direction: 'neutral', color: '#888', isLocal: false },
])

const maxScore = Math.max(...users.value.map(user => user.score))

const normalizedUsers = computed(() =>
    users.value.map(user => ({
      ...user,
      barWidth: `${(user.score / maxScore) * 100}%`
    }))
)

const goToNext = () => {
  router.push('/next-question') // 🔁 zmień, jeśli masz inną trasę
}
</script>

<style scoped>
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
  width: 100%;
  max-width: 1000px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quiz-title {
  font-size: 28px;
  color: white;
  text-align: left;
  margin: 0;
}

.section-heading {
  color: #ccc;
  font-size: 18px;
  margin-bottom: 10px;
}

.ranking-list {
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 5px;
}

.ranking-list::-webkit-scrollbar {
  width: 6px;
}
.ranking-list::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 4px;
}

.ranking-row {
  width: 100%;
}

.bar-container {
  position: relative;
  background-color: #444;
  border-radius: 8px;
  overflow: hidden;
}

.bar-container.local-user {
  border: 2px solid limegreen; /* ✅ ramka dla lokalnego użytkownika */
}

.bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  border-radius: 8px 0 0 8px;
  z-index: 1;
}

.row-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  color: white;
  font-weight: bold;
}

.username {
  font-size: 18px;
}

.icon-score {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.next-button {
  margin-top: 20px;
  align-self: flex-end;
  background-color: #2ecc71;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.next-button:hover {
  background-color: #27ae60;
}
</style>
