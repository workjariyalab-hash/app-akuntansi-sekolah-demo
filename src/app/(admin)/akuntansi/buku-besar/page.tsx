'use client'

import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from '@/components/ui/table'
import { FilterSelect } from '@/components/shared/filter-select'
import { ExportButton } from '@/components/shared/export-button'
import { EmptyState } from '@/components/shared/states'
import { useAkun } from '@/hooks/use-akun'
import { mockJournals, mockJournalLines } from '@/lib/mock-data'
import { leafAccounts } from '@/lib/gl'
import { formatRupiah, formatDateShort } from '@/lib/format'

export default function BukuBesarPage() {
  const { data: akun } = useAkun()
  const leaves = useMemo(() => leafAccounts(akun ?? []), [akun])
  const [code, setCode] = useState('1102')

  const account = leaves.find((a) => a.code === code)

  const entries = useMemo(() => {
    const lines = mockJournalLines
      .filter((l) => l.accountCode === code)
      .map((l) => {
        const j = mockJournals.find((jj) => jj.id === l.journalId)
        return { ...l, date: j?.date ?? '', journalNumber: j?.journalNumber ?? '', jdesc: j?.description ?? '' }
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    let running = 0
    const isDebit = account?.normalBalance === 'debit'
    return lines.map((l) => {
      running += isDebit ? l.debit - l.credit : l.credit - l.debit
      return { ...l, saldo: running }
    })
  }, [code, account])

  const totalDebit = entries.reduce((s, e) => s + e.debit, 0)
  const totalCredit = entries.reduce((s, e) => s + e.credit, 0)

  const exportData = entries.map((e) => ({
    Tanggal: e.date,
    Jurnal: e.journalNumber,
    Keterangan: e.description,
    Debit: e.debit,
    Kredit: e.credit,
    Saldo: e.saldo,
  }))

  return (
    <>
      <PageHeader
        title="Buku Besar"
        description="Rincian transaksi dan saldo berjalan per akun."
        actions={<ExportButton data={exportData} filename={`buku-besar-${code}`} />}
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">Akun:</span>
            <FilterSelect
              className="w-[320px]"
              value={code}
              onValueChange={setCode}
              options={leaves.map((a) => ({ value: a.code, label: `${a.code} — ${a.name}` }))}
            />
          </div>

          {entries.length === 0 ? (
            <EmptyState description="Tidak ada transaksi pada akun ini." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>No. Jurnal</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Kredit</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{formatDateShort(e.date)}</TableCell>
                    <TableCell className="font-mono text-xs">{e.journalNumber}</TableCell>
                    <TableCell className="max-w-[280px] truncate text-muted-foreground">{e.description}</TableCell>
                    <TableCell className="text-right tabular-nums">{e.debit ? formatRupiah(e.debit) : '—'}</TableCell>
                    <TableCell className="text-right tabular-nums">{e.credit ? formatRupiah(e.credit) : '—'}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{formatRupiah(e.saldo)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total Mutasi</TableCell>
                  <TableCell className="text-right tabular-nums">{formatRupiah(totalDebit)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatRupiah(totalCredit)}</TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  )
}
