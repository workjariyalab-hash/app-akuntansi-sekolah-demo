import type { Sekolah, User } from '@/types'

export const mockSekolah: Sekolah[] = [
  { id: 'school-1', name: 'SD Al-Hikmah', kode: 'SD-AH' },
  { id: 'school-2', name: 'SMP Al-Hikmah', kode: 'SMP-AH' },
  { id: 'school-3', name: 'SMA Al-Hikmah', kode: 'SMA-AH' },
  { id: 'school-4', name: 'SMK Al-Hikmah', kode: 'SMK-AH' },
  { id: 'school-5', name: 'MTs Al-Hikmah', kode: 'MTS-AH' },
]

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Ahmad Fauzi',
    email: 'admin@alhikmah.sch.id',
    role: 'foundation_admin',
  },
  {
    id: 'user-2',
    name: 'Siti Rahmawati',
    email: 'akuntan@alhikmah.sch.id',
    role: 'akuntan',
  },
  {
    id: 'user-3',
    name: 'Budi Santoso',
    email: 'kasir.sd@alhikmah.sch.id',
    role: 'kasir',
    schoolId: 'school-1',
  },
  {
    id: 'user-4',
    name: 'Dewi Kurniasih',
    email: 'kasir.smp@alhikmah.sch.id',
    role: 'kasir',
    schoolId: 'school-2',
  },
  {
    id: 'user-5',
    name: 'Rizki Pratama',
    email: 'kasir.sma@alhikmah.sch.id',
    role: 'kasir',
    schoolId: 'school-3',
  },
  {
    id: 'user-6',
    name: 'Nurul Hidayah',
    email: 'hrd@alhikmah.sch.id',
    role: 'staf_hrd',
  },
  {
    id: 'user-7',
    name: 'Hendra Wijaya',
    email: 'guru1@alhikmah.sch.id',
    role: 'teacher',
    schoolId: 'school-1',
    kelas: 'IV A',
  },
]

export const demoCredentials: Record<string, { password: string; userId: string }> = {
  'admin@alhikmah.sch.id': { password: 'admin123', userId: 'user-1' },
  'akuntan@alhikmah.sch.id': { password: 'akuntan123', userId: 'user-2' },
  'kasir.sd@alhikmah.sch.id': { password: 'kasir123', userId: 'user-3' },
  'kasir.smp@alhikmah.sch.id': { password: 'kasir123', userId: 'user-4' },
  'kasir.sma@alhikmah.sch.id': { password: 'kasir123', userId: 'user-5' },
  'hrd@alhikmah.sch.id': { password: 'hrd123', userId: 'user-6' },
  'guru1@alhikmah.sch.id': { password: 'guru123', userId: 'user-7' },
}
