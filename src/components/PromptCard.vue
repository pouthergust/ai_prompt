<script setup lang="ts">
import { ref } from 'vue'
import { 
  HeartIcon, 
  DocumentDuplicateIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid'
import { usePromptStore, type Prompt } from '../stores/promptStore'
import { useAIRecommendationStore } from '../stores/aiRecommendationStore'
import AIRecommendationCard from './AIRecommendationCard.vue'

const props = defineProps<{
  prompt: Prompt
}>()

const promptStore = usePromptStore()
const aiStore = useAIRecommendationStore()
const isEditing = ref(false)
const showRecommendations = ref(false)
const editForm = ref({
  title: props.prompt.title,
  content: props.prompt.content,
  category: props.prompt.category,
  tags: props.prompt.tags.join(', ')
})

const startEdit = () => {
  isEditing.value = true
  editForm.value = {
    title: props.prompt.title,
    content: props.prompt.content,
    category: props.prompt.category,
    tags: props.prompt.tags.join(', ')
  }
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveEdit = () => {
  promptStore.updatePrompt(props.prompt.id, {
    title: editForm.value.title,
    content: editForm.value.content,
    category: editForm.value.category,
    tags: editForm.value.tags.split(',').map(tag => tag.trim()).filter(Boolean)
  })
  isEditing.value = false
}

const copyPrompt = async () => {
  const success = await promptStore.copyToClipboard(props.prompt.content)
  if (success) {
    // Você pode adicionar uma notificação aqui
    console.log('Prompt copiado!')
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getRecommendations = () => {
  return aiStore.getRecommendationsForPrompt(props.prompt.category)
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
    <div v-if="!isEditing">
      <div class="flex items-start justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">{{ prompt.title }}</h3>
        <div class="flex space-x-2">
          <button
            @click="promptStore.toggleFavorite(prompt.id)"
            class="p-2 rounded-lg transition-colors"
            :class="prompt.isFavorite ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-red-400'"
          >
            <HeartIconSolid v-if="prompt.isFavorite" class="h-5 w-5" />
            <HeartIcon v-else class="h-5 w-5" />
          </button>
          <button
            @click="copyPrompt"
            class="p-2 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
          >
            <DocumentDuplicateIcon class="h-5 w-5" />
          </button>
          <button
            @click="startEdit"
            class="p-2 rounded-lg text-gray-400 hover:text-green-400 transition-colors"
          >
            <PencilIcon class="h-5 w-5" />
          </button>
          <button
            @click="promptStore.deletePrompt(prompt.id)"
            class="p-2 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <p class="text-gray-300 mb-4 line-clamp-3">{{ prompt.content }}</p>

      <div class="flex flex-wrap gap-2 mb-4">
        <span class="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm">
          {{ prompt.category }}
        </span>
        <span 
          v-for="tag in prompt.tags" 
          :key="tag"
          class="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
        >
          {{ tag }}
        </span>
      </div>

      <div class="text-sm text-gray-400">
        Criado em {{ formatDate(prompt.createdAt) }}
        <span v-if="prompt.updatedAt > prompt.createdAt">
          • Editado em {{ formatDate(prompt.updatedAt) }}
        </span>
      </div>

      <!-- AI Recommendations Toggle -->
      <div class="mt-4 pt-4 border-t border-gray-700">
        <button
          @click="showRecommendations = !showRecommendations"
          class="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
        >
          <span>{{ showRecommendations ? 'Ocultar' : 'Ver' }} IAs recomendadas</span>
        </button>
        
        <div v-if="showRecommendations" class="mt-3 space-y-2">
          <h5 class="text-sm font-medium text-gray-300">IAs ideais para esta categoria:</h5>
          <AIRecommendationCard
            v-for="ai in getRecommendations()"
            :key="ai.id"
            :ai="ai"
            :compact="true"
          />
        </div>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">Título</label>
        <input
          v-model="editForm.title"
          type="text"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">Conteúdo</label>
        <textarea
          v-model="editForm.content"
          rows="4"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Categoria</label>
          <select
            v-model="editForm.category"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="category in promptStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Tags</label>
          <input
            v-model="editForm.tags"
            type="text"
            placeholder="tag1, tag2, tag3"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="cancelEdit"
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors flex items-center"
        >
          <XMarkIcon class="h-4 w-4 mr-1" />
          Cancelar
        </button>
        <button
          @click="saveEdit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors flex items-center"
        >
          <CheckIcon class="h-4 w-4 mr-1" />
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>