<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'

const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const isLoginPage = computed(() => route.name === 'login')

onMounted(() => {
  authStore.loadFromStorage()
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <!-- Login page layout -->
    <div v-if="isLoginPage">
      <RouterView />
    </div>
    
    <!-- Main app layout -->
    <div v-else>
      <AppHeader @toggle-sidebar="toggleSidebar" />
      <div class="flex">
        <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
        <main class="flex-1 p-6 lg:ml-64">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>

<style>
/* Global styles já aplicados no style.css */
</style>