
<template>
<div class="quiz-image" :style="{ backgroundImage: `url(${props.imageURL})` }">
    <div class="quiz-actions">
      <n-button quaternary circle @click="$emit('like', props.quiz)">
        <template #icon>
          <HeartIcon v-if="quiz != null ? quiz.isLiked :false" style="color: #ff4757;" />
          <HeartOutlineIcon v-else style="color: #747d8c;" />
        </template>
      </n-button>
    </div>
    <div class="quiz-title">{{ props.title }}</div>
    <n-button class="start-btn" block type="primary" @click="$emit('start', props.id)"
>
      Start
      <template #icon>
        <n-icon><PlayIcon /></n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';
import { Heart as HeartIcon,
  HeartOutline as HeartOutlineIcon, } from '@vicons/ionicons5';
import { HeartFilled } from '@vicons/antd'
import { Play as PlayIcon } from '@vicons/ionicons5'

defineEmits(['start','like'])

const props = defineProps<{
    quiz: any
    imageURL: string
    title: string
    id: number
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
  background-size:auto;
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