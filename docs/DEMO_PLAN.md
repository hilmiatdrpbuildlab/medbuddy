# Rencana Demo Mobile App – Investor Pitch (codename: VitalsBrief)

Nov 23, 2026 · @Hilmi

> Sumber: [dokumen rencana di Claude](https://claude.ai/artifact/1Chu6SpUGMBSkz8wYY4Tnk)

## Ringkasan

Kita membangun demo mobile app iOS + Android dalam **10 hari kerja** yang memperlihatkan satu alur utuh Fase 1: **import laporan lab → nilai tersusun & grafik tren → data wearable → GP Brief 1 halaman siap diberikan ke dokter**. Semua proses (upload, "Analyzing…", sinkron wearable, pembuatan PDF) terasa nyata, tetapi berjalan di atas data dummy yang sudah disiapkan sehingga demo tidak bisa gagal di depan investor.

- **Tujuan:** investor paham masalah dan solusinya dalam ±3 menit, lalu melihat produk yang terlihat siap rilis dan aman secara regulasi (sesuai prinsip "organizer, not interpreter" dari feasibility study).
- **Nama sementara:** *VitalsBrief* (dari usulan di brief). Nama, logo, dan warna utama disimpan di satu file config sehingga bisa diganti dalam hitungan menit setelah cek merek (EUIPO/BOIP).
- **Bahasa:** Inggris default; Belanda dan Prancis bisa dipilih dari onboarding maupun Settings.
- **Backend:** tidak wajib. Aplikasi berjalan offline. Cloudflare (wrangler) hanya dipakai untuk halaman web GP Brief lewat QR code dan versi web cadangan; Neon tidak diperlukan.

## Scope

Demo hanya menampilkan Fase 1 secara utuh; Fase 2 muncul sebagai teaser, dan fitur yang berisiko regulasi tidak ditampilkan sama sekali.

| Fitur | Di demo | Cara dibuat |
| --- | --- | --- |
| Import lab (upload PDF, foto, forwarding inbox) | Ya, lengkap | Pilihan sumber nyata (document picker & kamera), hasil ekstraksi diambil dari data dummy yang cocok |
| Proses "Analyzing" ekstraksi | Ya | Animasi bertahap dengan durasi realistis (lihat Alur layar) |
| Review & konfirmasi nilai vs dokumen asli | Ya | Gambar laporan lab dummy + highlight baris yang sedang dicek |
| Lab Organizer + grafik tren per tes | Ya | Data 3 laporan selama 2 tahun |
| Penjelasan tetap per tes ("Reviewed by GP") | Ya | Teks statis NL/FR/EN, tidak dipersonalisasi |
| Wearable Trends (Apple Health, Garmin) | Ya | Layar izin & sinkron disimulasikan, data 180 hari dummy |
| GP Brief PDF + QR code | Ya, lengkap | PDF dibuat sungguhan di perangkat; QR membuka halaman web read-only |
| Travel Med-Passport, Family Health Tree | Teaser | Kartu "Coming soon" di Home, 1 layar preview statis |
| Akun, login, sinkron cloud | Tidak | Login disimulasikan ("Continue with Apple") |
| OCR / AI sungguhan, HealthKit sungguhan | Tidak | Ditunda ke MVP setelah pendanaan |
| Interaction checker, crowdfunding, skor risiko | Tidak | Bertentangan dengan strategi "outside MDR" |

Kenapa disimulasikan: demo investor harus 100% andal tanpa internet, dan OCR/AI asli butuh 200–300 laporan uji sebelum akurat. Saat pitch, sampaikan dengan jujur bahwa ini *product demo dengan data contoh*.

## Skenario & data demo

Seluruh demo mengikuti satu persona fiktif yang ceritanya mudah diingat investor: perempuan aktif yang lelah terus-menerus dan punya hasil lab tersebar di tiga tempat.

- **Persona:** Sophie Janssens, 34 tahun, Gent. Pakai Apple Watch dan kadang Garmin untuk lari. Keluhan: sering lelah, janji dengan huisarts minggu depan.
- **Laporan lab:** 3 PDF sintetis (2024, 2025, dan "hari ini") dari lab fiktif (mis. *Labo Noord*, *Centrum Klinische Biologie*), dibuat dengan layout mirip laporan Belgia (header lab, tabel tes, satuan, rentang referensi, flag H/L). Jangan pakai nama atau logo lab asli.
- **Tes yang ditampilkan (±12):** hemoglobin, ferritin, vitamin D, TSH, glukosa puasa, HbA1c, kolesterol total, LDL, HDL, kreatinin, CRP, vitamin B12. Ceritanya: ferritin turun bertahap dan vitamin D di bawah rentang lab, yang lain dalam rentang.
- **Wearable:** 180 hari data harian (resting heart rate, HRV, durasi tidur, VO2 max) dari Apple Health dan Garmin secara terpisah, dengan tren halus yang konsisten dengan cerita (tidur sedikit menurun dalam 90 hari terakhir).
- **Pertanyaan Sophie untuk dokter:** 3 pertanyaan contoh yang sudah terisi, bisa diedit saat demo.

Semua angka dan teks penjelasan dicek oleh advisor klinis (GP atau clinical biologist) sebelum dipakai pitch. Data disimpan sebagai file JSON di dalam aplikasi dengan format LOINC + UCUM, sama seperti rencana produk aslinya.

## Alur layar

Aplikasi punya 4 tab (Home, Labs, Trends, Brief) dan satu alur utama yang bisa didemokan dari awal sampai akhir dalam 3 menit.

1. **Onboarding:** splash → 3 slide nilai produk → pilih bahasa (EN/NL/FR) → layar persetujuan GDPR Art. 9 per tujuan (toggle terpisah: simpan data lab, data wearable, pemrosesan AI) → "Continue with Apple" (simulasi).
2. **Home:** sapaan, kartu "Next GP visit", ringkasan 3 hasil terbaru, tombol besar *Add lab report*, kartu teaser Travel Passport & Family Tree.
3. **Add lab report:** bottom sheet dengan 4 sumber: *Upload PDF*, *Take a photo*, *Share from MijnGezondheid/Helena* (layar penjelasan cara share), *Your forwarding address* (sophie@in.vitalsbrief.be, tombol copy).
4. **Analyzing:** layar proses bertahap (tabel di bawah).
5. **Review & confirm:** daftar nilai hasil ekstraksi di atas, pratinjau dokumen asli di bawah; tap satu nilai menyorot barisnya di dokumen. Tombol *Confirm 12 values*.
6. **Labs (Lab Organizer):** daftar per kategori (Blood, Iron, Vitamins, Thyroid, Lipids, Kidney). Tiap baris: nama tes, nilai + satuan, bar rentang referensi lab, flag dari lab ("Below lab range"), tanggal.
7. **Detail tes:** grafik tren 2 tahun dengan pita rentang lab, daftar hasil sebelumnya + sumber lab, penjelasan tetap "What is ferritin?" dengan badge *Reviewed by a GP*, tombol *Add to doctor questions*.
8. **Trends (wearable):** connect Apple Health / Garmin (sheet izin simulasi) → sinkron → kartu per metrik dengan angka 90 hari vs baseline, dipisah per sumber, tanpa label "abnormal".
9. **Brief:** pilih hasil lab (otomatis: yang terbaru + yang di luar rentang lab), tren wearable 90 hari, 3 pertanyaan → *Generate brief* → pratinjau PDF 1 halaman → *Share PDF*, *Print*, atau *Show QR to doctor* (link read-only, berlaku 7 hari).
10. **Settings:** bahasa, privasi (hapus PDF asli setelah ekstraksi, export/hapus semua data), info "AI-generated content" (EU AI Act), dan menu tersembunyi **Demo controls**.

### Proses yang dibuat terasa nyata

| Proses | Tahapan yang terlihat | Durasi total |
| --- | --- | --- |
| Upload & ekstraksi lab | Uploading (progress bar) → Reading document → Finding test results → Standardizing units → Verifying against source → "12 values found" | ±7 dtk |
| Foto laporan kertas | Kamera dengan bingkai deteksi tepi → auto-crop → "Enhancing image" → lanjut ke ekstraksi | ±4 dtk + ekstraksi |
| Email forwarding | Notifikasi push "New lab report received from Labo Noord" → masuk langsung ke Review | dipicu dari Demo controls |
| Connect Apple Health / Garmin | Sheet izin mirip sistem → Connecting → Importing 180 days (counter hari naik) → "Your baseline is building" | ±5 dtk |
| Generate GP Brief | Collecting results → Summarizing trends → Laying out page → PDF muncul | ±4 dtk |

Detail agar terasa nyata: durasi tiap tahap diacak ±20%, centang hijau muncul per tahap dengan haptic ringan, ada tombol *Cancel*, dan skeleton loader saat membuka daftar. **Demo controls** (tekan lama logo di Settings) berisi: kecepatan proses (normal / cepat untuk latihan), reset ke kondisi awal, picu email masuk, dan mode offline.

## Prinsip desain UI/UX

Tampilan harus terasa tenang, bersih, dan bisa dipercaya seperti aplikasi bank atau rumah sakit modern, bukan seperti aplikasi fitness yang ramai.

**Visual**

- **Warna:** satu warna utama teal/biru tua (kepercayaan, klinis), latar putih dan abu-abu sangat muda, satu warna aksen hangat untuk tombol utama. Merah tidak dipakai untuk status; nilai di luar rentang lab memakai amber + teks "Below lab range" (tidak mengandalkan warna saja). Dukungan dark mode.
- **Tipografi:** satu font sans-serif yang sangat terbaca (Inter atau SF/Roboto bawaan), ukuran body minimal 16 pt, angka hasil lab memakai *tabular figures* agar sejajar. Mendukung Dynamic Type.
- **Komponen:** kartu dengan sudut membulat, banyak ruang kosong, ikon garis sederhana (Lucide), ilustrasi minimal di onboarding dan empty state.
- **Grafik:** bersih, satu garis per metrik, pita abu-abu untuk rentang lab, titik bisa disentuh untuk melihat nilai dan sumber.

**Pengalaman pengguna**

- **Satu aksi utama per layar** dengan tombol besar di bawah (mudah dijangkau jempol); target sentuh minimal 44×44 pt.
- **Progressive disclosure:** ringkasan dulu, detail saat di-tap.
- **Feedback selalu terlihat:** progress, centang, haptic, toast "Saved"; tidak ada layar kosong tanpa penjelasan.
- **Kontrol & kepercayaan:** pengguna selalu mengonfirmasi hasil ekstraksi, bisa mengedit nilai, dan melihat sumber tiap angka. Badge kecil "Stored in the EU · Encrypted" di layar data.
- **Aksesibilitas:** kontras WCAG 2.2 AA, label VoiceOver/TalkBack untuk grafik, mendukung reduce motion.
- **Animasi:** halus dan singkat (200–300 ms), transisi antar layar native.

**Bahasa (microcopy) yang aman untuk MDR**

| Hindari | Pakai |
| --- | --- |
| Abnormal, risk, detect, diagnose | Below / above the lab's range |
| "Your ferritin is low, which explains your fatigue" | "Ferritin is a protein that stores iron." (penjelasan umum, sama untuk semua) |
| AI analyzes your results | We organize your results |
| Alert: unusual heart rate | Resting heart rate: 58 bpm (90-day avg) vs 55 bpm baseline |
| End-to-end encrypted | Encrypted in transit and at rest, processed in the EU |

Sebelum mulai coding, buat design system kecil di Figma (warna, tipografi, 10 komponen inti) dan mockup 6 layar utama, lalu minta feedback boss dalam 1 hari.

## Bahasa

Bahasa Inggris menjadi default, dan seluruh aplikasi (termasuk PDF GP Brief dan penjelasan tes) bisa diganti ke Belanda atau Prancis tanpa restart.

- **Library:** i18next + expo-localization. Semua teks di `en.json`, `nl.json`, `fr.json`; tidak ada teks tertulis langsung di kode.
- **Pemilih bahasa:** di onboarding dan Settings, dengan nama asli bahasa (English, Nederlands, Français).
- **Format lokal:** angka desimal pakai koma di NL/FR ("18,0 ng/mL"), tanggal "23 nov. 2026", jam 24 jam.
- **Panjang teks:** teks Belanda/Prancis biasanya 20–30% lebih panjang; semua layar dites di tiga bahasa agar tidak terpotong.
- **Kualitas terjemahan:** draf dibuat dengan AI, lalu dicek oleh penutur asli (Dries/Roan untuk NL, satu orang untuk FR). Istilah medis dicek advisor klinis.
- **Tips pitch:** ganti bahasa ke Nederlands di tengah demo; ini cepat meyakinkan investor Belgia bahwa produk memang dibuat untuk pasar mereka.

## Tech stack & deploy

Pakai **React Native + Expo (TypeScript)**: satu codebase untuk iOS dan Android, paling cepat untuk demo, dan sesuai stack yang direkomendasikan di feasibility study sehingga sebagian kode (UI, design system, i18n) bisa dipakai ulang untuk MVP.

| Bagian | Pilihan |
| --- | --- |
| Navigasi | Expo Router (tab + stack + bottom sheet) |
| Styling & komponen | NativeWind (Tailwind) + komponen sendiri sesuai design system |
| Animasi & haptic | react-native-reanimated, expo-haptics |
| Grafik | react-native-svg + Victory Native (atau grafik SVG sendiri) |
| State & data | Zustand + AsyncStorage; data dummy dari file JSON lokal |
| Upload & kamera | expo-document-picker, expo-camera (dipakai sungguhan, hasil dipetakan ke data dummy) |
| PDF GP Brief | expo-print (HTML → PDF sungguhan) + expo-sharing |
| QR code | react-native-qrcode-svg |
| Bahasa | i18next + expo-localization |

**Distribusi untuk pitch**

- **Android:** EAS Build → file APK, langsung dipasang di HP demo.
- **iOS:** EAS Build → TestFlight. Butuh akun Apple Developer (USD 99/tahun), sebaiknya atas nama perusahaan.
- **Cadangan:** versi web dari Expo (`npx expo export --platform web`) yang ditampilkan dalam bingkai iPhone, untuk dipakai kalau HP bermasalah atau untuk dikirim ke investor setelah pitch.

**Peran Cloudflare (wrangler)** — berguna, tapi kecil:

- Deploy halaman web read-only GP Brief yang dibuka dari QR code (`npx wrangler pages deploy`), supaya alur "tunjukkan QR ke dokter" bisa dicoba langsung oleh investor dengan HP mereka sendiri.
- Deploy versi web cadangan di subdomain yang sama.

**Neon tidak diperlukan.** Demo tidak menyimpan data di server. Neon baru relevan nanti untuk menampung waitlist dari landing page validasi atau untuk backend MVP.

## Timeline

Demo siap dipakai pitch dalam 10 hari kerja oleh 1 developer, dengan dua titik cek bersama boss supaya tidak ada kejutan di akhir.

| Hari | Fase | Pekerjaan | Gate |
| --- | --- | --- | --- |
| H1–H2 | Fondasi | Design system + mockup 6 layar di Figma; setup Expo, data dummy Sophie, 3 PDF lab sintetis | Boss menyetujui mockup |
| H3–H5 | Alur inti | Onboarding, Home, Add report, Analyzing; Review & confirm, Labs, detail tes + grafik | Alur inti bisa didemokan |
| H6–H7 | Wearable + GP Brief | Connect & sync Apple Health/Garmin, Trends; generate PDF, QR, halaman web di Cloudflare | – |
| H8 | Bahasa & review | Terjemahan NL/FR + review penutur asli; cek angka & microcopy oleh advisor klinis | – |
| H9–H10 | Polish & rilis | Animasi, aksesibilitas, Demo controls; build APK + TestFlight, web cadangan, latihan | **Siap pitch** |

Kalau pitch lebih cepat dari 10 hari, potong urutan ini: teaser Fase 2 → foto kamera → email forwarding → Garmin (sisakan Apple Health). Alur upload → Labs → GP Brief tidak boleh dipotong.

## Skrip demo untuk pitching (±3 menit)

Demo dibawakan sebagai cerita Sophie, dengan HP di-mirror ke layar besar, dan setiap langkah menjawab satu pertanyaan investor.

1. **0:00 – Masalah (20 dtk):** "Sophie lelah terus. Hasil labnya tersebar di tiga lab, penuh istilah Latin. Apple Watch-nya punya data 6 bulan yang tidak pernah dilihat dokternya."
2. **0:20 – Import (40 dtk):** Add lab report → Upload PDF → layar *Analyzing* → Review & confirm. Tekankan: "Setiap angka dicek terhadap dokumen asli, dan pengguna yang mengonfirmasi."
3. **1:00 – Organizer (40 dtk):** buka Labs → Ferritin → grafik 2 tahun yang turun pelan. "Pertama kali Sophie melihat semua hasilnya dalam satu garis waktu." Ganti bahasa ke Nederlands.
4. **1:40 – Wearable (30 dtk):** Connect Apple Health → import 180 hari → tidur turun dalam 90 hari terakhir, ditampilkan sebagai angka netral.
5. **2:10 – GP Brief (40 dtk):** Generate brief → PDF 1 halaman → Show QR. Ajak satu investor scan QR dengan HP-nya sendiri.
6. **2:50 – Penutup (10 dtk):** "Organizer, bukan diagnosis: kami tetap di luar MDR, jadi bisa rilis dalam 6 bulan." Tunjukkan kartu teaser Travel & Family sebagai roadmap.

Latih minimal 5 kali dengan mode cepat mati, dan selalu reset lewat Demo controls sebelum pitch.

## Kebutuhan dari boss, risiko & checklist

**Yang dibutuhkan dari boss (sebelum hari 1)**

- [ ] Tanggal pitch pertama (menentukan apakah 10 hari ini cukup atau perlu dipadatkan)
- [ ] Persetujuan nama sementara *VitalsBrief* atau nama lain
- [ ] Akun Apple Developer perusahaan (untuk TestFlight) dan HP yang akan dipakai saat pitch
- [ ] Kontak advisor klinis untuk cek angka dan penjelasan tes (±2 jam kerja)
- [ ] Penutur asli NL dan FR untuk cek terjemahan (±1 jam masing-masing)
- [ ] Pesan utama pitch dan siapa investornya (angel, VC kesehatan, imec.istart)

**Risiko & mitigasi**

| Risiko | Mitigasi |
| --- | --- |
| Investor mengira AI-nya sudah jadi | Sebutkan jelas bahwa ini demo dengan data contoh; jelaskan rencana ekstraksi + verifikasi di slide |
| Demo macet saat pitch | Aplikasi full offline, Demo controls untuk reset, versi web cadangan, HP kedua |
| Kata-kata yang terdengar seperti diagnosis | Review microcopy dengan tabel "Hindari / Pakai" sebelum build final |
| Nama bentrok dengan merek lain | Nama di satu file config; jangan cetak materi sebelum cek EUIPO/BOIP |
| Terjemahan NL/FR kaku | Review penutur asli di hari 8 |

**Checklist siap pitch**

- [ ] Alur utama berjalan mulus di iPhone dan Android, 3 bahasa
- [ ] Tidak ada teks terpotong atau kata yang dilarang (abnormal, risk, diagnose)
- [ ] QR GP Brief bisa dibuka dari HP lain
- [ ] Mode pesawat: demo tetap jalan (kecuali halaman QR)
- [ ] Versi web cadangan online
- [ ] Skrip dilatih 5 kali, waktu ≤ 3 menit
- [ ] Video rekaman demo 60 detik sebagai cadangan terakhir
