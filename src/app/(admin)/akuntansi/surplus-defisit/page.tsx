'use client'

import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { FilterSelect } from '@/components/shared/filter-select'
import { ExportButton } from '@/components/shared/export-button'
import { useAkun } from '@/hooks/use-akun'
import { incomeStatement, type StatementLine } from '@/lib/gl'
import { formatRupiah } from '@/lib/format'

export default function SurplusDefisitPage() {
  const { data: akun } = useAkun()
  const [period, setPeriod] = useState('2026-tahun')
  const is = useMemo(() => incomeStatement(akun ?? []), [akun])
  const isSurplus = is.surplus >= 0

  const exportData = [
    ...is.revenue.map((l) => ({ Bagian: 'Pendapatan', Akun: l.name, Nilai: l.amount })),
    ...is.expense.map((l) => ({ Bagian: 'Beban', Akun: l.name, Nilai: l.amount })),
    { Bagian: 'Hasil', Akun: isSurplus ? 'Surplus' : 'Defisit', Nilai: is.surplus },
  ]

  return (
    <>
      <PageHeader
        title="Laporan Surplus-Defisit"
        description="Setara laporan laba-rugi untuk entitas yayasan."
        actions={<ExportButton data={exportData} filename="surplus-defisit" />}
      />

      <div className="flex items-center gap-3">
        <FilterSelect
          value={period}
          onValueChange={setPeriod}
          options={[
            { value: '2026-tahun', label: 'Tahun Berjalan 2026' },
            { value: '2026-q2', label: 'Kuartal II 2026' },
            { value: '2026-06', label: 'Juni 2026' },
          ]}
        />
      </div>

      <Card>
        <CardContent className="space-y-5 p-6">
          <Section title="Pendapatan" lines={is.revenue} total={is.totalRevenue} positive />
          <Section title="Beban" lines={is.expense} total={is.totalExpense} />

          <div
            className={`flex items-center justify-between rounded-lg px-4 py-3 text-base font-bold ${
              isSurplus ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
            }`}
          >
            <span>{isSurplus ? 'SURPLUS' : 'DEFISIT'} TAHUN BERJALAN</span>
            <span className="tabular-nums">{formatRupiah(Math.abs(is.surplus))}</span>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function Section({
  title,
  lines,
  total,
  positive,
}: {
  title: string
  lines: StatementLine[]
  total: number
  positive?: boolean
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="space-y-1.5">
        {lines.map((l) => (
          <div key={l.code} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              <span className="mr-2 font-mono text-xs">{l.code}</span>
              {l.name}
            </span>
            <span className={`tabular-nums ${positive ? 'text-emerald-600' : ''}`}>{formatRupiah(l.amount)}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between border-t pt-2 text-sm font-semibold">
        <span>Total {title}</span>
        <span className="tabular-nums">{formatRupiah(total)}</span>
      </div>
    </div>
  )
}
