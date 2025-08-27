import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AITool {
  id: string
  name: string
  description: string
  category: string
  website: string
  logo: string
  features: string[]
  pricing: 'free' | 'freemium' | 'paid'
  bestFor: string[]
  rating: number
  isPopular: boolean
}

export const useAIRecommendationStore = defineStore('aiRecommendation', () => {
  const aiTools = ref<AITool[]>([
    {
      id: '1',
      name: 'ChatGPT',
      description: 'IA conversacional avançada da OpenAI para geração de texto, código e análises.',
      category: 'Conversacional',
      website: 'https://chat.openai.com',
      logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      features: ['Geração de texto', 'Programação', 'Análise', 'Tradução', 'Criatividade'],
      pricing: 'freemium',
      bestFor: ['Desenvolvimento', 'Criatividade', 'Análise', 'Educação'],
      rating: 4.8,
      isPopular: true
    },
    {
      id: '2',
      name: 'Claude',
      description: 'IA da Anthropic focada em conversas úteis, harmless e honestas.',
      category: 'Conversacional',
      website: 'https://claude.ai',
      logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      features: ['Análise de documentos', 'Programação', 'Escrita', 'Pesquisa'],
      pricing: 'freemium',
      bestFor: ['Análise', 'Desenvolvimento', 'Educação'],
      rating: 4.7,
      isPopular: true
    },
    {
      id: '3',
      name: 'Gemini',
      description: 'IA do Google com capacidades multimodais avançadas.',
      category: 'Conversacional',
      website: 'https://gemini.google.com',
      logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      features: ['Multimodal', 'Integração Google', 'Análise de imagens', 'Programação'],
      pricing: 'freemium',
      bestFor: ['Análise', 'Desenvolvimento', 'Criatividade'],
      rating: 4.6,
      isPopular: true
    },
    {
      id: '4',
      name: 'Midjourney',
      description: 'IA especializada em geração de imagens artísticas de alta qualidade.',
      category: 'Geração de Imagem',
      website: 'https://midjourney.com',
      logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      features: ['Arte digital', 'Ilustrações', 'Conceitos visuais', 'Estilos artísticos'],
      pricing: 'paid',
      bestFor: ['Criatividade', 'Marketing'],
      rating: 4.9,
      isPopular: true
    },
    {
      id: '5',
      name: 'DALL-E 3',
      description: 'Gerador de imagens da OpenAI com alta precisão e criatividade.',
      category: 'Geração de Imagem',
      website: 'https://openai.com/dall-e-3',
      logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      features: ['Geração de imagens', 'Edição de fotos', 'Arte conceitual'],
      pricing: 'paid',
      bestFor: ['Criatividade', 'Marketing'],
      rating: 4.7,
      isPopular: false
    },
    {
      id: '6',
      name: 'GitHub Copilot',
      description: 'Assistente de programação alimentado por IA para desenvolvedores.',
      category: 'Programação',
      website: 'https://github.com/features/copilot',
      logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      features: ['Autocompletar código', 'Sugestões', 'Documentação', 'Testes'],
      pricing: 'paid',
      bestFor: ['Desenvolvimento'],
      rating: 4.5,
      isPopular: true
    },
    {
      id: '7',
      name: 'Jasper',
      description: 'IA especializada em marketing e criação de conteúdo comercial.',
      category: 'Marketing',
      website: 'https://jasper.ai',
      logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      features: ['Copy marketing', 'Blog posts', 'Social media', 'E-mail marketing'],
      pricing: 'paid',
      bestFor: ['Marketing', 'Negócios'],
      rating: 4.4,
      isPopular: false
    },
    {
      id: '8',
      name: 'Perplexity',
      description: 'Motor de busca alimentado por IA com respostas precisas e fontes.',
      category: 'Pesquisa',
      website: 'https://perplexity.ai',
      logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      features: ['Pesquisa inteligente', 'Citações', 'Análise de dados', 'Resumos'],
      pricing: 'freemium',
      bestFor: ['Educação', 'Análise'],
      rating: 4.6,
      isPopular: false
    }
  ])

  const categories = ref<string[]>([
    'Todos',
    'Conversacional',
    'Geração de Imagem',
    'Programação',
    'Marketing',
    'Pesquisa'
  ])

  const filters = ref({
    category: 'Todos',
    pricing: 'all',
    onlyPopular: false,
    search: ''
  })

  const filteredAITools = ref<AITool[]>([])

  const applyFilters = () => {
    let filtered = aiTools.value

    // Filtro por categoria
    if (filters.value.category !== 'Todos') {
      filtered = filtered.filter(tool => tool.category === filters.value.category)
    }

    // Filtro por preço
    if (filters.value.pricing !== 'all') {
      filtered = filtered.filter(tool => tool.pricing === filters.value.pricing)
    }

    // Filtro por popularidade
    if (filters.value.onlyPopular) {
      filtered = filtered.filter(tool => tool.isPopular)
    }

    // Filtro por busca
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm) ||
        tool.features.some(feature => feature.toLowerCase().includes(searchTerm))
      )
    }

    // Ordenar por rating
    filtered.sort((a, b) => b.rating - a.rating)

    filteredAITools.value = filtered
  }

  const getRecommendationsForPrompt = (promptCategory: string) => {
    const categoryMapping: Record<string, string[]> = {
      'Desenvolvimento': ['Conversacional', 'Programação'],
      'Marketing': ['Marketing', 'Conversacional', 'Geração de Imagem'],
      'Criatividade': ['Geração de Imagem', 'Conversacional'],
      'Análise': ['Conversacional', 'Pesquisa'],
      'Educação': ['Conversacional', 'Pesquisa'],
      'Negócios': ['Marketing', 'Conversacional'],
      'Outros': ['Conversacional']
    }

    const relevantCategories = categoryMapping[promptCategory] || ['Conversacional']
    
    return aiTools.value
      .filter(tool => relevantCategories.includes(tool.category))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
  }

  // Inicializar filtros
  applyFilters()

  return {
    aiTools,
    categories,
    filters,
    filteredAITools,
    applyFilters,
    getRecommendationsForPrompt
  }
})