"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  SlidersHorizontal,
} from "lucide-react";
import { SANDBOX_MISSIONS } from "@/lib/content/plsv-curriculum";
import { AlgebraBalanceLab } from "@/components/sandbox/AlgebraBalanceLab";

const STORAGE_KEY = "ruassetara_sandbox_completed_v1";

export default function SandboxPage() {
  const [mode, setMode] = useState<"missions" | "custom">("missions");
  const [selectedId, setSelectedId] = useState<string>(SANDBOX_MISSIONS[0].id);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // Custom Free Mode inputs
  const [customEq, setCustomEq] = useState({
    leftX: 3,
    leftC: -2,
    rightX: 1,
    rightC: 6,
  });
  const [customDraft, setCustomDraft] = useState({
    leftX: "3",
    leftC: "-2",
    rightX: "1",
    rightC: "6",
  });
  const [customErr, setCustomErr] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCompletedIds(parsed);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const currentMission =
    SANDBOX_MISSIONS.find((m) => m.id === selectedId) ?? SANDBOX_MISSIONS[0];

  function markCompleted(missionId: string) {
    setCompletedIds((prev) => {
      if (prev.includes(missionId)) return prev;
      const next = [...prev, missionId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function applyCustomEquation(e: React.FormEvent) {
    e.preventDefault();
    const lx = Number(customDraft.leftX);
    const lc = Number(customDraft.leftC);
    const rx = Number(customDraft.rightX);
    const rc = Number(customDraft.rightC);

    if (
      ![lx, lc, rx, rc].every((v) => Number.isInteger(v) && Math.abs(v) <= 25)
    ) {
      setCustomErr("Gunakan bilangan bulat antara −25 sampai 25.");
      return;
    }
    if (lx === rx) {
      setCustomErr(
        "Koefisien x di ruas kiri dan kanan tidak boleh sama agar membentuk PLSV dengan solusi tunggal."
      );
      return;
    }
    setCustomErr(null);
    setCustomEq({ leftX: lx, leftC: lc, rightX: rx, rightC: rc });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-5 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--cobalt)]">
            Modul 01 · Interactive Math Sandbox
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-[var(--ink)]">
            Lab Timbangan Aljabar
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--ink-muted)]">
            Temukan nilai <code className="font-mono font-bold">x</code> dengan
            menerapkan operasi setara di kedua ruas. Amati bagaimana pasangan
            nol (<code className="font-mono">+1</code> &amp;{" "}
            <code className="font-mono">−1</code>) bekerja dan cek jejak
            simboliknya secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1">
            <button
              type="button"
              onClick={() => setMode("missions")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                mode === "missions"
                  ? "bg-[var(--cobalt)] text-white"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              10 Misi Terpandu ({completedIds.length}/10)
            </button>
            <button
              type="button"
              onClick={() => setMode("custom")}
              className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                mode === "custom"
                  ? "bg-[var(--cobalt)] text-white"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Mode Bebas
            </button>
          </div>
        </div>
      </div>

      {/* Mission Selector or Custom Builder */}
      {mode === "missions" ? (
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-10">
            {SANDBOX_MISSIONS.map((m) => {
              const active = m.id === currentMission.id;
              const done = completedIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedId(m.id)}
                  className={`flex flex-col items-start rounded-lg border px-3 py-2 text-left transition ${
                    active
                      ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)] ring-1 ring-[var(--cobalt)]"
                      : done
                      ? "border-[var(--emerald)]/40 bg-[var(--emerald-soft)]/50 hover:border-[var(--emerald)]"
                      : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--ink)]">
                      M{m.number}
                    </span>
                    {done && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[var(--emerald)]" />
                    )}
                  </div>
                  <span className="mt-0.5 font-mono text-[10px] text-[var(--ink-muted)]">
                    {m.difficulty}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <form
          onSubmit={applyCustomEquation}
          className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block font-mono text-[11px] font-semibold text-[var(--ink-muted)]">
                Koef. x Kiri
              </label>
              <input
                type="number"
                value={customDraft.leftX}
                onChange={(e) =>
                  setCustomDraft((d) => ({ ...d, leftX: e.target.value }))
                }
                className="w-20 rounded-lg border border-[var(--border)] px-2.5 py-1.5 font-mono text-sm"
              />
            </div>
            <span className="pb-2 font-mono text-sm font-bold text-[var(--ink-subtle)]">
              x +
            </span>
            <div>
              <label className="mb-1 block font-mono text-[11px] font-semibold text-[var(--ink-muted)]">
                Konstanta Kiri
              </label>
              <input
                type="number"
                value={customDraft.leftC}
                onChange={(e) =>
                  setCustomDraft((d) => ({ ...d, leftC: e.target.value }))
                }
                className="w-20 rounded-lg border border-[var(--border)] px-2.5 py-1.5 font-mono text-sm"
              />
            </div>
            <span className="pb-2 font-mono text-lg font-bold text-[var(--cobalt)]">
              =
            </span>
            <div>
              <label className="mb-1 block font-mono text-[11px] font-semibold text-[var(--ink-muted)]">
                Koef. x Kanan
              </label>
              <input
                type="number"
                value={customDraft.rightX}
                onChange={(e) =>
                  setCustomDraft((d) => ({ ...d, rightX: e.target.value }))
                }
                className="w-20 rounded-lg border border-[var(--border)] px-2.5 py-1.5 font-mono text-sm"
              />
            </div>
            <span className="pb-2 font-mono text-sm font-bold text-[var(--ink-subtle)]">
              x +
            </span>
            <div>
              <label className="mb-1 block font-mono text-[11px] font-semibold text-[var(--ink-muted)]">
                Konstanta Kanan
              </label>
              <input
                type="number"
                value={customDraft.rightC}
                onChange={(e) =>
                  setCustomDraft((d) => ({ ...d, rightC: e.target.value }))
                }
                className="w-20 rounded-lg border border-[var(--border)] px-2.5 py-1.5 font-mono text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--cobalt)]"
            >
              Muat ke Timbangan
            </button>
          </div>
          {customErr && (
            <p className="mt-2 text-xs font-medium text-[var(--vermilion)]">
              {customErr}
            </p>
          )}
        </form>
      )}

      {/* Active Balance Sandbox */}
      <div className="mt-5">
        {mode === "missions" ? (
          <AlgebraBalanceLab
            leftX={currentMission.leftX}
            leftC={currentMission.leftC}
            rightX={currentMission.rightX}
            rightC={currentMission.rightC}
            missionLabel={`Misi ${currentMission.number} · Tingkat ${currentMission.difficulty} — ${currentMission.title}`}
            missionDescription={currentMission.description}
            onSolved={() => markCompleted(currentMission.id)}
          />
        ) : (
          <AlgebraBalanceLab
            leftX={customEq.leftX}
            leftC={customEq.leftC}
            rightX={customEq.rightX}
            rightC={customEq.rightC}
            missionLabel="Mode Eksplorasi Bebas"
            missionDescription="Uji persamaan PLSV buatanmu sendiri secara visual dan simbolik."
          />
        )}
      </div>

      {/* Next Step Footer Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
        <div className="text-xs text-[var(--ink-muted)]">
          Masih ada langkah yang ingin ditanyakan kepada guru atau teman
          sekelas?
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/diskusi?channel=sandbox"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
          >
            <MessageSquare className="h-3.5 w-3.5 text-[var(--cobalt)]" />
            Tanya di Kanal Sandbox
          </Link>
          <Link
            href="/lkpd"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--cobalt)] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[var(--cobalt-hover)]"
          >
            Lanjut ke LKPD Digital 4 Tahap
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
