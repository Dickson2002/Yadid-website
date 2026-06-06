import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchPoems,
  fetchPoemBySlug,
  fetchPoemById,
  fetchAllPoems,
  createPoem,
  updatePoem,
  deletePoem,
} from '@/lib/api/poems'
import type { PoemUpdatePayload } from '@/lib/api/types'

export function usePoems() {
  return useQuery({
    queryKey: ['poems'],
    queryFn: fetchPoems,
  })
}

export function useAllPoems() {
  return useQuery({
    queryKey: ['poems', 'all'],
    queryFn: fetchAllPoems,
  })
}

export function usePoemBySlug(slug: string) {
  return useQuery({
    queryKey: ['poems', slug],
    queryFn: () => fetchPoemBySlug(slug),
    enabled: !!slug,
  })
}

export function usePoemById(id: string) {
  return useQuery({
    queryKey: ['poems', 'id', id],
    queryFn: () => fetchPoemById(id),
    enabled: !!id,
  })
}

export function useCreatePoem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPoem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poems'] })
      queryClient.invalidateQueries({ queryKey: ['poems', 'all'] })
    },
  })
}

export function useUpdatePoem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PoemUpdatePayload }) =>
      updatePoem(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poems'] })
      queryClient.invalidateQueries({ queryKey: ['poems', 'all'] })
    },
  })
}

export function useDeletePoem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePoem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poems'] })
      queryClient.invalidateQueries({ queryKey: ['poems', 'all'] })
    },
  })
}
