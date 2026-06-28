# Dokumen Kebutuhan Produk (Product Requirements Document)
## Sistem Manajemen Keuangan Sekolah

| | |
|---|---|
| **Status Dokumen** | Draft v2.4 |
| **Tanggal** | 26 Juni 2026 |
| **Penulis** | [Nama Anda] |
| **Pemangku Kepentingan** | Pimpinan Yayasan, Kepala Sekolah, Staf Keuangan Yayasan, Tim IT/Engineering |
| **Tujuan Dokumen** | Briefing tim developer/vendor untuk pengembangan, sekaligus dokumentasi internal |

---

## 1. Overview

### 1.1 Ringkasan
Platform manajemen keuangan terpusat untuk yayasan yang membawahi **5 entitas sekolah**. Sistem ini mendigitalisasi seluruh siklus pembayaran — mulai dari pendataan siswa dan tagihan, proses pembayaran (virtual account maupun tunai), transparansi biaya untuk orang tua, budgeting, forecasting keuangan, sistem tagihan otomatis, hingga laporan keuangan konsolidasi — dikelola secara **terpusat oleh satu tim keuangan yayasan** yang menangani semua sekolah.

### 1.2 Latar Belakang & Pernyataan Masalah
Saat ini, administrasi pembayaran di 5 sekolah dilakukan secara manual dan tidak konsisten:

- **Staf keuangan yayasan** mengelola penagihan dan rekonsiliasi untuk 5 sekolah secara manual — beban kerja tinggi, rawan kesalahan, data terfragmentasi.
- **Orang tua** tidak punya cara mudah untuk mengetahui nominal yang harus dibayar, kapan jatuh temponya, atau melacak riwayat pembayaran.
- **Yayasan** tidak memiliki gambaran konsolidasi dan real-time atas kesehatan keuangan 5 sekolah, sehingga perencanaan, budgeting, dan forecasting pendapatan menjadi sulit dilakukan.
- Tanpa sistem tagihan otomatis dan pengingat, tunggakan menumpuk dan sulit ditindaklanjuti.
- Tidak ada proyeksi pendapatan yang memungkinkan yayasan merencanakan pengeluaran secara akurat.

### 1.3 Struktur Organisasi
- **1 Yayasan** membawahi **5 entitas sekolah**.
- **Keuangan dikelola terpusat**: satu tim keuangan di level yayasan menangani tagihan, pembayaran, budgeting, dan pelaporan untuk seluruh 5 sekolah — bukan per-sekolah secara terpisah.
- Yayasan memiliki **tampilan per sekolah dan konsolidasi** untuk pengawasan dan pelaporan.

### 1.4 Tujuan Produk
1. Menyederhanakan pengelolaan keuangan secara terpusat: pendataan, penagihan, pembayaran, dan laporan untuk semua 5 sekolah dari satu platform.
2. Memberikan orang tua visibilitas yang jelas dan mandiri (self-service) mengenai nominal yang harus dibayar dan kapan jatuh temponya.
3. Menekan tingkat tunggakan melalui budgeting terstruktur, penagihan proaktif, dan notifikasi otomatis.
4. Mengotomatisasi pembuatan tagihan dan pengingat untuk mengurangi beban kerja manual staf keuangan yayasan.
5. Memberikan **proyeksi pendapatan (forecasting)** berbasis data historis dan jadwal tagihan, untuk mendukung perencanaan keuangan yayasan yang lebih akurat.

### 1.5 Bukan Tujuan (Di Luar Cakupan v1)
- Akuntansi/pembukuan umum (general ledger, pelaporan pajak, payroll) — sistem ini adalah **sistem penagihan, pengelolaan pembayaran, dan perencanaan keuangan biaya sekolah**, bukan ERP penuh.
- Integrasi dengan SIS (Sistem Informasi Sekolah) atau software akuntansi yang sudah ada (dikonfirmasi: dibangun mandiri/standalone).
- Dukungan multi-yayasan (multi-tenant) di luar satu yayasan dan 5 sekolahnya.
- Denda keterlambatan (late fee).

### 1.6 Persona Pengguna

**Ibu Sari — Orang Tua.** Punya dua anak di dua sekolah berbeda di bawah yayasan yang sama. Ingin satu tempat untuk melihat tagihan tiap anak, dapat pengingat, dan membayar tanpa ke kantor sekolah.

**Pak Budi — Staf Keuangan Yayasan.** Mengelola penagihan ~2.500 siswa di 5 sekolah dari satu kantor yayasan. Saat ini pakai spreadsheet terpisah per sekolah dan menagih manual.

**Ibu Dewi — Kepala Keuangan Yayasan.** Perlu laporan konsolidasi bulanan, analisis tren tunggakan, dan proyeksi pendapatan untuk rapat pengurus yayasan dan pengambilan keputusan anggaran.

**Bu Rina — Wali Kelas.** Ingin visibilitas cepat siswa di kelasnya yang menunggak, tanpa akses ke detail keuangan atau kemampuan mengubah data.

---

## 2. Requirements

### 2.1 Pengguna & Peran

> **Perubahan dari v2.3**: Peran `School Admin` dihapus. Semua operasi penagihan, pembayaran, budgeting, dan pelaporan kini menjadi tanggung jawab **Foundation Admin** (tim keuangan yayasan), yang mengelola seluruh 5 sekolah dari satu akun.

| Peran | Deskripsi | Lingkup Akses |
|---|---|---|
| **Foundation Admin** | Tim keuangan yayasan (operator + pimpinan) | Akses penuh untuk mengelola data, penagihan, pembayaran, budgeting, forecasting, dan laporan seluruh 5 sekolah |
| **Teacher** | Staf tingkat kelas | Akses langsung ke **daftar/data tagihan siswa** di kelasnya (read-only) — tanpa dashboard/ringkasan terpisah. Tidak dapat menambah, mengubah, atau menghapus data siswa, dan tidak dapat mencatat pembayaran |
| **Parent / Guardian** | Membayar biaya atas nama siswa | Akses lihat (view-only) tagihan, riwayat pembayaran, saldo; dapat melakukan pembayaran via VA |

#### 2.1.1 Navigasi Menu (Web App)

| Menu | Foundation Admin | Teacher |
|---|:---:|:---:|
| Dashboard | ✓ | — |
| Data Siswa | ✓ | ✓ (read-only) |
| Tagihan Siswa | ✓ | ✓ (read-only) |
| Kategori Biaya | ✓ | — |
| Pembayaran | ✓ | — |
| Tunggakan & Aging | ✓ | — |
| Budgeting | ✓ | — |
| **Forecasting** | ✓ | — |
| Laporan | ✓ | — |
| Pengaturan | ✓ | — |

Catatan:
- **Teacher** tidak memiliki halaman Dashboard. Saat login, Teacher langsung diarahkan ke halaman Data Siswa.
- **Foundation Admin** mengelola semua sekolah sekaligus; setiap halaman memiliki filter/selector untuk melihat per-sekolah atau konsolidasi.
- Tidak ada lagi peran **School Admin** — semua fungsi operasional keuangan terpusat di Foundation Admin.

### 2.2 Platform
- **Aplikasi web** untuk Foundation Admin dan Teacher.
- **Aplikasi mobile** untuk Parent (iOS & Android).

### 2.3 Functional Requirements (Ringkasan)
Requirement fungsional detail dijabarkan di Bagian 3 (Core Features). Secara garis besar, sistem harus mampu:
- Mengelola data master siswa, biaya, dan siklus penagihan untuk semua sekolah secara terpusat.
- Memproses pembayaran melalui virtual account (otomatis) dan tunai (manual, dicatat staf yayasan).
- Memberi orang tua visibilitas penuh atas tagihan dan riwayat pembayaran anak-anaknya.
- Melakukan budgeting dan pelacakan tunggakan per sekolah dan konsolidasi.
- **Menghasilkan proyeksi pendapatan (forecasting)** berbasis jadwal tagihan dan tingkat pembayaran historis.
- Mengotomatisasi pembuatan tagihan dan notifikasi.
- Menghasilkan laporan per sekolah dan konsolidasi tingkat yayasan.
- Menangani kasus siswa keluar/pindah sekolah dengan beberapa mekanisme penyelesaian saldo.

### 2.4 Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| **Keamanan** | Autentikasi aman untuk semua peran; enkripsi data sensitif saat transit (TLS) dan at-rest; kontrol akses berbasis peran (RBAC) |
| **Kinerja** | Rekonsiliasi pembayaran VA tercatat dalam hitungan detik; dashboard dan halaman forecasting memuat dalam < 3 detik |
| **Skalabilitas** | Sistem dapat menangani pertumbuhan hingga puluhan ribu siswa lintas 5 sekolah |
| **Ketersediaan** | Target uptime ≥ 99.5%, terutama selama periode penagihan (awal/akhir bulan) |
| **Auditabilitas** | Seluruh perubahan data finansial tercatat dalam log audit yang tidak dapat diubah |
| **Lokalisasi** | Antarmuka dalam Bahasa Indonesia; format mata uang Rupiah (IDR); format tanggal konvensi Indonesia |
| **Kepatuhan Data** | Penyimpanan data pribadi sesuai UU Pelindungan Data Pribadi (UU PDP) Indonesia |
| **Desain Dashboard** | Seluruh dashboard bersifat **view-only/ringkasan** — tidak menampilkan button action langsung di tampilan dashboard. Aksi pengelolaan dilakukan melalui halaman/menu khusus |

### 2.5 Definisi Saldo Tunggakan

Saldo tunggakan siswa dihitung sebagai **jumlah sisa tagihan yang berstatus `overdue` atau `partial`**. Tagihan berstatus `pending` tidak dihitung sebagai tunggakan.

| Status Tagihan | Masuk Tunggakan? | Keterangan |
|---|:---:|---|
| `pending` | Tidak | Belum jatuh tempo |
| `partial` | **Ya** | Jatuh tempo, dibayar sebagian |
| `overdue` | **Ya** | Jatuh tempo, belum ada pembayaran |
| `paid` | Tidak | Lunas |
| `superseded` | Tidak | Digantikan tagihan koreksi manual |

### 2.6 Asumsi & Dependensi
- Mitra payment gateway/bank untuk virtual account dipilih dan dikontrak terpisah.
- Satu tim keuangan yayasan mengelola seluruh 5 sekolah — tidak ada staf keuangan yang khusus per sekolah dalam sistem ini.
- Orang tua memiliki akses ke smartphone dan rekening bank/e-wallet yang mendukung transfer VA.
- Tidak diperlukan integrasi dengan sistem yang sudah ada.
- Konektivitas internet di kantor yayasan memadai.

---

## 3. Core Features

### A. Pendataan

| ID | Kebutuhan | Prioritas |
|---|---|---|
| A1 | Foundation Admin dapat membuat dan mengelola data master siswa untuk semua sekolah (nama, kelas, sekolah, kontak orang tua/wali, status: aktif/non-aktif/lulus/pindah) | P0 |
| A2 | Foundation Admin dapat mendefinisikan kategori biaya per sekolah | P0 |
| A3 | Foundation Admin dapat menetapkan nominal biaya per kategori, dengan opsi berbeda per jenjang/kelas | P0 |
| A4 | Foundation Admin dapat melakukan migrasi data siswa dan biaya melalui beberapa mekanisme (detail A.1) | P0 |
| A5 | Sistem mendukung satu akun orang tua terhubung ke beberapa anak, termasuk yang berada di sekolah berbeda | P0 |
| A6 | Foundation Admin dapat mengatur jenis siklus penagihan per kategori biaya | P0 |
| A7 | Log audit untuk seluruh perubahan data | P1 |
| A8 | Foundation Admin dapat mengubah status siswa menjadi "keluar/pindah" dengan tanggal efektif, otomatis menghentikan tagihan baru | P0 |
| A9 | Saat status siswa diubah ke "keluar/pindah", sistem menampilkan ringkasan posisi keuangan | P0 |
| A10 | Sistem menyediakan beberapa mekanisme penyelesaian saldo (detail A.2) | P0 |
| A11 | Foundation Admin dapat menentukan jadwal penagihan spesifik per kategori biaya (tanggal terbit + tenggang bayar) dengan pratinjau langsung (detail A.3) | P0 |

#### A.1 Opsi Mekanisme Migrasi Data

| Opsi | Mekanisme | Cocok untuk |
|---|---|---|
| 1. Template Excel terpandu | Kolom baku, validasi otomatis | Staf tanpa latar belakang IT |
| 2. Wizard impor dengan mapping kolom | Pratinjau + pemetaan kolom fleksibel | Data dalam format berbeda dari template |
| 3. Pratinjau & validasi sebelum impor final | Ringkasan valid/error sebelum tersimpan | Pengaman semua opsi |
| 4. Input manual | Form satu per satu | Data sangat sedikit atau tidak terstruktur |
| 5. Bantuan migrasi terbantu | Tim implementasi membersihkan & mengunggah data | Data berantakan atau tanpa SDM teknis |

#### A.2 Opsi Mekanisme Penyelesaian Saldo (Siswa Keluar/Pindah)

| Opsi | Mekanisme |
|---|---|
| 1. Tutup tanpa penyelesaian dana | Saldo dicatat sebagai catatan akhir |
| 2. Refund ke rekening orang tua | Refund manual dicatat di sistem |
| 3. Pemindahan saldo | Ke tagihan saudara kandung yang masih aktif |
| 4. Penagihan sisa tetap berjalan | Tagihan outstanding tetap aktif |
| 5. Write-off saldo | Sisa dihapuskan dengan alasan tercatat |

#### A.3 Konfigurasi Jadwal Penagihan per Kategori Biaya (A11)

| Parameter | Siklus Berlaku | Keterangan |
|---|---|---|
| **Tanggal Terbit** | Bulanan, Semester, Tahunan | Hari dalam siklus kapan tagihan otomatis diterbitkan (nilai: 1–28) |
| **Tenggang Bayar** | Semua siklus | Jumlah hari dari tanggal terbit hingga jatuh tempo |

Contoh: `issueDay=1, dueDayOffset=9` → terbit tgl 1, jatuh tempo tgl 10. UI menampilkan pratinjau langsung dan chip ringkasan di setiap kartu kategori.

### B. Teknis Pembayaran

| ID | Kebutuhan | Prioritas |
|---|---|---|
| B1 | Setiap siswa diberikan nomor virtual account (VA) unik | P0 |
| B2 | Sistem terintegrasi dengan payment gateway/mitra bank untuk mengelola VA | P0 |
| B3 | Pembayaran ke VA terdeteksi dan terekonsiliasi otomatis dengan tagihan terkait | P0 |
| B4 | Sistem mendukung pembayaran sebagian (partial) dan melacak sisa saldo per tagihan | P1 |
| B5 | Foundation Admin dan orang tua menerima konfirmasi pembayaran langsung setelah transaksi berhasil | P0 |
| B6 | Sistem menghasilkan kuitansi pembayaran digital (dapat diunduh/dibagikan) | P0 |
| B7 | Foundation Admin dapat melihat status pembayaran real-time per siswa, kategori, kelas, dan sekolah | P0 |
| B8 | Dukungan satu VA untuk beberapa tagihan dengan logika alokasi otomatis | P1 |
| B9 | Foundation Admin dapat mencatat pembayaran tunai terhadap tagihan siswa | P0 |
| B10 | Pembayaran tunai menghasilkan kuitansi dan langsung memperbarui status tagihan real-time | P0 |
| B11 | Jejak audit untuk pembayaran tunai | P1 |

### C. Pengalaman Orang Tua — Informasi Biaya

| ID | Kebutuhan | Prioritas |
|---|---|---|
| C1 | Orang tua melihat per anak: total nominal, tanggal jatuh tempo, rincian per kategori | P0 |
| C2 | Orang tua melihat riwayat pembayaran lengkap per anak beserta kuitansi | P0 |
| C3 | Orang tua melihat nomor VA anaknya | P0 |
| C4 | Orang tua dengan >1 anak melihat tampilan konsolidasi semua anak, termasuk lintas sekolah | P0 |
| C5 | Notifikasi push & email: tagihan baru, pengingat jatuh tempo, konfirmasi pembayaran, pemberitahuan keterlambatan | P0 |
| C6 | Orang tua melihat tagihan mendatang (belum jatuh tempo) untuk perencanaan | P1 |

### D. Budgeting & Kontrol Tunggakan

| ID | Kebutuhan | Prioritas |
|---|---|---|
| D1 | Foundation Admin menetapkan rencana budget tahunan/semester per sekolah | P0 |
| D2 | Sistem melacak budget vs realisasi real-time per sekolah dan konsolidasi | P0 |
| D3 | Sistem menandai/menghitung tunggakan dengan kategori aging (0–30, 31–60, 61–90, 90+ hari) — ditampilkan di halaman Tunggakan untuk Foundation Admin | P0 |
| D4 | Tren tingkat tunggakan dari waktu ke waktu ditampilkan di dashboard dan laporan Foundation Admin | P0 |
| D5 | Foundation Admin dapat menetapkan ambang batas risiko yang memicu notifikasi | P1 |

### D.F Forecasting Budget (Fitur Baru)

Fitur forecasting memungkinkan Foundation Admin memproyeksikan pendapatan dan penagihan untuk periode mendatang berdasarkan dua sumber data: **jadwal tagihan yang dikonfigurasi** (sisi penagihan) dan **tingkat pembayaran historis** (sisi collection/realisasi).

| ID | Kebutuhan | Prioritas |
|---|---|---|
| DF1 | Sistem menghitung **proyeksi penagihan (revenue forecast)** untuk periode mendatang berdasarkan jumlah siswa aktif × nominal fee kategori × jadwal siklus (bulanan/semester/tahunan) — per sekolah dan konsolidasi | P0 |
| DF2 | Sistem menghitung **proyeksi penerimaan (collection forecast)** dengan menerapkan tingkat pembayaran historis (rata-rata 3/6/12 bulan terakhir) pada proyeksi penagihan — menghasilkan perkiraan kas yang masuk | P0 |
| DF3 | Tampilan **perbandingan tiga lajur**: Budget (rencana) · Forecast (proyeksi berbasis data) · Aktual (realisasi) — per kategori biaya, per sekolah, dan konsolidasi | P0 |
| DF4 | Foundation Admin dapat melihat **grafik proyeksi cash flow bulanan** untuk 3, 6, atau 12 bulan ke depan, yang menggabungkan tagihan terjadwal dan proyeksi penerimaan | P0 |
| DF5 | Foundation Admin dapat menyesuaikan **asumsi collection rate** secara manual per kategori atau per sekolah (misal: "asumsikan collection rate SPP SD bulan depan 85%") untuk skenario optimis/realistis/pesimis | P1 |
| DF6 | Sistem menampilkan **variance analysis**: selisih antara forecast dan aktual realisasi, dengan indikator apakah di atas atau di bawah proyeksi | P1 |
| DF7 | Foundation Admin dapat **mengekspor laporan forecasting** (Excel/PDF) untuk keperluan rapat pengurus dan perencanaan anggaran | P1 |
| DF8 | Sistem menampilkan **proyeksi tunggakan kumulatif**: berapa total tunggakan yang diperkirakan pada akhir periode jika tren pembayaran saat ini berlanjut | P2 |

#### D.F.1 Definisi & Metodologi Forecasting

**Proyeksi Penagihan (Billing Forecast):**
```
Penagihan per kategori per bulan =
  Jumlah siswa aktif yang ditagih × Nominal fee × Frekuensi dalam periode
```
Contoh: SPP SD kelas 4 = 150 siswa × Rp550.000 × 1 bulan = Rp82.500.000

**Proyeksi Penerimaan (Collection Forecast):**
```
Collection Forecast = Billing Forecast × Historical Collection Rate
Historical Collection Rate = Rata-rata (Total Diterima / Total Ditagih) selama N bulan terakhir
```
Collection Rate dihitung per kategori dan per sekolah untuk akurasi lebih tinggi.

**Skenario Forecasting:**
Sistem mendukung tiga skenario yang dapat dipilih admin:

| Skenario | Asumsi Collection Rate |
|---|---|
| Optimis | Historical rate + 5% (capped 100%) |
| Realistis (default) | Historical rate persis |
| Pesimis | Historical rate − 10% |

**Komponen tampilan Forecasting (halaman DF):**
1. **Selector periode**: pilih periode proyeksi (1 bulan, 3 bulan, 6 bulan, 1 tahun)
2. **Selector sekolah**: Semua Sekolah / pilih satu sekolah
3. **Selector skenario**: Optimis / Realistis / Pesimis
4. **Grafik cash flow**: Bar chart bulanan (Billing Forecast vs Collection Forecast vs Aktual)
5. **Tabel detail**: Per kategori biaya — Budget · Forecast · Aktual · Variance (Rp & %)
6. **Summary cards**: Total Billing Forecast, Total Collection Forecast, Expected Gap (belum terkumpul), Proyeksi Tunggakan Kumulatif

### E. Sistem Tagihan Otomatis

| ID | Kebutuhan | Prioritas |
|---|---|---|
| E1 | Tagihan dibuat otomatis sesuai siklus (A6) dan jadwal yang dikonfigurasi (A11) | P0 |
| E2 | Pengingat otomatis sebelum jatuh tempo (dapat dikonfigurasi: 7/3/1 hari) | P0 |
| E3 | Pemberitahuan otomatis setelah jatuh tempo terlewat | P0 |
| E4 | Foundation Admin dapat membuat tagihan manual untuk **biaya satu kali** — berdiri sendiri, tidak memengaruhi tagihan otomatis | P0 |
| E4a | Foundation Admin dapat membuat tagihan manual sebagai **koreksi untuk kategori dan periode yang sama** — menggantikan tagihan otomatis dengan status `superseded` (tidak dihapus, untuk audit) | P0 |
| E5 | Foundation Admin dapat memberi diskon/beasiswa/keringanan dengan pencatatan alasan | P1 |

#### E.1 Alur Tagihan Manual — Dua Mode (E4 & E4a)

**Mode 1 — Biaya Satu Kali (E4)**: Untuk biaya di luar siklus otomatis. Tagihan berdiri sendiri.

**Mode 2 — Koreksi Tagihan (E4a)**: Untuk mengoreksi tagihan otomatis yang sudah terbit. Admin memilih tagihan mana yang dikoreksi. Tagihan asli → `superseded`. Jika tagihan asli sudah dibayar sebagian, sistem menampilkan peringatan konfirmasi.

**Status `superseded`**: Tidak dihitung tunggakan, tidak terlihat oleh orang tua, disimpan untuk audit, dapat diakses admin via filter status.

### F. Laporan Rekap

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F1 | Laporan operasional per sekolah: ringkasan penagihan, saldo tertunggak, daftar tunggakan, by tanggal/kelas/kategori | P0 |
| F2 | Laporan konsolidasi tingkat yayasan lintas semua sekolah | P0 |
| F3 | Laporan dapat diekspor (Excel/PDF) | P0 |
| F4 | Ringkasan laporan otomatis (harian/mingguan/bulanan) ke Foundation Admin | P1 |
| F5 | Drill-down dari ringkasan konsolidasi ke detail per sekolah | P1 |
| F6 | Laporan kustom by rentang tanggal & perbandingan periode | P2 |

### G. Administrasi & Hak Akses

| ID | Kebutuhan | Prioritas |
|---|---|---|
| G1 | Role-based access control sesuai peran di Bagian 2.1 | P0 |
| G2 | Foundation Admin memiliki akses penuh ke seluruh 5 sekolah | P0 |
| G3 | Teacher memiliki akses read-only ke data siswa dan tagihan di kelasnya saja — tanpa dashboard terpisah; saat login langsung diarahkan ke halaman Data Siswa | P0 |
| G4 | Teacher tidak dapat menambah, mengubah, atau menghapus data siswa | P0 |
| G5 | Teacher tidak dapat mencatat pembayaran | P0 |
| G6 | Autentikasi aman untuk semua peran, dengan reset password dan manajemen sesi | P0 |
| G7 | Foundation Admin dapat mengelola akun pengguna (tambah/nonaktifkan Teacher, tambah staf keuangan) | P1 |

### Rencana Rilis (Fasing)

| Fase | Cakupan |
|---|---|
| **Fase 1 (MVP)** | A1–A11, B1–B7, B9–B10, C1–C5, D1–D4, DF1–DF4, E1–E4a, F1–F3, G1–G6 |
| **Fase 2** | D5, DF5–DF7, F4–F5, E5, B8, B11, A7 |
| **Fase 3** | C6, DF8, F6, G7 |

---

## 4. User Flow

### 4.1 Pendaftaran Siswa Baru & Tagihan Pertama
1. Foundation Admin menambahkan data siswa baru dan menetapkan kelas/jenjang/sekolah.
2. Sistem menetapkan nomor VA unik.
3. Admin menghubungkan/mengundang akun orang tua; orang tua mendaftar di aplikasi mobile.
4. Biaya yang berlaku untuk jenjang tersebut otomatis terpasang.
5. Tagihan pertama dibuat otomatis sesuai jadwal yang dikonfigurasi di kategori biaya; orang tua diberi notifikasi.

### 4.2 Pembayaran SPP Bulanan (via VA)
1. Sistem membuat tagihan bulanan otomatis sesuai Tanggal Terbit yang dikonfigurasi.
2. Orang tua menerima notifikasi nominal & jatuh tempo.
3. Orang tua transfer ke VA anaknya via bank/e-wallet.
4. Payment gateway mengonfirmasi; sistem rekonsiliasi otomatis.
5. Konfirmasi instan ke orang tua & Foundation Admin; kuitansi otomatis.

### 4.3 Pembayaran Tunai di Sekolah
1. Orang tua/siswa membayar tunai ke staf keuangan yayasan.
2. Staf mencatat pembayaran tunai di sistem.
3. Status tagihan & saldo diperbarui real-time.
4. Kuitansi diberikan; riwayat muncul di aplikasi mobile orang tua.

### 4.4 Penanganan Tunggakan
1. Jatuh tempo terlewat → tagihan berubah ke `overdue`.
2. Notifikasi otomatis ke orang tua.
3. Tagihan muncul di laporan tunggakan dengan aging category.
4. Foundation Admin menindaklanjuti dari halaman Tunggakan.

### 4.5 Siswa Keluar/Pindah Sekolah
1. Foundation Admin mengubah status siswa dengan tanggal efektif.
2. Sistem menghentikan tagihan baru otomatis.
3. Sistem menampilkan ringkasan posisi keuangan siswa.
4. Admin memilih mekanisme penyelesaian saldo.
5. Sistem mencatat untuk audit.

### 4.6 Perencanaan Keuangan Bulanan (Forecasting)
1. Foundation Admin membuka menu Forecasting.
2. Memilih periode proyeksi (misal: 6 bulan ke depan) dan skenario (Realistis).
3. Sistem menghitung billing forecast berdasarkan siswa aktif × fee schedule.
4. Sistem menghitung collection forecast berdasarkan historical collection rate 6 bulan terakhir.
5. Grafik cash flow 6 bulan ditampilkan: tagihan terjadwal vs. perkiraan penerimaan vs. aktual (bulan yang sudah berlalu).
6. Admin melihat tabel detail per kategori: Budget · Forecast · Aktual · Variance.
7. Admin menyesuaikan asumsi collection rate jika diperlukan (DF5).
8. Admin mengekspor laporan forecasting untuk rapat pengurus yayasan (DF7).

### 4.7 Koreksi Tagihan Otomatis (E4a)
1. Foundation Admin menemukan kesalahan pada tagihan otomatis yang sudah terbit.
2. Membuka halaman Tagihan → "Buat Tagihan Manual" → pilih mode **Koreksi Tagihan**.
3. Memilih tagihan otomatis yang akan dikoreksi.
4. Jika tagihan asli sudah dibayar sebagian, sistem menampilkan peringatan konfirmasi.
5. Tagihan asli diberi status `superseded`; tagihan koreksi baru berlaku aktif.

### 4.8 Konfigurasi Jadwal Penagihan (A11)
1. Foundation Admin membuka menu Kategori Biaya.
2. Membuat/edit kategori — pilih siklus, isi Tanggal Terbit + Tenggang Bayar.
3. Pratinjau langsung: *"Terbit tgl. 1 → Jatuh tempo tgl. 10 (9 hari tenggang)"*.
4. Simpan — berlaku untuk tagihan yang belum diterbitkan.

---

## 5. Architecture

### 5.1 Gambaran Arsitektur

Sistem dirancang sebagai **arsitektur modular monolith** untuk tahap awal. Modular secara logis (modul Pembayaran, Pendataan, Budgeting/Forecasting, Laporan, Notifikasi) sehingga mudah dipecah ke microservices jika diperlukan.

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                              │
│  ┌──────────────────────────┐      ┌──────────────────────────┐  │
│  │  Web App (Admin + Teacher)│      │  Mobile App (Parent)     │  │
│  │  Next.js (React)          │      │  React Native            │  │
│  └────────────┬─────────────┘      └────────────┬─────────────┘  │
└───────────────┼──────────────────────────────────┼───────────────┘
                │              HTTPS/REST API       │
┌───────────────▼──────────────────────────────────▼───────────────┐
│                       API GATEWAY LAYER                           │
│         (Autentikasi JWT, Rate Limiting, Routing)                 │
└───────────────┬──────────────────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────────────────┐
│                  APPLICATION LAYER (Backend)                      │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐ ┌──────────────┐  │
│  │ Pendataan│ │Pembayaran│ │Budget/Forecast │ │Laporan &     │  │
│  │& Tagihan │ │& VA      │ │& Tunggakan     │ │Notifikasi    │  │
│  └──────────┘ └──────────┘ └────────────────┘ └──────────────┘  │
└───────────────┬─────────────────────┬────────────────────────────┘
                │                     │
┌───────────────▼──────┐  ┌───────────▼───────────────────────────┐
│      DATA LAYER       │  │        EXTERNAL INTEGRATIONS          │
│  - PostgreSQL         │  │  - Payment Gateway (Midtrans/Xendit)  │
│  - Redis              │  │  - Email Provider                     │
│    (cache, queue)     │  │  - Push Notification (FCM/APNs)       │
└──────────────────────┘  └────────────────────────────────────────┘
```

### 5.2 Komponen Modul Forecasting

Modul **Budget/Forecast** memiliki tanggung jawab khusus:
- **Billing Forecast Engine**: menghitung proyeksi tagihan berdasarkan siswa aktif, fee schedule, dan jadwal penagihan — dijalankan sebagai scheduled job setiap malam (atau on-demand).
- **Collection Rate Calculator**: menganalisis data pembayaran historis per kategori per sekolah untuk menghasilkan historical collection rate.
- **Scenario Engine**: menerapkan asumsi (optimis/realistis/pesimis atau override manual) pada billing forecast untuk menghasilkan collection forecast.
- **Variance Tracker**: membandingkan forecast dengan aktual realisasi dan menghitung selisih secara real-time.

### 5.3 Prinsip Desain Kunci
- **Idempotency pada webhook pembayaran**: tidak boleh tercatat ganda.
- **Audit trail di level database**: setiap perubahan data finansial tercatat di log yang tidak dapat dihapus aplikasi.
- **Background job**: pembuatan tagihan massal, forecasting, laporan, dan notifikasi berjalan asinkron.
- **Filter sekolah global**: karena satu Foundation Admin mengelola semua sekolah, setiap modul menyediakan selector sekolah di level UI; backend memvalidasi bahwa filter ini tidak melampaui scope yang diizinkan.

---

## 6. Database Schema

### 6.1 Entitas Utama & Relasi

```
foundations (1) ───< schools (5)
schools (1) ───┬──< students
               ├──< fee_categories
               └──< budgets

students (1) ───┬──< virtual_accounts (1:1)
                └──< bills ───┬──< bill_items
                              └──< payments

guardians (1) ──< guardian_student (many-to-many dengan students)
              └──< notifications

bills ──< bill_status_history
users (foundation_admin, teacher)
forecast_cache (pre-computed forecast per periode per sekolah)
audit_logs
```

### 6.2 Tabel Inti

| Tabel | Kolom Kunci | Catatan |
|---|---|---|
| `foundations` | `id`, `name` | Satu baris |
| `schools` | `id`, `foundation_id`, `name` | 5 baris |
| `users` | `id`, `school_id` (nullable), `role` (foundation_admin/teacher), `email`, `password_hash` | Tidak ada lagi `school_admin` role |
| `students` | `id`, `school_id`, `name`, `class`, `grade_level`, `status`, `status_effective_date` | |
| `guardian_student` | `guardian_id`, `student_id`, `relationship` | |
| `guardians` | `id`, `name`, `phone`, `email`, `password_hash` | Akun orang tua |
| `fee_categories` | `id`, `school_id`, `name`, `billing_cycle`, `issue_day` (1–28; NULL untuk one_time), `due_day_offset` | |
| `fee_amounts` | `id`, `fee_category_id`, `grade_level`, `amount` | |
| `virtual_accounts` | `id`, `student_id`, `va_number`, `bank_code` | |
| `bills` | `id`, `student_id`, `fee_category_id`, `billing_period`, `due_date`, `total_amount`, `paid_amount`, `status` (pending/partial/paid/overdue/superseded), `created_by`, `superseded_by_bill_id` | |
| `bill_items` | `id`, `bill_id`, `fee_category_id`, `amount` | |
| `payments` | `id`, `bill_id`, `amount`, `payment_method`, `paid_at`, `recorded_by`, `gateway_reference`, `receipt_number` | |
| `budgets` | `id`, `school_id`, `fee_category_id`, `period`, `planned_amount` | |
| `forecast_cache` | `id`, `school_id`, `fee_category_id`, `period`, `billing_forecast`, `collection_forecast`, `collection_rate_used`, `scenario`, `computed_at` | Pre-computed; diperbarui nightly atau on-demand |
| `collection_rate_history` | `id`, `school_id`, `fee_category_id`, `period`, `billed`, `collected`, `rate` | Basis kalkulasi forecasting |
| `student_exit_resolutions` | `id`, `student_id`, `mechanism`, `amount`, `reason`, `resolved_by`, `resolved_at` | |
| `audit_logs` | `id`, `entity_type`, `entity_id`, `action`, `changed_by`, `changed_at`, `old_value`, `new_value` | |

### 6.3 Pertimbangan Desain Penting
- **Kalkulasi forecast tidak di-store di tabel utama**: hasil forecast disimpan di `forecast_cache` dan diperbarui secara berkala, bukan inline di tabel bills/budgets — menghindari data stale dan menjaga tabel transaksi bersih.
- **Collection rate per-sekolah per-kategori**: granularitas ini penting karena collection rate SPP SD bisa berbeda signifikan dari SPP SMP.
- **Definisi tunggakan**: hanya `overdue` + `partial` yang dihitung. `pending` tidak masuk.
- **Soft delete**: data tidak pernah hard-deleted (pakai `deleted_at`).
- **Tipe data finansial**: selalu `DECIMAL`, tidak pernah `FLOAT`.

---

## 7. Tech Stack

### 7.1 Frontend — Web Admin

| Komponen | Pilihan |
|---|---|
| Framework | Next.js 14 (React, App Router) |
| Bahasa | TypeScript |
| Styling/UI | Tailwind CSS + komponen UI kustom |
| Charting | Recharts (budget/forecast charts, aging charts) |
| State management | Zustand (auth) + React Query (server state) |

### 7.2 Mobile — Aplikasi Orang Tua

| Komponen | Pilihan |
|---|---|
| Framework | React Native (Expo) |
| Navigasi | React Navigation |
| Push notification | Firebase Cloud Messaging (FCM) |
| State management | React Query |

### 7.3 Backend

| Komponen | Pilihan |
|---|---|
| Runtime/Framework | Node.js + NestJS |
| Bahasa | TypeScript |
| Job Queue | BullMQ (Redis) — untuk generate tagihan, forecasting, notifikasi massal |
| Autentikasi | JWT + refresh token |
| Scheduled Jobs | Cron via BullMQ: nightly forecast recalculation, monthly bill generation |

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
| Staging | Pengujian + sandbox payment gateway |
| Production | Live — 5 sekolah |

### 8.2 Prinsip Deployment
- CI/CD otomatis: test → staging → approval manual → production.
- Database migration dikontrol via Prisma, dengan backup sebelum migrasi besar.
- Zero-downtime rolling deployment.
- Backup database harian, retensi minimal 30 hari.

### 8.3 Rencana Rollout
1. Pilot di 1 sekolah selama satu siklus penagihan penuh.
2. Evaluasi & penyesuaian.
3. Rollout ke 4 sekolah sisanya secara bertahap.

---

## Lampiran

### 10.1 Catatan Riset: Pemilihan Payment Gateway

**Midtrans vs Xendit:**
- Biaya VA: flat Rp2.500–4.000 per transaksi sukses (Midtrans tanpa biaya bulanan; Xendit +~Rp25.000/sub-akun/bulan — relevan untuk 5 entitas sekolah).
- Integrasi: Midtrans memiliki dokumentasi Bahasa Indonesia lebih lengkap dan SDK mobile native. Xendit API lebih modern tapi integrasi mobile via token.
- Rekomendasi awal: Midtrans — namun keputusan akhir perlu kuotasi resmi dan uji sandbox.

**Alternatif: VA langsung dengan Bank** — membutuhkan perjanjian giro korporat, cakupan terbatas satu bank, integrasi host-to-host.

### 10.2 Glosarium

| Istilah | Definisi |
|---|---|
| **SPP** | Sumbangan Pembinaan Pendidikan — biaya sekolah bulanan berulang |
| **Tunggakan** | Tagihan jatuh tempo yang belum lunas (status `overdue` atau `partial`). Tagihan `pending` tidak termasuk |
| **VA (Virtual Account)** | Nomor rekening unik per siswa untuk otomatisasi pembayaran |
| **Tagihan Superseded** | Tagihan otomatis yang digantikan koreksi manual (E4a). Disimpan untuk audit, tidak dihitung tunggakan |
| **Tanggal Terbit** | Hari dalam siklus kapan tagihan otomatis diterbitkan (konfigurasi A11) |
| **Tenggang Bayar** | Jumlah hari dari tanggal terbit hingga jatuh tempo |
| **Billing Forecast** | Proyeksi total tagihan yang akan diterbitkan berdasarkan siswa aktif × fee schedule |
| **Collection Forecast** | Proyeksi penerimaan kas berdasarkan billing forecast × historical collection rate |
| **Collection Rate** | Persentase tagihan yang berhasil terkumpul dalam periode tertentu |
| **Variance** | Selisih antara forecast/budget dengan nilai aktual realisasi |
| **Idempotent** | Operasi yang menghasilkan efek sama meski dijalankan berulang — penting untuk webhook pembayaran |

### 10.3 Riwayat Revisi Dokumen

| Versi | Tanggal | Perubahan Utama |
|---|---|---|
| 1.0 – 1.3 | 21 Jun 2026 | Draft awal hingga riset payment gateway |
| 2.0 | 21 Jun 2026 | Restrukturisasi total: Overview, Requirements, Core Features, Flow, Architecture, DB, Tech Stack, Deployment |
| 2.1 | 21 Jun 2026 | Tambah A11: konfigurasi jadwal penagihan (issueDay + dueDayOffset) |
| 2.2 | 21 Jun 2026 | Dashboard view-only; Teacher langsung ke tagihan (G4, G6); aging D3–D4 hanya Foundation Admin; E4/E4a dipisah; status `superseded` |
| 2.3 | 24 Jun 2026 | Tabel navigasi per peran (2.1.1); definisi tunggakan resmi (2.5); spec UI A11 lengkap (A.3); alur dua mode E4/E4a (E.1); G7 Teacher tidak bisa catat bayar; Fase 1 diperluas |
| **2.4** | **26 Jun 2026** | **(1) Penghapusan peran School Admin** — semua operasi penagihan, pembayaran, budgeting kini menjadi tanggung jawab Foundation Admin yang mengelola seluruh 5 sekolah terpusat. **(2) Fitur Forecasting Budget** (DF1–DF8): billing forecast, collection forecast, perbandingan Budget·Forecast·Aktual, grafik cash flow proyeksi, analisis variance, skenario optimis/realistis/pesimis, ekspor laporan. Termasuk definisi metodologi, komponen UI, tabel DB baru (`forecast_cache`, `collection_rate_history`), dan modul Forecast Engine di architecture |
