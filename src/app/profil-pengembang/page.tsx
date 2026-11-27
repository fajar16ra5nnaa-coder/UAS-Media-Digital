import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Github,
  Globe,
  Mail,
  Instagram,
  Facebook,
  Linkedin,
  Scale,
  GraduationCap,
  Wrench,
  Lightbulb,
  ShieldCheck,
  Rocket,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Profil Pengembang — RuasSetara",
  description:
    "Profil pengembang RuasSetara: media pembelajaran digital interaktif PLSV & PtLSV — oleh Rahma Budiasti, S2 Pendidikan Matematika Pascasarjana UNY.",
};

const STATS = [
  { value: "6", label: "Modul Interaktif", dot: "#F59E0B" },
  { value: "3", label: "LKS Inkuiri", dot: "#22C55E" },
  { value: "14", label: "Butir Evaluasi", dot: "#3B82F6" },
  { value: "26", label: "Tes Otomatis", dot: "#A855F7" },
] as const;

const CONTRIBUTIONS = [
  {
    icon: Scale,
    chipBg: "#FEF3C7",
    chipInk: "#B45309",
    title: "Desain Pembelajaran",
    body: "Alur visual-simbolik berbasis kesetaraan ruas; LKPD inkuiri 3 LKS dengan scaffolding 3 level — dari konkret-piktorial ke simbolik (Anghileri, 2006; van de Pol et al., 2010).",
  },
  {
    icon: Wrench,
    chipBg: "#DBEAFE",
    chipInk: "#1D4ED8",
    title: "Full-Stack Development",
    body: "Next.js 15 App Router + TypeScript + Tailwind; mesin PLSV/PtLSV dengan aritmetika rasional eksak; Supabase (Auth, Postgres, RLS, Realtime) untuk login, LKPD, evaluasi, kuis & diskusi kelas.",
  },
  {
    icon: ShieldCheck,
    chipBg: "#DCFCE7",
    chipInk: "#047857",
    title: "Keamanan & Kualitas",
    body: "Row Level Security ketat (eskalasi role diblok trigger database), kode guru diverifikasi server-side, 26 tes Vitest hijau, typecheck strict, dan build produksi terverifikasi.",
  },
  {
    icon: Rocket,
    chipBg: "#F3E8FF",
    chipInk: "#7C3AED",
    title: "Deploy & Akses Publik",
    body: "Dual-hosting Vercel + Netlify agar situs tetap terbuka dari jaringan kampus, autentikasi demo 1-klik untuk penilai, dan Supabase Auth dengan auto-confirm untuk uji coba langsung.",
  },
] as const;

const DECISIONS = [
  {
    q: "Kenapa timbangan aljabar sebagai metafora utama?",
    a: "Siswa paling sering memahami “=” sebagai perintah “kerjakan”, bukan pernyataan kesetaraan. Representasi neraca menjadikan operasi pada kedua ruas terlihat simetris dan konkrit (Lima & Tall, 2008; Otten et al., 2019).",
  },
  {
    q: "Kenapa dual-hosting Vercel + Netlify?",
    a: "Jaringan kampus memblokir domain *.vercel.app di level DNS. Mirror di Netlify memastikan siapa pun (termasuk dosen penilai) dapat membuka RuasSetara tanpa konfigurasi tambahan.",
  },
  {
    q: "Kenapa Supabase, bukan backend sendiri?",
    a: "Auth, Postgres, RLS, dan Realtime (ruang diskusi) tersedia bawaan dan gratis — sehingga energi pengembangan bisa difokuskan pada desain pembelajaran, bukan infrastruktur.",
  },
] as const;

const SOCIALS = [
  {
    label: "Email — rahmabudiasti.2026@student.uny.ac.id",
    handle: "rahmabudiasti.2026@student.uny.ac.id",
    href: "mailto:rahmabudiasti.2026@student.uny.ac.id",
    Icon: Mail,
  },
  {
    label: "Instagram — @rhm.asti",
    handle: "@rhm.asti",
    href: "https://www.instagram.com/rhm.asti/",
    Icon: Instagram,
  },
  {
    label: "Facebook — Rahma Budiasti",
    handle: "Rahma Budiasti",
    href: "https://www.facebook.com/profile.php?id=100089806098536",
    Icon: Facebook,
  },
  {
    label: "LinkedIn — in/rahmabudiasti",
    handle: "in/rahmabudiasti",
    href: "https://www.linkedin.com/in/rahmabudiasti/",
    Icon: Linkedin,
  },
] as const;

function DotGrid({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <defs>
        <pattern id="dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.6" fill="#BFE0FF" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

export default function ProfilPengembangPage() {
  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-1 pb-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--ink-muted)] transition hover:text-[var(--cobalt)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Beranda
        </Link>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-subtle)]">
          Profil Pengembang
        </p>
      </div>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden rounded-[2rem] border border-[#D6E9FB] bg-gradient-to-br from-[#EAF4FE] via-[#F2F9FF] to-[#E3F0FD] shadow-sm">
        <DotGrid className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
        {/* soft blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#FFE9A8]/50 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 bottom-16 h-72 w-72 rounded-full bg-[#BFD8FF]/60 blur-3xl" />

        <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-12 lg:gap-6 lg:py-14 lg:pl-14">
          {/* Copy */}
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#BFE0FF] bg-white/80 py-1.5 pl-2 pr-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1D4ED8] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Mahasiswi S2 · Pendidikan Matematika
            </span>
            <h1 className="mt-5 font-display font-extrabold tracking-tight text-[#0B1B33]">
              <span className="block text-6xl leading-[1.02] sm:text-7xl">
                Hi, saya Rahma
              </span>
              <span className="mt-4 block max-w-lg text-2xl leading-snug text-[#1D4ED8] sm:text-3xl">
                Saya suka mengeksplorasi cara baru untuk belajar matematika.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#3B4A63] sm:text-lg">
              Saya <strong className="text-[#0B1B33]">Rahma Budiasti</strong>,
              Pengembang Media Pembelajaran{" "}
              <strong className="text-[#0B1B33]">RuasSetara</strong>. Melalui
              media ini, saya ingin mengajak siswa belajar PLSV dan PtLSV
              dengan cara yang lebih menarik, interaktif, dan mudah dipahami.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#1D4ED8]/25 transition hover:bg-[#1E40AF]"
              >
                Jelajahi RuasSetara
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:rahmabudiasti.2026@student.uny.ac.id"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#0B1B33] bg-white/70 px-6 py-[10px] text-sm font-bold text-[#0B1B33] backdrop-blur transition hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
              >
                Hubungi Saya
              </a>
            </div>
          </div>

          {/* Portrait */}
          <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:col-span-6">
            {/* dashed orbit ring */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 aspect-square w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-[#9CC8F5]"
            />
            <div className="relative overflow-hidden rounded-full border-[6px] border-white bg-[#DCEEFF] shadow-2xl shadow-[#1D4ED8]/15 ring-1 ring-[#BFE0FF]">
              <Image
                src="/images/profil-rahma.webp"
                alt="Ilustrasi 3D Rahma Budiasti — berkaca mata bulat, cardigan kuning mustard, memegang laptop dengan kalung liontin timbangan"
                width={1024}
                height={1536}
                priority
                className="h-auto w-full object-cover object-top"
              />
            </div>

            {/* Floating chips */}
            <span
              aria-hidden="true"
              className="animate-rs-float absolute -left-1 top-8 flex items-center gap-2 rounded-2xl border border-[#FFE3A3] bg-white/95 px-3 py-2 text-xs font-extrabold text-[#B45309] shadow-lg backdrop-blur sm:-left-6"
            >
              <Scale className="h-4 w-4" />
              x = 6
            </span>
            <span
              aria-hidden="true"
              className="animate-rs-float-delayed absolute -right-1 top-1/3 flex items-center gap-2 rounded-2xl border border-[#C7D2FE] bg-white/95 px-3 py-2 text-xs font-extrabold text-[#4338CA] shadow-lg backdrop-blur sm:-right-5"
            >
              PLSV &amp; PtLSV
            </span>
            <span
              aria-hidden="true"
              className="animate-rs-float absolute -bottom-2 left-4 flex items-center gap-2 rounded-2xl border border-[#FDE68A] bg-white/95 px-3 py-2 text-xs font-extrabold text-[#92400E] shadow-lg backdrop-blur"
            >
              <GraduationCap className="h-4 w-4" />
              UNY 2026 · TDPM
            </span>
          </div>
        </div>
      </section>

      {/* ============ TENTANG SAYA ============ */}
      <section className="grid gap-8 rounded-[2rem] border border-[#E3ECF5] bg-white px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#1D4ED8]">
            Tentang Saya
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-[#0B1B33] sm:text-4xl">
            Mengajar lewat layar,
            <span className="text-[#1D4ED8]"> bukan sekadar di papan tulis.</span>
          </h2>
          <div className="mt-6 hidden lg:block">
            <GraduationCap className="h-10 w-10 text-[#F59E0B]" strokeWidth={1.5} />
          </div>
        </div>
        <div className="lg:col-span-8">
          <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-[#3B4A63]">
            <p>
              Di kelas, saya melihat pola yang berulang: siswa bisa menghitung,
              tetapi tidak paham <em>mengapa</em> kedua ruas harus selalu
              setimbang. Akibatnya, tanda “=” dihafal sebagai perintah, bukan
              pernyataan hubungan — dan miskonsepsi itu muncul lagi saat bertemu
              bentuk <em>pindah ruas</em>.
            </p>
            <p>
              RuasSetara lahir dari pertanyaan sederhana:{" "}
              <strong className="text-[#0B1B33]">
                bisakah layar gawai menimbang persamaan secara hidup?
              </strong>{" "}
              Dengan timbangan aljabar interaktif, siswa menaruh dan mengambil
              keping <strong>+x</strong> dan <strong>−x</strong> di kedua ruas —
              lalu <em>ia sendiri yang menyimpulkan</em> mengapa persamaan
              tetap setara, sebelum dibawa ke notasi formal.
            </p>
            <p className="text-sm text-[#5B6B86]">
              NIM 26031140124 · S2 Pendidikan Matematika · Pascasarjana
              Universitas Negeri Yogyakarta · Project Mata Kuliah Teknologi
              Digital Pembelajaran Matematika (TDPM 2026).
            </p>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-[#E3ECF5] bg-[#F8FBFF] px-4 py-4 text-center"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd className="flex items-center justify-center gap-1.5 font-display text-3xl font-extrabold text-[#0B1B33]">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: s.dot }}
                  />
                  {s.value}
                </dd>
                <dd className="mt-1.5 font-mono text-[8px] font-semibold uppercase leading-tight tracking-wider text-[#5B6B86]">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============ PERAN & KONTRIBUSI ============ */}
      <section className="mt-6">
        <div className="flex flex-col gap-2 px-1 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-[#0B1B33] sm:text-3xl">
            Satu proyek, <span className="text-[#1D4ED8]">empat topi sekaligus.</span>
          </h2>
          <p className="max-w-sm text-xs leading-relaxed text-[#5B6B86]">
            Seluruh rancangan, kode, konten, dan deployment dikerjakan satu
            orang dalam satu semester TDPM 2026.
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {CONTRIBUTIONS.map((c) => {
            const Icon = c.icon;
            return (
              <article
                key={c.title}
                className="rounded-2xl border border-[#E3ECF5] bg-[#F8FBFF] p-5 transition hover:-translate-y-0.5 hover:border-[#9CC8F5] hover:shadow-lg hover:shadow-[#1D4ED8]/5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: c.chipBg, color: c.chipInk }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="font-display text-base font-bold text-[#0B1B33]">
                    {c.title}
                  </h3>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-[#3B4A63]">
                  {c.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ============ KEPUTUSAN TEKNIS ============ */}
      <section className="mt-10 rounded-[2rem] border border-[#E3ECF5] bg-white px-6 py-10 sm:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#1D4ED8]">
              Keputusan Teknis
            </p>
            <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight text-[#0B1B33] sm:text-3xl">
              Bukan cuma “bisa jalan”,
              <span className="text-[#1D4ED8]"> tapi tahu kenapa.</span>
            </h2>
            <div className="mt-5 flex items-start gap-2 rounded-2xl border border-[#FFE3A3] bg-[#FFFBEB] p-4 text-[11px] leading-relaxed text-[#92400E]">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
              Spesifikasi &amp; rencana implementasi lengkap ada di folder{" "}
              <code className="font-mono">docs/</code> repositori.
            </div>
          </div>
          <ol className="lg:col-span-8">
            {DECISIONS.map((d, i) => (
              <li
                key={i}
                className="flex gap-5 border-b border-[#EDF2F8] py-5 first:pt-0 last:border-b-0"
              >
                <span className="font-display text-2xl font-extrabold text-[#C7D9EE]">
                  0{i + 1}
                </span>
                <span>
                  <p className="text-sm font-bold text-[#0B1B33]">{d.q}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#3B4A63]">
                    {d.a}
                  </p>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ MARI TERHUBUNG ============ */}
      <section className="mt-6 rounded-[2rem] border border-[#E3ECF5] bg-white px-6 py-8 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#1D4ED8]">
              Mari Terhubung
            </p>
            <p className="mt-1.5 font-display text-xl font-extrabold text-[#0B1B33]">
              Sapa saya — di mana pun.
            </p>
          </div>
          <ul className="flex flex-wrap items-center gap-2.5">
            <li>
              <a
                href="https://github.com/fajar16ra5nnaa-coder/UAS-Media-Digital"
                target="_blank"
                rel="noreferrer"
                aria-label="Kode di GitHub"
                title="Kode di GitHub"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E3ECF5] bg-[#F8FBFF] text-[#3B4A63] transition hover:border-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white"
              >
                <Github className="h-5 w-5" strokeWidth={1.8} />
              </a>
            </li>
            <li>
              <a
                href="https://ruassetara.netlify.app"
                target="_blank"
                rel="noreferrer"
                aria-label="Situs RuasSetara"
                title="Situs RuasSetara"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E3ECF5] bg-[#F8FBFF] text-[#3B4A63] transition hover:border-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white"
              >
                <Globe className="h-5 w-5" strokeWidth={1.8} />
              </a>
            </li>
            {SOCIALS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E3ECF5] bg-[#F8FBFF] text-[#3B4A63] transition hover:border-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white"
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ CTA DOSEN ============ */}
      <section className="mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1D4ED8] via-[#1E40AF] to-[#0B1B33] px-6 py-8 text-white sm:px-10">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <GraduationCap className="mt-1 h-7 w-7 shrink-0 text-amber-300" strokeWidth={1.6} />
            <div>
              <p className="font-display text-xl font-extrabold leading-snug">
                Untuk dosen &amp; penilai:
              </p>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-blue-100">
                gunakan tombol Demo di halaman masuk untuk menguji peran Siswa
                dan Guru tanpa registrasi — semua progres tersimpan di Supabase.
              </p>
            </div>
          </div>
          <Link
            href="/masuk"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1D4ED8] shadow-lg transition hover:bg-amber-300 hover:text-[#0B1B33]"
          >
            Coba Mode Demo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
