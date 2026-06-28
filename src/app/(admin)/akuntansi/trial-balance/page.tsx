'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { useAkun } from '@/hooks/use-akun'
import { trialBalance } from '@/lib/gl'
import { formatRupiah } from '@/lib/format'

export default function TrialBalancePage() {
  const { data: akun } = useAkun()
  const [period, setPeriod] = useState('2026-06')
  const tb = useMemo(() => trialBalance(akun ?? []), [akun])

  const exportData = tb.rows.map((r) => ({
    Kode: r.code,
    Akun: r.name,
    Debit: r.debit,
    Kredit: r.credit,
  }))

  return (
    <>
      <PageHeader
        title="Neraca Saldo (Trial Balance)"
        description="Daftar saldo seluruh akun — total debit harus sama dengan kredit."
        actions={<ExportButton data={exportData} filename="trial-balance" />}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterSelect
          value={period}
          onValueChange={setPeriod}
          options={[
            { value: '2026-06', label: 'Juni 2026' },
            { value: '2026-05', label: 'Mei 2026' },
            { value: '2026-04', label: 'April 2026' },
          ]}
        />
        {tb.balanced ? (
          <Badge variant="success" className="h-7 gap-1.5 px-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Balance — Debit = Kredit
          </Badge>
        ) : (
          <Badge variant="destructive" className="h-7 gap-1.5 px-3">
            <XCircle className="h-3.5 w-3.5" />
            Tidak Balance · Selisih {formatRupiah(Math.abs(tb.difference))}
          </Badge>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Kode</TableHead>
                <TableHead>Nama Akun</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="pr-6 text-right">Kredit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tb.rows.map((r) => (
                <TableRow key={r.code}>
                  <TableCell className="pl-6 font-mono text-xs text-muted-foreground">{r.code}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.debit ? formatRupiah(r.debit) : '—'}</TableCell>
                  <TableCell className="pr-6 text-right tabular-nums">{r.credit ? formatRupiah(r.credit) : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="pl-6 font-semibold">Total</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{formatRupiah(tb.totalDebit)}</TableCell>
                <TableCell className="pr-6 text-right font-semibold tabular-nums">{formatRupiah(tb.totalCredit)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
