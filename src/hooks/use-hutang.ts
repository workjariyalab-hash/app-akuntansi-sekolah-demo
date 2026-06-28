'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockVendors, mockAPInvoices } from '@/lib/mock-data'
import type { Vendor, APInvoice } from '@/types'

interface HutangFilters {
  schoolId?: string
  vendorId?: string
  status?: APInvoice['status']
}

export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => [...mockVendors],
  })
}

export function useAPInvoices(filters?: HutangFilters) {
  return useQuery({
    queryKey: ['hutang', filters],
    queryFn: async () => {
      let data = [...mockAPInvoices]
      if (filters?.schoolId && filters.schoolId !== 'all') {
        data = data.filter((inv) => inv.schoolId === filters.schoolId)
      }
      if (filters?.vendorId) {
        data = data.filter((inv) => inv.vendorId === filters.vendorId)
      }
      if (filters?.status) {
        data = data.filter((inv) => inv.status === filters.status)
      }
      return data.sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime())
    },
  })
}

export function useAPInvoiceById(id: string | null) {
  return useQuery({
    queryKey: ['hutang', id],
    queryFn: async () => {
      return mockAPInvoices.find((inv) => inv.id === id) ?? null
    },
    enabled: !!id,
  })
}

export function useHutangStats(schoolId?: string) {
  return useQuery({
    queryKey: ['hutang-stats', schoolId],
    queryFn: async () => {
      let data = [...mockAPInvoices]
      if (schoolId && schoolId !== 'all') {
        data = data.filter((inv) => inv.schoolId === schoolId)
      }
      return {
        totalInvoices: data.length,
        totalAmount: data.reduce((sum, inv) => sum + inv.amount, 0),
        totalPaid: data.reduce((sum, inv) => sum + inv.paidAmount, 0),
        totalOutstanding: data.reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0),
        openCount: data.filter((inv) => inv.status === 'open').length,
        partialCount: data.filter((inv) => inv.status === 'partial').length,
        overdueCount: data.filter(
          (inv) => inv.status !== 'paid' && inv.dueDate < new Date().toISOString().split('T')[0]
        ).length,
      }
    },
  })
}

export function useCreateAPInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<APInvoice>) => {
      return { ...data, id: crypto.randomUUID(), paidAmount: 0, status: 'open' as const } as APInvoice
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hutang'] }),
  })
}

export function usePayAPInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, paymentAmount }: { id: string; paymentAmount: number }) => {
      const existing = mockAPInvoices.find((inv) => inv.id === id)
      if (!existing) throw new Error('Invoice tidak ditemukan')
      const newPaid = existing.paidAmount + paymentAmount
      const newStatus: APInvoice['status'] =
        newPaid >= existing.amount ? 'paid' : 'partial'
      return { ...existing, paidAmount: newPaid, status: newStatus }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hutang'] })
      qc.invalidateQueries({ queryKey: ['hutang-stats'] })
    },
  })
}

export function useCreateVendor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Vendor>) => {
      return { ...data, id: crypto.randomUUID() } as Vendor
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vendors'] }),
  })
}
