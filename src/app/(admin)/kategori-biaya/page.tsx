'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, CalendarClock } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { FilterSelect } from '@/components/shared/filter-select'
import { StatusBadge } from '@/components/shared/status-badge'
import { EmptyState, CardsSkeleton } from '@/components/shared/states'
import { useKategori, useCreateKategori } from '@/hooks/use-kategori'
import { useAuthStore } from '@/stores/auth-store'
import { mockSekolah } from '@/lib/mock-data'
import { formatRupiah, siklusLabel } from '@/lib/format'

function schedulePreview(issueDay?: number, dueDayOffset?: number) {
  if (!issueDay) return 'Jatuh tempo ' + (dueDayOffset ?? 0) + ' hari setelah terbit'
  const due = issueDay + (dueDayOffset ?? 0)
  return `Terbit tgl. ${issueDay} → Jatuh tempo tgl. ${due} (${dueDayOffset} hari tenggang)`
}

export default function KategoriBiayaPage() {
  const schoolId = useAuthStore((s) => s.currentSchoolId)
  const { data, isLoading } = useKategori({ schoolId })
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <PageHeader
        title="Kategori Biaya"
        description="Definisikan kategori biaya, nominal per jenjang, dan jadwal penagihan."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Tambah Kategori
          </Button>
        }
      />

      {isLoading ? (
        <CardsSkeleton count={6} />
      ) : (data?.length ?? 0) === 0 ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState description="Belum ada kategori biaya." />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data!.map((k) => {
            const school = mockSekolah.find((s) => s.id === k.schoolId)
            return (
              <Card key={k.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle>{k.name}</CardTitle>
                      <p className="mt-0.5 text-xs text-muted-foreground">{school?.name}</p>
                    </div>
                    <Badge variant="secondary">{siklusLabel[k.siklus]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    {k.feeAmounts.map((fa) => (
                      <div key={fa.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{fa.jenjang}</span>
                        <span className="font-semibold tabular-nums">{formatRupiah(fa.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-start gap-2 rounded-md bg-muted/50 p-2.5 text-xs text-muted-foreground">
                    <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{schedulePreview(k.issueDay, k.dueDayOffset)}</span>
                  </div>
                  <StatusBadge status={k.isActive ? 'active' : 'inactive'} />
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <TambahKategoriDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}

function TambahKategoriDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const createKategori = useCreateKategori()
  const [name, setName] = useState('')
  const [schoolId, setSchoolId] = useState('school-1')
  const [siklus, setSiklus] = useState('monthly')
  const [issueDay, setIssueDay] = useState('1')
  const [dueDayOffset, setDueDayOffset] = useState('9')
  const [amount, setAmount] = useState('')

  const submit = async () => {
    if (!name || !amount) {
      toast.error('Nama kategori dan nominal wajib diisi.')
      return
    }
    await createKategori.mutateAsync({
      name,
      schoolId,
      siklus: siklus as never,
      issueDay: siklus === 'one_time' ? undefined : Number(issueDay),
      dueDayOffset: Number(dueDayOffset),
      feeAmounts: [{ id: crypto.randomUUID(), categoryId: '', jenjang: 'Semua Jenjang', amount: Number(amount) }],
    })
    toast.success(`Kategori "${name}" ditambahkan.`)
    onOpenChange(false)
    setName(''); setAmount('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Kategori Biaya</DialogTitle>
          <DialogDescription>Atur siklus dan jadwal penagihan.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nama Kategori</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. SPP Bulanan" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Sekolah</Label>
              <FilterSelect className="w-full" value={schoolId} onValueChange={setSchoolId} options={mockSekolah.map((s) => ({ value: s.id, label: s.name }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Siklus</Label>
              <FilterSelect
                className="w-full"
                value={siklus}
                onValueChange={setSiklus}
                options={[
                  { value: 'monthly', label: 'Bulanan' },
                  { value: 'semester', label: 'Semester' },
                  { value: 'annual', label: 'Tahunan' },
                  { value: 'one_time', label: 'Sekali Bayar' },
                ]}
              />
            </div>
          </div>
          {siklus !== 'one_time' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tanggal Terbit (1–28)</Label>
                <Input type="number" min={1} max={28} value={issueDay} onChange={(e) => setIssueDay(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Tenggang Bayar (hari)</Label>
                <Input type="number" min={0} value={dueDayOffset} onChange={(e) => setDueDayOffset(e.target.value)} />
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Nominal (Rp)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="rounded-md bg-indigo-50 p-2.5 text-xs text-indigo-700">
            {schedulePreview(siklus === 'one_time' ? undefined : Number(issueDay), Number(dueDayOffset))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={submit} disabled={createKategori.isPending}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
