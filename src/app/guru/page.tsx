"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
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
  lkpdRows: LkpdSubmissionRow[];
  scaffoldingTotal: { l1: number; l2: number; l3: number };
  latestDiagnosticScore: number | null;
  dominantMisconception: string | null;
  latestCreativeAttempt: DiagnosticAttemptRow | null;
}

function isCreativePosttest(row: DiagnosticAttemptRow): boolean {
  return (
    row.misconception_summary?.mode === "creative_posttest" ||
    (row.answers &&
      typeof row.answers === "object" &&
      (row.answers as Record<string, unknown>).mode === "creative_posttest")
  );
}

export default function GuruPanelPage() {
  const { profile, loading, loginDemo } = useAuth();
  const [fetching, setFetching] = useState(false);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(
    null
  );
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
        const myLkpd = lkpdRows
          .filter((r) => r.user_id === s.id && r.stage_number >= 1 && r.stage_number <= 3)
          .sort((a, b) => a.stage_number - b.stage_number);
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

        const myAttempts = diagRows.filter((d) => d.user_id === s.id);
        const latestTwoTier = myAttempts.find((d) => !isCreativePosttest(d));
        const latestCreative =
          myAttempts.find((d) => isCreativePosttest(d)) ?? null;

        if (latestTwoTier?.misconception_summary) {
          klas += latestTwoTier.misconception_summary.klasifikasional ?? 0;
          kor += latestTwoTier.misconception_summary.korelasional ?? 0;
          teor += latestTwoTier.misconception_summary.teoritikal ?? 0;
        }

        return {
          profile: s,
          lkpdCompleted: completed.length,
          lkpdAvgScore: avgLkpd,
          lkpdRows: myLkpd,
          scaffoldingTotal: scaff,
          latestDiagnosticScore: latestTwoTier ? latestTwoTier.score : null,
          dominantMisconception:
            latestTwoTier?.misconception_summary?.dominantType ?? null,
          latestCreativeAttempt: latestCreative,
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
  const creativeCount = students.filter((s) => s.latestCreativeAttempt).length;
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
        label: "Miskonsepsi Korelasional (Operasi Kedua Ruas & Tanda PtLSV)",
        count: misconceptionTotals.korelasional,
        action:
          "Fokuskan apersepsi pertemuan berikutnya pada eksperimen Lab Timbangan (variabel di kedua ruas & koefisien negatif) serta audit langkah LKS 2–3.",
      },
      {
        key: "teoritikal",
        label: "Miskonsepsi Teoritikal (Sifat Distributif & Suku Sejenis)",
        count: misconceptionTotals.teoritikal,
        action:
          "Berikan penguatan contoh perkalian pecahan/distributif pada LKS 2 Soal 1b–1c (mengalikan seluruh suku di kedua ruas).",
      },
      {
        key: "klasifikasional",
        label: "Miskonsepsi Klasifikasional (Identifikasi PLSV vs PtLSV)",
        count: misconceptionTotals.klasifikasional,
        action:
          "Ulangi klasifikasi LKS 1 & LKS 2 (membedakan tanda '=', '<', '>', '≤', '≥' dan syarat pangkat variabel = 1).",
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
            Modul 06 · Panel Analitik Guru · PLSV &amp; PtLSV · {profile.full_name}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-[var(--ink)]">
            Dashboard Intervensi, LKPD 3 LKS &amp; Evaluasi Siswa
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--ink-muted)]">
            Data agregasi real-time dari Supabase untuk memantau ketuntasan LKS
            1–3, meninjau jawaban uraian Evaluasi Berpikir Kreatif (4 Soal), dan
            memetakan miskonsepsi diagnostik 2-tier kelas.
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
            Kelas VII-A &amp; VII-B · {creativeCount} kumpulkan evaluasi uraian
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--ink-muted)]">
            <span>Rata-Rata Diagnostik 2-Tier</span>
            <BarChart3 className="h-4 w-4 text-[var(--emerald)]" />
          </div>
          <div className="mt-2 font-mono text-3xl font-extrabold text-[var(--cobalt)]">
            {avgDiag}
            <span className="text-base font-normal text-[var(--ink-subtle)]">
              /100
            </span>
          </div>
          <div className="mt-1 text-[11px] text-[var(--ink-subtle)]">
            Dari {diagScores.length} siswa yang telah tes 2-tier
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--ink-muted)]">
            <span>LKPD Tuntas (LKS 1–3)</span>
            <BookOpen className="h-4 w-4 text-[var(--cobalt)]" />
          </div>
          <div className="mt-2 font-mono text-3xl font-extrabold text-[var(--emerald)]">
            {totalLkpdDone}
          </div>
          <div className="mt-1 text-[11px] text-[var(--ink-subtle)]">
            Total dari {students.length * 3} target LKS
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
            Akumulasi indikator miskonsepsi dari Tab Diagnostik 2-Tier terbaru
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
                label: "Klasifikasional (Identifikasi Bentuk PLSV & PtLSV)",
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

      {/* Student Progress & Scaffolding Matrix + Expandable Essay Inspector */}
      <section className="mt-6 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-display text-lg font-bold text-[var(--ink)]">
            Matriks Progres LKPD (3 LKS), Evaluasi Uraian &amp; Diagnostik Siswa
          </h2>
          <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
            Klik <strong>Lihat Jawaban</strong> pada baris siswa untuk meninjau
            uraian Evaluasi 4 Soal (PLSV &amp; PtLSV) dan refleksi LKS 1–3.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-muted)] font-mono text-[11px] uppercase text-[var(--ink-subtle)]">
              <tr>
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">LKPD (LKS 1–3)</th>
                <th className="px-4 py-3">Scaffolding (L1/L2/L3)</th>
                <th className="px-4 py-3">Evaluasi Uraian</th>
                <th className="px-4 py-3">Diagnostik 2-Tier</th>
                <th className="px-4 py-3">Tinjau</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {students.map((st) => {
                const score = st.latestDiagnosticScore;
                const expanded = expandedStudentId === st.profile.id;
                const creativeAns = st.latestCreativeAttempt?.answers as
                  | {
                      responses?: Record<string, string>;
                      quickChecks?: Record<string, string>;
                    }
                  | undefined;

                return (
                  <React.Fragment key={st.profile.id}>
                    <tr className="hover:bg-[var(--surface-muted)]/40">
                      <td className="px-4 py-3 font-semibold text-[var(--ink)]">
                        {st.profile.full_name}
                      </td>
                      <td className="px-4 py-3 font-mono text-[var(--ink-muted)]">
                        {st.profile.class_name || "—"}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <span className="font-bold text-[var(--ink)]">
                          {st.lkpdCompleted}/3 LKS
                        </span>{" "}
                        <span className="text-[var(--ink-subtle)]">
                          (rata {st.lkpdAvgScore}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[var(--ink-muted)]">
                        {st.scaffoldingTotal.l1} / {st.scaffoldingTotal.l2} /{" "}
                        {st.scaffoldingTotal.l3}
                      </td>
                      <td className="px-4 py-3">
                        {st.latestCreativeAttempt ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--emerald-soft)] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[var(--emerald)]">
                            <FileText className="h-3 w-3" />
                            Terkumpul (
                            {st.latestCreativeAttempt.misconception_summary
                              ?.answeredProblems ?? 4}
                            /4)
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-[var(--ink-subtle)]">
                            Belum kumpul
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-[var(--cobalt)]">
                        {score !== null ? `${score}/100` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedStudentId(expanded ? null : st.profile.id)
                          }
                          className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                        >
                          {expanded ? (
                            <>
                              Tutup <ChevronUp className="h-3 w-3" />
                            </>
                          ) : (
                            <>
                              Lihat Jawaban <ChevronDown className="h-3 w-3" />
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                    {expanded && (
                      <tr className="bg-[var(--surface-muted)]/40">
                        <td colSpan={7} className="px-5 py-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            {/* Creative Evaluation Responses */}
                            <div className="rounded-lg border border-[var(--border)] bg-white p-3.5">
                              <div className="font-display text-xs font-bold uppercase tracking-wider text-[var(--cobalt)]">
                                Jawaban Evaluasi Uraian (4 Soal PLSV &amp; PtLSV)
                              </div>
                              {creativeAns?.responses &&
                              Object.keys(creativeAns.responses).length > 0 ? (
                                <div className="mt-2 space-y-2 text-xs">
                                  {Object.entries(creativeAns.responses).map(
                                    ([k, v]) => (
                                      <div
                                        key={k}
                                        className="rounded bg-[var(--surface-muted)] p-2"
                                      >
                                        <span className="font-mono text-[10px] font-bold uppercase text-[var(--ink-subtle)]">
                                          {k}:
                                        </span>
                                        <p className="mt-0.5 whitespace-pre-wrap text-[var(--ink)]">
                                          {v || "(kosong)"}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="mt-2 text-xs text-[var(--ink-muted)]">
                                  Siswa belum mengumpulkan Evaluasi Uraian 4
                                  Soal.
                                </p>
                              )}
                            </div>

                            {/* LKS Reflections & Notes */}
                            <div className="rounded-lg border border-[var(--border)] bg-white p-3.5">
                              <div className="font-display text-xs font-bold uppercase tracking-wider text-[var(--emerald)]">
                                Ringkasan &amp; Refleksi LKPD (LKS 1–3)
                              </div>
                              {st.lkpdRows.length > 0 ? (
                                <div className="mt-2 space-y-2 text-xs">
                                  {st.lkpdRows.map((row) => {
                                    const ansObj = (row.answers ?? {}) as Record<
                                      string,
                                      unknown
                                    >;
                                    const kesimpulan =
                                      ansObj[`lks${row.stage_number}_kesimpulan`];
                                    const pertanyaan =
                                      ansObj[`lks${row.stage_number}_pertanyaan`];
                                    return (
                                      <div
                                        key={row.id}
                                        className="rounded bg-[var(--surface-muted)] p-2"
                                      >
                                        <div className="font-mono text-[11px] font-bold text-[var(--ink)]">
                                          LKS {row.stage_number} — Capaian{" "}
                                          {row.score}%
                                        </div>
                                        {typeof kesimpulan === "string" &&
                                          kesimpulan.trim() && (
                                            <p className="mt-1 text-[var(--ink)]">
                                              <strong>Kesimpulan:</strong>{" "}
                                              {kesimpulan}
                                            </p>
                                          )}
                                        {typeof pertanyaan === "string" &&
                                          pertanyaan.trim() && (
                                            <p className="mt-1 text-[var(--cobalt)]">
                                              <strong>Pertanyaan siswa:</strong>{" "}
                                              {pertanyaan}
                                            </p>
                                          )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="mt-2 text-xs text-[var(--ink-muted)]">
                                  Belum ada pengumpulan LKS 1–3.
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
