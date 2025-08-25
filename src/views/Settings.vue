<script setup lang="ts">
// import { ref } from 'vue'
import { usePromptStore } from '../stores/promptStore'
import { 
  CogIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon
} from '@heroicons/vue/24/outline'

const promptStore = usePromptStore()

const exportData = () => {
  const data = {
    prompts: promptStore.prompts,
    categories: promptStore.categories,
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-prompts-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const importData = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.prompts && Array.isArray(data.prompts)) {
          // Merge with existing prompts
          data.prompts.forEach((prompt: any) => {
            promptStore.addPrompt({
              title: prompt.title,
              content: prompt.content,
              category: prompt.category || 'Outros',
              tags: prompt.tags || [],
              isFavorite: prompt.isFavorite || false
            })
          })
          alert('Dados importados com sucesso!')
        }
      } catch (error) {
        alert('Erro ao importar dados. Verifique o formato do arquivo.')
      }
    }
    reader.readAsText(file)
  }
}

const clearAllData = () => {
  if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
    localStorage.removeItem('ai-prompts')
    promptStore.prompts.splice(0)
    alert('Todos os dados foram apagados.')
  }
}

const stats = {
  totalPrompts: promptStore.prompts.length,
  totalCategories: [...new Set(promptStore.prompts.map(p => p.category))].length,
  totalTags: [...new Set(promptStore.prompts.flatMap(p => p.tags))].length,
  favoritePrompts: promptStore.prompts.filter(p => p.isFavorite).length
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center space-x-3">
      <CogIcon class="h-8 w-8 text-blue-400" />
      <div>
        <h1 class="text-2xl font-bold text-white">Configurações</h1>
        <p class="text-gray-400">Gerencie suas configurações e dados</p>
      </div>
    </div>

    <!-- Statistics -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 class="text-lg font-semibold text-white mb-4">Estatísticas</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-400">{{ stats.totalPrompts }}</div>
          <div class="text-sm text-gray-400">Prompts</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-400">{{ stats.totalCategories }}</div>
          <div class="text-sm text-gray-400">Categorias</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-400">{{ stats.totalTags }}</div>
          <div class="text-sm text-gray-400">Tags</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-red-400">{{ stats.favoritePrompts }}</div>
          <div class="text-sm text-gray-400">Favoritos</div>
        </div>
      </div>
    </div>

    <!-- Data Management -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 class="text-lg font-semibold text-white mb-4">Gerenciamento de Dados</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
          <div>
            <h3 class="font-medium text-white">Exportar Dados</h3>
            <p class="text-sm text-gray-400">Faça backup dos seus prompts em formato JSON</p>
          </div>
          <button
            @click="exportData"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <DocumentArrowDownIcon class="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
          <div>
            <h3 class="font-medium text-white">Importar Dados</h3>
            <p class="text-sm text-gray-400">Importe prompts de um arquivo JSON</p>
          </div>
          <label class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2 cursor-pointer">
            <DocumentArrowUpIcon class="h-4 w-4" />
            <span>Importar</span>
            <input
              type="file"
              accept=".json"
              @change="importData"
              class="hidden"
            />
          </label>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-red-600">
          <div>
            <h3 class="font-medium text-white">Limpar Todos os Dados</h3>
            <p class="text-sm text-gray-400">Remove todos os prompts salvos permanentemente</p>
          </div>
          <button
            @click="clearAllData"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <TrashIcon class="h-4 w-4" />
            <span>Limpar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- About -->
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 class="text-lg font-semibold text-white mb-4">Sobre</h2>
      <div class="space-y-2 text-gray-400">
        <p><strong class="text-white">AI Prompt Manager</strong> - Versão 1.0.0</p>
        <p>Aplicação para gerenciamento de prompts de IA desenvolvida com Vue 3</p>
        <p>Armazenamento local utilizando localStorage do navegador</p>
        <p>Desenvolvido com Vue 3, Pinia, Vue Router e Tailwind CSS</p>
      </div>
    </div>
  </div>
</template>