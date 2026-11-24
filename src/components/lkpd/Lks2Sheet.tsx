"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  LKS2_CONTENT,
  isAcceptedMathAnswer,
} from "@/lib/content/lkpd-user-content";
import {
  JajargenjangDiagram,
  KelilingBangunDiagram,
  NumberLineSvg,
  SegitigaPtLsvDiagram,
} from "@/components/math/CurriculumDiagrams";
import {
  PlsvClassifyBlock,
  ReflectionBlock,
  SectionBadge,
  StepAuditCard,
  YesNoChecklist,
} from "./LksSharedBlocks";

const ALIF_OPTIONS = ["x > 80", "x ≥ 80", "x ≤ 80", "x < 80"] as const;

export function Lks2Sheet({
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
      {/* Header */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="font-mono text-xs font-bold uppercase text-[var(--cobalt)]">
          {LKS2_CONTENT.code} · Materi PLSV &amp; Konsep PtLSV
        </div>
        <h2 className="mt-1 font-display text-xl font-bold text-[var(--ink)]">
          {LKS2_CONTENT.title}
        </h2>
        <div className="mt-3 rounded-lg bg-[var(--surface-muted)] p-3">
          <div className="font-mono text-[11px] font-bold uppercase text-[var(--ink-subtle)]">
            Tujuan Pembelajaran
          </div>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-[var(--ink)]">
            {LKS2_CONTENT.objectives.map((obj) => (
              <li key={obj}>{obj}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pengantar Kalung Emas Bu Ani */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <SectionBadge
          label="Pengantar Kontekstual"
          title={LKS2_CONTENT.introContext.title}
        />
        <p className="text-sm leading-relaxed text-[var(--ink)]">
          {LKS2_CONTENT.introContext.story}
        </p>
        <textarea
          rows={2}
          value={answers.lks2_intro ?? ""}
          onChange={(e) => setAnswer("lks2_intro", e.target.value)}
          placeholder="Tuliskan perhitunganmu untuk mengecek apakah benar 5 tahun..."
          className="mt-3 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs text-[var(--ink)]"
        />
        {checked && (
          <div className="mt-2 rounded-lg bg-[var(--cobalt-soft)]/70 p-3 text-xs text-[var(--ink)]">
            <strong>Pembahasan:</strong> {LKS2_CONTENT.introContext.feedback}
          </div>
        )}
      </section>

      {/* Ayo Mengingat Kembali */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <SectionBadge
          label="Ayo Mengingat Kembali"
          title="Klasifikasi PLSV & Audit Kesalahan Langkah"
        />
        <PlsvClassifyBlock
          items={LKS2_CONTENT.recallClassify}
          values={answers}
          onChange={setAnswer}
          checked={checked}
        />
        <StepAuditCard
          item={LKS2_CONTENT.recallErrorCase}
          verdict={answers.l2_err_recall_v ?? ""}
          reason={answers.l2_err_recall_r ?? ""}
          onVerdictChange={(v) => setAnswer("l2_err_recall_v", v)}
          onReasonChange={(r) => setAnswer("l2_err_recall_r", r)}
          checked={checked}
        />
      </section>

      {/* Ayo Mencari Tahu PLSV */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <SectionBadge
          label="Ayo Mencari Tahu (PLSV)"
          title="Tentukan Himpunan Penyelesaian & Uji Substitusi"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {LKS2_CONTENT.solvePractice.map((sp) => {
            const val = answers[sp.id] ?? "";
            const ok = isAcceptedMathAnswer(val, sp.acceptedAnswers);
            return (
              <div
                key={sp.id}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)]/60 p-4"
              >
                <div className="font-mono text-base font-bold text-[var(--ink)]">
                  {sp.equation}
                </div>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => setAnswer(sp.id, e.target.value)}
                  placeholder="Tulis nilai variabel..."
                  className="mt-2 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 font-mono text-sm"
                />
                {checked && (
                  <div
                    className={`mt-2 rounded-md p-2 text-xs ${
                      ok
                        ? "bg-[var(--emerald-soft)] text-[var(--emerald)]"
                        : "bg-[var(--vermilion-soft)] text-[var(--vermilion)]"
                    }`}
                  >
                    <strong>Kunci: {sp.canonicalAnswer}.</strong> {sp.steps}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Ayo Berdiskusi PLSV */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-5">
        <SectionBadge
          label="Ayo Berdiskusi (PLSV)"
          title="Temukan Kesalahan Langkah & Selesaikan Masalah Kontekstual"
        />

        <div className="space-y-3">
          {LKS2_CONTENT.errorAuditCases.map((c) => (
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

        {/* Soal 2: Jajargenjang 96 cm² */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/40 p-4">
          <div className="font-display text-sm font-bold text-[var(--ink)]">
            Soal 2 · Jajargenjang dari Persegi Panjang (Luas 96 cm²)
          </div>
          <div className="mt-2 grid items-center gap-4 md:grid-cols-12">
            <div className="md:col-span-5 flex justify-center rounded-lg border border-[var(--border-subtle)] bg-white p-2">
              <JajargenjangDiagram />
            </div>
            <div className="space-y-2 md:col-span-7">
              <p className="text-xs leading-relaxed text-[var(--ink)]">
                {LKS2_CONTENT.contextualDiskusi.jajargenjang.prompt}
              </p>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="lks2_jjg_x"
                  className="font-mono text-xs font-bold"
                >
                  Nilai x =
                </label>
                <input
                  id="lks2_jjg_x"
                  type="text"
                  value={answers.lks2_jjg_x ?? ""}
                  onChange={(e) => setAnswer("lks2_jjg_x", e.target.value)}
                  placeholder="cm"
                  className="w-24 rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 font-mono text-sm"
                />
                <span className="font-mono text-xs text-[var(--ink-muted)]">
                  cm
                </span>
              </div>
              <textarea
                rows={2}
                value={answers.lks2_jjg_work ?? ""}
                onChange={(e) => setAnswer("lks2_jjg_work", e.target.value)}
                placeholder="Tuliskan persamaan PLSV yang kamu temukan..."
                className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs"
              />
              {checked && (
                <div
                  className={`rounded-md p-2.5 text-xs ${
                    isAcceptedMathAnswer(
                      answers.lks2_jjg_x ?? "",
                      LKS2_CONTENT.contextualDiskusi.jajargenjang.acceptedX
                    )
                      ? "bg-[var(--emerald-soft)] text-[var(--emerald)]"
                      : "bg-[var(--ochre-bg)] text-[var(--ochre-ink)]"
                  }`}
                >
                  {LKS2_CONTENT.contextualDiskusi.jajargenjang.feedback}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Soal 3: Bank Sampah Lestari */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/40 p-4 space-y-2">
          <div className="font-display text-sm font-bold text-[var(--ink)]">
            Soal 3 · Bank Sampah Lestari Desa Makmur
          </div>
          <p className="text-xs leading-relaxed text-[var(--ink)]">
            {LKS2_CONTENT.contextualDiskusi.bankSampah.prompt}
          </p>
          <div className="flex items-center gap-2">
            <label
              htmlFor="lks2_sampah_k"
              className="font-mono text-xs font-bold"
            >
              Banyak keluarga =
            </label>
            <input
              id="lks2_sampah_k"
              type="text"
              value={answers.lks2_sampah_k ?? ""}
              onChange={(e) => setAnswer("lks2_sampah_k", e.target.value)}
              placeholder="angka"
              className="w-24 rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 font-mono text-sm"
            />
            <span className="text-xs text-[var(--ink-muted)]">keluarga</span>
          </div>
          {checked && (
            <div
              className={`rounded-md p-2.5 text-xs ${
                isAcceptedMathAnswer(
                  answers.lks2_sampah_k ?? "",
                  LKS2_CONTENT.contextualDiskusi.bankSampah.acceptedKeluarga
                )
                  ? "bg-[var(--emerald-soft)] text-[var(--emerald)]"
                  : "bg-[var(--ochre-bg)] text-[var(--ochre-ink)]"
              }`}
            >
              {LKS2_CONTENT.contextualDiskusi.bankSampah.feedback}
            </div>
          )}
        </div>
      </section>

      {/* KONSEP PtLSV */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-5">
        <SectionBadge
          label="Ayo Mengamati & Mencari Tahu · Konsep PtLSV"
          title="Tanda Pertidaksamaan (<, >, ≤, ≥) & 3 Cara Penyajian Himpunan Penyelesaian"
        />

        {/* Alif matching */}
        <div className="space-y-2.5">
          <h4 className="font-display text-sm font-bold text-[var(--ink)]">
            Pasangkan Pernyataan Nilai Ujian Alif dengan Bentuk PtLSV yang Tepat
          </h4>
          {LKS2_CONTENT.alifMatching.map((row) => {
            const picked = answers[row.id] ?? "";
            const ok = picked === row.expectedSymbol;
            return (
              <div
                key={row.id}
                className="rounded-lg border border-[var(--border)] bg-white p-3"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <p className="text-xs text-[var(--ink)] sm:text-sm">
                    {row.sentence}
                  </p>
                  <div className="flex shrink-0 flex-wrap gap-1.5">
                    {ALIF_OPTIONS.map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setAnswer(row.id, sym)}
                        className={`rounded-md border px-2.5 py-1 font-mono text-xs font-bold transition ${
                          picked === sym
                            ? "border-[var(--cobalt)] bg-[var(--cobalt)] text-white"
                            : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--ink)] hover:bg-[var(--cobalt-soft)]"
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
                {checked && (
                  <div
                    className={`mt-2 flex items-center gap-1.5 text-xs font-semibold ${
                      ok ? "text-[var(--emerald)]" : "text-[var(--vermilion)]"
                    }`}
                  >
                    {ok ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    Kunci: {row.expectedSymbol} → HP bilangan bulat: {row.hp}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Inequality signs checklist */}
        <YesNoChecklist
          items={LKS2_CONTENT.inequalitySignChecks}
          values={answers}
          onChange={setAnswer}
          checked={checked}
        />

        {/* 3 Cara Penyajian HP */}
        <div>
          <h4 className="mb-2 font-display text-sm font-bold text-[var(--ink)]">
            Tabel Penyajian Himpunan Penyelesaian PtLSV (3 Cara: Interval,
            Pembentuk Himpunan, Garis Bilangan)
          </h4>
          <div className="space-y-3">
            {LKS2_CONTENT.representationPractice.map((rep) => (
              <div
                key={rep.id}
                className="grid items-center gap-3 rounded-xl border border-[var(--border)] bg-white p-3.5 md:grid-cols-12"
              >
                <div className="md:col-span-2">
                  <span className="inline-block rounded-md bg-[var(--cobalt-soft)] px-2.5 py-1 font-mono text-sm font-bold text-[var(--cobalt)]">
                    {rep.inequality}
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 md:col-span-6">
                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase text-[var(--ink-subtle)]">
                      Notasi Interval
                    </label>
                    <input
                      type="text"
                      value={answers[`${rep.id}_int`] ?? ""}
                      onChange={(e) =>
                        setAnswer(`${rep.id}_int`, e.target.value)
                      }
                      placeholder="misal: [8, ∞)"
                      className="mt-1 w-full rounded border border-[var(--border)] px-2 py-1 font-mono text-xs"
                    />
                    {checked && (
                      <div className="mt-1 font-mono text-[11px] font-semibold text-[var(--emerald)]">
                        Kunci: {rep.expectedInterval}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase text-[var(--ink-subtle)]">
                      Pembentuk Himpunan
                    </label>
                    <input
                      type="text"
                      value={answers[`${rep.id}_set`] ?? ""}
                      onChange={(e) =>
                        setAnswer(`${rep.id}_set`, e.target.value)
                      }
                      placeholder="misal: {x | x ≥ 8}"
                      className="mt-1 w-full rounded border border-[var(--border)] px-2 py-1 font-mono text-xs"
                    />
                    {checked && (
                      <div className="mt-1 font-mono text-[11px] font-semibold text-[var(--emerald)]">
                        Kunci: {rep.expectedSetBuilder}
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-4 flex flex-col items-center">
                  <NumberLineSvg
                    boundaryLabel={rep.boundaryLabel}
                    op={rep.op}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ayo Berdiskusi PtLSV: Kutub Utara, Segitiga, Keliling */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-5">
        <SectionBadge
          label="Ayo Berdiskusi (PtLSV)"
          title="Memodelkan Fenomena Es Kutub Utara & Bangun Geometri"
        />

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)]/50 p-4">
          <div className="font-display text-sm font-bold text-[var(--ink)]">
            Fenomena Es Abadi Kutub Utara (Data NSIDC)
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[var(--ink)]">
            {LKS2_CONTENT.arcticAndGeometry.arcticStory}
          </p>
          <textarea
            rows={2}
            value={answers.lks2_arctic ?? ""}
            onChange={(e) => setAnswer("lks2_arctic", e.target.value)}
            placeholder="Tuliskan kalimat matematika PtLSV yang ditemukan pada berita di atas..."
            className="mt-2.5 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs"
          />
          {checked && (
            <div className="mt-2 rounded-md bg-[var(--emerald-soft)] p-2.5 text-xs text-[var(--emerald)]">
              {LKS2_CONTENT.arcticAndGeometry.arcticFeedback}
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Segitiga */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-4 space-y-2.5">
            <div className="flex justify-center">
              <SegitigaPtLsvDiagram />
            </div>
            <p className="text-xs font-medium text-[var(--ink)]">
              {LKS2_CONTENT.arcticAndGeometry.trianglePrompt}
            </p>
            <input
              type="text"
              value={answers.lks2_tri ?? ""}
              onChange={(e) => setAnswer("lks2_tri", e.target.value)}
              placeholder="Tuliskan bentuk PtLSV..."
              className="w-full rounded-lg border border-[var(--border)] px-3 py-1.5 font-mono text-xs"
            />
            {checked && (
              <div className="rounded-md bg-[var(--emerald-soft)] p-2 font-mono text-xs text-[var(--emerald)]">
                Kunci: {LKS2_CONTENT.arcticAndGeometry.triangleAnswer}
              </div>
            )}
          </div>

          {/* Keliling Bangun */}
          <div className="rounded-xl border border-[var(--border)] bg-white p-4 space-y-2.5">
            <div className="flex justify-center">
              <KelilingBangunDiagram />
            </div>
            <p className="text-xs font-medium text-[var(--ink)]">
              {LKS2_CONTENT.arcticAndGeometry.perimeterPrompt}
            </p>
            <input
              type="text"
              value={answers.lks2_perim ?? ""}
              onChange={(e) => setAnswer("lks2_perim", e.target.value)}
              placeholder="Tuliskan bentuk PtLSV..."
              className="w-full rounded-lg border border-[var(--border)] px-3 py-1.5 font-mono text-xs"
            />
            {checked && (
              <div className="rounded-md bg-[var(--emerald-soft)] p-2 font-mono text-xs text-[var(--emerald)]">
                Kunci: {LKS2_CONTENT.arcticAndGeometry.perimeterAnswer}
              </div>
            )}
          </div>
        </div>
      </section>

      <ReflectionBlock
        prefix="lks2"
        values={answers}
        onChange={setAnswer}
      />
    </div>
  );
}
