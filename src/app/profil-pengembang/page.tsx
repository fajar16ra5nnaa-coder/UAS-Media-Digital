import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Github,
  Globe,
  Scale,
  GraduationCap,
  Wrench,
  Lightbulb,
  ShieldCheck,
  Rocket,
  Mail,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Profil Pengembang — RuasSetara",
  description:
    "Profil pengembang RuasSetara: media pembelajaran digital interaktif PLSV & PtLSV untuk Kurikulum Merdeka Fase D.",
};

const SOCIALS = [
  {
    label: "Email",
    href: "mailto:rahmabudiasti.2026@student.uny.ac.id",
    Icon: Mail,
  },
  {
    label: "Instagram — @rhm.asti",
    href: "https://www.instagram.com/rhm.asti/",
    Icon: Instagram,
  },
  {
    label: "Facebook — Rahma Budi Asti",
    href: "https://www.facebook.com/profile.php?id=100089806098536",
    Icon: Facebook,
  },
  {
    label: "LinkedIn — in/rahmabudiasti",
    href: "https://www.linkedin.com/in/rahmabudiasti/",
    Icon: Linkedin,
  },
] as const;

const STATS = [
  { value: "6", label: "Modul Interaktif", hint: "Lab · LKPD · Evaluasi · Kuis · Diskusi · Guru" },
  { value: "3", label: "LKS Inkuiri", hint: "Konsep PLSV → Penyelesaian PLSV → PtLSV" },
  { value: "14", label: "Butir Evaluasi", hint: "4 soal uraian kreatif + 10 diagnostik 2-tier" },
  { value: "26", label: "Tes Otomatis", hint: "Unit & integrasi (Vitest) hijau di CI lokal" },
] as const;

const CONTRIBUTIONS = [
  {
    icon: Scale,
    title: "Desain Pembelajaran",
    body: "Alur visual-simbolik berbasis kesetaraan ruas; LKPD inkuiri 3 LKS dengan scaffolding 3 level (dari pemahaman konseptual — pictorial — simbolik), sesuai prinsip Anghileri (2006) dan van de Pol et al. (2010).",
  },
  {
    icon: Wrench,
    title: "Full-Stack Development",
    body: "Next.js 15 App Router + TypeScript + Tailwind, mesin PLSV/PtLSV berbasis aritmetika rasional eksak, Supabase (Auth, Postgres, RLS, Realtime) untuk autentikasi, LKPD, evaluasi, kuis, dan diskusi kelas.",
  },
  {
    icon: ShieldCheck,
    title: "Keamanan & Kualitas",
    body: "Row Level Security ketat (role escalation diblok trigger database), kode guru diverifikasi server-side, middleware refresh sesi, 26 tes Vitest, typecheck strict, dan build produksi terverifikasi.",
  },
  {
    icon: Rocket,
    title: "Deploy & Akses Publik",
    body: "Dual-hosting Vercel & Netlify (agar situs tetap terbuka dari jaringan kampus), autentikasi demo 1-klik untuk penilai, dan Supabase Auth dengan auto-confirm untuk uji coba langsung.",
  },
] as const;

const DECISIONS = [
  {
    q: "Kenapa timbangan aljabar sebagai metafora utama?",
    a: "Siswa paling sering memahami “=” sebagai perintah “kerjakan”, bukan pernyataan kesetaraan. Representasi neraca menjadikan operasi pada kedua ruas terlihat simetris dan konkrit (Lima & Tall, 2008; Otten et al., 2019).",
  },
  {
    q: "Kenapa dual-hosting Vercel + Netlify?",
    a: "Jaringan kampus memblokir domain *.vercel.app di level DNS. Menyediakan mirror di Netlify memastikan siapa pun (termasuk dosen penilai) dapat membuka RuasSetara tanpa konfigurasi tambahan.",
  },
  {
    q: "Kenapa Supabase, bukan backend sendiri?",
    a: "Auth, Postgres, RLS, dan Realtime (ruang diskusi) tersedia bawaan, gratis, dan andal untuk skala kelas — sehingga energi pengembangan bisa difokuskan pada desain pembelajaran, bukan infrastruktur.",
  },
] as const;

function Barcode({ className }: { className?: string }) {
  // Decorative barcode (aria-hidden)
  const bars = [3, 1, 2, 1, 1, 3, 1, 1, 4, 1, 2, 1, 1, 2, 3, 1, 1, 1, 2, 4, 1, 2, 1, 3];
  return (
    <svg
      viewBox="0 0 120 40"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {bars.map((w, i) => {
        const x = bars.slice(0, i).reduce((acc, b) => acc + b * 2, 0);
        return (
          <rect key={i} x={x} y={0} width={w} height={40} fill="currentColor" />
        );
      })}
    </svg>
  );
}

export default function ProfilPengembangPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--ink-muted)] transition hover:text-[var(--cobalt)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Beranda
        </Link>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-subtle)]">
          RuasSetara · Profil Pengembang
        </p>
      </div>

      {/* Hero — editorial split */}
      <section className="grid gap-10 py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
        <div className="flex flex-col justify-center lg:col-span-7">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--cobalt)]">
            01 — Halo, saya
          </p>
          <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-[var(--ink)] sm:text-6xl xl:text-7xl">
            Rahma
            <br />
            Budi <span className="text-[var(--cobalt)]">Asti.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg font-medium leading-snug text-[var(--ink-muted)]">
            Mahasiswa S2 Pendidikan Matematika · Pascasarjana Universitas Negeri
            Yogyakarta — merancang &amp; membangun media pembelajaran digital
            untuk <strong className="text-[var(--ink)]">PLSV &amp; PtLSV</strong>.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/fajar16ra5nnaa-coder/UAS-Media-Digital"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--ink)] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[var(--cobalt)]"
            >
              <Github className="h-4 w-4" />
              GitHub
              <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
            </a>
            <a
              href="https://ruassetara.netlify.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-xs font-semibold text-[var(--ink)] transition hover:border-[var(--cobalt)] hover:text-[var(--cobalt)]"
            >
              <Globe className="h-4 w-4" />
              ruassetara.netlify.app
              <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
            </a>
            <span className="font-mono text-xs text-[var(--ink-subtle)]">
              @RahmaBudiasti
            </span>
          </div>
          {/* Social icons */}
          <div className="mt-4 flex items-center gap-2">
            <span className="mr-1 font-mono text-[9px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-subtle)]">
              Sosial
            </span>
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] transition hover:border-[var(--cobalt)] hover:bg-[var(--cobalt)] hover:text-white"
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </a>
            ))}
          </div>

          {/* Stats strip */}
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-[var(--surface)] px-4 py-4"
                title={s.hint}
              >
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl font-extrabold text-[var(--cobalt)] sm:text-4xl">
                  {s.value}
                </dd>
                <dd className="mt-1 font-mono text-[9px] font-semibold uppercase leading-tight tracking-wider text-[var(--ink-muted)]">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ID Card artifact */}
        <div className="flex items-center justify-center lg:col-span-5">
          <figure className="w-full max-w-md rotate-[-1.2deg] rounded-2xl border border-[var(--border)] bg-[var(--ink)] p-1.5 shadow-2xl shadow-[var(--ink)]/20 transition-transform duration-300 hover:rotate-0">
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#16233B] via-[#101828] to-[#0B1526] p-5 text-white">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.3em] text-white/70">
                  Kartu Pengembang
                </p>
                <span className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  TDPM 2026
                </span>
              </div>

              <div className="mt-4 flex gap-4">
                {/* Photo placeholder */}
                <div
                  aria-label="Foto profil (menyusul)"
                  className="flex h-32 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/30 bg-white/5"
                >
                  <span className="font-display text-3xl font-extrabold text-white/85">
                    RB
                  </span>
                  <span className="px-2 text-center font-mono text-[8px] uppercase leading-tight text-white/50">
                    foto menyusul
                  </span>
                </div>

                <dl className="min-w-0 flex-1 space-y-2.5 text-[10px] leading-tight">
                  <div>
                    <dt className="font-mono text-[8px] uppercase tracking-widest text-white/45">Nama</dt>
                    <dd className="mt-0.5 font-semibold text-white">Rahma Budi Asti</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[8px] uppercase tracking-widest text-white/45">NIM</dt>
                    <dd className="mt-0.5 font-mono font-bold tracking-[0.15em] text-emerald-300">26031140124</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[8px] uppercase tracking-widest text-white/45">Prodi</dt>
                    <dd className="mt-0.5 font-semibold text-white">S2 Pendidikan Matematika — Pascasarjana UNY</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[8px] uppercase tracking-widest text-white/45">Proyek</dt>
                    <dd className="mt-0.5 font-semibold text-amber-300">RuasSetara · PLSV &amp; PtLSV</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[8px] uppercase tracking-widest text-white/45">Peran</dt>
                    <dd className="mt-0.5 font-semibold text-white">Pengembang &amp; Desainer Pembelajaran</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4 border-t border-white/15 pt-3">
                <div className="text-white/70">
                  <p className="font-mono text-[8px] uppercase tracking-widest text-white/45">ID</p>
                  <p className="font-mono text-xs font-bold tracking-[0.2em] text-white/90">
                    RS·2026·001
                  </p>
                </div>
                <Barcode className="h-8 w-28 text-white/80" />
              </div>
            </div>
            <figcaption className="px-3 pb-2 pt-2 text-center font-mono text-[8px] uppercase tracking-[0.25em] text-white/40">
              Dokumen identitas proyek · bukan dokumen resmi
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 02 — Cerita singkat */}
      <section className="grid gap-8 border-t border-[var(--border)] py-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--cobalt)]">
            02 — Kenapa saya membuat ini
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-[var(--ink)]">
            Murid tidak butuh lebih banyak rumus.
            <span className="text-[var(--cobalt)]"> Mereka butuh cara melihat.</span>
          </h2>
        </div>
        <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-[var(--ink-muted)] lg:col-span-8">
          <p>
            Di kelas, saya melihat pola yang berulang: siswa bisa menghitung,
            tetapi tidak paham <em>mengapa</em> kedua ruas harus selalu
            setimbang. Akibatnya, tanda “=” dihafal sebagai perintah, bukan
            sebagai pernyataan hubungan — dan miskonsepsi ini muncul lagi
            berkali-kali saat bertemu bentuk <em>pindah ruas</em>.
          </p>
          <p>
            RuasSetara lahir dari pertanyaan sederhana:{" "}
            <strong className="text-[var(--ink)]">
              bisakah layar gawai melakukan apa yang tidak bisa dilakukan
              papan tulis — menimbang persamaan secara hidup?
            </strong>{" "}
            Jawabannya: ya. Dengan timbangan aljabar interaktif, siswa
            menambah dan mengurangi keping <strong>+x</strong> dan{" "}
            <strong>−x</strong> di kedua ruas dan <em>melihat sendiri</em>{" "}
            bahwa persamaan tetap setara — lalu menjembatani intuisi itu ke
            notasi simbolik formal.
          </p>
          <p>
            Proyek ini sekaligus menjadi bahan Project Mata Kuliah Teknologi
            Digital Pembelajaran Matematika (TDPM 2026): satu ekosistem utuh —
            dari Lab Timbangan, LKPD 3 LKS, evaluasi berpikir kreatif,
            diagnostik miskonsepsi 2-tier, sampai panel analitik guru —
            dibangun dengan pendekatan{" "}
            <strong className="text-[var(--ink)]">
              visual-simbolik, inkuiri, dan scaffolding bertingkat
            </strong>
            .
          </p>
        </div>
      </section>

      {/* 03 — Peran & kontribusi */}
      <section className="border-t border-[var(--border)] py-10">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--cobalt)]">
              03 — Peran &amp; Kontribusi
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[var(--ink)] sm:text-3xl">
              Satu proyek, empat topi sekaligus.
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-[var(--ink-subtle)]">
            Seluruh rancangan, kode, konten, dan deployment dikerjakan satu
            orang dalam satu semester TDPM 2026.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {CONTRIBUTIONS.map((c) => {
            const Icon = c.icon;
            return (
              <article
                key={c.title}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--cobalt)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--cobalt)]/10 text-[var(--cobalt)] transition group-hover:bg-[var(--cobalt)] group-hover:text-white">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </span>
                  <h3 className="font-display text-base font-bold text-[var(--ink)]">
                    {c.title}
                  </h3>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--ink-muted)]">
                  {c.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* 04 — Keputusan teknis */}
      <section className="grid gap-8 border-t border-[var(--border)] py-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--cobalt)]">
            04 — Keputusan Teknis
          </p>
          <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-[var(--ink)] sm:text-3xl">
            Bukan cuma “bisa jalan”,
            <span className="text-[var(--cobalt)]"> tapi tahu kenapa.</span>
          </h2>
          <div className="mt-5 hidden items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/60 p-4 text-[11px] leading-relaxed text-[var(--ink-muted)] lg:flex">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[var(--vermilion)]" />
            Spesifikasi lengkap &amp; rencana implementasi terdokumentasi di
            folder <code className="font-mono text-[10px]">docs/</code> pada
            repositori proyek.
          </div>
        </div>
        <div className="lg:col-span-8">
          <ol className="divide-y divide-[var(--border-subtle)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            {DECISIONS.map((d, i) => (
              <li key={i} className="grid gap-2 p-5 sm:grid-cols-12 sm:gap-6">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--ink-subtle)] sm:col-span-1">
                  0{i + 1}
                </span>
                <div className="sm:col-span-11">
                  <p className="text-sm font-bold text-[var(--ink)]">{d.q}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ink-muted)]">
                    {d.a}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* CTA band */}
          <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-[var(--cobalt)]/25 bg-[var(--cobalt)]/5 p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-[var(--cobalt)]" />
              <p className="text-sm leading-relaxed text-[var(--ink-muted)]">
                <strong className="text-[var(--ink)]">Untuk dosen &amp; penilai:</strong>{" "}
                gunakan tombol Demo di halaman masuk untuk menguji peran Siswa
                dan Guru tanpa registrasi.
              </p>
            </div>
            <Link
              href="/masuk"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--cobalt)] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[var(--cobalt-hover)]"
            >
              Coba Mode Demo
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
