<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref(true)
const showPassword = ref(false)
const error = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

onMounted(() => {
  // Se já estiver autenticado, redirecionar
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

const handleLogin = async () => {
  error.value = ''
  
  if (!loginForm.value.email || !loginForm.value.password) {
    error.value = 'Por favor, preencha todos os campos'
    return
  }
  
  const result = await authStore.login(loginForm.value.email, loginForm.value.password)
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error || 'Erro ao fazer login'
  }
}

const handleRegister = async () => {
  error.value = ''
  
  if (!registerForm.value.name || !registerForm.value.email || !registerForm.value.password) {
    error.value = 'Por favor, preencha todos os campos'
    return
  }
  
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    error.value = 'As senhas não coincidem'
    return
  }
  
  if (registerForm.value.password.length < 6) {
    error.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }
  
  const result = await authStore.register(
    registerForm.value.email,
    registerForm.value.password,
    registerForm.value.name
  )
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error || 'Erro ao criar conta'
  }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  loginForm.value = { email: '', password: '' }
  registerForm.value = { name: '', email: '', password: '', confirmPassword: '' }
}

const demoLogin = (email: string, password: string) => {
  loginForm.value.email = email
  loginForm.value.password = password
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

      <!-- Demo Accounts -->
      <div v-if="isLogin" class="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 class="text-sm font-medium text-gray-300 mb-3">Contas de demonstração:</h3>
        <div class="space-y-2">
          <button
            @click="demoLogin('admin@example.com', 'admin123')"
            class="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm text-gray-300 transition-colors"
          >
            <div class="font-medium">Administrador</div>
            <div class="text-xs text-gray-400">admin@example.com / admin123</div>
          </button>
          <button
            @click="demoLogin('user@example.com', 'user123')"
            class="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm text-gray-300 transition-colors"
          >
            <div class="font-medium">Usuário</div>
            <div class="text-xs text-gray-400">user@example.com / user123</div>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <!-- Login Form -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <div class="relative">
            <EnvelopeIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              required
              class="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            Senha
          </label>
          <div class="relative">
            <LockClosedIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Sua senha"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <EyeIcon v-if="!showPassword" class="h-5 w-5" />
              <EyeSlashIcon v-else class="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <span v-if="authStore.isLoading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
            Nome completo
          </label>
          <div class="relative">
            <UserIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="name"
              v-model="registerForm.name"
              type="text"
              required
              class="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Seu nome completo"
            />
          </div>
        </div>

        <div>
          <label for="register-email" class="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <div class="relative">
            <EnvelopeIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="register-email"
              v-model="registerForm.email"
              type="email"
              required
              class="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div>
          <label for="register-password" class="block text-sm font-medium text-gray-300 mb-2">
            Senha
          </label>
          <div class="relative">
            <LockClosedIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="register-password"
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mínimo 6 caracteres"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <EyeIcon v-if="!showPassword" class="h-5 w-5" />
              <EyeSlashIcon v-else class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-300 mb-2">
            Confirmar senha
          </label>
          <div class="relative">
            <LockClosedIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="confirm-password"
              v-model="registerForm.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirme sua senha"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <span v-if="authStore.isLoading">Criando conta...</span>
          <span v-else>Criar conta</span>
        </button>
      </form>

      <!-- Toggle Mode -->
      <div class="text-center">
        <button
          @click="toggleMode"
          class="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          {{ isLogin ? 'Não tem uma conta? Criar conta' : 'Já tem uma conta? Entrar' }}
        </button>
      </div>
    </div>
  </div>
</template>