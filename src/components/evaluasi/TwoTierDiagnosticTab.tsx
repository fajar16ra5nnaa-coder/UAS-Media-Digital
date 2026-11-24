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

export function TwoTierDiagnosticTab() {
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

    const confidentWrong = graded.itemReviews.filter(
      (r) => r.tierStatus === "miskonsepsi"
    ).length;
    const dominantCat = (
      ["klasifikasional", "korelasional", "teoritikal"] as MisconceptionCategory[]
    )
      .map((c) => ({
        c,
        n: graded.categoryBreakdown[c].misconceptionCount,
      }))
      .sort((a, b) => b.n - a.n)[0];

    setSaving(true);
    try {
      const supabase = createClient();
      const summary = {
        mode: "two_tier_diagnostic",
        klasifikasional:
          graded.categoryBreakdown.klasifikasional.misconceptionCount,
        korelasional: graded.categoryBreakdown.korelasional.misconceptionCount,
        teoritikal: graded.categoryBreakdown.teoritikal.misconceptionCount,
        confidentWrong,
        dominantType: dominantCat && dominantCat.n > 0 ? dominantCat.c : null,
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
      if (error) {
        setSavedNotice(`Gagal menyimpan ke Supabase: ${error.message}`);
      } else {
        setSavedNotice(
          "Hasil evaluasi diagnostik 2-tier tersimpan ke Supabase dan langsung terlihat pada Panel Guru."
        );
      }
    } catch {
      setSavedNotice("Hasil tampil secara lokal.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setAnswers({});
    setReport(null);
    setSavedNotice(null);
    setErrorMsg(null);
    startTimeRef.current = Date.now();
  }

  if (report) {
    const confidentWrongCount = report.itemReviews.filter(
      (r) => r.tierStatus === "miskonsepsi"
    ).length;
    const dominantEntry = (
      ["klasifikasional", "korelasional", "teoritikal"] as MisconceptionCategory[]
    )
      .map((cat) => ({
        cat,
        count: report.categoryBreakdown[cat].misconceptionCount,
      }))
      .sort((a, b) => b.count - a.count)[0];
    const dominantMisconception =
      dominantEntry && dominantEntry.count > 0 ? dominantEntry.cat : null;

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--cobalt)]">
              Laporan Diagnostik Dua Tingkat (Sarla et al., 2025)
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-[var(--ink)]">
              Profil Pemahaman &amp; Peta Miskonsepsi PLSV ({report.predicate})
            </h2>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Ulangi Diagnostik
          </button>
        </div>

        {savedNotice && (
          <div className="rounded-lg border border-[var(--emerald)]/30 bg-[var(--emerald-soft)] px-4 py-2.5 text-xs font-medium text-[var(--emerald)]">
            {saving ? "Menyimpan..." : savedNotice}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="font-mono text-xs uppercase text-[var(--ink-subtle)]">
              Skor Total
            </div>
            <div className="mt-1 font-display text-4xl font-extrabold text-[var(--cobalt)]">
              {report.score}
              <span className="text-lg font-medium text-[var(--ink-subtle)]">
                /100
              </span>
            </div>
            <div className="mt-1 text-xs text-[var(--ink-muted)]">
              {report.correctCount} benar dari {report.totalQuestions} soal
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="font-mono text-xs uppercase text-[var(--ink-subtle)]">
              Miskonsepsi Terdeteksi
            </div>
            <div
              className={`mt-1 font-display text-4xl font-extrabold ${
                confidentWrongCount > 0
                  ? "text-[var(--vermilion)]"
                  : "text-[var(--emerald)]"
              }`}
            >
              {confidentWrongCount}
            </div>
            <div className="mt-1 text-xs text-[var(--ink-muted)]">
              Butir dijawab salah namun tingkat keyakinan &ldquo;Yakin&rdquo;
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="font-mono text-xs uppercase text-[var(--ink-subtle)]">
              Kategori Dominan
            </div>
            <div className="mt-1 font-display text-base font-bold text-[var(--ink)]">
              {dominantMisconception
                ? CATEGORY_LABELS[dominantMisconception]
                : "Tidak Ada Miskonsepsi Dominan"}
            </div>
            <div className="mt-1 text-xs text-[var(--ink-muted)]">
              Berdasarkan taksonomi Sarla et al. (2025)
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-display text-base font-bold text-[var(--ink)]">
            Rincian per Kategori Miskonsepsi
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {(
              [
                "klasifikasional",
                "korelasional",
                "teoritikal",
              ] as MisconceptionCategory[]
            ).map((cat) => {
              const info = report.categoryBreakdown[cat];
              return (
                <div
                  key={cat}
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-4"
                >
                  <div className="text-xs font-bold text-[var(--ink)]">
                    {CATEGORY_LABELS[cat]}
                  </div>
                  <div className="mt-2 flex items-baseline justify-between font-mono text-xs">
                    <span>
                      Benar: {info.correct}/{info.total} ({info.masteryPercent}%)
                    </span>
                    <span className="font-bold text-[var(--vermilion)]">
                      Salah+Yakin: {info.misconceptionCount}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full bg-[var(--cobalt)]"
                      style={{ width: `${info.masteryPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Remediation CTA */}
        <div className="rounded-xl border border-[var(--cobalt)]/30 bg-[var(--cobalt-soft)]/50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--cobalt)]" />
            <div className="space-y-2">
              <div className="font-display text-sm font-bold text-[var(--ink)]">
                Rekomendasi Tindak Lanjut
              </div>
              {report.remedialRecommendations.length > 0 ? (
                <ul className="list-disc space-y-1 pl-4 text-xs text-[var(--ink)]">
                  {report.remedialRecommendations.map((rec) => (
                    <li key={rec.category}>
                      <strong>{rec.title}:</strong> {rec.reason}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--ink)]">
                  Pemahaman konsep PLSV sudah sangat baik! Lanjutkan ke Evaluasi
                  Uraian 4 Soal untuk menguji kemampuan berpikir kreatif PLSV
                  &amp; PtLSV.
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href="/sandbox"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--cobalt)] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[var(--cobalt-hover)]"
                >
                  Uji Ulang di Lab Timbangan
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/lkpd"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                >
                  Review LKS 1–3
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Per-item review */}
        <div className="space-y-3">
          <h3 className="font-display text-lg font-bold text-[var(--ink)]">
            Pembahasan Butir Soal
          </h3>
          {report.itemReviews.map((res) => {
            const badge = TIER_BADGES[res.tierStatus];
            return (
              <div
                key={res.questionId}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--ink-subtle)]">
                    SOAL {res.number} · {CATEGORY_LABELS[res.category]}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badge.cls}`}
                  >
                    {badge.label}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-[var(--ink)]">
                  {res.prompt}
                </p>
                {res.equationDisplay && (
                  <div className="mt-1.5 inline-block rounded bg-[var(--surface-muted)] px-2.5 py-1 font-mono text-sm font-semibold text-[var(--ink)]">
                    {res.equationDisplay}
                  </div>
                )}

                <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                  <div
                    className={`flex items-start gap-1.5 rounded-lg p-2.5 ${
                      res.isCorrect
                        ? "bg-[var(--emerald-soft)] text-[var(--emerald)]"
                        : "bg-[var(--vermilion-soft)] text-[var(--vermilion)]"
                    }`}
                  >
                    {res.isCorrect ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold">Jawabanmu: </span>
                      {res.selectedLabel} ({res.confidence})
                    </div>
                  </div>
                  <div className="rounded-lg bg-[var(--surface-muted)] p-2.5 text-[var(--ink)]">
                    <span className="font-semibold">Kunci: </span>
                    {res.correctLabel}
                  </div>
                </div>

                {!res.isCorrect && (
                  <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-[var(--ochre-bg)] p-2.5 text-xs text-[var(--ochre-ink)]">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <strong>Feedback Miskonsepsi:</strong> {res.feedback}
                    </div>
                  </div>
                )}

                <div className="mt-2 rounded-lg bg-[var(--surface-muted)]/70 p-2.5 font-mono text-xs text-[var(--ink)]">
                  {res.equivalenceSteps.map((st, i) => (
                    <div key={i}>{st}</div>
                  ))}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">
                  <strong>Ringkasan Konsep:</strong> {res.conceptSummary}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--cobalt)]">
          Diagnostik Cepat 2-Tier · Taksonomi Miskonsepsi Sarla et al. (2025)
        </span>
        <h2 className="mt-1 font-display text-xl font-bold text-[var(--ink)]">
          10 Butir Diagnostik Pilihan Ganda + Tingkat Keyakinan
        </h2>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Untuk setiap soal, pilih jawaban terbaik lalu nyatakan tingkat
          keyakinanmu (<strong>Yakin</strong> atau <strong>Ragu</strong>) agar
          sistem dapat membedakan <em>paham konsep</em>, <em>menebak benar</em>,
          dan <em>miskonsepsi persisten</em>.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-[var(--vermilion)]/30 bg-[var(--vermilion-soft)] px-4 py-3 text-sm font-medium text-[var(--vermilion)]">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {DIAGNOSTIC_QUESTIONS.map((q, idx) => {
          const cur = answers[q.id];
          return (
            <div
              key={q.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-[var(--cobalt)]">
                  BUTIR {idx + 1} / {DIAGNOSTIC_QUESTIONS.length}
                </span>
                <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--ink-muted)]">
                  {CATEGORY_LABELS[q.category]}
                </span>
              </div>

              <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--ink)]">
                {q.prompt}
              </p>

              {q.equationDisplay && (
                <div className="mt-2 inline-block rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-1.5 font-mono text-base font-bold text-[var(--ink)]">
                  {q.equationDisplay}
                </div>
              )}

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.options.map((opt) => {
                  const selected = cur?.selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => selectOption(q.id, opt.id)}
                      className={`flex items-start gap-2.5 rounded-lg border p-3 text-left text-xs transition ${
                        selected
                          ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)] text-[var(--ink)] ring-1 ring-[var(--cobalt)]"
                          : "border-[var(--border)] bg-white text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[11px] font-bold uppercase ${
                          selected
                            ? "bg-[var(--cobalt)] text-white"
                            : "bg-[var(--surface-muted)] text-[var(--ink-muted)]"
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="leading-relaxed">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] pt-3">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-subtle)]">
                  Tingkat Keyakinan (Tier 2):
                </span>
                {(["yakin", "ragu"] as ConfidenceLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => selectConfidence(q.id, level)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      cur?.confidence === level
                        ? level === "yakin"
                          ? "border-[var(--emerald)] bg-[var(--emerald-soft)] text-[var(--emerald)]"
                          : "border-[var(--ochre-ink)] bg-[var(--ochre-bg)] text-[var(--ochre-ink)]"
                        : "border-[var(--border)] bg-white text-[var(--ink-muted)] hover:bg-[var(--surface-muted)]"
                    }`}
                  >
                    {level === "yakin" ? "Saya Yakin" : "Saya Masih Ragu"}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-4 shadow-sm backdrop-blur-xs">
          <div className="font-mono text-xs text-[var(--ink-muted)]">
            Terjawab:{" "}
            <strong className="text-[var(--ink)]">
              {answeredCount} / {DIAGNOSTIC_QUESTIONS.length}
            </strong>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--cobalt)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--cobalt-hover)] disabled:opacity-60"
          >
            <ClipboardCheck className="h-4 w-4" />
            Lihat Diagnosis Miskonsepsi
          </button>
        </div>
      </form>
    </div>
  );
}
