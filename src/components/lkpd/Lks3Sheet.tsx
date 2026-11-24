"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  LKS3_CONTENT,
  isAcceptedMathAnswer,
} from "@/lib/content/lkpd-user-content";
import {
  NumberLineSvg,
  TimbanganTelurDiagram,
} from "@/components/math/CurriculumDiagrams";
import {
  ReflectionBlock,
  SectionBadge,
  YesNoChecklist,
} from "./LksSharedBlocks";

export function Lks3Sheet({
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
          {LKS3_CONTENT.code} · Materi Penyelesaian PtLSV
        </div>
        <h2 className="mt-1 font-display text-xl font-bold text-[var(--ink)]">
          {LKS3_CONTENT.title}
        </h2>
        <div className="mt-3 rounded-lg bg-[var(--surface-muted)] p-3">
          <div className="font-mono text-[11px] font-bold uppercase text-[var(--ink-subtle)]">
            Tujuan Pembelajaran
          </div>
          <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-[var(--ink)]">
            {LKS3_CONTENT.objectives.map((obj) => (
              <li key={obj}>{obj}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pengantar Ojek Online Bu Ani */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <SectionBadge
          label="Pengantar Kontekstual"
          title={LKS3_CONTENT.introContext.title}
        />
        <p className="text-sm leading-relaxed text-[var(--ink)]">
          {LKS3_CONTENT.introContext.story}
        </p>
        <textarea
          rows={2}
          value={answers.lks3_intro ?? ""}
          onChange={(e) => setAnswer("lks3_intro", e.target.value)}
          placeholder="Menurutmu, apakah Rp50.000 cukup? Tuliskan alasan matematismu..."
          className="mt-3 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs"
        />
        {checked && (
          <div className="mt-2 rounded-lg bg-[var(--cobalt-soft)]/70 p-3 text-xs text-[var(--ink)]">
            <strong>Pembahasan:</strong> {LKS3_CONTENT.introContext.feedback}
          </div>
        )}
      </section>

      {/* Ayo Mengingat Kembali */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
        <SectionBadge
          label="Ayo Mengingat Kembali"
          title="Menyatakan Syarat Remedial dalam 3 Cara"
        />
        <p className="text-sm text-[var(--ink)]">{LKS3_CONTENT.recallPrompt}</p>
        <textarea
          rows={3}
          value={answers.lks3_recall ?? ""}
          onChange={(e) => setAnswer("lks3_recall", e.target.value)}
          placeholder="Model PtLSV: ...\n1. Notasi interval: ...\n2. Pembentuk himpunan: ...\n3. Garis bilangan: ..."
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs"
        />
        {checked && (
          <div className="grid items-center gap-3 rounded-lg bg-[var(--emerald-soft)]/70 p-3 sm:grid-cols-12">
            <p className="text-xs text-[var(--emerald)] sm:col-span-7">
              {LKS3_CONTENT.recallFeedback}
            </p>
            <div className="flex justify-center sm:col-span-5">
              <NumberLineSvg boundaryLabel="75" op="<=" />
            </div>
          </div>
        )}
      </section>

      {/* Ayo Mengamati: Sifat Ketidaksamaan & Tanda Berbalik */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <SectionBadge
          label="Ayo Mengamati"
          title="Kapan Tanda Pertidaksamaan Berubah Arah?"
        />
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full min-w-[540px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)] font-mono text-[11px] uppercase text-[var(--ink-subtle)]">
                <th className="p-2.5">Operasi Kedua Ruas</th>
                <th className="p-2.5">Contoh Tanda &lt;</th>
                <th className="p-2.5">Contoh Tanda &gt;</th>
                <th className="p-2.5">Arah Tanda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] bg-white font-mono">
              {LKS3_CONTENT.observationPatterns.map((p) => (
                <tr
                  key={p.op}
                  className={p.signChanged ? "bg-[var(--vermilion-soft)]/50" : ""}
                >
                  <td className="p-2.5 font-sans font-semibold text-[var(--ink)]">
                    {p.op}
                  </td>
                  <td className="p-2.5">{p.left}</td>
                  <td className="p-2.5">{p.right}</td>
                  <td className="p-2.5">
                    {p.signChanged ? (
                      <span className="inline-flex items-center gap-1 rounded bg-[var(--vermilion)] px-2 py-0.5 font-sans text-[11px] font-bold text-white">
                        <AlertTriangle className="h-3 w-3" />
                        BERBALIK!
                      </span>
                    ) : (
                      <span className="rounded bg-[var(--emerald-soft)] px-2 py-0.5 font-sans text-[11px] font-bold text-[var(--emerald)]">
                        Tetap
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <YesNoChecklist
          items={LKS3_CONTENT.inequalityProperties}
          values={answers}
          onChange={setAnswer}
          checked={checked}
        />
      </section>

      {/* Ayo Mencari Tahu: Timbangan 5 Butir Telur Ana */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-4">
        <SectionBadge
          label="Ayo Mencari Tahu"
          title="Eksplorasi Timbangan Tradisional: 5 Butir Telur Ana"
        />
        <p className="text-sm leading-relaxed text-[var(--ink)]">
          {LKS3_CONTENT.anaEggsProblem.story}
        </p>
        <TimbanganTelurDiagram />
        <textarea
          rows={2}
          value={answers.lks3_eggs ?? ""}
          onChange={(e) => setAnswer("lks3_eggs", e.target.value)}
          placeholder="Tuliskan pertidaksamaan berat 5 butir telur dan perkiraan berat 1 butir telur..."
          className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs"
        />
        {checked && (
          <div className="rounded-lg bg-[var(--emerald-soft)] p-3 text-xs text-[var(--emerald)]">
            <strong>Pembahasan:</strong> {LKS3_CONTENT.anaEggsProblem.feedback}
          </div>
        )}
      </section>

      {/* Ayo Berdiskusi: Pabrik Limbah Cair & Pabrik Baru */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-5">
        <SectionBadge
          label="Ayo Berdiskusi"
          title="Aplikasi PtLSV pada Masalah Lingkungan & Perancangan Lahan"
        />

        {/* Problem 1: Limbah Cair */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/40 p-4 space-y-3">
          <div className="font-display text-sm font-bold text-[var(--ink)]">
            Masalah 1 · Pengelolaan Limbah Cair Pabrik (Maksimal 410 Liter / 5
            Hari)
          </div>
          <p className="text-xs leading-relaxed text-[var(--ink)]">
            {LKS3_CONTENT.diskusiProblems.limbahPabrik.story}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor="lks3_limbah_jam"
              className="font-mono text-xs font-bold"
            >
              Maksimal jam operasi per hari =
            </label>
            <input
              id="lks3_limbah_jam"
              type="text"
              value={answers.lks3_limbah_jam ?? ""}
              onChange={(e) => setAnswer("lks3_limbah_jam", e.target.value)}
              placeholder="angka"
              className="w-24 rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 font-mono text-sm"
            />
            <span className="text-xs text-[var(--ink-muted)]">jam/hari</span>
          </div>
          <textarea
            rows={3}
            value={answers.lks3_limbah_work ?? ""}
            onChange={(e) => setAnswer("lks3_limbah_work", e.target.value)}
            placeholder="a) Bentuk PtLSV durasi per hari...\nb) 3 cara penyajian himpunan penyelesaian...\nc) Apakah 8 jam/hari membuat kualitas air memburuk?"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs"
          />
          {checked && (
            <div className="grid items-center gap-3 rounded-lg bg-[var(--emerald-soft)]/70 p-3 sm:grid-cols-12">
              <div className="text-xs text-[var(--emerald)] sm:col-span-7">
                <strong>
                  {isAcceptedMathAnswer(
                    answers.lks3_limbah_jam ?? "",
                    LKS3_CONTENT.diskusiProblems.limbahPabrik.acceptedMaxHours
                  )
                    ? "Tepat (maks 5 jam/hari)!"
                    : "Kunci: maksimal 5 jam/hari."}
                </strong>{" "}
                {LKS3_CONTENT.diskusiProblems.limbahPabrik.feedback}
              </div>
              <div className="flex justify-center sm:col-span-5">
                <NumberLineSvg boundaryLabel="5" op="<=" />
              </div>
            </div>
          )}
        </div>

        {/* Problem 2: Pabrik Baru */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/40 p-4 space-y-3">
          <div className="font-display text-sm font-bold text-[var(--ink)]">
            Masalah 2 · Perancangan Pabrik Baru (Luas Minimal 640 m², Lahan 40 m
            × 30 m)
          </div>
          <p className="text-xs leading-relaxed text-[var(--ink)]">
            {LKS3_CONTENT.diskusiProblems.pabrikBaru.story}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor="lks3_pabrik_luas"
              className="font-mono text-xs font-bold"
            >
              Luas terbesar (dengan lebar 20 m) =
            </label>
            <input
              id="lks3_pabrik_luas"
              type="text"
              value={answers.lks3_pabrik_luas ?? ""}
              onChange={(e) => setAnswer("lks3_pabrik_luas", e.target.value)}
              placeholder="angka"
              className="w-24 rounded-lg border border-[var(--border)] bg-white px-2.5 py-1 font-mono text-sm"
            />
            <span className="font-mono text-xs text-[var(--ink-muted)]">m²</span>
          </div>
          <textarea
            rows={2}
            value={answers.lks3_pabrik_work ?? ""}
            onChange={(e) => setAnswer("lks3_pabrik_work", e.target.value)}
            placeholder="a) Tuliskan PtLSV & kemungkinan panjang pabrik...\nb) Hitung luas terbesar yang mungkin dibangun..."
            className="w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs"
          />
          {checked && (
            <div
              className={`rounded-md p-2.5 text-xs ${
                isAcceptedMathAnswer(
                  answers.lks3_pabrik_luas ?? "",
                  LKS3_CONTENT.diskusiProblems.pabrikBaru.acceptedMaxArea
                )
                  ? "bg-[var(--emerald-soft)] text-[var(--emerald)]"
                  : "bg-[var(--ochre-bg)] text-[var(--ochre-ink)]"
              }`}
            >
              {LKS3_CONTENT.diskusiProblems.pabrikBaru.feedback}
            </div>
          )}
        </div>
      </section>

      <ReflectionBlock
        prefix="lks3"
        values={answers}
        onChange={setAnswer}
      />
    </div>
  );
}
