'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockKategoriBiaya } from '@/lib/mock-data'
import type { KategoriBiaya } from '@/types'

interface KategoriFilters {
  schoolId?: string
  siklus?: KategoriBiaya['siklus']
  isActive?: boolean
}

export function useKategori(filters?: KategoriFilters) {
  return useQuery({
    queryKey: ['kategori', filters],
    queryFn: async () => {
      let data = [...mockKategoriBiaya]
      if (filters?.schoolId && filters.schoolId !== 'all') {
        data = data.filter((k) => k.schoolId === filters.schoolId)
      }
      if (filters?.siklus) {
        data = data.filter((k) => k.siklus === filters.siklus)
      }
      if (filters?.isActive !== undefined) {
        data = data.filter((k) => k.isActive === filters.isActive)
      }
      return data
    },
  })
}

export function useCreateKategori() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<KategoriBiaya>) => {
      return { ...data, id: crypto.randomUUID(), isActive: true } as KategoriBiaya
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kategori'] }),
  })
}

export function useUpdateKategori() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<KategoriBiaya> }) => {
      const existing = mockKategoriBiaya.find((k) => k.id === id)
      return { ...existing, ...data } as KategoriBiaya
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kategori'] }),
  })
}
