<template>
    <div class="form">
      <h1>Password Recovery</h1>
      <n-form
          v-if="!emailSent"
          ref="emailFormRef"
          :model="emailFormValue"
          :rules="emailRules"
      >
        <n-form-item label="Email" path="email">
          <n-input 
          :autofocus="true"
          v-model:value="emailFormValue.email"
          placeholder="" 
          clearable
          @keydown.enter="handleEmailSend" 
          />
        </n-form-item>
      </n-form>
      <n-form
        v-else
        ref="codeFormRef"
        :model="codeFormValue"
        :rules="codeRules">
        
        <n-form-item  label="Recived Code" path="recivedCode">
          <n-input-number
          v-model:value="codeFormValue.recivedCode" 
          placeholder=""
          :show-button="false"
          @keydown.enter="handleCodeSend" 
          />
        </n-form-item>
      </n-form>
      <div class="under-buttons">
        <n-button color="black"  @click="handleEmailSend" v-if="!emailSent" >
            Send code
        </n-button>
        <n-button color="black" @click="handleCodeSend" v-else>
            Send request
        </n-button>
      </div>
      
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NForm,NFormItem,NInput,NButton,NInputNumber } from 'naive-ui';
import { useRouter } from 'vue-router';
import type { FormInst } from 'naive-ui'

const emailSent = ref(false)
const emailFormRef = ref<FormInst | null>(null)
const codeFormRef = ref<FormInst | null>(null)
const emailFormValue = ref(
  { 
    email: ''
  })
  const codeFormValue = ref(
  { 
    recivedCode: Number
  })

  const emailRules= ref({
    email: [{
        required: true,
        message: 'Wypełnij pole.',
        trigger: 'blur'
    },
    {
        type: 'email' as const,
        message: 'Podaj e-mail.',
        trigger: 'blur'
    }]
})
  const codeRules = ref({
    recivedCode: {
      required: true,
      type: 'number' as const,
      message: "Kod musi być liczbą.",
      trigger: 'blur'
    }
  })


  const router = useRouter()

  const handleCodeSend = (e: MouseEvent | KeyboardEvent) =>{
    e.preventDefault()
    codeFormRef.value?.validate((errors) =>{
      if(!errors){
        alert("Kod: " + codeFormValue.value.recivedCode)
        router.push('/restore-password')
      }
    })
  }
  const handleEmailSend = (e: MouseEvent | KeyboardEvent) =>{
        e.preventDefault()
        emailFormRef.value?.validate((errors) => {
          if (!errors) {
            alert("Email: " + emailFormValue.value.email)
            emailSent.value = true
          }
        })
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