'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Play, Users, Banknote, CheckCircle2, Printer } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { FilterSelect } from '@/components/shared/filter-select'
import { StatusBadge } from '@/components/shared/status-badge'
import { EmptyState } from '@/components/shared/states'
import {
  usePayrollRuns,
  usePayrollLines,
  useKaryawan,
  usePenggajianStats,
  useCreatePayrollRun,
  useFinalizePayrollRun,
} from '@/hooks/use-penggajian'
import { useAuthStore } from '@/stores/auth-store'
import { mockSekolah } from '@/lib/mock-data'
import { formatRupiah, formatPeriode } from '@/lib/format'
import type { PayrollRun } from '@/types'

export default function PenggajianPage() {
  const user = useAuthStore((s) => s.user)
  const schoolId = useAuthStore((s) => s.currentSchoolId)
  const canManage = user?.role === 'foundation_admin' || user?.role === 'staf_hrd'

  const { data: runs } = usePayrollRuns({ schoolId })
  const { data: karyawan } = useKaryawan(schoolId)
  const { data: stats } = usePenggajianStats(schoolId)
  const [runDialog, setRunDialog] = useState(false)
  const [detailRun, setDetailRun] = useState<PayrollRun | null>(null)

  return (
    <>
      <PageHeader
        title="Penggajian"
        description="Proses gaji, tunjangan, potongan BPJS & PPh 21, serta slip gaji."
        actions={
          canManage && (
            <Button onClick={() => setRunDialog(true)}>
              <Play className="h-4 w-4" />
              Jalankan Payroll
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Karyawan" value={stats?.totalEmployees ?? 0} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Gaji Bruto Terakhir" value={stats?.lastMonthGross ?? 0} isRupiah icon={<Banknote className="h-5 w-5" />} />
        <StatCard title="Gaji Neto Terakhir" value={stats?.lastMonthNet ?? 0} isRupiah icon={<Banknote className="h-5 w-5" />} />
        <StatCard title="Payroll Draf" value={stats?.draftRuns ?? 0} description="menunggu finalisasi" />
      </div>

      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="runs">
            <TabsList>
              <TabsTrigger value="runs">Payroll Run</TabsTrigger>
              <TabsTrigger value="karyawan">Data Karyawan</TabsTrigger>
            </TabsList>

            <TabsContent value="runs" className="pt-4">
              {(runs?.length ?? 0) === 0 ? (
                <EmptyState description="Belum ada payroll run." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Periode</TableHead>
                      <TableHead>Sekolah</TableHead>
                      <TableHead className="text-right">Total Bruto</TableHead>
                      <TableHead className="text-right">Total Neto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-24" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {runs!.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{formatPeriode(r.periodYear, r.periodMonth)}</TableCell>
                        <TableCell className="text-muted-foreground">{r.schoolName}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatRupiah(r.totalGross)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatRupiah(r.totalNet)}</TableCell>
                        <TableCell><StatusBadge status={r.status} /></TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => setDetailRun(r)}>Detail</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="karyawan" className="pt-4">
              {(karyawan?.length ?? 0) === 0 ? (
                <EmptyState description="Belum ada data karyawan." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>Sekolah</TableHead>
                      <TableHead>PTKP</TableHead>
                      <TableHead className="text-right">Gaji Pokok</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {karyawan!.map((k) => (
                      <TableRow key={k.id}>
                        <TableCell className="font-medium">{k.name}</TableCell>
                        <TableCell>{k.position}</TableCell>
                        <TableCell className="text-muted-foreground">{mockSekolah.find((s) => s.id === k.schoolId)?.kode}</TableCell>
                        <TableCell><span className="font-mono text-xs">{k.ptkpStatus}</span></TableCell>
                        <TableCell className="text-right tabular-nums">{formatRupiah(k.baseSalary)}</TableCell>
                        <TableCell><StatusBadge status={k.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {canManage && <RunDialog open={runDialog} onOpenChange={setRunDialog} />}
      <RunDetailSheet run={detailRun} onClose={() => setDetailRun(null)} canManage={canManage} />
    </>
  )
}

function RunDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const create = useCreatePayrollRun()
  const [year, setYear] = useState('2026')
  const [month, setMonth] = useState('7')
  const [schoolId, setSchoolId] = useState('school-1')

  const submit = async () => {
    const school = mockSekolah.find((s) => s.id === schoolId)
    await create.mutateAsync({
      schoolId,
      schoolName: school?.name,
      periodYear: Number(year),
      periodMonth: Number(month),
      totalGross: 0,
      totalNet: 0,
    })
    toast.success(`Payroll ${formatPeriode(Number(year), Number(month))} dibuat (draf). Tinjau lalu finalisasi.`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Jalankan Payroll</DialogTitle>
          <DialogDescription>Sistem menghitung gaji, BPJS, dan PPh 21 otomatis.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Sekolah</Label>
            <FilterSelect className="w-full" value={schoolId} onValueChange={setSchoolId} options={mockSekolah.map((s) => ({ value: s.id, label: s.name }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Bulan</Label>
              <FilterSelect
                className="w-full"
                value={month}
                onValueChange={setMonth}
                options={Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: formatPeriode(2026, i + 1).split(' ')[0] }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tahun</Label>
              <FilterSelect className="w-full" value={year} onValueChange={setYear} options={[{ value: '2025', label: '2025' }, { value: '2026', label: '2026' }]} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={submit} disabled={create.isPending}>Buat Payroll</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RunDetailSheet({ run, onClose, canManage }: { run: PayrollRun | null; onClose: () => void; canManage: boolean }) {
  const { data: lines } = usePayrollLines(run?.id ?? null)
  const finalize = useFinalizePayrollRun()

  const doFinalize = async () => {
    if (!run) return
    await finalize.mutateAsync(run.id)
    toast.success('Payroll difinalisasi — jurnal beban gaji terbentuk & slip diterbitkan.')
    onClose()
  }

  return (
    <Sheet open={!!run} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Detail Payroll</SheetTitle>
          <SheetDescription>
            {run && `${formatPeriode(run.periodYear, run.periodMonth)} · ${run.schoolName}`}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          {(lines?.length ?? 0) === 0 ? (
            <EmptyState description="Belum ada rincian gaji untuk run ini." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Karyawan</TableHead>
                  <TableHead className="text-right">Bruto</TableHead>
                  <TableHead className="text-right">BPJS</TableHead>
                  <TableHead className="text-right">PPh 21</TableHead>
                  <TableHead className="text-right">Neto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines!.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.employeeName}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatRupiah(l.grossSalary)}</TableCell>
                    <TableCell className="text-right tabular-nums text-rose-600">{formatRupiah(l.totalDeductionBpjs)}</TableCell>
                    <TableCell className="text-right tabular-nums text-rose-600">{formatRupiah(l.pph21)}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{formatRupiah(l.netSalary)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right tabular-nums">{formatRupiah(lines!.reduce((s, l) => s + l.grossSalary, 0))}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatRupiah(lines!.reduce((s, l) => s + l.totalDeductionBpjs, 0))}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatRupiah(lines!.reduce((s, l) => s + l.pph21, 0))}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatRupiah(lines!.reduce((s, l) => s + l.netSalary, 0))}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => toast.info('Slip gaji diunduh (demo).')}>
            <Printer className="h-4 w-4" />
            Cetak Slip
          </Button>
          {canManage && run?.status === 'draft' && (
            <Button onClick={doFinalize} disabled={finalize.isPending}>
              <CheckCircle2 className="h-4 w-4" />
              Finalisasi Payroll
            </Button>
          )}
          {run?.status === 'finalized' && (
            <StatusBadge status="finalized" label="Sudah Final" />
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
