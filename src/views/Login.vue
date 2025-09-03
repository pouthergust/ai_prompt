<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { 
  SparklesIcon
} from '@heroicons/vue/24/outline'
import { SignIn, SignUp, useUser } from '@clerk/vue'

const router = useRouter()
const authStore = useAuthStore()
const { isSignedIn } = useUser()

const isLogin = ref(true)

onMounted(() => {
  // Se já estiver autenticado, redirecionar
  if (isSignedIn.value) {
    router.push('/')
  }
})

// Função para lidar com sucesso na autenticação
const handleSignInSuccess = () => {
  authStore.updateUserFromClerk()
  router.push('/')
}

const handleSignUpSuccess = () => {
  authStore.updateUserFromClerk()
  router.push('/')
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="flex justify-center">
          <SparklesIcon class="h-12 w-12 text-blue-400" />
        </div>
        <h2 class="mt-6 text-3xl font-bold text-white">
          {{ isLogin ? 'Entrar na sua conta' : 'Criar nova conta' }}
        </h2>
        <p class="mt-2 text-sm text-gray-400">
          {{ isLogin ? 'Acesse seu gerenciador de prompts' : 'Comece a gerenciar seus prompts de IA' }}
        </p>
      </div>

      <!-- Card -->
      <div class="p-8">
        <!-- Toggle Buttons -->
        <div class="flex border border-gray-700 rounded-lg p-1 mb-6">
          <button
            @click="isLogin = true"
            :class="[
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
              isLogin
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            ]"
          >
            Entrar
          </button>
          <button
            @click="isLogin = false"
            :class="[
              'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
              !isLogin
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-300 hover:text-white'
            ]"
          >
            Registrar
          </button>
        </div>

        <!-- Clerk Components -->
        <div class="clerk-container">
          <SignIn 
            v-if="isLogin"
            :afterSignInUrl="'/'"
            @success="handleSignInSuccess"
            class="w-full"
          />
          <SignUp
            v-else
            :afterSignUpUrl="'/'"
            @success="handleSignUpSuccess"
            class="w-full"
          />
        </div>

        <!-- Footer -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-400">
            {{ isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
            <button
              @click="toggleMode"
              class="text-blue-400 hover:text-blue-300 font-medium ml-1"
            >
              {{ isLogin ? 'Registre-se' : 'Entre aqui' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para integração com componentes Clerk - Tema Escuro */
.clerk-container {
  /* Remove bordas e espaçamentos desnecessários dos componentes Clerk */
}

/* Personalização dos componentes Clerk para combinar com o design escuro */
:deep(.cl-rootBox) {
  box-shadow: none;
  border: none;
  background: transparent;
}

:deep(.cl-card) {
  box-shadow: none;
  border: none;
  background: transparent;
}

:deep(.cl-headerTitle) {
  display: none; /* Esconder título padrão do Clerk */
}

:deep(.cl-headerSubtitle) {
  display: none; /* Esconder subtítulo padrão do Clerk */
}

/* Botões sociais com tema escuro */
:deep(.cl-socialButtonsBlockButton) {
  border-radius: 0.5rem;
  border: 1px solid #4b5563;
  background-color: #374151;
  color: #f3f4f6;
  transition: all 0.2s;
}

:deep(.cl-socialButtonsBlockButton:hover) {
  border-color: #2563eb;
  background-color: #4b5563;
}

/* Campos de input com tema escuro */
:deep(.cl-formFieldInput) {
  border-radius: 0.5rem;
  border: 1px solid #4b5563;
  background-color: #374151;
  color: #f3f4f6;
  padding: 0.75rem;
  transition: all 0.2s;
}

:deep(.cl-formFieldInput:focus) {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  background-color: #4b5563;
}

:deep(.cl-formFieldInput::placeholder) {
  color: #9ca3af;
}

/* Labels com tema escuro */
:deep(.cl-formFieldLabel) {
  color: #d1d5db;
}

/* Botão primário com tema azul */
:deep(.cl-formButtonPrimary) {
  background-color: #2563eb;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
}

:deep(.cl-formButtonPrimary:hover) {
  background-color: #1d4ed8;
}

/* Links com tema azul */
:deep(.cl-footerActionLink) {
  color: #60a5fa;
}

:deep(.cl-footerActionLink:hover) {
  color: #93c5fd;
}

/* Texto geral com tema escuro */
:deep(.cl-formFieldErrorText) {
  color: #f87171;
}

:deep(.cl-formFieldSuccessText) {
  color: #34d399;
}

:deep(.cl-formFieldHintText) {
  color: #9ca3af;
}

/* Divisores com tema escuro */
:deep(.cl-dividerLine) {
  background-color: #4b5563;
}

:deep(.cl-dividerText) {
  color: #9ca3af;
}
</style>