'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockPembayaran } from '@/lib/mock-data'
import type { Pembayaran } from '@/types'

interface PembayaranFilters {
  billId?: string
  method?: 'va' | 'cash'
  studentName?: string
}

export function usePembayaran(filters?: PembayaranFilters) {
  return useQuery({
    queryKey: ['pembayaran', filters],
    queryFn: async () => {
      let data = [...mockPembayaran]
      if (filters?.billId) {
        data = data.filter((p) => p.billId === filters.billId)
      }
      if (filters?.method) {
        data = data.filter((p) => p.method === filters.method)
      }
      if (filters?.studentName) {
        data = data.filter((p) =>
          p.studentName.toLowerCase().includes(filters.studentName!.toLowerCase())
        )
      }
      return data.sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
    },
  })
}

export function usePembayaranById(id: string | null) {
  return useQuery({
    queryKey: ['pembayaran', id],
    queryFn: async () => {
      return mockPembayaran.find((p) => p.id === id) ?? null
    },
    enabled: !!id,
  })
}

export function useCreatePembayaran() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Pembayaran>) => {
      const receiptNumber = `RCP-${new Date().getFullYear()}-${String(mockPembayaran.length + 1).padStart(4, '0')}`
      return {
        ...data,
        id: crypto.randomUUID(),
        receiptNumber,
        paidAt: new Date().toISOString(),
      } as Pembayaran
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pembayaran'] })
      qc.invalidateQueries({ queryKey: ['tagihan'] })
    },
  })
}
