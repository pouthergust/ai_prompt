<script setup lang="ts">
import { useAIRecommendationStore, type AITool } from '../stores/aiRecommendationStore'
import { 
  ArrowTopRightOnSquareIcon,
  StarIcon
} from '@heroicons/vue/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid'

defineProps<{
  ai: AITool
  compact?: boolean
}>()

const renderStars = (rating: number) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    stars.push('full')
  }

  if (hasHalfStar) {
    stars.push('half')
  }

  while (stars.length < 5) {
    stars.push('empty')
  }

  return stars
}
</script>

<template>
  <div class="bg-gray-700 rounded-lg p-4 border border-gray-600">
    <div class="flex items-start space-x-3">
      <img
        :src="ai.logo"
        :alt="ai.name"
        class="w-10 h-10 rounded-lg object-cover flex-shrink-0"
      />
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-white font-medium truncate">{{ ai.name }}</h4>
          <div class="flex items-center space-x-1">
            <template v-for="(star, index) in renderStars(ai.rating)" :key="index">
              <StarIconSolid v-if="star === 'full'" class="h-3 w-3 text-yellow-400" />
              <StarIcon v-else class="h-3 w-3 text-gray-600" />
            </template>
          </div>
        </div>
        
        <p v-if="!compact" class="text-gray-300 text-sm mb-3 line-clamp-2">{{ ai.description }}</p>
        
        <div class="flex flex-wrap gap-1 mb-3">
          <span
            v-for="feature in ai.features.slice(0, 2)"
            :key="feature"
            class="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs"
          >
            {{ feature }}
          </span>
        </div>
        
        <a
          :href="ai.website"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          <span>Acessar</span>
          <ArrowTopRightOnSquareIcon class="h-3 w-3" />
        </a>
      </div>
    </div>
  </div>
</template>