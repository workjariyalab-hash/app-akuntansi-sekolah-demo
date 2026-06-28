'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { useKasir, useKasirStats, useCreateKasir } from '@/hooks/use-kasir'
import { useAkun } from '@/hooks/use-akun'
import { useAuthStore } from '@/stores/auth-store'
import { mockSekolah } from '@/lib/mock-data'
import { formatRupiah, formatDateShort } from '@/lib/format'

export default function KasirPage() {
  const user = useAuthStore((s) => s.user)
  const globalSchool = useAuthStore((s) => s.currentSchoolId)
  const schoolId = user?.role === 'kasir' ? user.schoolId ?? globalSchool : globalSchool
  const canRecord = user?.role === 'foundation_admin' || user?.role === 'kasir'

  const { data: stats } = useKasirStats(schoolId)
  const { data: txns } = useKasir({ schoolId })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'receipt' | 'payment'>('receipt')

  const openDialog = (type: 'receipt' | 'payment') => {
    setDialogType(type)
    setDialogOpen(true)
  }

  const exportData = (txns ?? []).map((t) => ({
    Referensi: t.referenceNumber,
    Tanggal: t.date,
    Jenis: t.type === 'receipt' ? 'Penerimaan' : 'Pengeluaran',
    Kategori: t.category,
    Keterangan: t.description,
    Jumlah: t.amount,
    Status: t.status,
  }))

  return (
    <>
      <PageHeader
        title="Kasir"
        description="Penerimaan dan pengeluaran kas di luar virtual account."
        actions={
          <>
            <ExportButton data={exportData} filename="transaksi-kas" />
            {canRecord && (
              <>
                <Button variant="outline" onClick={() => openDialog('payment')}>
                  <ArrowUpCircle className="h-4 w-4" />
                  Pengeluaran
                </Button>
                <Button onClick={() => openDialog('receipt')}>
                  <ArrowDownCircle className="h-4 w-4" />
                  Penerimaan
                </Button>
              </>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Penerimaan (terposting)" value={stats?.totalReceipt ?? 0} isRupiah valueClassName="text-emerald-600" icon={<ArrowDownCircle className="h-5 w-5" />} />
        <StatCard title="Pengeluaran (terposting)" value={stats?.totalPayment ?? 0} isRupiah valueClassName="text-rose-600" icon={<ArrowUpCircle className="h-5 w-5" />} />
        <StatCard title="Arus Kas Bersih" value={stats?.netCashFlow ?? 0} isRupiah icon={<Wallet className="h-5 w-5" />} />
        <StatCard title="Menunggu Posting" value={stats?.draftCount ?? 0} description="transaksi draf" />
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h3 className="text-sm font-medium">Transaksi Kas</h3>
          {(txns?.length ?? 0) === 0 ? (
            <EmptyState description="Belum ada transaksi kas." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referensi</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txns!.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs">{t.referenceNumber}</TableCell>
                    <TableCell>{formatDateShort(t.date)}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.type === 'receipt' ? 'active' : 'reversed'} label={t.type === 'receipt' ? 'Penerimaan' : 'Pengeluaran'} />
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate text-muted-foreground">{t.description}</TableCell>
                    <TableCell className={`text-right tabular-nums ${t.type === 'receipt' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'receipt' ? '+' : '−'}{formatRupiah(t.amount)}
                    </TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {canRecord && <KasDialog open={dialogOpen} onOpenChange={setDialogOpen} type={dialogType} createdBy={user?.name ?? ''} defaultSchool={schoolId === 'all' ? 'school-1' : schoolId} />}
    </>
  )
}

function KasDialog({
  open,
  onOpenChange,
  type,
  createdBy,
  defaultSchool,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  type: 'receipt' | 'payment'
  createdBy: string
  defaultSchool: string
}) {
  const { data: akun } = useAkun({ isActive: true })
  const createKasir = useCreateKasir()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [school, setSchool] = useState(defaultSchool)
  const [account, setAccount] = useState('')

  const postable = (akun ?? []).filter((a) => a.parentId)

  const submit = async () => {
    if (!amount || !category) {
      toast.error('Jumlah dan kategori wajib diisi.')
      return
    }
    await createKasir.mutateAsync({
      schoolId: school,
      type,
      date: new Date().toISOString().split('T')[0],
      amount: Number(amount),
      category,
      description,
      status: 'draft',
      referenceNumber: `${type === 'receipt' ? 'BKM' : 'BKK'}-${Date.now().toString().slice(-6)}`,
      createdBy,
    })
    toast.success(`${type === 'receipt' ? 'Penerimaan' : 'Pengeluaran'} kas dicatat (draf, menunggu posting akuntan).`)
    onOpenChange(false)
    setAmount(''); setCategory(''); setDescription(''); setAccount('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{type === 'receipt' ? 'Catat Penerimaan Kas' : 'Catat Pengeluaran Kas'}</DialogTitle>
          <DialogDescription>Transaksi disimpan sebagai draf hingga di-posting ke buku besar.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Sekolah</Label>
              <FilterSelect className="w-full" value={school} onValueChange={setSchool} options={mockSekolah.map((s) => ({ value: s.id, label: s.kode }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Jumlah (Rp)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder={type === 'receipt' ? 'cth. Uang Pangkal' : 'cth. Pembelian ATK'} />
          </div>
          <div className="space-y-1.5">
            <Label>{type === 'receipt' ? 'Akun Pendapatan (kredit)' : 'Akun Beban (debit)'}</Label>
            <FilterSelect
              className="w-full"
              value={account}
              onValueChange={setAccount}
              placeholder="Pilih akun GL"
              options={postable.map((a) => ({ value: a.id, label: `${a.code} — ${a.name}` }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Keterangan</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={submit} disabled={createKasir.isPending}>Simpan Transaksi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
