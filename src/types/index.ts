// ===== AUTH TYPES =====
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    createdAt: string
  }
  access_token: string
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface UserProfile {
  id: string
  email: string
  name: string
  createdAt: string
}

// ===== PROMPT TYPES =====
export interface ApiPrompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  is_favorite: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export interface Prompt {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreatePromptData {
  title: string
  content: string
  category: string
  tags: string[]
}

export interface UpdatePromptData {
  title?: string
  content?: string
  category?: string
  tags?: string[]
}

export interface PromptListResponse {
  data: ApiPrompt[]
  total: number
  page: number
  limit: number
}

export interface PromptFilter {
  search: string
  category: string
  showFavorites: boolean
  sortBy: 'createdAt' | 'updatedAt' | 'title'
  sortOrder: 'asc' | 'desc'
}

// ===== API TYPES =====
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

// ===== AI RECOMMENDATION TYPES =====
export interface AITool {
  id: string
  name: string
  description: string
  category: string
  website: string
  logo: string
  features: string[]
  pricing: 'free' | 'freemium' | 'paid'
  bestFor: string[]
  rating: number
  isPopular: boolean
}