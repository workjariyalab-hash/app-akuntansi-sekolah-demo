'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/stores/auth-store'
import { mockSekolah } from '@/lib/mock-data'

export function SchoolSelector() {
  const { user, currentSchoolId, setCurrentSchool } = useAuthStore()

  // Only foundation_admin and akuntan see the full school selector
  if (!user || !['foundation_admin', 'akuntan'].includes(user.role)) {
    return null
  }

  return (
    <Select
      value={currentSchoolId}
      onValueChange={(v) => v != null && setCurrentSchool(v)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Pilih Sekolah" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Sekolah</SelectItem>
        {mockSekolah.map((sekolah) => (
          <SelectItem key={sekolah.id} value={sekolah.id}>
            {sekolah.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
