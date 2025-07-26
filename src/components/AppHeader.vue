<script setup lang="ts">
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { usePromptStore } from '../stores/promptStore'

defineEmits<{
  toggleSidebar: []
}>()

const promptStore = usePromptStore()
</script>

<template>
  <header class="bg-gray-800 border-b border-gray-700 px-4 py-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button 
          @click="$emit('toggleSidebar')"
          class="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <Bars3Icon class="h-6 w-6" />
        </button>
        <h1 class="text-xl font-bold text-white">AI Prompt Manager</h1>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            v-model="promptStore.filters.search"
            type="text"
            placeholder="Buscar prompts..."
            class="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  </header>
</template>