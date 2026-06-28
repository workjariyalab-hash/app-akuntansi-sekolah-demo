'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockBudgetItems } from '@/lib/mock-data'
import type { BudgetItem } from '@/types'

interface BudgetingFilters {
  schoolId?: string
  period?: string
  categoryId?: string
}

export function useBudgeting(filters?: BudgetingFilters) {
  return useQuery({
    queryKey: ['budgeting', filters],
    queryFn: async () => {
      let data = [...mockBudgetItems]
      if (filters?.schoolId && filters.schoolId !== 'all') {
        data = data.filter((b) => b.schoolId === filters.schoolId)
      }
      if (filters?.period) {
        data = data.filter((b) => b.period === filters.period)
      }
      if (filters?.categoryId) {
        data = data.filter((b) => b.categoryId === filters.categoryId)
      }
      return data
    },
  })
}

export function useBudgetingStats(schoolId?: string, period?: string) {
  return useQuery({
    queryKey: ['budgeting-stats', schoolId, period],
    queryFn: async () => {
      let data = [...mockBudgetItems]
      if (schoolId && schoolId !== 'all') {
        data = data.filter((b) => b.schoolId === schoolId)
      }
      if (period) {
        data = data.filter((b) => b.period === period)
      }
      const totalPlanned = data.reduce((sum, b) => sum + b.plannedAmount, 0)
      const totalActual = data.reduce((sum, b) => sum + b.actualAmount, 0)
      const overBudget = data.filter((b) => b.variance < 0)
      const underBudget = data.filter((b) => b.variance > 0)
      return {
        totalPlanned,
        totalActual,
        totalVariance: totalPlanned - totalActual,
        overBudgetCount: overBudget.length,
        underBudgetCount: underBudget.length,
        utilizationRate: totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0,
      }
    },
  })
}

export function useCreateBudgetItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<BudgetItem>) => {
      return {
        ...data,
        id: crypto.randomUUID(),
        actualAmount: 0,
        variance: data.plannedAmount ?? 0,
      } as BudgetItem
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgeting'] }),
  })
}

export function useUpdateBudgetItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BudgetItem> }) => {
      const existing = mockBudgetItems.find((b) => b.id === id)
      const updated = { ...existing, ...data }
      updated.variance = (updated.plannedAmount ?? 0) - (updated.actualAmount ?? 0)
      return updated as BudgetItem
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budgeting'] })
      qc.invalidateQueries({ queryKey: ['budgeting-stats'] })
    },
  })
}
