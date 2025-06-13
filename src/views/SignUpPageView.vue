<template>
    <div class="form">
        <h1>Sign Up</h1>
        <n-form ref="registerFormRef" :model="formValue" :rules="formRules">
            <n-form-item label="Email" path="email" :feedback="emailFeedback"
                :validation-status="emailStatus">
            <n-input v-model:value="formValue.email" placeholder="Wpisz email" clearable
                @keydown.enter="handleRegister" />
            </n-form-item>

            <n-form-item label="Username" path="username" :feedback="usernameFeedback"
                :validation-status="usernameStatus">
                <n-input v-model:value="formValue.username" placeholder="Wpisz nazwę" clearable
                    @keydown.enter="handleRegister" />
            </n-form-item>

            <n-form-item label="Password" path="password">
                <n-input v-model:value="formValue.password" type="password" placeholder="Wpisz hasło"
                    show-password-on="click" clearable @keydown.enter="handleRegister" />
            </n-form-item>
        </n-form>

        <div class="under-buttons">
            <n-button color="black" @click="handleRegister" :loading="isLoading">
                Zarejestruj się
            </n-button>
            <span class="or-text">lub</span>
            <n-button text @click="handleLoginClick" class="login-link">
                Masz już konto? zaloguj się
            </n-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import { NFormItem, NButton, NForm, NInput, useNotification } from 'naive-ui'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const emailStatus = ref<'success' | 'warning' | 'error' | undefined>(undefined)
const emailFeedback = ref('')
const usernameStatus = ref<'success' | 'warning' | 'error' | undefined>(undefined)
const usernameFeedback = ref('')
const isLoading = ref(false)

const registerFormRef = ref<FormInst | null>(null)
const router = useRouter()
const authStore = useAuthStore()

const formValue = ref({
    email: '',
    username: '',
    password: ''
})

const formRules = ref({
    email: [
        { required: true, message: 'Email jest wymagany.', trigger: 'blur' },
        { type: 'email' as const, message: 'Nieprawydłowy email.', trigger: 'blur' }
    ],
    username: [
        { required: true, message: 'Nazwa użytkownika jest wymagana.', trigger: 'blur' },
        { min: 3, message: 'Minimum 3 znaki.', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Hasło jest wymagane.', trigger: 'blur' },
        { min: 6, message: 'Hasło musi mieć minimum 6 znaków.', trigger: 'blur' }
    ]
})

const handleRegister = async (e?: MouseEvent | KeyboardEvent) => {
    if (e) e.preventDefault()
    
    emailStatus.value = undefined
    emailFeedback.value = ''
    usernameStatus.value = undefined
    usernameFeedback.value = ''
    
    registerFormRef.value?.validate(async (errors) => {
        if (!errors) {
            isLoading.value = true
            
            try {
                const response = await axios.post('/register', {
                    email: formValue.value.email,
                    username: formValue.value.username,
                    password: formValue.value.password
                })

                // Server zwraca token po udanej rejestracji
                if (response.data.token) {
                    authStore.setToken(response.data.token)
                    router.push('/')
                } else {
                    useNotification().success({
                        title: 'Zarejestrowano pomyślnie!',
                        content: 'Teraz możesz się zalogować'
                    })
                    router.push('/login')
                }
                
            } catch (error: any) {
                console.error('Registration error:', error)

                if (error.response?.status === 400 && error.response?.data?.message === "User already exists") {
                    emailStatus.value = 'error'
                    emailFeedback.value = 'Ten adres już jest zarejestrowany.'
                } else {
                    useNotification().error({
                        title: 'Wystąpił błąd',
                        content: error.response?.data?.message || 'Rejestracja nie powiodła się, spróbuj ponownie.'
                    })
                }
            } finally {
                isLoading.value = false
            }
        }
    })
}

const handleLoginClick = () => {
    router.push('/login')
}
</script>

<style scoped>
h1 {
    margin: 0px;
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 2rem;
    color: white;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.form {
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

:deep(.n-form) {
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

.under-buttons {
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

:deep(.login-link *) {
    color: #4FC3F7 !important;
    font-weight: 500;
    transition: color 0.2s ease;
}

:deep(.login-link *:hover) {
    color: #81D4FA !important;
}

:deep(.n-button) {
    border-radius: 12px;
    font-weight: 600;
    padding: 0 1.5rem;
    height: 40px;
    transition: all 0.2s ease;
}

:deep(.n-button:hover) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

:deep(.n-form-item-label__text) {
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
}

:deep(.n-form-item-feedback) {
    color: #ff6b6b;
    font-weight: 500;
}
</style>