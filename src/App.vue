<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import { ref } from 'vue'

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <AppHeader @toggle-sidebar="toggleSidebar" />
    <div class="flex">
      <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
      <main class="flex-1 p-6 lg:ml-64">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style>
/* Global styles já aplicados no style.css */
</style>