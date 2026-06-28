'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Phone, User, CreditCard, School } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/shared/status-badge'
import { EmptyState } from '@/components/shared/states'
import { useSiswaById } from '@/hooks/use-siswa'
import { useTagihan } from '@/hooks/use-tagihan'
import { usePembayaran } from '@/hooks/use-pembayaran'
import { useSimpanan, useSimpananTransactions } from '@/hooks/use-simpanan'
import { formatRupiah, formatDateShort } from '@/lib/format'

export default function SiswaDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id

  const { data: siswa, isLoading } = useSiswaById(id)
  const { data: tagihan } = useTagihan({ studentId: id })
  const { data: pembayaran } = usePembayaran({ studentName: siswa?.name })
  const { data: savingsAccounts } = useSimpanan({ studentId: id })
  const account = savingsAccounts?.[0] ?? null
  const { data: savingsTrx } = useSimpananTransactions(account?.id ?? null)

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Memuat data siswa…</p>
  }

  if (!siswa) {
    return (
      <Card>
        <CardContent className="p-6">
          <EmptyState title="Siswa tidak ditemukan" />
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => router.push('/siswa')}>
              Kembali
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => router.push('/siswa')} className="-ml-2 w-fit">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Data Siswa
      </Button>

      <PageHeader title={siswa.name} description={`${siswa.schoolName} · Kelas ${siswa.kelas}`} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Informasi Siswa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow icon={<User className="h-4 w-4" />} label="NIS" value={siswa.nis} />
            <InfoRow icon={<School className="h-4 w-4" />} label="Sekolah" value={siswa.schoolName} />
            <InfoRow icon={<CreditCard className="h-4 w-4" />} label="VA" value={siswa.vaNumber} mono />
            <InfoRow icon={<User className="h-4 w-4" />} label="Orang Tua" value={siswa.parentName} />
            <InfoRow icon={<Phone className="h-4 w-4" />} label="Telepon" value={siswa.parentPhone} />
            <div className="pt-1">
              <StatusBadge status={siswa.status} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardContent className="p-4">
            <Tabs defaultValue="tagihan">
              <TabsList>
                <TabsTrigger value="tagihan">Tagihan</TabsTrigger>
                <TabsTrigger value="pembayaran">Riwayat Pembayaran</TabsTrigger>
                <TabsTrigger value="simpanan">Simpanan</TabsTrigger>
              </TabsList>

              <TabsContent value="tagihan" className="pt-4">
                {(tagihan?.length ?? 0) === 0 ? (
                  <EmptyState description="Belum ada tagihan." />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Periode</TableHead>
                        <TableHead>Jatuh Tempo</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Dibayar</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tagihan!.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.categoryName}</TableCell>
                          <TableCell>{t.billingPeriod}</TableCell>
                          <TableCell>{formatDateShort(t.dueDate)}</TableCell>
                          <TableCell className="text-right tabular-nums">{formatRupiah(t.totalAmount)}</TableCell>
                          <TableCell className="text-right tabular-nums">{formatRupiah(t.paidAmount)}</TableCell>
                          <TableCell><StatusBadge status={t.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              <TabsContent value="pembayaran" className="pt-4">
                {(pembayaran?.length ?? 0) === 0 ? (
                  <EmptyState description="Belum ada pembayaran." />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No. Kuitansi</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Metode</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pembayaran!.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-mono text-xs">{p.receiptNumber}</TableCell>
                          <TableCell>{formatDateShort(p.paidAt)}</TableCell>
                          <TableCell>
                            <StatusBadge status={p.method === 'va' ? 'active' : 'posted'} label={p.method === 'va' ? 'Virtual Account' : 'Tunai'} />
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-emerald-600">{formatRupiah(p.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              <TabsContent value="simpanan" className="pt-4">
                {!account ? (
                  <EmptyState description="Siswa belum memiliki rekening simpanan." />
                ) : (
                  <>
                    <div className="mb-4 rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">Saldo Simpanan</p>
                      <p className="text-2xl font-bold text-indigo-600">{formatRupiah(account.balance)}</p>
                    </div>
                    {(savingsTrx?.length ?? 0) === 0 ? (
                      <EmptyState description="Belum ada mutasi." />
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Keterangan</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                            <TableHead className="text-right">Saldo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {savingsTrx!.map((t) => (
                            <TableRow key={t.id}>
                              <TableCell>{formatDateShort(t.date)}</TableCell>
                              <TableCell>
                                <StatusBadge
                                  status={t.type === 'deposit' ? 'active' : 'reversed'}
                                  label={t.type === 'deposit' ? 'Setoran' : 'Penarikan'}
                                />
                              </TableCell>
                              <TableCell className="text-muted-foreground">{t.notes}</TableCell>
                              <TableCell className={`text-right tabular-nums ${t.type === 'deposit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {t.type === 'deposit' ? '+' : '−'}{formatRupiah(t.amount)}
                              </TableCell>
                              <TableCell className="text-right tabular-nums">{formatRupiah(t.balanceAfter)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function InfoRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className={`font-medium ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  )
}
