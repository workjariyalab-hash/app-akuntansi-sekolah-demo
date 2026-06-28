export type Role = 'foundation_admin' | 'akuntan' | 'kasir' | 'staf_hrd' | 'teacher'
export type StatusTagihan = 'pending' | 'partial' | 'overdue' | 'paid' | 'superseded'
export type SiklusTagihan = 'monthly' | 'semester' | 'annual' | 'one_time'
export type MetodePenyusutan = 'straight_line' | 'declining_balance'
export type TipeJurnal = 'auto' | 'manual' | 'adjustment' | 'reversal' | 'closing'
export type StatusJurnal = 'draft' | 'posted'
export type TipeAkun = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
export type NormalBalance = 'debit' | 'credit'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  schoolId?: string
  kelas?: string
}

export interface Sekolah {
  id: string
  name: string
  kode: string
}

export interface Siswa {
  id: string
  name: string
  nis: string
  kelas: string
  jenjang: string
  schoolId: string
  schoolName: string
  status: 'aktif' | 'nonaktif' | 'lulus' | 'pindah'
  parentName: string
  parentPhone: string
  vaNumber: string
}

export interface KategoriBiaya {
  id: string
  schoolId: string
  name: string
  siklus: SiklusTagihan
  issueDay?: number
  dueDayOffset: number
  isActive: boolean
  feeAmounts: FeeAmount[]
}

export interface FeeAmount {
  id: string
  categoryId: string
  jenjang: string
  amount: number
}

export interface Tagihan {
  id: string
  studentId: string
  studentName: string
  schoolId: string
  categoryName: string
  billingPeriod: string
  dueDate: string
  totalAmount: number
  paidAmount: number
  status: StatusTagihan
  createdAt: string
}

export interface Pembayaran {
  id: string
  billId: string
  studentName: string
  amount: number
  method: 'va' | 'cash'
  paidAt: string
  receiptNumber: string
  recordedBy: string
}

export interface CashTransaction {
  id: string
  schoolId: string
  type: 'receipt' | 'payment'
  date: string
  amount: number
  category: string
  description: string
  status: 'draft' | 'posted' | 'reversed'
  referenceNumber: string
  createdBy: string
}

export interface SavingsAccount {
  id: string
  studentId: string
  studentName: string
  schoolId: string
  balance: number
  status: 'active' | 'closed'
}

export interface SavingsTransaction {
  id: string
  accountId: string
  type: 'deposit' | 'withdrawal'
  amount: number
  balanceAfter: number
  date: string
  notes: string
  recordedBy: string
}

export interface Vendor {
  id: string
  name: string
  npwp: string
  bankAccount: string
  bankName: string
  contactName: string
}

export interface APInvoice {
  id: string
  vendorId: string
  vendorName: string
  schoolId: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  amount: number
  paidAmount: number
  status: 'open' | 'partial' | 'paid' | 'cancelled'
  description: string
}

export interface Karyawan {
  id: string
  schoolId: string
  name: string
  nik: string
  position: string
  department: string
  status: 'active' | 'inactive'
  baseSalary: number
  ptkpStatus: string
  bankAccount: string
  bankName: string
}

export interface PayrollRun {
  id: string
  schoolId: string
  schoolName: string
  periodYear: number
  periodMonth: number
  status: 'draft' | 'finalized'
  totalGross: number
  totalNet: number
  finalizedAt?: string
}

export interface PayrollLine {
  id: string
  runId: string
  employeeId: string
  employeeName: string
  grossSalary: number
  totalAllowance: number
  totalDeductionBpjs: number
  pph21: number
  netSalary: number
  slipNumber: string
}

export interface Asset {
  id: string
  schoolId: string
  schoolName: string
  assetCode: string
  name: string
  category: string
  acquisitionDate: string
  acquisitionCost: number
  residualValue: number
  usefulLifeMonths: number
  depreciationMethod: MetodePenyusutan
  bookValue: number
  status: 'active' | 'disposed'
}

export interface Akun {
  id: string
  code: string
  name: string
  type: TipeAkun
  normalBalance: NormalBalance
  parentId?: string
  isActive: boolean
  balance?: number
}

export interface Journal {
  id: string
  journalNumber: string
  date: string
  type: TipeJurnal
  description: string
  sourceModule?: string
  status: StatusJurnal
  postedBy?: string
  postedAt?: string
  totalDebit: number
  totalCredit: number
}

export interface JournalLine {
  id: string
  journalId: string
  accountCode: string
  accountName: string
  schoolId: string
  debit: number
  credit: number
  description: string
}

export interface BudgetItem {
  id: string
  schoolId: string
  schoolName: string
  categoryId: string
  categoryName: string
  period: string
  plannedAmount: number
  actualAmount: number
  variance: number
}

export interface ForecastItem {
  id: string
  schoolId: string
  categoryName: string
  period: string
  billingForecast: number
  collectionForecast: number
  actualCollection: number
  budget: number
  variance: number
}
