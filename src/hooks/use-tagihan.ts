'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockTagihan } from '@/lib/mock-data'
import type { Tagihan, StatusTagihan } from '@/types'

interface TagihanFilters {
  schoolId?: string
  studentId?: string
  status?: StatusTagihan
  billingPeriod?: string
}

export function useTagihan(filters?: TagihanFilters) {
  return useQuery({
    queryKey: ['tagihan', filters],
    queryFn: async () => {
      let data = [...mockTagihan]
      if (filters?.schoolId && filters.schoolId !== 'all') {
        data = data.filter((t) => t.schoolId === filters.schoolId)
      }
      if (filters?.studentId) {
        data = data.filter((t) => t.studentId === filters.studentId)
      }
      if (filters?.status) {
        data = data.filter((t) => t.status === filters.status)
      }
      if (filters?.billingPeriod) {
        data = data.filter((t) => t.billingPeriod === filters.billingPeriod)
      }
      return data
    },
  })
}

export function useTagihanById(id: string | null) {
  return useQuery({
    queryKey: ['tagihan', id],
    queryFn: async () => {
      return mockTagihan.find((t) => t.id === id) ?? null
    },
    enabled: !!id,
  })
}

export function useTagihanStats(schoolId?: string) {
  return useQuery({
    queryKey: ['tagihan-stats', schoolId],
    queryFn: async () => {
      let data = [...mockTagihan]
      if (schoolId && schoolId !== 'all') {
        data = data.filter((t) => t.schoolId === schoolId)
      }
      return {
        total: data.length,
        pending: data.filter((t) => t.status === 'pending').length,
        partial: data.filter((t) => t.status === 'partial').length,
        overdue: data.filter((t) => t.status === 'overdue').length,
        paid: data.filter((t) => t.status === 'paid').length,
        totalAmount: data.reduce((sum, t) => sum + t.totalAmount, 0),
        paidAmount: data.reduce((sum, t) => sum + t.paidAmount, 0),
        outstandingAmount: data.reduce((sum, t) => sum + (t.totalAmount - t.paidAmount), 0),
      }
    },
  })
}

export function useCreateTagihan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Tagihan>) => {
      return { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() } as Tagihan
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tagihan'] }),
  })
}

export function useUpdateTagihanStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: StatusTagihan }) => {
      const existing = mockTagihan.find((t) => t.id === id)
      return { ...existing, status } as Tagihan
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tagihan'] })
      qc.invalidateQueries({ queryKey: ['tagihan-stats'] })
    },
  })
}
