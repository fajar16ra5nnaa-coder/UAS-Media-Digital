"use client";

import React from "react";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import type {
  LksClassifyItem,
  StepReviewCase,
  YesNoStatement,
} from "@/lib/content/lkpd-user-content";

export function SectionBadge({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <div className="mb-3">
      <span className="inline-block rounded-md bg-[var(--cobalt-soft)] px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--cobalt)]">
        {label}
      </span>
      <h3 className="mt-1 font-display text-lg font-bold text-[var(--ink)]">
        {title}
      </h3>
    </div>
  );
}

export function YesNoChecklist({
  items,
  values,
  onChange,
  checked,
}: {
  items: readonly YesNoStatement[];
  values: Record<string, string>;
  onChange: (id: string, val: "ya" | "tidak") => void;
  checked: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
      <div className="grid grid-cols-12 border-b border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 font-mono text-[11px] font-bold uppercase text-[var(--ink-subtle)]">
        <div className="col-span-8 sm:col-span-9">Pernyataan</div>
        <div className="col-span-4 text-center sm:col-span-3">
          Pilihan (Ya / Tidak)
        </div>
      </div>
      <div className="divide-y divide-[var(--border-subtle)]">
        {items.map((item) => {
          const val = values[item.id];
          const isCorrect = val === item.expected;
          return (
            <div key={item.id} className="p-3">
              <div className="grid items-center gap-2 grid-cols-12">
                <p className="col-span-8 text-xs leading-relaxed text-[var(--ink)] sm:col-span-9 sm:text-sm">
                  {item.text}
                </p>
                <div className="col-span-4 flex justify-center gap-1.5 sm:col-span-3">
                  {(["ya", "tidak"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onChange(item.id, opt)}
                      className={`rounded-md border px-2.5 py-1 text-xs font-semibold capitalize transition ${
                        val === opt
                          ? "border-[var(--cobalt)] bg-[var(--cobalt)] text-white"
                          : "border-[var(--border)] bg-white text-[var(--ink-muted)] hover:bg-[var(--surface-muted)]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {checked && (
                <div
                  className={`mt-2 flex items-start gap-1.5 rounded-md px-2.5 py-1.5 text-xs ${
                    isCorrect
                      ? "bg-[var(--emerald-soft)] text-[var(--emerald)]"
                      : "bg-[var(--vermilion-soft)] text-[var(--vermilion)]"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  )}
                  <span>
                    <strong>Kunci: {item.expected.toUpperCase()}.</strong>{" "}
                    {item.explanation}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PlsvClassifyBlock({
  items,
  values,
  onChange,
  checked,
}: {
  items: readonly LksClassifyItem[];
  values: Record<string, string>;
  onChange: (id: string, val: "plsv" | "bukan") => void;
  checked: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const val = values[item.id];
        const expected = item.isPlsv ? "plsv" : "bukan";
        const isCorrect = val === expected;
        return (
          <div
            key={item.id}
            className="rounded-xl border border-[var(--border)] bg-white p-3.5"
          >
            <div className="font-mono text-base font-bold text-[var(--ink)]">
              {item.expression}
            </div>
            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                onClick={() => onChange(item.id, "plsv")}
                className={`flex-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                  val === "plsv"
                    ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)] text-[var(--cobalt)]"
                    : "border-[var(--border)] bg-white text-[var(--ink-muted)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                Termasuk PLSV
              </button>
              <button
                type="button"
                onClick={() => onChange(item.id, "bukan")}
                className={`flex-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                  val === "bukan"
                    ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)] text-[var(--cobalt)]"
                    : "border-[var(--border)] bg-white text-[var(--ink-muted)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                Bukan PLSV
              </button>
            </div>
            {checked && (
              <p
                className={`mt-2 rounded-md p-2 text-xs ${
                  isCorrect
                    ? "bg-[var(--emerald-soft)] text-[var(--emerald)]"
                    : "bg-[var(--vermilion-soft)] text-[var(--vermilion)]"
                }`}
              >
                {item.explanation}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function StepAuditCard({
  item,
  verdict,
  reason,
  onVerdictChange,
  onReasonChange,
  checked,
}: {
  item: StepReviewCase;
  verdict: string;
  reason: string;
  onVerdictChange: (val: "benar" | "salah") => void;
  onReasonChange: (val: string) => void;
  checked: boolean;
}) {
  const expected = item.isAllCorrect ? "benar" : "salah";
  const isCorrect = verdict === expected;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-4">
      <div className="font-display text-sm font-bold text-[var(--ink)]">
        {item.title}
      </div>
      <div className="mt-2 space-y-1 rounded-lg bg-[var(--surface-muted)] p-3 font-mono text-xs text-[var(--ink)]">
        {item.steps.map((s, idx) => (
          <div key={idx} className="flex flex-wrap justify-between gap-2">
            <span>
              {idx + 1}. {s.math}
            </span>
            {s.note && (
              <span className="text-[11px] text-[var(--ink-subtle)]">
                ({s.note})
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[var(--ink-muted)]">
          Penilaianmu:
        </span>
        {(["benar", "salah"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onVerdictChange(opt)}
            className={`rounded-lg border px-3 py-1 text-xs font-semibold transition ${
              verdict === opt
                ? "border-[var(--cobalt)] bg-[var(--cobalt)] text-white"
                : "border-[var(--border)] bg-white text-[var(--ink-muted)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            {opt === "benar" ? "Semua Langkah Benar" : "Ada Kesalahan Langkah"}
          </button>
        ))}
      </div>

      <textarea
        rows={2}
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        placeholder="Tuliskan penjelasanmu / langkah perbaikan jika ada kesalahan..."
        className="mt-2.5 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs text-[var(--ink)] focus:border-[var(--cobalt)] focus:outline-none"
      />

      {checked && (
        <div
          className={`mt-2.5 rounded-lg p-2.5 text-xs ${
            isCorrect
              ? "bg-[var(--emerald-soft)] text-[var(--emerald)]"
              : "bg-[var(--ochre-bg)] text-[var(--ochre-ink)]"
          }`}
        >
          <strong>Pembahasan:</strong> {item.expectedAnswerText}
        </div>
      )}
    </div>
  );
}

export function ReflectionBlock({
  prefix,
  values,
  onChange,
}: {
  prefix: string;
  values: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  return (
    <div className="grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/60 p-4 md:grid-cols-2">
      <div>
        <label
          htmlFor={`${prefix}_kesimpulan`}
          className="block font-display text-sm font-bold text-[var(--ink)]"
        >
          Ayo Menyimpulkan
        </label>
        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
          Tuliskan kesimpulan utama yang kamu peroleh dari LKS ini dengan
          bahasamu sendiri:
        </p>
        <textarea
          id={`${prefix}_kesimpulan`}
          rows={3}
          value={values[`${prefix}_kesimpulan`] ?? ""}
          onChange={(e) => onChange(`${prefix}_kesimpulan`, e.target.value)}
          placeholder="Menurut saya, hal penting yang dipelajari pada LKS ini adalah..."
          className="mt-2 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs text-[var(--ink)] focus:border-[var(--cobalt)] focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor={`${prefix}_pertanyaan`}
          className="flex items-center gap-1.5 font-display text-sm font-bold text-[var(--ink)]"
        >
          <HelpCircle className="h-4 w-4 text-[var(--cobalt)]" />
          Ayo Bertanya
        </label>
        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
          Apakah ada materi atau langkah yang masih membuatmu ragu? Tulis
          pertanyaan untuk didiskusikan dengan Guru/teman:
        </p>
        <textarea
          id={`${prefix}_pertanyaan`}
          rows={3}
          value={values[`${prefix}_pertanyaan`] ?? ""}
          onChange={(e) => onChange(`${prefix}_pertanyaan`, e.target.value)}
          placeholder="Bagian yang masih ingin saya tanyakan adalah..."
          className="mt-2 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs text-[var(--ink)] focus:border-[var(--cobalt)] focus:outline-none"
        />
      </div>
    </div>
  );
}
