'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  FileText,
  AlertCircle,
  CreditCard,
  Scale,
  TrendingUp,
  BookOpen,
  Banknote,
  Receipt,
  Package,
  PiggyBank,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExportButton } from '@/components/shared/export-button'
import { useAuthStore } from '@/stores/auth-store'
import { useTagihan } from '@/hooks/use-tagihan'
import { usePembayaran } from '@/hooks/use-pembayaran'
import { useAPInvoices } from '@/hooks/use-hutang'
import { useInventaris } from '@/hooks/use-inventaris'
import { useSimpanan } from '@/hooks/use-simpanan'
import { usePayrollRuns } from '@/hooks/use-penggajian'
import { useAkun } from '@/hooks/use-akun'
import { trialBalance } from '@/lib/gl'
import type { Role } from '@/types'

export default function LaporanPage() {
  const user = useAuthStore((s) => s.user)
  const schoolId = useAuthStore((s) => s.currentSchoolId)
  const role = user?.role ?? 'akuntan'

  const { data: tagihan } = useTagihan({ schoolId })
  const { data: pembayaran } = usePembayaran()
  const { data: hutang } = useAPInvoices({ schoolId })
  const { data: aset } = useInventaris({ schoolId })
  const { data: simpanan } = useSimpanan({ schoolId })
  const { data: payroll } = usePayrollRuns({ schoolId })
  const { data: akun } = useAkun()

  const tb = useMemo(() => trialBalance(akun ?? []), [akun])

  const reports = useMemo(
    () => [
      {
        icon: FileText,
        title: 'Laporan Tagihan',
        desc: 'Rekap penagihan per sekolah & periode.',
        roles: ['foundation_admin', 'akuntan'] as Role[],
        data: (tagihan ?? []).map((t) => ({ Siswa: t.studentName, Kategori: t.categoryName, Periode: t.billingPeriod, Total: t.totalAmount, Dibayar: t.paidAmount, Status: t.status })),
        file: 'laporan-tagihan',
      },
      {
        icon: AlertCircle,
        title: 'Laporan Tunggakan',
        desc: 'Daftar tunggakan & aging.',
        roles: ['foundation_admin', 'akuntan'] as Role[],
        data: (tagihan ?? []).filter((t) => t.status === 'overdue' || t.status === 'partial').map((t) => ({ Siswa: t.studentName, 'Jatuh Tempo': t.dueDate, Sisa: t.totalAmount - t.paidAmount, Status: t.status })),
        file: 'laporan-tunggakan',
      },
      {
        icon: CreditCard,
        title: 'Laporan Pembayaran',
        desc: 'Seluruh transaksi pembayaran.',
        roles: ['foundation_admin', 'akuntan'] as Role[],
        data: (pembayaran ?? []).map((p) => ({ Kuitansi: p.receiptNumber, Siswa: p.studentName, Tanggal: p.paidAt, Metode: p.method, Jumlah: p.amount })),
        file: 'laporan-pembayaran',
      },
      {
        icon: Scale,
        title: 'Neraca',
        desc: 'Laporan posisi keuangan.',
        roles: ['foundation_admin', 'akuntan'] as Role[],
        href: '/akuntansi/neraca',
      },
      {
        icon: TrendingUp,
        title: 'Surplus-Defisit',
        desc: 'Laporan hasil usaha yayasan.',
        roles: ['foundation_admin', 'akuntan'] as Role[],
        href: '/akuntansi/surplus-defisit',
      },
      {
        icon: BookOpen,
        title: 'Trial Balance',
        desc: 'Neraca saldo seluruh akun.',
        roles: ['foundation_admin', 'akuntan'] as Role[],
        data: tb.rows.map((r) => ({ Kode: r.code, Akun: r.name, Debit: r.debit, Kredit: r.credit })),
        file: 'trial-balance',
      },
      {
        icon: Banknote,
        title: 'Laporan Penggajian',
        desc: 'Rekap gaji per periode & sekolah.',
        roles: ['foundation_admin', 'akuntan', 'staf_hrd'] as Role[],
        data: (payroll ?? []).map((r) => ({ Periode: `${r.periodMonth}/${r.periodYear}`, Sekolah: r.schoolName, Bruto: r.totalGross, Neto: r.totalNet, Status: r.status })),
        file: 'laporan-penggajian',
      },
      {
        icon: Receipt,
        title: 'Laporan Hutang Usaha',
        desc: 'AP aging per vendor.',
        roles: ['foundation_admin', 'akuntan'] as Role[],
        data: (hutang ?? []).map((h) => ({ Faktur: h.invoiceNumber, Vendor: h.vendorName, 'Jatuh Tempo': h.dueDate, Nilai: h.amount, Sisa: h.amount - h.paidAmount, Status: h.status })),
        file: 'laporan-hutang',
      },
      {
        icon: Package,
        title: 'Laporan Inventaris',
        desc: 'Daftar aset & nilai buku.',
        roles: ['foundation_admin', 'akuntan'] as Role[],
        data: (aset ?? []).map((a) => ({ Kode: a.assetCode, Nama: a.name, Kategori: a.category, Perolehan: a.acquisitionCost, 'Nilai Buku': a.bookValue, Status: a.status })),
        file: 'laporan-inventaris',
      },
      {
        icon: PiggyBank,
        title: 'Laporan Simpanan Siswa',
        desc: 'Rekap saldo simpanan.',
        roles: ['foundation_admin', 'akuntan'] as Role[],
        data: (simpanan ?? []).map((s) => ({ Siswa: s.studentName, Saldo: s.balance, Status: s.status })),
        file: 'laporan-simpanan',
      },
    ],
    [tagihan, pembayaran, hutang, aset, simpanan, payroll, tb]
  )

  const visible = reports.filter((r) => r.roles.includes(role))

  return (
    <>
      <PageHeader title="Laporan" description="Pusat laporan operasional dan keuangan formal." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((r) => (
          <Card key={r.title}>
            <CardContent className="flex h-full flex-col gap-4 p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <r.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-sm text-muted-foreground">{r.desc}</p>
                </div>
              </div>
              <div className="mt-auto flex items-center gap-2">
                {r.href ? (
                  <Link href={r.href}>
                    <Button variant="outline" size="sm">Buka Laporan</Button>
                  </Link>
                ) : (
                  <ExportButton data={r.data ?? []} filename={r.file ?? 'laporan'} label="Ekspor Excel" size="sm" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
