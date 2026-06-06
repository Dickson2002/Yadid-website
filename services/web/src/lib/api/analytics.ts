import { api } from './client'
import { useAuthStore } from '@/lib/auth-store'
import type {
  DashboardStats,
  Manuscript,
  Activity,
  MonthlyGrowth,
} from './types'

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return api.get<DashboardStats>('/analytics/stats')
}

export async function fetchActiveManuscripts(): Promise<Manuscript[]> {
  return api.get<Manuscript[]>('/analytics/manuscripts')
}

export async function fetchActivityFeed(): Promise<Activity[]> {
  return api.get<Activity[]>('/analytics/activity')
}

export async function fetchMonthlyGrowth(): Promise<MonthlyGrowth[]> {
  return api.get<MonthlyGrowth[]>('/analytics/growth')
}

export async function exportLedger(format: 'csv' | 'json' = 'csv'): Promise<string> {
  const token = useAuthStore.getState().accessToken
  const res = await fetch(`http://localhost:8000/api/analytics/export?format=${format}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Export failed')
  if (format === 'json') {
    const data = await res.json()
    return JSON.stringify(data, null, 2)
  }
  return res.text()
}
