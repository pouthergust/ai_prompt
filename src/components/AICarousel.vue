<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useAIRecommendationStore, type AITool } from '../stores/aiRecommendationStore'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const aiStore = useAIRecommendationStore()
const carouselRef = ref<HTMLElement>()
const currentIndex = ref(0)
const itemsPerView = ref(4)
const autoplayInterval = ref<NodeJS.Timeout>()

// Responsive items per view
const updateItemsPerView = () => {
  const width = window.innerWidth
  if (width < 640) {
    itemsPerView.value = 1
  } else if (width < 768) {
    itemsPerView.value = 2
  } else if (width < 1024) {
    itemsPerView.value = 3
  } else {
    itemsPerView.value = 4
  }
}

const maxIndex = computed(() => {
  return Math.max(0, aiStore.aiTools.length - itemsPerView.value)
})

const nextSlide = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = maxIndex.value
  }
}

const goToSlide = (index: number) => {
  currentIndex.value = Math.min(index, maxIndex.value)
}

const startAutoplay = () => {
  autoplayInterval.value = setInterval(() => {
    nextSlide()
  }, 4000)
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
}

onMounted(() => {
  updateItemsPerView()
  window.addEventListener('resize', updateItemsPerView)
  startAutoplay()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerView)
  stopAutoplay()
})

const openAI = (ai: AITool) => {
  window.open(ai.website, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div 
    class="relative"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <!-- Carousel Container -->
    <div class="overflow-hidden rounded-lg">
      <div 
        ref="carouselRef"
        class="flex transition-transform duration-300 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }"
      >
        <div
          v-for="ai in aiStore.aiTools"
          :key="ai.id"
          class="flex-shrink-0 px-2"
          :style="{ width: `${100 / itemsPerView}%` }"
        >
          <div
            @click="openAI(ai)"
            class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div class="flex flex-col items-center text-center space-y-3">
              <!-- Logo -->
              <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                <img
                  :src="ai.logo"
                  :alt="ai.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              
              <!-- Name -->
              <h3 class="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
                {{ ai.name }}
              </h3>
              
              <!-- Category -->
              <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs group-hover:bg-gray-600 transition-colors">
                {{ ai.category }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button
      v-if="aiStore.aiTools.length > itemsPerView"
      @click="prevSlide"
      class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-colors z-10"
    >
      <ChevronLeftIcon class="h-5 w-5" />
    </button>

    <button
      v-if="aiStore.aiTools.length > itemsPerView"
      @click="nextSlide"
      class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-colors z-10"
    >
      <ChevronRightIcon class="h-5 w-5" />
    </button>

    <!-- Dots Indicator -->
    <div 
      v-if="aiStore.aiTools.length > itemsPerView"
      class="flex justify-center space-x-2 mt-4"
    >
      <button
        v-for="(_, index) in Math.ceil(aiStore.aiTools.length / itemsPerView)"
        :key="index"
        @click="goToSlide(index)"
        class="w-2 h-2 rounded-full transition-colors"
        :class="Math.floor(currentIndex / itemsPerView) === index ? 'bg-blue-400' : 'bg-gray-600 hover:bg-gray-500'"
      />
    </div>
  </div>
</template>