'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Search, UserPlus, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent } from '@/components/ui/card'
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { FilterSelect } from '@/components/shared/filter-select'
import { StatusBadge } from '@/components/shared/status-badge'
import { ExportButton } from '@/components/shared/export-button'
import { EmptyState, TableSkeleton } from '@/components/shared/states'
import { useSiswa, useCreateSiswa } from '@/hooks/use-siswa'
import { useAuthStore } from '@/stores/auth-store'
import { mockSekolah } from '@/lib/mock-data'

export default function SiswaPage() {
  const user = useAuthStore((s) => s.user)
  const globalSchool = useAuthStore((s) => s.currentSchoolId)
  const isTeacher = user?.role === 'teacher'

  const effectiveSchool = isTeacher ? user?.schoolId ?? 'all' : globalSchool

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sheetOpen, setSheetOpen] = useState(false)

  const { data, isLoading } = useSiswa({
    schoolId: effectiveSchool,
    status: status === 'all' ? undefined : status,
    kelas: isTeacher ? user?.kelas : undefined,
  })

  const rows = useMemo(() => {
    let list = data ?? []
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.nis.includes(q)
      )
    }
    return list
  }, [data, search])

  const exportData = rows.map((s) => ({
    NIS: s.nis,
    Nama: s.name,
    Kelas: s.kelas,
    Sekolah: s.schoolName,
    Status: s.status,
    VA: s.vaNumber,
    'Orang Tua': s.parentName,
    Telepon: s.parentPhone,
  }))

  return (
    <>
      <PageHeader
        title="Data Siswa"
        description={
          isTeacher
            ? `Daftar siswa kelas ${user?.kelas} (hanya-lihat).`
            : 'Kelola data master siswa seluruh sekolah.'
        }
        actions={
          <>
            <ExportButton data={exportData} filename="data-siswa" />
            {!isTeacher && (
              <Button onClick={() => setSheetOpen(true)}>
                <UserPlus className="h-4 w-4" />
                Tambah Siswa
              </Button>
            )}
          </>
        }
      />

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau NIS…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8"
              />
            </div>
            <FilterSelect
              value={status}
              onValueChange={setStatus}
              options={[
                { value: 'all', label: 'Semua Status' },
                { value: 'aktif', label: 'Aktif' },
                { value: 'nonaktif', label: 'Nonaktif' },
                { value: 'lulus', label: 'Lulus' },
                { value: 'pindah', label: 'Pindah' },
              ]}
            />
          </div>

          {isLoading ? (
            <TableSkeleton cols={6} />
          ) : rows.length === 0 ? (
            <EmptyState description="Tidak ada siswa yang cocok dengan filter." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIS</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Sekolah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Virtual Account</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => (
                  <TableRow key={s.id} className="cursor-pointer">
                    <TableCell className="tabular-nums text-muted-foreground">
                      <Link href={`/siswa/${s.id}`} className="block">
                        {s.nis}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/siswa/${s.id}`} className="block">
                        {s.name}
                      </Link>
                    </TableCell>
                    <TableCell>{s.kelas}</TableCell>
                    <TableCell className="text-muted-foreground">{s.schoolName}</TableCell>
                    <TableCell>
                      <StatusBadge status={s.status} />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{s.vaNumber}</TableCell>
                    <TableCell>
                      <Link href={`/siswa/${s.id}`}>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <p className="text-xs text-muted-foreground">
            Menampilkan {rows.length} siswa.
          </p>
        </CardContent>
      </Card>

      {!isTeacher && (
        <TambahSiswaSheet open={sheetOpen} onOpenChange={setSheetOpen} />
      )}
    </>
  )
}

function TambahSiswaSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const createSiswa = useCreateSiswa()
  const [form, setForm] = useState({
    name: '',
    nis: '',
    kelas: '',
    schoolId: 'school-1',
    parentName: '',
    parentPhone: '',
  })

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.name || !form.nis) {
      toast.error('Nama dan NIS wajib diisi.')
      return
    }
    const school = mockSekolah.find((s) => s.id === form.schoolId)
    await createSiswa.mutateAsync({
      ...form,
      schoolName: school?.name ?? '',
      jenjang: school?.kode.split('-')[0] ?? '',
      status: 'aktif',
      vaNumber: `VA-${Date.now().toString().slice(-8)}`,
    })
    toast.success(`Siswa "${form.name}" berhasil ditambahkan.`)
    onOpenChange(false)
    setForm({ name: '', nis: '', kelas: '', schoolId: 'school-1', parentName: '', parentPhone: '' })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tambah Siswa Baru</SheetTitle>
          <SheetDescription>Isi data siswa. Nomor VA dibuat otomatis.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <Field label="Nama Lengkap">
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label="NIS">
            <Input value={form.nis} onChange={(e) => set('nis', e.target.value)} />
          </Field>
          <Field label="Sekolah">
            <FilterSelect
              className="w-full"
              value={form.schoolId}
              onValueChange={(v) => set('schoolId', v)}
              options={mockSekolah.map((s) => ({ value: s.id, label: s.name }))}
            />
          </Field>
          <Field label="Kelas">
            <Input value={form.kelas} onChange={(e) => set('kelas', e.target.value)} placeholder="cth. IV A" />
          </Field>
          <Field label="Nama Orang Tua/Wali">
            <Input value={form.parentName} onChange={(e) => set('parentName', e.target.value)} />
          </Field>
          <Field label="Telepon Orang Tua">
            <Input value={form.parentPhone} onChange={(e) => set('parentPhone', e.target.value)} />
          </Field>
        </div>
        <SheetFooter>
          <Button onClick={submit} disabled={createSiswa.isPending}>
            Simpan Siswa
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
