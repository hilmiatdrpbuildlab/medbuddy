# VitalsBrief (codename) — Investor Demo

Demo mobile app (iOS + Android) untuk investor pitch: import laporan lab → Lab Organizer & grafik tren → data wearable → GP Brief 1 halaman + QR.

> Nama sementara. "MedBuddy" tidak dipakai karena kemungkinan bentrok merek. Nama, warna, dan URL ada di satu file: [mobile/src/config/brand.ts](mobile/src/config/brand.ts).

## Dokumen

- [Rencana pengembangan demo](docs/DEMO_PLAN.md)
- [Konteks produk (PRODUCT.md)](PRODUCT.md)

## Menjalankan

```bash
cd mobile
npm install
npx expo start            # scan QR dengan Expo Go, atau tekan w untuk web
npm run typecheck         # TypeScript
npx expo lint             # ESLint
```

Semua library native yang dipakai (kamera, print, sharing, haptics, SVG, Reanimated) sudah termasuk di **Expo Go**, jadi tidak perlu development build untuk uji coba.

## Uji di iPhone tanpa akun Apple Developer (Expo Go)

Organisasi belum punya Apple Developer Program, jadi build iOS (TestFlight maupun ad hoc) belum bisa dibuat. Untuk uji coba di iPhone, pakai Expo Go:

1. Pasang **Expo Go** dari App Store di iPhone.
2. Di laptop: `cd mobile` lalu `npx expo start`. Jika iPhone dan laptop tidak di Wi-Fi yang sama, atau jaringan kantor memblokir koneksi antar-perangkat, pakai `npx expo start --tunnel`.
3. Scan QR di terminal dengan aplikasi Kamera iPhone, lalu aplikasi terbuka di Expo Go.

Catatan:
- Nama, ikon, dan splash yang tampil milik Expo Go, bukan VitalsBrief. Laptop harus tetap menyala selama uji coba.
- Expo Go di App Store hanya mendukung SDK Expo terbaru. Proyek ini memakai SDK 58. Jika Expo Go sudah pindah ke SDK berikutnya, jalankan `npx expo install expo@latest --fix` dulu.
- Saat pitch, lebih aman pakai APK Android atau versi web, karena demo di Expo Go bergantung pada laptop dan koneksi.

## Build untuk pitch

| Target | Perintah | Catatan |
| --- | --- | --- |
| Android APK | `npm run build:apk` | Profil `pitch` di `eas.json`, file APK langsung dipasang di HP demo |
| iOS TestFlight | `npm run build:ios` | Belum bisa: butuh akun Apple Developer berbayar. Sementara pakai Expo Go (lihat atas) |
| Web cadangan + halaman QR | `npm run deploy:web` | `expo export` lalu `wrangler pages deploy` ke project `vitalsbrief-demo` |

Halaman QR GP Brief adalah route `/b/<token>` di build web yang sama. Isi brief dibawa di **URL fragment (`#…`)**, jadi tidak pernah dikirim ke server. Setelah deploy, pastikan `briefBaseUrl` di `brand.ts` sesuai domain Cloudflare Pages.

## Saat pitch

- **Demo controls:** Settings → tekan lama logo di bawah. Isi: kecepatan proses (normal / cepat untuk latihan), picu email lab masuk (banner muncul 3 detik kemudian), mode offline, reset demo.
- **Reset sebelum pitch:** kembali ke kondisi awal (onboarding, 2 laporan lama, wearable belum tersambung). Laporan ke-3 di-import live saat demo.
- **Upload PDF:** file apa pun yang dipilih akan dipetakan ke laporan contoh "Labo Noord, 20 Nov 2026".
- **Versi web untuk latihan / screenshot:** `?seed=start` (lewati onboarding), `?seed=full` (semua data siap), opsional `&lang=nl|fr` dan `&theme=dark`.

## Isi demo

- Persona & data **sintetis** (Sophie Janssens, lab fiktif). Semua angka dan teks penjelasan tes wajib dicek advisor klinis sebelum pitch.
- Terjemahan NL/FR adalah draf AI — perlu dicek penutur asli.
- OCR/AI, HealthKit, dan Garmin disimulasikan; sampaikan di pitch bahwa ini *product demo dengan data contoh*.

## Struktur

```
mobile/
  src/app/          route Expo Router (tabs: Home, Labs, Trends, Brief + alur modal)
  src/components/   design system kecil (RangeBar, grafik, BriefSheet A4, LabDocument)
  src/data/         data sintetis (LOINC + UCUM), wearable 180 hari
  src/i18n/         en / nl / fr
  src/lib/          format lokal, simulasi proses bertahap, generator PDF/HTML brief
  src/store/        Zustand + AsyncStorage
```
