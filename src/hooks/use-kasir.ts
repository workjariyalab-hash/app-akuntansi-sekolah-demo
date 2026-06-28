'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockCashTransactions } from '@/lib/mock-data'
import type { CashTransaction } from '@/types'

interface KasirFilters {
  schoolId?: string
  type?: 'receipt' | 'payment'
  status?: 'draft' | 'posted' | 'reversed'
  dateFrom?: string
  dateTo?: string
}

export function useKasir(filters?: KasirFilters) {
  return useQuery({
    queryKey: ['kasir', filters],
    queryFn: async () => {
      let data = [...mockCashTransactions]
      if (filters?.schoolId && filters.schoolId !== 'all') {
        data = data.filter((t) => t.schoolId === filters.schoolId)
      }
      if (filters?.type) {
        data = data.filter((t) => t.type === filters.type)
      }
      if (filters?.status) {
        data = data.filter((t) => t.status === filters.status)
      }
      if (filters?.dateFrom) {
        data = data.filter((t) => t.date >= filters.dateFrom!)
      }
      if (filters?.dateTo) {
        data = data.filter((t) => t.date <= filters.dateTo!)
      }
      return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    },
  })
}

export function useKasirStats(schoolId?: string) {
  return useQuery({
    queryKey: ['kasir-stats', schoolId],
    queryFn: async () => {
      let data = mockCashTransactions.filter((t) => t.status === 'posted')
      if (schoolId && schoolId !== 'all') {
        data = data.filter((t) => t.schoolId === schoolId)
      }
      const totalReceipt = data
        .filter((t) => t.type === 'receipt')
        .reduce((sum, t) => sum + t.amount, 0)
      const totalPayment = data
        .filter((t) => t.type === 'payment')
        .reduce((sum, t) => sum + t.amount, 0)
      return {
        totalReceipt,
        totalPayment,
        netCashFlow: totalReceipt - totalPayment,
        draftCount: mockCashTransactions.filter((t) => t.status === 'draft').length,
      }
    },
  })
}

export function useCreateKasir() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<CashTransaction>) => {
      return { ...data, id: crypto.randomUUID() } as CashTransaction
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kasir'] }),
  })
}

export function usePostKasir() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const existing = mockCashTransactions.find((t) => t.id === id)
      return { ...existing, status: 'posted' as const }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kasir'] })
      qc.invalidateQueries({ queryKey: ['kasir-stats'] })
    },
  })
}

export function useReverseKasir() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const existing = mockCashTransactions.find((t) => t.id === id)
      return { ...existing, status: 'reversed' as const }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kasir'] }),
  })
}
