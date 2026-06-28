'use client'

import { useMemo, useState } from 'react'
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
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatCard } from '@/components/shared/stat-card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { FilterSelect } from '@/components/shared/filter-select'
import { StatusBadge } from '@/components/shared/status-badge'
import { ExportButton } from '@/components/shared/export-button'
import { EmptyState } from '@/components/shared/states'
import { useTagihan } from '@/hooks/use-tagihan'
import { useAuthStore } from '@/stores/auth-store'
import { mockSekolah } from '@/lib/mock-data'
import { formatRupiah, formatRupiahCompact, formatDateShort } from '@/lib/format'

const TODAY = new Date('2026-06-26')

const CHART = { b1: '#fbbf24', b2: '#fb923c', b3: '#f87171', b4: '#dc2626' }

function ageDays(due: string) {
  return Math.max(0, Math.floor((TODAY.getTime() - new Date(due).getTime()) / 86_400_000))
}
function bucketOf(days: number): 0 | 1 | 2 | 3 {
  if (days <= 30) return 0
  if (days <= 60) return 1
  if (days <= 90) return 2
  return 3
}
const BUCKET_LABELS = ['0–30 hari', '31–60 hari', '61–90 hari', '90+ hari']

export default function TunggakanPage() {
  const schoolId = useAuthStore((s) => s.currentSchoolId)
  const { data } = useTagihan({ schoolId })
  const [bucket, setBucket] = useState('all')

  const arrears = useMemo(
    () =>
      (data ?? [])
        .filter((t) => t.status === 'overdue' || t.status === 'partial')
        .map((t) => {
          const days = ageDays(t.dueDate)
          return { ...t, days, bucket: bucketOf(days), sisa: t.totalAmount - t.paidAmount }
        }),
    [data]
  )

  const totals = useMemo(() => {
    const t = [0, 0, 0, 0]
    let sum = 0
    for (const a of arrears) {
      t[a.bucket] += a.sisa
      sum += a.sisa
    }
    return { buckets: t, sum }
  }, [arrears])

  const perSchool = useMemo(() => {
    return mockSekolah
      .map((s) => {
        const items = arrears.filter((a) => a.schoolId === s.id)
        const row: Record<string, number | string> = { name: s.kode }
        BUCKET_LABELS.forEach((label, i) => {
          row[label] = items.filter((a) => a.bucket === i).reduce((acc, a) => acc + a.sisa, 0)
        })
        return row
      })
      .filter((r) => BUCKET_LABELS.some((l) => (r[l] as number) > 0))
  }, [arrears])

  const rows = useMemo(
    () => (bucket === 'all' ? arrears : arrears.filter((a) => a.bucket === Number(bucket))),
    [arrears, bucket]
  )

  const exportData = rows.map((a) => ({
    Siswa: a.studentName,
    Kategori: a.categoryName,
    Periode: a.billingPeriod,
    'Jatuh Tempo': a.dueDate,
    'Umur (hari)': a.days,
    Sisa: a.sisa,
    Status: a.status,
  }))

  return (
    <>
      <PageHeader
        title="Tunggakan & Aging"
        description="Analisis umur tunggakan (status terlambat & dibayar sebagian)."
        actions={<ExportButton data={exportData} filename="tunggakan-aging" />}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard title="Total Tunggakan" value={totals.sum} isRupiah valueClassName="text-rose-600" />
        {BUCKET_LABELS.map((label, i) => (
          <StatCard key={label} title={label} value={totals.buckets[i]} isRupiah />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aging per Sekolah</CardTitle>
          <CardDescription>Distribusi tunggakan menurut umur</CardDescription>
        </CardHeader>
        <CardContent>
          {perSchool.length === 0 ? (
            <EmptyState description="Tidak ada tunggakan." />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={perSchool} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickFormatter={(v) => formatRupiahCompact(Number(v))} tickLine={false} axisLine={false} fontSize={11} width={70} />
                <Tooltip formatter={(value) => formatRupiah(Number(value))} />
                <Legend />
                <Bar dataKey={BUCKET_LABELS[0]} stackId="a" fill={CHART.b1} />
                <Bar dataKey={BUCKET_LABELS[1]} stackId="a" fill={CHART.b2} />
                <Bar dataKey={BUCKET_LABELS[2]} stackId="a" fill={CHART.b3} />
                <Bar dataKey={BUCKET_LABELS[3]} stackId="a" fill={CHART.b4} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Rincian Tunggakan</h3>
            <FilterSelect
              value={bucket}
              onValueChange={setBucket}
              options={[
                { value: 'all', label: 'Semua Umur' },
                { value: '0', label: BUCKET_LABELS[0] },
                { value: '1', label: BUCKET_LABELS[1] },
                { value: '2', label: BUCKET_LABELS[2] },
                { value: '3', label: BUCKET_LABELS[3] },
              ]}
            />
          </div>
          {rows.length === 0 ? (
            <EmptyState description="Tidak ada tunggakan pada filter ini." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Umur</TableHead>
                  <TableHead className="text-right">Sisa</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.studentName}</TableCell>
                    <TableCell>{a.categoryName}</TableCell>
                    <TableCell>{formatDateShort(a.dueDate)}</TableCell>
                    <TableCell>
                      <Badge variant={a.bucket >= 3 ? 'destructive' : a.bucket >= 1 ? 'warning' : 'secondary'}>
                        {a.days} hari
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-rose-600">{formatRupiah(a.sisa)}</TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  )
}
