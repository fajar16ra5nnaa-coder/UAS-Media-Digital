import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  Scale,
  ArrowLeft,
  Github,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Profil Pengembang — RuasSetara",
  description:
    "Profil pengembang RuasSetara: media pembelajaran digital interaktif PLSV & PtLSV untuk SMP Kelas VII.",
};

export default function ProfilPengembangPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--ink-muted)] transition hover:text-[var(--cobalt)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kembali ke Beranda
      </Link>

      {/* Hero card */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-muted)]/60 px-6 py-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--cobalt)]">
            Tentang Pengembang
          </p>
        </div>
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:gap-10">
          {/* Avatar placeholder (monogram) */}
          <div className="flex flex-col items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-gradient-to-br from-[var(--cobalt)]/10 via-[var(--surface)] to-[var(--emerald)]/10"
            >
              <span className="font-display text-5xl font-extrabold tracking-tight text-[var(--cobalt)]">
                RB
              </span>
            </div>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 font-mono text-[10px] font-medium text-[var(--ink-subtle)]">
              foto placeholder · akan direvisi
            </span>
          </div>

          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
              Rahma Budi Asti
            </h1>
            <p className="mt-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--cobalt)]">
              Pengembang RuasSetara · @RahmaBudiasti
            </p>

            <div className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--ink-muted)]">
              <p>
                RuasSetara dikembangkan sebagai media pembelajaran digital
                interaktif untuk materi{" "}
                <strong className="text-[var(--ink)]">
                  Persamaan &amp; Pertidaksamaan Linear Satu Variabel (PLSV
                  &amp; PtLSV)
                </strong>
                {" "}— membantu siswa memahami konsep kesetaraan ruas secara
                visual dan relasional, bukan sekadar menghafal prosedur
                “pindah ruas”.
              </p>
              <p>
                Media ini dikembangkan dalam rangka{" "}
                <strong className="text-[var(--ink)]">
                  Project Mata Kuliah Teknologi Digital Pembelajaran Matematika
                  (TDPM 2026)
                </strong>
                .
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-medium text-[var(--ink-muted)]">
                <GraduationCap className="h-3.5 w-3.5 text-[var(--cobalt)]" />
                S2 Pendidikan Matematika · Pascasarjana UNY
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-medium text-[var(--ink-muted)]">
                <Scale className="h-3.5 w-3.5 text-[var(--emerald)]" />
                PLSV &amp; PtLSV · Fase D
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-medium text-[var(--ink-muted)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--vermilion)]" />
                Visual-Simbolik · Inkuiri
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* About the project */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="font-display text-base font-bold text-[var(--ink)]">
            Kenapa RuasSetara?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
            Banyak siswa memahami “=” sebagai perintah “mengerjakan”, bukan
            sebagai pernyataan kesetaraan yang simetris. RuasSetara menjembatani
            pemahaman visual-konkret timbangan aljabar dengan notasi simbolik
            formal, melalui Lab Timbangan interaktif, LKPD inkuiri 3 LKS,
            scaffolding bertingkat 3 level, serta evaluasi berpikir kreatif dan
            diagnostik miskonsepsi.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="font-display text-base font-bold text-[var(--ink)]">
            Dibangun dengan
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-[var(--ink-muted)]">
            <li>· Next.js 15 (App Router) &amp; TypeScript</li>
            <li>· Tailwind CSS · font &amp; ikon @fontsource/lucide</li>
            <li>· Supabase — Auth, Postgres, RLS &amp; Realtime</li>
            <li>· Hosting: Vercel &amp; Netlify · CI lewat GitHub</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="https://github.com/fajar16ra5nnaa-coder/UAS-Media-Digital"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] font-semibold text-[var(--ink)] transition hover:border-[var(--cobalt)] hover:text-[var(--cobalt)]"
            >
              <Github className="h-3.5 w-3.5" />
              Kode di GitHub
            </a>
            <a
              href="https://ruassetara.netlify.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] font-semibold text-[var(--ink)] transition hover:border-[var(--cobalt)] hover:text-[var(--cobalt)]"
            >
              <Globe className="h-3.5 w-3.5" />
              Kunjungi RuasSetara
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
