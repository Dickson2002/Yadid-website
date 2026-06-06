import { api } from './client'
import type {
  PoemResponse,
  PoemCreatePayload,
  PoemUpdatePayload,
} from './types'

export async function fetchPoems(): Promise<PoemResponse[]> {
  return api.get<PoemResponse[]>('/poems')
}

export async function fetchPoemBySlug(
  slug: string,
): Promise<PoemResponse> {
  return api.get<PoemResponse>(`/poems/${slug}`)
}

export async function fetchPoemById(
  id: string,
): Promise<PoemResponse> {
  return api.get<PoemResponse>(`/poems/id/${id}`)
}

export async function fetchAllPoems(): Promise<PoemResponse[]> {
  return api.get<PoemResponse[]>('/poems/all')
}

export async function createPoem(
  input: PoemCreatePayload,
): Promise<PoemResponse> {
  return api.post<PoemResponse>('/poems', input)
}

export async function updatePoem(
  id: string,
  input: PoemUpdatePayload,
): Promise<PoemResponse> {
  return api.put<PoemResponse>(`/poems/${id}`, input)
}

export async function deletePoem(id: string): Promise<void> {
  return api.delete<void>(`/poems/${id}`)
}

export async function recordPoemView(slug: string): Promise<void> {
  return api.post<void>(`/poems/${slug}/view`, {})
}
