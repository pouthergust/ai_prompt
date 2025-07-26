<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePromptStore } from '../stores/promptStore'
import { PlusIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const promptStore = usePromptStore()

const form = ref({
  title: '',
  content: '',
  category: '',
  tags: '',
  isFavorite: false
})

const isSubmitting = ref(false)

const submitForm = async () => {
  if (!form.value.title || !form.value.content || !form.value.category) {
    alert('Por favor, preencha todos os campos obrigatórios.')
    return
  }

  isSubmitting.value = true

  try {
    promptStore.addPrompt({
      title: form.value.title,
      content: form.value.content,
      category: form.value.category,
      tags: form.value.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isFavorite: form.value.isFavorite
    })

    router.push('/library')
  } catch (error) {
    console.error('Erro ao criar prompt:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    title: '',
    content: '',
    category: '',
    tags: '',
    isFavorite: false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white mb-2">Criar Novo Prompt</h1>
      <p class="text-gray-400">Crie um novo prompt de IA para sua coleção</p>
    </div>

    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <form @submit.prevent="submitForm" class="space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-300 mb-2">
            Título *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite o título do prompt"
          />
        </div>

        <div>
          <label for="content" class="block text-sm font-medium text-gray-300 mb-2">
            Conteúdo do Prompt *
          </label>
          <textarea
            id="content"
            v-model="form.content"
            rows="8"
            required
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite o conteúdo do prompt..."
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="category" class="block text-sm font-medium text-gray-300 mb-2">
              Categoria *
            </label>
            <select
              id="category"
              v-model="form.category"
              required
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione uma categoria</option>
              <option v-for="category in promptStore.categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div>
            <label for="tags" class="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <input
              id="tags"
              v-model="form.tags"
              type="text"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tag1, tag2, tag3"
            />
            <p class="text-sm text-gray-400 mt-1">Separe as tags com vírgula</p>
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="favorite"
            v-model="form.isFavorite"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
          />
          <label for="favorite" class="ml-2 block text-sm text-gray-300">
            Marcar como favorito
          </label>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Limpar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <PlusIcon class="h-5 w-5" />
            <span>{{ isSubmitting ? 'Salvando...' : 'Criar Prompt' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>