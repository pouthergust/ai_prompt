import api, { handleApiError } from './api'
import { AxiosError } from 'axios'
import type { ApiPrompt, CreatePromptData, UpdatePromptData, PromptListResponse, ApiResponse, ApiError} from '../types'

class PromptService {
  /**
   * Listar todos os prompts do usuário
   */
  async getPrompts(page = 1, limit = 10): Promise<ApiPrompt[]> {
    try {
      const response = await api.get<ApiPrompt[]>('/prompts', {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Criar novo prompt
   */
  async createPrompt(promptData: CreatePromptData): Promise<ApiPrompt> {
    try {
      const response = await api.post<ApiResponse<ApiPrompt>>('/prompts', promptData)
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Obter um prompt específico por ID
   */
  async getPromptById(id: string): Promise<ApiPrompt> {
    try {
      const response = await api.get<ApiResponse<ApiPrompt>>(`/prompts/${id}`)
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Atualizar prompt completo
   */
  async updatePrompt(id: string, promptData: UpdatePromptData): Promise<ApiPrompt> {
    try {
      const response = await api.put<ApiResponse<ApiPrompt>>(`/prompts/${id}`, promptData)
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
  async searchPrompts(term: string): Promise<ApiPrompt[]> {
    try {
      const response = await api.get<ApiResponse<ApiPrompt[]>>(`/prompts/search/${encodeURIComponent(term)}`)
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Filtrar prompts por categoria
   */
  async getPromptsByCategory(category: string): Promise<ApiPrompt[]> {
    try {
      const response = await api.get<ApiResponse<ApiPrompt[]>>(`/prompts/category/${encodeURIComponent(category)}`)
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Listar prompts favoritos
   */
  async getFavoritePrompts(): Promise<ApiPrompt[]> {
    try {
      const response = await api.get<ApiResponse<ApiPrompt[]>>('/prompts/favorites')
      return response.data.data
    } catch (error) {
      const errorMessage = handleApiError(error as AxiosError<ApiError>)
      throw new Error(errorMessage)
    }
  }

  /**
   * Alternar status de favorito
   */
  async toggleFavorite(id: string): Promise<ApiPrompt> {
    try {
      const response = await api.patch<ApiResponse<ApiPrompt>>(`/prompts/${id}/favorite`)
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