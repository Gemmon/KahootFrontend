<template>
  <div class="form">
    <h1>Ustaw nowe hasło</h1>
    <n-form
      ref="passwordFormRef"
      :model="passwordFormValue"
      :rules="passwordRules"
    >
      <n-form-item label="Nowe hasło" path="newPassword">
        <n-input
          v-model:value="passwordFormValue.newPassword"
          type="password"
          show-password-on="click"
          placeholder=""
          clearable
          @keydown.enter="handlePasswordSubmit"
        />
      </n-form-item>

      <n-form-item label="Powtórz hasło" path="repeatPassword">
        <n-input
          v-model:value="passwordFormValue.repeatPassword"
          type="password"
          show-password-on="click"
          placeholder=""
          clearable
          @keydown.enter="handlePasswordSubmit"
        />
      </n-form-item>
    </n-form>

    <div class="under-buttons">
      <n-button color="black" @click="handlePasswordSubmit">
        Zmień hasło
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NForm, NFormItem, NInput, NButton } from 'naive-ui'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'

const router = useRouter()
const passwordFormRef = ref<FormInst | null>(null)

const passwordFormValue = ref({
  newPassword: '',
  repeatPassword: ''
})

const passwordRules = ref({
  newPassword: [
    { required: true, message: 'Wprowadź nowe hasło.', trigger: 'blur' },
    { min: 6, message: 'Hasło musi mieć co najmniej 6 znaków.', trigger: 'blur' }
  ],
  repeatPassword: [
    { required: true, message: 'Powtórz hasło.', trigger: 'blur' },
    {
      validator: (_ :any, value:any) => {
        if (value !== passwordFormValue.value.newPassword) {
          return new Error('Hasła się różnią.')
        }
        return true
      },
      trigger: 'blur'
    }
  ]
})

const handlePasswordSubmit = (e: MouseEvent | KeyboardEvent) => {
  e.preventDefault()
  passwordFormRef.value?.validate((errors) => {
    if (!errors) {
      alert('Hasło zostało zmienione.')
      router.push('/login')
    }
  })
}
</script>

<style scoped>
h1 {
  margin: 0px;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.7rem;
  color: white;
  font-weight: 500;
}

.form {
  margin: auto auto;
  width: fit-content;
  height: fit-content;
  border-radius: 0.5rem;
  background-color: #004d1a;
  padding: 2rem;
  padding-top: 0;
}

:deep(.n-form) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.under-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

:deep(.n-button) {
  border-radius: 10px;
  font-weight: bold;
}

:deep(.n-form-item-label__text) {
  color: white;
  font-weight: bold;
}
</style>
