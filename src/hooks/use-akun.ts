'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockAkun } from '@/lib/mock-data'
import type { Akun, TipeAkun } from '@/types'

interface AkunFilters {
  type?: TipeAkun
  isActive?: boolean
  parentId?: string | null
}

export function useAkun(filters?: AkunFilters) {
  return useQuery({
    queryKey: ['akun', filters],
    queryFn: async () => {
      let data = [...mockAkun]
      if (filters?.type) {
        data = data.filter((a) => a.type === filters.type)
      }
      if (filters?.isActive !== undefined) {
        data = data.filter((a) => a.isActive === filters.isActive)
      }
      if (filters?.parentId !== undefined) {
        if (filters.parentId === null) {
          data = data.filter((a) => !a.parentId)
        } else {
          data = data.filter((a) => a.parentId === filters.parentId)
        }
      }
      return data.sort((a, b) => a.code.localeCompare(b.code))
    },
  })
}

export function useAkunById(id: string | null) {
  return useQuery({
    queryKey: ['akun', id],
    queryFn: async () => {
      return mockAkun.find((a) => a.id === id) ?? null
    },
    enabled: !!id,
  })
}

export function useAkunByCode(code: string | null) {
  return useQuery({
    queryKey: ['akun-by-code', code],
    queryFn: async () => {
      return mockAkun.find((a) => a.code === code) ?? null
    },
    enabled: !!code,
  })
}

export function useCoA() {
  return useQuery({
    queryKey: ['coa'],
    queryFn: async () => {
      const roots = mockAkun.filter((a) => !a.parentId)
      const buildTree = (parentId: string | undefined): Akun[] => {
        return mockAkun
          .filter((a) => a.parentId === parentId)
          .sort((a, b) => a.code.localeCompare(b.code))
      }
      return roots.map((root) => ({
        ...root,
        children: buildTree(root.id),
      }))
    },
  })
}

export function useCreateAkun() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Akun>) => {
      return { ...data, id: crypto.randomUUID(), isActive: true } as Akun
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['akun'] })
      qc.invalidateQueries({ queryKey: ['coa'] })
    },
  })
}

export function useUpdateAkun() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Akun> }) => {
      const existing = mockAkun.find((a) => a.id === id)
      return { ...existing, ...data } as Akun
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['akun'] })
      qc.invalidateQueries({ queryKey: ['coa'] })
    },
  })
}
