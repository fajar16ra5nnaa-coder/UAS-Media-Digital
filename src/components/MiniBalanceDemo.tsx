"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import {
  applyBothSides,
  checkSolved,
  createEquation,
  formatEquation,
  type BothSidesOp,
  type EquationState,
} from "@/lib/math/plsv-engine";
import { toNumber } from "@/lib/math/rational";

const INITIAL = createEquation(2, 3, 0, 11);

export function MiniBalanceDemo() {
  const [state, setState] = useState<EquationState>(INITIAL);
  const [lastNote, setLastNote] = useState<string>(
    "Klik salah satu operasi setara di bawah untuk melihat bagaimana kedua ruas berubah bersama."
  );

  const { solved } = checkSolved(state);

  function runOp(op: BothSidesOp, label: string) {
    const res = applyBothSides(state, op);
    if (!res.ok) return;
    setState(res.state);
    const nextSolved = checkSolved(res.state).solved;
    const eqText = formatEquation(
      res.state.left,
      res.state.right,
      res.state.relation
    );
    setLastNote(
      `${label} → ${eqText}${
        nextSolved ? " · Selesai! Cek substitusi: 2(4) + 3 = 11 (setara)." : ""
      }`
    );
  }

  function reset() {
    setState(INITIAL);
    setLastNote(
      "Timbangan kembali ke 2x + 3 = 11. Coba kurangi 3 di kedua ruas terlebih dahulu."
    );
  }

  const leftXCount = Math.max(0, Math.round(toNumber(state.left.x)));
  const leftOneCount = Math.max(0, Math.round(toNumber(state.left.c)));
  const rightOneCount = Math.max(0, Math.round(toNumber(state.right.c)));

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--emerald)]">
            Pratinjau Interaktif · SAMR Redefinition
          </span>
          <h2 className="font-display text-base font-bold text-[var(--ink)]">
            Simulasi Kesetaraan Dua Ruas
          </h2>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--ink-muted)] hover:bg-[var(--surface-muted)]"
        >
          <RotateCcw className="h-3 w-3" />
          Ulangi
        </button>
      </div>

      {/* Live Equation Header */}
      <div className="mt-4 flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
        <div className="font-mono text-xl font-bold tracking-tight text-[var(--ink)]">
          {formatEquation(state.left, state.right, state.relation)}
        </div>
        {solved ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--emerald-soft)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--emerald)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Setara &amp; Selesai
          </span>
        ) : (
          <span className="rounded-full bg-[var(--cobalt-soft)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--cobalt)]">
            Seimbang (=)
          </span>
        )}
      </div>

      {/* Visual Balance Pan Preview */}
      <div className="math-grid-bg mt-4 rounded-lg border border-[var(--border-subtle)] p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Pan */}
          <div className="flex min-h-[88px] flex-col justify-between rounded-lg border-b-4 border-[var(--ink)] bg-[var(--surface)]/95 p-2.5">
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: leftXCount }).map((_, idx) => (
                <span
                  key={`lx-${idx}`}
                  className="tile-x inline-flex h-8 w-10 items-center justify-center rounded-md font-mono text-xs font-bold"
                >
                  +x
                </span>
              ))}
              {Array.from({ length: leftOneCount }).map((_, idx) => (
                <span
                  key={`lc-${idx}`}
                  className="tile-one inline-flex h-8 w-8 items-center justify-center rounded-md font-mono text-xs font-bold"
                >
                  +1
                </span>
              ))}
            </div>
            <div className="mt-2 font-mono text-[10px] font-semibold uppercase text-[var(--ink-subtle)]">
              Ruas Kiri
            </div>
          </div>

          {/* Right Pan */}
          <div className="flex min-h-[88px] flex-col justify-between rounded-lg border-b-4 border-[var(--ink)] bg-[var(--surface)]/95 p-2.5">
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: rightOneCount }).map((_, idx) => (
                <span
                  key={`rc-${idx}`}
                  className="tile-one inline-flex h-7 w-7 items-center justify-center rounded-md font-mono text-[11px] font-bold"
                >
                  +1
                </span>
              ))}
            </div>
            <div className="mt-2 font-mono text-[10px] font-semibold uppercase text-[var(--ink-subtle)]">
              Ruas Kanan
            </div>
          </div>
        </div>

        {/* Fulcrum Triangle */}
        <div className="mt-1 flex flex-col items-center">
          <div className="h-1.5 w-full rounded-full bg-[var(--ink)]" />
          <div
            className="h-0 w-0 border-x-[14px] border-b-[18px] border-x-transparent border-b-[var(--ink)]"
            aria-hidden="true"
          />
          <span className="mt-0.5 font-mono text-xs font-bold text-[var(--ink)]">
            =
          </span>
        </div>
      </div>

      {/* Tactile Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={leftOneCount === 0}
          onClick={() =>
            runOp({ kind: "sub_const", amount: 3 }, "Kurangi 3 di kedua ruas")
          }
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-xs font-semibold text-[var(--ink)] transition hover:border-[var(--cobalt)] hover:bg-[var(--cobalt-soft)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          −3 kedua ruas
        </button>
        <button
          type="button"
          disabled={leftOneCount !== 0 || leftXCount !== 2}
          onClick={() =>
            runOp({ kind: "div_const", amount: 2 }, "Bagi 2 kedua ruas")
          }
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-xs font-semibold text-[var(--ink)] transition hover:border-[var(--emerald)] hover:bg-[var(--emerald-soft)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ÷2 kedua ruas
        </button>
      </div>

      {/* Equivalence Trace */}
      <div className="mt-3 rounded-lg bg-[var(--surface-muted)] px-3 py-2.5">
        <div className="font-mono text-[11px] font-semibold text-[var(--ink-subtle)]">
          Jejak Persamaan Setara:
        </div>
        <div className="mt-1 font-mono text-xs font-semibold text-[var(--cobalt)]">
          {state.history.map((h) => h.expression).join("  ↔  ")}
        </div>
        <p className="mt-1 text-xs text-[var(--ink-muted)]">{lastNote}</p>
      </div>

      <Link
        href="/sandbox"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--ink)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--cobalt)]"
      >
        Buka Lab Timbangan Lengkap (10 Misi &amp; Mode Bebas)
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
