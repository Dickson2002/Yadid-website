import { api } from './client'
import type { ResetResponse } from './types'

export async function resetAllData(): Promise<ResetResponse> {
  return api.post<ResetResponse>('/admin/reset', {})
}
