import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useRouter } from 'vue-router'

// Configuração base da API
const API_BASE_URL = 'https://lionfish-app-w54yf.ondigitalocean.app/api'

// Criar instância do Axios
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.DEV 
    ? 'http://localhost:3000/api'  // Development API URL
    : API_BASE_URL,                // Production API URL
  timeout: 15000, // Aumentado para 15s
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Flag para evitar múltiplos redirects
let isRedirecting = false

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log da requisição em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data
      })
    }
    
    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log da resposta em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      })
    }
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config
    
    // Log detalhado do erro
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    })
    
    // Tratamento específico por status code
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      if (!isRedirecting) {
        isRedirecting = true
        
        // Limpar dados de autenticação
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        
        // Redirecionar para login
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        
        // Reset flag após um tempo
        setTimeout(() => {
          isRedirecting = false
        }, 1000)
      }
    }
    
    // Tratamento para outros erros comuns
    if (error.response?.status === 403) {
      console.warn('🚫 Acesso negado - Permissões insuficientes')
    }
    
    if (error.response?.status === 404) {
      console.warn('🔍 Recurso não encontrado')
    }
    
    if (error.response?.status >= 500) {
      console.error('🔥 Erro interno do servidor')
    }
    
    // Tratamento para erros de rede
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      console.error('🌐 Erro de conexão com o servidor')
    }
    
    return Promise.reject(error)
  }
)

export default api

// Tipos para as respostas da API
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

// Helper para extrair dados das respostas
export const extractData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  return response.data.data
}

// Helper para tratamento de erros
export const handleApiError = (error: AxiosError<ApiError>): string => {
  // Erro de resposta da API
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  // Erros por status code
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Dados inválidos enviados'
      case 401:
        return 'Não autorizado - faça login novamente'
      case 403:
        return 'Acesso negado - permissões insuficientes'
      case 404:
        return 'Recurso não encontrado'
      case 409:
        return 'Conflito - recurso já existe'
      case 422:
        return 'Dados de entrada inválidos'
      case 429:
        return 'Muitas tentativas - tente novamente mais tarde'
      case 500:
        return 'Erro interno do servidor'
      case 502:
        return 'Servidor indisponível'
      case 503:
        return 'Serviço temporariamente indisponível'
      default:
        return `Erro HTTP ${error.response.status}`
    }
  }
  
  // Erros de rede
  if (error.code === 'NETWORK_ERROR') {
    return 'Erro de conexão - verifique sua internet'
  }
  
  if (error.code === 'ECONNABORTED') {
    return 'Timeout - servidor demorou para responder'
  }
  
  // Erro genérico
  if (error.message) {
    return error.message
  }
  
  return 'Erro desconhecido na comunicação com o servidor'
}

// Helper para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token')
  return !!token
}

// Helper para obter o token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token')
}

// Helper para limpar dados de autenticação
export const clearAuthData = (): void => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
}