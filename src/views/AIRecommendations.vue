<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useAIRecommendationStore } from '../stores/aiRecommendationStore'
import { 
  SparklesIcon,
  StarIcon,
  FunnelIcon,
  ArrowTopRightOnSquareIcon,
  CurrencyDollarIcon,
  GiftIcon,
  FireIcon
} from '@heroicons/vue/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid'

const aiStore = useAIRecommendationStore()

onMounted(() => {
  aiStore.applyFilters()
})

// Reagir a mudanças nos filtros
watch(() => aiStore.filters, () => {
  aiStore.applyFilters()
}, { deep: true })

const getPricingIcon = (pricing: string) => {
  switch (pricing) {
    case 'free': return GiftIcon
    case 'freemium': return SparklesIcon
    case 'paid': return CurrencyDollarIcon
    default: return CurrencyDollarIcon
  }
}

const getPricingLabel = (pricing: string) => {
  switch (pricing) {
    case 'free': return 'Gratuito'
    case 'freemium': return 'Freemium'
    case 'paid': return 'Pago'
    default: return 'Pago'
  }
}

const getPricingColor = (pricing: string) => {
  switch (pricing) {
    case 'free': return 'text-green-400'
    case 'freemium': return 'text-blue-400'
    case 'paid': return 'text-yellow-400'
    default: return 'text-yellow-400'
  }
}

const renderStars = (rating: number) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    stars.push('full')
  }

  if (hasHalfStar) {
    stars.push('half')
  }

  while (stars.length < 5) {
    stars.push('empty')
  }

  return stars
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center space-x-3">
      <SparklesIcon class="h-8 w-8 text-blue-400" />
      <div>
        <h1 class="text-2xl font-bold text-white">Recomendações de IA</h1>
        <p class="text-gray-400">Descubra as melhores IAs para usar com seus prompts</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div class="flex items-center space-x-2 mb-4">
        <FunnelIcon class="h-5 w-5 text-gray-400" />
        <h2 class="text-lg font-semibold text-white">Filtros</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
          <select
            v-model="aiStore.filters.category"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="category in aiStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Preço</label>
          <select
            v-model="aiStore.filters.pricing"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="free">Gratuito</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Pago</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
          <input
            v-model="aiStore.filters.search"
            type="text"
            placeholder="Nome ou funcionalidade..."
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex items-end">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              v-model="aiStore.filters.onlyPopular"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
            />
            <span class="text-sm text-gray-300 flex items-center">
              <FireIcon class="h-4 w-4 mr-1 text-orange-400" />
              Apenas populares
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- Grid de IAs -->
    <div v-if="aiStore.filteredAITools.length === 0" class="text-center py-12">
      <SparklesIcon class="h-16 w-16 text-gray-600 mx-auto mb-4" />
      <p class="text-gray-400 text-lg">Nenhuma IA encontrada com os filtros aplicados</p>
      <p class="text-gray-500">Tente ajustar os filtros para ver mais opções</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="ai in aiStore.filteredAITools"
        :key="ai.id"
        class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <img
              :src="ai.logo"
              :alt="ai.name"
              class="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 class="text-lg font-semibold text-white flex items-center">
                {{ ai.name }}
                <FireIcon v-if="ai.isPopular" class="h-4 w-4 ml-2 text-orange-400" />
              </h3>
              <span class="text-sm text-gray-400">{{ ai.category }}</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-1">
            <component :is="getPricingIcon(ai.pricing)" :class="['h-4 w-4', getPricingColor(ai.pricing)]" />
            <span :class="['text-sm font-medium', getPricingColor(ai.pricing)]">
              {{ getPricingLabel(ai.pricing) }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-gray-300 mb-4 text-sm leading-relaxed">{{ ai.description }}</p>

        <!-- Rating -->
        <div class="flex items-center space-x-2 mb-4">
          <div class="flex items-center space-x-1">
            <template v-for="(star, index) in renderStars(ai.rating)" :key="index">
              <StarIconSolid v-if="star === 'full'" class="h-4 w-4 text-yellow-400" />
              <StarIcon v-else class="h-4 w-4 text-gray-600" />
            </template>
          </div>
          <span class="text-sm text-gray-400">{{ ai.rating }}/5</span>
        </div>

        <!-- Features -->
        <div class="mb-4">
          <h4 class="text-sm font-medium text-gray-300 mb-2">Principais recursos:</h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="feature in ai.features.slice(0, 3)"
              :key="feature"
              class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
            >
              {{ feature }}
            </span>
            <span
              v-if="ai.features.length > 3"
              class="px-2 py-1 bg-gray-600 text-gray-400 rounded text-xs"
            >
              +{{ ai.features.length - 3 }} mais
            </span>
          </div>
        </div>

        <!-- Best For -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-gray-300 mb-2">Ideal para:</h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="category in ai.bestFor"
              :key="category"
              class="px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs"
            >
              {{ category }}
            </span>
          </div>
        </div>

        <!-- Action Button -->
        <a
          :href="ai.website"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
        >
          <span>Acessar {{ ai.name }}</span>
          <ArrowTopRightOnSquareIcon class="h-4 w-4" />
        </a>
      </div>
    </div>

    <!-- Stats -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 class="text-lg font-semibold text-white mb-4">Estatísticas</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-400">{{ aiStore.aiTools.length }}</div>
          <div class="text-sm text-gray-400">IAs Disponíveis</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-400">{{ aiStore.aiTools.filter(ai => ai.pricing === 'free').length }}</div>
          <div class="text-sm text-gray-400">Gratuitas</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-400">{{ aiStore.aiTools.filter(ai => ai.isPopular).length }}</div>
          <div class="text-sm text-gray-400">Populares</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-400">{{ aiStore.categories.length - 1 }}</div>
          <div class="text-sm text-gray-400">Categorias</div>
        </div>
      </div>
    </div>
  </div>
</template>