import { api } from './client'
import type {
  CollectionResponse,
  CollectionCreatePayload,
  CollectionUpdatePayload,
} from './types'

export async function fetchCollections(): Promise<CollectionResponse[]> {
  return api.get<CollectionResponse[]>('/collections')
}

export async function fetchCollectionBySlug(
  slug: string,
): Promise<CollectionResponse> {
  return api.get<CollectionResponse>(`/collections/${slug}`)
}

export async function createCollection(
  data: CollectionCreatePayload,
): Promise<CollectionResponse> {
  return api.post<CollectionResponse>('/collections', data)
}

export async function updateCollection(
  id: string,
  data: CollectionUpdatePayload,
): Promise<CollectionResponse> {
  return api.put<CollectionResponse>(`/collections/${id}`, data)
}

export async function deleteCollection(id: string): Promise<void> {
  return api.delete(`/collections/${id}`)
}
