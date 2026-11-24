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
npx expo start            # scan QR dengan development build, atau tekan w untuk web
npm run typecheck         # TypeScript
npx expo lint             # ESLint
```

Library native yang dipakai (kamera, print, haptics) butuh **development build**, bukan Expo Go:
`npx eas-cli@latest build --profile development`.

## Build untuk pitch

| Target | Perintah | Catatan |
| --- | --- | --- |
| Android APK | `npm run build:apk` | Profil `pitch` di `eas.json`, file APK langsung dipasang di HP demo |
| iOS TestFlight | `npm run build:ios` | Butuh akun Apple Developer perusahaan |
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
