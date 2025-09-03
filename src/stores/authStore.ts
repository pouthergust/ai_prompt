import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useClerk, useUser } from '@clerk/vue'

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export const useAuthStore = defineStore('auth', () => {
  const clerk = useClerk()
  const { isSignedIn, user: clerkUser, isLoaded } = useUser()
  
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => isSignedIn.value)

  // Métodos de autenticação usando Clerk - simplificados
  // Nota: Os métodos de login e register agora são gerenciados diretamente nos componentes
  // usando useSignIn e useSignUp do Clerk
  const login = async (email: string, password: string) => {
    // Este método é mantido para compatibilidade, mas o login real
    // é feito diretamente no componente Login.vue usando useSignIn
    return { success: true }
  }

  const register = async (email: string, password: string, name: string) => {
    // Este método é mantido para compatibilidade, mas o registro real
    // é feito diretamente no componente Login.vue usando useSignUp
    return { success: true }
  }
  
  // Função para atualizar o usuário local com dados do Clerk
  const updateUserFromClerk = () => {
    if (clerkUser.value) {
      user.value = {
        id: clerkUser.value.id,
        email: clerkUser.value.primaryEmailAddress?.emailAddress || '',
        name: `${clerkUser.value.firstName || ''} ${clerkUser.value.lastName || ''}`.trim(),
        createdAt: new Date(clerkUser.value.createdAt)
      }
    } else {
      user.value = null
    }
  }

  const logout = async () => {
    try {
      await clerk.value.signOut()
      user.value = null
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const loadFromStorage = () => {
    // Com o Clerk, não precisamos mais carregar do localStorage
    // O Clerk gerencia o estado de autenticação automaticamente
    if (isLoaded.value && isSignedIn.value) {
      updateUserFromClerk()
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    loadFromStorage,
    updateUserFromClerk
  }
})