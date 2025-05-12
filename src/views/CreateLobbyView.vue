<template>
  <div class="home">
    <div class="active-area">
      <div class="form-container">
        <h1>Create Lobby</h1>

        <div class="field">
          <label>Lobby Name</label>
          <input v-model="lobbyName" type="text" placeholder="Example Lobby..." />
        </div>

        <div class="toggle">
          <button :class="{ active: mode === 'single' }" @click="mode = 'single'">Singleplayer</button>
          <button :class="{ active: mode === 'multi' }" @click="mode = 'multi'">Multiplayer</button>
        </div>

        <h3 class="quiz-heading">Chosen Quiz</h3>
        <div class="quiz-card">
          <div class="quiz-image" :style="{ backgroundImage: `url(${chosenQuiz.image})` }">
            <div class="quiz-title">
              {{ chosenQuiz.title }}
              <div class="quiz-footer">
                <div class="info-icon">
                  <n-icon size="40">
                    <InformationCircleOutline />
                  </n-icon>
                </div>
                <div class="quiz-author">
                  <span class="author-label">Made by</span>
                  <img class="avatar-small" :src="avatarUrl" alt="Author Avatar" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="start-button" @click="goToLobby">Start</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { InformationCircleOutline } from '@vicons/ionicons5'

const router = useRouter()

const lobbyName = ref('')
const mode = ref<'single' | 'multi'>('multi')

const chosenQuiz = ref({
  title: 'Star Wars',
  image: 'https://placehold.co/480x264/0000FF/FFFFFF?text=Star+Wars'
})

const avatarUrl = 'https://placehold.co/40x40/avatar'

const goToLobby = () => {
  router.push('/lobby-host')
}
</script>

<style scoped>
.home {
  background-color: #242227;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.active-area {
  background-color: #322E38;
  border-radius: 8px;
  padding: 40px;
  width: 90%;
  max-width: 700px;
  box-sizing: border-box;
}

.form-container {
  background-color: #007418;
  border-radius: 8px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-sizing: border-box;
}

.form-container h1 {
  font-size: 36px;
  color: white;
  font-weight: bold;
  text-align: center;
}

.field {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.field label {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-align: center;
}

.field input {
  padding: 10px;
  font-size: 18px;
  width: 300px;
  border-radius: 8px;
  border: none;
}

.toggle {
  display: flex;
  gap: 10px;
}

.toggle button {
  padding: 10px 20px;
  font-size: 18px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
}

.toggle .active {
  background-color: #1E1E1E;
  color: white;
}

.quiz-heading {
  font-size: 24px;
  color: white;
  text-align: center;
}

.quiz-card {
  background-color: #222;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border: 2px solid #004d1a;
  width: 480px;
  height: 264px;
}

.quiz-image {
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
}

.quiz-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 4px black;
  padding: 10px;
  background: rgba(0, 0, 0, 0.4);
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
  width: 50px;
  height: 50px;
  color: #cccccc;
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

.start-button {
  background-color: #2C2C2C;
  color: white;
  font-size: 24px;
  padding: 15px 40px;
  border: none;
  border-radius: 16px;
}
</style>