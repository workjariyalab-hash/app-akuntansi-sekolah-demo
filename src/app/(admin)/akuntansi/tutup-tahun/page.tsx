'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, Circle, AlertTriangle, Lock } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useJurnalStats } from '@/hooks/use-jurnal'
import { useAkun } from '@/hooks/use-akun'
import { useAuthStore } from '@/stores/auth-store'
import { trialBalance, incomeStatement } from '@/lib/gl'
import { formatRupiah } from '@/lib/format'

export default function TutupTahunPage() {
  const user = useAuthStore((s) => s.user)
  const { data: jurnalStats } = useJurnalStats()
  const { data: akun } = useAkun()

  const tb = useMemo(() => trialBalance(akun ?? []), [akun])
  const is = useMemo(() => incomeStatement(akun ?? []), [akun])

  const [reportsPrinted, setReportsPrinted] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)
  const [closed, setClosed] = useState(false)

  const jurnalReady = (jurnalStats?.draft ?? 0) === 0
  const canClose = jurnalReady && tb.balanced && reportsPrinted && !closed

  const execute = () => {
    setClosed(true)
    setConfirmOpen(false)
    setAcknowledged(false)
    toast.success('Tutup tahun selesai — akun nominal ditutup ke ekuitas, periode dikunci.')
  }

  const canInitiate = user?.role === 'foundation_admin' || user?.role === 'akuntan'

  return (
    <>
      <PageHeader
        title="Tutup Tahun"
        description="Proses akhir tahun: menutup akun pendapatan & beban ke ekuitas."
      />

      {closed && (
        <Card className="ring-emerald-200">
          <CardContent className="flex items-center gap-3 p-5">
            <Lock className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-medium text-emerald-700">Tahun Buku 2026 Telah Ditutup</p>
              <p className="text-sm text-muted-foreground">
                Surplus {formatRupiah(is.surplus)} dipindahkan ke Surplus Ditahan. Periode dikunci untuk transaksi baru.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Prasyarat Tutup Buku</CardTitle>
          <CardDescription>Seluruh prasyarat harus terpenuhi sebelum proses dapat dijalankan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <CheckItem
            done={jurnalReady}
            title="Semua jurnal telah di-posting"
            detail={jurnalReady ? 'Tidak ada jurnal draf tersisa.' : `${jurnalStats?.draft} jurnal masih berstatus draf.`}
          />
          <CheckItem
            done={tb.balanced}
            title="Neraca Saldo seimbang"
            detail={tb.balanced ? `Debit = Kredit = ${formatRupiah(tb.totalDebit)}` : `Selisih ${formatRupiah(Math.abs(tb.difference))}`}
          />
          <CheckItem
            done={reportsPrinted}
            title="Laporan keuangan final telah dicetak/diarsipkan"
            detail="Neraca & Laporan Surplus-Defisit sebagai arsip."
            action={
              !reportsPrinted && (
                <Button size="sm" variant="outline" onClick={() => setReportsPrinted(true)}>
                  Tandai selesai
                </Button>
              )
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
            <div>
              <p className="font-medium">Mulai Proses Tutup Tahun</p>
              <p className="text-sm text-muted-foreground">
                Tindakan ini membuat jurnal penutup, memindahkan surplus ke ekuitas, dan mengunci periode. Tidak dapat dibatalkan.
              </p>
            </div>
          </div>
          <Button
            size="lg"
            disabled={!canClose || !canInitiate}
            onClick={() => setConfirmOpen(true)}
          >
            <Lock className="h-4 w-4" />
            Mulai Tutup Tahun
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={(v) => { setConfirmOpen(v); if (!v) setAcknowledged(false) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Konfirmasi Tutup Tahun
            </DialogTitle>
            <DialogDescription>
              Anda akan menutup tahun buku 2026 secara permanen. Surplus tahun berjalan sebesar{' '}
              <span className="font-semibold text-foreground">{formatRupiah(is.surplus)}</span> akan dipindahkan ke
              Surplus Ditahan.
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            onClick={() => setAcknowledged((v) => !v)}
            className="flex items-start gap-2.5 rounded-lg border p-3 text-left text-sm"
          >
            {acknowledged ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span>Saya memahami bahwa proses ini tidak dapat dibatalkan dan periode 2026 akan dikunci.</span>
          </button>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Batal</Button>
            <Button disabled={!acknowledged} onClick={execute}>
              Ya, Tutup Tahun Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function CheckItem({
  done,
  title,
  detail,
  action,
}: {
  done: boolean
  title: string
  detail: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="flex items-start gap-3">
        {done ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        ) : (
          <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        )}
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{detail}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {action}
        <Badge variant={done ? 'success' : 'secondary'}>{done ? 'Siap' : 'Belum'}</Badge>
      </div>
    </div>
  )
}
