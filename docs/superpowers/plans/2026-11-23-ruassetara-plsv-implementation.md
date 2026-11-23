# RuasSetara (PLSV SMP Kelas VII) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` (inline execution, since no subagent tool is available in this harness) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun, menguji, dan men-deploy aplikasi web pembelajaran interaktif **RuasSetara** (PLSV SMP Kelas VII) berbasis Next.js + Supabase + Vercel yang memenuhi syarat *Interactive Math Sandbox*, LKPD interaktif native, Scaffolding bertingkat adaptif, Evaluasi diagnostik instan, Kuis + Leaderboard inklusif, Ruang Diskusi Guru–Siswa real-time, dan Panel Guru.

**Architecture:** Aplikasi full-stack menggunakan Next.js App Router (TypeScript strict) dengan mesin matematika PLSV deterministik berbasis bilangan rasional eksak (`src/lib/math/`) dan mesin pedagogi scaffolding/diagnostik berbasis aturan (`src/lib/pedagogy/`) yang sepenuhnya teruji unit-test (Vitest). Persistensi data, autentikasi peran (`guru`/`siswa` + akun Demo 1-klik), Row Level Security (RLS), dan chat real-time ditangani oleh Supabase Postgres & Realtime, lalu dipublikasikan ke URL permanen di Vercel.

**Tech Stack:** Next.js 15+ (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React, Vitest, Supabase (`@supabase/supabase-js`, `@supabase/ssr`), Vercel.

**Spec:** `docs/superpowers/specs/2026-11-23-ruassetara-plsv-design.md`

---

## Global Constraints

- **Target Kurikulum:** SMP Kelas VII (Fase D), Elemen Aljabar — PLSV, mengacu pada SK Ka BSKAP Nomor 046/H/KR/2025.
- **Bahasa Antarmuka:** Bahasa Indonesia yang lugas, aktif, ramah siswa SMP (kode dan nama file tetap Inggris).
- **Anti-AI-Slop Visual System (Synthesized Studio Identity — gabungan inspirasi Desmos/Mathigon Polypad, Stripe/Linear editorial clarity, Swiss Textbook Grid, dan WhatsApp Web):**
  - **Palet 6 Token Eksplisit:**
    - `--canvas: #F4F6F8` (kertas abu-putih dingin, BUKAN krem `#F4F1EA` atau gelap `#0B0B0B`)
    - `--surface: #FFFFFF` (panel kerja putih bersih dengan garis batas tegas `1px solid #D5DDE5`)
    - `--ink: #101828` (tinta utama ber kontras tinggi)
    - `--cobalt: #1D4ED8` (aksen merek, blok variabel `+x`, dan lencana `GURU`)
    - `--emerald: #0D7A5F` (blok `+1`, status seimbang `=`, dan lencana `SISWA`)
    - `--vermilion: #C83E2B` (blok negatif `-1`/`-x`, status tidak seimbang `≠`, dan penanda kesalahan)
    - `--ochre-bg: #FEF7E6` / `--ochre-ink: #9A4A06` (catatan pinggir *scaffolding*)
  - **Tipografi (`next/font/google`):** `Bricolage Grotesque` (judul), `IBM Plex Sans` (teks utama), `IBM Plex Mono` (ekspresi aljabar & jejak `↔`).
  - **Larangan Mutlak Anti-Slop:** Dilarang memakai gradien ungu-biru dekoratif, kartu SaaS seragam berbayang lembut yang identik, label *eyebrow* ALL-CAPS di atas tiap judul, tanda `·` atau `—` dekoratif, panah `→` di setiap tombol, warna/miring pada 1 kata di judul, atau animasi *fade-slide-up* berulang di setiap seksi. Blok manipulatif memakai aksen *tactile bottom border* (`border-b-4`) seperti balok peraga fisik.
- **Keamanan Supabase:** RLS aktif di semua tabel `public`; gunakan klausa `TO authenticated` / `TO anon` (bukan `auth.role()`); kebijakan `UPDATE` wajib memiliki `USING` dan `WITH CHECK`; `role` dikunci lewat trigger Postgres + validasi kode guru `GURU-TDPM2026` di Route Handler server; `SUPABASE_SERVICE_ROLE_KEY` tidak pernah diekspos ke browser (`NEXT_PUBLIC_`).
- **Akses Demo & Agensi Kognitif:** Akun Demo 1-Klik (`guru.demo@ruassetara.id` & `siswa.demo@ruassetara.id`) menggunakan akun Supabase Auth riil; *scaffolding* tidak pernah langsung membocorkan jawaban akhir.

---

## Review Focus

Lima kelas input / kondisi gagal yang paling mungkin ditemui pengguna atau dosen saat menguji produk (setiap poin dikunci dengan pengujian pada task pemiliknya):

1. **Pembagian dengan nol atau pembagian menghasilkan pecahan di Sandbox** (`2x + 3 = 7` dibagi `0` atau dibagi `2`) — pembagian `0` harus ditolak dengan pesan konseptual tanpa *crash*/*Infinity*/*NaN*; pembagian dengan `2` harus menghasilkan pecahan eksak tereduksi (`3/2`, `7/2`), bukan `1.500000000001`, serta memicu saran scaffolding lembut. *(Task 2 & Task 3)*
2. **Eskalasi peran dari Siswa menjadi Guru lewat manipulasi request API/DB** — request `UPDATE profiles SET role='guru'` atau registrasi dengan kode guru palsu harus ditolak secara ketat di server dan database. *(Task 4)*
3. **Kunci jawaban & pembahasan matematis tidak konsisten dengan soal** — setiap misi Sandbox, soal LKPD, butir Evaluasi Diagnostik, dan bank soal Kuis harus lolos uji verifikasi matematis otomatis bahwa akar $x$ benar-benar menyeimbangkan kedua ruas persamaan. *(Task 3)*
4. **Pengiriman Evaluasi / LKPD / Kuis dengan jawaban kosong, ganda, atau belum login** — tombol kirim harus memvalidasi kelengkapan dengan pesan terarah dalam Bahasa Indonesia (bukan crash atau silent fail) dan mengarahkan tamu belum login ke modal/halaman login 1-klik Demo. *(Task 7 & Task 8)*
5. **Pesan Chat kosong, sangat panjang, atau percobaan verifikasi pesan oleh akun Siswa** — pesan kosong/spasi harus ditolak, panjang dibatasi (maks. 1.000 karakter), dan aksi `is_verified`/`is_pinned` harus ditolak oleh RLS bila dipanggil oleh peran `siswa`. *(Task 4 & Task 9)*

---

## File Structure

```text
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── next.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx                      # Root layout: fonts, metadata, Navbar + AuthProvider
│   │   ├── globals.css                     # Anti-AI-slop design tokens & subtle millimeter grid
│   │   ├── page.tsx                        # Landing page (Swiss grid + live interactive mini-balance)
│   │   ├── masuk/page.tsx                  # Login + tombol Demo 1-Klik (Guru Demo & Siswa Demo)
│   │   ├── daftar/page.tsx                 # Registrasi Siswa & Guru (dengan kode akses server-side)
│   │   ├── sandbox/page.tsx                # Modul 1: Lab Timbangan Aljabar (Bebas + 10 Misi)
│   │   ├── lkpd/page.tsx                   # Modul 2: LKPD Digital Interaktif 4 Tahap
│   │   ├── evaluasi/page.tsx               # Modul 4: Evaluasi Diagnostik Instan + Review
│   │   ├── kuis/page.tsx                   # Modul 5: Kuis Kompetitif + Mode Latihan + Leaderboard
│   │   ├── diskusi/page.tsx                # Modul 6: Ruang Diskusi Kelas Real-Time (Chat ala WA)
│   │   ├── guru/page.tsx                   # Modul 7: Dashboard Guru (Miskonsepsi & Progres Kelas)
│   │   └── api/auth/
│   │       ├── register/route.ts           # Server-side signup + validasi kode GURU-TDPM2026
│   │       └── demo/route.ts               # Server-side 1-click demo session login
│   ├── lib/
│   │   ├── math/
│   │   │   ├── rational.ts                 # Exact fraction arithmetic (gcd, add, sub, mul, div, format)
│   │   │   └── plsv-engine.ts              # Linear equation state, balance tilt, zero-pair, ↔ trace
│   │   ├── pedagogy/
│   │   │   ├── scaffolding.ts              # 3-level adaptive scaffolding (Anghileri + van de Pol)
│   │   │   └── diagnostic-engine.ts        # Misconception scorer & reviewer (Sarla et al., 2025)
│   │   ├── content/
│   │   │   └── plsv-curriculum.ts          # 10 Sandbox missions, 4 LKPD stages, 10 Diagnostic, 16 Quiz
│   │   └── supabase/
│   │       ├── client.ts                   # Browser Supabase client (@supabase/ssr)
│   │       ├── server.ts                   # Server Supabase client + admin client (server-only)
│   │       └── types.ts                    # Typed DB interfaces
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                  # Clean 6-item nav + role badge + mobile menu
│   │   │   └── AuthContext.tsx             # Client auth & profile state listener
│   │   ├── sandbox/
│   │   │   ├── BalanceScaleSvg.tsx         # Tactile SVG balance beam + tile blocks + zero-pair UI
│   │   │   ├── EquationTrace.tsx           # Synchronized symbolic ↔ equivalence step log
│   │   │   └── SandboxWorkspace.tsx        # Complete Sandbox UI (Free + Missions + Scaffolding)
│   │   ├── scaffolding/
│   │   │   └── ScaffoldingPanel.tsx        # Progressive 3-level drawer + fading indicator
│   │   ├── lkpd/
│   │   │   └── LkpdWorkspace.tsx           # 4-stage interactive worksheet + Supabase autosave
│   │   ├── evaluasi/
│   │   │   └── DiagnosticWorkspace.tsx     # 10-item multi-tier diagnostic + instant review report
│   │   ├── kuis/
│   │   │   └── QuizWorkspace.tsx           # Competitive/Practice quiz + Top 10 inclusive leaderboard
│   │   ├── diskusi/
│   │   │   └── ChatWorkspace.tsx           # 4-channel WA-style realtime chat + Guru verify/pin
│   │   └── guru/
│   │       └── TeacherDashboard.tsx        # Class misconception chart + student progress table
│   └── middleware.ts                       # Supabase session refresh
├── supabase/
│   └── migrations/
│       └── 20261123000001_initial_schema.sql  # Full schema, RLS policies, role trigger, realtime
└── tests/
    ├── rational.test.ts
    ├── plsv-engine.test.ts
    ├── scaffolding.test.ts
    ├── diagnostic-engine.test.ts
    └── curriculum-integrity.test.ts
```

---

## Tasks

### Task 1: Project Scaffold, Anti-AI-Slop Design Tokens & Vitest Setup

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `.gitignore`, `.env.example`
- Create: `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces:**
- Consumes: none
- Produces: runnable Next.js App Router workspace with CSS custom properties (`--canvas`, `--surface`, `--ink`, `--cobalt`, `--emerald`, `--vermilion`, `--ochre-bg`, `--ochre-ink`), fonts (`Bricolage Grotesque`, `IBM Plex Sans`, `IBM Plex Mono`), and working `npm run test` / `npm run typecheck` / `npm run build` scripts.

- [ ] **Step 1: Initialize Next.js + TypeScript + Tailwind v4 + Supabase + Lucide + Vitest dependencies**
  - Create `package.json` with pinned compatible versions (`next`, `react`, `react-dom`, `lucide-react`, `@supabase/supabase-js`, `@supabase/ssr`, `tailwindcss`, `@tailwindcss/postcss`, `typescript`, `vitest`, `@types/react`, `@types/node`) and scripts: `dev`, `build`, `start`, `typecheck` (`tsc --noEmit`), `test` (`vitest run`).
  - Run `npm install`.
- [ ] **Step 2: Configure TypeScript (`tsconfig.json`), Next (`next.config.ts`), PostCSS (`postcss.config.mjs`), Vitest (`vitest.config.ts`), and `.gitignore`**
  - Ensure `next.config.ts` works smoothly behind preview proxies and `tsconfig.json` has `strict: true` and `@/*` path alias to `./src/*`.
- [ ] **Step 3: Create `src/app/globals.css` with the synthesized Anti-AI-Slop Design System**
  - Define exact color tokens, tactile block utility classes (`.math-tile`, `.math-grid-bg`), clean focus rings, and `prefers-reduced-motion` support.
- [ ] **Step 4: Create initial `src/app/layout.tsx` (loading `Bricolage Grotesque`, `IBM Plex Sans`, `IBM Plex Mono` via `next/font/google`, `lang="id"`) and a smoke test**
  - Run `npm run typecheck` and `npm run test` to confirm toolchain works cleanly.
- [ ] **Step 5: Commit**
  ```bash
  git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs vitest.config.ts .gitignore .env.example src/app/globals.css src/app/layout.tsx
  git commit -m "chore: scaffold Next.js app, design tokens, and Vitest setup"
  ```

---

### Task 2: Exact Rational Arithmetic & PLSV Balance Engine (TDD)

**Files:**
- Create: `src/lib/math/rational.ts`
- Create: `src/lib/math/plsv-engine.ts`
- Test: `tests/rational.test.ts`, `tests/plsv-engine.test.ts`

**Interfaces:**
- Consumes: none
- Produces:
  - `Rational` (`{ num: number; den: number }`), `rat(num, den?)`, `addRat`, `subRat`, `mulRat`, `divRat`, `eqRat`, `toNumber`, `formatRat`
  - `LinearSide` (`{ x: Rational; c: Rational }`), `EquationState` (`{ left: LinearSide; right: LinearSide; targetX: Rational; history: EquivalenceStep[]; isBalanced: boolean; zeroPairsCancelled: number }`)
  - `createEquation(leftX: number, leftC: number, rightX: number, rightC: number): EquationState`
  - `applyBothSides(state: EquationState, op: BothSidesOp): ApplyResult`
  - `applySingleSide(state: EquationState, side: 'left' | 'right', deltaX: number, deltaC: number): EquationState`
  - `evaluateSide(side: LinearSide, xValue: Rational): Rational`
  - `checkSolved(state: EquationState): { solved: boolean; solution: Rational | null }`
  - `formatEquation(left: LinearSide, right: LinearSide, relation?: '=' | '<' | '>'): string`
  - `verifySubstitution(initial: EquationState, candidateX: Rational): { leftVal: Rational; rightVal: Rational; isEqual: boolean }`

- [ ] **Step 1: Write failing tests in `tests/rational.test.ts`**
  - Test reduction (`rat(6, 4)` → `3/2`), negative normalization (`rat(2, -4)` → `-1/2`), arithmetic (`addRat`, `subRat`, `mulRat`, `divRat`), zero division throwing `DivisionByZeroError`, and `formatRat` (`3/1` → `"3"`, `-3/2` → `"-3/2"`).
- [ ] **Step 2: Run test to verify failure**
  - Run: `npx vitest run tests/rational.test.ts` → Expected: FAIL (module not found).
- [ ] **Step 3: Implement `src/lib/math/rational.ts`**
- [ ] **Step 4: Run `npx vitest run tests/rational.test.ts` → Expected: PASS**
- [ ] **Step 5: Write failing tests in `tests/plsv-engine.test.ts`**
  - Test `createEquation(2, 3, 1, 7)` computes `targetX = 4` and `isBalanced = true`.
  - Test `applyBothSides` with `sub_x`, `sub_const`, `div_const` produces exact `↔` history steps and reaches `checkSolved().solved === true` with `solution = 4`.
  - Test **Review Focus #1:** `div_const` with `0` returns `{ ok: false, errorCode: 'DIVIDE_BY_ZERO' }` without mutating state; `div_const` with `2` on `2x + 3 = 7` produces exact `x + 3/2 = 7/2` with `warningCode: 'PRODUCES_FRACTION'`.
  - Test `applySingleSide` tilts balance (`isBalanced === false`, relation `'<'` or `'>'`).
  - Test Zero-Pair detection when adding `-3` to `+3` (counts cancelled pairs) and `verifySubstitution` for both correct and incorrect candidate `x`.
- [ ] **Step 6: Run test to verify failure**
  - Run: `npx vitest run tests/plsv-engine.test.ts` → Expected: FAIL.
- [ ] **Step 7: Implement `src/lib/math/plsv-engine.ts`**
- [ ] **Step 8: Run `npx vitest run tests/rational.test.ts tests/plsv-engine.test.ts` → Expected: PASS**
- [ ] **Step 9: Commit**
  ```bash
  git add src/lib/math/ tests/rational.test.ts tests/plsv-engine.test.ts
  git commit -m "feat(math): add exact rational arithmetic and PLSV balance engine"
  ```

---

### Task 3: Adaptive Scaffolding Engine, Diagnostic Scorer & Verified PLSV Curriculum (TDD)

**Files:**
- Create: `src/lib/pedagogy/scaffolding.ts`
- Create: `src/lib/pedagogy/diagnostic-engine.ts`
- Create: `src/lib/content/plsv-curriculum.ts`
- Test: `tests/scaffolding.test.ts`, `tests/diagnostic-engine.test.ts`, `tests/curriculum-integrity.test.ts`

**Interfaces:**
- Consumes: `EquationState`, `Rational`, `verifySubstitution` from Task 2
- Produces:
  - `ScaffoldingLevel` (`1 | 2 | 3`), `ErrorPattern` (`'SINGLE_SIDE_OP' | 'SIGN_FLIP_PINDAH_RUAS' | 'DIVIDE_BY_ZERO' | 'UNLIKE_TERMS' | 'DISTRIBUTIVE_OMISSION' | 'PRODUCES_FRACTION' | 'GENERAL_STUCK'`)
  - `getContingentScaffolding(pattern: ErrorPattern, state: EquationState, maxLevelUnlocked: ScaffoldingLevel): ScaffoldingResponse`
  - `getFadingConfig(stageNumber: 1 | 2 | 3 | 4): { showVisualByDefault: boolean; maxHintLevel: ScaffoldingLevel | 0; fadingLabel: string }`
  - `gradeDiagnosticAttempt(questions: DiagnosticQuestion[], answers: Record<string, DiagnosticUserAnswer>): DiagnosticReport`
  - Curriculum exports: `SANDBOX_MISSIONS` (10 missions), `LKPD_STAGES` (4 stages), `DIAGNOSTIC_QUESTIONS` (10 questions mapped to Sarla et al. 2025 categories `klasifikasional | korelasional | teoritikal`), `QUIZ_BANK` (16 questions).

- [ ] **Step 1: Write failing tests in `tests/scaffolding.test.ts`**
  - Verify each `ErrorPattern` returns a tailored Indonesian message (never revealing the final numerical answer!).
  - Verify Level 1 (visual focus), Level 2 (reflective question), Level 3 (analogous example with different numbers) respect `maxLevelUnlocked`.
  - Verify `getFadingConfig` progressively fades support from Stage 1–2 (full) → Stage 3 (visual collapsed) → Stage 4 (independent HOTS).
- [ ] **Step 2: Write failing tests in `tests/diagnostic-engine.test.ts`**
  - Verify scoring (0–100), confidence-tier classification (`paham_konsep`, `miskonsepsi`, `tidak_paham`, `tebak_benar`), aggregation of 3 Sarla et al. (2025) categories, specific misconception feedback per wrong distractor, and remedial link generation.
- [ ] **Step 3: Write failing tests in `tests/curriculum-integrity.test.ts` (Review Focus #3)**
  - Programmatically verify every single one of the 10 Sandbox missions, 10 Diagnostic questions, and 16 Quiz items has a valid unique answer, non-duplicate options, and its equation's stated solution passes `verifySubstitution(...) === true`.
- [ ] **Step 4: Run tests to verify failure**
  - Run: `npx vitest run tests/scaffolding.test.ts tests/diagnostic-engine.test.ts tests/curriculum-integrity.test.ts` → Expected: FAIL.
- [ ] **Step 5: Implement `src/lib/pedagogy/scaffolding.ts`, `src/lib/pedagogy/diagnostic-engine.ts`, and `src/lib/content/plsv-curriculum.ts`**
- [ ] **Step 6: Run full test suite (`npm run test`) → Expected: PASS (all 5 test files green)**
- [ ] **Step 7: Commit**
  ```bash
  git add src/lib/pedagogy/ src/lib/content/ tests/
  git commit -m "feat(pedagogy): add adaptive scaffolding, diagnostic scorer, and verified PLSV curriculum"
  ```

---

### Task 4: Supabase Project Provisioning, Schema + RLS Security & Auth Flows

**Files:**
- Create: `supabase/migrations/20261123000001_initial_schema.sql`
- Create: `src/lib/supabase/types.ts`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/middleware.ts`
- Create: `src/app/api/auth/register/route.ts`, `src/app/api/auth/demo/route.ts`
- Create: `src/components/layout/AuthContext.tsx`, `src/app/masuk/page.tsx`, `src/app/daftar/page.tsx`

**Interfaces:**
- Consumes: Supabase connector (`create_project`, `update_auth_config`, `execute_query`, `list_api_keys`)
- Produces:
  - Live Supabase project with 5 tables + RLS + role-escalation trigger + Realtime on `chat_messages` + seeded `guru.demo@ruassetara.id` & `siswa.demo@ruassetara.id` + sample seed discussions/scores.
  - `useAuth()` hook returning `{ user, profile, loading, signOut, refreshProfile }`.
  - Server endpoints `POST /api/auth/register` (validates `GURU-TDPM2026` for `guru`) and `POST /api/auth/demo` (`{ role: 'guru' | 'siswa' }`).

- [ ] **Step 1: Provision Supabase project (`ruassetara-plsv`) in `fajar16ra5nnaa-coder's Org` (`ap-southeast-1` Singapore for low latency in Indonesia) and enable `mailer_autoconfirm: true`**
- [ ] **Step 2: Author `supabase/migrations/20261123000001_initial_schema.sql` adhering strictly to Supabase Security Checklist**
  - Tables: `profiles`, `lkpd_submissions`, `diagnostic_attempts`, `quiz_attempts`, `chat_messages`.
  - Trigger `prevent_role_escalation()` blocking any `UPDATE` that changes `profiles.role` from non-service roles (**Review Focus #2**).
  - RLS policies using `TO authenticated` / `TO anon` (no `auth.role()`), both `USING` and `WITH CHECK` on `UPDATE`, Guru-only update on `chat_messages(is_verified, is_pinned)` (**Review Focus #5**), and Guru read access on `lkpd_submissions` & `diagnostic_attempts`.
  - Add `chat_messages` to `supabase_realtime` publication.
- [ ] **Step 3: Apply SQL to Supabase project, verify tables & RLS policies via SQL query, create `.env.local` (git-ignored), and seed the 2 Demo accounts (`guru.demo@ruassetara.id`, `siswa.demo@ruassetara.id`) plus realistic initial chat messages & demo quiz entries**
- [ ] **Step 4: Implement `src/lib/supabase/*`, `src/middleware.ts`, `/api/auth/register`, `/api/auth/demo`, `AuthContext.tsx`, `/masuk`, and `/daftar`**
  - Verify **Review Focus #2** via curl/test: registering with `role: 'guru'` and wrong code returns HTTP 403.
- [ ] **Step 5: Run `npm run typecheck` and `npm run test` → Expected: PASS**
- [ ] **Step 6: Commit**
  ```bash
  git add supabase/ src/lib/supabase/ src/middleware.ts src/app/api/auth/ src/components/layout/AuthContext.tsx src/app/masuk/ src/app/daftar/
  git commit -m "feat(auth): provision Supabase schema with strict RLS and dual login flows"
  ```

---

### Task 5: Navigation Shell & Distinctive Non-AI-Slop Landing Page (`/`)

**Files:**
- Create: `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`
- Create: `src/components/sandbox/HeroMiniBalance.tsx`
- Modify: `src/app/layout.tsx`
- Create: `src/app/page.tsx`

**Interfaces:**
- Consumes: `useAuth` (Task 4), `createEquation` & `applyBothSides` (Task 2)
- Produces: Complete app shell with 6 nav links (`Beranda`, `Lab Timbangan`, `LKPD`, `Evaluasi`, `Kuis`, `Diskusi`) + `Panel Guru` (when `profile.role === 'guru'`), and an editorial Swiss-grid landing page with a live playable mini-balance equation (`2x + 2 = 8`) directly in the hero.

- [ ] **Step 1: Build `Navbar.tsx` and `Footer.tsx`**
  - Clear active link underline (cobalt), role badge (`GURU` cobalt / `SISWA` emerald), responsive mobile drawer, zero generic SaaS clutter.
- [ ] **Step 2: Build `HeroMiniBalance.tsx` — interactive 1-equation teaser right in the hero**
  - Lets any visitor click `−2 kedua ruas` then `÷2 kedua ruas` right on `/` and watch the SVG balance respond and log `↔` steps.
- [ ] **Step 3: Build `src/app/page.tsx` and wire `AuthProvider` + `Navbar` + `Footer` in `src/app/layout.tsx`**
  - Layout: asymmetric 2-column hero (left-aligned bold headline + live mini-balance right), numbered sequential 5-step learning flow (only numbered because it is an actual pedagogical sequence!), and transparent explanation of Guru vs Siswa access.
- [ ] **Step 4: Run `npm run typecheck` and verify rendered `/` in dev server**
- [ ] **Step 5: Commit**
  ```bash
  git add src/components/layout/ src/components/sandbox/HeroMiniBalance.tsx src/app/layout.tsx src/app/page.tsx
  git commit -m "feat(ui): build navigation shell and editorial landing page with live mini-balance"
  ```

---

### Task 6: Modul 1 — Lab Timbangan Aljabar (*Interactive Math Sandbox*) (`/sandbox`)

**Files:**
- Create: `src/components/sandbox/BalanceScaleSvg.tsx`
- Create: `src/components/sandbox/EquationTrace.tsx`
- Create: `src/components/scaffolding/ScaffoldingPanel.tsx`
- Create: `src/components/sandbox/SandboxWorkspace.tsx`
- Create: `src/app/sandbox/page.tsx`

**Interfaces:**
- Consumes: `plsv-engine.ts` (Task 2), `scaffolding.ts` & `SANDBOX_MISSIONS` (Task 3)
- Produces: Reusable `BalanceScaleSvg`, `ScaffoldingPanel`, and full `/sandbox` page with Free Exploration Mode (including 1-side tilt experiment), 10 Guided Missions, Zero-Pair tile cancellation badge, synchronized `↔` trace, Substitution Checker, and 3-level adaptive scaffolding.

- [ ] **Step 1: Build `BalanceScaleSvg.tsx`**
  - Renders tactile blocks (`+x` cobalt, `-x` vermilion dashed balloon/tile, `+1` emerald, `-1` vermilion), smooth CSS rotation of the beam proportional to imbalance, fulcrum indicator (`=`, `<`, `>`), and zero-pair cancellation feedback pill.
- [ ] **Step 2: Build `EquationTrace.tsx` and `ScaffoldingPanel.tsx`**
  - `EquationTrace` displays vertical `↔` steps in `IBM Plex Mono` with operation annotations.
  - `ScaffoldingPanel` unlocks Level 1 → Level 2 → Level 3 sequentially, logs hint usage count, and shows contingent feedback immediately on errors (e.g., `DIVIDE_BY_ZERO`, `SINGLE_SIDE_OP`, `PRODUCES_FRACTION`).
- [ ] **Step 3: Build `SandboxWorkspace.tsx` and `src/app/sandbox/page.tsx`**
  - Tabs: `Misi Terpandu (10 Tantangan)` & `Eksplorasi Bebas (Susun Sendiri)` + mode toggle `Operasi Kedua Ruas (Setara)` vs `Uji Satu Ruas (Lihat Ketidakseimbangan)` + Substitution Verifier modal/card.
- [ ] **Step 4: Run `npm run typecheck` and `npm run test`**
- [ ] **Step 5: Commit**
  ```bash
  git add src/components/sandbox/ src/components/scaffolding/ src/app/sandbox/
  git commit -m "feat(sandbox): build interactive PLSV balance scale, zero-pair tiles, and scaffolding panel"
  ```

---

### Task 7: Modul 2 — LKPD Digital Interaktif Native (`/lkpd`)

**Files:**
- Create: `src/components/lkpd/Stage1Classification.tsx`
- Create: `src/components/lkpd/Stage2BalanceInquiry.tsx`
- Create: `src/components/lkpd/Stage3ContextualModel.tsx`
- Create: `src/components/lkpd/Stage4HotsChallenge.tsx`
- Create: `src/components/lkpd/LkpdWorkspace.tsx`
- Create: `src/app/lkpd/page.tsx`

**Interfaces:**
- Consumes: `BalanceScaleSvg` & `ScaffoldingPanel` (Task 6), `LKPD_STAGES` & `getFadingConfig` (Task 3), Supabase client & `useAuth` (Task 4)
- Produces: Full 4-stage interactive worksheet with progressive scaffolding fading (`Tahap 1–2 Penuh → Tahap 3 Opsional → Tahap 4 Mandiri`), instant validation (**Review Focus #4**), Supabase persistence to `lkpd_submissions`, and "Bagikan Soal Ciptaan ke Diskusi" action in Stage 4.

- [ ] **Step 1: Build Stage 1 (Card Sorting `PLSV` vs `Bukan PLSV` + justification) and Stage 2 (Embedded Mini-Balance Sandbox + inquiry conclusion builder)**
- [ ] **Step 2: Build Stage 3 (Contextual Word Problems: Rectangle Perimeter + Stationery Bundle with step-by-step model checks) and Stage 4 (HOTS C4–C5 Error Analysis "Sihir Pindah Ruas" + C6 Create-a-Problem composer)**
- [ ] **Step 3: Build `LkpdWorkspace.tsx` and `src/app/lkpd/page.tsx`**
  - Loads existing progress from `lkpd_submissions`, tracks `scaffolding_used` per stage, shows clear fading indicator banner, and prompts unauthenticated visitors cleanly with 1-click login link before saving.
- [ ] **Step 4: Run `npm run typecheck` and `npm run test`**
- [ ] **Step 5: Commit**
  ```bash
  git add src/components/lkpd/ src/app/lkpd/
  git commit -m "feat(lkpd): build 4-stage interactive digital worksheet with progressive scaffolding"
  ```

---

### Task 8: Modul 4 & 5 — Evaluasi Diagnostik Instan (`/evaluasi`) & Kuis + Leaderboard Inklusif (`/kuis`)

**Files:**
- Create: `src/components/evaluasi/DiagnosticWorkspace.tsx`
- Create: `src/app/evaluasi/page.tsx`
- Create: `src/components/kuis/QuizWorkspace.tsx`
- Create: `src/app/kuis/page.tsx`

**Interfaces:**
- Consumes: `DIAGNOSTIC_QUESTIONS`, `QUIZ_BANK` (Task 3), `gradeDiagnosticAttempt` (Task 3), Supabase client & `useAuth` (Task 4)
- Produces:
  - `/evaluasi`: 10-question diagnostic test with confidence tiers (`Yakin`/`Ragu-ragu`), immediate post-submit Score Card, 3-category Misconception Diagnosis Map, per-item step-by-step `↔` review + distractor explanation, remedial links to `/sandbox` & `/lkpd`, and Supabase persistence (`diagnostic_attempts`).
  - `/kuis`: Mode selector (`Kompetitif + Leaderboard` vs `Latihan Santai`), 8 randomized questions from 16-item bank, 45s timer, streak multiplier, instant micro-feedback, real-time Top 10 best-score-per-user Leaderboard + Personal Rank Card (`quiz_attempts`).

- [ ] **Step 1: Build `DiagnosticWorkspace.tsx` and `src/app/evaluasi/page.tsx`**
  - Validate unanswered items clearly before submit (**Review Focus #4**).
  - Show instant rich review view right after clicking "Kirim & Lihat Hasil" + view past attempts history.
- [ ] **Step 2: Build `QuizWorkspace.tsx` and `src/app/kuis/page.tsx`**
  - Aggregate best score per `user_id` for Top 10 leaderboard (plus personal best rank card for the logged-in user).
  - Support Relaxed Practice Mode (no timer, not posted to leaderboard).
- [ ] **Step 3: Run `npm run typecheck` and `npm run test`**
- [ ] **Step 4: Commit**
  ```bash
  git add src/components/evaluasi/ src/app/evaluasi/ src/components/kuis/ src/app/kuis/
  git commit -m "feat(assessment): build instant diagnostic evaluation and inclusive quiz leaderboard"
  ```

---

### Task 9: Modul 6 & 7 — Ruang Diskusi Kelas Real-Time (`/diskusi`) & Panel Guru (`/guru`)

**Files:**
- Create: `src/components/diskusi/ChatWorkspace.tsx`
- Create: `src/app/diskusi/page.tsx`
- Create: `src/components/guru/TeacherDashboard.tsx`
- Create: `src/app/guru/page.tsx`

**Interfaces:**
- Consumes: Supabase Realtime (`postgres_changes` on `chat_messages`), `useAuth` (Task 4)
- Produces:
  - `/diskusi`: 4-channel WhatsApp-like real-time chat (`umum`, `sandbox`, `lkpd`, `evaluasi`), distinct `GURU` (cobalt) vs `SISWA` (emerald) role badges, quick math symbol insert bar (`x`, `=`, `↔`, `×`, `÷`, `−`), message length validation (**Review Focus #5**), and Guru-only "Tandai Terverifikasi" & "Sematkan" buttons.
  - `/guru`: Role-gated Teacher Dashboard showing class overview KPIs, 3-category Misconception Distribution bar chart from `diagnostic_attempts`, student LKPD progress + scaffolding dependency table, and top quiz performers.

- [ ] **Step 1: Build `ChatWorkspace.tsx` and `src/app/diskusi/page.tsx`**
  - Subscribe to Supabase Realtime `INSERT` and `UPDATE` events on `chat_messages` filtered by active channel.
  - Render own messages right-aligned, others left-aligned, with prominent `GURU` / `SISWA` pills + verified/pinned indicators.
- [ ] **Step 2: Build `TeacherDashboard.tsx` and `src/app/guru/page.tsx`**
  - Guard route cleanly: if logged in as `siswa`, show clear message explaining this panel is for `Guru` (with quick link to switch to Guru Demo for lecturers).
- [ ] **Step 3: Run `npm run typecheck` and `npm run test`**
- [ ] **Step 4: Commit**
  ```bash
  git add src/components/diskusi/ src/app/diskusi/ src/components/guru/ src/app/guru/
  git commit -m "feat(collab): build realtime class chat and teacher analytics dashboard"
  ```

---

### Task 10: Verification, Anti-Slop Visual Audit, Live Browser Testing & Vercel Production Deploy

**Files:**
- Modify: any fixes discovered during end-to-end verification and UI audit
- Create: `docs/screenshots/` (high-resolution screenshots of live pages for Lampiran 3 of TDPM Report)

**Interfaces:**
- Consumes: All tasks 1–9 + Vercel connector (`create_project`, `create_env_var`, `create_deployment`)
- Produces: Verified green test suite + green production build + live public Vercel URL + high-res UI screenshots ready for Phase 2 (Laporan Final Project TDPM 2026).

- [ ] **Step 1: Run full verification commands (`npm run test`, `npm run typecheck`, `npm run build`)**
- [ ] **Step 2: Start local preview server (`start_process` bound to `0.0.0.0`) and verify every single route & flow in a real headless browser (desktop + mobile):**
  - `/` (live mini-balance) → `/masuk` (1-click Siswa Demo & Guru Demo) → `/sandbox` (operations + zero-pair + division-by-zero rejection + scaffolding) → `/lkpd` (save Stage 1–4) → `/evaluasi` (submit & verify instant misconception review) → `/kuis` (complete quiz & verify leaderboard update) → `/diskusi` (send message & verify Guru pin/verify + `GURU`/`SISWA` badges) → `/guru` (verify class analytics).
- [ ] **Step 3: Audit UI against `frontend-design` anti-AI-slop checklist and `web-design-guidelines` accessibility checks; fix any issues found and re-verify**
- [ ] **Step 4: Push branch and deploy to Vercel with production environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `TEACHER_ACCESS_CODE`), then verify the live production URL responds cleanly**
- [ ] **Step 5: Capture high-resolution screenshots of all key views for Lampiran 3 and commit final polish**

---

### Phase 2 (Setelah Aplikasi Live & Diverifikasi Anda)
Menyusun **Laporan Final Project TDPM 2026 lengkap (BAB I–V, Ringkasan Eksekutif, Daftar Pustaka APA 7th terverifikasi) + 4 Lampiran Wajib** (Link Produk & Naskah Video Demo, Modul Ajar Kurikulum Merdeka + LKPD, Screenshots & Storyboard, User Manual Guru & Siswa) yang sesuai 100% dengan `Template Laporan Final Project TDPM 2026.docx`, dalam format `.docx` siap kumpul dan dapat diunggah ke folder Drive `UASDigital`.
