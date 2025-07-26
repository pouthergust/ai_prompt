import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import CreatePrompt from '../views/CreatePrompt.vue'
import Library from '../views/Library.vue'
import Settings from '../views/Settings.vue'
import PromptGenerator from '../views/PromptGenerator.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/create',
      name: 'create-prompt',
      component: CreatePrompt
    },
    {
      path: '/library',
      name: 'library',
      component: Library
    },
    {
      path: '/generator',
      name: 'generator',
      component: PromptGenerator
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})

export default router