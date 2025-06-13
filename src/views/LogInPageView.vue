<template>
    <div class="form">
      <h1>Log in</h1>
      <n-form
          ref="formRef"
          :model="formValue"
      >
        <n-form-item label="Email" path="email">
          <n-input 
          v-model:value="formValue.email"
          placeholder="Wpisz email" 
          clearable 
          />
        </n-form-item>
        <n-form-item label="Password" path="password">
          <n-input 
          v-model:value="formValue.password" 
          placeholder="Wpisz hasło" 
          type="password"
          clearable
          />
        </n-form-item>
      </n-form>
      <div class="under-buttons">
        <div class="forgot-password">
          <n-button text @click="handleForgotPasswordClick">
            Zapomniałeś hasła?
          </n-button>
        </div>
        <n-button color="black" @click="handleEnterClick">
          Zaloguj
        </n-button>
        <span class="or-text">or</span>
        <n-button color="black" @click="handleSignUpClick">
          Zarejestruj
        </n-button>
      </div>
      
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NForm,NFormItem,NInput,NButton } from 'naive-ui';
import { useRouter } from 'vue-router';
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const formValue = ref(
  { 
    email: '',
    password: '' 
  })
  const router = useRouter()
  const authStore = useAuthStore()
  const handleForgotPasswordClick = () =>{
    router.push('/forgot-password')
  }

  const handleEnterClick = async () => {
    try {
      const response = await axios.post('/login', {
        email: formValue.value.email,
        password: formValue.value.password
      })

      const token = response.data.token
      authStore.setToken(token)

      router.push('/')
    } catch (error: any) {
      console.error('Błąd logowania:', error)
      alert(error.response?.data?.message || 'Nie udało się zalogować.')
    }
  }

  const handleSignUpClick = () =>{
    router.push('/signup')
  }
</script>

<style scoped>
h1{
  margin: 0px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 2rem;
  color: white;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.form{
  margin: auto auto;
  width: fit-content;
  height: fit-content;
  border-radius: 1rem;
  background: linear-gradient(135deg, #004d1a 0%, #006622 100%);
  padding: 2.5rem;
  padding-top: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.n-form){
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

:deep(.n-form-item) {
  width: 280px;
}

:deep(.n-input) {
  border-radius: 8px;
}

.under-buttons{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.or-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
}

:deep(.forgot-password *) {
  color: #4FC3F7 !important;
  font-weight: 500;
  transition: color 0.2s ease;
}

:deep(.forgot-password *:hover) {
  color: #81D4FA !important;
}

:deep(.n-button){
  border-radius: 12px;
  font-weight: 600;
  padding: 0 1.5rem;
  height: 40px;
  transition: all 0.2s ease;
}

:deep(.n-button:hover){
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

:deep(.n-form-item-label__text){
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
}

</style>