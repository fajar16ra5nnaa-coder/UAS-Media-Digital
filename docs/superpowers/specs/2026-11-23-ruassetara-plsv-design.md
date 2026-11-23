# Dokumen Desain — RuasSetara (PLSV SMP Kelas VII)

**Judul Formal Final Project TDPM 2026:**
> **RuasSetara: Pengembangan Website Pembelajaran Interaktif untuk Mengatasi Miskonsepsi Persamaan Linear Satu Variabel Melalui Eksplorasi Visual-Simbolik dan Scaffolding Bertingkat pada Jenjang SMP Kelas VII**

**Tanggal:** 23 November 2026  
**Mata Kuliah:** Teknologi Digital Pembelajaran Matematika (TDPM) — Magister (S2) Pendidikan Matematika, Pascasarjana UNY  
**Dosen Pengampu:** Dr. Nur Hadi Waryanto, S.Si., M.Eng., MCF.  
**Status:** Menunggu Persetujuan Pemilik Proyek *(Hard Gate `brainstorming`)*

---

## 1. Maksud & Latar Belakang (*Intent & Why*)

Siswa SMP Kelas VII (Fase D) sering mengalami miskonsepsi mendasar pada materi **Persamaan Linear Satu Variabel (PLSV)**, terutama:
1. Memaknai tanda sama dengan (`=`) secara **operasional** ("hitung jawabannya"), bukan **relasional** ("kedua ruas bernilai setara") (Otten, Van den Heuvel-Panhuizen, & Veldhuis, 2019; Knuth et al., 2006).
2. Mengandalkan aturan mekanistik **"pindah ruas ganti tanda"** (*change sides, change signs*) tanpa memahami sifat kesetaraan kedua ruas, sehingga mudah keliru saat menghadapi koefisien negatif, variabel di kedua ruas, atau sifat distributif (Lima & Tall, 2008).
3. Mengalami tiga kategori miskonsepsi empiris pada siswa SMP Indonesia: **klasifikasional** (membedakan bentuk PLSV & persamaan ekuivalen), **korelasional** (memodelkan soal cerita & menerapkan operasi yang sama pada kedua ruas), dan **teoritikal** (definisi PLSV, sifat distributif, penyederhanaan aljabar) (Sarla, Asyril, Basir, & Ikmawati, 2025).

Di sisi lain, media pembelajaran berbasis Google Sites pada umumnya masih bergantung pada *embed* pihak ketiga yang rawan bermasalah (seperti Liveworksheets yang gagal diakses), Google Form yang tidak memberi umpan balik diagnostik langsung, kuis yang kurang memotivasi, minim *scaffolding*, dan tidak memiliki ruang diskusi kelas terintegrasi.

**RuasSetara** dibangun sebagai aplikasi web mandiri (*custom web application*) yang memadukan **Interactive Math Sandbox** (timbangan aljabar digital + ubin pasangan nol) dengan **LKPD interaktif native**, **scaffolding bertingkat adaptif**, **evaluasi diagnostik instan**, **kuis ber-leaderboard inklusif**, dan **ruang diskusi kelas real-time (Guru & Siswa)** dalam satu ekosistem pembelajaran utuh.

---

## 2. Tujuan, Bukan-Tujuan, dan Anti-Tujuan

### Tujuan (*Goals*)
- Menyediakan lingkungan belajar komputasional interaktif (*interactive math sandbox*) untuk PLSV SMP Kelas VII yang menjembatani representasi visual (timbangan + ubin aljabar) ke representasi simbolik (persamaan ekuivalen dengan tanda `↔`).
- Menggantikan ketergantungan pada Liveworksheets dan Google Form dengan **LKPD Interaktif Native** dan **Evaluasi Diagnostik Instan** yang langsung menampilkan skor, jenis miskonsepsi, pembahasan langkah demi langkah, dan rekomendasi belajar.
- Menyediakan **Scaffolding Bertingkat Adaptif** (3 level: *Kontekstual/Visual → Pertanyaan Reflektif → Bantuan Terstruktur*, tanpa langsung membocorkan jawaban) yang mengikuti prinsip *contingency*, *fading*, dan *transfer of responsibility* (van de Pol, Volman, & Beishuizen, 2010; Anghileri, 2006).
- Menyediakan **Kuis + Leaderboard real-time** untuk meningkatkan motivasi belajar tanpa mengorbankan kenyamanan psikologis siswa.
- Menyediakan **Halaman Chat Khusus ala Grup WhatsApp** real-time dengan login **Guru** dan **Siswa**, lencana (*badge*) peran tegas (`GURU` vs `SISWA`), serta fitur verifikasi jawaban oleh guru.
- Mencapai level **Modification–Redefinition** pada kerangka SAMR (Hamilton, Rosenberg, & Akcaoglu, 2016) dan memenuhi seluruh komponen **Laporan Final Project TDPM 2026 + 4 Lampiran Wajib**.

### Bukan-Tujuan (*Non-Goals*)
- Tidak menggunakan API Generative AI berbayar (seperti OpenAI/Gemini API) di runtime aplikasi, agar sistem 100% gratis, stabil, deterministik secara matematis, dan tidak bergantung pada kuota kunci API saat diuji dosen.
- Tidak mencakup topik di luar PLSV (misalnya PtLSV, SPLDV, atau persamaan kuadrat hanya disinggung sebagai prasyarat/kelanjutan, bukan modul penuh).
- Tidak membangun LMS sekolah skala besar (manajemen nilai rapor, presensi sekolah, atau banyak mata pelajaran).

### Anti-Tujuan (*Anti-Goals* — Hal yang Membuat Produk Gagal)
- **Sekadar memindahkan LKS ke web (SAMR Substitution/Augmentation):** Jika siswa tidak bisa memanipulasi objek aljabar secara real-time atau hanya membaca teks statis, produk gagal memenuhi syarat TDPM S2.
- **Merusak agensi kognitif siswa:** Jika tombol *scaffolding* langsung menampilkan kunci jawaban akhir sehingga siswa menyalin tanpa berpikir, produk melanggar BAB II.4 (Etika Digital & Agensi Kognitif).
- **Kesalahan matematika / logika aljabar:** Parser, evaluator persamaan, dan animasi timbangan tidak boleh keliru menangani bilangan negatif, pecahan sederhana, atau variabel di kedua ruas.
- **Hambatan akses saat penilaian dosen:** Jika dosen kesulitan mencoba fitur karena wajib registrasi berbelit atau verifikasi email tertahan, pengalaman evaluasi terganggu.

---

## 3. Batasan & Kepatuhan (*Constraints*)

1. **Kurikulum Resmi:** Mengacu pada **Keputusan Kepala BSKAP Kemendikdasmen Nomor 046/H/KR/2025**, **Fase D (SMP/MTs Kelas VII–IX), Elemen Aljabar**: *"menyelesaikan persamaan dan pertidaksamaan linear satu variabel; menyajikan, menganalisis, dan menyelesaikan masalah dengan menggunakan relasi, fungsi dan persamaan linear"*.
2. **Basis Teoretis Utama:** **TPACK** (Mishra & Koehler, 2006; Koehler & Mishra, 2009) + **Pembelajaran Berbasis Inkuiri & HOTS (C4–C6)** (Brookhart, 2010) + **Scaffolding Bertingkat** (Anghileri, 2006; van de Pol et al., 2010) + **Model SAMR** (Hamilton et al., 2016).
3. **Infrastruktur:** Gratis & publik permanen menggunakan **Next.js (App Router + TypeScript)** + **Tailwind CSS + shadcn/ui** + **Supabase (Auth, Postgres, Realtime, RLS)** + **Vercel** (URL publik aktif untuk Lampiran 1).
4. **Responsif & Aksesibel:** Nyaman dibuka di laptop (presentasi/kelas) maupun smartphone (siswa SMP), kontras warna memenuhi standar aksesibilitas, serta seluruh antarmuka menggunakan **Bahasa Indonesia** yang ramah siswa SMP.
5. **Privasi Data Siswa (BAB II.4):** Data akun minimal (nama tampilan, email, peran, kelas opsional); Row Level Security (RLS) aktif pada seluruh tabel Supabase; siswa hanya bisa mengubah data miliknya sendiri.

---

## 4. Perbandingan Pendekatan & Keputusan Arsitektur (*Approaches*)

Tiga pendekatan dipertimbangkan dalam tahap *brainstorming*:

| Pendekatan | Ringkasan | Trade-off | Status |
|---|---|---|---|
| **Opsi A — Full-Stack Web App Mandiri (Next.js + Supabase + Vercel)** | Seluruh 6 fitur inti termasuk *Interactive Math Sandbox*, LKPD native, Scaffolding adaptif, Evaluasi diagnostik, Kuis-Leaderboard, dan Chat real-time dibangun native di Next.js dengan backend Supabase & deploy Vercel. | Memerlukan perancangan skema Postgres + RLS + Realtime, namun menghasilkan integrasi penuh (interaksi sandbox memicu scaffolding otomatis, chat & leaderboard sinkron lintas perangkat, guru memantau progres nyata). | **DIPILIH** |
| **Opsi B — Hybrid Next.js + Supabase + Embed GeoGebra/Desmos** | Portal web di Next.js + Supabase, tetapi *Sandbox* memakai *iframe* GeoGebra/Desmos eksternal. | State di dalam *iframe* eksternal tidak bisa dibaca otomatis oleh sistem scaffolding & LKPD; berisiko lambat/terblokir di jaringan tertentu. | Ditolak |
| **Opsi C — Client-Side Statis (LocalStorage, Tanpa Supabase)** | Semua fitur berjalan lokal di browser tanpa database. | Chat Guru–Siswa dan Leaderboard tidak sinkron antar-perangkat saat diuji bersama; guru tidak bisa memantau progres kelas sungguhan. | Ditolak |

**Alasan Pemilihan Opsi A:** Menjawab seluruh kebutuhan pengguna sekaligus memastikan level SAMR *Modification–Redefinition* dan keandalan demo nyata bagi dosen pengampu TDPM.

---

## 5. Spesifikasi Fungsional Rinci (7 Modul Utama)

### 5.1 Autentikasi, Peran, & Akses Demo (`/masuk` & `/daftar`)
- **Dua peran pengguna:** `guru` dan `siswa` (disimpan di tabel `profiles` yang terhubung ke `auth.users`).
- **Jalur 1 — Akun Nyata (Supabase Auth):** Pendaftaran dengan Nama Lengkap, Email, Password, Kelas (opsional untuk siswa, mis. `VII-A`), dan pilihan Peran (`Siswa` atau `Guru`; pendaftaran Guru memakai kode akses guru sederhana yang diverifikasi di sisi server agar tidak sembarang siswa memilih peran guru — *keputusan perancang*). Konfigurasi `mailer_autoconfirm` Supabase diaktifkan agar pendaftaran langsung aktif tanpa hambatan verifikasi email saat demo kelas.
- **Jalur 2 — Akses Demo 1-Klik (untuk Dosen Pengampu):**
  - Tombol **"Masuk sebagai Guru Demo"** (`guru.demo@ruassetara.id`)
  - Tombol **"Masuk sebagai Siswa Demo"** (`siswa.demo@ruassetara.id`)
  - Memanfaatkan akun Supabase Auth riil yang sudah dibuat sebelumnya (*seeded*) beserta contoh awal diskusi & skor demo sehingga seluruh fitur database, progres, leaderboard, dan chat real-time bekerja penuh tanpa halaman kosong.
- **Akses Eksplorasi Tanpa Login *(keputusan perancang)*:** Halaman Beranda dan Lab Timbangan Aljabar (mode bebas) dapat langsung dilihat/dicoba, sementara menyimpan progres LKPD, mengirim Evaluasi Diagnostik, masuk Leaderboard Kuis, dan mengirim Chat memerlukan login (1 klik demo atau akun pribadi).

### 5.2 Modul 1 — Lab Timbangan Aljabar: *Interactive Math Sandbox* (`/sandbox`)
Jantung pedagogis RuasSetara untuk mengatasi miskonsepsi tanda `=` dan "pindah ruas" (Otten et al., 2019; Lima & Tall, 2008):
- **Tampilan Dual-Representasi Tersinkronisasi:**
  1. **Panel Visual (SVG Interaktif Beranimasi):** Neraca dua lengan (Ruas Kiri & Ruas Kanan) yang **miring secara fisika** sesuai selisih nilai aktual kedua ruas (saat nilai $x$ rahasia/target aktif), dengan status indikator real-time: `=` (Seimbang — Hijau), `<` atau `>` (Tidak Seimbang — Oranye/Merah).
  2. **Ubin Aljabar & Dukungan Bilangan Negatif (*Zero-Pair Tiles*):**
     - Balok variabel positif `+x` (biru) dan negatif `-x` (merah muda/balon pengangkat).
     - Balok satuan positif `+1` (emerald) dan negatif `-1` (koral/balon pengangkat).
     - **Animasi Pasangan Nol (*Zero-Pair Cancellation*):** Saat `+1` bertemu `-1` atau `+x` bertemu `-x` di ruas yang sama, sistem menyorot pasangan nol tersebut dan meleburnya menjadi `0` — memecahkan keterbatasan klasik timbangan fisik pada pengurangan dan bilangan negatif!
  3. **Panel Simbolik & Jejak Ekuivalensi (`↔`):**
     - Menampilkan bentuk persamaan formal real-time (mis. `2x + 3 = x + 7`).
     - **Panel Operasi Kedua Ruas:** Tombol aksi eksplisit seperti `Tambah kedua ruas (+k / +x)`, `Kurangi kedua ruas (-k / -x)`, `Bagi kedua ruas (÷k)`, dan `Kali kedua ruas (×k)` — serta opsi eksperimen **Mode Eksplorasi Bebas** di mana siswa boleh mencoba menambah/mengurangi di *satu ruas saja* agar melihat langsung timbangan menjadi miring (`≠`) dan memahami *mengapa* operasi harus diterapkan pada kedua ruas!
     - **Penanganan Kasus Khusus Matematis (*Edge Cases*):**
       - Pembagian kedua ruas dengan `0` ditolak secara eksplisit disertai umpan balik konseptual (mengatasi temuan miskonsepsi membagi dengan nol pada Sarla et al., 2025).
       - Aritmetika *math engine* menggunakan bilangan rasional eksak (pecahan tereduksi) sehingga tidak pernah terjadi galat *floating-point* (mis. `0.3333333333`); bila siswa membagi sebelum menghilangkan konstanta sehingga muncul pecahan, sistem memberi petunjuk *scaffolding* lembut agar menyederhanakan konstanta terlebih dahulu.
     - **Riwayat Langkah Ekuivalensi:** Setiap langkah sah tercatat rapi ke bawah:
       ```text
       2x + 3 = x + 7
       ↔ 2x + 3 - x = x + 7 - x   (Kurangi x pada kedua ruas)
       ↔ x + 3 = 7
       ↔ x + 3 - 3 = 7 - 3        (Kurangi 3 pada kedua ruas)
       ↔ x = 4
       ```
     - **Tombol Uji Substitusi (Verifikasi Mandiri):** Siswa menguji apakah nilai $x$ yang ditemukan benar-benar menyeimbangkan persamaan awal.
- **3 Mode Sandbox:**
  1. **Eksplorasi Bebas:** Siswa/guru menyusun persamaan sendiri (`ax + b = cx + d`, bilangan bulat) untuk bereksperimen.
  2. **Misi Terpandu (10 Tantangan Bertingkat):** Dari bentuk dasar (`x + 3 = 7`), koefisien (`2x + 1 = 9`), variabel di kedua ruas (`3x + 2 = x + 8`), bilangan negatif (`2x - 4 = 6`, `-x + 5 = 2`), hingga distributif (`2(x + 3) = 14`).
  3. **Integrasi Langsung ke LKPD:** Misi tertentu tertanam langsung di halaman LKPD sehingga siswa bereksplorasi tanpa pindah tab.

### 5.3 Modul 2 — LKPD Digital Interaktif: Pengganti Liveworksheet (`/lkpd`)
Menggantikan Liveworksheets dengan 4 aktivitas inkuiri bertahap yang tersimpan otomatis ke Supabase:
- **Tahap 1 — Orientasi & Klasifikasi PLSV (Mengatasi Miskonsepsi Klasifikasional):**
  - Aktivitas *pilah kartu interaktif* (klik/pilih kategori `PLSV` vs `Bukan PLSV`) untuk 8 ekspresi (termasuk pengecoh kuadrat $x^2 + 1 = 5$, dua variabel $x + y = 7$, pertidaksamaan $2x + 1 > 5$, dan bentuk aljabar tanpa `=`).
  - Isian alasan singkat mengapa ekspresi tersebut PLSV/bukan PLSV + cek otomatis & umpan balik.
- **Tahap 2 — Eksplorasi Sifat Kesetaraan di Timbangan (Mengatasi Miskonsepsi "Pindah Ruas"):**
  - Timbangan mini terintegrasi langsung di dalam LKPD.
  - Siswa menyelesaikan 3 kasus PLSV (termasuk bilangan negatif & variabel di kedua ruas) dengan memilih operasi kedua ruas yang sah, lalu menyusun kalimat kesimpulan inkuiri (*fill-in-the-blank* terstruktur).
- **Tahap 3 — Pemodelan Masalah Kontekstual (Mengatasi Miskonsepsi Korelasional & Distributif):**
  - 2 masalah kontekstual SMP (misalnya: keliling persegi panjang dengan sisi $(2x + 3)$ cm dan $x$ cm — langsung menargetkan temuan miskonsepsi rumus keliling & sifat distributif dari Sarla et al., 2025; serta masalah harga paket alat tulis).
  - Siswa menyusun persamaan langkah demi langkah: Identifikasi variabel → Susun model persamaan → Selesaikan dengan operasi setara → Uji substitusi → Tarik kesimpulan kontekstual.
- **Tahap 4 — Tantangan HOTS (C4 Menganalisis, C5 Mengevaluasi, C6 Mencipta):**
  - **C4–C5 (Temukan Kesalahan "Sihir Pindah Ruas"):** Diberikan contoh pengerjaan fiktif siswa yang keliru (mis. $2(x - 3) = 10 \rightarrow 2x - 3 = 10$ atau $-2x = 8 \rightarrow x = 8 + 2$). Siswa mengidentifikasi baris yang salah, menjelaskan alasannya, dan memperbaikinya.
  - **C6 (Cipta Soal Kontekstual):** Siswa merancang 1 soal cerita kontekstual yang model matematikanya menghasilkan persamaan tertentu (mis. $3x + 5 = 20$), lalu dapat membagikannya ke Ruang Diskusi Kelas.

### 5.4 Modul 3 — Sistem Scaffolding Bertingkat Adaptif (Terintegrasi di Sandbox & LKPD)
Dirancang berdasarkan sintesis **Anghileri (2006)** dan **van de Pol et al. (2010)** (*Contingency, Fading, Transfer of Responsibility*) untuk menjaga **agensi kognitif siswa**:
- **Prinsip *Contingency* (Responsif terhadap Kesalahan Spesifik):**
  - Sistem mendeteksi *jenis kesalahan* siswa (mis. operasi hanya di satu ruas, tanda negatif tertukar, sifat distributif tidak dikalikan ke suku kedua, menggabungkan suku tak sejenis $2x + 3 = 5x$) lalu menampilkan petunjuk yang **spesifik terhadap kesalahan tersebut**, bukan pesan generik "Jawaban salah".
- **Tiga Tingkat Bantuan Bertahap (Terkunci Berurutan):**
  - **Level 1 — Bantuan Lingkungan & Visual (*Environmental Provision*):** Memunculkan sorotan visual pada timbangan/suku persamaan yang perlu diperhatikan (mis. menyorot konstanta `+3` di sisi variabel).
  - **Level 2 — Pertanyaan Pemandu Reflektif (*Reviewing & Restructuring*):** Mengajukan pertanyaan pemantik tanpa memberi angka jawaban (contoh: *"Di ruas kiri ada `+3` yang menemani `2x`. Operasi apa yang membuat `+3` menjadi `0`, dan apa yang harus dilakukan di ruas kanan agar timbangan tetap seimbang?"*).
  - **Level 3 — Bantuan Terstruktur (*Conceptual Bridge*):** Menampilkan contoh soal analog (angka berbeda) atau kerangka langkah rumpang untuk diisi siswa sendiri — **tidak pernah** langsung memberi jawaban final secara otomatis.
- **Prinsip *Fading* & *Transfer of Responsibility*:**
  - Di Tahap 1–2, visual timbangan + Level 1–3 aktif penuh.
  - Di Tahap 3, visual timbangan disembunyikan secara default (dapat dibuka jika butuh).
  - Di Tahap 4 (HOTS) dan Evaluasi Diagnostik, *scaffolding* ditarik (*faded*) agar siswa berlatih mandiri penuh; sistem mencatat berapa banyak level bantuan yang dipakai tiap siswa ke database agar guru mengetahui siapa yang masih bergantung pada bantuan.

### 5.5 Modul 4 — Evaluasi Diagnostik Instan: Pengganti Google Form (`/evaluasi`)
Pengganti Google Form yang jauh lebih interaktif dan bernilai pedagogis tinggi:
- **Struktur Soal:** **10 butir soal diagnostik PLSV** yang memetakan 3 kategori miskonsepsi Sarla et al. (2025) + level HOTS:
  - 3 butir *Klasifikasional* (identifikasi PLSV & persamaan ekuivalen)
  - 4 butir *Korelasional* (operasi kedua ruas, substitusi, pemodelan soal cerita & keliling bangun datar)
  - 3 butir *Teoritikal & HOTS* (sifat distributif, koefisien negatif, evaluasi kesalahan prosedur)
- **Format Interaktif:** Kombinasi Pilihan Ganda Diagnostik (setiap pengecoh/*distractor* dipetakan ke kode miskonsepsi tertentu) + Tingkat Keyakinan (*Yakin / Ragu-ragu*, mengadaptasi konsep *multi-tier diagnostic* Sarla et al., 2025) + Isian Singkat Numerik/Aljabar.
- **Hasil Instan Saat Klik "Kirim":**
  1. **Kartu Skor & Predikat Penguasaan** (0–100 + ringkasan benar/salah + waktu pengerjaan).
  2. **Peta Diagnosis Miskonsepsi Pribadi:** Menampilkan persentase penguasaan per kategori (*Klasifikasional*, *Korelasional*, *Teoritikal*) dan menandai pola miskonsepsi spesifik yang terdeteksi dari pilihan pengecoh siswa (mis. *"Terdeteksi kecenderungan lupa mengalikan suku kedua pada sifat distributif"*).
  3. **Review Lengkap Per Butir:** Menampilkan jawaban siswa, jawaban benar, **pembahasan langkah ekuivalensi (`↔`)**, dan penjelasan *mengapa* pilihan pengecoh yang dipilih keliru.
  4. **Rekomendasi Aksi Lanjutan:** Tautan langsung ke Misi Sandbox atau Tahap LKPD yang relevan untuk memperbaiki miskonsepsi tersebut, plus riwayat percobaan tersimpan di Supabase.

### 5.6 Modul 5 — Kuis Kompetitif & Leaderboard Inklusif (`/kuis`)
- **Mekanisme Kuis:**
  - 8 soal cepat PLSV (acak urutan dari bank soal 16 butir agar tidak mudah dihafal saat mengulang).
  - Timer per soal (45 detik) dengan **bonus kecepatan** + **streak multiplier** untuk jawaban benar beruntun.
  - Umpan balik kilat (*instant micro-feedback*) di setiap soal sebelum lanjut ke soal berikutnya.
- **Leaderboard Real-Time & Etis (Selaras BAB II.4):**
  - Begitu kuis selesai, skor langsung tersimpan ke tabel `quiz_attempts` di Supabase dan **Leaderboard langsung diperbarui secara real-time**.
  - **Desain Inklusif Anti-Cemas:**
    - Menampilkan **Top 10 Peringkat Tertinggi (skor terbaik per siswa — 1 baris per akun agar tidak didominasi satu orang yang mengulang)** + **Kartu Posisi Pribadi Siswa** (sehingga siswa di luar Top 10 tidak dipermalukan di daftar paling bawah).
    - Tersedia **Mode Latihan Santai (Tanpa Timer / Tanpa Masuk Leaderboard)** bagi siswa yang ingin berlatih tanpa tekanan kompetisi.

### 5.7 Modul 6 — Ruang Diskusi Kelas Real-Time: Chat ala WhatsApp (`/diskusi`)
- **Antarmuka ala Grup WhatsApp Modern:**
  - Daftar **4 Kanal Diskusi** di sisi kiri (atau tab atas di HP):
    1. `# Diskusi Umum`
    2. `# Bantuan Timbangan Sandbox`
    3. `# Diskusi LKPD`
    4. `# Tanya Evaluasi & Soal`
  - Gelembung pesan (*chat bubbles*): pesan sendiri di kanan, pesan orang lain di kiri, lengkap dengan waktu kirim dan status peran yang sangat jelas.
- **Identitas Peran Tegas (Sesuai Permintaan Utama):**
  - Pesan dari akun **Guru** menampilkan lencana mencolok **`GURU`** (warna biru/indigo tegas + ikon toga/centang) dan aksen tepi gelembung khusus agar siswa langsung mengenalinya.
  - Pesan dari akun **Siswa** menampilkan lencana **`SISWA`** (warna emerald/teal lembut + kelas bila diisi).
- **Fitur Pedagogis Tambahan (Melebihi WhatsApp Biasa):**
  - **Real-time via Supabase Realtime (`postgres_changes`):** Pesan yang dikirim dari akun Guru langsung muncul di layar Siswa (dan sebaliknya) tanpa muat ulang halaman.
  - **Sisipkan Persamaan Cepat:** Tombol sisip simbol matematika (`x`, `=`, `↔`, `×`, `÷`, `−`) agar siswa nyaman mengetik langkah PLSV di HP.
  - **Verifikasi Jawaban oleh Guru:** Guru dapat mengklik tombol **"Tandai Terverifikasi"** atau **"Sematkan (Pin)"** pada pesan diskusi yang berisi penjelasan konsep yang tepat.

### 5.8 Modul 7 — Dashboard Guru (`/guru`) *(Khusus Peran Guru)*
- Ringkasan metrik kelas: jumlah siswa aktif, rata-rata progres LKPD, rata-rata skor Evaluasi Diagnostik, dan rata-rata skor Kuis.
- **Peta Miskonsepsi Kelas:** Grafik batang distribusi 3 jenis miskonsepsi (Klasifikasional, Korelasional, Teoritikal) dari seluruh pengerjaan Evaluasi Diagnostik siswa — memudahkan guru menentukan materi yang perlu dibahas ulang di kelas.
- **Tabel Progres Siswa:** Menampilkan progres LKPD per tahap, jumlah bantuan *scaffolding* yang digunakan, skor evaluasi terbaru, dan skor kuis tertinggi per siswa.

---

## 6. Arah Desain Visual & UI/UX (*Aesthetic & Layout*)

- **Konsep Visual:** *"Ruang Laboratorium Matematika yang Hangat, Bersih, dan Fokus"* — menghindari tampilan gelap generik AI atau warna neon mencolok.
- **Palet Warna:**
  - Permukaan dasar hangat terang (`#F8FAFC` / `#FFFFFF`) dengan aksen kertas berpetak halus (*subtle math grid*) pada area Sandbox.
  - Warna primer akademik: **Biru Tinta / Deep Slate-Indigo (`#1E3A5F` / `#2563EB`)** untuk identitas utama & lencana `GURU`.
  - Warna sekunder matematis (semantik, bukan dekoratif): **Biru Variabel (`x`)**, **Hijau Emerald (`+1` & status Seimbang `=` & lencana `SISWA`)**, **Koral/Merah Lembut (`-1` & `-x` & status Tidak Seimbang `≠`)**, **Amber Hangat** untuk panel *Scaffolding*.
- **Tipografi:** Font sans-serif ramah baca untuk UI (`Plus Jakarta Sans` / `Inter`) dipadukan dengan font monospace/matematika yang tajam (`JetBrains Mono`) khusus untuk ekspresi aljabar dan jejak langkah `↔`.
- **Navigasi Sederhana (6 Item Utama):** `Beranda`, `Lab Timbangan`, `LKPD`, `Evaluasi`, `Kuis`, `Diskusi` (+ `Panel Guru` khusus akun Guru).

---

## 7. Arsitektur Teknis & Skema Database Supabase

### Stack Teknologi
- **Framework:** Next.js 15+ (App Router), React 19, TypeScript (strict mode)
- **Styling & UI:** Tailwind CSS v4 + komponen shadcn/ui + Lucide Icons
- **Backend & Realtime:** Supabase (`@supabase/supabase-js` + `@supabase/ssr`)
- **Testing:** Vitest (unit test untuk *math engine* PLSV, *zero-pair*, deteksi miskonsepsi, dan penilaian diagnostik) + Playwright / verifikasi browser langsung
- **Deployment:** Vercel (URL produksi publik permanen)

### Skema Tabel Postgres (Supabase + RLS Aktif)
1. `profiles` — `id (uuid PK ref auth.users)`, `full_name`, `role ('guru' | 'siswa')`, `class_name`, `is_demo (boolean)`, `created_at`
2. `lkpd_submissions` — `id`, `user_id (ref profiles)`, `stage_number (1..4)`, `answers (jsonb)`, `scaffolding_used (jsonb)`, `score (int)`, `is_completed (boolean)`, `updated_at` *(unique on `user_id, stage_number`)*
3. `diagnostic_attempts` — `id`, `user_id (ref profiles)`, `answers (jsonb)`, `score (int)`, `total_questions (int)`, `misconception_summary (jsonb)`, `duration_seconds (int)`, `created_at`
4. `quiz_attempts` — `id`, `user_id (ref profiles)`, `mode ('kompetitif' | 'latihan')`, `score (int)`, `correct_count (int)`, `total_questions (int)`, `max_streak (int)`, `duration_seconds (int)`, `created_at`
5. `chat_messages` — `id`, `channel ('umum' | 'sandbox' | 'lkpd' | 'evaluasi')`, `user_id (ref profiles)`, `content (text)`, `is_verified (boolean)`, `is_pinned (boolean)`, `created_at` *(Supabase Realtime diaktifkan pada tabel ini)*

### Kebijakan Keamanan (Row Level Security / RLS)
- `profiles`: semua pengguna terautentikasi dapat membaca nama & peran (untuk tampilan chat & leaderboard); pemilik hanya dapat memperbarui `full_name` dan `class_name` (bukan `role`, dijaga lewat trigger/kebijakan server agar siswa tidak dapat menaikkan perannya sendiri menjadi `guru`). Penetapan peran `guru` saat pendaftaran divalidasi di sisi server menggunakan kode akses guru.
- `lkpd_submissions` & `diagnostic_attempts`: siswa hanya membaca/menulis baris miliknya sendiri; **guru dapat membaca seluruh baris siswa** untuk Dashboard Guru.
- `quiz_attempts`: semua pengguna dapat membaca skor mode `kompetitif` (untuk leaderboard); siswa hanya menulis baris miliknya sendiri.
- `chat_messages`: semua pengguna terautentikasi dapat membaca dan mengirim pesan dengan `user_id = auth.uid()`; hanya pengguna ber-role `guru` yang dapat mengubah `is_verified` dan `is_pinned`.

---

## 8. Pemetaan Produk ke Laporan Final Project TDPM 2026

Seluruh komponen laporan dalam `Template Laporan Final Project TDPM 2026.docx` akan disusun **setelah** aplikasi selesai, diuji, dan dideploy ke Vercel agar seluruh tangkapan layar, URL publik, catatan debugging, dan skrip logika matematis berbasis fakta nyata (bukan karangan):

| Bagian Template TDPM 2026 | Konten Nyata dari RuasSetara |
|---|---|
| **Ringkasan Eksekutif** | Identitas RuasSetara, SMP Kelas VII (Fase D), URL publik Vercel & repositori GitHub. |
| **BAB I (Latar Belakang & Spesifikasi)** | Miskonsepsi PLSV berbasis bukti primer (Otten et al. 2019; Lima & Tall 2008; Sarla et al. 2025), urgensi TPACK + HOTS + Scaffolding, spesifikasi teknis 7 modul. |
| **BAB II (Landasan Teoretis & Arsitektur Pedagogis)** | 2.1 TPACK (Mishra & Koehler 2006; Koehler & Mishra 2009); 2.2 Pemetaan SAMR menuju *Modification–Redefinition* (Hamilton et al. 2016); 2.3 Inkuiri, HOTS C4–C6 (Brookhart 2010), & Scaffolding (Anghileri 2006; van de Pol et al. 2010); 2.4 Agensi kognitif, inklusivitas leaderboard, & keamanan RLS Supabase. |
| **BAB III (Metodologi & Proses Pengembangan)** | 3.1 UI/UX & Storyboard; 3.2 Konstruksi prototipe & cuplikan nyata kode *PLSV Balance Engine* + deteksi miskonsepsi; 3.3/3.4 Catatan nyata *testing* (Vitest + uji browser) & *debugging*. |
| **BAB IV (Lesson Design & Scaffolding)** | 4.1 CP resmi SK Ka BSKAP 046/H/KR/2025 Fase D + indikator HOTS; 4.2 Skenario *Unplugged* (timbangan/kartu benda konkret di kelas) & *Plugged* (RuasSetara); 4.3 Panduan pertanyaan scaffolding guru & fasilitasi debugging. |
| **BAB V (Penutup)** | Kesimpulan pengembangan, keterbatasan jujur (mis. fokus bilangan bulat/pecahan sederhana, belum ada uji lapangan skala luas), & rencana diseminasi. |
| **Daftar Pustaka (APA 7th)** | Seluruh referensi primer terverifikasi (BSKAP 2025, Anghileri 2006, Brookhart 2010, Hamilton et al. 2016, Knuth et al. 2006, Koehler & Mishra 2009, Lima & Tall 2008, Mishra & Koehler 2006, Otten et al. 2019, Sarla et al. 2025, van de Pol et al. 2010). |
| **Lampiran 1–4** | (1) Link Vercel publik + GitHub + panduan/naskah rekam video demo 3–5 menit; (2) Modul Ajar Kurikulum Merdeka lengkap + LKPD; (3) Screenshots UI/UX resolusi tinggi (diambil otomatis dari aplikasi live) & Storyboard; (4) User Manual Guru & Siswa. |

---

## 9. Daftar Keputusan Perancang (*Builder Calls*) & Hal yang Diserahkan ke Tahap Implementasi

### Keputusan yang Saya Tetapkan di Dokumen Ini (Mohon Dikoreksi Bila Kurang Sesuai)
1. **Kode Akses Pendaftaran Guru & Perlindungan Peran:** Pendaftaran akun baru ber-role `Guru` memakai kode kelas sederhana (`GURU-TDPM2026`, tertera di panduan guru) yang divalidasi di server, serta `role` dikunci agar tidak bisa diubah sendiri oleh siswa. Akun **Guru Demo 1-Klik** langsung masuk tanpa kode.
2. **Konfirmasi Email Otomatis (`mailer_autoconfirm`):** Diaktifkan pada Supabase Auth agar pengguna baru saat demo kelas/pengujian dosen bisa langsung masuk tanpa menunggu email verifikasi.
3. **Akses Tamu Terbatas:** Pengunjung yang belum login tetap bisa membuka Beranda dan mencoba Lab Timbangan mode bebas; fitur penyimpanan progres (LKPD, Evaluasi, Kuis Leaderboard, dan Chat) mengarahkan ke login (tersedia tombol 1-klik Demo).
4. **Aritmetika Eksak & Penolakan Pembagian Nol di Sandbox:** *Math engine* memakai aritmetika pecahan eksak (menghindari galat *floating-point*) dan menolak pembagian dengan `0` disertai umpan balik konseptual.
5. **Format Soal Evaluasi Diagnostik:** 10 butir (terbagi merata ke 3 kategori miskonsepsi Sarla et al. 2025) dilengkapi tombol tingkat keyakinan (*Yakin / Ragu-ragu*) agar lebih kuat secara metodologis dibanding pilihan ganda biasa.
6. **Leaderboard Skor Terbaik Per Siswa:** Top 10 menampilkan 1 skor terbaik per akun agar papan peringkat adil dan tidak dipenuhi satu akun yang mengulang kuis berkali-kali.
7. **Penomoran Sub-bab BAB III Laporan:** Pada template asli `.docx`, BAB III melompat dari `3.2` ke `3.4` (tanpa `3.3`). Untuk laporan akhir nanti, penomoran akan kita rapikan atau samakan sesuai konfirmasi Anda saat penyusunan laporan.

### Diserahkan ke Tahap Perencanaan & Implementasi (`writing-plans`)
- Rincian struktur direktori komponen Next.js, nama fungsi *math engine*, dan unit test.
- Isi 10 misi Sandbox, 4 tahap soal LKPD, 10 butir Evaluasi Diagnostik, dan 16 butir bank soal Kuis (semua tetap melalui uji matematis otomatis agar 0 kesalahan kunci jawaban).
- Detail animasi SVG timbangan dan tata letak responsif per *breakpoint*.
