import type { Role } from '@/types'
import {
  LayoutDashboard,
  Users,
  FileText,
  Tag,
  CreditCard,
  AlertCircle,
  Wallet,
  PiggyBank,
  Receipt,
  Banknote,
  Package,
  BookOpen,
  PieChart,
  TrendingUp,
  BarChart3,
  Settings,
} from 'lucide-react'

type IconType = React.ComponentType<{ className?: string }>

export interface NavChild {
  href: string
  label: string
}

export interface NavItem {
  label: string
  icon: IconType
  href?: string
  roles: Role[]
  children?: NavChild[]
}

export const navItems: NavItem[] = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    roles: ['foundation_admin', 'akuntan', 'kasir'],
  },
  {
    href: '/siswa',
    icon: Users,
    label: 'Data Siswa',
    roles: ['foundation_admin', 'teacher'],
  },
  {
    href: '/tagihan',
    icon: FileText,
    label: 'Tagihan Siswa',
    roles: ['foundation_admin', 'teacher'],
  },
  {
    href: '/kategori-biaya',
    icon: Tag,
    label: 'Kategori Biaya',
    roles: ['foundation_admin'],
  },
  {
    href: '/pembayaran',
    icon: CreditCard,
    label: 'Pembayaran',
    roles: ['foundation_admin', 'akuntan', 'kasir'],
  },
  {
    href: '/tunggakan',
    icon: AlertCircle,
    label: 'Tunggakan & Aging',
    roles: ['foundation_admin', 'akuntan'],
  },
  {
    href: '/kasir',
    icon: Wallet,
    label: 'Kasir',
    roles: ['foundation_admin', 'akuntan', 'kasir'],
  },
  {
    href: '/simpanan',
    icon: PiggyBank,
    label: 'Simpanan Siswa',
    roles: ['foundation_admin', 'akuntan', 'kasir'],
  },
  {
    href: '/hutang',
    icon: Receipt,
    label: 'Hutang Usaha',
    roles: ['foundation_admin', 'akuntan'],
  },
  {
    href: '/penggajian',
    icon: Banknote,
    label: 'Penggajian',
    roles: ['foundation_admin', 'akuntan', 'staf_hrd'],
  },
  {
    href: '/inventaris',
    icon: Package,
    label: 'Inventaris & Aset',
    roles: ['foundation_admin', 'akuntan'],
  },
  {
    label: 'Akuntansi / GL',
    icon: BookOpen,
    roles: ['foundation_admin', 'akuntan'],
    children: [
      { href: '/akuntansi/jurnal', label: 'Jurnal Transaksi' },
      { href: '/akuntansi/buku-besar', label: 'Buku Besar' },
      { href: '/akuntansi/trial-balance', label: 'Trial Balance' },
      { href: '/akuntansi/neraca', label: 'Neraca' },
      { href: '/akuntansi/surplus-defisit', label: 'Surplus-Defisit' },
      { href: '/akuntansi/tutup-tahun', label: 'Tutup Tahun' },
    ],
  },
  {
    href: '/budgeting',
    icon: PieChart,
    label: 'Budgeting',
    roles: ['foundation_admin', 'akuntan'],
  },
  {
    href: '/forecasting',
    icon: TrendingUp,
    label: 'Forecasting',
    roles: ['foundation_admin', 'akuntan'],
  },
  {
    href: '/laporan',
    icon: BarChart3,
    label: 'Laporan',
    roles: ['foundation_admin', 'akuntan', 'staf_hrd'],
  },
  {
    href: '/pengaturan',
    icon: Settings,
    label: 'Pengaturan',
    roles: ['foundation_admin'],
  },
]

export const roleLabels: Record<Role, string> = {
  foundation_admin: 'Admin Yayasan',
  akuntan: 'Akuntan',
  kasir: 'Kasir',
  staf_hrd: 'Staf HRD',
  teacher: 'Guru / Wali Kelas',
}

/** Flatten all hrefs a role may visit. */
export function allowedHrefs(role: Role): string[] {
  const hrefs: string[] = []
  for (const item of navItems) {
    if (!item.roles.includes(role)) continue
    if (item.href) hrefs.push(item.href)
    if (item.children) hrefs.push(...item.children.map((c) => c.href))
  }
  return hrefs
}

/** Landing route after login, per role. */
export function firstAccessibleRoute(role: Role): string {
  if (role === 'teacher') return '/siswa'
  const hrefs = allowedHrefs(role)
  return hrefs[0] ?? '/dashboard'
}
