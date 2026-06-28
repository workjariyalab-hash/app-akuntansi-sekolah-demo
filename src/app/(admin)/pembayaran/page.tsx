'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Banknote, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
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
import { StatusBadge } from '@/components/shared/status-badge'
import { ExportButton } from '@/components/shared/export-button'
import { EmptyState } from '@/components/shared/states'
import { usePembayaran, useCreatePembayaran } from '@/hooks/use-pembayaran'
import { useSiswa } from '@/hooks/use-siswa'
import { useTagihan } from '@/hooks/use-tagihan'
import { useAuthStore } from '@/stores/auth-store'
import { formatRupiah, formatDateShort } from '@/lib/format'

export default function PembayaranPage() {
  const user = useAuthStore((s) => s.user)
  const canRecord = user?.role === 'foundation_admin' || user?.role === 'kasir'
  const { data: vaPayments } = usePembayaran({ method: 'va' })
  const { data: cashPayments } = usePembayaran({ method: 'cash' })
  const [dialogOpen, setDialogOpen] = useState(false)

  const exportData = (vaPayments ?? []).map((p) => ({
    Kuitansi: p.receiptNumber,
    Siswa: p.studentName,
    Tanggal: p.paidAt,
    Jumlah: p.amount,
    Metode: 'VA',
  }))

  return (
    <>
      <PageHeader
        title="Pembayaran"
        description="Pantau pembayaran via virtual account dan catat pembayaran tunai."
        actions={<ExportButton data={exportData} filename="pembayaran-va" />}
      />

      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="va">
            <TabsList>
              <TabsTrigger value="va">VA Otomatis</TabsTrigger>
              <TabsTrigger value="cash">Tunai (Manual)</TabsTrigger>
            </TabsList>

            <TabsContent value="va" className="pt-4">
              <PaymentTable rows={vaPayments ?? []} methodLabel="Virtual Account" />
            </TabsContent>

            <TabsContent value="cash" className="space-y-4 pt-4">
              {canRecord && (
                <div className="flex justify-end">
                  <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Catat Pembayaran Tunai
                  </Button>
                </div>
              )}
              <PaymentTable rows={cashPayments ?? []} methodLabel="Tunai" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {canRecord && <CatatTunaiDialog open={dialogOpen} onOpenChange={setDialogOpen} recordedBy={user?.name ?? ''} />}
    </>
  )
}

function PaymentTable({ rows, methodLabel }: { rows: { id: string; receiptNumber: string; studentName: string; paidAt: string; amount: number; recordedBy: string }[]; methodLabel: string }) {
  if (rows.length === 0) return <EmptyState description="Belum ada pembayaran." />
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No. Kuitansi</TableHead>
          <TableHead>Siswa</TableHead>
          <TableHead>Waktu</TableHead>
          <TableHead>Metode</TableHead>
          <TableHead>Dicatat oleh</TableHead>
          <TableHead className="text-right">Jumlah</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-mono text-xs">{p.receiptNumber}</TableCell>
            <TableCell className="font-medium">{p.studentName}</TableCell>
            <TableCell>{formatDateShort(p.paidAt)}</TableCell>
            <TableCell><StatusBadge status="active" label={methodLabel} /></TableCell>
            <TableCell className="text-muted-foreground">{p.recordedBy}</TableCell>
            <TableCell className="text-right tabular-nums text-emerald-600">{formatRupiah(p.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function CatatTunaiDialog({ open, onOpenChange, recordedBy }: { open: boolean; onOpenChange: (v: boolean) => void; recordedBy: string }) {
  const schoolId = useAuthStore((s) => s.currentSchoolId)
  const { data: siswa } = useSiswa({ schoolId })
  const [studentId, setStudentId] = useState('')
  const { data: tagihan } = useTagihan({ studentId: studentId || undefined })
  const [billId, setBillId] = useState('')
  const [amount, setAmount] = useState('')
  const createPembayaran = useCreatePembayaran()

  const outstanding = useMemo(
    () => (tagihan ?? []).filter((t) => t.status !== 'paid' && t.status !== 'superseded'),
    [tagihan]
  )

  const submit = async () => {
    if (!studentId || !billId || !amount) {
      toast.error('Lengkapi data pembayaran.')
      return
    }
    const student = siswa?.find((s) => s.id === studentId)
    await createPembayaran.mutateAsync({
      billId,
      studentName: student?.name,
      amount: Number(amount),
      method: 'cash',
      recordedBy,
    })
    toast.success('Pembayaran tunai dicatat & kuitansi diterbitkan.')
    onOpenChange(false)
    setStudentId(''); setBillId(''); setAmount('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Catat Pembayaran Tunai</DialogTitle>
          <DialogDescription>Status tagihan & saldo diperbarui real-time.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Siswa</Label>
            <FilterSelect className="w-full" value={studentId} onValueChange={(v) => { setStudentId(v); setBillId(''); }} placeholder="Pilih siswa" options={(siswa ?? []).map((s) => ({ value: s.id, label: `${s.name} — ${s.kelas}` }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Tagihan</Label>
            <FilterSelect
              className="w-full"
              value={billId}
              onValueChange={(v) => {
                setBillId(v)
                const bill = outstanding.find((t) => t.id === v)
                if (bill) setAmount(String(bill.totalAmount - bill.paidAmount))
              }}
              placeholder={studentId ? 'Pilih tagihan' : 'Pilih siswa dahulu'}
              options={outstanding.map((t) => ({ value: t.id, label: `${t.categoryName} ${t.billingPeriod} — sisa ${formatRupiah(t.totalAmount - t.paidAmount)}` }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Jumlah Bayar (Rp)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={submit} disabled={createPembayaran.isPending}>
            <Banknote className="h-4 w-4" />
            Catat & Cetak Kuitansi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
