import type { Akun } from '@/types'

/** A leaf account is one that is not a parent of any other account. */
export function leafAccounts(all: Akun[]): Akun[] {
  const parents = new Set(all.map((a) => a.parentId).filter(Boolean) as string[])
  return all.filter((a) => !parents.has(a.id))
}

export interface TrialBalanceRow {
  code: string
  name: string
  debit: number
  credit: number
}

export function trialBalance(all: Akun[]): {
  rows: TrialBalanceRow[]
  totalDebit: number
  totalCredit: number
  balanced: boolean
  difference: number
} {
  const rows = leafAccounts(all)
    .filter((a) => (a.balance ?? 0) !== 0)
    .map((a) => {
      const amount = Math.abs(a.balance ?? 0)
      const onDebit = a.normalBalance === 'debit'
      return {
        code: a.code,
        name: a.name,
        debit: onDebit ? amount : 0,
        credit: onDebit ? 0 : amount,
      }
    })
    .sort((a, b) => a.code.localeCompare(b.code))

  const totalDebit = rows.reduce((s, r) => s + r.debit, 0)
  const totalCredit = rows.reduce((s, r) => s + r.credit, 0)
  const difference = Math.round(totalDebit - totalCredit)
  return { rows, totalDebit, totalCredit, balanced: difference === 0, difference }
}

export interface StatementLine {
  code: string
  name: string
  amount: number
}

export function incomeStatement(all: Akun[]) {
  const leaves = leafAccounts(all)
  const revenue = leaves
    .filter((a) => a.type === 'revenue')
    .map((a) => ({ code: a.code, name: a.name, amount: a.balance ?? 0 }))
  const expense = leaves
    .filter((a) => a.type === 'expense')
    .map((a) => ({ code: a.code, name: a.name, amount: a.balance ?? 0 }))
  const totalRevenue = revenue.reduce((s, r) => s + r.amount, 0)
  const totalExpense = expense.reduce((s, r) => s + r.amount, 0)
  return {
    revenue,
    expense,
    totalRevenue,
    totalExpense,
    surplus: totalRevenue - totalExpense,
  }
}

export function balanceSheet(all: Akun[]) {
  const leaves = leafAccounts(all)
  const byParent = (pid: string): StatementLine[] =>
    leaves
      .filter((a) => a.parentId === pid)
      .map((a) => ({ code: a.code, name: a.name, amount: a.balance ?? 0 }))

  const currentAssets = byParent('akun-1100')
  const fixedAssets = byParent('akun-1200')
  const liabilities = byParent('akun-2000')
  const equityBase = byParent('akun-3000')

  const { surplus } = incomeStatement(all)
  // Current-year surplus flows into equity until year-end closing.
  const equity = [
    ...equityBase,
    { code: '3199', name: 'Surplus/Defisit Tahun Berjalan', amount: surplus },
  ]

  const totalCurrentAssets = currentAssets.reduce((s, a) => s + a.amount, 0)
  const totalFixedAssets = fixedAssets.reduce((s, a) => s + a.amount, 0)
  const totalAssets = totalCurrentAssets + totalFixedAssets
  const totalLiabilities = liabilities.reduce((s, a) => s + a.amount, 0)
  const totalEquity = equity.reduce((s, a) => s + a.amount, 0)

  return {
    currentAssets,
    fixedAssets,
    liabilities,
    equity,
    totalCurrentAssets,
    totalFixedAssets,
    totalAssets,
    totalLiabilities,
    totalEquity,
    totalLiabEquity: totalLiabilities + totalEquity,
    balanced: Math.round(totalAssets - (totalLiabilities + totalEquity)) === 0,
  }
}

export function financialRatios(all: Akun[]) {
  const leaves = leafAccounts(all)
  const currentAssets = leaves
    .filter((a) => a.parentId === 'akun-1100')
    .reduce((s, a) => s + (a.balance ?? 0), 0)
  const inventory = leaves
    .filter((a) => a.code === '1106')
    .reduce((s, a) => s + (a.balance ?? 0), 0)
  const currentLiab = leaves
    .filter((a) => a.parentId === 'akun-2000')
    .reduce((s, a) => s + (a.balance ?? 0), 0)
  const { totalRevenue, totalExpense } = incomeStatement(all)
  const { totalAssets, totalLiabilities, totalEquity } = balanceSheet(all)
  return {
    currentRatio: currentLiab ? currentAssets / currentLiab : 0,
    quickRatio: currentLiab ? (currentAssets - inventory) / currentLiab : 0,
    costRecovery: totalExpense ? totalRevenue / totalExpense : 0,
    debtToAsset: totalAssets ? totalLiabilities / totalAssets : 0,
    debtToEquity: totalEquity ? totalLiabilities / totalEquity : 0,
  }
}

/* ----------------------- Annual budget forecasting ------------------------ */

export interface BudgetAssumptions {
  /** All values are fractions, e.g. 0.05 = 5%. */
  studentGrowth: number
  feeIncrease: number
  costInflation: number
  salaryIncrease: number
}

export const DEFAULT_ASSUMPTIONS: BudgetAssumptions = {
  studentGrowth: 0.05,
  feeIncrease: 0.08,
  costInflation: 0.06,
  salaryIncrease: 0.07,
}

/** Project a revenue line to next year based on its account code. */
function projectRevenue(code: string, amount: number, a: BudgetAssumptions): number {
  const g = 1 + a.studentGrowth
  const fee = 1 + a.feeIncrease
  switch (code) {
    case '4101': // SPP — driven by both student count and tariff
    case '4102': // Kegiatan Siswa
      return amount * g * fee
    case '4103': // Dana BOS — per-student government funding
      return amount * g
    default: // Lainnya
      return amount * fee
  }
}

/** Project an expense line to next year based on its account code. */
function projectExpense(code: string, amount: number, a: BudgetAssumptions): number {
  const inflation = 1 + a.costInflation
  const salary = 1 + a.salaryIncrease
  const halfGrowth = 1 + a.studentGrowth * 0.5
  switch (code) {
    case '5101': // Gaji & Tunjangan
    case '5102': // BPJS
      return amount * salary * halfGrowth
    case '5104': // Penyusutan — fixed schedule
      return amount
    case '5106': // Pemeliharaan gedung — inflation only
      return amount * inflation
    default: // Operasional, kegiatan, utilitas
      return amount * inflation * halfGrowth
  }
}

export interface ProjectedLine extends StatementLine {
  projected: number
  deltaPct: number
}

export function projectAnnualBudget(all: Akun[], a: BudgetAssumptions) {
  const { revenue, expense } = incomeStatement(all)

  const withDelta = (
    lines: StatementLine[],
    fn: (code: string, amount: number) => number
  ): ProjectedLine[] =>
    lines.map((l) => {
      const projected = Math.round(fn(l.code, l.amount))
      return {
        ...l,
        projected,
        deltaPct: l.amount ? ((projected - l.amount) / l.amount) * 100 : 0,
      }
    })

  const revenueLines = withDelta(revenue, (c, amt) => projectRevenue(c, amt, a))
  const expenseLines = withDelta(expense, (c, amt) => projectExpense(c, amt, a))

  const currentRevenue = revenue.reduce((s, l) => s + l.amount, 0)
  const currentExpense = expense.reduce((s, l) => s + l.amount, 0)
  const projectedRevenue = revenueLines.reduce((s, l) => s + l.projected, 0)
  const projectedExpense = expenseLines.reduce((s, l) => s + l.projected, 0)

  return {
    revenueLines,
    expenseLines,
    currentRevenue,
    currentExpense,
    currentSurplus: currentRevenue - currentExpense,
    projectedRevenue,
    projectedExpense, // = recommended total annual budget
    projectedSurplus: projectedRevenue - projectedExpense,
    surplusMargin: projectedRevenue ? ((projectedRevenue - projectedExpense) / projectedRevenue) * 100 : 0,
  }
}
