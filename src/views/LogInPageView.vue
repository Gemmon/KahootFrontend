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
          placeholder="" 
          clearable 
          />
        </n-form-item>
        <n-form-item label="Password" path="password">
          <n-input 
          v-model:value="formValue.password" 
          placeholder="" 
          clearable
          />
        </n-form-item>
      </n-form>
      <div class="under-buttons">
        <div class="forgot-password">
          <n-button text @click="handleForgotPasswordClick">
            Forgot Password?
          </n-button>
        </div>
        <n-button color="black" @click="handleEnterClick">
          Enter
        </n-button>
        <span style="color:white">or</span>
        <n-button color="black" @click="handleSignUpClick">
          Sign Up
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
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.7rem;
  color: white;
  font-weight:500;
}

.form{
  margin: auto auto;
  width: fit-content;
  height: fit-content;
  border-radius: 0.5rem;
  background-color: #004d1a;
  padding: 2rem;
  padding-top:0;

}

:deep(.n-form){
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.under-buttons{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

:deep(.forgot-password *) {
  color: #359DFF !important;
  font-weight: normal;
}
:deep(.n-button){
  border-radius: 10px;
  font-weight: bold;
}
:deep(.n-form-item-label__text){
  color: white;
  font-weight: bold;
}

</style>