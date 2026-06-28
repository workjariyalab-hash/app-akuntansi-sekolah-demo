'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockSiswa } from '@/lib/mock-data'
import type { Siswa } from '@/types'

interface SiswaFilters {
  schoolId?: string
  status?: string
  kelas?: string
  jenjang?: string
}

export function useSiswa(filters?: SiswaFilters) {
  return useQuery({
    queryKey: ['siswa', filters],
    queryFn: async () => {
      let data = [...mockSiswa]
      if (filters?.schoolId && filters.schoolId !== 'all') {
        data = data.filter((s) => s.schoolId === filters.schoolId)
      }
      if (filters?.status) {
        data = data.filter((s) => s.status === filters.status)
      }
      if (filters?.kelas) {
        data = data.filter((s) => s.kelas === filters.kelas)
      }
      if (filters?.jenjang) {
        data = data.filter((s) => s.jenjang === filters.jenjang)
      }
      return data
    },
  })
}

export function useSiswaById(id: string | null) {
  return useQuery({
    queryKey: ['siswa', id],
    queryFn: async () => {
      return mockSiswa.find((s) => s.id === id) ?? null
    },
    enabled: !!id,
  })
}

export function useCreateSiswa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Siswa>) => {
      return { ...data, id: crypto.randomUUID() } as Siswa
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['siswa'] }),
  })
}

export function useUpdateSiswa() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Siswa> }) => {
      const existing = mockSiswa.find((s) => s.id === id)
      return { ...existing, ...data } as Siswa
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['siswa'] }),
  })
}
