"use client";

import React, { useState } from "react";
import { ClipboardCheck, Sparkles, Stethoscope } from "lucide-react";
import { CreativeEvaluationTab } from "@/components/evaluasi/CreativeEvaluationTab";
import { TwoTierDiagnosticTab } from "@/components/evaluasi/TwoTierDiagnosticTab";

type EvalTab = "creative" | "diagnostic";

export default function EvaluasiPage() {
  const [activeTab, setActiveTab] = useState<EvalTab>("creative");

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--cobalt)]">
          Modul 3 · Evaluasi Pembelajaran PLSV &amp; PtLSV
        </span>
        <h1 className="mt-1 font-display text-2xl font-bold text-[var(--ink)] sm:text-3xl">
          Evaluasi Berpikir Kreatif &amp; Diagnostik Miskonsepsi
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Pilih <strong>Evaluasi Utama (4 Soal Uraian PLSV &amp; PtLSV)</strong>{" "}
          dengan feedback pembahasan multi-alternatif, atau gunakan{" "}
          <strong>Diagnostik Cepat 2-Tier</strong> untuk mengecek profil
          miskonsepsi PLSV.
        </p>

        {/* Tab Switcher */}
        <div
          role="tablist"
          aria-label="Pilih mode evaluasi"
          className="mt-4 grid gap-2 sm:grid-cols-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "creative"}
            onClick={() => setActiveTab("creative")}
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
              activeTab === "creative"
                ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)]/70 ring-1 ring-[var(--cobalt)]"
                : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                activeTab === "creative"
                  ? "bg-[var(--cobalt)] text-white"
                  : "bg-[var(--surface-muted)] text-[var(--ink-muted)]"
              }`}
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--ink)]">
                Evaluasi Utama · 4 Soal Uraian
              </div>
              <div className="text-xs text-[var(--ink-muted)]">
                Berpikir Kreatif PLSV &amp; PtLSV + Feedback Kunci Multi-Alternatif
              </div>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "diagnostic"}
            onClick={() => setActiveTab("diagnostic")}
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition ${
              activeTab === "diagnostic"
                ? "border-[var(--emerald)] bg-[var(--emerald-soft)]/70 ring-1 ring-[var(--emerald)]"
                : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                activeTab === "diagnostic"
                  ? "bg-[var(--emerald)] text-white"
                  : "bg-[var(--surface-muted)] text-[var(--ink-muted)]"
              }`}
            >
              <Stethoscope className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[var(--ink)]">
                Diagnostik Cepat · 10 Soal 2-Tier
                <ClipboardCheck className="h-3.5 w-3.5 text-[var(--emerald)]" />
              </div>
              <div className="text-xs text-[var(--ink-muted)]">
                Deteksi Miskonsepsi Klasifikasional, Korelasional &amp; Teoritikal
              </div>
            </div>
          </button>
        </div>
      </div>

      {activeTab === "creative" ? (
        <CreativeEvaluationTab />
      ) : (
        <TwoTierDiagnosticTab />
      )}
    </div>
  );
}
