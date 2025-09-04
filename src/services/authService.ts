import api, { ApiResponse, handleApiError } from './api'
import { AxiosError } from 'axios'

// Interfaces para autenticação
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    createdAt: string
  }
  token: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  createdAt: string
}

class AuthService {
  /**
   * Fazer login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
      const authData = response.data.data
      
      // Salvar token no localStorage
      if (authData.token) {
        localStorage.setItem('auth_token', authData.token)
      }
      
      return authData
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError)
      throw new Error(errorMessage)
    }
  }

  /**
   * Registrar novo usuário
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData)
      const authData = response.data.data
      
      // Salvar token no localStorage
      if (authData.token) {
        localStorage.setItem('auth_token', authData.token)
      }
      
      return authData
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError)
      throw new Error(errorMessage)
    }
  }

  /**
   * Obter perfil do usuário atual
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await api.get<ApiResponse<UserProfile>>('/auth/me')
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError)
      throw new Error(errorMessage)
    }
  }

  /**
   * Fazer logout do usuário
   */
  logout(): void {
    localStorage.removeItem('auth_token')
  }

  /**
   * Verificar se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token')
    return !!token
  }

  /**
   * Obter token de autenticação
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  }
}

// Exportar instância única do serviço
export const authService = new AuthService()
export default authService