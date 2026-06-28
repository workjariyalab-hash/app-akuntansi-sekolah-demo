'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Package, Landmark, TrendingDown } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { StatCard } from '@/components/shared/stat-card'
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
} from '@/components/ui/sheet'
import { FilterSelect } from '@/components/shared/filter-select'
import { StatusBadge } from '@/components/shared/status-badge'
import { ExportButton } from '@/components/shared/export-button'
import { EmptyState } from '@/components/shared/states'
import { useInventaris, useInventarisStats, useCreateInventaris } from '@/hooks/use-inventaris'
import { useAuthStore } from '@/stores/auth-store'
import { mockSekolah } from '@/lib/mock-data'
import { formatRupiah, formatPeriode } from '@/lib/format'
import type { Asset } from '@/types'

const CATEGORIES = ['Tanah', 'Bangunan', 'Kendaraan', 'Peralatan IT', 'Inventaris Kantor', 'Peralatan Lab']

export default function InventarisPage() {
  const schoolId = useAuthStore((s) => s.currentSchoolId)
  const { data: assets } = useInventaris({ schoolId })
  const { data: stats } = useInventarisStats(schoolId)
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [detail, setDetail] = useState<Asset | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const rows = useMemo(() => {
    let list = assets ?? []
    if (category !== 'all') list = list.filter((a) => a.category === category)
    if (status !== 'all') list = list.filter((a) => a.status === status)
    return list
  }, [assets, category, status])

  const exportData = rows.map((a) => ({
    Kode: a.assetCode,
    Nama: a.name,
    Kategori: a.category,
    Sekolah: a.schoolName,
    'Nilai Perolehan': a.acquisitionCost,
    'Nilai Buku': a.bookValue,
    Status: a.status,
  }))

  return (
    <>
      <PageHeader
        title="Inventaris & Aset Tetap"
        description="Pencatatan aset dan penyusutan otomatis bulanan."
        actions={
          <>
            <ExportButton data={exportData} filename="aset-tetap" />
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Tambah Aset
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Aset" value={stats?.totalAssets ?? 0} icon={<Package className="h-5 w-5" />} />
        <StatCard title="Nilai Perolehan" value={stats?.totalAcquisitionCost ?? 0} isRupiah icon={<Landmark className="h-5 w-5" />} />
        <StatCard title="Nilai Buku" value={stats?.totalBookValue ?? 0} isRupiah icon={<Landmark className="h-5 w-5" />} />
        <StatCard title="Akumulasi Penyusutan" value={stats?.totalDepreciation ?? 0} isRupiah valueClassName="text-rose-600" icon={<TrendingDown className="h-5 w-5" />} />
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              value={category}
              onValueChange={setCategory}
              options={[{ value: 'all', label: 'Semua Kategori' }, ...(stats?.categories ?? CATEGORIES).map((c) => ({ value: c, label: c }))]}
            />
            <FilterSelect
              value={status}
              onValueChange={setStatus}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'active', label: 'Aktif' },
                { value: 'disposed', label: 'Dilepas' },
              ]}
            />
          </div>
          {rows.length === 0 ? (
            <EmptyState description="Tidak ada aset." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Aset</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Sekolah</TableHead>
                  <TableHead className="text-right">Nilai Perolehan</TableHead>
                  <TableHead className="text-right">Nilai Buku</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id} className="cursor-pointer" onClick={() => setDetail(a)}>
                    <TableCell className="font-mono text-xs">{a.assetCode}</TableCell>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell>{a.category}</TableCell>
                    <TableCell className="text-muted-foreground">{mockSekolah.find((s) => s.id === a.schoolId)?.kode}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatRupiah(a.acquisitionCost)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatRupiah(a.bookValue)}</TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <KartuAsetSheet asset={detail} onClose={() => setDetail(null)} />
      <TambahAsetDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}

function KartuAsetSheet({ asset, onClose }: { asset: Asset | null; onClose: () => void }) {
  const schedule = useMemo(() => {
    if (!asset) return []
    const monthly = (asset.acquisitionCost - asset.residualValue) / asset.usefulLifeMonths
    const start = new Date(asset.acquisitionDate)
    let book = asset.acquisitionCost
    const rows = []
    for (let i = 1; i <= Math.min(12, asset.usefulLifeMonths); i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1)
      const dep =
        asset.depreciationMethod === 'declining_balance'
          ? (book * (2 / asset.usefulLifeMonths))
          : monthly
      book = Math.max(asset.residualValue, book - dep)
      rows.push({ period: formatPeriode(d.getFullYear(), d.getMonth() + 1), dep, book })
    }
    return rows
  }, [asset])

  return (
    <Sheet open={!!asset} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Kartu Aset</SheetTitle>
          <SheetDescription>{asset?.name} · {asset?.assetCode}</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          {asset && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Nilai Perolehan" value={formatRupiah(asset.acquisitionCost)} />
              <Info label="Nilai Residu" value={formatRupiah(asset.residualValue)} />
              <Info label="Umur Manfaat" value={`${asset.usefulLifeMonths} bln`} />
              <Info label="Metode" value={asset.depreciationMethod === 'straight_line' ? 'Garis Lurus' : 'Saldo Menurun'} />
            </div>
          )}
          <div>
            <p className="mb-2 text-sm font-medium">Jadwal Penyusutan (12 bln pertama)</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Periode</TableHead>
                  <TableHead className="text-right">Penyusutan</TableHead>
                  <TableHead className="text-right">Nilai Buku</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((r) => (
                  <TableRow key={r.period}>
                    <TableCell>{r.period}</TableCell>
                    <TableCell className="text-right tabular-nums text-rose-600">{formatRupiah(Math.round(r.dep))}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatRupiah(Math.round(r.book))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

function TambahAsetDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const create = useCreateInventaris()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Peralatan IT')
  const [schoolId, setSchoolId] = useState('school-1')
  const [cost, setCost] = useState('')
  const [life, setLife] = useState('48')
  const [method, setMethod] = useState('straight_line')

  const submit = async () => {
    if (!name || !cost) {
      toast.error('Nama dan nilai perolehan wajib diisi.')
      return
    }
    const school = mockSekolah.find((s) => s.id === schoolId)
    await create.mutateAsync({
      name,
      category,
      schoolId,
      schoolName: school?.name,
      assetCode: `AST-${Date.now().toString().slice(-5)}`,
      acquisitionDate: new Date().toISOString().split('T')[0],
      acquisitionCost: Number(cost),
      residualValue: Math.round(Number(cost) * 0.1),
      usefulLifeMonths: Number(life),
      depreciationMethod: method as never,
      bookValue: Number(cost),
    })
    toast.success('Aset dicatat — jurnal perolehan terbentuk.')
    onOpenChange(false)
    setName(''); setCost('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Aset</DialogTitle>
          <DialogDescription>Penyusutan dihitung otomatis tiap bulan.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nama Aset</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Kategori</Label>
              <FilterSelect className="w-full" value={category} onValueChange={setCategory} options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Sekolah</Label>
              <FilterSelect className="w-full" value={schoolId} onValueChange={setSchoolId} options={mockSekolah.map((s) => ({ value: s.id, label: s.kode }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nilai Perolehan (Rp)</Label>
              <Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Umur (bulan)</Label>
              <Input type="number" value={life} onChange={(e) => setLife(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Metode Penyusutan</Label>
            <FilterSelect
              className="w-full"
              value={method}
              onValueChange={setMethod}
              options={[
                { value: 'straight_line', label: 'Garis Lurus' },
                { value: 'declining_balance', label: 'Saldo Menurun' },
              ]}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={submit} disabled={create.isPending}>Simpan Aset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
