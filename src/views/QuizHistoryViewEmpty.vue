<template>
  <div class="main">
        <h1 class="page-title">Historia Quizów</h1>
        <div class="history-wrapper">
          <div class="empty-placeholder">
            Zagraj w quizy,<br />
            żeby się tutaj pojawiły!
          </div>
        </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.main {
  min-height: 100vh;
  background-color: #333;
  color: white;
  padding: 20px;
}

.history-wrapper {
  background-color: #444;
  padding: 20px;
  border-radius: 8px;
}

.empty-placeholder {
  background-color: #004d1a;
  border-radius: 8px;
  padding: 40px 20px;
  color: white;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.5;
}

.page-title {
  color: white;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
}
</style>
