'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockPayrollRuns, mockPayrollLines, mockKaryawan } from '@/lib/mock-data'
import type { PayrollRun, PayrollLine } from '@/types'

interface PenggajianFilters {
  schoolId?: string
  status?: 'draft' | 'finalized'
  periodYear?: number
  periodMonth?: number
}

export function usePayrollRuns(filters?: PenggajianFilters) {
  return useQuery({
    queryKey: ['payroll-runs', filters],
    queryFn: async () => {
      let data = [...mockPayrollRuns]
      if (filters?.schoolId && filters.schoolId !== 'all') {
        data = data.filter((r) => r.schoolId === filters.schoolId)
      }
      if (filters?.status) {
        data = data.filter((r) => r.status === filters.status)
      }
      if (filters?.periodYear) {
        data = data.filter((r) => r.periodYear === filters.periodYear)
      }
      if (filters?.periodMonth) {
        data = data.filter((r) => r.periodMonth === filters.periodMonth)
      }
      return data.sort((a, b) => {
        if (a.periodYear !== b.periodYear) return b.periodYear - a.periodYear
        return b.periodMonth - a.periodMonth
      })
    },
  })
}

export function usePayrollRunById(id: string | null) {
  return useQuery({
    queryKey: ['payroll-run', id],
    queryFn: async () => {
      return mockPayrollRuns.find((r) => r.id === id) ?? null
    },
    enabled: !!id,
  })
}

export function usePayrollLines(runId: string | null) {
  return useQuery({
    queryKey: ['payroll-lines', runId],
    queryFn: async () => {
      if (!runId) return []
      return mockPayrollLines.filter((l) => l.runId === runId)
    },
    enabled: !!runId,
  })
}

export function useKaryawan(schoolId?: string) {
  return useQuery({
    queryKey: ['karyawan', schoolId],
    queryFn: async () => {
      let data = [...mockKaryawan]
      if (schoolId && schoolId !== 'all') {
        data = data.filter((k) => k.schoolId === schoolId)
      }
      return data
    },
  })
}

export function usePenggajianStats(schoolId?: string) {
  return useQuery({
    queryKey: ['penggajian-stats', schoolId],
    queryFn: async () => {
      let runs = mockPayrollRuns.filter((r) => r.status === 'finalized')
      if (schoolId && schoolId !== 'all') {
        runs = runs.filter((r) => r.schoolId === schoolId)
      }
      const latestRun = runs[0] ?? null
      return {
        totalRuns: mockPayrollRuns.length,
        draftRuns: mockPayrollRuns.filter((r) => r.status === 'draft').length,
        finalizedRuns: runs.length,
        lastMonthGross: latestRun?.totalGross ?? 0,
        lastMonthNet: latestRun?.totalNet ?? 0,
        totalEmployees: mockKaryawan.filter((k) =>
          schoolId && schoolId !== 'all' ? k.schoolId === schoolId : true
        ).length,
      }
    },
  })
}

export function useCreatePayrollRun() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<PayrollRun>) => {
      return { ...data, id: crypto.randomUUID(), status: 'draft' as const } as PayrollRun
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payroll-runs'] }),
  })
}

export function useFinalizePayrollRun() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const existing = mockPayrollRuns.find((r) => r.id === id)
      return { ...existing, status: 'finalized' as const, finalizedAt: new Date().toISOString() }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payroll-runs'] })
      qc.invalidateQueries({ queryKey: ['penggajian-stats'] })
    },
  })
}

export function useUpdatePayrollLine() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PayrollLine> }) => {
      const existing = mockPayrollLines.find((l) => l.id === id)
      return { ...existing, ...data } as PayrollLine
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payroll-lines'] }),
  })
}
