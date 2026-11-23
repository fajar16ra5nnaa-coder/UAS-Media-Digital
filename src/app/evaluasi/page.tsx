"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { DIAGNOSTIC_QUESTIONS } from "@/lib/content/plsv-curriculum";
import {
  CATEGORY_LABELS,
  gradeDiagnosticAttempt,
  type ConfidenceLevel,
  type DiagnosticReport,
  type DiagnosticUserAnswer,
  type MisconceptionCategory,
} from "@/lib/pedagogy/diagnostic-engine";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";

const TIER_BADGES = {
  paham_konsep: {
    label: "Paham Konsep",
    cls: "bg-[var(--emerald-soft)] text-[var(--emerald)]",
  },
  tebak_benar: {
    label: "Benar (Masih Ragu)",
    cls: "bg-[var(--ochre-bg)] text-[var(--ochre-ink)]",
  },
  miskonsepsi: {
    label: "Miskonsepsi (Salah + Yakin)",
    cls: "bg-[var(--vermilion-soft)] text-[var(--vermilion)]",
  },
  tidak_paham: {
    label: "Belum Paham",
    cls: "bg-[var(--surface-muted)] text-[var(--ink-muted)]",
  },
} as const;

export default function EvaluasiPage() {
  const { user } = useAuth();
  const startTimeRef = useRef<number>(Date.now());
  const [answers, setAnswers] = useState<Record<string, DiagnosticUserAnswer>>(
    {}
  );
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const answeredCount = useMemo(
    () =>
      DIAGNOSTIC_QUESTIONS.filter(
        (q) => answers[q.id]?.selectedOptionId && answers[q.id]?.confidence
      ).length,
    [answers]
  );

  function selectOption(qId: string, optionId: string) {
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        selectedOptionId: optionId,
        confidence: prev[qId]?.confidence ?? "yakin",
      },
    }));
  }

  function selectConfidence(qId: string, confidence: ConfidenceLevel) {
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        selectedOptionId: prev[qId]?.selectedOptionId ?? "",
        confidence,
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (answeredCount < DIAGNOSTIC_QUESTIONS.length) {
      setErrorMsg(
        `Masih ada ${
          DIAGNOSTIC_QUESTIONS.length - answeredCount
        } butir soal yang belum dipilih jawabannya. Lengkapi semua 10 soal agar diagnosis miskonsepsi akurat.`
      );
      return;
    }

    const graded = gradeDiagnosticAttempt(DIAGNOSTIC_QUESTIONS, answers);
    setReport(graded);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const durationSeconds = Math.max(
      1,
      Math.round((Date.now() - startTimeRef.current) / 1000)
    );

    if (!user) {
      setSavedNotice(
        "Hasil diagnostik tampil instan di bawah. Masuk akun untuk menyimpan riwayat ke Panel Guru."
      );
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const summary = {
        klasifikasional:
          graded.categoryBreakdown.klasifikasional.misconceptionCount,
        korelasional: graded.categoryBreakdown.korelasional.misconceptionCount,
        teoritikal: graded.categoryBreakdown.teoritikal.misconceptionCount,
        confidentWrong: graded.itemReviews.filter(
          (i) => i.tierStatus === "miskonsepsi"
        ).length,
        dominantType:
          (["klasifikasional", "korelasional", "teoritikal"] as MisconceptionCategory[])
            .slice()
            .sort(
              (a, b) =>
                graded.categoryBreakdown[b].misconceptionCount -
                graded.categoryBreakdown[a].misconceptionCount
            )[0] ?? null,
      };

      const { error } = await supabase.from("diagnostic_attempts").insert({
        user_id: user.id,
        answers,
        score: graded.score,
        correct_count: graded.correctCount,
        total_questions: graded.totalQuestions,
        misconception_summary: summary,
        duration_seconds: durationSeconds,
      });

      setSavedNotice(
        error
          ? "Diagnosis berhasil dihitung, namun gagal menyimpan ke server."
          : "Hasil evaluasi & profil miskonsepsi tersimpan ke basis data Panel Guru."
      );
    } catch {
      setSavedNotice("Hasil diagnosis dihitung secara lokal.");
    } finally {
      setSaving(false);
    }
  }

  function handleRetry() {
    setAnswers({});
    setReport(null);
    setSavedNotice(null);
    setErrorMsg(null);
    startTimeRef.current = Date.now();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--cobalt)]">
          Modul 03 · Evaluasi Diagnostik Dua Tingkat (Sarla et al., 2025)
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-[var(--ink)]">
          Tes Diagnostik Miskonsepsi PLSV
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm text-[var(--ink-muted)]">
          Terdiri atas 10 butir diagnostik untuk memetakan tiga jenis
          miskonsepsi PLSV (<em>Klasifikasional</em>, <em>Korelasional</em>, dan{" "}
          <em>Teoritikal</em>). Pilih jawaban sekaligus tingkat keyakinanmu (
          <strong>Yakin</strong> atau <strong>Ragu-ragu</strong>) agar sistem
          dapat membedakan miskonsepsi dari ketidaktahuan biasa.
        </p>
      </div>

      {/* REPORT VIEW */}
      {report ? (
        <div className="mt-6 space-y-6">
          {savedNotice && (
            <div className="rounded-lg border border-[var(--emerald)]/30 bg-[var(--emerald-soft)] px-4 py-3 text-xs font-semibold text-[var(--emerald)]">
              {saving ? "Menyimpan ke basis data..." : savedNotice}
            </div>
          )}

          {/* Top Score Summary */}
          <div className="grid gap-4 md:grid-cols-12">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:col-span-5">
              <div className="font-mono text-xs font-semibold uppercase text-[var(--ink-subtle)]">
                Skor Diagnostik Instan
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-5xl font-extrabold text-[var(--cobalt)]">
                  {report.score}
                </span>
                <span className="font-mono text-sm text-[var(--ink-muted)]">
                  / 100 ({report.correctCount} dari {report.totalQuestions}{" "}
                  benar)
                </span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--cobalt-soft)] px-3 py-1 text-xs font-bold text-[var(--cobalt)]">
                <ShieldCheck className="h-3.5 w-3.5" />
                {report.predicate}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Ulangi Evaluasi
                </button>
                <Link
                  href="/kuis"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--cobalt)] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[var(--cobalt-hover)]"
                >
                  Coba Kuis Ketangkasan
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* 3 Misconception Categories */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 md:col-span-7">
              <h2 className="font-display text-base font-bold text-[var(--ink)]">
                Peta Penguasaan &amp; Miskonsepsi (Taksonomi Sarla et al., 2025)
              </h2>
              <div className="mt-4 space-y-3.5">
                {(
                  [
                    "klasifikasional",
                    "korelasional",
                    "teoritikal",
                  ] as MisconceptionCategory[]
                ).map((cat) => {
                  const s = report.categoryBreakdown[cat];
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[var(--ink)]">
                          {CATEGORY_LABELS[cat]}
                        </span>
                        <span className="font-mono font-bold text-[var(--ink-muted)]">
                          {s.correct}/{s.total} benar ({s.masteryPercent}%)
                        </span>
                      </div>
                      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
                        <div
                          className={`h-full rounded-full ${
                            s.masteryPercent >= 75
                              ? "bg-[var(--emerald)]"
                              : s.masteryPercent >= 50
                              ? "bg-[var(--cobalt)]"
                              : "bg-[var(--vermilion)]"
                          }`}
                          style={{ width: `${s.masteryPercent}%` }}
                        />
                      </div>
                      {s.misconceptionCount > 0 && (
                        <p className="mt-1 text-[11px] font-medium text-[var(--vermilion)]">
                          Terdeteksi {s.misconceptionCount} indikator
                          kekeliruan/miskonsepsi pada kategori ini.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Remedial Recommendations */}
          {report.remedialRecommendations.length > 0 && (
            <div className="rounded-xl border border-[var(--ochre-border)] bg-[var(--ochre-bg)] p-5">
              <div className="flex items-center gap-2 font-display text-base font-bold text-[var(--ochre-ink)]">
                <AlertTriangle className="h-4.5 w-4.5" />
                Rekomendasi Tindak Lanjut &amp; Remedial Terarah
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {report.remedialRecommendations.map((rec) => (
                  <div
                    key={rec.category}
                    className="flex flex-col justify-between rounded-lg border border-[var(--ochre-border)] bg-white p-4"
                  >
                    <div>
                      <div className="font-display text-sm font-bold text-[var(--ink)]">
                        {rec.title}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--ink-muted)]">
                        {rec.reason}
                      </p>
                    </div>
                    <Link
                      href={rec.href}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--cobalt)] hover:underline"
                    >
                      {rec.actionLabel}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed 10-Item Equivalence Review */}
          <div className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[var(--ink)]">
              Pembahasan Lengkap Berbasis Kesetaraan (↔)
            </h2>
            {report.itemReviews.map((item) => {
              const badge = TIER_BADGES[item.tierStatus];
              return (
                <article
                  key={item.questionId}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.isCorrect ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-[var(--emerald)]" />
                      ) : (
                        <XCircle className="h-4.5 w-4.5 text-[var(--vermilion)]" />
                      )}
                      <span className="font-mono text-xs font-bold text-[var(--ink-subtle)]">
                        SOAL #{item.number} · {item.category.toUpperCase()}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
                    {item.prompt}
                  </p>
                  {item.equationDisplay && (
                    <div className="mt-2 inline-block rounded-md bg-[var(--surface-muted)] px-3 py-1 font-mono text-base font-bold text-[var(--cobalt)]">
                      {item.equationDisplay}
                    </div>
                  )}

                  <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-2">
                      Jawabanmu:{" "}
                      <strong className="font-mono text-[var(--ink)]">
                        {item.selectedLabel}
                      </strong>{" "}
                      ({item.confidence === "yakin" ? "Yakin" : "Ragu-ragu"})
                    </div>
                    <div className="rounded-lg border border-[var(--emerald)]/30 bg-[var(--emerald-soft)]/60 px-3 py-2">
                      Kunci Benar:{" "}
                      <strong className="font-mono text-[var(--emerald)]">
                        {item.correctLabel}
                      </strong>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-[var(--ink-muted)]">
                    <strong>Umpan Balik:</strong> {item.feedback}
                  </p>

                  <div className="mt-3 rounded-lg bg-[var(--surface-muted)] p-3">
                    <div className="font-mono text-[11px] font-bold text-[var(--cobalt)]">
                      Langkah Setara (↔):
                    </div>
                    <ul className="mt-1 space-y-1 font-mono text-xs text-[var(--ink)]">
                      {item.equivalenceSteps.map((st) => (
                        <li key={st}>{st}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        /* TEST TAKING VIEW */
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Progress Sticky Bar */}
          <div className="sticky top-16 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-4.5 w-4.5 text-[var(--cobalt)]" />
              <span className="font-mono text-xs font-bold text-[var(--ink)]">
                Progres: {answeredCount} / {DIAGNOSTIC_QUESTIONS.length} soal
                terjawab
              </span>
            </div>
            <div className="h-2 w-40 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div
                className="h-full bg-[var(--cobalt)] transition-all"
                style={{
                  width: `${
                    (answeredCount / DIAGNOSTIC_QUESTIONS.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="rounded-lg border border-[var(--vermilion)]/30 bg-[var(--vermilion-soft)] px-4 py-3 text-xs font-semibold text-[var(--vermilion)]"
            >
              {errorMsg}
            </div>
          )}

          {DIAGNOSTIC_QUESTIONS.map((q) => {
            const ans = answers[q.id];
            return (
              <div
                key={q.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--cobalt)]">
                    SOAL {q.number} / {DIAGNOSTIC_QUESTIONS.length}
                  </span>
                  <span className="rounded bg-[var(--surface-muted)] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-[var(--ink-muted)]">
                    Level {q.cognitiveLevel} · {q.category}
                  </span>
                </div>

                <p className="mt-2.5 text-sm font-semibold leading-relaxed text-[var(--ink)]">
                  {q.prompt}
                </p>

                {q.equationDisplay && (
                  <div className="mt-3 inline-block rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-2 font-mono text-lg font-bold text-[var(--ink)]">
                    {q.equationDisplay}
                  </div>
                )}

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt) => {
                    const selected = ans?.selectedOptionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => selectOption(q.id, opt.id)}
                        className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-xs leading-relaxed transition ${
                          selected
                            ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)] font-semibold text-[var(--ink)] ring-1 ring-[var(--cobalt)]"
                            : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] hover:bg-[var(--surface-muted)]"
                        }`}
                      >
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[11px] font-bold uppercase bg-[var(--surface-muted)] text-[var(--ink)]">
                          {opt.id}
                        </span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tier 2 Confidence Selector */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3">
                  <span className="text-xs font-medium text-[var(--ink-muted)]">
                    Tingkat keyakinan atas jawabanmu (Tier 2):
                  </span>
                  <div className="inline-flex rounded-lg bg-[var(--surface-muted)] p-0.5">
                    <button
                      type="button"
                      onClick={() => selectConfidence(q.id, "yakin")}
                      className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                        (ans?.confidence ?? "yakin") === "yakin"
                          ? "bg-[var(--emerald)] text-white"
                          : "text-[var(--ink-muted)]"
                      }`}
                    >
                      Yakin
                    </button>
                    <button
                      type="button"
                      onClick={() => selectConfidence(q.id, "ragu")}
                      className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                        ans?.confidence === "ragu"
                          ? "bg-[var(--ochre-ink)] text-white"
                          : "text-[var(--ink-muted)]"
                      }`}
                    >
                      Ragu-ragu
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--cobalt)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--cobalt-hover)]"
            >
              Selesaikan &amp; Lihat Diagnosis Miskonsepsi
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
