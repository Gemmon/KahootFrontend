<template>
  <div class="image-upload-area"
       :class="{ 'has-image': modelValue }"
       @click="triggerFileInput"
       @dragover.prevent
       @drop.prevent="handleDrop">
    <div v-if="!modelValue" class="upload-placeholder">
      <n-icon size="48" class="upload-icon">
        <ImageIcon />
      </n-icon>
      <p class="upload-text">Kliknij lub przeciągnij obraz</p>
      <p class="upload-hint">PNG, JPG do 5MB</p>
    </div>

    <div v-else class="image-preview">
      <img :src="modelValue" alt="Uploaded Image" />
      <div class="image-overlay">
        <n-button circle class="remove-image-btn" @click.stop="removeImage">
          <template #icon><n-icon><CloseIcon /></n-icon></template>
        </n-button>
      </div>
    </div>

    <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleFileSelect" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NIcon, NButton } from 'naive-ui';
import { Image as ImageIcon, Close as CloseIcon } from '@vicons/ionicons5';


const props = defineProps<{ modelValue: string | null }>();
const emit = defineEmits(['update:modelValue']);

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) handleFile(file);
};

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0];
  if (file) handleFile(file);
};

const handleFile = (file: File) => {
  if (!file.type.startsWith('image/')) return;
  if (file.size > 5 * 1024 * 1024) return;

  const reader = new FileReader();
  reader.onload = (e) => emit('update:modelValue', e.target?.result as string);
  reader.readAsDataURL(file);
};

const removeImage = () => {
  emit('update:modelValue', null);
};
</script>

<style scoped>
.image-upload-area {
  width: 80%;
  height: 80%;
  border: 2px dashed #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  background-color: #444;
}

.image-upload-area.has-image {
  border: 2px solid #004d1a;
}

.upload-placeholder {
  text-align: center;
  color: #aaa;
}

.upload-text, .upload-hint {
  font-size: 14px;
  color: #888;
}

.image-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.remove-image-btn {
  background-color: rgba(255, 0, 0, 0.8) !important;
  color: white !important;
  width: 32px !important;
  height: 32px !important;
}
</style>
