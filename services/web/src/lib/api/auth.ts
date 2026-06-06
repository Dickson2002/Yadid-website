import { api } from './client'
import type {
  LoginResponse,
  AdminResponse,
} from './types'

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  return api.post<LoginResponse>('/admin/login', { username, password })
}

export async function refreshToken(
  refresh_token: string,
): Promise<LoginResponse> {
  return api.post<LoginResponse>('/admin/refresh', { refresh_token })
}

export async function getCurrentAdmin(): Promise<AdminResponse> {
  return api.get<AdminResponse>('/admin/me')
}
