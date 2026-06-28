'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, GraduationCap } from 'lucide-react'
import { navItems, roleLabels } from '@/lib/nav'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)

  const accountingActive = pathname.startsWith('/akuntansi')
  const [openAccounting, setOpenAccounting] = useState(accountingActive)

  if (!user) return null

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role))

  return (
    <aside className="flex h-full w-64 flex-col bg-indigo-950 text-indigo-100">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">Sistem Akuntansi</p>
          <p className="truncate text-xs text-indigo-300">Yayasan Al-Hikmah</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {visibleItems.map((item) => {
          if (item.children) {
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setOpenAccounting((v) => !v)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    accountingActive
                      ? 'bg-indigo-800/60 text-white'
                      : 'text-indigo-200 hover:bg-indigo-900 hover:text-white'
                  )}
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      openAccounting && 'rotate-180'
                    )}
                  />
                </button>
                {openAccounting && (
                  <div className="mt-0.5 space-y-0.5 pl-4">
                    {item.children.map((child) => {
                      const active = pathname === child.href
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onNavigate}
                          className={cn(
                            'block rounded-md border-l border-indigo-800 py-1.5 pl-4 pr-3 text-sm transition-colors',
                            active
                              ? 'border-indigo-400 font-medium text-white'
                              : 'text-indigo-300 hover:text-white'
                          )}
                        >
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-indigo-200 hover:bg-indigo-900 hover:text-white'
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-indigo-900 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-indigo-300">{roleLabels[user.role]}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
