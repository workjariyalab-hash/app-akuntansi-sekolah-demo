'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FilePlus, Search } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FilterSelect } from '@/components/shared/filter-select'
import { StatusBadge } from '@/components/shared/status-badge'
import { ExportButton } from '@/components/shared/export-button'
import { EmptyState, TableSkeleton } from '@/components/shared/states'
import { useTagihan, useCreateTagihan } from '@/hooks/use-tagihan'
import { useSiswa } from '@/hooks/use-siswa'
import { useAuthStore } from '@/stores/auth-store'
import { formatRupiah, formatDateShort } from '@/lib/format'

export default function TagihanPage() {
  const user = useAuthStore((s) => s.user)
  const globalSchool = useAuthStore((s) => s.currentSchoolId)
  const isTeacher = user?.role === 'teacher'
  const effectiveSchool = isTeacher ? user?.schoolId ?? 'all' : globalSchool

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [period, setPeriod] = useState('all')
  const [sheetOpen, setSheetOpen] = useState(false)

  const { data, isLoading } = useTagihan({
    schoolId: effectiveSchool,
    status: status === 'all' ? undefined : (status as never),
    billingPeriod: period === 'all' ? undefined : period,
  })

  const periods = useMemo(() => {
    const set = new Set((data ?? []).map((t) => t.billingPeriod))
    return Array.from(set)
  }, [data])

  const rows = useMemo(() => {
    let list = data ?? []
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((t) => t.studentName.toLowerCase().includes(q))
    }
    return list
  }, [data, search])

  const exportData = rows.map((t) => ({
    Siswa: t.studentName,
    Kategori: t.categoryName,
    Periode: t.billingPeriod,
    'Jatuh Tempo': t.dueDate,
    Total: t.totalAmount,
    Dibayar: t.paidAmount,
    Status: t.status,
  }))

  return (
    <>
      <PageHeader
        title="Tagihan Siswa"
        description={isTeacher ? 'Daftar tagihan siswa di kelas Anda (hanya-lihat).' : 'Kelola dan pantau seluruh tagihan siswa.'}
        actions={
          <>
            <ExportButton data={exportData} filename="tagihan-siswa" />
            {!isTeacher && (
              <Button onClick={() => setSheetOpen(true)}>
                <FilePlus className="h-4 w-4" />
                Buat Tagihan Manual
              </Button>
            )}
          </>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari nama siswa…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 pl-8" />
            </div>
            <FilterSelect
              value={status}
              onValueChange={setStatus}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'pending', label: 'Menunggu' },
                { value: 'partial', label: 'Sebagian' },
                { value: 'overdue', label: 'Terlambat' },
                { value: 'paid', label: 'Lunas' },
              ]}
            />
            <FilterSelect
              value={period}
              onValueChange={setPeriod}
              options={[{ value: 'all', label: 'Semua Periode' }, ...periods.map((p) => ({ value: p, label: p }))]}
            />
          </div>

          {isLoading ? (
            <TableSkeleton cols={7} />
          ) : rows.length === 0 ? (
            <EmptyState description="Tidak ada tagihan yang cocok." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Sisa</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.studentName}</TableCell>
                    <TableCell>{t.categoryName}</TableCell>
                    <TableCell>{t.billingPeriod}</TableCell>
                    <TableCell>{formatDateShort(t.dueDate)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatRupiah(t.totalAmount)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatRupiah(t.totalAmount - t.paidAmount)}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <p className="text-xs text-muted-foreground">Menampilkan {rows.length} tagihan.</p>
        </CardContent>
      </Card>

      {!isTeacher && <TagihanManualSheet open={sheetOpen} onOpenChange={setSheetOpen} schoolId={effectiveSchool} />}
    </>
  )
}

function TagihanManualSheet({
  open,
  onOpenChange,
  schoolId,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  schoolId: string
}) {
  const { data: siswa } = useSiswa({ schoolId })
  const createTagihan = useCreateTagihan()
  const [mode, setMode] = useState('once')
  const [studentId, setStudentId] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [amount, setAmount] = useState('')
  const [period, setPeriod] = useState('')

  const submit = async () => {
    if (!studentId || !categoryName || !amount) {
      toast.error('Lengkapi data tagihan.')
      return
    }
    const student = siswa?.find((s) => s.id === studentId)
    await createTagihan.mutateAsync({
      studentId,
      studentName: student?.name,
      schoolId: student?.schoolId,
      categoryName,
      billingPeriod: period || 'Sekali Bayar',
      totalAmount: Number(amount),
      paidAmount: 0,
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
    })
    toast.success(mode === 'once' ? 'Tagihan satu kali dibuat.' : 'Tagihan koreksi dibuat — tagihan lama ditandai superseded.')
    onOpenChange(false)
    setStudentId(''); setCategoryName(''); setAmount(''); setPeriod('')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Buat Tagihan Manual</SheetTitle>
          <SheetDescription>Pilih mode pembuatan tagihan.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <Tabs value={mode} onValueChange={(v) => setMode(v)}>
            <TabsList className="w-full">
              <TabsTrigger value="once" className="flex-1">Biaya Satu Kali</TabsTrigger>
              <TabsTrigger value="correction" className="flex-1">Koreksi Tagihan</TabsTrigger>
            </TabsList>
            <TabsContent value="once" className="pt-2">
              <p className="text-xs text-muted-foreground">Tagihan berdiri sendiri di luar siklus otomatis.</p>
            </TabsContent>
            <TabsContent value="correction" className="pt-2">
              <p className="text-xs text-muted-foreground">Menggantikan tagihan otomatis; tagihan asli menjadi <span className="font-medium">superseded</span> (disimpan untuk audit).</p>
            </TabsContent>
          </Tabs>

          <div className="space-y-1.5">
            <Label>Siswa</Label>
            <FilterSelect
              className="w-full"
              value={studentId}
              onValueChange={setStudentId}
              placeholder="Pilih siswa"
              options={(siswa ?? []).map((s) => ({ value: s.id, label: `${s.name} — ${s.kelas}` }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Kategori / Keterangan</Label>
            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="cth. Biaya Study Tour" />
          </div>
          <div className="space-y-1.5">
            <Label>Periode</Label>
            <Input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="cth. Juni 2026" />
          </div>
          <div className="space-y-1.5">
            <Label>Nominal (Rp)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>
        <SheetFooter>
          <Button onClick={submit} disabled={createTagihan.isPending}>Buat Tagihan</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
