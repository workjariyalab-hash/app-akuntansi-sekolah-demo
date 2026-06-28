'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  filename: string
  label?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
}

export function ExportButton({
  data,
  filename,
  label = 'Ekspor Excel',
  variant = 'outline',
  size = 'default',
  disabled = false,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!data.length) return
    setIsExporting(true)
    try {
      const [{ utils, writeFile }, { saveAs }] = await Promise.all([
        import('xlsx'),
        import('file-saver'),
      ])

      const worksheet = utils.json_to_sheet(data)
      const workbook = utils.book_new()
      utils.book_append_sheet(workbook, worksheet, 'Data')

      // Auto-fit column widths
      const cols = Object.keys(data[0] ?? {}).map((key) => ({
        wch: Math.max(
          key.length,
          ...data.map((row) => String(row[key] ?? '').length)
        ),
      }))
      worksheet['!cols'] = cols

      const excelBuffer = writeFile(workbook, filename, {
        bookType: 'xlsx',
        type: 'array',
      })

      const blob = new Blob([excelBuffer as ArrayBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      saveAs(blob, `${filename}.xlsx`)
    } catch (error) {
      console.error('Export gagal:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={disabled || isExporting || !data.length}
    >
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? 'Mengekspor...' : label}
    </Button>
  )
}
