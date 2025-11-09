-# Sapa UMKM

Sapa UMKM adalah aplikasi mobile resmi Kementerian Koperasi dan UKM untuk membantu para pelaku UMKM mengelola legalitas, mengikuti program pemberdayaan, melakukan pelaporan kegiatan, dan berjejaring dengan komunitas. Proyek ini dibangun menggunakan Expo Router (React Native) dan menyajikan fondasi arsitektur layar, komponen, dan data statis yang siap diintegrasikan dengan backend pemerintah.

## Arsitektur Fitur

- **Beranda (Dashboard)** — Ringkasan fokus strategis platform berikut pintasan cepat menuju fitur penting seperti pengajuan NIB, pendaftaran program KUR, forum komunitas, dan pembaruan profil usaha.
- **Perizinan** — Detail proses pengajuan/pembaruan NIB, registrasi merek, dan sertifikasi. Setiap layanan dilengkapi tahapan proses, persyaratan dokumen, serta simulasi kebutuhan.
- **Program Pemberdayaan** — Ringkasan program KUR, UMi, dan LPDB beserta plafon, manfaat utama, dan highlight proses. Termasuk katalog inkubasi dan bimbingan teknis.
- **Komunitas & Pelatihan** — Menyediakan informasi forum nasional, komunitas sektoral, mentoring, dan katalog pelatihan (resmi maupun e-learning mandiri) dengan CTA pendaftaran.
- **Profil UMKM** — Formulir data pemilik dan usaha yang memuat seluruh field prioritas KemenKopUKM (NIK, NPWP, KBLI, skala usaha, modal, hingga unggah dokumen).

## Detail Flow Per Fitur

### A. Layanan Publik & Perizinan
- **Pengajuan/Pembaruan NIB** — Form data pemilik/usaha, unggah dokumen, validasi otomatis, pengingat masa berlaku.
- **Registrasi Merek** — Pemilihan kelas KBLI, unggah bukti penggunaan, integrasi pembayaran PNBP, pelacakan status.
- **Pengajuan Sertifikasi** — Checklist persyaratan (Halal, SNI, dll), penjadwalan audit, monitoring masa berlaku sertifikat.

### B. Program Pemberdayaan Pemerintah
- **KUR** — Simulasi kelayakan, dokumen personalisasi, integrasi status bank penyalur.
- **UMi** — Pemetaan lembaga penyalur, pengingat angsuran, histori pembinaan.
- **LPDB** — Studi kelayakan digital, pemantauan pencairan, unggah laporan monitoring.
- **Inkubasi/Bimtek** — Kelas intensif, mentor, demo day, serta workshop sektoral.

### C. Pelaporan & Data Usaha
- Form laporan kegiatan dan perkembangan usaha (belum diimplementasikan, dialokasikan di backlog).
- Template laporan, riwayat feedback petugas, dan analitik performa sederhana (direncanakan).

### D. Komunitas & Jaringan
- **Forum Nasional** — Kanal resmi pemerintah, thread topik, voting keluhan prioritas.
- **Komunitas Sektoral** — Ruang diskusi tematik, agenda kopdar, direktori pemasok.
- **Mentoring** — Penjadwalan sesi, target pembelajaran, sertifikat digital.

### E. Peningkatan Kompetensi
- **Pelatihan KemenKopUKM** — Kalender pelatihan, pendaftaran online, evaluasi digital.
- **Modul E-Learning** — Materi mandiri multi-format, quiz evaluasi, leaderboard komunitas.

## Alur Data Formulir Profil

| Kelompok | Field | Sifat | Keterangan |
| --- | --- | --- | --- |
| Data Pemilik | NIK | Wajib | Validasi e-KTP (Dukcapil).
|  | Nama Lengkap | Wajib | Sesuai KTP.
|  | NPWP | Wajib | Sync DJP.
|  | Alamat Pemilik | Wajib | Alamat domisili.
| Data Usaha | Nama Usaha | Wajib | Nama brand/toko.
|  | Alamat Usaha | Wajib | Lokasi operasional.
|  | Kode KBLI | Wajib | Tersedia pencarian otomatis.
|  | Sektor Usaha | Wajib | Dropdown kategori.
|  | Skala Usaha | Wajib | Mikro/Kecil.
|  | Estimasi Modal | Wajib | Nominal investasi.
| Dokumen | Foto E-KTP | Wajib | Unggah gambar.
|  | SKD | Opsional | Wajib di beberapa daerah.

## Struktur Navigasi

- `app/_layout.tsx` — Root stack (tabs + modal placeholder).
- `app/(tabs)/_layout.tsx` — Bottom tab dengan 5 layar utama.
- Layar:
  - `index.tsx` — Dashboard.
  - `perizinan.tsx` — Layanan legalitas.
  - `explore.tsx` — Program pemberdayaan.
  - `community.tsx` — Komunitas & pelatihan.
  - `profile.tsx` — Form profil UMKM.

Komponen utilitas (themed view/text, icon, collapsible) disiapkan untuk menjaga konsistensi gaya terang/gelap.

## Instruksi Pengembangan

1. **Install dependency**
   ```bash
   npm install
   ```
2. **Menjalankan aplikasi**
   ```bash
   npx expo start
   ```
3. **Struktur styling** — Menggunakan `StyleSheet` React Native, tema warna dan teks mengikuti `constants/theme.ts`.
4. **State management** — Saat ini berbasis React hook lokal. Integrasi ke backend dapat menggunakan React Query/Redux Toolkit sesuai kebutuhan.
5. **Integrasi API** — Titik integrasi utama:
   - Perizinan: OSS RBA, DJKI, BPJPH/SNI.
   - Program: API penyalur KUR/UMi/LPDB.
   - Profil: Layanan data Dukcapil, DJP, dan KBLI (OSS).
6. **Penyimpanan dokumen** — Sementara disimulasikan. Implementasi nyata perlu modul unggah (mis. `expo-document-picker`) dan penyimpanan aman (Object Storage pemerintah).

## Roadmap Teknis

- [ ] Integrasi autentikasi SSO KemenKopUKM (OAuth2/OpenID Connect).
- [ ] Implementasi data persistence (REST/GraphQL) dan caching offline.
- [ ] Form reporting berkala dengan template dinamis.
- [ ] Push notification untuk tenggat perizinan/pelatihan.
- [ ] Mode akses petugas pemerintah untuk verifikasi data.

Dengan fondasi ini, developer dapat fokus pada integrasi layanan backend, penambahan state management global, dan penyempurnaan UI/UX sesuai standar pemerintah.
