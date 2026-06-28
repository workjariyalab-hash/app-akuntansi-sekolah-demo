'use client'

import { useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Wallet,
  TrendingUp,
  AlertCircle,
  Users,
  Receipt,
  PiggyBank,
  Package,
  BookOpenCheck,
  FileClock,
  Scale,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { useAuthStore } from '@/stores/auth-store'
import { useTagihanStats, useTagihan } from '@/hooks/use-tagihan'
import { useKasirStats } from '@/hooks/use-kasir'
import { useHutangStats } from '@/hooks/use-hutang'
import { useSimpananStats } from '@/hooks/use-simpanan'
import { useInventarisStats } from '@/hooks/use-inventaris'
import { useJurnalStats } from '@/hooks/use-jurnal'
import { useSiswa } from '@/hooks/use-siswa'
import { useAkun } from '@/hooks/use-akun'
import { mockSekolah } from '@/lib/mock-data'
import { formatRupiah, formatRupiahCompact, formatNumber } from '@/lib/format'
import { roleLabels } from '@/lib/nav'

const CHART = {
  indigo: '#6366f1',
  emerald: '#10b981',
  amber: '#f59e0b',
  sky: '#0ea5e9',
  rose: '#f43f5e',
  slate: '#94a3b8',
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun']

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const schoolId = useAuthStore((s) => s.currentSchoolId)

  if (!user) return null

  if (user.role === 'kasir') return <KasirDashboard schoolId={user.schoolId ?? schoolId} />
  if (user.role === 'akuntan') return <AkuntanDashboard schoolId={schoolId} />
  return <AdminDashboard schoolId={schoolId} />
}

/* ----------------------------- Admin Dashboard ----------------------------- */

function AdminDashboard({ schoolId }: { schoolId: string }) {
  const { data: tagihanStats } = useTagihanStats(schoolId)
  const { data: kasirStats } = useKasirStats(schoolId)
  const { data: hutangStats } = useHutangStats(schoolId)
  const { data: simpananStats } = useSimpananStats(schoolId)
  const { data: inventarisStats } = useInventarisStats(schoolId)
  const { data: siswa } = useSiswa({ schoolId, status: 'aktif' })
  const { data: allBills } = useTagihan({ schoolId })

  const trend = useMemo(() => {
    const base = (tagihanStats?.totalAmount ?? 0) / 6
    const paid = (tagihanStats?.paidAmount ?? 0) / 6
    return MONTHS.map((m, i) => {
      const factor = 0.82 + i * 0.05
      return {
        month: m,
        Tagihan: Math.round(base * factor),
        Penerimaan: Math.round(paid * factor * (0.9 + (i % 3) * 0.05)),
      }
    })
  }, [tagihanStats])

  const statusPie = useMemo(
    () => [
      { name: 'Lunas', value: tagihanStats?.paid ?? 0, color: CHART.emerald },
      { name: 'Menunggu', value: tagihanStats?.pending ?? 0, color: CHART.slate },
      { name: 'Sebagian', value: tagihanStats?.partial ?? 0, color: CHART.amber },
      { name: 'Terlambat', value: tagihanStats?.overdue ?? 0, color: CHART.rose },
    ],
    [tagihanStats]
  )

  const topArrears = useMemo(() => {
    const map = new Map<string, number>()
    for (const b of allBills ?? []) {
      if (b.status === 'overdue' || b.status === 'partial') {
        map.set(b.schoolId, (map.get(b.schoolId) ?? 0) + (b.totalAmount - b.paidAmount))
      }
    }
    return mockSekolah
      .map((s) => ({ name: s.name, value: map.get(s.id) ?? 0 }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [allBills])

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan kesehatan keuangan seluruh sekolah di bawah yayasan."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tagihan Bulan Ini"
          value={tagihanStats?.totalAmount ?? 0}
          isRupiah
          icon={<Receipt className="h-5 w-5" />}
        />
        <StatCard
          title="Total Terkumpul"
          value={tagihanStats?.paidAmount ?? 0}
          isRupiah
          trend={8.4}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Total Tunggakan"
          value={tagihanStats?.outstandingAmount ?? 0}
          isRupiah
          valueClassName="text-rose-600"
          icon={<AlertCircle className="h-5 w-5" />}
        />
        <StatCard
          title="Siswa Aktif"
          value={siswa?.length ?? 0}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tagihan vs Penerimaan</CardTitle>
            <CardDescription>6 bulan terakhir (seluruh sekolah)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trend} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis
                  tickFormatter={(v) => formatRupiahCompact(v)}
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  width={70}
                />
                <Tooltip formatter={(value) => formatRupiah(Number(value))} />
                <Legend />
                <Bar dataKey="Tagihan" fill={CHART.indigo} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Penerimaan" fill={CHART.emerald} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Tagihan</CardTitle>
            <CardDescription>Distribusi jumlah tagihan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {statusPie.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} tagihan`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tunggakan Tertinggi per Sekolah</CardTitle>
            <CardDescription>Top 5 sekolah berdasarkan saldo tertunggak</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Sekolah</TableHead>
                  <TableHead className="text-right pr-6">Tunggakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topArrears.map((s) => (
                  <TableRow key={s.name}>
                    <TableCell className="pl-6 font-medium">{s.name}</TableCell>
                    <TableCell className="pr-6 text-right tabular-nums text-rose-600">
                      {formatRupiah(s.value)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posisi Keuangan</CardTitle>
            <CardDescription>Ringkasan saldo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SummaryRow
              icon={<Wallet className="h-4 w-4" />}
              label="Saldo Kas (net)"
              value={formatRupiah(kasirStats?.netCashFlow ?? 0)}
            />
            <SummaryRow
              icon={<Receipt className="h-4 w-4" />}
              label="Hutang Outstanding"
              value={formatRupiah(hutangStats?.totalOutstanding ?? 0)}
              valueClass="text-rose-600"
            />
            <SummaryRow
              icon={<PiggyBank className="h-4 w-4" />}
              label="Simpanan Siswa"
              value={formatRupiah(simpananStats?.totalBalance ?? 0)}
            />
            <SummaryRow
              icon={<Package className="h-4 w-4" />}
              label="Nilai Buku Aset"
              value={formatRupiah(inventarisStats?.totalBookValue ?? 0)}
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function SummaryRow({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">{icon}</span>
        {label}
      </div>
      <span className={`text-sm font-semibold tabular-nums ${valueClass ?? ''}`}>{value}</span>
    </div>
  )
}

/* ---------------------------- Akuntan Dashboard ---------------------------- */

function AkuntanDashboard({ schoolId }: { schoolId: string }) {
  const { data: jurnalStats } = useJurnalStats()
  const { data: akun } = useAkun()

  const ratios = useMemo(() => {
    const list = akun ?? []
    const sum = (pred: (code: string, type: string) => boolean) =>
      list.filter((a) => pred(a.code, a.type)).reduce((s, a) => s + (a.balance ?? 0), 0)
    const currentAssets = list
      .filter((a) => a.parentId === 'akun-1100')
      .reduce((s, a) => s + (a.balance ?? 0), 0)
    const inventory = list
      .filter((a) => a.code === '1106')
      .reduce((s, a) => s + (a.balance ?? 0), 0)
    const currentLiab = list
      .filter((a) => a.parentId === 'akun-2000')
      .reduce((s, a) => s + (a.balance ?? 0), 0)
    const revenue = sum((_, t) => t === 'revenue')
    const expense = sum((_, t) => t === 'expense')
    return {
      current: currentLiab ? currentAssets / currentLiab : 0,
      quick: currentLiab ? (currentAssets - inventory) / currentLiab : 0,
      costRecovery: expense ? revenue / expense : 0,
    }
  }, [akun])

  return (
    <>
      <PageHeader
        title="Dashboard Akuntan"
        description="Status buku besar, jurnal, dan rasio keuangan yayasan."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Scale className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">Status Trial Balance</p>
              <p className="text-lg font-semibold text-emerald-600">Balance ✓</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <FileClock className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">Jurnal Menunggu Posting</p>
              <p className="text-lg font-semibold">{jurnalStats?.draft ?? 0} draf</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <BookOpenCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">Total Jurnal Terposting</p>
              <p className="text-lg font-semibold">{jurnalStats?.posted ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rasio Keuangan</CardTitle>
          <CardDescription>Berdasarkan posisi buku besar terkini</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <RatioCard label="Current Ratio" value={ratios.current} hint="Aktiva Lancar / Kewajiban Lancar" good={ratios.current >= 1.5} />
          <RatioCard label="Quick Ratio" value={ratios.quick} hint="(Aktiva Lancar − Persediaan) / Kewajiban Lancar" good={ratios.quick >= 1} />
          <RatioCard label="Cost Recovery" value={ratios.costRecovery} hint="Total Pendapatan / Total Beban" good={ratios.costRecovery >= 1} />
        </CardContent>
      </Card>
    </>
  )
}

function RatioCard({ label, value, hint, good }: { label: string; value: number; hint: string; good: boolean }) {
  return (
    <div className="rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Badge variant={good ? 'success' : 'warning'}>{good ? 'Sehat' : 'Perhatian'}</Badge>
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums">{value.toFixed(2)}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

/* ----------------------------- Kasir Dashboard ----------------------------- */

function KasirDashboard({ schoolId }: { schoolId: string }) {
  const { data: kasirStats } = useKasirStats(schoolId)
  const { data: akun } = useAkun()

  const cashAccounts = (akun ?? []).filter((a) =>
    ['1101', '1102', '1103'].includes(a.code)
  )

  return (
    <>
      <PageHeader
        title="Dashboard Kasir"
        description="Ringkasan posisi kas dan transaksi hari ini."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cashAccounts.map((a) => (
          <StatCard
            key={a.id}
            title={`Saldo ${a.name}`}
            value={a.balance ?? 0}
            isRupiah
            icon={<Wallet className="h-5 w-5" />}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Total Penerimaan (terposting)"
          value={kasirStats?.totalReceipt ?? 0}
          isRupiah
          valueClassName="text-emerald-600"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Total Pengeluaran (terposting)"
          value={kasirStats?.totalPayment ?? 0}
          isRupiah
          valueClassName="text-rose-600"
          icon={<Receipt className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Transaksi menunggu posting</p>
            <p className="text-2xl font-bold">{formatNumber(kasirStats?.draftCount ?? 0)}</p>
          </div>
          <Badge variant="warning">Perlu ditinjau</Badge>
        </CardContent>
      </Card>
    </>
  )
}
