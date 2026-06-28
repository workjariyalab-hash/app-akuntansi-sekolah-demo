'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockJournals, mockJournalLines } from '@/lib/mock-data'
import type { Journal, JournalLine, TipeJurnal, StatusJurnal } from '@/types'

interface JurnalFilters {
  status?: StatusJurnal
  type?: TipeJurnal
  dateFrom?: string
  dateTo?: string
  schoolId?: string
}

export function useJurnal(filters?: JurnalFilters) {
  return useQuery({
    queryKey: ['jurnal', filters],
    queryFn: async () => {
      let data = [...mockJournals]
      if (filters?.status) {
        data = data.filter((j) => j.status === filters.status)
      }
      if (filters?.type) {
        data = data.filter((j) => j.type === filters.type)
      }
      if (filters?.dateFrom) {
        data = data.filter((j) => j.date >= filters.dateFrom!)
      }
      if (filters?.dateTo) {
        data = data.filter((j) => j.date <= filters.dateTo!)
      }
      if (filters?.schoolId && filters.schoolId !== 'all') {
        const journalIdsInSchool = new Set(
          mockJournalLines
            .filter((l) => l.schoolId === filters.schoolId)
            .map((l) => l.journalId)
        )
        data = data.filter((j) => journalIdsInSchool.has(j.id))
      }
      return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    },
  })
}

export function useJurnalById(id: string | null) {
  return useQuery({
    queryKey: ['jurnal', id],
    queryFn: async () => {
      return mockJournals.find((j) => j.id === id) ?? null
    },
    enabled: !!id,
  })
}

export function useJurnalLines(journalId: string | null) {
  return useQuery({
    queryKey: ['jurnal-lines', journalId],
    queryFn: async () => {
      if (!journalId) return []
      return mockJournalLines.filter((l) => l.journalId === journalId)
    },
    enabled: !!journalId,
  })
}

export function useJurnalStats() {
  return useQuery({
    queryKey: ['jurnal-stats'],
    queryFn: async () => {
      return {
        total: mockJournals.length,
        draft: mockJournals.filter((j) => j.status === 'draft').length,
        posted: mockJournals.filter((j) => j.status === 'posted').length,
        totalDebit: mockJournals
          .filter((j) => j.status === 'posted')
          .reduce((sum, j) => sum + j.totalDebit, 0),
      }
    },
  })
}

export function useCreateJurnal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      journal,
      lines,
    }: {
      journal: Partial<Journal>
      lines: Partial<JournalLine>[]
    }) => {
      const journalId = crypto.randomUUID()
      const journalNumber = `JRN-${new Date().getFullYear()}-${String(mockJournals.length + 1).padStart(4, '0')}`
      const newJournal: Journal = {
        ...journal,
        id: journalId,
        journalNumber,
        status: 'draft',
        totalDebit: lines.reduce((sum, l) => sum + (l.debit ?? 0), 0),
        totalCredit: lines.reduce((sum, l) => sum + (l.credit ?? 0), 0),
      } as Journal
      const newLines = lines.map((l) => ({
        ...l,
        id: crypto.randomUUID(),
        journalId,
      })) as JournalLine[]
      return { journal: newJournal, lines: newLines }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jurnal'] })
      qc.invalidateQueries({ queryKey: ['jurnal-stats'] })
    },
  })
}

export function usePostJurnal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, postedBy }: { id: string; postedBy: string }) => {
      const existing = mockJournals.find((j) => j.id === id)
      return {
        ...existing,
        status: 'posted' as const,
        postedBy,
        postedAt: new Date().toISOString(),
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jurnal'] })
      qc.invalidateQueries({ queryKey: ['jurnal-stats'] })
    },
  })
}
