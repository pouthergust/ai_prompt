import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PromptFilter {
  search: string
  category: string
  showFavorites: boolean
  sortBy: 'createdAt' | 'updatedAt' | 'title'
  sortOrder: 'asc' | 'desc'
}

export const usePromptStore = defineStore('prompt', () => {
  const prompts = ref<Prompt[]>([])
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
      content: 'Analise o seguinte código e forneça feedback sobre: 1) Qualidade do código, 2) Possíveis melhorias, 3) Bugs potenciais, 4) Padrões de design:\n\n[CÓDIGO]'
    },
    {
      id: '2',
      name: 'Criação de Conteúdo',
      description: 'Template para criação de conteúdo de marketing',
      content: 'Crie um conteúdo para [PLATAFORMA] sobre [TÓPICO] que seja: 1) Envolvente e interessante, 2) Otimizado para SEO, 3) Adequado para o público-alvo [PÚBLICO], 4) Com tom [TOM]'
    },
    {
      id: '3',
      name: 'Resolução de Problemas',
      description: 'Template para resolução estruturada de problemas',
      content: 'Ajude-me a resolver o seguinte problema: [PROBLEMA]\n\nPor favor, forneça: 1) Análise do problema, 2) Possíveis soluções, 3) Prós e contras de cada solução, 4) Recomendação final'
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
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
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
  const addPrompt = (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPrompt: Prompt = {
      ...promptData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    prompts.value.push(newPrompt)
    saveToLocalStorage()
  }

  const updatePrompt = (id: string, updates: Partial<Prompt>) => {
    const index = prompts.value.findIndex(p => p.id === id)
    if (index !== -1) {
      prompts.value[index] = {
        ...prompts.value[index],
        ...updates,
        updatedAt: new Date()
      }
      saveToLocalStorage()
    }
  }

  const deletePrompt = (id: string) => {
    const index = prompts.value.findIndex(p => p.id === id)
    if (index !== -1) {
      prompts.value.splice(index, 1)
      saveToLocalStorage()
    }
  }

  const toggleFavorite = (id: string) => {
    const prompt = prompts.value.find(p => p.id === id)
    if (prompt) {
      prompt.isFavorite = !prompt.isFavorite
      prompt.updatedAt = new Date()
      saveToLocalStorage()
    }
  }

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      return true
    } catch (err) {
      console.error('Erro ao copiar para clipboard:', err)
      return false
    }
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('ai-prompts', JSON.stringify(prompts.value))
  }

  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem('ai-prompts')
    if (stored) {
      const parsed = JSON.parse(stored)
      prompts.value = parsed.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }))
    }
  }

  const generatePrompt = (template: string, variables: Record<string, string>) => {
    let generated = template
    Object.entries(variables).forEach(([key, value]) => {
      generated = generated.replace(`[${key.toUpperCase()}]`, value)
    })
    return generated
  }

  return {
    prompts,
    filters,
    categories,
    templates,
    filteredPrompts,
    favoritePrompts,
    recentPrompts,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    copyToClipboard,
    saveToLocalStorage,
    loadFromLocalStorage,
    generatePrompt
  }
})