
<template>
<div class="quiz-image" :style="{ backgroundImage: `url(${imageURL})` }">
    <div class="quiz-actions">
      <n-button quaternary circle>
        <template #icon>
          <n-icon><HeartFilled /></n-icon>
        </template>
      </n-button>
    </div>
    <div class="quiz-title">{{ title }}</div>
    <n-button class="start-btn" block type="primary">
      Start 
      <template #icon>
        <n-icon><PlayIcon /></n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';
import { HeartFilled } from '@vicons/antd'
import { Play as PlayIcon } from '@vicons/ionicons5'

const props = defineProps<{
    imageURL: string
    title: string
}>()

</script>

<style scoped>

.quiz-actions {
  position: absolute;
  top: 10px;
  right: 10px;
}

.quiz-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

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

</style>