# Dokumen Kebutuhan Produk (Product Requirements Document)
## Sistem Akuntansi Sekolah

| | |
|---|---|
| **Status Dokumen** | Draft v1.0 |
| **Tanggal** | 26 Juni 2026 |
| **Diturunkan dari** | PRD Sistem Manajemen Keuangan Sekolah v2.4 |
| **Penulis** | [Nama Anda] |
| **Pemangku Kepentingan** | Pimpinan Yayasan, Kepala Sekolah, Staf Keuangan, Akuntan Yayasan, Tim HRD, Tim IT/Engineering |
| **Tujuan Dokumen** | Briefing tim developer/vendor untuk pengembangan sistem akuntansi lengkap, sekaligus dokumentasi internal |

---

## 1. Overview

### 1.1 Ringkasan

Platform akuntansi sekolah terpusat untuk yayasan yang membawahi **5 entitas sekolah**. Sistem ini merupakan perluasan dari sistem penagihan biaya sekolah (v2.4) menjadi platform akuntansi penuh (*full-stack accounting*) yang mencakup:

1. **Modul Penagihan** (dari v2.4): pendataan siswa, tagihan SPP/biaya, pembayaran virtual account & tunai, portal orang tua, budgeting, forecasting.
2. **Modul Kasir**: penerimaan & pengeluaran kas harian, kas kecil, rekonsiliasi bank.
3. **Modul Simpanan Siswa**: pengelolaan tabungan siswa (setoran, penarikan, rekap saldo).
4. **Modul Hutang Usaha**: pencatatan hutang ke vendor/supplier, jadwal pelunasan, manajemen AP.
5. **Modul Penggajian**: perhitungan gaji, tunjangan, potongan, PPh 21, slip gaji.
6. **Modul Inventaris & Aset Tetap**: pencatatan aset, perhitungan penyusutan otomatis, mutasi aset.
7. **Modul Akuntansi Formal — General Ledger**: Master Perkiraan (CoA), Jurnal Transaksi, Buku Besar, Trial Balance, Neraca, Laporan Surplus-Defisit, Tutup Tahun, Rasio Keuangan.

Seluruh transaksi dari semua modul **otomatis membentuk jurnal akuntansi** yang diposting ke General Ledger, menghasilkan laporan keuangan formal yang akurat dan real-time.

### 1.2 Konteks & Hubungan dengan Sistem Penagihan v2.4

PRD ini mencakup dan memperluas seluruh kebutuhan dari PRD Sistem Manajemen Keuangan Sekolah v2.4. Modul-modul yang sudah didefinisikan di v2.4 (Pendataan, Teknis Pembayaran, Portal Orang Tua, Budgeting, Forecasting, Tagihan Otomatis, Laporan, Administrasi) **dipertahankan sepenuhnya** dan diperluas dengan kemampuan integrasi GL.

**Perbedaan utama dari v2.4:**

| Aspek | v2.4 (Sistem Penagihan) | v1.0 (Sistem Akuntansi) |
|---|---|---|
| Fokus | Siklus penagihan & pembayaran SPP | Akuntansi lengkap + penagihan SPP |
| GL / Buku Besar | Di luar cakupan | Inti sistem |
| Penggajian | Di luar cakupan | Modul penuh + PPh 21 |
| Aset Tetap | Di luar cakupan | Modul penuh + penyusutan |
| Hutang Usaha | Di luar cakupan | Modul penuh |
| Laporan Keuangan | Laporan operasional tagihan | Neraca, Surplus-Defisit, Trial Balance |
| Tutup Buku | Tidak ada | Proses tutup tahun formal |

### 1.3 Latar Belakang & Pernyataan Masalah

Yayasan mengelola 5 sekolah dengan total ~2.500 siswa dan 200+ karyawan/guru. Di samping masalah penagihan (sudah diidentifikasi di v2.4), yayasan menghadapi tantangan keuangan yang lebih luas:

- **Tidak ada General Ledger formal**: Seluruh keuangan dicatat di spreadsheet terpisah — tidak ada sumber kebenaran tunggal untuk posisi keuangan yayasan.
- **Penggajian manual & rawan kesalahan**: Perhitungan gaji 200+ karyawan/guru di 5 sekolah dilakukan manual di Excel; PPh 21 sering keliru; slip gaji dibuat satu per satu.
- **Aset tidak terlacak**: Ratusan aset tetap (gedung, kendaraan, peralatan) tidak memiliki sistem pencatatan terpusat; penyusutan tidak dihitung secara konsisten.
- **Hutang usaha tidak termonitor**: Faktur dari vendor/supplier ditangani ad-hoc tanpa sistem AP terpusat; jatuh tempo sering terlewat.
- **Simpanan siswa dikelola manual**: Program tabungan siswa dicatat per-sekolah di buku/spreadsheet terpisah, rawan selisih dan tidak transparan bagi orang tua.
- **Tidak ada laporan keuangan formal**: Yayasan tidak dapat menghasilkan Neraca, Laporan Surplus-Defisit, atau laporan arus kas yang terstandardisasi — diperlukan untuk audit eksternal dan pelaporan ke regulator/pembina yayasan.

### 1.4 Struktur Organisasi (sama dengan v2.4)
- **1 Yayasan** membawahi **5 entitas sekolah**.
- **Keuangan dikelola terpusat**: satu tim keuangan di level yayasan menangani seluruh operasi untuk semua 5 sekolah.
- Yayasan memiliki **tampilan per sekolah dan konsolidasi** untuk pengawasan, pelaporan, dan laporan keuangan formal.

### 1.5 Tujuan Produk
1. Menyediakan sistem penagihan dan pengelolaan pembayaran SPP yang sudah didefinisikan di v2.4.
2. Menyediakan modul kasir terpusat untuk semua penerimaan dan pengeluaran kas harian seluruh sekolah.
3. Mendigitalisasi pengelolaan simpanan siswa dengan rekonsiliasi saldo otomatis.
4. Mengotomatisasi perhitungan penggajian (termasuk PPh 21) dan penerbitan slip gaji digital.
5. Memberikan visibilitas dan kontrol atas hutang usaha kepada vendor/supplier.
6. Mencatat dan mengelola aset tetap dengan perhitungan penyusutan otomatis bulanan.
7. Menghasilkan **laporan keuangan formal** (Neraca, Surplus-Defisit, Trial Balance) secara otomatis dari seluruh transaksi sistem.
8. Mendukung proses **tutup buku tahunan** dan analisis rasio keuangan.

### 1.6 Bukan Tujuan (Di Luar Cakupan v1)
- Multi-yayasan (multi-tenant) di luar satu yayasan dan 5 sekolahnya.
- Pelaporan pajak badan (SPT Badan) secara lengkap — sistem menghasilkan data untuk keperluan pajak, bukan mengurus e-Filing DJP.
- Procurement/pengadaan end-to-end (hanya pencatatan hutang setelah barang/jasa diterima).
- Point-of-sale (kantin, koperasi sekolah).
- Manajemen pinjaman/kredit karyawan.
- Denda keterlambatan SPP.
- Integrasi dengan sistem eksternal (HRIS, SIAK, software akuntansi) yang sudah ada.

### 1.7 Persona Pengguna

**Ibu Sari — Orang Tua.** Punya dua anak di dua sekolah berbeda. Ingin satu tempat untuk melihat tagihan, membayar, dan memantau saldo simpanan anak-anaknya.

**Pak Budi — Staf Keuangan Yayasan (Kasir).** Menerima dan mencatat pembayaran tunai, membuat pengeluaran kas, mengelola petty cash. Butuh alur transaksi yang cepat dan laporan posisi kas harian.

**Pak Ahmad — Akuntan Yayasan.** Bertanggung jawab atas kebenaran jurnal, buku besar, dan laporan keuangan formal. Membutuhkan tools untuk memverifikasi jurnal otomatis, membuat jurnal penyesuaian, menjalankan tutup buku, dan mencetak laporan auditable.

**Ibu Dewi — Kepala Keuangan Yayasan.** Perlu laporan konsolidasi, analisis tren, proyeksi, dan laporan keuangan formal untuk rapat pengurus yayasan dan audit eksternal.

**Bu Siti — Staf HRD Yayasan.** Mengelola data karyawan/guru di 5 sekolah, menghitung gaji bulanan, menerbitkan slip gaji, dan memastikan PPh 21 terpotong dengan benar.

**Bu Rina — Wali Kelas.** Ingin visibilitas cepat siswa yang menunggak di kelasnya, tanpa akses ke detail keuangan lainnya.

---

## 2. Requirements

### 2.1 Pengguna & Peran

| Peran | Deskripsi | Lingkup Akses |
|---|---|---|
| **Foundation Admin** | Superadmin yayasan | Akses penuh ke seluruh sistem dan semua sekolah |
| **Akuntan** | Staf akuntansi yayasan | Akses penuh ke modul GL, Jurnal, Laporan Keuangan, Tutup Tahun; read-only di semua modul transaksi; tidak dapat mengubah data di modul selain GL |
| **Kasir** | Staf kasir yayasan | Akses penuh ke modul Kasir, Simpanan, dan Pembayaran Tunai; tidak dapat akses GL, Penggajian, atau Laporan Keuangan formal |
| **Staf HRD** | Staf penggajian yayasan | Akses penuh ke modul Penggajian; tidak dapat akses GL atau modul keuangan lainnya |
| **Teacher** | Staf tingkat kelas | Akses read-only ke Data Siswa dan Tagihan di kelasnya; saat login langsung diarahkan ke halaman Data Siswa |
| **Parent / Guardian** | Orang tua/wali siswa | Mobile app: lihat tagihan, riwayat pembayaran, saldo simpanan anak |

#### 2.1.1 Matriks Navigasi Menu (Web App)

| Menu | Foundation Admin | Akuntan | Kasir | Staf HRD | Teacher |
|---|:---:|:---:|:---:|:---:|:---:|
| Dashboard | ✓ | ✓ (terbatas) | ✓ (terbatas) | — | — |
| Data Siswa | ✓ | — | — | — | ✓ (RO) |
| Tagihan Siswa | ✓ | — | — | — | ✓ (RO) |
| Kategori Biaya | ✓ | — | — | — | — |
| Pembayaran | ✓ | ✓ (RO) | ✓ | — | — |
| Tunggakan & Aging | ✓ | ✓ (RO) | — | — | — |
| **Kasir** | ✓ | ✓ (RO) | ✓ | — | — |
| **Simpanan Siswa** | ✓ | ✓ (RO) | ✓ | — | — |
| **Hutang Usaha** | ✓ | ✓ | — | — | — |
| **Penggajian** | ✓ | ✓ (RO) | — | ✓ | — |
| **Inventaris & Aset** | ✓ | ✓ | — | — | — |
| **Akuntansi / GL** | ✓ | ✓ | — | — | — |
| Budgeting | ✓ | ✓ (RO) | — | — | — |
| Forecasting | ✓ | ✓ (RO) | — | — | — |
| Laporan | ✓ | ✓ | — | ✓ (slip gaji saja) | — |
| Pengaturan | ✓ | — | — | — | — |

_RO = Read-Only_

Catatan:
- **Teacher**: tidak memiliki dashboard; langsung ke Data Siswa saat login.
- **Kasir**: dashboard menampilkan ringkasan kas hari ini (penerimaan, pengeluaran, saldo per akun kas).
- **Akuntan**: dashboard menampilkan status trial balance terkini dan jurnal yang menunggu review.
- Semua halaman memiliki **selector sekolah** (per sekolah atau konsolidasi) untuk Foundation Admin dan Akuntan.

### 2.2 Platform
- **Aplikasi web** untuk Foundation Admin, Akuntan, Kasir, Staf HRD, dan Teacher.
- **Aplikasi mobile** untuk Parent (iOS & Android).

### 2.3 Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| **Keamanan** | RBAC ketat antar peran; enkripsi TLS dan at-rest; data penggajian hanya bisa diakses peran berwenang; session timeout setelah idle |
| **Kinerja** | Laporan keuangan (Neraca, L/R) tergenerate dalam < 5 detik; transaksi kasir terkonfirmasi < 2 detik; rekonsiliasi VA tercatat dalam hitungan detik |
| **Integritas Data** | Double-entry accounting selalu balance (debit = kredit) — sistem menolak posting jurnal yang tidak balance di level aplikasi dan database |
| **Auditabilitas** | Seluruh transaksi finansial memiliki audit trail lengkap; jurnal yang sudah di-post tidak dapat dihapus, hanya bisa dibalik via reversal entry |
| **Lokalisasi** | Bahasa Indonesia; format IDR; format tanggal Indonesia; kalkulasi PPh 21 sesuai regulasi DJP yang berlaku |
| **Skalabilitas** | Mendukung ribuan transaksi per hari; jutaan catatan jurnal per tahun buku; ratusan karyawan |
| **Ketersediaan** | Uptime ≥ 99.5%; batch penggajian tidak boleh gagal di tengah jalan (transaksional all-or-nothing) |
| **Kepatuhan** | Data sesuai UU PDP Indonesia; PPh 21 mengikuti regulasi DJP terkini; standar akuntansi SAK/SAK ETAP |
| **Desain Dashboard** | Dashboard bersifat view-only/ringkasan — tidak ada button action langsung di tampilan dashboard |
| **Imutabilitas Jurnal** | Jurnal yang sudah di-post tidak dapat diubah atau dihapus; koreksi hanya via jurnal pembalik (reversal entry) |
| **Period Locking** | Transaksi tidak bisa diposting ke periode akuntansi yang sudah tutup buku |

### 2.4 Integrasi Jurnal Otomatis Antar-Modul

Setiap transaksi di modul operasional **otomatis menghasilkan jurnal akuntansi** yang diposting ke GL. Mapping akun dapat dikonfigurasi di pengaturan GL.

| Sumber Transaksi | Debit | Kredit |
|---|---|---|
| Tagihan SPP diterbitkan | Piutang SPP Siswa | Pendapatan SPP |
| Pembayaran VA diterima | Kas Bank | Piutang SPP Siswa |
| Pembayaran tunai SPP dicatat | Kas Tunai | Piutang SPP Siswa |
| Penerimaan kasir (non-SPP) | Kas Tunai / Bank | Akun pendapatan terkait |
| Pengeluaran kasir | Akun beban terkait | Kas Tunai / Bank |
| Setoran simpanan siswa | Kas Tunai | Simpanan Siswa (Liabilitas) |
| Penarikan simpanan siswa | Simpanan Siswa | Kas Tunai |
| Faktur hutang usaha dicatat | Akun beban/aset terkait | Hutang Usaha |
| Pelunasan hutang usaha | Hutang Usaha | Kas / Bank |
| Penggajian difinalisasi | Beban Gaji & Tunjangan | Hutang Gaji |
| Potongan PPh 21 | Hutang Gaji | Hutang PPh 21 |
| Transfer gaji dibayarkan | Hutang Gaji | Kas Bank |
| Pembelian aset tetap (tunai) | Aset Tetap | Kas / Bank |
| Pembelian aset tetap (kredit) | Aset Tetap | Hutang Usaha |
| Penyusutan aset (bulanan) | Beban Penyusutan | Akumulasi Penyusutan |
| Disposal/pelepasan aset | Akum. Penyusutan + Rugi Pelepasan | Aset Tetap |

### 2.5 Definisi & Konvensi Akuntansi

| Istilah | Definisi |
|---|---|
| **CoA** | Chart of Accounts — daftar terstruktur semua akun yang digunakan dalam sistem akuntansi |
| **Double-entry** | Sistem pencatatan akuntansi: setiap transaksi dicatat di dua sisi (debit & kredit) yang selalu balance |
| **Jurnal** | Pencatatan transaksi keuangan dengan pasangan debit-kredit |
| **Posting** | Proses memindahkan entri jurnal ke Buku Besar masing-masing akun |
| **Buku Besar** | Ringkasan semua transaksi per akun dengan saldo berjalan |
| **Trial Balance** | Neraca Saldo — daftar semua akun dan saldonya; total debit harus = total kredit |
| **Neraca** | Balance Sheet — laporan posisi keuangan: Aktiva = Kewajiban + Ekuitas |
| **Surplus-Defisit** | Setara Laba-Rugi untuk yayasan/entitas nirlaba |
| **Tutup Buku** | Proses akhir tahun: akun nominal (pendapatan/beban) ditutup ke akun ekuitas |
| **Jurnal Pembalik** | Reversal entry — membalik jurnal sebelumnya untuk koreksi tanpa menghapus jurnal asal |
| **Cost Center** | Dimensi `school_id` pada setiap baris jurnal — memungkinkan laporan per sekolah dan konsolidasi |
| **Simpanan Siswa** | Program tabungan sekolah: dana milik siswa yang dititipkan — merupakan **liabilitas** bagi sekolah |
| **AP** | Accounts Payable — hutang usaha kepada vendor/supplier |
| **Penyusutan** | Depreciation — alokasi biaya aset tetap secara sistematis selama umur manfaatnya |

### 2.6 Definisi Saldo Tunggakan (sama dengan v2.4)

| Status Tagihan | Masuk Tunggakan? | Keterangan |
|---|:---:|---|
| `pending` | Tidak | Belum jatuh tempo |
| `partial` | **Ya** | Jatuh tempo, dibayar sebagian |
| `overdue` | **Ya** | Jatuh tempo, belum ada pembayaran |
| `paid` | Tidak | Lunas |
| `superseded` | Tidak | Digantikan tagihan koreksi manual |

### 2.7 Asumsi & Dependensi
- Semua asumsi dari v2.4 berlaku.
- Sistem mengikuti standar akuntansi yang berlaku di Indonesia (SAK atau SAK ETAP untuk entitas nirlaba).
- Satu CoA per yayasan; semua sekolah menggunakan akun yang sama dengan dimensi cost center `school_id`.
- Penggajian menggunakan regulasi PPh 21 yang berlaku — komponen tarif dan PTKP harus dapat diperbarui saat regulasi berubah.
- Data karyawan/guru dikelola di sistem ini; tidak ada integrasi dengan HRIS eksternal.
- Mitra payment gateway/bank untuk virtual account dipilih dan dikontrak terpisah.

---

## 3. Core Features

> **Catatan**: Modul A–G (Pendataan, Teknis Pembayaran, Portal Orang Tua, Budgeting/Forecasting, Tagihan Otomatis, Laporan Operasional, Administrasi) **dipertahankan sepenuhnya dari PRD v2.4**. Bagian ini mencatat perubahan/tambahan pada modul A–G, lalu menjabarkan **modul baru H–M** secara lengkap.

### Perubahan/Tambahan pada Modul A–G

| Modul | Perubahan |
|---|---|
| A: Pendataan | Tidak ada perubahan |
| B: Teknis Pembayaran | Pembayaran VA dan tunai kini otomatis mem-posting jurnal ke GL sesuai mapping di 2.4 |
| C: Portal Orang Tua | Tambahan: orang tua dapat melihat saldo simpanan anaknya di aplikasi mobile |
| D: Budgeting & Forecasting | Tidak ada perubahan |
| E: Tagihan Otomatis | Penerbitan tagihan otomatis mem-posting jurnal piutang (DR Piutang / CR Pendapatan) ke GL |
| F: Laporan | Diperluas dengan laporan dari modul baru (lihat F7–F15 di bawah) |
| G: Administrasi | Tambah peran Akuntan, Kasir, Staf HRD beserta hak aksesnya |

---

### Modul H: Kasir

Modul kasir mengelola semua arus kas masuk dan keluar yang **tidak melalui Virtual Account** — yaitu transaksi tunai, transfer manual, dan kas kecil di kantor yayasan.

| ID | Kebutuhan | Prioritas |
|---|---|---|
| H1 | Kasir dapat membuat transaksi **penerimaan kas**: bayar tagihan siswa (tunai), uang pangkal, sumbangan, penerimaan lainnya | P0 |
| H2 | Kasir dapat membuat transaksi **pengeluaran kas**: biaya operasional, pembelian perlengkapan, pembayaran vendor, lainnya | P0 |
| H3 | Setiap transaksi kasir memiliki akun GL debit dan kredit — diisi otomatis dari mapping default, dapat di-override | P0 |
| H4 | Sistem mendukung **Kas Kecil (Petty Cash)**: pengisian saldo awal, pencatatan pengeluaran, pengisian ulang (reimbursement), dan laporan saldo | P1 |
| H5 | Kasir dapat melakukan **rekonsiliasi bank**: mencocokkan transaksi sistem dengan mutasi rekening koran yang diimpor (CSV/Excel) | P1 |
| H6 | Sistem menyediakan **laporan posisi kas harian** per akun kas (kas tunai, bank, petty cash) | P0 |
| H7 | Setiap transaksi kasir menghasilkan nomor referensi unik dan dapat dicetak sebagai voucher kas masuk/keluar | P1 |
| H8 | Kasir memilih **sekolah** sebagai cost center untuk setiap transaksi | P0 |
| H9 | Akuntan dapat meninjau, menyetujui, atau menolak transaksi kasir yang belum di-post | P1 |

#### H.1 Status Transaksi Kasir

| Status | Keterangan |
|---|---|
| `draft` | Diinput Kasir, belum diposting ke GL |
| `posted` | Telah diposting ke GL — tidak dapat diubah |
| `reversed` | Dibatalkan via jurnal pembalik (reversal) |

---

### Modul I: Simpanan Siswa

Modul ini mengelola program tabungan sekolah (*simpanan/tabungan siswa*), di mana siswa menyetorkan dana secara berkala dan dapat menarik saldo sesuai ketentuan sekolah. Dari sisi akuntansi, simpanan siswa adalah **liabilitas** bagi sekolah.

| ID | Kebutuhan | Prioritas |
|---|---|---|
| I1 | Foundation Admin dapat mengaktifkan/menonaktifkan program simpanan per sekolah | P0 |
| I2 | Setiap siswa aktif dapat memiliki **rekening simpanan** di sekolahnya | P0 |
| I3 | Kasir dapat mencatat **setoran simpanan** siswa (tunai) — memperbarui saldo dan memposting jurnal ke GL | P0 |
| I4 | Kasir dapat mencatat **penarikan simpanan** siswa dengan validasi saldo tidak boleh negatif | P0 |
| I5 | Sistem menampilkan **buku simpanan digital** per siswa: saldo awal, daftar mutasi (setoran/penarikan), saldo akhir | P0 |
| I6 | Orang tua dapat melihat saldo simpanan anaknya di aplikasi mobile (read-only) | P0 |
| I7 | Saat siswa keluar/pindah, saldo simpanan muncul dalam ringkasan posisi keuangan siswa dengan opsi pencairan atau transfer ke saudara kandung | P0 |
| I8 | Foundation Admin dapat melihat **rekap simpanan seluruh siswa** per sekolah dan konsolidasi: total saldo simpanan (total liabilitas ke siswa) | P0 |
| I9 | Laporan simpanan dapat diekspor (Excel) | P1 |

---

### Modul J: Hutang Usaha (Accounts Payable)

Modul ini mencatat dan melacak kewajiban pembayaran yayasan kepada vendor/supplier atas barang atau jasa yang sudah diterima.

| ID | Kebutuhan | Prioritas |
|---|---|---|
| J1 | Foundation Admin/Akuntan dapat mengelola **master vendor**: nama, alamat, NPWP, nomor rekening bank | P0 |
| J2 | Akuntan dapat mencatat **faktur hutang** (AP invoice): vendor, tanggal faktur, tanggal jatuh tempo, nominal, keterangan, akun GL yang didebit (beban atau aset) | P0 |
| J3 | Sistem menampilkan **daftar hutang outstanding** dengan aging: belum jatuh tempo, 1–30 hari, 31–60 hari, 60+ hari | P0 |
| J4 | Akuntan/Kasir dapat mencatat **pelunasan hutang** (penuh atau sebagian) — memperbarui saldo AP dan memposting jurnal ke GL | P0 |
| J5 | Sistem mengirimkan notifikasi internal ke Akuntan ketika hutang mendekati jatuh tempo (H-7, H-3) | P1 |
| J6 | Laporan AP: daftar hutang per vendor, per aging bucket, total outstanding per sekolah dan konsolidasi | P0 |
| J7 | Akuntan dapat membatalkan faktur hutang yang belum ada pembayarannya dengan mencatat alasan | P1 |
| J8 | Ringkasan total hutang outstanding ditampilkan di dashboard Akuntan dan Foundation Admin | P0 |

---

### Modul K: Penggajian

Modul penggajian mengelola komponen gaji seluruh karyawan/guru di semua sekolah, menghasilkan slip gaji, dan memposting beban gaji ke GL secara otomatis.

| ID | Kebutuhan | Prioritas |
|---|---|---|
| K1 | Foundation Admin/Staf HRD dapat mengelola **data karyawan**: nama, NIK, NPWP, jabatan, sekolah, status (aktif/non-aktif), rekening bank gaji | P0 |
| K2 | Staf HRD dapat mendefinisikan **komponen penggajian** per karyawan: gaji pokok, tunjangan (transport, makan, jabatan, lainnya), potongan tetap (BPJS Kesehatan, BPJS Ketenagakerjaan, lainnya) | P0 |
| K3 | Sistem **menghitung PPh 21 otomatis** berdasarkan status PTKP, penghasilan bruto, dan tarif progresif yang berlaku | P0 |
| K4 | Staf HRD dapat menjalankan **proses penggajian bulanan** (payroll run): pilih periode dan sekolah, tinjau rekap, konfirmasi sebelum finalisasi | P0 |
| K5 | Sistem menerbitkan **slip gaji digital** per karyawan yang dapat diunduh dan dicetak | P0 |
| K6 | Setelah payroll run difinalisasi, sistem otomatis **memposting jurnal beban gaji** ke GL | P0 |
| K7 | Sistem menghasilkan **rekapitulasi penggajian** per sekolah per periode: total gaji bruto, total potongan, total gaji neto | P0 |
| K8 | Sistem menghasilkan **laporan PPh 21** per karyawan per tahun (data untuk Bukti Potong A1) | P1 |
| K9 | Staf HRD dapat mencatat **penyesuaian gaji satu kali** untuk periode tertentu: bonus, THR, koreksi | P1 |
| K10 | Payroll run yang sudah difinalisasi **tidak dapat diubah** — koreksi dilakukan via penyesuaian di periode berikutnya | P0 |
| K11 | Staf HRD dapat mencatat absensi/potongan kehadiran yang mempengaruhi gaji (opsional) | P2 |

#### K.1 Komponen Perhitungan PPh 21

| Komponen | Keterangan |
|---|---|
| Penghasilan Bruto | Gaji pokok + seluruh tunjangan kena pajak |
| Pengurang | Iuran BPJS Kesehatan (bagian karyawan), iuran pensiun |
| PTKP | Dikonfigurasi per karyawan sesuai status (TK/0, TK/1, K/0, K/1, K/2, K/3, dll.) |
| PKP | Penghasilan Bruto − Pengurang − PTKP |
| PPh 21 | Tarif progresif sesuai PKP — bracket dan tarif dikonfigurasi mengikuti regulasi DJP terkini |

---

### Modul L: Inventaris & Aset Tetap

Modul ini mencatat semua aset tetap yayasan (tanah, bangunan, kendaraan, peralatan, inventaris) dan menghitung penyusutan secara otomatis setiap bulan.

| ID | Kebutuhan | Prioritas |
|---|---|---|
| L1 | Foundation Admin/Akuntan dapat mengelola **master aset**: kode aset, nama, kategori, lokasi/sekolah, tanggal perolehan, nilai perolehan, nilai residu, umur manfaat (bulan), metode penyusutan | P0 |
| L2 | Sistem mendukung dua **metode penyusutan**: Garis Lurus (Straight-Line) dan Saldo Menurun (Declining Balance) | P0 |
| L3 | Sistem **menghitung dan memposting penyusutan otomatis** ke GL setiap awal bulan via scheduled job | P0 |
| L4 | Sistem menampilkan **Kartu Aset** per item: nilai perolehan, akumulasi penyusutan per periode, nilai buku saat ini | P0 |
| L5 | Akuntan dapat mencatat **mutasi aset**: penambahan, disposal (pelepasan), dan pemindahan antar sekolah | P1 |
| L6 | Saat aset di-dispose, sistem menghitung dan memposting jurnal disposal termasuk keuntungan/kerugian pelepasan | P1 |
| L7 | Foundation Admin dapat melihat **daftar aset per sekolah** dan konsolidasi dengan nilai buku terkini | P0 |
| L8 | Laporan inventaris dan aset tetap dapat diekspor (Excel/PDF) | P1 |
| L9 | Sistem menampilkan notifikasi untuk aset yang sudah habis umur manfaatnya (nilai buku = nilai residu) | P2 |

#### L.1 Kategori Aset dan Parameter Default

| Kategori | Umur Manfaat Default | Metode Default |
|---|---|---|
| Tanah | Tidak disusutkan | — |
| Bangunan | 20 tahun | Garis Lurus |
| Kendaraan | 5 tahun | Saldo Menurun |
| Peralatan IT (komputer, printer) | 4 tahun | Garis Lurus |
| Inventaris Kantor/Kelas | 5 tahun | Garis Lurus |
| Peralatan Olahraga/Lab | 8 tahun | Garis Lurus |

---

### Modul M: Akuntansi Formal — General Ledger

Modul ini adalah inti dari sistem akuntansi formal. Semua transaksi dari modul lain berakhir di sini sebagai jurnal yang membentuk laporan keuangan resmi.

---

#### M.1 Master Perkiraan (Chart of Accounts)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| M1-1 | Sistem menyediakan **template CoA default** untuk yayasan/sekolah Indonesia: 5 kelompok akun utama (Aktiva, Kewajiban, Ekuitas, Pendapatan, Beban) dengan akun-akun standar sekolah | P0 |
| M1-2 | Foundation Admin/Akuntan dapat **menambah, mengubah, dan menonaktifkan akun** — akun yang sudah memiliki transaksi tidak dapat dihapus, hanya dinonaktifkan | P0 |
| M1-3 | CoA mendukung **hierarki akun** (induk → anak) hingga 3 level untuk pengelompokan laporan | P0 |
| M1-4 | Setiap akun memiliki atribut: kode, nama, tipe (aktiva/kewajiban/ekuitas/pendapatan/beban), posisi normal (debit/kredit), status aktif/non-aktif | P0 |
| M1-5 | Akun dapat ditandai sebagai **akun kontrol** — tidak dapat diposting langsung, hanya melalui sub-akun | P1 |
| M1-6 | Akuntan dapat melihat **daftar akun lengkap** beserta saldo per periode yang dipilih | P0 |

**Struktur Kelompok CoA Default:**

| Kelompok | Rentang Kode | Isi |
|---|---|---|
| 1 – Aktiva | 1-1000 s/d 1-9999 | Kas, Piutang, Persediaan, Aset Tetap, Akumulasi Penyusutan |
| 2 – Kewajiban | 2-1000 s/d 2-9999 | Hutang Usaha, Hutang Gaji, Hutang PPh 21, Simpanan Siswa |
| 3 – Ekuitas | 3-1000 s/d 3-9999 | Modal Yayasan, Surplus Ditahan, Surplus/Defisit Tahun Berjalan |
| 4 – Pendapatan | 4-1000 s/d 4-9999 | Pendapatan SPP, Uang Pangkal, Kegiatan Sekolah, Non-Operasional |
| 5 – Beban | 5-1000 s/d 5-9999 | Beban Gaji, Penyusutan, Perlengkapan, Utilitas, Pemeliharaan |

---

#### M.2 Jurnal Transaksi

| ID | Kebutuhan | Prioritas |
|---|---|---|
| M2-1 | Akuntan dapat membuat **jurnal umum manual** dengan bebas: nomor referensi, tanggal, keterangan, baris debit-kredit, cost center (sekolah) per baris | P0 |
| M2-2 | Sistem **menolak posting jurnal yang tidak balance** (total debit ≠ total kredit) — validasi di level aplikasi dan database | P0 |
| M2-3 | Seluruh transaksi dari modul operasional **otomatis membuat jurnal draft** yang dapat ditinjau oleh Akuntan sebelum diposting | P0 |
| M2-4 | Jurnal yang sudah di-post **tidak dapat diubah atau dihapus** — koreksi hanya via **jurnal pembalik (reversal entry)** | P0 |
| M2-5 | Akuntan dapat membuat **jurnal penyesuaian** (accrual, prepaid amortization, koreksi akhir periode) | P0 |
| M2-6 | Setiap jurnal memiliki atribut lengkap: nomor jurnal (auto-generated), tanggal, tipe (otomatis/manual/penyesuaian/pembalik/penutup), keterangan, referensi sumber, dibuat oleh, di-post oleh, di-post pada | P0 |
| M2-7 | Sistem mendukung filter dan pencarian jurnal by: tanggal, tipe, akun, nominal, pembuat, referensi sumber | P0 |
| M2-8 | Akuntan dapat mencetak/mengekspor daftar jurnal untuk keperluan audit | P1 |

**Tipe Jurnal:**

| Tipe | Asal | Keterangan |
|---|---|---|
| `auto` | Modul operasional | Dibuat otomatis dari transaksi tagihan, kasir, payroll, AP, aset, simpanan |
| `manual` | Akuntan | Jurnal umum dibuat manual |
| `adjustment` | Akuntan | Jurnal penyesuaian akhir periode |
| `reversal` | Akuntan | Jurnal pembalik — referensi ke jurnal asal |
| `closing` | Sistem | Dibuat otomatis saat proses tutup tahun |

---

#### M.3 Buku Besar

| ID | Kebutuhan | Prioritas |
|---|---|---|
| M3-1 | Sistem menampilkan **Buku Besar per akun**: saldo awal periode, daftar transaksi (tanggal, nomor jurnal, keterangan, debit, kredit), saldo berjalan | P0 |
| M3-2 | Buku Besar dapat difilter by **periode** (bulan, kuartal, tahun), **sekolah** (cost center), atau konsolidasi semua sekolah | P0 |
| M3-3 | Buku Besar dapat diekspor ke Excel/PDF | P1 |

---

#### M.4 Neraca Saldo (Trial Balance)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| M4-1 | Sistem menghasilkan **Neraca Saldo** otomatis per periode: daftar semua akun dengan saldo debit/kredit dan total keseimbangan | P0 |
| M4-2 | Sistem menampilkan indikator apakah trial balance **balance atau tidak** — jika tidak balance, sistem menyorot selisihnya | P0 |
| M4-3 | Neraca Saldo dapat dilihat per sekolah (dengan filter cost center) atau konsolidasi yayasan | P0 |
| M4-4 | Neraca Saldo dapat diekspor (Excel/PDF) | P0 |

---

#### M.5 Neraca (Balance Sheet)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| M5-1 | Sistem menghasilkan **Neraca formal** secara otomatis per periode: Aktiva = Kewajiban + Ekuitas | P0 |
| M5-2 | Neraca ditampilkan dalam format standar: Aktiva Lancar, Aktiva Tidak Lancar, Kewajiban Lancar, Kewajiban Jangka Panjang, Ekuitas | P0 |
| M5-3 | Neraca dapat dilihat per sekolah atau konsolidasi yayasan | P0 |
| M5-4 | Neraca mendukung **perbandingan dua periode** (mis.: bulan ini vs bulan lalu, tahun ini vs tahun lalu) | P1 |
| M5-5 | Neraca dapat diekspor (Excel/PDF) | P0 |

---

#### M.6 Laporan Surplus-Defisit (setara Laporan Laba Rugi untuk Yayasan)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| M6-1 | Sistem menghasilkan **Laporan Surplus-Defisit** otomatis per periode: Total Pendapatan − Total Beban = Surplus (atau Defisit) | P0 |
| M6-2 | Laporan dikelompokkan sesuai hierarki CoA: Pendapatan Operasional, Pendapatan Non-Operasional, Beban Operasional (per sub-kategori), Beban Non-Operasional | P0 |
| M6-3 | Laporan dapat dilihat per sekolah atau konsolidasi yayasan | P0 |
| M6-4 | Laporan mendukung **perbandingan dua periode** | P1 |
| M6-5 | Laporan dapat diekspor (Excel/PDF) | P0 |

---

#### M.7 Tutup Tahun (Year-end Closing)

| ID | Kebutuhan | Prioritas |
|---|---|---|
| M7-1 | Foundation Admin/Akuntan dapat menginisiasi **proses tutup buku tahunan** — dilindungi konfirmasi berlapis (tidak bisa tidak sengaja dijalankan) | P0 |
| M7-2 | Sistem memvalidasi **prasyarat tutup buku** sebelum proses bisa dijalankan: semua jurnal periode sudah di-post, trial balance balance, tidak ada transaksi draft yang tertinggal | P0 |
| M7-3 | Proses tutup buku **otomatis menutup akun nominal** (pendapatan dan beban) ke akun **Surplus/Defisit Ditahan** di ekuitas | P0 |
| M7-4 | Sistem membuat **saldo awal tahun buku baru** dari saldo akhir akun riil (aktiva, kewajiban, ekuitas) | P0 |
| M7-5 | Setelah tutup buku, periode lama ditandai `closed` — tidak ada transaksi baru yang dapat diposting ke periode tersebut | P0 |
| M7-6 | Proses tutup buku menghasilkan **laporan penutupan** yang dapat dicetak untuk arsip | P1 |

#### M.7.1 Prasyarat & Alur Proses Tutup Tahun

1. Akuntan memastikan semua jurnal penyesuaian akhir tahun sudah diinput dan di-post.
2. Akuntan menjalankan Trial Balance — memastikan status balance.
3. Akuntan mencetak Neraca dan Laporan Surplus-Defisit final sebagai arsip.
4. Foundation Admin memicu "Mulai Tutup Tahun" — sistem meminta konfirmasi dua kali.
5. Sistem memvalidasi prasyarat — jika ada yang tidak memenuhi, proses dihentikan dengan pesan error spesifik.
6. Sistem memposting jurnal penutupan otomatis (menutup semua akun pendapatan dan beban).
7. Sistem membuat saldo awal untuk tahun buku baru.
8. Periode lama dikunci (`closed`). Sistem membuka periode baru secara otomatis.

---

#### M.8 Rasio Keuangan

| ID | Kebutuhan | Prioritas |
|---|---|---|
| M8-1 | Sistem menghitung dan menampilkan **rasio likuiditas**: Current Ratio (Aktiva Lancar / Kewajiban Lancar) dan Quick Ratio | P0 |
| M8-2 | Sistem menghitung **rasio solvabilitas**: Debt-to-Asset Ratio dan Debt-to-Equity Ratio | P1 |
| M8-3 | Sistem menghitung **rasio operasional** relevan untuk yayasan: Cost Recovery Ratio (Total Pendapatan / Total Beban) | P1 |
| M8-4 | Rasio ditampilkan di dashboard Akuntan/Foundation Admin dengan **indikator tren** (naik/turun vs periode sebelumnya) | P0 |
| M8-5 | Foundation Admin/Akuntan dapat melihat **grafik tren rasio** selama 12 bulan terakhir | P1 |
| M8-6 | Sistem menampilkan definisi dan interpretasi tiap rasio secara inline (tooltip) | P2 |

---

### Tambahan Modul F: Laporan Keuangan Terpadu

Modul laporan operasional (F1–F6 dari v2.4) diperluas dengan laporan dari semua modul baru:

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F7 | Laporan Neraca (Balance Sheet) — per periode, per sekolah / konsolidasi, ekspor PDF/Excel | P0 |
| F8 | Laporan Surplus-Defisit — per periode, per sekolah / konsolidasi, ekspor PDF/Excel | P0 |
| F9 | Laporan Arus Kas (Cash Flow Statement — metode langsung berdasarkan data kasir) | P1 |
| F10 | Laporan Buku Besar per akun | P1 |
| F11 | Laporan Penggajian per periode per sekolah: rekap dan detail per karyawan | P0 |
| F12 | Laporan Hutang Usaha (AP Aging Report) per vendor dan per aging bucket | P0 |
| F13 | Laporan Inventaris & Aset Tetap: daftar aset, nilai buku, akumulasi penyusutan | P0 |
| F14 | Laporan Simpanan Siswa: rekap saldo per siswa, mutasi, total liabilitas simpanan | P0 |
| F15 | Laporan PPh 21 per karyawan per tahun (data untuk Bukti Potong A1) | P1 |

---

## 4. User Flow (Alur Kunci)

> Alur 4.1–4.8 (dari v2.4) dipertahankan. Bagian ini menjabarkan alur kunci modul baru.

### 4.9 Penggajian Bulanan

1. Staf HRD membuka menu Penggajian → "Jalankan Payroll" → pilih periode dan sekolah.
2. Sistem menghitung gaji bruto, tunjangan, potongan BPJS, dan PPh 21 secara otomatis untuk setiap karyawan.
3. HRD meninjau rekap: nama karyawan, gaji bruto, total potongan, gaji neto. Dapat menambahkan penyesuaian satu kali (bonus, THR).
4. HRD mengklik "Finalisasi Payroll" → sistem meminta konfirmasi.
5. Sistem memposting jurnal beban gaji ke GL otomatis (DR Beban Gaji / CR Hutang Gaji).
6. Slip gaji digital diterbitkan per karyawan; rekapitulasi dikirim ke Foundation Admin.

### 4.10 Pencatatan Hutang & Pelunasan

1. Vendor mengirim faktur → Akuntan membuka Hutang Usaha → "Tambah Faktur".
2. Akuntan mengisi: vendor, tanggal faktur, nominal, tanggal jatuh tempo, akun beban yang didebit.
3. Sistem memposting jurnal: DR Beban (atau Aset) / CR Hutang Usaha.
4. Saat jatuh tempo, Akuntan/Kasir membuat transaksi pelunasan → sistem memposting: DR Hutang Usaha / CR Kas.
5. Status faktur berubah ke `lunas`.

### 4.11 Pencatatan & Penyusutan Aset Baru

1. Akuntan membuka Inventaris → "Tambah Aset".
2. Mengisi: nama, kategori, tanggal perolehan, nilai perolehan, umur manfaat, metode penyusutan.
3. Sistem memposting jurnal perolehan: DR Aset Tetap / CR Kas atau Hutang Usaha.
4. Setiap awal bulan, scheduled job menghitung penyusutan dan memposting otomatis: DR Beban Penyusutan / CR Akumulasi Penyusutan.
5. Akuntan dapat melihat Kartu Aset: nilai buku setiap bulan.

### 4.12 Transaksi Kasir & Rekonsiliasi Bank

1. Kasir menerima pembayaran tunai (bukan SPP) → Kasir membuka menu Kasir → "Penerimaan Kas".
2. Mengisi: jenis penerimaan, nominal, sekolah, keterangan, akun GL (diisi otomatis dari default).
3. Sistem menyimpan transaksi dengan status `draft`.
4. Akuntan meninjau dan men-post transaksi → status berubah ke `posted`, jurnal tercatat di GL.
5. Akhir bulan: Kasir mengimpor mutasi rekening koran → sistem mencocokkan otomatis dengan transaksi kas di sistem → Kasir menyelesaikan item yang belum cocok → laporan rekonsiliasi dicetak.

### 4.13 Tutup Buku Tahunan

1. Akuntan menyelesaikan semua jurnal penyesuaian akhir tahun.
2. Akuntan menjalankan Trial Balance — memastikan status balance.
3. Akuntan mencetak Neraca dan Laporan Surplus-Defisit final untuk arsip.
4. Foundation Admin memicu "Mulai Tutup Tahun" di menu GL → konfirmasi berlapis.
5. Sistem memvalidasi prasyarat — jika ada jurnal draft atau trial balance tidak balance, proses dihentikan.
6. Sistem memposting jurnal penutupan otomatis (menutup semua akun pendapatan & beban ke Surplus Ditahan).
7. Saldo awal tahun buku baru dibuat. Periode lama dikunci.
8. Laporan penutupan dicetak sebagai arsip.

### 4.14 Setoran & Penarikan Simpanan Siswa

1. Siswa menyetorkan uang ke kantor → Kasir membuka Simpanan Siswa → cari siswa.
2. Kasir memilih "Setoran" → isi nominal → konfirmasi.
3. Saldo rekening simpanan siswa diperbarui; jurnal otomatis di-post ke GL: DR Kas / CR Simpanan Siswa.
4. Orang tua dapat melihat saldo terbaru di aplikasi mobile.
5. Untuk penarikan: alur yang sama dengan pilihan "Penarikan" — sistem memvalidasi saldo mencukupi.

---

## 5. Architecture

### 5.1 Gambaran Arsitektur

Sistem dirancang sebagai **arsitektur modular monolith** yang diperluas dari v2.4. Modular secara logis sehingga mudah dipecah ke microservices bila diperlukan.

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                │
│  ┌───────────────────────────────┐    ┌──────────────────────────┐  │
│  │  Web App                       │    │  Mobile App (Parent)     │  │
│  │  (Admin, Akuntan, Kasir, HRD)  │    │  React Native (Expo)     │  │
│  │  Next.js 14 (React)            │    └────────────┬─────────────┘  │
│  └───────────────┬────────────────┘                 │                │
└──────────────────┼──────────────────────────────────┼────────────────┘
                   │            HTTPS / REST API       │
┌──────────────────▼──────────────────────────────────▼────────────────┐
│                        API GATEWAY LAYER                              │
│             (JWT Auth, RBAC, Rate Limiting, Routing)                  │
└──────────────────────────────┬────────────────────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│                   APPLICATION LAYER (Backend — NestJS)                 │
│                                                                        │
│  ┌────────────────┐ ┌────────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ Pendataan &    │ │ Pembayaran     │ │   Kasir &   │ │ Simpanan  │ │
│  │ Tagihan        │ │ & VA           │ │   Petty Cash│ │ Siswa     │ │
│  └────────────────┘ └────────────────┘ └─────────────┘ └───────────┘ │
│  ┌────────────────┐ ┌────────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ Hutang Usaha   │ │ Penggajian     │ │ Inventaris  │ │ Budgeting │ │
│  │ (AP)           │ │ & PPh 21       │ │ & Aset      │ │ Forecasting│ │
│  └────────────────┘ └────────────────┘ └─────────────┘ └───────────┘ │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                 GENERAL LEDGER ENGINE (Modul M)                 │   │
│  │  Journal Dispatcher · Balance Validator · Period Manager        │   │
│  │  Report Generator · Closing Engine · Ratio Calculator          │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ┌────────────────┐ ┌────────────────┐                                │
│  │ Laporan &      │ │ Notifikasi     │                                │
│  │ Ekspor         │ │                │                                │
│  └────────────────┘ └────────────────┘                                │
└───────────────────────────────┬───────────────────────────────────────┘
                                 │
┌────────────────────────────────▼──────────────────────────────────────┐
│                            DATA LAYER                                  │
│          PostgreSQL (primary) · Redis (cache & queue)                 │
└────────────────────────────────┬──────────────────────────────────────┘
                                 │
┌────────────────────────────────▼──────────────────────────────────────┐
│                      EXTERNAL INTEGRATIONS                             │
│   Payment Gateway (Midtrans/Xendit) · Email Provider                  │
│   Push Notification (FCM/APNs)                                        │
└───────────────────────────────────────────────────────────────────────┘
```

### 5.2 General Ledger Engine

GL Engine adalah komponen sentral yang menerima event transaksi dari semua modul operasional:

- **Journal Dispatcher**: menerima event dari modul operasional → membuat draft jurnal otomatis → mengantrikan untuk review/posting.
- **Balance Validator**: memvalidasi setiap jurnal sebelum posting — total debit harus = total kredit; menolak jika tidak balance.
- **Period Manager**: mengelola status periode akuntansi (open/closed); mencegah posting ke periode yang sudah tutup buku.
- **Report Generator**: menyusun Trial Balance, Neraca, dan Laporan Surplus-Defisit dari data jurnal secara on-demand.
- **Closing Engine**: menjalankan proses tutup tahun secara transaksional (all-or-nothing); rollback jika ada error.
- **Ratio Calculator**: menghitung rasio keuangan dari data Neraca dan Laporan Surplus-Defisit terkini.

### 5.3 Prinsip Desain Kunci (tambahan dari v2.4)
- **Double-entry enforcement**: constraint di level database (CHECK atau trigger) memastikan setiap jurnal yang tersimpan selalu balance — bukan hanya validasi di aplikasi.
- **Imutabilitas jurnal**: jurnal yang sudah diposting tidak dapat diubah/dihapus — dikenforce dengan RBAC di layer database (revoke UPDATE/DELETE pada tabel `journals` untuk role aplikasi).
- **Period locking**: transaksi tidak bisa diposting ke periode akuntansi yang statusnya `closed`.
- **Cost center dimension**: setiap baris jurnal (`journal_lines`) memiliki `school_id` sebagai cost center — memungkinkan laporan per sekolah dan konsolidasi tanpa skema terpisah per sekolah.
- **Payroll idempotency**: unique constraint pada `(school_id, period_year, period_month)` di `payroll_runs` mencegah double payroll run.
- **Penyusutan aset idempoten**: scheduled job penyusutan aman dijalankan ulang — cek dulu apakah record `asset_depreciation_schedule` untuk periode tersebut sudah ada.
- **Background jobs**: penyusutan aset bulanan, forecast recalculation, penggajian batch, dan laporan massal berjalan asinkron via BullMQ.
- **Idempotency webhook VA**: tidak boleh ada pembayaran ganda dari webhook yang sama (dari v2.4).

---

## 6. Database Schema

### 6.1 Gambaran Entitas

```
-- DARI v2.4 (dipertahankan) --
foundations ──< schools
schools ──< students
         ──< fee_categories ──< fee_amounts
         ──< budgets
students ──< virtual_accounts
         ──< bills ──< bill_items
                   ──< payments
guardians ──< guardian_student ──< students (m2m)
bills ──< bill_status_history
forecast_cache · collection_rate_history
student_exit_resolutions · audit_logs
users (foundation_admin, akuntan, kasir, staf_hrd, teacher)

-- TAMBAHAN BARU --

-- GL Core --
accounting_periods
accounts (CoA) ──< journal_lines
journals ──< journal_lines

-- Kasir --
cash_transactions
bank_reconciliations ──< bank_reconciliation_items

-- Simpanan Siswa --
student_savings_accounts ──< student_savings_transactions

-- Hutang Usaha --
vendors ──< ap_invoices ──< ap_payments

-- Penggajian --
employees ──< payroll_components
payroll_runs ──< payroll_lines

-- Inventaris & Aset --
assets ──< asset_depreciation_schedule
        ──< asset_mutations
```

### 6.2 Tabel Baru

| Tabel | Kolom Kunci | Catatan |
|---|---|---|
| `accounting_periods` | `id`, `foundation_id`, `year`, `month`, `status` (open/closed) | Mengontrol apakah transaksi bisa diposting ke periode ini; satu record per bulan per yayasan |
| `accounts` | `id`, `foundation_id`, `code`, `name`, `type` (asset/liability/equity/revenue/expense), `normal_balance` (debit/credit), `parent_id`, `is_control`, `is_active` | CoA — hierarki hingga 3 level |
| `journals` | `id`, `foundation_id`, `journal_number`, `date`, `type` (auto/manual/adjustment/reversal/closing), `description`, `source_module`, `source_id`, `status` (draft/posted), `posted_by`, `posted_at`, `reversed_by_journal_id` | Header jurnal; immutable setelah posted |
| `journal_lines` | `id`, `journal_id`, `account_id`, `school_id` (cost center), `debit`, `credit`, `description` | Baris jurnal; debit XOR kredit per baris (tidak boleh keduanya non-zero) |
| `cash_transactions` | `id`, `school_id`, `type` (receipt/payment), `date`, `amount`, `category`, `description`, `journal_id`, `debit_account_id`, `credit_account_id`, `status` (draft/posted/reversed), `reference_number`, `created_by` | Transaksi kasir |
| `bank_reconciliations` | `id`, `school_id`, `account_id`, `period_year`, `period_month`, `statement_balance`, `book_balance`, `status` (draft/completed) | Header rekonsiliasi bank |
| `bank_reconciliation_items` | `id`, `reconciliation_id`, `cash_transaction_id`, `statement_date`, `statement_amount`, `statement_description`, `status` (matched/unmatched) | Item rekonsiliasi per baris rekening koran |
| `student_savings_accounts` | `id`, `student_id`, `school_id`, `balance`, `opened_at`, `status` (active/closed) | Rekening simpanan per siswa |
| `student_savings_transactions` | `id`, `savings_account_id`, `type` (deposit/withdrawal), `amount`, `balance_after`, `transacted_at`, `journal_id`, `recorded_by`, `notes` | Mutasi simpanan |
| `vendors` | `id`, `foundation_id`, `name`, `npwp`, `address`, `bank_account`, `bank_name`, `contact_name`, `contact_phone` | Master vendor |
| `ap_invoices` | `id`, `vendor_id`, `school_id`, `invoice_number`, `invoice_date`, `due_date`, `amount`, `paid_amount`, `status` (open/partial/paid/cancelled), `journal_id`, `debit_account_id`, `description` | Faktur hutang usaha |
| `ap_payments` | `id`, `ap_invoice_id`, `amount`, `paid_at`, `payment_method`, `journal_id`, `recorded_by`, `notes` | Pembayaran AP |
| `employees` | `id`, `school_id`, `name`, `nik`, `npwp`, `position`, `department`, `status` (active/inactive), `bank_account`, `bank_name`, `ptkp_status`, `join_date` | Data karyawan/guru |
| `payroll_components` | `id`, `employee_id`, `type` (allowance/deduction), `name`, `amount`, `is_taxable`, `is_fixed`, `is_active` | Komponen gaji tetap per karyawan |
| `payroll_runs` | `id`, `school_id`, `period_year`, `period_month`, `status` (draft/finalized), `total_gross`, `total_net`, `journal_id`, `finalized_by`, `finalized_at` | Header payroll run; unique per (school_id, period_year, period_month) |
| `payroll_lines` | `id`, `payroll_run_id`, `employee_id`, `base_salary`, `total_allowance`, `total_deduction_bpjs`, `total_one_time_adjustment`, `taxable_income`, `ptkp`, `pkp`, `pph21`, `net_salary`, `slip_number` | Detail penggajian per karyawan |
| `assets` | `id`, `school_id`, `asset_code`, `name`, `category`, `acquisition_date`, `acquisition_cost`, `residual_value`, `useful_life_months`, `depreciation_method` (straight_line/declining_balance), `account_id`, `accum_depr_account_id`, `depr_expense_account_id`, `status` (active/disposed) | Master aset tetap |
| `asset_depreciation_schedule` | `id`, `asset_id`, `period_year`, `period_month`, `depreciation_amount`, `book_value_after`, `journal_id`, `is_posted` | Jadwal & realisasi penyusutan; unik per (asset_id, period_year, period_month) |
| `asset_mutations` | `id`, `asset_id`, `type` (addition/disposal/transfer), `effective_date`, `amount`, `destination_school_id`, `notes`, `journal_id`, `recorded_by` | Mutasi aset |

### 6.3 Perubahan pada Tabel Lama

| Tabel | Perubahan |
|---|---|
| `users` | Tambah nilai `role`: `akuntan`, `kasir`, `staf_hrd` (di samping `foundation_admin`, `teacher`) |
| `payments` | Tambah `journal_id` — foreign key ke jurnal yang dibuat otomatis saat pembayaran dicatat |
| `bills` | Tambah `journal_id` — foreign key ke jurnal piutang yang dibuat saat tagihan diterbitkan |

### 6.4 Pertimbangan Desain Penting

- **Double-entry constraint di DB**: trigger PostgreSQL pada tabel `journals` memvalidasi bahwa sum(debit) = sum(credit) per journal_id di `journal_lines` setiap INSERT — bukan hanya validasi di aplikasi.
- **Imutabilitas via status + RBAC DB**: role database yang digunakan aplikasi tidak memiliki hak UPDATE/DELETE pada tabel `journals` dan `journal_lines` setelah status = `posted` (dikenforce via row-level policy atau trigger).
- **Cost center di journal_lines**: setiap baris jurnal menyimpan `school_id` — agregasi per sekolah dilakukan via GROUP BY, bukan skema terpisah.
- **Payroll idempotency**: UNIQUE constraint pada `(school_id, period_year, period_month)` di tabel `payroll_runs`.
- **Penyusutan idempoten**: UNIQUE constraint pada `(asset_id, period_year, period_month)` di `asset_depreciation_schedule` — job bisa dijalankan ulang dengan aman.
- **Tipe data finansial**: selalu `DECIMAL(18,2)`, tidak pernah `FLOAT`.
- **Soft delete**: data tidak pernah hard-deleted (pakai `deleted_at`), kecuali pada tabel yang secara eksplisit menggunakan status field.
- **Kalkulasi GL tidak disimpan inline**: laporan keuangan (Neraca, Surplus-Defisit) digenerate on-demand dari `journal_lines` — tidak disimpan sebagai snapshot kecuali untuk keperluan cache performa.

---

## 7. Tech Stack

### 7.1 Frontend — Web Admin

| Komponen | Pilihan | Catatan |
|---|---|---|
| Framework | Next.js 14 (React, App Router) | |
| Bahasa | TypeScript | |
| Styling/UI | Tailwind CSS + komponen UI kustom | |
| Charting | Recharts | Budget, forecast, rasio keuangan, aging |
| Tabel data | TanStack Table | Buku besar, daftar jurnal, payroll lines |
| State management | Zustand (auth, UI state) + React Query (server state) | |
| Export | react-pdf + xlsx | Ekspor laporan keuangan ke PDF/Excel |

### 7.2 Mobile — Aplikasi Orang Tua

| Komponen | Pilihan |
|---|---|
| Framework | React Native (Expo) |
| Navigasi | React Navigation |
| Push notification | Firebase Cloud Messaging (FCM) |
| State management | React Query |

### 7.3 Backend

| Komponen | Pilihan | Catatan |
|---|---|---|
| Runtime/Framework | Node.js + NestJS | |
| Bahasa | TypeScript | |
| Job Queue | BullMQ (Redis) | Penggajian batch, penyusutan otomatis, forecasting, notifikasi massal |
| Autentikasi | JWT + refresh token | |
| Scheduled Jobs | Cron via BullMQ | Penyusutan aset (awal bulan), forecast recalculation (nightly), payroll reminder |
| Validasi | Zod | Validasi skema input + validasi balance jurnal di layer aplikasi |

### 7.4 Database & Infrastruktur

| Komponen | Pilihan |
|---|---|
| Database utama | PostgreSQL |
| Cache & Queue | Redis |
| ORM | Prisma |

---

## 8. Deployment

### 8.1 Environment

| Environment | Tujuan |
|---|---|
| Development | Pengembangan aktif |
| Staging | Pengujian + sandbox payment gateway + uji tutup buku end-to-end |
| Production | Live — 5 sekolah |

### 8.2 Prinsip Deployment
- CI/CD otomatis: test → staging → approval manual → production.
- Database migration dikontrol via Prisma, dengan backup sebelum migrasi besar.
- Zero-downtime rolling deployment.
- Backup database harian, retensi minimal 30 hari.
- Proses tutup buku tahunan **wajib diuji di staging** dengan data produksi yang dianonimkan sebelum pertama kali dijalankan di production.
- Job penyusutan dan penggajian harus idempoten — aman dijalankan ulang bila ada kegagalan di tengah jalan.

### 8.3 Rencana Rollout

| Fase | Cakupan |
|---|---|
| **Fase 1 (MVP)** | Seluruh fitur Fase 1 dari v2.4 + Kasir dasar (H1–H3, H6, H8) + Simpanan Siswa (I2–I8) + Hutang Usaha dasar (J1–J4, J6, J8) + Penggajian dasar (K1–K7, K10) + Inventaris dasar (L1–L4, L7) + GL penuh (M1–M6 semua ID P0) + Tutup Tahun (M7-1 s/d M7-5) + Rasio dasar (M8-1, M8-4) + Laporan Keuangan (F7, F8, F11, F12, F13, F14) |
| **Fase 2** | Seluruh fitur Fase 2 dari v2.4 + Kasir lanjutan (H4, H5, H7, H9) + AP lanjutan (J5, J7) + Payroll lanjutan (K8, K9) + Inventaris lanjutan (L5, L6, L8) + Perbandingan periode GL (M4-4, M5-4, M6-4) + Rasio lanjutan (M8-2, M8-3, M8-5) + Laporan tambahan (F9, F10, F15) |
| **Fase 3** | Seluruh fitur Fase 3 dari v2.4 + Absensi payroll (K11) + Notifikasi aset habis umur (L9) + Tooltip rasio (M8-6) + Simpanan ekspor (I9) |

---

## Lampiran

### A.1 Template Chart of Accounts Default (Detail)

| Kode | Nama Akun | Tipe | Normal Balance |
|---|---|---|---|
| **1 – AKTIVA** | | | |
| 1-1000 | Aktiva Lancar | Aktiva | Debit |
| 1-1100 | Kas & Setara Kas | Aktiva | Debit |
| 1-1110 | Kas Tunai | Aktiva | Debit |
| 1-1120 | Kas Bank — [nama bank 1] | Aktiva | Debit |
| 1-1130 | Kas Bank — [nama bank 2] | Aktiva | Debit |
| 1-1140 | Kas Kecil (Petty Cash) | Aktiva | Debit |
| 1-1200 | Piutang Usaha | Aktiva | Debit |
| 1-1210 | Piutang SPP Siswa | Aktiva | Debit |
| 1-1220 | Piutang Lainnya | Aktiva | Debit |
| 1-1300 | Perlengkapan & Persediaan | Aktiva | Debit |
| 1-1400 | Beban Dibayar Dimuka | Aktiva | Debit |
| 1-2000 | Aktiva Tidak Lancar | Aktiva | Debit |
| 1-2100 | Aset Tetap | Aktiva | Debit |
| 1-2110 | Tanah | Aktiva | Debit |
| 1-2120 | Bangunan | Aktiva | Debit |
| 1-2130 | Kendaraan | Aktiva | Debit |
| 1-2140 | Peralatan & Inventaris Kantor | Aktiva | Debit |
| 1-2150 | Komputer & Perangkat IT | Aktiva | Debit |
| 1-2160 | Peralatan Lab & Olahraga | Aktiva | Debit |
| 1-2200 | Akumulasi Penyusutan | Aktiva | **Kredit** (kontra-aset) |
| 1-2210 | Akum. Penyusutan Bangunan | Aktiva | Kredit |
| 1-2220 | Akum. Penyusutan Kendaraan | Aktiva | Kredit |
| 1-2230 | Akum. Penyusutan Peralatan | Aktiva | Kredit |
| 1-2240 | Akum. Penyusutan Komputer | Aktiva | Kredit |
| **2 – KEWAJIBAN** | | | |
| 2-1000 | Kewajiban Lancar | Kewajiban | Kredit |
| 2-1100 | Hutang Usaha | Kewajiban | Kredit |
| 2-1200 | Hutang Gaji | Kewajiban | Kredit |
| 2-1300 | Hutang Pajak | Kewajiban | Kredit |
| 2-1310 | Hutang PPh 21 | Kewajiban | Kredit |
| 2-1400 | Simpanan Siswa | Kewajiban | Kredit |
| 2-1500 | Pendapatan Diterima Dimuka | Kewajiban | Kredit |
| 2-1600 | Hutang Lainnya | Kewajiban | Kredit |
| 2-2000 | Kewajiban Jangka Panjang | Kewajiban | Kredit |
| 2-2100 | Hutang Bank Jangka Panjang | Kewajiban | Kredit |
| **3 – EKUITAS** | | | |
| 3-1000 | Modal Yayasan | Ekuitas | Kredit |
| 3-2000 | Surplus Ditahan | Ekuitas | Kredit |
| 3-3000 | Surplus/Defisit Tahun Berjalan | Ekuitas | Kredit |
| **4 – PENDAPATAN** | | | |
| 4-1000 | Pendapatan Operasional | Pendapatan | Kredit |
| 4-1100 | Pendapatan SPP | Pendapatan | Kredit |
| 4-1200 | Pendapatan Uang Pangkal | Pendapatan | Kredit |
| 4-1300 | Pendapatan Kegiatan Sekolah | Pendapatan | Kredit |
| 4-1400 | Pendapatan Lainnya | Pendapatan | Kredit |
| 4-2000 | Pendapatan Non-Operasional | Pendapatan | Kredit |
| 4-2100 | Pendapatan Bunga Bank | Pendapatan | Kredit |
| 4-2200 | Keuntungan Pelepasan Aset | Pendapatan | Kredit |
| **5 – BEBAN** | | | |
| 5-1000 | Beban Operasional | Beban | Debit |
| 5-1100 | Beban Gaji & Tunjangan | Beban | Debit |
| 5-1200 | Beban Penyusutan | Beban | Debit |
| 5-1300 | Beban Perlengkapan | Beban | Debit |
| 5-1400 | Beban Utilitas (Listrik, Air, Internet) | Beban | Debit |
| 5-1500 | Beban Pemeliharaan & Perbaikan | Beban | Debit |
| 5-1600 | Beban Administrasi & Umum | Beban | Debit |
| 5-1700 | Beban Kegiatan Pendidikan | Beban | Debit |
| 5-2000 | Beban Non-Operasional | Beban | Debit |
| 5-2100 | Beban Bunga Pinjaman | Beban | Debit |
| 5-2200 | Kerugian Pelepasan Aset | Beban | Debit |

---

### A.2 Glosarium Lengkap

| Istilah | Definisi |
|---|---|
| **SPP** | Sumbangan Pembinaan Pendidikan — biaya sekolah bulanan berulang |
| **Tunggakan** | Tagihan jatuh tempo yang belum lunas (status `overdue` atau `partial`). `pending` tidak termasuk |
| **VA (Virtual Account)** | Nomor rekening unik per siswa untuk otomatisasi pembayaran |
| **CoA** | Chart of Accounts — daftar terstruktur semua akun akuntansi |
| **Double-entry** | Setiap transaksi dicatat di dua sisi (debit & kredit) yang selalu balance |
| **Jurnal** | Pencatatan transaksi keuangan dengan pasangan debit-kredit |
| **Posting** | Proses memindahkan entri jurnal ke Buku Besar masing-masing akun |
| **Buku Besar** | Ringkasan semua transaksi per akun dengan saldo berjalan |
| **Trial Balance** | Neraca Saldo — daftar semua akun dan saldonya; total debit = total kredit |
| **Neraca** | Balance Sheet — laporan posisi keuangan: Aktiva = Kewajiban + Ekuitas |
| **Surplus-Defisit** | Setara Laba-Rugi untuk yayasan/entitas nirlaba |
| **Tutup Buku** | Proses akhir tahun: akun nominal ditutup, saldo dipindahkan ke ekuitas |
| **Jurnal Pembalik** | Reversal entry — membalik jurnal sebelumnya tanpa menghapus jurnal asal |
| **Cost Center** | Dimensi `school_id` pada baris jurnal — memungkinkan laporan per sekolah dan konsolidasi |
| **Simpanan Siswa** | Program tabungan sekolah: dana milik siswa yang dititipkan — **liabilitas** bagi sekolah |
| **AP** | Accounts Payable — hutang usaha kepada vendor/supplier |
| **Penyusutan** | Depreciation — alokasi biaya aset tetap secara sistematis selama umur manfaatnya |
| **Akumulasi Penyusutan** | Total penyusutan yang telah dibebankan sejak aset diperoleh (kontra-aset) |
| **Nilai Buku** | Nilai Perolehan − Akumulasi Penyusutan |
| **PTKP** | Penghasilan Tidak Kena Pajak — batas penghasilan bebas pajak per status perkawinan/tanggungan |
| **PKP** | Penghasilan Kena Pajak = Bruto − Pengurang − PTKP |
| **PPh 21** | Pajak Penghasilan Pasal 21 — pajak atas penghasilan karyawan, dipotong pemberi kerja |
| **BPJS** | Badan Penyelenggara Jaminan Sosial — iuran kesehatan (BPJSK) & ketenagakerjaan (BPJSTK) |
| **Billing Forecast** | Proyeksi total tagihan yang akan diterbitkan berdasarkan siswa aktif × fee schedule |
| **Collection Forecast** | Proyeksi penerimaan kas = Billing Forecast × historical collection rate |
| **Idempoten** | Operasi yang menghasilkan efek sama meski dijalankan berulang — penting untuk payroll, penyusutan, dan webhook pembayaran |
| **Tagihan Superseded** | Tagihan otomatis yang digantikan koreksi manual — disimpan untuk audit, tidak dihitung tunggakan |

---

### A.3 Riwayat Revisi Dokumen

| Versi | Tanggal | Perubahan Utama |
|---|---|---|
| PRD Penagihan v1.0–v2.4 | 21–26 Jun 2026 | Sistem penagihan biaya sekolah — lihat PRD Sistem Manajemen Keuangan Sekolah v2.4 |
| **Sistem Akuntansi v1.0** | **26 Jun 2026** | PRD baru yang mencakup seluruh v2.4 dan menambahkan: Modul Kasir (H), Simpanan Siswa (I), Hutang Usaha/AP (J), Penggajian & PPh 21 (K), Inventaris & Aset Tetap (L), serta Akuntansi Formal/GL penuh (M: CoA, Jurnal, Buku Besar, Trial Balance, Neraca, Surplus-Defisit, Tutup Tahun, Rasio Keuangan). Termasuk: matriks integrasi jurnal otomatis antar-modul, peran baru (Akuntan, Kasir, Staf HRD), schema DB lengkap, template CoA default, GL Engine architecture, dan rencana fasing yang diperbarui |
