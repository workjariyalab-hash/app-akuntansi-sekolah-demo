'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FilterSelect } from '@/components/shared/filter-select'
import { ExportButton } from '@/components/shared/export-button'
import { useAkun } from '@/hooks/use-akun'
import { balanceSheet, type StatementLine } from '@/lib/gl'
import { formatRupiah } from '@/lib/format'

export default function NeracaPage() {
  const { data: akun } = useAkun()
  const [period, setPeriod] = useState('2026-06')
  const bs = useMemo(() => balanceSheet(akun ?? []), [akun])

  const exportData = [
    ...bs.currentAssets.map((l) => ({ Bagian: 'Aktiva Lancar', Akun: l.name, Nilai: l.amount })),
    ...bs.fixedAssets.map((l) => ({ Bagian: 'Aktiva Tetap', Akun: l.name, Nilai: l.amount })),
    ...bs.liabilities.map((l) => ({ Bagian: 'Kewajiban', Akun: l.name, Nilai: l.amount })),
    ...bs.equity.map((l) => ({ Bagian: 'Ekuitas', Akun: l.name, Nilai: l.amount })),
  ]

  return (
    <>
      <PageHeader
        title="Neraca (Balance Sheet)"
        description="Posisi keuangan: Aktiva = Kewajiban + Ekuitas."
        actions={<ExportButton data={exportData} filename="neraca" />}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterSelect
          value={period}
          onValueChange={setPeriod}
          options={[
            { value: '2026-06', label: 'Per 30 Juni 2026' },
            { value: '2026-05', label: 'Per 31 Mei 2026' },
          ]}
        />
        {bs.balanced && (
          <Badge variant="success" className="h-7 gap-1.5 px-3">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Seimbang
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aktiva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Section title="Aktiva Lancar" lines={bs.currentAssets} subtotal={bs.totalCurrentAssets} />
            <Section title="Aktiva Tidak Lancar" lines={bs.fixedAssets} subtotal={bs.totalFixedAssets} />
            <TotalRow label="TOTAL AKTIVA" value={bs.totalAssets} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kewajiban & Ekuitas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Section title="Kewajiban" lines={bs.liabilities} subtotal={bs.totalLiabilities} />
            <Section title="Ekuitas" lines={bs.equity} subtotal={bs.totalEquity} />
            <TotalRow label="TOTAL KEWAJIBAN + EKUITAS" value={bs.totalLiabEquity} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function Section({ title, lines, subtotal }: { title: string; lines: StatementLine[]; subtotal: number }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="space-y-1">
        {lines.map((l) => (
          <div key={l.code} className="flex items-center justify-between text-sm">
            <span className={l.amount < 0 ? 'text-muted-foreground' : ''}>{l.name}</span>
            <span className="tabular-nums">
              {l.amount < 0 ? `(${formatRupiah(Math.abs(l.amount))})` : formatRupiah(l.amount)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between border-t pt-1.5 text-sm font-medium">
        <span>Subtotal {title}</span>
        <span className="tabular-nums">{formatRupiah(subtotal)}</span>
      </div>
    </div>
  )
}

function TotalRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-indigo-50 px-3 py-2.5 text-sm font-bold text-indigo-900">
      <span>{label}</span>
      <span className="tabular-nums">{formatRupiah(value)}</span>
    </div>
  )
}
