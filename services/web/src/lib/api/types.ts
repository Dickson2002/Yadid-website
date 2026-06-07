export interface PoemResponse {
  id: string
  title: string
  slug: string
  author: string
  excerpt: string
  content: string
  date: string
  tags: string[]
  collection_id: string | null
  status: 'published' | 'draft'
  views: number
  image: string | null
  created_at: string
  updated_at: string
}

export interface PoemCreatePayload {
  title: string
  slug: string
  author: string
  excerpt: string
  content: string
  date: string
  tags?: string[]
  collection_id?: string | null
  status?: string
  image?: string | null
}

export interface PoemUpdatePayload {
  title?: string
  slug?: string
  author?: string
  excerpt?: string
  content?: string
  date?: string
  tags?: string[]
  collection_id?: string | null
  status?: string
  image?: string | null
}

export interface CollectionCreatePayload {
  title: string
  slug: string
  description: string
  cover_image?: string | null
}

export interface CollectionUpdatePayload {
  title?: string
  slug?: string
  description?: string
  cover_image?: string | null
}

export interface CollectionResponse {
  id: string
  title: string
  slug: string
  description: string
  cover_image: string | null
  poem_count: number
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface AdminResponse {
  id: string
  username: string
  display_name: string
  email: string
  created_at: string
}

export interface DashboardStats {
  total_poems: number
  published: number
  drafts: number
  total_views: number
  subscribers: number
  views_change: number
}

export interface Manuscript {
  id: string
  title: string
  last_edited: string
  status: string
  icon: string
}

export interface Activity {
  id: string
  timestamp: string
  message: string
  type: string
}

export interface MonthlyGrowth {
  month: string
  count: number
}

export interface SubscriberResponse {
  id: string
  email: string
  created_at: string
}

export interface ResetResponse {
  ok: boolean
}

export interface UpdateAdminPayload {
  current_password: string
  username?: string
  password?: string
}


