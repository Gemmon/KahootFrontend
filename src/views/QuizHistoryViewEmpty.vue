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
            <n-button type="error">Wyczyść historię</n-button>
          </div>

          <div class="empty-placeholder">
            Zagraj w quizy,<br />
            żeby się tutaj pojawiły!
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
import { ref } from 'vue'
import {
  NButton, NTabs, NTabPane
} from 'naive-ui'

const activeTab = ref('history')
</script>

<style scoped>
.main {
  min-height: 100vh;
  background-color: #333;
  color: white;
  padding: 20px;
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

.info-text {
  color: white;
  font-size: 14px;
  margin-bottom: 16px;
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
:deep(.n-tabs-segment-type),
:deep(.n-tabs-segment__bar) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.settings-panel {
  background-color: #444;
  padding: 20px;
  border-radius: 8px;
  color: white;
  text-align: center;
}
</style>
