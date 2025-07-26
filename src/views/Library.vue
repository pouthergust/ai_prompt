<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePromptStore } from '../stores/promptStore'
import PromptCard from '../components/PromptCard.vue'
import { 
  FunnelIcon, 
  HeartIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const promptStore = usePromptStore()

onMounted(() => {
  promptStore.loadFromLocalStorage()
})

const sortOptions = [
  { value: 'createdAt', label: 'Data de Criação' },
  { value: 'updatedAt', label: 'Última Atualização' },
  { value: 'title', label: 'Título' }
]

const orderOptions = [
  { value: 'desc', label: 'Decrescente' },
  { value: 'asc', label: 'Crescente' }
]

const hasFilters = computed(() => {
  return promptStore.filters.search || 
         promptStore.filters.category || 
         promptStore.filters.showFavorites
})

const clearFilters = () => {
  promptStore.filters.search = ''
  promptStore.filters.category = ''
  promptStore.filters.showFavorites = false
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">Biblioteca de Prompts</h1>
      <div class="text-sm text-gray-400">
        {{ promptStore.filteredPrompts.length }} de {{ promptStore.prompts.length }} prompts
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div class="flex items-center space-x-2 mb-4">
        <FunnelIcon class="h-5 w-5 text-gray-400" />
        <h2 class="text-lg font-semibold text-white">Filtros</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
          <select
            v-model="promptStore.filters.category"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as categorias</option>
            <option v-for="category in promptStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Ordenar por</label>
          <select
            v-model="promptStore.filters.sortBy"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Ordem</label>
          <select
            v-model="promptStore.filters.sortOrder"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="option in orderOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              v-model="promptStore.filters.showFavorites"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
            />
            <span class="text-sm text-gray-300 flex items-center">
              <HeartIcon class="h-4 w-4 mr-1" />
              Apenas favoritos
            </span>
          </label>
        </div>
      </div>

      <div v-if="hasFilters" class="mt-4 flex justify-end">
        <button
          @click="clearFilters"
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors text-sm"
        >
          Limpar Filtros
        </button>
      </div>
    </div>

    <!-- Prompts Grid -->
    <div v-if="promptStore.filteredPrompts.length === 0" class="text-center py-12">
      <DocumentTextIcon class="h-16 w-16 text-gray-600 mx-auto mb-4" />
      <p class="text-gray-400 text-lg">
        {{ hasFilters ? 'Nenhum prompt encontrado com os filtros aplicados' : 'Nenhum prompt encontrado' }}
      </p>
      <p class="text-gray-500 mb-6">
        {{ hasFilters ? 'Tente ajustar os filtros ou criar um novo prompt' : 'Comece criando seu primeiro prompt' }}
      </p>
      <RouterLink
        to="/create"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
      >
        <span>Criar Prompt</span>
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PromptCard
        v-for="prompt in promptStore.filteredPrompts"
        :key="prompt.id"
        :prompt="prompt"
      />
    </div>
  </div>
</template>