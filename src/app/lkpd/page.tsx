"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cloud,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  LKS1_CONTENT,
  LKS2_CONTENT,
  LKS3_CONTENT,
  LKS_SCAFFOLDING,
  isAcceptedMathAnswer,
} from "@/lib/content/lkpd-user-content";
import type { ScaffoldingLevel } from "@/lib/pedagogy/scaffolding";
import { Lks1Sheet } from "@/components/lkpd/Lks1Sheet";
import { Lks2Sheet } from "@/components/lkpd/Lks2Sheet";
import { Lks3Sheet } from "@/components/lkpd/Lks3Sheet";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";

type LksNumber = 1 | 2 | 3;

interface LksScaffoldingState {
  unlockedLevel: 0 | ScaffoldingLevel;
  counts: { level1: number; level2: number; level3: number };
}

function createInitialScaff(): LksScaffoldingState {
  return { unlockedLevel: 0, counts: { level1: 0, level2: 0, level3: 0 } };
}

const LKS_TABS: readonly {
  num: LksNumber;
  code: string;
  label: string;
  subtitle: string;
}[] = [
  {
    num: 1,
    code: LKS1_CONTENT.code,
    label: LKS1_CONTENT.shortTitle,
    subtitle: "Kalimat Terbuka, Ciri PLSV & Neraca Setimbang",
  },
  {
    num: 2,
    code: LKS2_CONTENT.code,
    label: LKS2_CONTENT.shortTitle,
    subtitle: "Audit PLSV, Geometri, Tanda PtLSV & 3 Cara HP",
  },
  {
    num: 3,
    code: LKS3_CONTENT.code,
    label: LKS3_CONTENT.shortTitle,
    subtitle: "Sifat Tanda Berbalik, Timbangan Telur & Limbah Pabrik",
  },
];

function computeLksScore(
  lks: LksNumber,
  ans: Record<string, string>
): number {
  let correct = 0;
  let total = 0;

  if (lks === 1) {
    for (const r of LKS1_CONTENT.recallItems) {
      total++;
      if (isAcceptedMathAnswer(ans[r.id] ?? "", r.acceptedAnswers)) correct++;
    }
    for (const s of [
      ...LKS1_CONTENT.agreementGroup1,
      ...LKS1_CONTENT.agreementGroup2,
      ...LKS1_CONTENT.definitionStatements,
      ...LKS1_CONTENT.equivalenceProperties,
    ]) {
      total++;
      if (ans[s.id] === s.expected) correct++;
    }
    for (const c of LKS1_CONTENT.plsvClassifyItems) {
      total++;
      if (ans[c.id] === (c.isPlsv ? "plsv" : "bukan")) correct++;
    }
    total++;
    if (isAcceptedMathAnswer(ans.lks1_neraca_x ?? "", ["1", "x=1"])) correct++;
  } else if (lks === 2) {
    for (const c of LKS2_CONTENT.recallClassify) {
      total++;
      if (ans[c.id] === (c.isPlsv ? "plsv" : "bukan")) correct++;
    }
    total++;
    if (ans.l2_err_recall_v === "salah") correct++;
    for (const sp of LKS2_CONTENT.solvePractice) {
      total++;
      if (isAcceptedMathAnswer(ans[sp.id] ?? "", sp.acceptedAnswers)) correct++;
    }
    for (const ea of LKS2_CONTENT.errorAuditCases) {
      total++;
      if (ans[`${ea.id}_v`] === "salah") correct++;
    }
    for (const al of LKS2_CONTENT.alifMatching) {
      total++;
      if (ans[al.id] === al.expectedSymbol) correct++;
    }
    for (const isc of LKS2_CONTENT.inequalitySignChecks) {
      total++;
      if (ans[isc.id] === isc.expected) correct++;
    }
    total++;
    if (
      isAcceptedMathAnswer(
        ans.lks2_jjg_x ?? "",
        LKS2_CONTENT.contextualDiskusi.jajargenjang.acceptedX
      )
    ) {
      correct++;
    }
    total++;
    if (
      isAcceptedMathAnswer(
        ans.lks2_sampah_k ?? "",
        LKS2_CONTENT.contextualDiskusi.bankSampah.acceptedKeluarga
      )
    ) {
      correct++;
    }
  } else {
    for (const ip of LKS3_CONTENT.inequalityProperties) {
      total++;
      if (ans[ip.id] === ip.expected) correct++;
    }
    total++;
    if (
      isAcceptedMathAnswer(
        ans.lks3_limbah_jam ?? "",
        LKS3_CONTENT.diskusiProblems.limbahPabrik.acceptedMaxHours
      )
    ) {
      correct++;
    }
    total++;
    if (
      isAcceptedMathAnswer(
        ans.lks3_pabrik_luas ?? "",
        LKS3_CONTENT.diskusiProblems.pabrikBaru.acceptedMaxArea
      )
    ) {
      correct++;
    }
    for (const k of [
      "lks3_intro",
      "lks3_recall",
      "lks3_eggs",
      "lks3_kesimpulan",
    ]) {
      total++;
      if ((ans[k] ?? "").trim().length >= 5) correct++;
    }
  }

  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

export default function LkpdPage() {
  const { user } = useAuth();
  const [activeLks, setActiveLks] = useState<LksNumber>(1);
  const [answersByLks, setAnswersByLks] = useState<
    Record<LksNumber, Record<string, string>>
  >({ 1: {}, 2: {}, 3: {} });
  const [checkedByLks, setCheckedByLks] = useState<Record<LksNumber, boolean>>({
    1: false,
    2: false,
    3: false,
  });
  const [completedLks, setCompletedLks] = useState<Record<LksNumber, boolean>>({
    1: false,
    2: false,
    3: false,
  });
  const [scoresByLks, setScoresByLks] = useState<
    Record<LksNumber, number | null>
  >({ 1: null, 2: null, 3: null });
  const [scaffoldingByLks, setScaffoldingByLks] = useState<
    Record<LksNumber, LksScaffoldingState>
  >({
    1: createInitialScaff(),
    2: createInitialScaff(),
    3: createInitialScaff(),
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const supabase = createClient();
    supabase
      .from("lkpd_submissions")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (!active || !data) return;
        const done: Record<LksNumber, boolean> = { 1: false, 2: false, 3: false };
        const scores: Record<LksNumber, number | null> = {
          1: null,
          2: null,
          3: null,
        };
        const restored: Record<LksNumber, Record<string, string>> = {
          1: {},
          2: {},
          3: {},
        };

        for (const row of data) {
          const stNum = Number(row.stage_number);
          if (stNum === 1 || stNum === 2 || stNum === 3) {
            const st: LksNumber = stNum;
            done[st] = Boolean(row.is_completed);
            scores[st] = typeof row.score === "number" ? row.score : null;
            if (row.answers && typeof row.answers === "object") {
              const strMap: Record<string, string> = {};
              for (const [k, v] of Object.entries(
                row.answers as Record<string, unknown>
              )) {
                if (typeof v === "string") strMap[k] = v;
              }
              restored[st] = strMap;
            }
          }
        }
        setCompletedLks(done);
        setScoresByLks(scores);
        setAnswersByLks((prev) => ({
          1: { ...restored[1], ...prev[1] },
          2: { ...restored[2], ...prev[2] },
          3: { ...restored[3], ...prev[3] },
        }));
      });
    return () => {
      active = false;
    };
  }, [user]);

  function setAnswer(key: string, val: string) {
    setAnswersByLks((prev) => ({
      ...prev,
      [activeLks]: { ...prev[activeLks], [key]: val },
    }));
  }

  function handleUnlockNextScaffolding() {
    setScaffoldingByLks((prev) => {
      const cur = prev[activeLks];
      if (cur.unlockedLevel >= 3) return prev;
      const next = (cur.unlockedLevel + 1) as ScaffoldingLevel;
      return {
        ...prev,
        [activeLks]: {
          unlockedLevel: next,
          counts: {
            level1: cur.counts.level1 + (next === 1 ? 1 : 0),
            level2: cur.counts.level2 + (next === 2 ? 1 : 0),
            level3: cur.counts.level3 + (next === 3 ? 1 : 0),
          },
        },
      };
    });
  }

  async function handleCheckAndSave() {
    const currentAnswers = answersByLks[activeLks];
    const score = computeLksScore(activeLks, currentAnswers);

    setCheckedByLks((prev) => ({ ...prev, [activeLks]: true }));
    setCompletedLks((prev) => ({ ...prev, [activeLks]: true }));
    setScoresByLks((prev) => ({ ...prev, [activeLks]: score }));
    setSaveMessage(null);

    if (!user) {
      setSaveMessage(
        `Feedback LKS ${activeLks} terbuka (capaian cek otomatis: ${score}%). Masuk akun untuk menyimpan lembar kerjamu ke Panel Guru.`
      );
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("lkpd_submissions").upsert(
        {
          user_id: user.id,
          stage_number: activeLks,
          answers: currentAnswers,
          scaffolding_used: scaffoldingByLks[activeLks].counts,
          score,
          is_completed: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,stage_number" }
      );
      if (error) {
        setSaveMessage(
          `Feedback terbuka, namun simpan awan gagal: ${error.message}`
        );
      } else {
        setSaveMessage(
          `LKS ${activeLks} tersimpan ke Supabase (capaian cek otomatis: ${score}%) dan dapat ditinjau Guru pada Panel Guru.`
        );
      }
    } catch {
      setSaveMessage("Feedback terbuka secara lokal.");
    } finally {
      setSaving(false);
    }
  }

  function handleResetLks() {
    setCheckedByLks((prev) => ({ ...prev, [activeLks]: false }));
    setSaveMessage(null);
  }

  const completedCount = Object.values(completedLks).filter(Boolean).length;
  const curScaff = scaffoldingByLks[activeLks];
  const curHints = LKS_SCAFFOLDING[activeLks];
  const hintTiers = [
    {
      level: 1 as const,
      tag: "Level 1 · Arahan Konseptual",
      title: "Petunjuk Fokus Konsep",
      body: curHints.level1,
    },
    {
      level: 2 as const,
      tag: "Level 2 · Strategi Pemodelan",
      title: "Bantuan Penyusunan Model",
      body: curHints.level2,
    },
    {
      level: 3 as const,
      tag: "Level 3 · Contoh Langkah Utuh",
      title: "Contoh Analog Terbimbing",
      body: curHints.level3,
    },
  ].filter((t) => t.level <= curScaff.unlockedLevel);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--cobalt)]">
            Modul 2 · LKPD Digital Interaktif (3 LKS · PLSV &amp; PtLSV)
          </span>
          <h1 className="mt-1 font-display text-2xl font-bold text-[var(--ink)] sm:text-3xl">
            Lembar Kerja Peserta Didik Digital
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            Alur inkuiri terstruktur: <em>Ayo Mengingat → Ayo Mengamati → Ayo
            Mencari Tahu → Ayo Berdiskusi → Ayo Menyimpulkan &amp; Bertanya</em>,
            dilengkapi scaffolding 3 level dan simpan progres otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2">
          <BookOpen className="h-4 w-4 text-[var(--cobalt)]" />
          <span className="font-mono text-xs font-semibold text-[var(--ink)]">
            Progres: {completedCount}/3 LKS
          </span>
        </div>
      </div>

      {/* 3-LKS Stepper Tabs */}
      <div className="mb-6 grid gap-2.5 md:grid-cols-3">
        {LKS_TABS.map((tab) => {
          const active = activeLks === tab.num;
          const done = completedLks[tab.num];
          const sc = scoresByLks[tab.num];
          return (
            <button
              key={tab.num}
              type="button"
              onClick={() => {
                setActiveLks(tab.num);
                setSaveMessage(null);
              }}
              className={`rounded-xl border p-3.5 text-left transition ${
                active
                  ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)]/70 ring-1 ring-[var(--cobalt)]"
                  : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold uppercase text-[var(--cobalt)]">
                  {tab.code}
                </span>
                {done && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--emerald-soft)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--emerald)]">
                    <CheckCircle2 className="h-3 w-3" />
                    {sc !== null ? `${sc}%` : "Tersimpan"}
                  </span>
                )}
              </div>
              <div className="mt-1 font-display text-sm font-bold text-[var(--ink)]">
                {tab.label}
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--ink-muted)]">
                {tab.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content + Sticky Scaffolding Sidebar */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {activeLks === 1 && (
            <Lks1Sheet
              answers={answersByLks[1]}
              setAnswer={setAnswer}
              checked={checkedByLks[1]}
            />
          )}
          {activeLks === 2 && (
            <Lks2Sheet
              answers={answersByLks[2]}
              setAnswer={setAnswer}
              checked={checkedByLks[2]}
            />
          )}
          {activeLks === 3 && (
            <Lks3Sheet
              answers={answersByLks[3]}
              setAnswer={setAnswer}
              checked={checkedByLks[3]}
            />
          )}

          {/* Action Bar */}
          <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            {saveMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-[var(--emerald)]/30 bg-[var(--emerald-soft)] px-3.5 py-2.5 text-xs font-medium text-[var(--emerald)]">
                <Cloud className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{saveMessage}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCheckAndSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--cobalt)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--cobalt-hover)] disabled:opacity-60"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {saving
                    ? "Menyimpan..."
                    : `Periksa Pembahasan & Simpan LKS ${activeLks}`}
                </button>
                {checkedByLks[activeLks] && (
                  <button
                    type="button"
                    onClick={handleResetLks}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Sembunyikan Pembahasan
                  </button>
                )}
              </div>

              {activeLks < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveLks((activeLks + 1) as LksNumber);
                    setSaveMessage(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--cobalt)]/30 bg-[var(--cobalt-soft)] px-3.5 py-2 text-xs font-semibold text-[var(--cobalt)] hover:bg-[var(--cobalt-soft)]/80"
                >
                  Lanjut ke LKS {activeLks + 1}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Link
                  href="/evaluasi"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--emerald)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                >
                  Lanjut ke Evaluasi (4 Soal)
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Scaffolding & Navigation Column */}
        <aside className="space-y-4 lg:col-span-4">
          <div className="space-y-4 lg:sticky lg:top-20">
            {/* 3-Level Contingent Scaffolding Drawer for LKS */}
            <div className="rounded-xl border border-[var(--ochre-border)] bg-[var(--ochre-bg)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/80 text-[var(--ochre-ink)]">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-[var(--ochre-ink)]">
                      Scaffolding LKS {activeLks}
                    </h3>
                    <p className="text-[11px] text-[var(--ochre-ink)]/80">
                      Petunjuk bertingkat 3 level (Anghileri, 2006)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                {curScaff.unlockedLevel < 3 ? (
                  <button
                    type="button"
                    onClick={handleUnlockNextScaffolding}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--ochre-ink)]/30 bg-white px-3 py-2 text-xs font-semibold text-[var(--ochre-ink)] transition hover:bg-[var(--ochre-ink)] hover:text-white"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    {curScaff.unlockedLevel === 0
                      ? "Minta Petunjuk Level 1"
                      : `Buka Petunjuk Level ${curScaff.unlockedLevel + 1}`}
                  </button>
                ) : (
                  <div className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-white/80 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-[var(--ochre-ink)]">
                    <Sparkles className="h-3 w-3" />
                    Semua 3 Level Petunjuk Terbuka
                  </div>
                )}
              </div>

              {hintTiers.length > 0 && (
                <div className="mt-3 space-y-2.5">
                  {hintTiers.map((tier) => (
                    <div
                      key={tier.level}
                      className="rounded-lg border border-[var(--ochre-border)] bg-white/95 p-3"
                    >
                      <span className="rounded bg-[var(--ochre-bg)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--ochre-ink)]">
                        {tier.tag}
                      </span>
                      <div className="mt-1 font-display text-xs font-bold text-[var(--ink)]">
                        {tier.title}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--ink-muted)]">
                        {tier.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--ink-subtle)]">
                Panduan Pengerjaan LKS
              </div>
              <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs text-[var(--ink-muted)]">
                <li>
                  Baca masalah kontekstual di awal LKS dan tuliskan dugaan
                  awalmu.
                </li>
                <li>
                  Kerjakan semua kotak isian, pilihan ceklis, dan uraian
                  diskusi.
                </li>
                <li>
                  Jika menemui kesulitan, buka{" "}
                  <strong>Scaffolding Bertingkat</strong> dari Level 1 ke Level
                  3 secara berurutan.
                </li>
                <li>
                  Tekan <strong>Periksa Pembahasan &amp; Simpan</strong> agar
                  hasilmu tercatat di Panel Guru.
                </li>
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
