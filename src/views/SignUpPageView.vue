<template>
    <div class="form">
        <h1>Rejestracja</h1>
        <n-form ref="registerFormRef" :model="formValue" :rules="formRules">
            <n-form-item label="Email" path="email" :feedback="emailFeedback"
                :validation-status="emailStatus">
            <n-input v-model:value="formValue.email" placeholder="Wpisz email" clearable
                @keydown.enter="handleRegister" />
            </n-form-item>


            <n-form-item label="Nazwa użytkownika" path="username" :feedback="usernameFeedback"
                :validation-status="usernameStatus">
                <n-input v-model:value="formValue.username" placeholder="Wpisz nazwę" clearable
                    @keydown.enter="handleRegister" />
            </n-form-item>

            <n-form-item label="Hasło" path="password">
                <n-input v-model:value="formValue.password" type="password" placeholder="Wpisz hasło"
                    show-password-on="click" clearable @keydown.enter="handleRegister" />
            </n-form-item>
        </n-form>

        <div class="under-buttons">
            <n-button color="black" @click="handleRegister">Zarejestruj się</n-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import {NFormItem,NButton,NForm,NInput} from 'naive-ui'

const emailStatus = ref<'success' | 'warning' | 'error' | undefined>(undefined)
const emailFeedback = ref('')
const usernameStatus = ref<'success' | 'warning' | 'error' | undefined>(undefined)
const usernameFeedback = ref('')


const registerFormRef = ref<FormInst | null>(null)
const router = useRouter()

const formValue = ref({
    email: '',
    username: '',
    password: ''
})

const formRules = ref({
    email: [
        { required: true, message: 'Email jest wymagany.', trigger: 'blur' },
        { type: 'email', message: 'Nieprawidłowy format email.', trigger: 'blur' }
    ],
    username: [
        { required: true, message: 'Nazwa użytkownika jest wymagana.', trigger: 'blur' },
        { min: 3, message: 'Minimum 3 znaki.', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Hasło jest wymagane.', trigger: 'blur' },
        { min: 6, message: 'Hasło musi mieć co najmniej 6 znaków.', trigger: 'blur' }
    ]
})

// przyklad jakiejs bazy
const existingEmails = ['test@example.com', 'admin@mail.com']
const existingUsernames = ['admin', 'user123']

const handleRegister = async (e: MouseEvent | KeyboardEvent) => {
    e.preventDefault()
    registerFormRef.value?.validate(async (errors) => {
        if (!errors) {
            const { email, username } = formValue.value

            // tu call na api 
            const emailExists = existingEmails.includes(email.toLowerCase())
            const usernameExists = existingUsernames.includes(username.toLowerCase())

            if (emailExists) {
                emailStatus.value = 'error'
                emailFeedback.value = 'Ten email już istnieje.'
                return
            }

            if (usernameExists) {
                usernameStatus.value = 'error'
                usernameFeedback.value = 'Nazwa użytkownika już zajęta.'
                return
            }

            alert('Rejestracja zakończona sukcesem!')
            emailStatus.value = undefined
            usernameStatus.value = undefined
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
