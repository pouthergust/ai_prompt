import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService'
import type { User, LoginCredentials, RegisterData } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => {
    return !!user.value && authService.isAuthenticated()
  })

  /**
   * Fazer login do usuário
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true
      error.value = null
      
      const authResponse = await authService.login(credentials)
      
      user.value = {
        id: authResponse.user.id,
        email: authResponse.user.email,
        name: authResponse.user.name,
        createdAt: new Date(authResponse.user.createdAt)
      }
      
      return authResponse
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao fazer login'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Registrar novo usuário
   */
  const register = async (userData: RegisterData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const authResponse = await authService.register(userData)
      
      user.value = {
        id: authResponse.user.id,
        email: authResponse.user.email,
        name: authResponse.user.name,
        createdAt: new Date(authResponse.user.createdAt)
      }
      
      return authResponse
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao registrar usuário'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Obter perfil do usuário atual
   */
  const fetchProfile = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const profile = await authService.getProfile()
      
      user.value = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        createdAt: new Date(profile.createdAt)
      }
      
      return profile
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao obter perfil'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fazer logout do usuário
   */
  const logout = () => {
    authService.logout()
    user.value = null
    error.value = null
  }

  /**
   * Inicializar store - verificar se há token válido
   */
  const initialize = async () => {
    if (authService.isAuthenticated()) {
      try {
        await fetchProfile()
      } catch (err) {
        // Token inválido ou expirado, fazer logout
        logout()
      }
    }
  }

  /**
   * Limpar erro
   */
  const clearError = () => {
    error.value = null
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    fetchProfile,
    logout,
    initialize,
    clearError
  }
})