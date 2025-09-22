import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import promptService from '../services/promptService'
import type { ApiPrompt, Prompt, CreatePromptData, UpdatePromptData, PromptFilter } from '../types'

// Função para converter dados da API para o formato do frontend
const convertApiPromptToFrontend = (apiPrompt: ApiPrompt): Prompt => ({
  id: apiPrompt.id,
  title: apiPrompt.title,
  content: apiPrompt.content,
  category: apiPrompt.category,
  tags: apiPrompt.tags,
  isFavorite: apiPrompt.is_favorite,
  createdAt: new Date(apiPrompt.created_at),
  updatedAt: new Date(apiPrompt.updated_at)
})

export const usePromptStore = defineStore('prompt', () => {
  const prompts = ref<Prompt[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<PromptFilter>({
    search: '',
    category: '',
    showFavorites: false,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const categories = ref<string[]>([
    'Desenvolvimento',
    'Marketing',
    'Criatividade',
    'Análise',
    'Educação',
    'Negócios',
    'Outros'
  ])

  const templates = ref([
    {
      id: '1',
      name: 'Análise de Código',
      description: 'Template para análise e revisão de código',
      content: 'Analise o seguinte código e forneça feedback sobre: 1) Qualidade do código, 2) Possíveis melhorias, 3) Bugs potenciais, 4) Padrões de design:\n\n[CÓDIGO]',
      category: 'Desenvolvimento'
    },
    {
      id: '2',
      name: 'Criação de Conteúdo',
      description: 'Template para criação de conteúdo de marketing',
      content: 'Crie um conteúdo para [PLATAFORMA] sobre [TÓPICO] que seja: 1) Envolvente e interessante, 2) Otimizado para SEO, 3) Adequado para o público-alvo [PÚBLICO], 4) Com tom [TOM]',
      category: 'Marketing'
    },
    {
      id: '3',
      name: 'Resolução de Problemas',
      description: 'Template para resolução estruturada de problemas',
      content: 'Ajude-me a resolver o seguinte problema: [PROBLEMA]\n\nPor favor, forneça: 1) Análise do problema, 2) Possíveis soluções, 3) Prós e contras de cada solução, 4) Recomendação final',
      category: 'Negócios'
    }
  ])

  // Computed properties
  const filteredPrompts = computed(() => {
    let filtered = prompts.value

    // Filtro por busca
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(prompt => 
        prompt.title.toLowerCase().includes(searchTerm) ||
        prompt.content.toLowerCase().includes(searchTerm) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Filtro por categoria
    if (filters.value.category) {
      filtered = filtered.filter(prompt => prompt.category === filters.value.category)
    }

    // Filtro por favoritos
    if (filters.value.showFavorites) {
      filtered = filtered.filter(prompt => prompt.isFavorite)
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue = a[filters.value.sortBy]
      let bValue = b[filters.value.sortBy]

      if (filters.value.sortBy === 'title') {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (filters.value.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  })

  const favoritePrompts = computed(() => prompts.value.filter(p => p.isFavorite))
  const recentPrompts = computed(() => prompts.value.slice(0, 5))

  // Actions
  /**
   * Carregar todos os prompts do usuário
   */
  const fetchPrompts = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const apiResponse = await promptService.getPrompts()
      prompts.value = apiResponse.prompts.map(convertApiPromptToFrontend)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar prompts'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Criar novo prompt
   */
  const addPrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const createData: CreatePromptData = {
        title: promptData.title,
        content: promptData.content,
        category: promptData.category,
        tags: promptData.tags
      }
      
      const newPrompt = await promptService.createPrompt(createData)
      const localPrompt = convertApiPromptToFrontend(newPrompt)
      prompts.value.push(localPrompt)
      
      return localPrompt
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao criar prompt'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Atualizar prompt existente
   */
  const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const updateData: UpdatePromptData = {
        title: updates.title,
        content: updates.content,
        category: updates.category,
        tags: updates.tags
      }
      
      const updatedPrompt = await promptService.updatePrompt(id, updateData)
      const localPrompt = convertApiPromptToFrontend(updatedPrompt)
      
      const index = prompts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prompts.value[index] = localPrompt
      }
      
      return localPrompt
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao atualizar prompt'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deletar prompt
   */
  const deletePrompt = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await promptService.deletePrompt(id)
      
      const index = prompts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prompts.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao deletar prompt'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Alternar status de favorito
   */
  const toggleFavorite = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const updatedPrompt = await promptService.toggleFavorite(id)
      const localPrompt = convertApiPromptToFrontend(updatedPrompt)
      
      const index = prompts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prompts.value[index] = localPrompt
      }
      
      return localPrompt
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao alterar favorito'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Buscar prompts por termo
   */
  const searchPrompts = async (term: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const results = await promptService.searchPrompts(term)
      return results.map(convertApiPromptToFrontend)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao buscar prompts'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Filtrar prompts por categoria
   */
  const getPromptsByCategory = async (category: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const results = await promptService.getPromptsByCategory(category)
      return results.map(convertApiPromptToFrontend)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao filtrar prompts'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Obter prompts favoritos
   */
  const fetchFavoritePrompts = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const results = await promptService.getFavoritePrompts()
      return results.map(convertApiPromptToFrontend)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar favoritos'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Converter prompt da API para formato local
   */
  // Função de conversão movida para o topo do arquivo

  /**
   * Copiar conteúdo para clipboard
   */
  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      return true
    } catch (err) {
      console.error('Erro ao copiar para clipboard:', err)
      return false
    }
  }

  /**
   * Limpar erro
   */
  const clearError = () => {
    error.value = null
  }

  const generatePrompt = (template: string, variables: Record<string, string>) => {
    let generated = template
    Object.entries(variables).forEach(([key, value]) => {
      generated = generated.replace(`[${key.toUpperCase()}]`, value)
    })
    return generated
  }

  return {
    // State
    prompts,
    isLoading,
    error,
    filters,
    categories,
    templates,
    
    // Computed
    filteredPrompts,
    favoritePrompts,
    recentPrompts,
    
    // Actions - CRUD
    fetchPrompts,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    
    // Actions - Search & Filter
    searchPrompts,
    getPromptsByCategory,
    fetchFavoritePrompts,
    
    // Utilities
    copyToClipboard,
    generatePrompt,
    clearError
  }
})