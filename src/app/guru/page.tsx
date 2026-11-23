"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Lock,
  MessageSquare,
  RefreshCw,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import type {
  DiagnosticAttemptRow,
  LkpdSubmissionRow,
  Profile,
} from "@/lib/supabase/types";

interface StudentSummary {
  profile: Profile;
  lkpdCompleted: number;
  lkpdAvgScore: number;
  scaffoldingTotal: { l1: number; l2: number; l3: number };
  latestDiagnosticScore: number | null;
  dominantMisconception: string | null;
}

export default function GuruPanelPage() {
  const { profile, loading, loginDemo } = useAuth();
  const [fetching, setFetching] = useState(false);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [chatCount, setChatCount] = useState(0);
  const [misconceptionTotals, setMisconceptionTotals] = useState({
    klasifikasional: 0,
    korelasional: 0,
    teoritikal: 0,
  });

  async function loadAnalytics() {
    setFetching(true);
    try {
      const supabase = createClient();
      const [profRes, lkpdRes, diagRes, chatRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("role", "siswa")
          .order("full_name", { ascending: true }),
        supabase.from("lkpd_submissions").select("*"),
        supabase
          .from("diagnostic_attempts")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("chat_messages")
          .select("id", { count: "exact", head: true }),
      ]);

      const siswaList = (profRes.data ?? []) as Profile[];
      const lkpdRows = (lkpdRes.data ?? []) as LkpdSubmissionRow[];
      const diagRows = (diagRes.data ?? []) as DiagnosticAttemptRow[];
      setChatCount(chatRes.count ?? 0);

      let klas = 0;
      let kor = 0;
      let teor = 0;

      const summaries: StudentSummary[] = siswaList.map((s) => {
        const myLkpd = lkpdRows.filter((r) => r.user_id === s.id);
        const completed = myLkpd.filter((r) => r.is_completed);
        const avgLkpd =
          completed.length > 0
            ? Math.round(
                completed.reduce((acc, r) => acc + r.score, 0) /
                  completed.length
              )
            : 0;

        const scaff = myLkpd.reduce(
          (acc, r) => ({
            l1: acc.l1 + (r.scaffolding_used?.level1 ?? 0),
            l2: acc.l2 + (r.scaffolding_used?.level2 ?? 0),
            l3: acc.l3 + (r.scaffolding_used?.level3 ?? 0),
          }),
          { l1: 0, l2: 0, l3: 0 }
        );

        const latestDiag = diagRows.find((d) => d.user_id === s.id);
        if (latestDiag?.misconception_summary) {
          klas += latestDiag.misconception_summary.klasifikasional ?? 0;
          kor += latestDiag.misconception_summary.korelasional ?? 0;
          teor += latestDiag.misconception_summary.teoritikal ?? 0;
        }

        return {
          profile: s,
          lkpdCompleted: completed.length,
          lkpdAvgScore: avgLkpd,
          scaffoldingTotal: scaff,
          latestDiagnosticScore: latestDiag ? latestDiag.score : null,
          dominantMisconception:
            latestDiag?.misconception_summary?.dominantType ?? null,
        };
      });

      setStudents(summaries);
      setMisconceptionTotals({
        klasifikasional: klas,
        korelasional: kor,
        teoritikal: teor,
      });
    } catch {
      // ignore offline
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    if (profile?.role === "guru") {
      loadAnalytics();
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="h-64 animate-pulse rounded-xl bg-[var(--surface-muted)]" />
      </div>
    );
  }

  if (!profile || profile.role !== "guru") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--emerald-soft)] text-[var(--emerald)]">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-[var(--ink)]">
            Panel Analitik Khusus Peran Guru
          </h1>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            Halaman ini dilindungi oleh Row Level Security (RLS) Supabase dan
            hanya dapat diakses menggunakan akun berperan <strong>GURU</strong>.
            Untuk mengevaluasi dashboard ini, gunakan akses Demo Guru 1-Klik.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => loginDemo("guru")}
              className="rounded-lg bg-[var(--emerald)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Masuk sebagai Guru Demo (1-Klik)
            </button>
            <Link
              href="/masuk"
              className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
            >
              Halaman Masuk
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const diagScores = students
    .map((s) => s.latestDiagnosticScore)
    .filter((v): v is number => v !== null);
  const avgDiag =
    diagScores.length > 0
      ? Math.round(diagScores.reduce((a, b) => a + b, 0) / diagScores.length)
      : 0;
  const totalLkpdDone = students.reduce((a, s) => a + s.lkpdCompleted, 0);
  const totalMisc = Math.max(
    1,
    misconceptionTotals.klasifikasional +
      misconceptionTotals.korelasional +
      misconceptionTotals.teoritikal
  );

  const dominantClassMisc = (
    [
      {
        key: "korelasional",
        label: "Miskonsepsi Korelasional (Operasi Kedua Ruas & Pindah Ruas)",
        count: misconceptionTotals.korelasional,
        action:
          "Fokuskan apersepsi pertemuan berikutnya pada eksperimen Lab Timbangan Misi 5–8 (variabel di kedua ruas & koefisien negatif).",
      },
      {
        key: "teoritikal",
        label: "Miskonsepsi Teoritikal (Sifat Distributif & Suku Sejenis)",
        count: misconceptionTotals.teoritikal,
        action:
          "Berikan penguatan contoh distributif bertanda negatif dan review Kasus Dito pada LKPD Tahap 4.",
      },
      {
        key: "klasifikasional",
        label: "Miskonsepsi Klasifikasional (Identifikasi Bentuk & Ekuivalensi)",
        count: misconceptionTotals.klasifikasional,
        action:
          "Ulangi klasifikasi kartu LKPD Tahap 1 dan tekankan syarat 1 variabel berpangkat 1 dengan tanda '='.",
      },
    ] as const
  )
    .slice()
    .sort((a, b) => b.count - a.count)[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-5 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--emerald)]">
            Modul 06 · Panel Analitik Guru · {profile.full_name}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-[var(--ink)]">
            Dashboard Intervensi &amp; Miskonsepsi Kelas
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--ink-muted)]">
            Data agregasi real-time dari basis data Supabase untuk membantu guru
            memetakan pola miskonsepsi Sarla et al. (2025) dan kebutuhan
            pendampingan tiap siswa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadAnalytics}
            disabled={fetching}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${fetching ? "animate-spin" : ""}`}
            />
            Muat Ulang Data
          </button>
          <Link
            href="/diskusi"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--emerald)] px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Moderasi Diskusi
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--ink-muted)]">
            <span>Siswa Terdaftar</span>
            <Users className="h-4 w-4 text-[var(--cobalt)]" />
          </div>
          <div className="mt-2 font-mono text-3xl font-extrabold text-[var(--ink)]">
            {students.length}
          </div>
          <div className="mt-1 text-[11px] text-[var(--ink-subtle)]">
            Kelas VII-A &amp; VII-B
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--ink-muted)]">
            <span>Rata-Rata Diagnostik</span>
            <BarChart3 className="h-4 w-4 text-[var(--emerald)]" />
          </div>
          <div className="mt-2 font-mono text-3xl font-extrabold text-[var(--cobalt)]">
            {avgDiag}
            <span className="text-base font-normal text-[var(--ink-subtle)]">
              /100
            </span>
          </div>
          <div className="mt-1 text-[11px] text-[var(--ink-subtle)]">
            Dari {diagScores.length} siswa yang telah tes
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--ink-muted)]">
            <span>Tahap LKPD Tuntas</span>
            <BookOpen className="h-4 w-4 text-[var(--cobalt)]" />
          </div>
          <div className="mt-2 font-mono text-3xl font-extrabold text-[var(--emerald)]">
            {totalLkpdDone}
          </div>
          <div className="mt-1 text-[11px] text-[var(--ink-subtle)]">
            Total dari {students.length * 4} target tahap
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--ink-muted)]">
            <span>Interaksi Diskusi</span>
            <MessageSquare className="h-4 w-4 text-[var(--emerald)]" />
          </div>
          <div className="mt-2 font-mono text-3xl font-extrabold text-[var(--ink)]">
            {chatCount}
          </div>
          <div className="mt-1 text-[11px] text-[var(--ink-subtle)]">
            Pesan aktif di 4 kanal kelas
          </div>
        </div>
      </div>

      {/* Class Misconception Breakdown */}
      <div className="mt-6 grid gap-5 lg:grid-cols-12">
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 lg:col-span-7">
          <h2 className="font-display text-lg font-bold text-[var(--ink)]">
            Distribusi Miskonsepsi Kelas (Sarla et al., 2025)
          </h2>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">
            Akumulasi indikator miskonsepsi dari percobaan diagnostik terbaru
            seluruh siswa.
          </p>

          <div className="mt-4 space-y-4">
            {[
              {
                label: "Korelasional (Operasi Kedua Ruas & 'Pindah Ruas')",
                count: misconceptionTotals.korelasional,
                color: "bg-[var(--vermilion)]",
              },
              {
                label: "Teoritikal (Distributif & Penyederhanaan Suku)",
                count: misconceptionTotals.teoritikal,
                color: "bg-[var(--ochre-ink)]",
              },
              {
                label: "Klasifikasional (Identifikasi Bentuk PLSV)",
                count: misconceptionTotals.klasifikasional,
                color: "bg-[var(--cobalt)]",
              },
            ].map((bar) => {
              const pct = Math.round((bar.count / totalMisc) * 100);
              return (
                <div key={bar.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--ink)]">
                      {bar.label}
                    </span>
                    <span className="font-mono font-bold text-[var(--ink-muted)]">
                      {bar.count} temuan ({pct}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div
                      className={`h-full rounded-full ${bar.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="rounded-xl border border-[var(--ochre-border)] bg-[var(--ochre-bg)] p-5 lg:col-span-5">
          <div className="flex items-center gap-2 font-display text-base font-bold text-[var(--ochre-ink)]">
            <AlertTriangle className="h-4.5 w-4.5" />
            Rekomendasi Intervensi Guru
          </div>
          <p className="mt-2 text-xs font-semibold text-[var(--ink)]">
            Miskonsepsi Paling Dominan di Kelas:
          </p>
          <p className="mt-1 rounded-lg bg-white/85 px-3 py-2 font-display text-sm font-bold text-[var(--vermilion)]">
            {dominantClassMisc.label}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-[var(--ink)]">
            <strong>Tindakan Pedagogis Disarankan:</strong>{" "}
            {dominantClassMisc.action}
          </p>
        </aside>
      </div>

      {/* Student Progress & Scaffolding Matrix */}
      <section className="mt-6 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-display text-lg font-bold text-[var(--ink)]">
            Matriks Progres LKPD, Scaffolding, &amp; Diagnostik Siswa
          </h2>
          <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
            Memantau kemandirian belajar siswa berdasarkan penurunan kebutuhan
            scaffolding (L1/L2/L3) dan capaian evaluasi.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)] font-mono text-[11px] uppercase text-[var(--ink-subtle)]">
              <tr>
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">LKPD Tuntas</th>
                <th className="px-4 py-3">Scaffolding (L1 / L2 / L3)</th>
                <th className="px-4 py-3">Diagnostik</th>
                <th className="px-4 py-3">Miskonsepsi Utama</th>
                <th className="px-4 py-3">Status Intervensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {students.map((st) => {
                const score = st.latestDiagnosticScore;
                const status =
                  score === null
                    ? {
                        label: "Belum Tes",
                        cls: "bg-[var(--surface-muted)] text-[var(--ink-muted)]",
                      }
                    : score >= 80
                    ? {
                        label: "Mandiri",
                        cls: "bg-[var(--emerald-soft)] text-[var(--emerald)]",
                      }
                    : score >= 65
                    ? {
                        label: "Perlu Penguatan",
                        cls: "bg-[var(--ochre-bg)] text-[var(--ochre-ink)]",
                      }
                    : {
                        label: "Prioritas Remedial",
                        cls: "bg-[var(--vermilion-soft)] text-[var(--vermilion)]",
                      };

                return (
                  <tr
                    key={st.profile.id}
                    className="hover:bg-[var(--surface-muted)]/40"
                  >
                    <td className="px-4 py-3 font-semibold text-[var(--ink)]">
                      {st.profile.full_name}
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--ink-muted)]">
                      {st.profile.class_name || "—"}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <span className="font-bold text-[var(--ink)]">
                        {st.lkpdCompleted}/4
                      </span>{" "}
                      <span className="text-[var(--ink-subtle)]">
                        (rata {st.lkpdAvgScore}%)
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--ink-muted)]">
                      {st.scaffoldingTotal.l1} / {st.scaffoldingTotal.l2} /{" "}
                      {st.scaffoldingTotal.l3}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-[var(--cobalt)]">
                      {score !== null ? `${score}/100` : "—"}
                    </td>
                    <td className="px-4 py-3 capitalize text-[var(--ink-muted)]">
                      {st.dominantMisconception ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${status.cls}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
