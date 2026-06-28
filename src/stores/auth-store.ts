'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  currentSchoolId: string
  setUser: (user: User | null) => void
  setCurrentSchool: (id: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      currentSchoolId: 'all',
      setUser: (user) => set({ user }),
      setCurrentSchool: (id) => set({ currentSchoolId: id }),
      logout: () => set({ user: null, currentSchoolId: 'all' }),
    }),
    { name: 'auth-storage' }
  )
)
