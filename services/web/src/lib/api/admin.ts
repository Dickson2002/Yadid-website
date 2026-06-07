import { api } from './client'
import type { ResetResponse, AdminResponse, UpdateAdminPayload } from './types'

export async function getAdminProfile(): Promise<AdminResponse> {
  return api.get<AdminResponse>('/admin/me')
}

export async function resetAllData(): Promise<ResetResponse> {
  return api.post<ResetResponse>('/admin/reset', {})
}

export async function updateSettings(payload: UpdateAdminPayload): Promise<AdminResponse> {
  return api.put<AdminResponse>('/admin/settings', payload)
}
