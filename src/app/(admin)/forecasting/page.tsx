'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { TrendingUp, Wallet, AlertCircle, Target, Banknote, PiggyBank, Sparkles, Send } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatCard } from '@/components/shared/stat-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
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
import { useForecasting } from '@/hooks/use-forecasting'
import { useAkun } from '@/hooks/use-akun'
import { useAuthStore } from '@/stores/auth-store'
import { projectAnnualBudget, DEFAULT_ASSUMPTIONS } from '@/lib/gl'
import { formatRupiah, formatRupiahCompact } from '@/lib/format'

const NEXT_YEAR = 2027
const CURRENT_YEAR = 2026

export default function ForecastingPage() {
  return (
    <>
      <PageHeader
        title="Forecasting Keuangan"
        description="Proyeksi penerimaan kas dan perencanaan anggaran tahunan."
      />
      <Tabs defaultValue="collection">
        <TabsList>
          <TabsTrigger value="collection">Proyeksi Penerimaan</TabsTrigger>
          <TabsTrigger value="budget">Proyeksi Anggaran Tahunan</TabsTrigger>
        </TabsList>
        <TabsContent value="collection" className="space-y-6 pt-4">
          <CollectionForecastTab />
        </TabsContent>
        <TabsContent value="budget" className="space-y-6 pt-4">
          <AnnualBudgetTab />
        </TabsContent>
      </Tabs>
    </>
  )
}

/* ---------------------- Tab 1: Collection forecast ------------------------ */

const SCENARIO_FACTOR: Record<string, number> = { optimis: 1.05, realistis: 1, pesimis: 0.9 }
const COLL_CHART = { billing: '#6366f1', collection: '#10b981', actual: '#f59e0b' }

function CollectionForecastTab() {
  const schoolId = useAuthStore((s) => s.currentSchoolId)
  const { data: items } = useForecasting({ schoolId })
  const [scenario, setScenario] = useState('realistis')
  const [horizon, setHorizon] = useState('6')

  const factor = SCENARIO_FACTOR[scenario]

  const adjusted = useMemo(
    () =>
      (items ?? []).map((f) => ({
        ...f,
        collectionAdj: Math.min(f.billingForecast, Math.round(f.collectionForecast * factor)),
      })),
    [items, factor]
  )

  const totals = useMemo(() => {
    const billing = adjusted.reduce((s, f) => s + f.billingForecast, 0)
    const collection = adjusted.reduce((s, f) => s + f.collectionAdj, 0)
    const budget = adjusted.reduce((s, f) => s + f.budget, 0)
    return { billing, collection, budget, gap: billing - collection }
  }, [adjusted])

  const chartData = useMemo(() => {
    const map = new Map<string, { period: string; Tagihan: number; Penerimaan: number; Aktual: number }>()
    for (const f of adjusted) {
      const row = map.get(f.period) ?? { period: f.period, Tagihan: 0, Penerimaan: 0, Aktual: 0 }
      row.Tagihan += f.billingForecast
      row.Penerimaan += f.collectionAdj
      row.Aktual += f.actualCollection
      map.set(f.period, row)
    }
    return Array.from(map.values())
  }, [adjusted])

  const exportData = adjusted.map((f) => ({
    Kategori: f.categoryName,
    Periode: f.period,
    Budget: f.budget,
    'Billing Forecast': f.billingForecast,
    'Collection Forecast': f.collectionAdj,
    Aktual: f.actualCollection,
  }))

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <FilterSelect
            value={horizon}
            onValueChange={setHorizon}
            options={[
              { value: '1', label: '1 Bulan' },
              { value: '3', label: '3 Bulan' },
              { value: '6', label: '6 Bulan' },
              { value: '12', label: '12 Bulan' },
            ]}
          />
          <FilterSelect
            value={scenario}
            onValueChange={setScenario}
            options={[
              { value: 'optimis', label: 'Optimis (+5%)' },
              { value: 'realistis', label: 'Realistis' },
              { value: 'pesimis', label: 'Pesimis (−10%)' },
            ]}
          />
        </div>
        <ExportButton data={exportData} filename="forecasting-penerimaan" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Billing Forecast" value={totals.billing} isRupiah icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Total Collection Forecast" value={totals.collection} isRupiah valueClassName="text-emerald-600" icon={<Wallet className="h-5 w-5" />} />
        <StatCard title="Expected Gap" value={totals.gap} isRupiah valueClassName="text-rose-600" icon={<AlertCircle className="h-5 w-5" />} />
        <StatCard title="Total Budget" value={totals.budget} isRupiah icon={<Target className="h-5 w-5" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Proyeksi Arus Kas</CardTitle>
          <CardDescription>Tagihan terjadwal vs perkiraan penerimaan vs aktual</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <EmptyState description="Belum ada data forecast." />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickFormatter={(v) => formatRupiahCompact(Number(v))} tickLine={false} axisLine={false} fontSize={11} width={70} />
                <Tooltip formatter={(value) => formatRupiah(Number(value))} />
                <Legend />
                <Bar dataKey="Tagihan" fill={COLL_CHART.billing} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Penerimaan" fill={COLL_CHART.collection} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Aktual" fill={COLL_CHART.actual} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h3 className="text-sm font-medium">Detail per Kategori</h3>
          {adjusted.length === 0 ? (
            <EmptyState description="Belum ada data forecast." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Billing</TableHead>
                  <TableHead className="text-right">Collection</TableHead>
                  <TableHead className="text-right">Aktual</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjusted.map((f) => {
                  const variance = f.actualCollection - f.collectionAdj
                  return (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.categoryName}</TableCell>
                      <TableCell>{f.period}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatRupiahCompact(f.budget)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatRupiahCompact(f.billingForecast)}</TableCell>
                      <TableCell className="text-right tabular-nums text-emerald-600">{formatRupiahCompact(f.collectionAdj)}</TableCell>
                      <TableCell className="text-right tabular-nums">{f.actualCollection ? formatRupiahCompact(f.actualCollection) : '—'}</TableCell>
                      <TableCell className="text-right">
                        {f.actualCollection ? (
                          <Badge variant={variance >= 0 ? 'success' : 'warning'}>{formatRupiahCompact(variance)}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  )
}

/* --------------------- Tab 2: Annual budget forecast ---------------------- */

const YOY = { current: '#94a3b8', next: '#6366f1' }

function AnnualBudgetTab() {
  const { data: akun } = useAkun()
  // Assumptions held as percentages in the UI.
  const [g, setG] = useState(DEFAULT_ASSUMPTIONS.studentGrowth * 100)
  const [fee, setFee] = useState(DEFAULT_ASSUMPTIONS.feeIncrease * 100)
  const [inflation, setInflation] = useState(DEFAULT_ASSUMPTIONS.costInflation * 100)
  const [salary, setSalary] = useState(DEFAULT_ASSUMPTIONS.salaryIncrease * 100)

  const proj = useMemo(
    () =>
      projectAnnualBudget(akun ?? [], {
        studentGrowth: g / 100,
        feeIncrease: fee / 100,
        costInflation: inflation / 100,
        salaryIncrease: salary / 100,
      }),
    [akun, g, fee, inflation, salary]
  )

  const comparison = [
    { name: 'Pendapatan', 'Tahun Ini': proj.currentRevenue, 'Tahun Depan': proj.projectedRevenue },
    { name: 'Beban', 'Tahun Ini': proj.currentExpense, 'Tahun Depan': proj.projectedExpense },
    { name: 'Surplus', 'Tahun Ini': proj.currentSurplus, 'Tahun Depan': proj.projectedSurplus },
  ]

  const exportData = proj.expenseLines.map((l) => ({
    Kode: l.code,
    'Akun Beban': l.name,
    [`Realisasi ${CURRENT_YEAR}`]: l.amount,
    [`Anggaran ${NEXT_YEAR}`]: l.projected,
    'Δ%': Number(l.deltaPct.toFixed(1)),
  }))

  return (
    <>
      <Card className="ring-indigo-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            Asumsi Proyeksi {NEXT_YEAR}
          </CardTitle>
          <CardDescription>
            Anggaran tahun depan dihitung dari realisasi {CURRENT_YEAR} (buku besar) dikalikan asumsi berikut.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AssumptionInput label="Pertumbuhan Siswa" value={g} onChange={setG} hint="Memengaruhi pendapatan & sebagian beban" />
          <AssumptionInput label="Kenaikan SPP / Tarif" value={fee} onChange={setFee} hint="Memengaruhi pendapatan" />
          <AssumptionInput label="Inflasi Biaya Operasional" value={inflation} onChange={setInflation} hint="Memengaruhi beban operasional" />
          <AssumptionInput label="Kenaikan Gaji" value={salary} onChange={setSalary} hint="Memengaruhi beban gaji & BPJS" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={`Proyeksi Pendapatan ${NEXT_YEAR}`} value={proj.projectedRevenue} isRupiah valueClassName="text-emerald-600" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title={`Total Anggaran Beban ${NEXT_YEAR}`} value={proj.projectedExpense} isRupiah icon={<Banknote className="h-5 w-5" />} />
        <StatCard
          title="Proyeksi Surplus/Defisit"
          value={proj.projectedSurplus}
          isRupiah
          valueClassName={proj.projectedSurplus >= 0 ? 'text-emerald-600' : 'text-rose-600'}
          icon={<PiggyBank className="h-5 w-5" />}
        />
        <StatCard title="Margin Surplus" value={`${proj.surplusMargin.toFixed(1)}%`} icon={<Target className="h-5 w-5" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perbandingan {CURRENT_YEAR} vs {NEXT_YEAR}</CardTitle>
          <CardDescription>Proyeksi pendapatan, beban, dan surplus tahun depan</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparison} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickFormatter={(v) => formatRupiahCompact(Number(v))} tickLine={false} axisLine={false} fontSize={11} width={70} />
              <Tooltip formatter={(value) => formatRupiah(Number(value))} />
              <Legend />
              <Bar dataKey="Tahun Ini" fill={YOY.current} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Tahun Depan" fill={YOY.next} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium">Rekomendasi Anggaran Beban {NEXT_YEAR}</h3>
              <p className="text-xs text-muted-foreground">Dasar penyusunan budget tahun depan per kategori.</p>
            </div>
            <div className="flex items-center gap-2">
              <ExportButton data={exportData} filename={`anggaran-${NEXT_YEAR}`} />
              <Button
                onClick={() =>
                  toast.success(`Rekomendasi anggaran ${NEXT_YEAR} (${formatRupiah(proj.projectedExpense)}) dikirim ke modul Budgeting.`)
                }
              >
                <Send className="h-4 w-4" />
                Jadikan Budget
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Akun Beban</TableHead>
                <TableHead className="text-right">Realisasi {CURRENT_YEAR}</TableHead>
                <TableHead className="text-right">Anggaran {NEXT_YEAR}</TableHead>
                <TableHead className="text-right">Δ%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proj.expenseLines.map((l) => (
                <TableRow key={l.code}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{l.code}</TableCell>
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{formatRupiah(l.amount)}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{formatRupiah(l.projected)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={l.deltaPct > 8 ? 'warning' : 'secondary'}>+{l.deltaPct.toFixed(1)}%</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="font-semibold">Total Anggaran {NEXT_YEAR}</TableCell>
                <TableCell className="text-right tabular-nums">{formatRupiah(proj.currentExpense)}</TableCell>
                <TableCell className="text-right font-bold tabular-nums">{formatRupiah(proj.projectedExpense)}</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>

          <div className="rounded-lg bg-indigo-50 p-3 text-xs text-indigo-700">
            <span className="font-medium">Catatan metodologi:</span> Pendapatan diproyeksikan dari jumlah siswa × tarif
            (SPP mengikuti pertumbuhan siswa dan kenaikan tarif; Dana BOS mengikuti jumlah siswa). Beban gaji & BPJS
            mengikuti kenaikan gaji dan sebagian pertumbuhan siswa; beban operasional mengikuti inflasi; penyusutan
            mengikuti jadwal aset (tetap).
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function AssumptionInput({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  hint: string
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="pr-7"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
      </div>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}
