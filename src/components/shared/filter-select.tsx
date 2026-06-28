'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Option {
  value: string
  label: string
}

export function FilterSelect({
  value,
  onValueChange,
  placeholder,
  options,
  className,
}: {
  value: string
  onValueChange: (v: string) => void
  placeholder?: string
  options: Option[]
  className?: string
}) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v ?? '')}>
      <SelectTrigger className={className ?? 'w-[170px]'}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
