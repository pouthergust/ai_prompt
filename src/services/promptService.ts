import api, { ApiResponse, handleApiError, ApiError } from './api'
import { AxiosError } from 'axios'

// Interfaces para prompts
export interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  is_favorite: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export interface CreatePromptData {
  title: string
  content: string
  category: string
  tags: string[]
}

export interface UpdatePromptData {
  title?: string
  content?: string
  category?: string
  tags?: string[]
}

export interface PromptListResponse {
  prompts: Prompt[]
  total: number
  page: number
  limit: number
}

class PromptService {
  /**
   * Listar todos os prompts do usuário
   */
  async getPrompts(page = 1, limit = 10): Promise<PromptListResponse> {
    try {
      const response = await api.get<ApiResponse<PromptListResponse>>('/prompts', {
        params: { page, limit }
      })
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Criar novo prompt
   */
  async createPrompt(promptData: CreatePromptData): Promise<Prompt> {
    try {
      const response = await api.post<ApiResponse<Prompt>>('/prompts', promptData)
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Obter um prompt específico por ID
   */
  async getPromptById(id: string): Promise<Prompt> {
    try {
      const response = await api.get<ApiResponse<Prompt>>(`/prompts/${id}`)
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Atualizar prompt completo
   */
  async updatePrompt(id: string, promptData: UpdatePromptData): Promise<Prompt> {
    try {
      const response = await api.put<ApiResponse<Prompt>>(`/prompts/${id}`, promptData)
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Deletar um prompt
   */
  async deletePrompt(id: string): Promise<void> {
    try {
      await api.delete(`/prompts/${id}`)
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Buscar prompts por termo
   */
  async searchPrompts(term: string): Promise<Prompt[]> {
    try {
      const response = await api.get<ApiResponse<Prompt[]>>(`/prompts/search/${encodeURIComponent(term)}`)
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Filtrar prompts por categoria
   */
  async getPromptsByCategory(category: string): Promise<Prompt[]> {
    try {
      const response = await api.get<ApiResponse<Prompt[]>>(`/prompts/category/${encodeURIComponent(category)}`)
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Listar prompts favoritos
   */
  async getFavoritePrompts(): Promise<Prompt[]> {
    try {
      const response = await api.get<ApiResponse<Prompt[]>>('/prompts/favorites')
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Alternar status de favorito
   */
  async toggleFavorite(id: string): Promise<Prompt> {
    try {
      const response = await api.patch<ApiResponse<Prompt>>(`/prompts/${id}/favorite`)
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Verificar status da aplicação
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await api.get<ApiResponse<{ status: string; timestamp: string }>>('/health')
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }
}

// Exportar instância única do serviço
export const promptService = new PromptService()
export default promptService