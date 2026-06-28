'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockAssets } from '@/lib/mock-data'
import type { Asset } from '@/types'

interface InventarisFilters {
  schoolId?: string
  category?: string
  status?: 'active' | 'disposed'
  depreciationMethod?: Asset['depreciationMethod']
}

export function useInventaris(filters?: InventarisFilters) {
  return useQuery({
    queryKey: ['inventaris', filters],
    queryFn: async () => {
      let data = [...mockAssets]
      if (filters?.schoolId && filters.schoolId !== 'all') {
        data = data.filter((a) => a.schoolId === filters.schoolId)
      }
      if (filters?.category) {
        data = data.filter((a) => a.category === filters.category)
      }
      if (filters?.status) {
        data = data.filter((a) => a.status === filters.status)
      }
      if (filters?.depreciationMethod) {
        data = data.filter((a) => a.depreciationMethod === filters.depreciationMethod)
      }
      return data.sort((a, b) => a.assetCode.localeCompare(b.assetCode))
    },
  })
}

export function useInventarisById(id: string | null) {
  return useQuery({
    queryKey: ['inventaris', id],
    queryFn: async () => {
      return mockAssets.find((a) => a.id === id) ?? null
    },
    enabled: !!id,
  })
}

export function useInventarisStats(schoolId?: string) {
  return useQuery({
    queryKey: ['inventaris-stats', schoolId],
    queryFn: async () => {
      let data = [...mockAssets]
      if (schoolId && schoolId !== 'all') {
        data = data.filter((a) => a.schoolId === schoolId)
      }
      const active = data.filter((a) => a.status === 'active')
      return {
        totalAssets: data.length,
        activeAssets: active.length,
        disposedAssets: data.filter((a) => a.status === 'disposed').length,
        totalAcquisitionCost: data.reduce((sum, a) => sum + a.acquisitionCost, 0),
        totalBookValue: active.reduce((sum, a) => sum + a.bookValue, 0),
        totalDepreciation: data.reduce(
          (sum, a) => sum + (a.acquisitionCost - a.bookValue - a.residualValue),
          0
        ),
        categories: [...new Set(data.map((a) => a.category))],
      }
    },
  })
}

export function useCreateInventaris() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Asset>) => {
      return { ...data, id: crypto.randomUUID(), status: 'active' as const } as Asset
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inventaris'] }),
  })
}

export function useUpdateInventaris() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Asset> }) => {
      const existing = mockAssets.find((a) => a.id === id)
      return { ...existing, ...data } as Asset
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventaris'] })
      qc.invalidateQueries({ queryKey: ['inventaris-stats'] })
    },
  })
}

export function useDisposeInventaris() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const existing = mockAssets.find((a) => a.id === id)
      return { ...existing, status: 'disposed' as const, bookValue: 0 }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventaris'] })
      qc.invalidateQueries({ queryKey: ['inventaris-stats'] })
    },
  })
}
