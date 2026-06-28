'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/stores/auth-store'
import { allowedHrefs, firstAccessibleRoute } from '@/lib/nav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!user) {
      router.replace('/login')
      return
    }
    // Basic per-route guard: ensure the current role may visit this section.
    const allowed = allowedHrefs(user.role)
    const permitted = allowed.some((href) => pathname.startsWith(href))
    if (!permitted) {
      router.replace(firstAccessibleRoute(user.role))
    }
  }, [user, pathname, router])

  if (!user) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="text-sm">Memuat…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <Sidebar />
      </div>
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header />
        <main className="flex-1 space-y-6 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
