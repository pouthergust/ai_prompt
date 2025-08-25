<script setup lang="ts">
import { ref } from 'vue'
import { usePromptStore } from '../stores/promptStore'
import { useRouter } from 'vue-router'
import { 
  SparklesIcon, 
  DocumentDuplicateIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

const promptStore = usePromptStore()
const router = useRouter()

const selectedTemplate = ref('')
const variables = ref<Record<string, string>>({})
const generatedPrompt = ref('')

const generatePrompt = () => {
  const template = promptStore.templates.find(t => t.id === selectedTemplate.value)
  if (template) {
    generatedPrompt.value = promptStore.generatePrompt(template.content, variables.value)
  }
}

const copyGenerated = async () => {
  const success = await promptStore.copyToClipboard(generatedPrompt.value)
  if (success) {
    console.log('Prompt copiado!')
  }
}

const saveGenerated = () => {
  if (generatedPrompt.value) {
    const template = promptStore.templates.find(t => t.id === selectedTemplate.value)
    promptStore.addPrompt({
      title: `${template?.name || 'Prompt'} - ${new Date().toLocaleDateString()}`,
      content: generatedPrompt.value,
      category: 'Gerado',
      tags: ['gerado', 'template'],
      isFavorite: false
    })
    router.push('/library')
  }
}

const extractVariables = (content: string) => {
  const regex = /\[([^\]]+)\]/g
  const matches = content.match(regex)
  if (matches) {
    return matches.map(match => match.replace(/[\[\]]/g, ''))
  }
  return []
}

const onTemplateChange = () => {
  const template = promptStore.templates.find(t => t.id === selectedTemplate.value)
  if (template) {
    const vars = extractVariables(template.content)
    variables.value = {}
    vars.forEach(variable => {
      variables.value[variable] = ''
    })
  }
  generatedPrompt.value = ''
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center space-x-3">
      <SparklesIcon class="h-8 w-8 text-blue-400" />
      <div>
        <h1 class="text-2xl font-bold text-white">Gerador de Prompts</h1>
        <p class="text-gray-400">Crie prompts personalizados usando templates</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Template Selection -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 class="text-lg font-semibold text-white mb-4">Selecionar Template</h2>
        
        <div class="space-y-4">
          <div v-for="template in promptStore.templates" :key="template.id">
            <label class="flex items-start space-x-3 cursor-pointer">
              <input
                v-model="selectedTemplate"
                :value="template.id"
                type="radio"
                @change="onTemplateChange"
                class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700"
              />
              <div class="flex-1">
                <div class="font-medium text-white">{{ template.name }}</div>
                <div class="text-sm text-gray-400">{{ template.description }}</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Variables Input -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 class="text-lg font-semibold text-white mb-4">Variáveis</h2>
        
        <div v-if="!selectedTemplate" class="text-center text-gray-400 py-8">
          Selecione um template para ver as variáveis
        </div>
        
        <div v-else-if="Object.keys(variables).length === 0" class="text-center text-gray-400 py-8">
          Este template não possui variáveis
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="(_value, key) in variables" :key="key">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              {{ key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() }}
            </label>
            <input
              v-model="variables[key]"
              type="text"
              :placeholder="`Digite ${key.toLowerCase()}`"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            @click="generatePrompt"
            :disabled="!selectedTemplate || Object.values(variables).some(v => !v.trim())"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <SparklesIcon class="h-5 w-5" />
            <span>Gerar Prompt</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Generated Prompt -->
    <div v-if="generatedPrompt" class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-white">Prompt Gerado</h2>
        <div class="flex space-x-2">
          <button
            @click="copyGenerated"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors flex items-center space-x-2"
          >
            <DocumentDuplicateIcon class="h-4 w-4" />
            <span>Copiar</span>
          </button>
          <button
            @click="saveGenerated"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon class="h-4 w-4" />
            <span>Salvar</span>
          </button>
        </div>
      </div>
      
      <div class="bg-gray-700 rounded-md p-4 border border-gray-600">
        <pre class="text-gray-100 whitespace-pre-wrap">{{ generatedPrompt }}</pre>
      </div>
    </div>
  </div>
</template>