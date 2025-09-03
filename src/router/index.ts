import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useClerk, useUser } from '@clerk/vue'
import Dashboard from '../views/Dashboard.vue'
import CreatePrompt from '../views/CreatePrompt.vue'
import Library from '../views/Library.vue'
import Settings from '../views/Settings.vue'
import PromptGenerator from '../views/PromptGenerator.vue'
import Login from '../views/Login.vue'
import AIRecommendations from '../views/AIRecommendations.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/create',
      name: 'create-prompt',
      component: CreatePrompt,
      meta: { requiresAuth: true }
    },
    {
      path: '/library',
      name: 'library',
      component: Library,
      meta: { requiresAuth: true }
    },
    {
      path: '/generator',
      name: 'generator',
      component: PromptGenerator,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { requiresAuth: true }
    },
    {
      path: '/ai-recommendations',
      name: 'ai-recommendations',
      component: AIRecommendations,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const { isSignedIn, isLoaded } = useUser()
  
  // Esperar até que o Clerk carregue
  if (!isLoaded.value) {
    // Aguardar até que o Clerk termine de carregar
    await new Promise<void>((resolve) => {
      const checkLoaded = () => {
        if (isLoaded.value) {
          resolve()
        } else {
          setTimeout(checkLoaded, 50)
        }
      }
      checkLoaded()
    })
  }
  
  // Atualizar o usuário local com dados do Clerk
  authStore.updateUserFromClerk()
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  if (requiresAuth && !isSignedIn.value) {
    next('/login')
  } else if (requiresGuest && isSignedIn.value) {
    next('/')
  } else {
    next()
  }
})

export default router