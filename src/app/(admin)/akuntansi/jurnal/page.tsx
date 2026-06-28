'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2, CheckCircle2, ScrollText } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
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
import { useJurnal, useJurnalLines, useCreateJurnal, usePostJurnal } from '@/hooks/use-jurnal'
import { useAkun } from '@/hooks/use-akun'
import { useAuthStore } from '@/stores/auth-store'
import { formatRupiah, formatDateShort, tipeJurnalLabel, tipeJurnalVariant } from '@/lib/format'
import type { Journal } from '@/types'

function JenisBadge({ type }: { type: string }) {
  return <Badge variant={tipeJurnalVariant[type] as 'info'}>{tipeJurnalLabel[type]}</Badge>
}

export default function JurnalPage() {
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const { data: journals } = useJurnal({
    type: type === 'all' ? undefined : (type as never),
    status: status === 'all' ? undefined : (status as never),
  })
  const [detail, setDetail] = useState<Journal | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <PageHeader
        title="Jurnal Transaksi"
        description="Seluruh entri buku besar — otomatis dari modul lain maupun manual."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Buat Jurnal Manual
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              value={type}
              onValueChange={setType}
              options={[
                { value: 'all', label: 'Semua Tipe' },
                { value: 'auto', label: 'Otomatis' },
                { value: 'manual', label: 'Manual' },
                { value: 'adjustment', label: 'Penyesuaian' },
                { value: 'reversal', label: 'Pembalik' },
                { value: 'closing', label: 'Penutup' },
              ]}
            />
            <FilterSelect
              value={status}
              onValueChange={setStatus}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'draft', label: 'Draf' },
                { value: 'posted', label: 'Terposting' },
              ]}
            />
          </div>

          {(journals?.length ?? 0) === 0 ? (
            <EmptyState description="Tidak ada jurnal." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Jurnal</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Kredit</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journals!.map((j) => (
                  <TableRow key={j.id} className="cursor-pointer" onClick={() => setDetail(j)}>
                    <TableCell className="font-mono text-xs">{j.journalNumber}</TableCell>
                    <TableCell>{formatDateShort(j.date)}</TableCell>
                    <TableCell><JenisBadge type={j.type} /></TableCell>
                    <TableCell className="max-w-[320px] truncate">{j.description}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatRupiah(j.totalDebit)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatRupiah(j.totalCredit)}</TableCell>
                    <TableCell><StatusBadge status={j.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <JurnalDetailSheet journal={detail} onClose={() => setDetail(null)} />
      <CreateJurnalDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}

function JurnalDetailSheet({ journal, onClose }: { journal: Journal | null; onClose: () => void }) {
  const { data: lines } = useJurnalLines(journal?.id ?? null)
  const post = usePostJurnal()
  const user = useAuthStore((s) => s.user)

  const doPost = async () => {
    if (!journal) return
    await post.mutateAsync({ id: journal.id, postedBy: user?.name ?? 'Akuntan' })
    toast.success('Jurnal diposting ke buku besar.')
    onClose()
  }

  return (
    <Sheet open={!!journal} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ScrollText className="h-4 w-4" />
            {journal?.journalNumber}
          </SheetTitle>
          <SheetDescription>{journal?.description}</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          {journal && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <JenisBadge type={journal.type} />
              <StatusBadge status={journal.status} />
              <span className="text-muted-foreground">{formatDateShort(journal.date)}</span>
              {journal.postedBy && <span className="text-muted-foreground">· oleh {journal.postedBy}</span>}
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Akun</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Kredit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(lines ?? []).map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <span className="font-mono text-xs text-muted-foreground">{l.accountCode}</span> {l.accountName}
                    <span className="block text-xs text-muted-foreground">{l.description}</span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{l.debit ? formatRupiah(l.debit) : '—'}</TableCell>
                  <TableCell className="text-right tabular-nums">{l.credit ? formatRupiah(l.credit) : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {journal?.status === 'draft' && (
          <SheetFooter>
            <Button onClick={doPost} disabled={post.isPending}>
              <CheckCircle2 className="h-4 w-4" />
              Posting ke Buku Besar
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

interface DraftLine {
  id: string
  accountId: string
  debit: string
  credit: string
}

function CreateJurnalDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { data: akun } = useAkun({ isActive: true })
  const create = useCreateJurnal()
  const [description, setDescription] = useState('')
  const [lines, setLines] = useState<DraftLine[]>([
    { id: '1', accountId: '', debit: '', credit: '' },
    { id: '2', accountId: '', debit: '', credit: '' },
  ])

  const postable = (akun ?? []).filter((a) => a.parentId)
  const totalDebit = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0)
  const totalCredit = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0)
  const balanced = totalDebit === totalCredit && totalDebit > 0

  const setLine = (id: string, patch: Partial<DraftLine>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  const addLine = () => setLines((ls) => [...ls, { id: crypto.randomUUID(), accountId: '', debit: '', credit: '' }])
  const removeLine = (id: string) => setLines((ls) => (ls.length > 2 ? ls.filter((l) => l.id !== id) : ls))

  const submit = async () => {
    if (!description) {
      toast.error('Isi keterangan jurnal.')
      return
    }
    if (!balanced) {
      toast.error('Jurnal tidak balance — total debit harus sama dengan kredit.')
      return
    }
    await create.mutateAsync({
      journal: { date: new Date().toISOString().split('T')[0], type: 'manual', description },
      lines: lines
        .filter((l) => l.accountId)
        .map((l) => {
          const acc = postable.find((a) => a.id === l.accountId)
          return {
            accountCode: acc?.code,
            accountName: acc?.name,
            schoolId: 'school-1',
            debit: Number(l.debit) || 0,
            credit: Number(l.credit) || 0,
            description,
          }
        }),
    })
    toast.success('Jurnal manual dibuat (draf). Tinjau lalu posting.')
    onOpenChange(false)
    setDescription('')
    setLines([
      { id: '1', accountId: '', debit: '', credit: '' },
      { id: '2', accountId: '', debit: '', credit: '' },
    ])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buat Jurnal Manual</DialogTitle>
          <DialogDescription>Sistem menolak jurnal yang tidak balance.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Keterangan</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="cth. Penyesuaian akrual beban listrik" />
          </div>

          <div className="space-y-2">
            {lines.map((l) => (
              <div key={l.id} className="flex items-center gap-2">
                <FilterSelect
                  className="flex-1"
                  value={l.accountId}
                  onValueChange={(v) => setLine(l.id, { accountId: v })}
                  placeholder="Pilih akun"
                  options={postable.map((a) => ({ value: a.id, label: `${a.code} — ${a.name}` }))}
                />
                <Input
                  className="w-32"
                  type="number"
                  placeholder="Debit"
                  value={l.debit}
                  onChange={(e) => setLine(l.id, { debit: e.target.value, credit: '' })}
                />
                <Input
                  className="w-32"
                  type="number"
                  placeholder="Kredit"
                  value={l.credit}
                  onChange={(e) => setLine(l.id, { credit: e.target.value, debit: '' })}
                />
                <Button variant="ghost" size="icon-sm" onClick={() => removeLine(l.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addLine}>
              <Plus className="h-4 w-4" />
              Tambah Baris
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 text-sm">
            <span className="font-medium">Total</span>
            <div className="flex items-center gap-6 tabular-nums">
              <span>D: {formatRupiah(totalDebit)}</span>
              <span>K: {formatRupiah(totalCredit)}</span>
              <Badge variant={balanced ? 'success' : 'warning'}>
                {balanced ? 'Balance ✓' : `Selisih ${formatRupiah(Math.abs(totalDebit - totalCredit))}`}
              </Badge>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={submit} disabled={!balanced || create.isPending}>Simpan Jurnal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
