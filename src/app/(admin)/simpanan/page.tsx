'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { PiggyBank, ArrowDownCircle, ArrowUpCircle, Search } from 'lucide-react'
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
import {
  useSimpanan,
  useSimpananStats,
  useSimpananTransactions,
  useDepositSimpanan,
  useWithdrawSimpanan,
} from '@/hooks/use-simpanan'
import { useAuthStore } from '@/stores/auth-store'
import { mockSekolah } from '@/lib/mock-data'
import { formatRupiah, formatDateShort } from '@/lib/format'
import type { SavingsAccount } from '@/types'

export default function SimpananPage() {
  const user = useAuthStore((s) => s.user)
  const schoolId = useAuthStore((s) => s.currentSchoolId)
  const canRecord = user?.role === 'foundation_admin' || user?.role === 'kasir'

  const { data: accounts } = useSimpanan({ schoolId })
  const { data: stats } = useSimpananStats(schoolId)
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<SavingsAccount | null>(null)
  const [txDialog, setTxDialog] = useState<{ type: 'deposit' | 'withdrawal' } | null>(null)

  const rows = useMemo(() => {
    let list = accounts ?? []
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((a) => a.studentName.toLowerCase().includes(q))
    }
    return list
  }, [accounts, search])

  const exportData = rows.map((a) => ({
    Siswa: a.studentName,
    Sekolah: mockSekolah.find((s) => s.id === a.schoolId)?.name ?? '',
    Saldo: a.balance,
    Status: a.status,
  }))

  return (
    <>
      <PageHeader
        title="Simpanan Siswa"
        description="Tabungan siswa — tercatat sebagai liabilitas sekolah."
        actions={
          <>
            <ExportButton data={exportData} filename="simpanan-siswa" />
            {canRecord && (
              <>
                <Button variant="outline" onClick={() => setTxDialog({ type: 'withdrawal' })}>
                  <ArrowUpCircle className="h-4 w-4" />
                  Penarikan
                </Button>
                <Button onClick={() => setTxDialog({ type: 'deposit' })}>
                  <ArrowDownCircle className="h-4 w-4" />
                  Setoran
                </Button>
              </>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Simpanan (Liabilitas)" value={stats?.totalBalance ?? 0} isRupiah valueClassName="text-indigo-600" icon={<PiggyBank className="h-5 w-5" />} />
        <StatCard title="Jumlah Rekening Aktif" value={stats?.totalAccounts ?? 0} />
        <StatCard title="Rata-rata Saldo" value={Math.round(stats?.averageBalance ?? 0)} isRupiah />
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari nama siswa…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 pl-8" />
          </div>
          {rows.length === 0 ? (
            <EmptyState description="Tidak ada rekening simpanan." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Sekolah</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.studentName}</TableCell>
                    <TableCell className="text-muted-foreground">{mockSekolah.find((s) => s.id === a.schoolId)?.name}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{formatRupiah(a.balance)}</TableCell>
                    <TableCell><StatusBadge status={a.status === 'active' ? 'active' : 'inactive'} label={a.status === 'active' ? 'Aktif' : 'Ditutup'} /></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setDetail(a)}>Buku</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SimpananDetailSheet account={detail} onClose={() => setDetail(null)} />
      {canRecord && txDialog && (
        <TxDialog
          type={txDialog.type}
          accounts={accounts ?? []}
          recordedBy={user?.name ?? ''}
          onClose={() => setTxDialog(null)}
        />
      )}
    </>
  )
}

function SimpananDetailSheet({ account, onClose }: { account: SavingsAccount | null; onClose: () => void }) {
  const { data: trx } = useSimpananTransactions(account?.id ?? null)
  return (
    <Sheet open={!!account} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Buku Simpanan</SheetTitle>
          <SheetDescription>{account?.studentName}</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Saldo Akhir</p>
            <p className="text-2xl font-bold text-indigo-600">{formatRupiah(account?.balance ?? 0)}</p>
          </div>
          {(trx?.length ?? 0) === 0 ? (
            <EmptyState description="Belum ada mutasi." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trx!.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{formatDateShort(t.date)}</TableCell>
                    <TableCell>
                      <StatusBadge status={t.type === 'deposit' ? 'active' : 'reversed'} label={t.type === 'deposit' ? 'Setoran' : 'Penarikan'} />
                    </TableCell>
                    <TableCell className={`text-right tabular-nums ${t.type === 'deposit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'deposit' ? '+' : '−'}{formatRupiah(t.amount)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatRupiah(t.balanceAfter)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function TxDialog({
  type,
  accounts,
  recordedBy,
  onClose,
}: {
  type: 'deposit' | 'withdrawal'
  accounts: SavingsAccount[]
  recordedBy: string
  onClose: () => void
}) {
  const deposit = useDepositSimpanan()
  const withdraw = useWithdrawSimpanan()
  const [accountId, setAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')

  const submit = async () => {
    if (!accountId || !amount) {
      toast.error('Pilih rekening dan isi jumlah.')
      return
    }
    try {
      if (type === 'deposit') {
        await deposit.mutateAsync({ accountId, amount: Number(amount), notes, recordedBy })
        toast.success('Setoran tercatat — jurnal kas/simpanan terbentuk.')
      } else {
        await withdraw.mutateAsync({ accountId, amount: Number(amount), notes, recordedBy })
        toast.success('Penarikan tercatat.')
      }
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal memproses transaksi.')
    }
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{type === 'deposit' ? 'Catat Setoran' : 'Catat Penarikan'}</DialogTitle>
          <DialogDescription>
            {type === 'deposit' ? 'Menambah saldo simpanan siswa.' : 'Saldo tidak boleh menjadi negatif.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Rekening Siswa</Label>
            <FilterSelect
              className="w-full"
              value={accountId}
              onValueChange={setAccountId}
              placeholder="Pilih rekening"
              options={accounts.map((a) => ({ value: a.id, label: `${a.studentName} — ${formatRupiah(a.balance)}` }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Jumlah (Rp)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Keterangan</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opsional" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={submit} disabled={deposit.isPending || withdraw.isPending}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
