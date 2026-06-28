'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Target, TrendingUp, TrendingDown } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { FilterSelect } from '@/components/shared/filter-select'
import { ExportButton } from '@/components/shared/export-button'
import { EmptyState } from '@/components/shared/states'
import { useBudgeting, useBudgetingStats, useCreateBudgetItem } from '@/hooks/use-budgeting'
import { useAuthStore } from '@/stores/auth-store'
import { mockSekolah } from '@/lib/mock-data'
import { formatRupiah, formatRupiahCompact } from '@/lib/format'

export default function BudgetingPage() {
  const schoolId = useAuthStore((s) => s.currentSchoolId)
  const { data: items } = useBudgeting({ schoolId })
  const { data: stats } = useBudgetingStats(schoolId)
  const [dialogOpen, setDialogOpen] = useState(false)

  const exportData = (items ?? []).map((b) => ({
    Kategori: b.categoryName,
    Sekolah: b.schoolName,
    Periode: b.period,
    Budget: b.plannedAmount,
    Realisasi: b.actualAmount,
    Variance: b.variance,
  }))

  return (
    <>
      <PageHeader
        title="Budgeting"
        description="Rencana anggaran vs realisasi per kategori dan sekolah."
        actions={
          <>
            <ExportButton data={exportData} filename="budgeting" />
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Tetapkan Budget
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Budget" value={stats?.totalPlanned ?? 0} isRupiah icon={<Target className="h-5 w-5" />} />
        <StatCard title="Total Realisasi" value={stats?.totalActual ?? 0} isRupiah icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard
          title="Variance"
          value={stats?.totalVariance ?? 0}
          isRupiah
          valueClassName={(stats?.totalVariance ?? 0) < 0 ? 'text-rose-600' : 'text-emerald-600'}
          icon={<TrendingDown className="h-5 w-5" />}
        />
        <StatCard title="Tingkat Penyerapan" value={`${(stats?.utilizationRate ?? 0).toFixed(1)}%`} />
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          {(items?.length ?? 0) === 0 ? (
            <EmptyState description="Belum ada rencana budget." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Sekolah</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Realisasi</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items!.map((b) => {
                  const pct = b.plannedAmount ? (b.variance / b.plannedAmount) * 100 : 0
                  const over = b.variance < 0
                  return (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.categoryName}</TableCell>
                      <TableCell className="text-muted-foreground">{b.schoolName}</TableCell>
                      <TableCell>{b.period}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatRupiah(b.plannedAmount)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatRupiah(b.actualAmount)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`tabular-nums ${over ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {formatRupiahCompact(b.variance)}
                          </span>
                          <Badge variant={over ? 'destructive' : 'success'}>{pct.toFixed(0)}%</Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <BudgetDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}

function BudgetDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const create = useCreateBudgetItem()
  const [categoryName, setCategoryName] = useState('')
  const [schoolId, setSchoolId] = useState('school-1')
  const [period, setPeriod] = useState('2026')
  const [planned, setPlanned] = useState('')

  const submit = async () => {
    if (!categoryName || !planned) {
      toast.error('Kategori dan nominal budget wajib diisi.')
      return
    }
    const school = mockSekolah.find((s) => s.id === schoolId)
    await create.mutateAsync({
      categoryName,
      schoolId,
      schoolName: school?.name,
      period,
      plannedAmount: Number(planned),
    })
    toast.success('Rencana budget ditetapkan.')
    onOpenChange(false)
    setCategoryName(''); setPlanned('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tetapkan Budget</DialogTitle>
          <DialogDescription>Rencana anggaran per kategori per periode.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="cth. Pendapatan SPP" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Sekolah</Label>
              <FilterSelect className="w-full" value={schoolId} onValueChange={setSchoolId} options={mockSekolah.map((s) => ({ value: s.id, label: s.kode }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Periode</Label>
              <FilterSelect className="w-full" value={period} onValueChange={setPeriod} options={[{ value: '2026', label: 'Tahun 2026' }, { value: '2026-S1', label: 'Semester 1 2026' }, { value: '2026-S2', label: 'Semester 2 2026' }]} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Nominal Budget (Rp)</Label>
            <Input type="number" value={planned} onChange={(e) => setPlanned(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={submit} disabled={create.isPending}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
