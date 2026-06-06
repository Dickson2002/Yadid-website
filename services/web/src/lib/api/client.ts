import { useAuthStore } from '@/lib/auth-store'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

let refreshPromise: Promise<boolean> | null = null

export class ApiError extends Error {
  status: number
  detail: unknown

  constructor(status: number, detail: unknown) {
    super(typeof detail === 'string' ? detail : `Request failed: ${status}`)
    this.status = status
    this.detail = detail
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().accessToken
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

async function tryRefresh(): Promise<boolean> {
  const state = useAuthStore.getState()
  const rt = state.refreshToken
  if (!rt) return false

  try {
    const res = await fetch(`${BASE_URL}/admin/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: rt }),
    })
    if (!res.ok) return false
    const data = await res.json()
    state.setTokens(data.access_token, data.refresh_token)
    return true
  } catch {
    return false
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const authHeaders = getAuthHeaders()
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options?.headers as Record<string, string>),
    },
    ...options,
  })

  if (res.status === 401 && !path.includes('/admin/refresh')) {
    if (!refreshPromise) {
      refreshPromise = tryRefresh().finally(() => {
        refreshPromise = null
      })
    }
    const refreshed = await refreshPromise
    if (refreshed) {
      const authHeaders2 = getAuthHeaders()
      const retryRes = await fetch(`${BASE_URL}${path}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders2,
          ...(options?.headers as Record<string, string>),
        },
        ...options,
      })
      if (retryRes.ok) {
        if (retryRes.status === 204) return undefined as T
        return retryRes.json()
      }
      if (retryRes.status !== 401) {
        let detail: unknown
        try {
          const body = await retryRes.json()
          detail = body.detail ?? body
        } catch {
          detail = `Request failed: ${retryRes.status}`
        }
        throw new ApiError(retryRes.status, detail)
      }
    }
    useAuthStore.getState().logout()
    let detail: unknown
    try {
      const body = await res.clone().json()
      detail = body.detail ?? body
    } catch {
      detail = 'Session expired'
    }
    throw new ApiError(401, detail)
  }

  if (!res.ok) {
    let detail: unknown
    try {
      const body = await res.json()
      detail = body.detail ?? body
    } catch {
      detail = `Request failed: ${res.status}`
    }
    throw new ApiError(res.status, detail)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
