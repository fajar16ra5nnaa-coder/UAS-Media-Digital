import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  LayoutDashboard,
  MessageSquare,
  Scale,
  Trophy,
  XCircle,
} from "lucide-react";
import { MiniBalanceDemo } from "@/components/MiniBalanceDemo";

const MODULES = [
  {
    code: "01",
    href: "/sandbox",
    title: "Lab Timbangan Aljabar",
    tag: "Visual-Simbolik",
    icon: Scale,
    description:
      "Manipulasi keping +x, −x, +1, −1, pasangan nol, dan operasi setara di kedua ruas dengan jejak ekuivalensi otomatis (↔).",
  },
  {
    code: "02",
    href: "/lkpd",
    title: "LKPD Digital 3 LKS",
    tag: "PLSV & PtLSV · Scaffolding",
    icon: BookOpen,
    description:
      "LKS 1 (Konsep PLSV & Neraca), LKS 2 (Penyelesaian PLSV & Konsep PtLSV + Garis Bilangan), dan LKS 3 (Menyelesaikan PtLSV).",
  },
  {
    code: "03",
    href: "/evaluasi",
    title: "Evaluasi & Diagnostik",
    tag: "Berpikir Kreatif + 2-Tier",
    icon: ClipboardCheck,
    description:
      "4 soal uraian open-ended PLSV & PtLSV dengan feedback kunci multi-alternatif, dilengkapi tab diagnostik 2-tier 10 soal.",
  },
  {
    code: "04",
    href: "/kuis",
    title: "Kuis & Papan Peringkat",
    tag: "Kompetitif & Latihan",
    icon: Trophy,
    description:
      "Uji ketangkasan PLSV dalam Mode Kompetitif (Top 10 + Peringkat Pribadi) atau Mode Latihan Santai tanpa tekanan waktu.",
  },
  {
    code: "05",
    href: "/diskusi",
    title: "Ruang Diskusi Kelas",
    tag: "Real-Time · Guru & Siswa",
    icon: MessageSquare,
    description:
      "Diskusi 4 kanal topik dengan bilah simbol matematika, lencana peran GURU/SISWA, serta fitur verifikasi konsep oleh guru.",
  },
  {
    code: "06",
    href: "/guru",
    title: "Panel Analitik Guru",
    tag: "Intervensi Berbasis Data",
    icon: LayoutDashboard,
    description:
      "Pantau peta miskonsepsi kelas, ketuntasan LKPD tiap tahap, dan intensitas penggunaan scaffolding siswa secara real-time.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Editorial Hero */}
      <section className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 font-mono text-xs font-medium text-[var(--ink-muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--emerald)]" />
            Kurikulum Merdeka · Fase D (SMP Kelas VII) · Elemen Aljabar
          </div>

          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-[var(--ink)] sm:text-5xl">
            Pahami PLSV &amp; PtLSV lewat{" "}
            <span className="text-[var(--cobalt)]">Kesetaraan Ruas</span>, bukan
            sekadar hafalan pindah ruas.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
            <strong>RuasSetara</strong> menjembatani pemahaman visual-konkret
            timbangan aljabar dengan notasi simbolik formal untuk{" "}
            <strong>PLSV &amp; PtLSV</strong>, dilengkapi LKPD inkuiri 3 LKS,{" "}
            <em>scaffolding</em> bertingkat 3 level, serta evaluasi berpikir
            kreatif dan diagnostik miskonsepsi.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/sandbox"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--cobalt)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--cobalt-hover)]"
            >
              Mulai Eksplorasi Timbangan
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/masuk"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)]"
            >
              Masuk / Coba Mode Demo
            </Link>
          </div>

          {/* Contrast Box: Relational vs Procedural */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--vermilion)]/25 bg-[var(--vermilion-soft)]/70 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--vermilion)]">
                <XCircle className="h-4 w-4 shrink-0" />
                Miskonsepsi Umum
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink)]">
                Menghafal trik <em>&ldquo;pindah ruas ganti tanda&rdquo;</em>{" "}
                sering memicu kekeliruan saat bertemu koefisien negatif,
                distributif, atau variabel di kedua ruas (Lima &amp; Tall,
                2008).
              </p>
            </div>

            <div className="rounded-xl border border-[var(--emerald)]/25 bg-[var(--emerald-soft)]/70 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--emerald)]">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Pendekatan RuasSetara
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink)]">
                Memaknai tanda <code className="font-mono font-bold">=</code>{" "}
                secara relasional: setiap operasi simetris pada kedua ruas
                menjaga kesetaraan (Otten et al., 2019).
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Mini-Balance above the fold */}
        <div className="lg:col-span-5">
          <MiniBalanceDemo />
        </div>
      </section>

      {/* Learning Pathway Grid */}
      <section className="mt-14">
        <div className="flex flex-col justify-between gap-2 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--cobalt)]">
              Alur Pembelajaran Terpadu
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[var(--ink)]">
              Enam Modul Interaktif RuasSetara
            </h2>
          </div>
          <p className="text-xs text-[var(--ink-muted)]">
            Dirancang untuk model Problem-Based Learning (PBL) &amp;
            Discovery Learning
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.code}
                href={mod.href}
                className="group flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--cobalt)] hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--ink-subtle)]">
                      MODUL {mod.code}
                    </span>
                    <span className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 font-mono text-[11px] font-medium text-[var(--ink-muted)]">
                      {mod.tag}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--cobalt-soft)] text-[var(--cobalt)] transition group-hover:bg-[var(--cobalt)] group-hover:text-white">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[var(--ink)]">
                      {mod.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--cobalt)]">
                  Buka Modul
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
