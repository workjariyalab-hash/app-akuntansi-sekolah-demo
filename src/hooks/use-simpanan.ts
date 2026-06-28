'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockSavingsAccounts, mockSavingsTransactions } from '@/lib/mock-data'
import type { SavingsAccount, SavingsTransaction } from '@/types'

interface SimpananFilters {
  schoolId?: string
  status?: 'active' | 'closed'
  studentId?: string
}

export function useSimpanan(filters?: SimpananFilters) {
  return useQuery({
    queryKey: ['simpanan', filters],
    queryFn: async () => {
      let data = [...mockSavingsAccounts]
      if (filters?.schoolId && filters.schoolId !== 'all') {
        data = data.filter((s) => s.schoolId === filters.schoolId)
      }
      if (filters?.status) {
        data = data.filter((s) => s.status === filters.status)
      }
      if (filters?.studentId) {
        data = data.filter((s) => s.studentId === filters.studentId)
      }
      return data
    },
  })
}

export function useSimpananById(id: string | null) {
  return useQuery({
    queryKey: ['simpanan', id],
    queryFn: async () => {
      return mockSavingsAccounts.find((s) => s.id === id) ?? null
    },
    enabled: !!id,
  })
}

export function useSimpananTransactions(accountId: string | null) {
  return useQuery({
    queryKey: ['simpanan-transactions', accountId],
    queryFn: async () => {
      if (!accountId) return []
      return mockSavingsTransactions
        .filter((t) => t.accountId === accountId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    },
    enabled: !!accountId,
  })
}

export function useSimpananStats(schoolId?: string) {
  return useQuery({
    queryKey: ['simpanan-stats', schoolId],
    queryFn: async () => {
      let data = mockSavingsAccounts.filter((s) => s.status === 'active')
      if (schoolId && schoolId !== 'all') {
        data = data.filter((s) => s.schoolId === schoolId)
      }
      return {
        totalAccounts: data.length,
        totalBalance: data.reduce((sum, s) => sum + s.balance, 0),
        averageBalance: data.length > 0
          ? data.reduce((sum, s) => sum + s.balance, 0) / data.length
          : 0,
      }
    },
  })
}

export function useDepositSimpanan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      accountId,
      amount,
      notes,
      recordedBy,
    }: {
      accountId: string
      amount: number
      notes: string
      recordedBy: string
    }) => {
      const account = mockSavingsAccounts.find((s) => s.id === accountId)
      if (!account) throw new Error('Rekening tidak ditemukan')
      const balanceAfter = account.balance + amount
      const trx: SavingsTransaction = {
        id: crypto.randomUUID(),
        accountId,
        type: 'deposit',
        amount,
        balanceAfter,
        date: new Date().toISOString().split('T')[0],
        notes,
        recordedBy,
      }
      return trx
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['simpanan'] })
      qc.invalidateQueries({ queryKey: ['simpanan-transactions'] })
    },
  })
}

export function useWithdrawSimpanan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      accountId,
      amount,
      notes,
      recordedBy,
    }: {
      accountId: string
      amount: number
      notes: string
      recordedBy: string
    }) => {
      const account = mockSavingsAccounts.find((s) => s.id === accountId)
      if (!account) throw new Error('Rekening tidak ditemukan')
      if (account.balance < amount) throw new Error('Saldo tidak mencukupi')
      const balanceAfter = account.balance - amount
      const trx: SavingsTransaction = {
        id: crypto.randomUUID(),
        accountId,
        type: 'withdrawal',
        amount,
        balanceAfter,
        date: new Date().toISOString().split('T')[0],
        notes,
        recordedBy,
      }
      return trx
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['simpanan'] })
      qc.invalidateQueries({ queryKey: ['simpanan-transactions'] })
    },
  })
}
