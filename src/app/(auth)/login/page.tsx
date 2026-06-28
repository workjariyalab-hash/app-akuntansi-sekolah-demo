'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import { demoCredentials, mockUsers } from '@/lib/mock-data'
import { firstAccessibleRoute } from '@/lib/nav'
import type { Role } from '@/types'

const demoAccounts: { role: Role; label: string; email: string; password: string }[] = [
  { role: 'foundation_admin', label: 'Admin Yayasan', email: 'admin@alhikmah.sch.id', password: 'admin123' },
  { role: 'akuntan', label: 'Akuntan', email: 'akuntan@alhikmah.sch.id', password: 'akuntan123' },
  { role: 'kasir', label: 'Kasir', email: 'kasir.sd@alhikmah.sch.id', password: 'kasir123' },
  { role: 'staf_hrd', label: 'Staf HRD', email: 'hrd@alhikmah.sch.id', password: 'hrd123' },
  { role: 'teacher', label: 'Guru', email: 'guru1@alhikmah.sch.id', password: 'guru123' },
]

export default function LoginPage() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const doLogin = (em: string, pw: string) => {
    setError('')
    const cred = demoCredentials[em]
    if (!cred || cred.password !== pw) {
      setError('Email atau kata sandi salah.')
      return
    }
    const user = mockUsers.find((u) => u.id === cred.userId)
    if (!user) {
      setError('Akun tidak ditemukan.')
      return
    }
    setLoading(true)
    setUser(user)
    router.replace(firstAccessibleRoute(user.role))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    doLogin(email, password)
  }

  const quickLogin = (acc: (typeof demoAccounts)[number]) => {
    setEmail(acc.email)
    setPassword(acc.password)
    doLogin(acc.email, acc.password)
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg">
          <GraduationCap className="h-7 w-7" />
        </div>
        <h1 className="font-heading text-xl font-semibold text-white">Sistem Akuntansi Sekolah</h1>
        <p className="mt-1 text-sm text-indigo-200">Yayasan Al-Hikmah · 5 Sekolah</p>
      </div>

      <Card className="shadow-xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@alhikmah.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              <LogIn className="h-4 w-4" />
              Masuk
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative mb-3 text-center">
              <span className="relative z-10 bg-card px-2 text-xs text-muted-foreground">
                Masuk cepat (demo)
              </span>
              <span className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <Button
                  key={acc.role}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin(acc)}
                  className="justify-start"
                >
                  {acc.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-indigo-300">
        © 2026 Yayasan Al-Hikmah. Mode demo — data contoh.
      </p>
    </div>
  )
}
