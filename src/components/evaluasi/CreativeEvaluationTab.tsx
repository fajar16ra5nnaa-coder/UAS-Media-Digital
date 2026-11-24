"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  USER_EVALUATION_PROBLEMS,
  evaluateCreativeSubmission,
  type CreativeEvaluationSummary,
} from "@/lib/content/evaluasi-user-content";
import {
  BelahKetupatDiagram,
  KebunKolamDiagram,
  NumberLineSvg,
} from "@/components/math/CurriculumDiagrams";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";

export function CreativeEvaluationTab() {
  const { user } = useAuth();
  const startTimeRef = useRef<number>(Date.now());
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [verdicts, setVerdicts] = useState<Record<string, "ya" | "tidak">>({});
  const [quickChecks, setQuickChecks] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState<CreativeEvaluationSummary | null>(null);
  const [activeAltByProblem, setActiveAltByProblem] = useState<
    Record<string, number>
  >({
    eval1: 0,
    eval2: 0,
    eval3: 0,
    eval4: 0,
  });
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const evalSummary = evaluateCreativeSubmission(responses, quickChecks);
    if (evalSummary.answeredProblems === 0) {
      setErrorMsg(
        "Tuliskan jawabanmu minimal pada satu soal terlebih dahulu sebelum melihat pembahasan kunci jawaban."
      );
      return;
    }

    setSummary(evalSummary);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const durationSeconds = Math.max(
      1,
      Math.round((Date.now() - startTimeRef.current) / 1000)
    );

    if (!user) {
      setSaveNotice(
        "Feedback pembahasan lengkap sudah terbuka di bawah. Masuk akun jika ingin menyimpan jawaban uraianmu agar dapat dibaca Guru di Panel Guru."
      );
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const completionPct = Math.round(
        (evalSummary.answeredProblems / evalSummary.totalProblems) * 100
      );
      const { error } = await supabase.from("diagnostic_attempts").insert({
        user_id: user.id,
        answers: {
          mode: "creative_posttest",
          responses,
          verdicts,
          quickChecks,
        },
        score: completionPct,
        correct_count: evalSummary.matchedQuickChecks,
        total_questions: evalSummary.totalProblems,
        misconception_summary: {
          mode: "creative_posttest",
          klasifikasional: 0,
          korelasional: 0,
          teoritikal: 0,
          answeredProblems: evalSummary.answeredProblems,
          dominantType: null,
        },
        duration_seconds: durationSeconds,
      });

      if (error) {
        setSaveNotice(`Pembahasan terbuka (simpan awan gagal: ${error.message})`);
      } else {
        setSaveNotice(
          "Jawaban uraian Evaluasi PLSV & PtLSV tersimpan ke Supabase dan dapat ditinjau Guru pada Panel Guru."
        );
      }
    } catch {
      setSaveNotice("Pembahasan terbuka secara lokal.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setSubmitted(false);
    setSummary(null);
    setSaveNotice(null);
    setErrorMsg(null);
    startTimeRef.current = Date.now();
  }

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cobalt-soft)] px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase text-[var(--cobalt)]">
              <Sparkles className="h-3.5 w-3.5" />4 Soal Uraian Open-Ended · PLSV
              &amp; PtLSV
            </span>
            <h2 className="mt-2 font-display text-xl font-bold text-[var(--ink)]">
              Tes Evaluasi Kemampuan Berpikir Kreatif (PLSV &amp; PtLSV)
            </h2>
            <p className="mt-1 max-w-3xl text-sm text-[var(--ink-muted)]">
              Kerjakan keempat soal uraian berikut dengan caramu sendiri. Setiap
              soal dapat diselesaikan melalui <strong>lebih dari satu cara</strong>.
              Setelah menekan tombol kumpulkan, sistem langsung membuka{" "}
              <strong>Feedback Pembahasan Kunci Jawaban Multi-Alternatif</strong>{" "}
              untuk bahan refleksi mandiri.
            </p>
          </div>
          {submitted && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Edit / Kerjakan Ulang
            </button>
          )}
        </div>
      </div>

      {/* Post-Submit Feedback Header (No scoring rubric!) */}
      {submitted && summary && (
        <div className="rounded-xl border border-[var(--emerald)]/40 bg-[var(--emerald-soft)]/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--emerald)]">
                <BookOpenCheck className="h-5 w-5" />
                Feedback Pembahasan Terbuka — Bandingkan Strategimu dengan Kunci
                Jawaban!
              </div>
              <p className="mt-1 text-sm text-[var(--ink)]">
                Kamu telah menjawab{" "}
                <strong>
                  {summary.answeredProblems} dari {summary.totalProblems} soal
                </strong>
                . Tinjau setiap alternatif penyelesaian di bawah tiap soal —
                meskipun caramu berbeda dengan Alternatif 1, strategi lain yang
                logis dan setara secara matematis tetap valid!
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/lkpd"
                className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
              >
                Review LKPD (LKS 1–3)
              </Link>
              <Link
                href="/diskusi"
                className="rounded-lg bg-[var(--cobalt)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--cobalt-hover)]"
              >
                Diskusikan Cara Kreatifmu
              </Link>
            </div>
          </div>
          {saveNotice && (
            <div className="mt-3 rounded-lg border border-[var(--border)] bg-white/80 px-3 py-2 text-xs text-[var(--ink-muted)]">
              {saving ? "Menyimpan jawaban ke Supabase..." : saveNotice}
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-lg border border-[var(--vermilion)]/30 bg-[var(--vermilion-soft)] px-4 py-3 text-sm font-medium text-[var(--vermilion)]">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {USER_EVALUATION_PROBLEMS.map((problem) => {
          const activeAltIdx = activeAltByProblem[problem.id] ?? 0;
          const activeAlt =
            problem.alternatives[activeAltIdx] ?? problem.alternatives[0];
          const qcMatched = summary?.quickCheckMatches[problem.id];

          return (
            <section
              key={problem.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
            >
              {/* Problem Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[var(--ink)] px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                    SOAL {problem.number}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold ${
                      problem.topic === "PLSV"
                        ? "bg-[var(--cobalt-soft)] text-[var(--cobalt)]"
                        : "bg-[var(--ochre-bg)] text-[var(--ochre-ink)]"
                    }`}
                  >
                    {problem.topic}
                  </span>
                  <h3 className="font-display text-base font-bold text-[var(--ink)] sm:text-lg">
                    {problem.title}
                  </h3>
                </div>
              </div>

              {/* Problem Prompt + Optional Diagram */}
              <div className="mt-3 grid gap-4 md:grid-cols-12">
                <p
                  className={`text-sm leading-relaxed text-[var(--ink)] ${
                    problem.number === 2 || problem.number === 3
                      ? "md:col-span-7"
                      : "md:col-span-12"
                  }`}
                >
                  {problem.prompt}
                </p>

                {problem.number === 2 && (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)]/60 p-3 md:col-span-5">
                    <BelahKetupatDiagram variant="main" />
                    <span className="mt-1 font-mono text-[11px] text-[var(--ink-muted)]">
                      Luas persegi panjang = 56 cm² · 4 segitiga = 28 cm²
                    </span>
                  </div>
                )}

                {problem.number === 3 && (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)]/60 p-3 md:col-span-5">
                    <KebunKolamDiagram />
                    <span className="mt-1 font-mono text-[11px] text-[var(--ink-muted)]">
                      Ilustrasi kebun 20 m × 20 m &amp; kolam lebar 8 m
                    </span>
                  </div>
                )}
              </div>

              {/* Sub-question inputs */}
              <div className="mt-4 space-y-4">
                {problem.subQuestions.map((sq) => (
                  <div key={sq.key} className="space-y-2">
                    <label
                      htmlFor={sq.key}
                      className="block text-sm font-semibold text-[var(--ink)]"
                    >
                      {sq.label}
                    </label>

                    {sq.inputKind === "yesno_reason" && (
                      <div className="flex flex-wrap gap-2">
                        {(["ya", "tidak"] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              setVerdicts((prev) => ({
                                ...prev,
                                [sq.key]: opt,
                              }))
                            }
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                              verdicts[sq.key] === opt
                                ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)] text-[var(--cobalt)]"
                                : "border-[var(--border)] bg-white text-[var(--ink-muted)] hover:bg-[var(--surface-muted)]"
                            }`}
                          >
                            {opt === "ya" ? "Ya / Benar" : "Tidak / Tidak Benar"}
                          </button>
                        ))}
                      </div>
                    )}

                    <textarea
                      id={sq.key}
                      rows={3}
                      value={responses[sq.key] ?? ""}
                      onChange={(e) =>
                        setResponses((prev) => ({
                          ...prev,
                          [sq.key]: e.target.value,
                        }))
                      }
                      placeholder={sq.placeholder}
                      className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--cobalt)] focus:outline-none"
                    />
                  </div>
                ))}

                {/* Quick numeric summary check (optional helper for immediate self-check) */}
                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)]/60 p-3">
                  <label
                    htmlFor={problem.quickCheck.key}
                    className="text-xs font-semibold text-[var(--ink)]"
                  >
                    Ringkasan nilai akhir ({problem.quickCheck.label}):
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id={problem.quickCheck.key}
                      type="text"
                      value={quickChecks[problem.quickCheck.key] ?? ""}
                      onChange={(e) =>
                        setQuickChecks((prev) => ({
                          ...prev,
                          [problem.quickCheck.key]: e.target.value,
                        }))
                      }
                      placeholder="Angka..."
                      className="w-28 rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 font-mono text-sm focus:border-[var(--cobalt)] focus:outline-none"
                    />
                    <span className="font-mono text-xs text-[var(--ink-muted)]">
                      {problem.quickCheck.unit}
                    </span>
                  </div>
                  {submitted && (
                    <span
                      className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        qcMatched
                          ? "bg-[var(--emerald-soft)] text-[var(--emerald)]"
                          : "bg-[var(--ochre-bg)] text-[var(--ochre-ink)]"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Target kunci: {problem.quickCheck.expectedDisplay}
                    </span>
                  )}
                </div>
              </div>

              {/* FEEDBACK PEMBAHASAN (Kunci Jawaban Multi-Alternatif — Tanpa Pedoman Penskoran) */}
              {submitted && (
                <div className="mt-5 rounded-xl border border-[var(--cobalt)]/30 bg-[var(--cobalt-soft)]/35 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--cobalt)]">
                      <Lightbulb className="h-4 w-4" />
                      Feedback Pembahasan &amp; Alternatif Penyelesaian (Kunci
                      Jawaban)
                    </div>
                    <span className="font-mono text-[11px] text-[var(--ink-muted)]">
                      {problem.alternatives.length} cara / bagian pembahasan
                    </span>
                  </div>

                  {/* Alternative switcher */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {problem.alternatives.map((alt, idx) => (
                      <button
                        key={alt.title}
                        type="button"
                        onClick={() =>
                          setActiveAltByProblem((prev) => ({
                            ...prev,
                            [problem.id]: idx,
                          }))
                        }
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                          activeAltIdx === idx
                            ? "bg-[var(--cobalt)] text-white"
                            : "border border-[var(--border)] bg-white text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                        }`}
                      >
                        {alt.title.split("—")[0].trim()}
                      </button>
                    ))}
                  </div>

                  {/* Active Alternative Content */}
                  {activeAlt && (
                    <div className="mt-3 rounded-lg border border-[var(--border)] bg-white p-4">
                      <div className="font-display text-sm font-bold text-[var(--ink)]">
                        {activeAlt.title}
                      </div>

                      <div className="mt-2 grid gap-4 md:grid-cols-12">
                        <div
                          className={
                            activeAlt.diagramVariant
                              ? "space-y-2 md:col-span-7"
                              : "space-y-2 md:col-span-12"
                          }
                        >
                          <div>
                            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--ink-subtle)]">
                              Diketahui:
                            </div>
                            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-[var(--ink-muted)]">
                              {activeAlt.known.map((k) => (
                                <li key={k}>{k}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--ink-subtle)]">
                              Langkah Penyelesaian:
                            </div>
                            <div className="mt-1 space-y-1 rounded-md bg-[var(--surface-muted)] p-2.5 font-mono text-xs text-[var(--ink)]">
                              {activeAlt.steps.map((st, idx) => (
                                <div key={idx}>{st}</div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-md bg-[var(--emerald-soft)]/70 px-3 py-2 text-xs font-semibold text-[var(--emerald)]">
                            Kesimpulan: {activeAlt.conclusion}
                          </div>
                        </div>

                        {activeAlt.diagramVariant && (
                          <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)]/50 p-3 md:col-span-5">
                            <BelahKetupatDiagram
                              variant={activeAlt.diagramVariant}
                            />
                            <span className="mt-1 text-center font-mono text-[11px] text-[var(--ink-muted)]">
                              Visualisasi {activeAlt.title.split("—")[0].trim()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Number line feedback for Problem 4 */}
                      {problem.numberLineSummary && (
                        <div className="mt-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)]/60 p-3">
                          <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--cobalt)]">
                            Visualisasi 3 Cara Penyajian HP (Bagian b):
                          </div>
                          <div className="mt-2 grid items-center gap-3 sm:grid-cols-2">
                            <div className="space-y-1 font-mono text-xs text-[var(--ink)]">
                              <div>
                                <strong>Notasi Interval:</strong>{" "}
                                {problem.numberLineSummary.interval}
                              </div>
                              <div>
                                <strong>Pembentuk Himpunan:</strong>{" "}
                                {problem.numberLineSummary.setBuilder}
                              </div>
                            </div>
                            <div className="flex justify-center">
                              <NumberLineSvg
                                boundaryLabel={
                                  problem.numberLineSummary.boundaryLabel
                                }
                                op={problem.numberLineSummary.op}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}

        {/* Submit bar */}
        <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-4 shadow-sm backdrop-blur-xs">
          <div className="text-xs text-[var(--ink-muted)]">
            <strong className="text-[var(--ink)]">
              Evaluasi Uraian PLSV &amp; PtLSV (4 Soal)
            </strong>{" "}
            — Klik tombol di samping untuk menyimpan jawaban dan membuka kunci
            pembahasan multi-alternatif.
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--cobalt)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--cobalt-hover)] disabled:opacity-60"
          >
            <ClipboardCheck className="h-4 w-4" />
            {submitted
              ? "Perbarui Jawaban & Pembahasan"
              : "Kumpulkan & Lihat Feedback Pembahasan"}
          </button>
        </div>
      </form>
    </div>
  );
}
