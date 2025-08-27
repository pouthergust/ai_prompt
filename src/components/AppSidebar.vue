<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { 
  HomeIcon, 
  PlusIcon, 
  BookOpenIcon, 
  CogIcon,
  SparklesIcon,
  CpuChipIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

defineProps<{
  open: boolean
}>()

defineEmits<{
  close: []
}>()

const navItems = [
  { name: 'Dashboard', to: '/', icon: HomeIcon },
  { name: 'Criar Prompt', to: '/create', icon: PlusIcon },
  { name: 'Biblioteca', to: '/library', icon: BookOpenIcon },
  { name: 'Gerador', to: '/generator', icon: SparklesIcon },
  { name: 'IAs Recomendadas', to: '/ai-recommendations', icon: CpuChipIcon },
  { name: 'Configurações', to: '/settings', icon: CogIcon }
]
</script>

<template>
  <!-- Mobile overlay -->
  <div 
    v-if="open"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    @click="$emit('close')"
  ></div>

  <!-- Sidebar -->
  <aside 
    class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex items-center justify-between p-4 border-b border-gray-700 lg:hidden">
      <h2 class="text-lg font-semibold text-white">Menu</h2>
      <button 
        @click="$emit('close')"
        class="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
      >
        <XMarkIcon class="h-6 w-6" />
      </button>
    </div>

    <nav class="mt-6">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        class="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        active-class="bg-gray-700 text-white border-r-4 border-blue-500"
        @click="$emit('close')"
      >
        <component :is="item.icon" class="h-5 w-5 mr-3" />
        {{ item.name }}
      </RouterLink>
    </nav>
  </aside>
</template>