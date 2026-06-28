'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Building2, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { mockUsers, mockSekolah } from '@/lib/mock-data'
import { roleLabels } from '@/lib/nav'

const GL_MAPPING = [
  { event: 'Tagihan SPP diterbitkan', debit: 'Piutang SPP', credit: 'Pendapatan SPP' },
  { event: 'Pembayaran VA diterima', debit: 'Bank BCA', credit: 'Piutang SPP' },
  { event: 'Setoran simpanan siswa', debit: 'Kas Sekolah', credit: 'Simpanan Siswa' },
  { event: 'Faktur hutang dicatat', debit: 'Beban/Aset terkait', credit: 'Hutang Usaha' },
  { event: 'Penggajian difinalisasi', debit: 'Biaya Gaji', credit: 'Hutang Gaji / PPh 21 / BPJS' },
  { event: 'Penyusutan bulanan', debit: 'Biaya Penyusutan', credit: 'Akumulasi Penyusutan' },
]

export default function PengaturanPage() {
  const [notif, setNotif] = useState({ tagihan: true, jatuhTempo: true, hutang: true, payroll: false })

  return (
    <>
      <PageHeader title="Pengaturan" description="Konfigurasi yayasan, pengguna, dan integrasi akuntansi." />

      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="umum">
            <TabsList>
              <TabsTrigger value="umum">Umum</TabsTrigger>
              <TabsTrigger value="pengguna">Pengguna</TabsTrigger>
              <TabsTrigger value="notifikasi">Notifikasi</TabsTrigger>
            </TabsList>

            {/* Umum */}
            <TabsContent value="umum" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Nama Yayasan</Label>
                  <Input defaultValue="Yayasan Al-Hikmah" />
                </div>
                <div className="space-y-1.5">
                  <Label>Tahun Buku Aktif</Label>
                  <Input defaultValue="2026" />
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Sekolah di Bawah Yayasan</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {mockSekolah.map((s) => (
                    <div key={s.id} className="flex items-center gap-2.5 rounded-lg border p-3">
                      <Building2 className="h-4 w-4 text-indigo-600" />
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.kode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Pemetaan Jurnal Otomatis (GL)</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kejadian</TableHead>
                      <TableHead>Debit</TableHead>
                      <TableHead>Kredit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {GL_MAPPING.map((m) => (
                      <TableRow key={m.event}>
                        <TableCell className="font-medium">{m.event}</TableCell>
                        <TableCell className="text-muted-foreground">{m.debit}</TableCell>
                        <TableCell className="text-muted-foreground">{m.credit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button onClick={() => toast.success('Pengaturan disimpan.')}>Simpan Perubahan</Button>
            </TabsContent>

            {/* Pengguna */}
            <TabsContent value="pengguna" className="space-y-4 pt-4">
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => toast.info('Form tambah pengguna (demo).')}>
                  <Plus className="h-4 w-4" />
                  Tambah Pengguna
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Peran</TableHead>
                    <TableHead>Sekolah</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell><Badge variant="secondary">{roleLabels[u.role]}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">
                        {u.schoolId ? mockSekolah.find((s) => s.id === u.schoolId)?.kode : 'Semua'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toast.info(`Nonaktifkan ${u.name} (demo).`)}>
                          Nonaktifkan
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Notifikasi */}
            <TabsContent value="notifikasi" className="space-y-3 pt-4">
              <NotifToggle label="Tagihan baru diterbitkan" desc="Kirim notifikasi ke orang tua." checked={notif.tagihan} onToggle={() => setNotif((n) => ({ ...n, tagihan: !n.tagihan }))} />
              <NotifToggle label="Pengingat jatuh tempo" desc="H-7, H-3, dan H-1 sebelum jatuh tempo." checked={notif.jatuhTempo} onToggle={() => setNotif((n) => ({ ...n, jatuhTempo: !n.jatuhTempo }))} />
              <NotifToggle label="Hutang mendekati jatuh tempo" desc="Ingatkan akuntan H-7 & H-3." checked={notif.hutang} onToggle={() => setNotif((n) => ({ ...n, hutang: !n.hutang }))} />
              <NotifToggle label="Pengingat payroll bulanan" desc="Ingatkan HRD setiap awal bulan." checked={notif.payroll} onToggle={() => setNotif((n) => ({ ...n, payroll: !n.payroll }))} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  )
}

function NotifToggle({ label, desc, checked, onToggle }: { label: string; desc: string; checked: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-muted-foreground/30'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'left-[1.375rem]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}
