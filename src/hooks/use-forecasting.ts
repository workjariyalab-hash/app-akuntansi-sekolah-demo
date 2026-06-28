'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockForecastItems } from '@/lib/mock-data'
import type { ForecastItem } from '@/types'

interface ForecastingFilters {
  schoolId?: string
  categoryName?: string
  period?: string
}

export function useForecasting(filters?: ForecastingFilters) {
  return useQuery({
    queryKey: ['forecasting', filters],
    queryFn: async () => {
      let data = [...mockForecastItems]
      if (filters?.schoolId && filters.schoolId !== 'all') {
        data = data.filter((f) => f.schoolId === filters.schoolId)
      }
      if (filters?.categoryName) {
        data = data.filter((f) => f.categoryName === filters.categoryName)
      }
      if (filters?.period) {
        data = data.filter((f) => f.period === filters.period)
      }
      return data
    },
  })
}

export function useForecastingBySchool(schoolId: string | null) {
  return useQuery({
    queryKey: ['forecasting-school', schoolId],
    queryFn: async () => {
      if (!schoolId || schoolId === 'all') return mockForecastItems
      return mockForecastItems.filter((f) => f.schoolId === schoolId)
    },
    enabled: !!schoolId,
  })
}

export function useForecastingStats(schoolId?: string) {
  return useQuery({
    queryKey: ['forecasting-stats', schoolId],
    queryFn: async () => {
      let data = [...mockForecastItems]
      if (schoolId && schoolId !== 'all') {
        data = data.filter((f) => f.schoolId === schoolId)
      }
      return {
        totalBillingForecast: data.reduce((sum, f) => sum + f.billingForecast, 0),
        totalCollectionForecast: data.reduce((sum, f) => sum + f.collectionForecast, 0),
        totalActualCollection: data.reduce((sum, f) => sum + f.actualCollection, 0),
        totalBudget: data.reduce((sum, f) => sum + f.budget, 0),
        totalVariance: data.reduce((sum, f) => sum + f.variance, 0),
        collectionRate: (() => {
          const billing = data.reduce((sum, f) => sum + f.billingForecast, 0)
          const collection = data.reduce((sum, f) => sum + f.collectionForecast, 0)
          return billing > 0 ? (collection / billing) * 100 : 0
        })(),
      }
    },
  })
}

export function useCreateForecastItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<ForecastItem>) => {
      return {
        ...data,
        id: crypto.randomUUID(),
        actualCollection: 0,
        variance: (data.collectionForecast ?? 0) - (data.budget ?? 0),
      } as ForecastItem
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['forecasting'] }),
  })
}

export function useUpdateForecastItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ForecastItem> }) => {
      const existing = mockForecastItems.find((f) => f.id === id)
      const updated = { ...existing, ...data }
      updated.variance = (updated.collectionForecast ?? 0) - (updated.budget ?? 0)
      return updated as ForecastItem
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['forecasting'] })
      qc.invalidateQueries({ queryKey: ['forecasting-stats'] })
    },
  })
}
