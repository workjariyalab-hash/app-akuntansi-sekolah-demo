import type { KategoriBiaya } from '@/types'

export const mockKategoriBiaya: KategoriBiaya[] = [
  {
    id: 'kat-1',
    schoolId: 'school-1',
    name: 'SPP Bulanan',
    siklus: 'monthly',
    issueDay: 1,
    dueDayOffset: 9,
    isActive: true,
    feeAmounts: [
      { id: 'fa-1a', categoryId: 'kat-1', jenjang: 'Kelas I-III', amount: 500000 },
      { id: 'fa-1b', categoryId: 'kat-1', jenjang: 'Kelas IV-VI', amount: 550000 },
    ],
  },
  {
    id: 'kat-2',
    schoolId: 'school-2',
    name: 'SPP Bulanan',
    siklus: 'monthly',
    issueDay: 1,
    dueDayOffset: 9,
    isActive: true,
    feeAmounts: [
      { id: 'fa-2a', categoryId: 'kat-2', jenjang: 'Kelas VII-IX', amount: 750000 },
    ],
  },
  {
    id: 'kat-3',
    schoolId: 'school-3',
    name: 'SPP Bulanan',
    siklus: 'monthly',
    issueDay: 1,
    dueDayOffset: 9,
    isActive: true,
    feeAmounts: [
      { id: 'fa-3a', categoryId: 'kat-3', jenjang: 'IPA', amount: 900000 },
      { id: 'fa-3b', categoryId: 'kat-3', jenjang: 'IPS', amount: 875000 },
    ],
  },
  {
    id: 'kat-4',
    schoolId: 'school-4',
    name: 'SPP Bulanan',
    siklus: 'monthly',
    issueDay: 1,
    dueDayOffset: 9,
    isActive: true,
    feeAmounts: [
      { id: 'fa-4a', categoryId: 'kat-4', jenjang: 'TKJ', amount: 950000 },
      { id: 'fa-4b', categoryId: 'kat-4', jenjang: 'AKL', amount: 925000 },
    ],
  },
  {
    id: 'kat-5',
    schoolId: 'school-5',
    name: 'SPP Bulanan',
    siklus: 'monthly',
    issueDay: 1,
    dueDayOffset: 9,
    isActive: true,
    feeAmounts: [
      { id: 'fa-5a', categoryId: 'kat-5', jenjang: 'Kelas VII-IX', amount: 650000 },
    ],
  },
  {
    id: 'kat-6',
    schoolId: 'school-1',
    name: 'Uang Kegiatan',
    siklus: 'semester',
    issueDay: 5,
    dueDayOffset: 14,
    isActive: true,
    feeAmounts: [
      { id: 'fa-6a', categoryId: 'kat-6', jenjang: 'Semua Jenjang', amount: 350000 },
    ],
  },
  {
    id: 'kat-7',
    schoolId: 'school-2',
    name: 'Uang Pangkal',
    siklus: 'one_time',
    dueDayOffset: 30,
    isActive: true,
    feeAmounts: [
      { id: 'fa-7a', categoryId: 'kat-7', jenjang: 'Siswa Baru', amount: 3500000 },
    ],
  },
  {
    id: 'kat-8',
    schoolId: 'school-3',
    name: 'Daftar Ulang Tahunan',
    siklus: 'annual',
    issueDay: 1,
    dueDayOffset: 20,
    isActive: true,
    feeAmounts: [
      { id: 'fa-8a', categoryId: 'kat-8', jenjang: 'Semua Jenjang', amount: 1200000 },
    ],
  },
  {
    id: 'kat-9',
    schoolId: 'school-4',
    name: 'Uang Praktik Kejuruan',
    siklus: 'semester',
    issueDay: 10,
    dueDayOffset: 14,
    isActive: false,
    feeAmounts: [
      { id: 'fa-9a', categoryId: 'kat-9', jenjang: 'Semua Jurusan', amount: 450000 },
    ],
  },
]
