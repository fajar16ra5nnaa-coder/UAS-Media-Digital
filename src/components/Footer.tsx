import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="font-display text-base font-bold text-[var(--ink)]">
              Ruas<span className="text-[var(--cobalt)]">Setara</span>
            </div>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-[var(--ink-muted)]">
              Website Pembelajaran Interaktif Persamaan Linear Satu Variabel
              (PLSV) Jenjang SMP Kelas VII (Fase D — SK Ka BSKAP No.
              046/H/KR/2025) melalui Eksplorasi Visual-Simbolik dan Scaffolding
              Bertingkat.
            </p>
          </div>
          <div className="md:col-span-3">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-subtle)]">
              Modul Utama
            </div>
            <ul className="mt-2 space-y-1.5 text-xs text-[var(--ink-muted)]">
              <li>
                <Link href="/sandbox" className="hover:text-[var(--cobalt)]">
                  Lab Timbangan Aljabar
                </Link>
              </li>
              <li>
                <Link href="/lkpd" className="hover:text-[var(--cobalt)]">
                  LKPD Digital Interaktif
                </Link>
              </li>
              <li>
                <Link href="/evaluasi" className="hover:text-[var(--cobalt)]">
                  Evaluasi Diagnostik
                </Link>
              </li>
              <li>
                <Link href="/kuis" className="hover:text-[var(--cobalt)]">
                  Kuis & Peringkat
                </Link>
              </li>
              <li>
                <Link href="/diskusi" className="hover:text-[var(--cobalt)]">
                  Ruang Diskusi Kelas
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-subtle)]">
              Proyek Akademik
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">
              Final Project Mata Kuliah Teknologi Digital Pembelajaran
              Matematika (TDPM 2026)
              <br />
              Program Studi Magister (S2) Pendidikan Matematika
              <br />
              Pascasarjana Universitas Negeri Yogyakarta
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
