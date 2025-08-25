<script setup lang="ts">
import { Bars3Icon, MagnifyingGlassIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { usePromptStore } from '../stores/promptStore'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

defineEmits<{
  toggleSidebar: []
}>()

const promptStore = usePromptStore()
const authStore = useAuthStore()
const router = useRouter()
const showUserMenu = ref(false)

const logout = () => {
  authStore.logout()
  router.push('/login')
  showUserMenu.value = false
}
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
        
        <!-- User Menu -->
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <UserIcon class="h-6 w-6" />
            <span class="hidden md:block text-sm">{{ authStore.user?.name }}</span>
          </button>
          
          <!-- Dropdown Menu -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
          >
            <div class="px-4 py-3 border-b border-gray-700">
              <p class="text-sm text-white font-medium">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-400">{{ authStore.user?.email }}</p>
            </div>
            <button
              @click="logout"
              class="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <ArrowRightOnRectangleIcon class="h-4 w-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Overlay para fechar menu -->
    <div
      v-if="showUserMenu"
      @click="showUserMenu = false"
      class="fixed inset-0 z-40"
    ></div>
  </header>
</template>