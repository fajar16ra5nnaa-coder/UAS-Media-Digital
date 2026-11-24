"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Scale, XCircle } from "lucide-react";
import {
  LKS1_CONTENT,
  isAcceptedMathAnswer,
} from "@/lib/content/lkpd-user-content";
import { NeracaIllustration } from "@/components/math/CurriculumDiagrams";
import {
  PlsvClassifyBlock,
  ReflectionBlock,
  SectionBadge,
  StepAuditCard,
  YesNoChecklist,
} from "./LksSharedBlocks";

export function Lks1Sheet({
  answers,
  setAnswer,
  checked,
}: {
  answers: Record<string, string>;
  setAnswer: (key: string, val: string) => void;
  checked: boolean;
}) {
  return (
    <div className="space-y-7">
      {/* Header & Objectives */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="font-mono text-xs font-bold uppercase text-[var(--cobalt)]">
          {LKS1_CONTENT.code} · Materi PLSV
        </div>
        <h2 className="mt-1 font-display text-xl font-bold text-[var(--ink)]">
          {LKS1_CONTENT.title}
        </h2>
        <div className="mt-3 rounded-lg bg-[var(--surface-muted)] p-3">
          <div className="font-mono text-[11px] font-bold uppercase text-[var(--ink-subtle)]">
            Tujuan Pembelajaran
          </div>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-[var(--ink)]">
            {LKS1_CONTENT.objectives.map((obj) => (
              <li key={obj}>{obj}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pengantar Album rosie */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <SectionBadge
          label="Pengantar Kontekstual"
          title={LKS1_CONTENT.introContext.title}
        />
        <p className="text-sm leading-relaxed text-[var(--ink)]">
          {LKS1_CONTENT.introContext.story}
        </p>
        <textarea
          rows={2}
          value={answers.lks1_intro ?? ""}
          onChange={(e) => setAnswer("lks1_intro", e.target.value)}
          placeholder="Tuliskan pendapat awalmu: apakah Raya bisa membeli album rosie? Bagaimana cara menuliskannya dalam bentuk aljabar?"
          className="mt-3 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs text-[var(--ink)] focus:border-[var(--cobalt)] focus:outline-none"
        />
        {checked && (
          <div className="mt-2 rounded-lg bg-[var(--cobalt-soft)]/70 p-3 text-xs text-[var(--ink)]">
            <strong>Koneksi PLSV:</strong> {LKS1_CONTENT.introContext.modelHint}
          </div>
        )}
      </section>

      {/* Ayo Mengingat Kembali */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <SectionBadge
          label="Ayo Mengingat Kembali"
          title="Operasi Bilangan Bulat & Bentuk Aljabar"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {LKS1_CONTENT.recallItems.map((item) => {
            const val = answers[item.id] ?? "";
            const ok = isAcceptedMathAnswer(val, item.acceptedAnswers);
            return (
              <div
                key={item.id}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)]/60 p-3.5"
              >
                <div className="font-mono text-[11px] font-semibold text-[var(--ink-subtle)]">
                  {item.label}
                </div>
                <div className="mt-1 font-mono text-base font-bold text-[var(--ink)]">
                  {item.expression} = ?
                </div>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => setAnswer(item.id, e.target.value)}
                  placeholder="Tulis hasil..."
                  className="mt-2 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 font-mono text-sm focus:border-[var(--cobalt)] focus:outline-none"
                />
                {checked && (
                  <div
                    className={`mt-2 flex items-start gap-1.5 rounded-md p-2 text-xs ${
                      ok
                        ? "bg-[var(--emerald-soft)] text-[var(--emerald)]"
                        : "bg-[var(--vermilion-soft)] text-[var(--vermilion)]"
                    }`}
                  >
                    {ok ? (
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>
                      <strong>Kunci: {item.canonicalAnswer}.</strong>{" "}
                      {item.explanation}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Ayo Mengamati */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <SectionBadge
          label="Ayo Mengamati"
          title={LKS1_CONTENT.quizDialogueSummary.title}
        />
        <p className="text-xs leading-relaxed text-[var(--ink-muted)]">
          Cermati pengelompokan kalimat dari transkrip kuis{" "}
          <em>Jelajah Tata Surya</em> di bawah ini, lalu nyatakan apakah kamu
          setuju dengan kesimpulan sifat tiap kelompok kalimat:
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {LKS1_CONTENT.quizDialogueSummary.groups.map((grp) => (
            <div
              key={grp.heading}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)]/50 p-3"
            >
              <div className="font-display text-xs font-bold text-[var(--cobalt)]">
                {grp.heading}
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-[var(--ink)]">
                {grp.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <YesNoChecklist
          items={LKS1_CONTENT.agreementGroup1}
          values={answers}
          onChange={setAnswer}
          checked={checked}
        />
      </section>

      {/* Ayo Mencari Tahu */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-5">
        <SectionBadge
          label="Ayo Mencari Tahu"
          title="Kalimat Terbuka, Kalimat Tertutup, Himpunan Penyelesaian & Ciri PLSV"
        />

        {/* Open Sentence Table */}
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full min-w-[600px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)] font-mono text-[11px] uppercase text-[var(--ink-subtle)]">
                <th className="p-2.5">Pernyataan</th>
                <th className="p-2.5">Kalimat Terbuka</th>
                <th className="p-2.5">Variabel</th>
                <th className="p-2.5">Contoh Bernilai Benar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] bg-white">
              <tr className="bg-[var(--cobalt-soft)]/30">
                <td className="p-2.5 font-medium">
                  {LKS1_CONTENT.openSentenceExample.statement}{" "}
                  <span className="font-mono text-[10px] text-[var(--cobalt)]">
                    (Contoh)
                  </span>
                </td>
                <td className="p-2.5 font-mono font-bold">
                  {LKS1_CONTENT.openSentenceExample.formula}
                </td>
                <td className="p-2.5 font-mono font-bold">
                  {LKS1_CONTENT.openSentenceExample.variable}
                </td>
                <td className="p-2.5 font-mono">
                  {LKS1_CONTENT.openSentenceExample.trueClosed}
                </td>
              </tr>
              {LKS1_CONTENT.openSentenceTable.map((row) => {
                const formulaVal = answers[`${row.id}_f`] ?? "";
                const varVal = answers[`${row.id}_v`] ?? "";
                const formulaOk = isAcceptedMathAnswer(
                  formulaVal,
                  row.acceptedFormulas
                );
                const varOk =
                  varVal.trim().toLowerCase() === row.expectedVar.toLowerCase();

                return (
                  <tr key={row.id}>
                    <td className="p-2.5 text-[var(--ink)]">{row.statement}</td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={formulaVal}
                        onChange={(e) =>
                          setAnswer(`${row.id}_f`, e.target.value)
                        }
                        placeholder="misal: y + 2 > 15"
                        className="w-full rounded border border-[var(--border)] px-2 py-1 font-mono text-xs"
                      />
                      {checked && (
                        <div
                          className={`mt-1 text-[11px] font-semibold ${
                            formulaOk
                              ? "text-[var(--emerald)]"
                              : "text-[var(--vermilion)]"
                          }`}
                        >
                          Kunci: {row.expectedFormula}
                        </div>
                      )}
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={varVal}
                        onChange={(e) =>
                          setAnswer(`${row.id}_v`, e.target.value)
                        }
                        placeholder="huruf"
                        className="w-16 rounded border border-[var(--border)] px-2 py-1 font-mono text-xs"
                      />
                      {checked && (
                        <div
                          className={`mt-1 text-[11px] font-semibold ${
                            varOk
                              ? "text-[var(--emerald)]"
                              : "text-[var(--vermilion)]"
                          }`}
                        >
                          {row.expectedVar}
                        </div>
                      )}
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={answers[`${row.id}_t`] ?? ""}
                        onChange={(e) =>
                          setAnswer(`${row.id}_t`, e.target.value)
                        }
                        placeholder="ganti variabel..."
                        className="w-full rounded border border-[var(--border)] px-2 py-1 font-mono text-xs"
                      />
                      {checked && (
                        <div className="mt-1 text-[11px] text-[var(--ink-muted)]">
                          Contoh: {row.sampleTrue}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <YesNoChecklist
          items={LKS1_CONTENT.agreementGroup2}
          values={answers}
          onChange={setAnswer}
          checked={checked}
        />

        <div>
          <h4 className="mb-2 font-display text-sm font-bold text-[var(--ink)]">
            Identifikasi: Manakah yang Termasuk PLSV dan Bukan PLSV?
          </h4>
          <PlsvClassifyBlock
            items={LKS1_CONTENT.plsvClassifyItems}
            values={answers}
            onChange={setAnswer}
            checked={checked}
          />
        </div>

        <YesNoChecklist
          items={LKS1_CONTENT.definitionStatements}
          values={answers}
          onChange={setAnswer}
          checked={checked}
        />
      </section>

      {/* Ayo Berdiskusi: Neraca Setimbang */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <SectionBadge
            label="Ayo Berdiskusi · Analogi Neraca Setimbang"
            title="Menemukan Sifat Kesetaraan Kedua Ruas"
          />
          <Link
            href="/sandbox"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--cobalt)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--cobalt-hover)]"
          >
            <Scale className="h-3.5 w-3.5" />
            Uji di Lab Timbangan
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Visual Neraca 1: 2x + 3 = 4 + x */}
        <div className="grid gap-4 md:grid-cols-2">
          <NeracaIllustration
            leftBoxes={2}
            leftWeights={3}
            rightBoxes={1}
            rightWeights={4}
            caption="Neraca Latihan: 2x + 3 = x + 4"
          />
          <div className="flex flex-col justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)]/50 p-3.5">
            <div>
              <div className="font-display text-sm font-bold text-[var(--ink)]">
                Tentukan berat 1 kotak (x) pada neraca 2x + 3 = 4 + x
              </div>
              <p className="mt-1 text-xs text-[var(--ink-muted)]">
                Ambil 1 kotak (x) dari kedua piringan, lalu ambil 3 bandul dari
                kedua piringan agar tetap setimbang!
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <label
                  htmlFor="lks1_neraca_x"
                  className="font-mono text-xs font-bold text-[var(--ink)]"
                >
                  Nilai x =
                </label>
                <input
                  id="lks1_neraca_x"
                  type="text"
                  value={answers.lks1_neraca_x ?? ""}
                  onChange={(e) => setAnswer("lks1_neraca_x", e.target.value)}
                  placeholder="angka"
                  className="w-24 rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 font-mono text-sm"
                />
                <span className="text-xs text-[var(--ink-muted)]">bandul</span>
              </div>
            </div>
            {checked && (
              <div
                className={`mt-2 rounded-md p-2 text-xs ${
                  isAcceptedMathAnswer(answers.lks1_neraca_x ?? "", ["1", "x=1"])
                    ? "bg-[var(--emerald-soft)] text-[var(--emerald)]"
                    : "bg-[var(--vermilion-soft)] text-[var(--vermilion)]"
                }`}
              >
                <strong>Kunci: x = 1 bandul.</strong> 2x + 3 = 4 + x ↔ x + 3 = 4
                ↔ x = 1. Himpunan penyelesaian = {"{1}"}.
              </div>
            )}
          </div>
        </div>

        {/* Contoh Neraca Bola Basket (Fixed x = 6!) */}
        <div className="rounded-xl border border-[var(--cobalt)]/25 bg-[var(--cobalt-soft)]/30 p-4">
          <div className="font-display text-sm font-bold text-[var(--cobalt)]">
            Contoh Terbimbing: Neraca Bola Basket (2x + 3 = 9 + x)
          </div>
          <div className="mt-3 grid items-center gap-4 md:grid-cols-12">
            <div className="md:col-span-5">
              <NeracaIllustration
                leftBoxes={2}
                leftWeights={3}
                rightBoxes={1}
                rightWeights={9}
                boxLabel="B"
                caption="2 bola + 3 bandul = 1 bola + 9 bandul"
              />
            </div>
            <div className="space-y-1.5 md:col-span-7">
              <div className="rounded-lg bg-white p-3 font-mono text-xs text-[var(--ink)] space-y-1">
                {LKS1_CONTENT.basketballWorkedExample.steps.map((st, idx) => (
                  <div key={idx}>{st}</div>
                ))}
              </div>
              <p className="text-xs font-medium text-[var(--emerald)]">
                {LKS1_CONTENT.basketballWorkedExample.conclusion}
              </p>
            </div>
          </div>
        </div>

        {/* Step Review 2x + 18 = 12 - 4x and 9 - (1/3)y = 2 */}
        <div className="space-y-3">
          <h4 className="font-display text-sm font-bold text-[var(--ink)]">
            Analisis Langkah Penyelesaian PLSV Tanpa Neraca
          </h4>
          {LKS1_CONTENT.balanceStepReview.map((c) => (
            <StepAuditCard
              key={c.id}
              item={c}
              verdict={answers[`${c.id}_v`] ?? ""}
              reason={answers[`${c.id}_r`] ?? ""}
              onVerdictChange={(v) => setAnswer(`${c.id}_v`, v)}
              onReasonChange={(r) => setAnswer(`${c.id}_r`, r)}
              checked={checked}
            />
          ))}
        </div>

        {/* 4 Sifat Kesetaraan */}
        <div>
          <h4 className="mb-2 font-display text-sm font-bold text-[var(--ink)]">
            Cek Pemahaman: Sifat-Sifat Kesetaraan PLSV
          </h4>
          <YesNoChecklist
            items={LKS1_CONTENT.equivalenceProperties}
            values={answers}
            onChange={setAnswer}
            checked={checked}
          />
        </div>
      </section>

      <ReflectionBlock
        prefix="lks1"
        values={answers}
        onChange={setAnswer}
      />
    </div>
  );
}
