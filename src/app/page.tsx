'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'

export default function Home() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!user) {
      router.replace('/login')
    } else if (user.role === 'teacher') {
      router.replace('/siswa')
    } else {
      router.replace('/dashboard')
    }
  }, [user, router])

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <span className="text-sm">Memuat…</span>
      </div>
    </div>
  )
}
