<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePromptStore } from '../stores/promptStore'
import PromptCard from '../components/PromptCard.vue'
import { 
  DocumentTextIcon, 
  HeartIcon, 
  PlusIcon,
  SparklesIcon 
} from '@heroicons/vue/24/outline'

const promptStore = usePromptStore()

onMounted(() => {
  promptStore.loadFromLocalStorage()
})

const stats = computed(() => ({
  total: promptStore.prompts.length,
  favorites: promptStore.favoritePrompts.length,
  categories: [...new Set(promptStore.prompts.map(p => p.category))].length
}))
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">Dashboard</h1>
      <RouterLink
        to="/create"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <PlusIcon class="h-5 w-5" />
        <span>Novo Prompt</span>
      </RouterLink>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center">
          <DocumentTextIcon class="h-8 w-8 text-blue-400" />
          <div class="ml-4">
            <p class="text-sm text-gray-400">Total de Prompts</p>
            <p class="text-2xl font-bold text-white">{{ stats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center">
          <HeartIcon class="h-8 w-8 text-red-400" />
          <div class="ml-4">
            <p class="text-sm text-gray-400">Favoritos</p>
            <p class="text-2xl font-bold text-white">{{ stats.favorites }}</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center">
          <SparklesIcon class="h-8 w-8 text-green-400" />
          <div class="ml-4">
            <p class="text-sm text-gray-400">Categorias</p>
            <p class="text-2xl font-bold text-white">{{ stats.categories }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Prompts -->
    <div>
      <h2 class="text-xl font-semibold text-white mb-4">Prompts Recentes</h2>
      <div v-if="promptStore.recentPrompts.length === 0" class="text-center py-12">
        <SparklesIcon class="h-16 w-16 text-gray-600 mx-auto mb-4" />
        <p class="text-gray-400 text-lg">Nenhum prompt criado ainda</p>
        <p class="text-gray-500 mb-6">Comece criando seu primeiro prompt de IA</p>
        <RouterLink
          to="/create"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
        >
          <PlusIcon class="h-5 w-5" />
          <span>Criar Primeiro Prompt</span>
        </RouterLink>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PromptCard
          v-for="prompt in promptStore.recentPrompts"
          :key="prompt.id"
          :prompt="prompt"
        />
      </div>
    </div>
  </div>
</template>