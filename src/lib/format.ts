export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

export const formatDateShort = (dateString: string): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

export const formatPeriode = (year: number, month: number): string => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ]
  return `${months[month - 1]} ${year}`
}

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('id-ID').format(n)

/** Compact Rupiah for chart axes & dense displays, e.g. "Rp 82,5 jt", "Rp 1,9 M". */
export const formatRupiahCompact = (n: number): string => {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000_000) return `${sign}Rp ${(abs / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`
  if (abs >= 1_000_000) return `${sign}Rp ${(abs / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`
  if (abs >= 1_000) return `${sign}Rp ${(abs / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 0 })} rb`
  return `${sign}Rp ${abs}`
}

export const siklusLabel: Record<string, string> = {
  monthly: 'Bulanan',
  semester: 'Semester',
  annual: 'Tahunan',
  one_time: 'Sekali Bayar',
}

export const tipeJurnalLabel: Record<string, string> = {
  auto: 'Otomatis',
  manual: 'Manual',
  adjustment: 'Penyesuaian',
  reversal: 'Pembalik',
  closing: 'Penutup',
}

export const tipeJurnalVariant: Record<string, string> = {
  auto: 'info',
  manual: 'secondary',
  adjustment: 'warning',
  reversal: 'destructive',
  closing: 'outline',
}

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'secondary',
    partial: 'warning',
    overdue: 'destructive',
    paid: 'success',
    superseded: 'outline',
    draft: 'secondary',
    posted: 'success',
    open: 'secondary',
    cancelled: 'outline',
    active: 'success',
    inactive: 'secondary',
    finalized: 'success',
    disposed: 'destructive',
    reversed: 'outline',
  }
  return map[status] || 'outline'
}

export const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'Menunggu',
    partial: 'Sebagian',
    overdue: 'Terlambat',
    paid: 'Lunas',
    superseded: 'Diganti',
    draft: 'Draf',
    posted: 'Terposting',
    open: 'Terbuka',
    cancelled: 'Dibatalkan',
    active: 'Aktif',
    inactive: 'Nonaktif',
    finalized: 'Final',
    disposed: 'Dilepas',
    reversed: 'Dibalik',
    aktif: 'Aktif',
    nonaktif: 'Nonaktif',
    lulus: 'Lulus',
    pindah: 'Pindah',
  }
  return map[status] || status
}
