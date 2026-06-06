import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCollections,
  fetchCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} from '@/lib/api/collections'
import type {
  CollectionCreatePayload,
  CollectionUpdatePayload,
} from '@/lib/api/types'

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
  })
}

export function useCollectionBySlug(slug: string) {
  return useQuery({
    queryKey: ['collections', slug],
    queryFn: () => fetchCollectionBySlug(slug),
    enabled: !!slug,
  })
}

export function useCreateCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CollectionCreatePayload) => createCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useUpdateCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CollectionUpdatePayload }) =>
      updateCollection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}

export function useDeleteCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}
