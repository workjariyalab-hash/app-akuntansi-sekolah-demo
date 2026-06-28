'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Receipt, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { StatCard } from '@/components/shared/stat-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
  useAPInvoices,
  useHutangStats,
  useVendors,
  useCreateAPInvoice,
  usePayAPInvoice,
  useCreateVendor,
} from '@/hooks/use-hutang'
import { useAuthStore } from '@/stores/auth-store'
import { mockSekolah } from '@/lib/mock-data'
import { formatRupiah, formatDateShort } from '@/lib/format'
import type { APInvoice } from '@/types'

const TODAY = new Date('2026-06-27')

function dueBadge(inv: APInvoice) {
  if (inv.status === 'paid') return null
  const days = Math.floor((new Date(inv.dueDate).getTime() - TODAY.getTime()) / 86_400_000)
  if (days < 0) return <Badge variant="destructive">Telat {Math.abs(days)} hari</Badge>
  if (days <= 7) return <Badge variant="warning">H-{days}</Badge>
  return <Badge variant="secondary">{days} hari lagi</Badge>
}

export default function HutangPage() {
  const schoolId = useAuthStore((s) => s.currentSchoolId)
  const { data: invoices } = useAPInvoices({ schoolId })
  const { data: vendors } = useVendors()
  const { data: stats } = useHutangStats(schoolId)
  const [payTarget, setPayTarget] = useState<APInvoice | null>(null)
  const [invoiceSheet, setInvoiceSheet] = useState(false)
  const [vendorDialog, setVendorDialog] = useState(false)

  return (
    <>
      <PageHeader
        title="Hutang Usaha"
        description="Kelola faktur vendor, jadwal jatuh tempo, dan pelunasan."
        actions={
          <Button onClick={() => setInvoiceSheet(true)}>
            <Plus className="h-4 w-4" />
            Tambah Faktur
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Outstanding" value={stats?.totalOutstanding ?? 0} isRupiah valueClassName="text-rose-600" icon={<Receipt className="h-5 w-5" />} />
        <StatCard title="Faktur Belum Lunas" value={(stats?.openCount ?? 0) + (stats?.partialCount ?? 0)} icon={<Receipt className="h-5 w-5" />} />
        <StatCard title="Jatuh Tempo Terlewat" value={stats?.overdueCount ?? 0} valueClassName="text-rose-600" icon={<AlertCircle className="h-5 w-5" />} />
      </div>

      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="faktur">
            <TabsList>
              <TabsTrigger value="faktur">Daftar Faktur</TabsTrigger>
              <TabsTrigger value="vendor">Vendor</TabsTrigger>
            </TabsList>

            <TabsContent value="faktur" className="pt-4">
              {(invoices?.length ?? 0) === 0 ? (
                <EmptyState description="Belum ada faktur hutang." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Faktur</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Jatuh Tempo</TableHead>
                      <TableHead className="text-right">Nilai</TableHead>
                      <TableHead className="text-right">Sisa</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-20" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices!.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs">{inv.invoiceNumber}</TableCell>
                        <TableCell className="font-medium">{inv.vendorName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {formatDateShort(inv.dueDate)}
                            {dueBadge(inv)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{formatRupiah(inv.amount)}</TableCell>
                        <TableCell className="text-right tabular-nums text-rose-600">{formatRupiah(inv.amount - inv.paidAmount)}</TableCell>
                        <TableCell><StatusBadge status={inv.status} /></TableCell>
                        <TableCell>
                          {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                            <Button size="sm" variant="outline" onClick={() => setPayTarget(inv)}>Bayar</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="vendor" className="space-y-4 pt-4">
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setVendorDialog(true)}>
                  <Plus className="h-4 w-4" />
                  Tambah Vendor
                </Button>
              </div>
              {(vendors?.length ?? 0) === 0 ? (
                <EmptyState description="Belum ada vendor." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Vendor</TableHead>
                      <TableHead>NPWP</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Kontak</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors!.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">{v.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{v.npwp}</TableCell>
                        <TableCell>{v.bankName} · {v.bankAccount}</TableCell>
                        <TableCell className="text-muted-foreground">{v.contactName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {payTarget && <BayarDialog invoice={payTarget} onClose={() => setPayTarget(null)} />}
      <FakturSheet open={invoiceSheet} onOpenChange={setInvoiceSheet} vendors={vendors ?? []} />
      <VendorDialog open={vendorDialog} onOpenChange={setVendorDialog} />
    </>
  )
}

function BayarDialog({ invoice, onClose }: { invoice: APInvoice; onClose: () => void }) {
  const pay = usePayAPInvoice()
  const sisa = invoice.amount - invoice.paidAmount
  const [amount, setAmount] = useState(String(sisa))

  const submit = async () => {
    await pay.mutateAsync({ id: invoice.id, paymentAmount: Number(amount) })
    toast.success('Pembayaran hutang dicatat — jurnal pelunasan terbentuk.')
    onClose()
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bayar Hutang</DialogTitle>
          <DialogDescription>{invoice.vendorName} · {invoice.invoiceNumber}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
            <span className="text-muted-foreground">Sisa Hutang</span>
            <span className="font-semibold text-rose-600">{formatRupiah(sisa)}</span>
          </div>
          <div className="space-y-1.5">
            <Label>Jumlah Bayar (Rp)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={submit} disabled={pay.isPending}>Bayar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FakturSheet({ open, onOpenChange, vendors }: { open: boolean; onOpenChange: (v: boolean) => void; vendors: { id: string; name: string }[] }) {
  const create = useCreateAPInvoice()
  const [vendorId, setVendorId] = useState('')
  const [schoolId, setSchoolId] = useState('school-1')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')

  const submit = async () => {
    if (!vendorId || !amount) {
      toast.error('Vendor dan nilai wajib diisi.')
      return
    }
    const vendor = vendors.find((v) => v.id === vendorId)
    await create.mutateAsync({
      vendorId,
      vendorName: vendor?.name,
      schoolId,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      amount: Number(amount),
      description,
    })
    toast.success('Faktur hutang dicatat — jurnal (DR Beban / CR Hutang Usaha) terbentuk.')
    onOpenChange(false)
    setVendorId(''); setAmount(''); setDueDate(''); setDescription('')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tambah Faktur Hutang</SheetTitle>
          <SheetDescription>Catat kewajiban kepada vendor.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <div className="space-y-1.5">
            <Label>Vendor</Label>
            <FilterSelect className="w-full" value={vendorId} onValueChange={setVendorId} placeholder="Pilih vendor" options={vendors.map((v) => ({ value: v.id, label: v.name }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Sekolah</Label>
              <FilterSelect className="w-full" value={schoolId} onValueChange={setSchoolId} options={mockSekolah.map((s) => ({ value: s.id, label: s.kode }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Jatuh Tempo</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Nilai (Rp)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Keterangan</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="cth. Pembelian seragam" />
          </div>
        </div>
        <SheetFooter>
          <Button onClick={submit} disabled={create.isPending}>Simpan Faktur</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function VendorDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const create = useCreateVendor()
  const [name, setName] = useState('')
  const [npwp, setNpwp] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [contactName, setContactName] = useState('')

  const submit = async () => {
    if (!name) {
      toast.error('Nama vendor wajib diisi.')
      return
    }
    await create.mutateAsync({ name, npwp, bankName, bankAccount, contactName })
    toast.success(`Vendor "${name}" ditambahkan.`)
    onOpenChange(false)
    setName(''); setNpwp(''); setBankName(''); setBankAccount(''); setContactName('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Vendor</DialogTitle>
          <DialogDescription>Master data vendor/supplier.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nama Vendor</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>NPWP</Label>
            <Input value={npwp} onChange={(e) => setNpwp(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Bank</Label>
              <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>No. Rekening</Label>
              <Input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Nama Kontak</Label>
            <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
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
