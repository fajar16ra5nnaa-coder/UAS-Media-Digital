"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cloud,
  Lightbulb,
  Save,
  Sparkles,
  XCircle,
} from "lucide-react";
import { LKPD_STAGES } from "@/lib/content/plsv-curriculum";
import { getFadingConfig, type ScaffoldingLevel } from "@/lib/pedagogy/scaffolding";
import { AlgebraBalanceLab } from "@/components/sandbox/AlgebraBalanceLab";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";

type StageNum = 1 | 2 | 3 | 4;

interface ScaffoldingCounts {
  level1: number;
  level2: number;
  level3: number;
}

export default function LkpdPage() {
  const { user } = useAuth();
  const [activeStage, setActiveStage] = useState<StageNum>(1);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [completedStages, setCompletedStages] = useState<Record<number, number>>(
    {}
  );
  const [scaffoldingLog, setScaffoldingLog] = useState<
    Record<number, ScaffoldingCounts>
  >({
    1: { level1: 0, level2: 0, level3: 0 },
    2: { level1: 0, level2: 0, level3: 0 },
    3: { level1: 0, level2: 0, level3: 0 },
    4: { level1: 0, level2: 0, level3: 0 },
  });

  // Stage 1 state: classification answers
  const [stage1Answers, setStage1Answers] = useState<
    Record<string, "plsv" | "bukan">
  >({});
  const [stage1Checked, setStage1Checked] = useState(false);

  // Stage 2 state: 3 embedded balance cases
  const [stage2CaseIdx, setStage2CaseIdx] = useState(0);
  const [stage2Solved, setStage2Solved] = useState<Record<string, boolean>>({});

  // Stage 3 state: contextual word problems
  const [stage3Model, setStage3Model] = useState<Record<string, string>>({});
  const [stage3X, setStage3X] = useState<Record<string, string>>({});
  const [stage3Final, setStage3Final] = useState<Record<string, string>>({});
  const [stage3HintOpen, setStage3HintOpen] = useState<Record<string, number>>(
    {}
  );
  const [stage3Checked, setStage3Checked] = useState(false);

  // Stage 4 state: HOTS error analysis + create problem
  const [stage4Line, setStage4Line] = useState<Record<string, number>>({});
  const [stage4Reason, setStage4Reason] = useState<Record<string, string>>({});
  const [stage4FixX, setStage4FixX] = useState<Record<string, string>>({});
  const [stage4Story, setStage4Story] = useState("");
  const [stage4Checked, setStage4Checked] = useState(false);

  const stage1 = LKPD_STAGES[0];
  const stage2 = LKPD_STAGES[1];
  const stage3 = LKPD_STAGES[2];
  const stage4 = LKPD_STAGES[3];
  const fading = getFadingConfig(activeStage);

  // Load saved LKPD progress from Supabase if authenticated
  useEffect(() => {
    if (!user) return;
    let active = true;
    const supabase = createClient();

    supabase
      .from("lkpd_submissions")
      .select("stage_number, score, is_completed, answers, scaffolding_used")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (!active || !data) return;
        const scores: Record<number, number> = {};
        for (const row of data) {
          if (row.is_completed) {
            scores[row.stage_number] = row.score;
          }
          if (row.stage_number === 1 && row.answers?.stage1Answers) {
            setStage1Answers(
              row.answers.stage1Answers as Record<string, "plsv" | "bukan">
            );
          }
          if (row.stage_number === 2 && row.answers?.stage2Solved) {
            setStage2Solved(row.answers.stage2Solved as Record<string, boolean>);
          }
          if (row.stage_number === 4 && typeof row.answers?.story === "string") {
            setStage4Story(row.answers.story);
          }
        }
        setCompletedStages(scores);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const recordScaffolding = useCallback(
    (stageNum: StageNum, level: ScaffoldingLevel) => {
      setScaffoldingLog((prev) => {
        const cur = prev[stageNum] ?? { level1: 0, level2: 0, level3: 0 };
        const key = `level${level}` as keyof ScaffoldingCounts;
        return {
          ...prev,
          [stageNum]: { ...cur, [key]: cur[key] + 1 },
        };
      });
    },
    []
  );

  async function saveStageProgress(
    stageNum: StageNum,
    score: number,
    answersPayload: Record<string, unknown>,
    isCompleted: boolean
  ) {
    setCompletedStages((prev) => ({ ...prev, [stageNum]: score }));
    setSaving(true);
    setSaveMessage(null);

    if (!user) {
      setSaving(false);
      setSaveMessage(
        `Tahap ${stageNum} dinilai (${score}/100). Masuk akun agar progres tersimpan ke basis data Guru.`
      );
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.from("lkpd_submissions").upsert(
        {
          user_id: user.id,
          stage_number: stageNum,
          answers: answersPayload,
          scaffolding_used: scaffoldingLog[stageNum] ?? {
            level1: 0,
            level2: 0,
            level3: 0,
          },
          score,
          is_completed: isCompleted,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,stage_number" }
      );

      if (error) {
        setSaveMessage(
          `Tahap ${stageNum} dinilai (${score}/100), namun gagal menyinkronkan ke server.`
        );
      } else {
        setSaveMessage(
          `Progres Tahap ${stageNum} tersimpan ke Supabase (Skor: ${score}/100).`
        );
      }
    } catch {
      setSaveMessage(`Tahap ${stageNum} dinilai (${score}/100) secara lokal.`);
    } finally {
      setSaving(false);
    }
  }

  // Grade Stage 1
  function handleGradeStage1() {
    setStage1Checked(true);
    let correct = 0;
    for (const card of stage1.classificationCards) {
      const ans = stage1Answers[card.id];
      if ((card.isPlsv && ans === "plsv") || (!card.isPlsv && ans === "bukan")) {
        correct++;
      }
    }
    const score = Math.round((correct / stage1.classificationCards.length) * 100);
    saveStageProgress(1, score, { stage1Answers }, true);
  }

  // Grade Stage 2
  function handleSaveStage2() {
    const solvedCount = stage2.balanceCases.filter((c) => stage2Solved[c.id]).length;
    const score = Math.round((solvedCount / stage2.balanceCases.length) * 100);
    saveStageProgress(2, score, { stage2Solved }, solvedCount > 0);
  }

  // Grade Stage 3
  function handleGradeStage3() {
    setStage3Checked(true);
    let points = 0;
    const maxPoints = stage3.problems.length * 3;
    for (const p of stage3.problems) {
      const chosen = p.modelOptions.find((o) => o.id === stage3Model[p.id]);
      if (chosen?.isCorrect) points++;
      if (Number(stage3X[p.id]) === p.expectedX) points++;
      if (Number(stage3Final[p.id]) === p.expectedFinalAnswer) points++;
    }
    const score = Math.round((points / maxPoints) * 100);
    saveStageProgress(
      3,
      score,
      { stage3Model, stage3X, stage3Final },
      true
    );
  }

  // Grade Stage 4
  function handleGradeStage4() {
    setStage4Checked(true);
    let points = 0;
    const maxPoints = stage4.errorCases.length * 3 + 2;
    for (const ec of stage4.errorCases) {
      if (stage4Line[ec.id] === ec.wrongLineNo) points++;
      const reason = ec.reasonOptions.find((r) => r.id === stage4Reason[ec.id]);
      if (reason?.isCorrect) points++;
      if (Number(stage4FixX[ec.id]) === ec.correctFinalX) points++;
    }
    // Check C6 story creation quality
    const storyClean = stage4Story.trim();
    if (storyClean.length >= 30) points++;
    if (
      storyClean.includes("3") &&
      (storyClean.includes("5") || storyClean.includes("20"))
    ) {
      points++;
    }
    const score = Math.round((points / maxPoints) * 100);
    saveStageProgress(
      4,
      score,
      { stage4Line, stage4Reason, stage4FixX, story: stage4Story },
      true
    );
  }

  const activeBalanceCase = stage2.balanceCases[stage2CaseIdx];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-5 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--cobalt)]">
            Modul 02 · LKPD Digital Interaktif (Inkuiri + Fading)
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-[var(--ink)]">
            Lembar Kerja Peserta Didik (PLSV)
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--ink-muted)]">
            Dirancang berjenjang dalam 4 tahap sesuai prinsip{" "}
            <em>progressive fading</em> (van de Pol et al., 2010): dari bantuan
            visual penuh di Tahap 1–2 hingga analisis HOTS mandiri di Tahap 4.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!user && (
            <Link
              href="/masuk"
              className="rounded-lg border border-[var(--ochre-border)] bg-[var(--ochre-bg)] px-3 py-2 text-xs font-semibold text-[var(--ochre-ink)]"
            >
              Masuk untuk simpan ke Panel Guru
            </Link>
          )}
        </div>
      </div>

      {/* 4-Stage Stepper */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {([1, 2, 3, 4] as const).map((num) => {
          const meta = LKPD_STAGES[num - 1];
          const f = getFadingConfig(num);
          const active = activeStage === num;
          const savedScore = completedStages[num];

          return (
            <button
              key={num}
              type="button"
              onClick={() => {
                setActiveStage(num);
                setSaveMessage(null);
              }}
              className={`flex flex-col justify-between rounded-xl border p-4 text-left transition ${
                active
                  ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)]/70 ring-1 ring-[var(--cobalt)]"
                  : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[var(--cobalt)]">
                    TAHAP 0{num}
                  </span>
                  {savedScore !== undefined ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--emerald-soft)] px-2 py-0.5 font-mono text-[11px] font-bold text-[var(--emerald)]">
                      <CheckCircle2 className="h-3 w-3" />
                      {savedScore}%
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-[var(--ink-subtle)]">
                      Maks L{f.maxHintLevel}
                    </span>
                  )}
                </div>
                <div className="mt-1.5 font-display text-sm font-bold text-[var(--ink)]">
                  {meta.title.replace(/^Tahap \d:\s*/, "")}
                </div>
              </div>
              <div className="mt-2 font-mono text-[10px] font-medium text-[var(--ink-muted)]">
                {f.fadingLabel}
              </div>
            </button>
          );
        })}
      </div>

      {/* Fading Status Strip */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--ochre-border)] bg-[var(--ochre-bg)] px-4 py-2.5 text-xs text-[var(--ochre-ink)]">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 shrink-0" />
          <span>
            <strong>Mode Fading Tahap {activeStage}:</strong> {fading.description}
          </span>
        </div>
        <span className="rounded bg-white/80 px-2 py-0.5 font-mono text-[11px] font-bold">
          Scaffolding Maks. Level {fading.maxHintLevel}
        </span>
      </div>

      {saveMessage && (
        <div
          role="status"
          className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--emerald)]/30 bg-[var(--emerald-soft)] px-4 py-3 text-xs font-semibold text-[var(--emerald)]"
        >
          <Cloud className="h-4 w-4 shrink-0" />
          {saveMessage}
        </div>
      )}

      {/* STAGE 1: CLASSIFICATION */}
      {activeStage === 1 && (
        <section className="mt-6 space-y-5">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-display text-xl font-bold text-[var(--ink)]">
              {stage1.title}
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              {stage1.subtitle} Tentukan apakah masing-masing kalimat matematika
              di bawah ini termasuk <strong>PLSV</strong> atau{" "}
              <strong>Bukan PLSV</strong>.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {stage1.classificationCards.map((card, idx) => {
                const chosen = stage1Answers[card.id];
                const isCorrect =
                  (card.isPlsv && chosen === "plsv") ||
                  (!card.isPlsv && chosen === "bukan");

                return (
                  <div
                    key={card.id}
                    className={`rounded-xl border p-4 transition ${
                      stage1Checked
                        ? isCorrect
                          ? "border-[var(--emerald)]/40 bg-[var(--emerald-soft)]/40"
                          : "border-[var(--vermilion)]/40 bg-[var(--vermilion-soft)]/40"
                        : "border-[var(--border)] bg-[var(--surface-muted)]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[var(--ink-subtle)]">
                        Kartu #{idx + 1}
                      </span>
                      {stage1Checked &&
                        (isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-[var(--emerald)]" />
                        ) : (
                          <XCircle className="h-4 w-4 text-[var(--vermilion)]" />
                        ))}
                    </div>
                    <div className="mt-2 font-mono text-lg font-bold text-[var(--ink)]">
                      {card.expression}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setStage1Answers((p) => ({ ...p, [card.id]: "plsv" }))
                        }
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                          chosen === "plsv"
                            ? "border-[var(--cobalt)] bg-[var(--cobalt)] text-white"
                            : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                        }`}
                      >
                        Termasuk PLSV
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setStage1Answers((p) => ({
                            ...p,
                            [card.id]: "bukan",
                          }))
                        }
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                          chosen === "bukan"
                            ? "border-[var(--ink)] bg-[var(--ink)] text-white"
                            : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                        }`}
                      >
                        Bukan PLSV
                      </button>
                    </div>
                    {stage1Checked && (
                      <p className="mt-2.5 text-xs leading-relaxed text-[var(--ink-muted)]">
                        {card.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
              <button
                type="button"
                disabled={saving}
                onClick={handleGradeStage1}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--cobalt)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--cobalt-hover)] disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Menyimpan..." : "Periksa & Simpan Tahap 1"}
              </button>
              <button
                type="button"
                onClick={() => setActiveStage(2)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--cobalt)] hover:underline"
              >
                Lanjut ke Tahap 2
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STAGE 2: EMBEDDED BALANCE INQUIRY */}
      {activeStage === 2 && (
        <section className="mt-6 space-y-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--ink)]">
                  {stage2.title}
                </h2>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  Selesaikan ketiga kasus timbangan di bawah ini untuk
                  menemukan pola operasi kedua ruas secara langsung.
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveStage2}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--emerald)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                <Save className="h-3.5 w-3.5" />
                Simpan Progres Tahap 2 (
                {stage2.balanceCases.filter((c) => stage2Solved[c.id]).length}/
                {stage2.balanceCases.length} Tuntas)
              </button>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {stage2.balanceCases.map((bc, i) => (
                <button
                  key={bc.id}
                  type="button"
                  onClick={() => setStage2CaseIdx(i)}
                  className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                    stage2CaseIdx === i
                      ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)] text-[var(--cobalt)]"
                      : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--ink)]"
                  }`}
                >
                  <span className="font-mono">{bc.title}</span>
                  {stage2Solved[bc.id] && (
                    <CheckCircle2 className="h-4 w-4 text-[var(--emerald)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <AlgebraBalanceLab
            compact
            leftX={activeBalanceCase.leftX}
            leftC={activeBalanceCase.leftC}
            rightX={activeBalanceCase.rightX}
            rightC={activeBalanceCase.rightC}
            missionLabel={`LKPD Tahap 2 · ${activeBalanceCase.title}`}
            missionDescription="Temukan nilai x dengan menjaga kedua ruas tetap seimbang (=)."
            maxHintLevel={fading.maxHintLevel}
            fadingBadge={fading.fadingLabel}
            onSolved={() =>
              setStage2Solved((p) => ({ ...p, [activeBalanceCase.id]: true }))
            }
            onHintUsed={(lvl) => recordScaffolding(2, lvl)}
          />
        </section>
      )}

      {/* STAGE 3: CONTEXTUAL WORD PROBLEMS (FADING LEVEL 2 MAX) */}
      {activeStage === 3 && (
        <section className="mt-6 space-y-5">
          {stage3.problems.map((prob, idx) => {
            const chosenModel = prob.modelOptions.find(
              (o) => o.id === stage3Model[prob.id]
            );
            const hintLvl = stage3HintOpen[prob.id] ?? 0;

            return (
              <div
                key={prob.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold uppercase text-[var(--cobalt)]">
                    Masalah Kontekstual 0{idx + 1} · {prob.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.min(2, hintLvl + 1) as 1 | 2;
                      setStage3HintOpen((p) => ({ ...p, [prob.id]: next }));
                      recordScaffolding(3, next);
                    }}
                    disabled={hintLvl >= 2}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--ochre-border)] bg-[var(--ochre-bg)] px-3 py-1 text-xs font-semibold text-[var(--ochre-ink)] disabled:opacity-50"
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                    {hintLvl === 0
                      ? "Bantuan Level 1"
                      : hintLvl === 1
                      ? "Bantuan Level 2 (Maks)"
                      : "Bantuan Maks (Fading L2)"}
                  </button>
                </div>

                <p className="mt-3 rounded-lg bg-[var(--surface-muted)] p-4 text-sm leading-relaxed text-[var(--ink)]">
                  {prob.story}
                </p>
                <p className="mt-2 font-mono text-xs text-[var(--ink-muted)]">
                  Pemisalan: {prob.variablePrompt}
                </p>

                {hintLvl >= 1 && (
                  <div className="mt-3 space-y-2 rounded-lg border border-[var(--ochre-border)] bg-[var(--ochre-bg)] p-3 text-xs text-[var(--ochre-ink)]">
                    <div>
                      <strong>Level 1 (Fokus Struktur):</strong> Identifikasi
                      besaran apa yang diketahui sebagai total di ruas kanan dan
                      bagaimana variabel <code className="font-mono">x</code>{" "}
                      menyusun ruas kiri.
                    </div>
                    {hintLvl >= 2 && (
                      <div>
                        <strong>Level 2 (Pertanyaan Reflektif):</strong> Setelah
                        memilih model PLSV, jika ada tanda kurung, apakah semua
                        suku di dalam kurung sudah dikalikan dengan bilangan di
                        depannya?
                      </div>
                    )}
                  </div>
                )}

                {/* Step 1: Choose Model */}
                <div className="mt-4">
                  <div className="mb-2 text-xs font-bold text-[var(--ink)]">
                    1. Pilih model persamaan PLSV yang tepat:
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {prob.modelOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setStage3Model((p) => ({ ...p, [prob.id]: opt.id }))
                        }
                        className={`rounded-lg border px-3 py-2.5 text-left font-mono text-xs font-bold transition ${
                          stage3Model[prob.id] === opt.id
                            ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)] text-[var(--cobalt)]"
                            : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {chosenModel && (
                    <p
                      className={`mt-2 text-xs font-medium ${
                        chosenModel.isCorrect
                          ? "text-[var(--emerald)]"
                          : "text-[var(--vermilion)]"
                      }`}
                    >
                      {chosenModel.hint}
                    </p>
                  )}
                </div>

                {/* Step 2 & 3: Solve x and Final Answer */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[var(--ink)]">
                      2. Tentukan nilai x ({prob.unitLabel}):
                    </label>
                    <input
                      type="number"
                      value={stage3X[prob.id] ?? ""}
                      onChange={(e) =>
                        setStage3X((p) => ({ ...p, [prob.id]: e.target.value }))
                      }
                      placeholder="Masukkan angka"
                      className="w-full rounded-lg border border-[var(--border)] px-3 py-2 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[var(--ink)]">
                      3. {prob.finalQuestion}
                    </label>
                    <input
                      type="number"
                      value={stage3Final[prob.id] ?? ""}
                      onChange={(e) =>
                        setStage3Final((p) => ({
                          ...p,
                          [prob.id]: e.target.value,
                        }))
                      }
                      placeholder="Masukkan jawaban akhir"
                      className="w-full rounded-lg border border-[var(--border)] px-3 py-2 font-mono text-sm"
                    />
                  </div>
                </div>

                {stage3Checked && (
                  <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-3.5">
                    <div className="font-mono text-xs font-bold text-[var(--cobalt)]">
                      Pembahasan Setara (↔):
                    </div>
                    <ul className="mt-1.5 space-y-1 font-mono text-xs text-[var(--ink)]">
                      {prob.steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <button
              type="button"
              disabled={saving}
              onClick={handleGradeStage3}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--cobalt)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--cobalt-hover)]"
            >
              <Save className="h-4 w-4" />
              Periksa &amp; Simpan Tahap 3
            </button>
            <button
              type="button"
              onClick={() => setActiveStage(4)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--cobalt)] hover:underline"
            >
              Lanjut ke Tahap 4 (HOTS)
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* STAGE 4: HOTS C4-C6 (ERROR ANALYSIS + PROBLEM CREATION) */}
      {activeStage === 4 && (
        <section className="mt-6 space-y-5">
          {stage4.errorCases.map((ec, idx) => (
            <div
              key={ec.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <span className="font-mono text-xs font-bold uppercase text-[var(--vermilion)]">
                Analisis Kesalahan (HOTS C4–C5) · Kasus 0{idx + 1}
              </span>
              <h3 className="mt-1 font-display text-lg font-bold text-[var(--ink)]">
                Periksa Pekerjaan {ec.studentName}:{" "}
                <code className="font-mono text-[var(--cobalt)]">
                  {ec.problemText}
                </code>
              </h3>

              {/* Clickable step lines */}
              <div className="mt-3">
                <div className="mb-2 text-xs font-semibold text-[var(--ink-muted)]">
                  1. Klik baris langkah yang pertama kali mengandung kesalahan:
                </div>
                <div className="space-y-1.5">
                  {ec.lines.map((line) => {
                    const selected = stage4Line[ec.id] === line.lineNo;
                    return (
                      <button
                        key={line.lineNo}
                        type="button"
                        onClick={() =>
                          setStage4Line((p) => ({
                            ...p,
                            [ec.id]: line.lineNo,
                          }))
                        }
                        className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-2 text-left font-mono text-sm transition ${
                          selected
                            ? "border-[var(--vermilion)] bg-[var(--vermilion-soft)] font-bold text-[var(--vermilion)]"
                            : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--ink)] hover:bg-white"
                        }`}
                      >
                        <span className="text-xs opacity-65">
                          Baris {line.lineNo}
                        </span>
                        <span>{line.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reason choice */}
              <div className="mt-4">
                <div className="mb-2 text-xs font-semibold text-[var(--ink-muted)]">
                  2. Pilih penjelasan matematis mengapa baris tersebut keliru:
                </div>
                <div className="space-y-2">
                  {ec.reasonOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setStage4Reason((p) => ({ ...p, [ec.id]: opt.id }))
                      }
                      className={`block w-full rounded-lg border px-3.5 py-2.5 text-left text-xs leading-relaxed transition ${
                        stage4Reason[ec.id] === opt.id
                          ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)] font-semibold text-[var(--ink)]"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] hover:bg-[var(--surface-muted)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Corrected x */}
              <div className="mt-4 max-w-xs">
                <label className="mb-1 block text-xs font-semibold text-[var(--ink-muted)]">
                  3. Nilai x yang benar seharusnya:
                </label>
                <input
                  type="number"
                  value={stage4FixX[ec.id] ?? ""}
                  onChange={(e) =>
                    setStage4FixX((p) => ({ ...p, [ec.id]: e.target.value }))
                  }
                  placeholder="Masukkan nilai x"
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 font-mono text-sm"
                />
              </div>

              {stage4Checked && (
                <div className="mt-4 rounded-lg border border-[var(--emerald)]/30 bg-[var(--emerald-soft)] p-3 font-mono text-xs text-[var(--emerald)]">
                  <strong>Koreksi Setara:</strong> {ec.explanation} (Baris
                  keliru: Baris {ec.wrongLineNo}, nilai x benar ={" "}
                  {ec.correctFinalX})
                </div>
              )}
            </div>
          ))}

          {/* C6 Create Own Word Problem */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--emerald)]" />
              <span className="font-mono text-xs font-bold uppercase text-[var(--emerald)]">
                Mencipta Soal (HOTS C6)
              </span>
            </div>
            <h3 className="mt-1 font-display text-lg font-bold text-[var(--ink)]">
              Buat Soal Cerita Sendiri untuk Persamaan{" "}
              <code className="font-mono text-[var(--cobalt)]">
                {stage4.createProblemTarget}
              </code>
            </h3>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              Tuliskan satu permasalahan kehidupan sehari-hari (belanja,
              tabungan, panjang pita, dll.) yang model matematikanya tepat{" "}
              <code className="font-mono font-bold">3x + 5 = 20</code> sehingga
              solusinya <code className="font-mono font-bold">x = 5</code>.
            </p>
            <textarea
              rows={4}
              value={stage4Story}
              onChange={(e) => setStage4Story(e.target.value)}
              placeholder="Contoh: Dini membeli 3 kotak pensil dengan harga sama dan 1 penggaris seharga Rp5.000. Total belanjanya Rp20.000. Berapa harga 1 kotak pensil?"
              className="mt-3 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--ink)] focus:border-[var(--cobalt)] focus:outline-none"
            />
            <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[var(--ink-muted)]">
              <span>
                Panjang cerita:{" "}
                <strong className="font-mono">{stage4Story.trim().length}</strong>{" "}
                karakter (min. 30)
              </span>
              <span>
                Memuat koefisien 3 &amp; konstanta 5/20:{" "}
                <strong>
                  {stage4Story.includes("3") &&
                  (stage4Story.includes("5") || stage4Story.includes("20"))
                    ? "Terdeteksi ✓"
                    : "Belum lengkap"}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <button
              type="button"
              disabled={saving}
              onClick={handleGradeStage4}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--emerald)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              <Save className="h-4 w-4" />
              Periksa &amp; Simpan Tahap 4
            </button>
            <Link
              href="/evaluasi"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--cobalt)]"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Lanjut ke Evaluasi Diagnostik
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
