import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => user.value !== null)

  // Simular usuários cadastrados (em produção seria uma API)
  const registeredUsers = ref([
    {
      id: '1',
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Administrador',
      createdAt: new Date()
    },
    {
      id: '2',
      email: 'user@example.com',
      password: 'user123',
      name: 'Usuário',
      createdAt: new Date()
    }
  ])

  const login = async (email: string, password: string) => {
    isLoading.value = true
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const foundUser = registeredUsers.value.find(
        u => u.email === email && u.password === password
      )
      
      if (foundUser) {
        user.value = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          createdAt: foundUser.createdAt
        }
        
        // Salvar no localStorage
        localStorage.setItem('auth-user', JSON.stringify(user.value))
        return { success: true }
      } else {
        return { success: false, error: 'Email ou senha incorretos' }
      }
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (email: string, password: string, name: string) => {
    isLoading.value = true
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar se email já existe
      const existingUser = registeredUsers.value.find(u => u.email === email)
      if (existingUser) {
        return { success: false, error: 'Email já cadastrado' }
      }
      
      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        createdAt: new Date()
      }
      
      registeredUsers.value.push(newUser)
      
      user.value = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt
      }
      
      // Salvar no localStorage
      localStorage.setItem('auth-user', JSON.stringify(user.value))
      localStorage.setItem('registered-users', JSON.stringify(registeredUsers.value))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('auth-user')
  }

  const loadFromStorage = () => {
    const storedUser = localStorage.getItem('auth-user')
    const storedRegisteredUsers = localStorage.getItem('registered-users')
    
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      user.value = {
        ...parsed,
        createdAt: new Date(parsed.createdAt)
      }
    }
    
    if (storedRegisteredUsers) {
      const parsed = JSON.parse(storedRegisteredUsers)
      registeredUsers.value = parsed.map((u: any) => ({
        ...u,
        createdAt: new Date(u.createdAt)
      }))
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    loadFromStorage
  }
})