"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  RotateCcw,
  Scale,
  Sparkles,
  Undo2,
} from "lucide-react";
import {
  applyBothSides,
  applySingleSide,
  checkSolved,
  createEquation,
  formatEquation,
  formatSide,
  verifySubstitution,
  type BothSidesOp,
  type EquationState,
  type LinearSide,
} from "@/lib/math/plsv-engine";
import { formatRat, isIntegerRat, rat, toNumber } from "@/lib/math/rational";
import type { ErrorPattern, ScaffoldingLevel } from "@/lib/pedagogy/scaffolding";
import { ScaffoldingDrawer } from "@/components/sandbox/ScaffoldingDrawer";

interface AlgebraBalanceLabProps {
  leftX: number;
  leftC: number;
  rightX: number;
  rightC: number;
  missionLabel?: string;
  missionDescription?: string;
  maxHintLevel?: ScaffoldingLevel;
  fadingBadge?: string;
  compact?: boolean;
  onSolved?: (state: EquationState) => void;
  onHintUsed?: (level: ScaffoldingLevel) => void;
}

function renderSideTiles(side: LinearSide, prefix: string) {
  const xIsInt = isIntegerRat(side.x);
  const cIsInt = isIntegerRat(side.c);
  const xVal = toNumber(side.x);
  const cVal = toNumber(side.c);
  const xAbs = Math.abs(Math.round(xVal));
  const cAbs = Math.abs(Math.round(cVal));

  const elements: React.ReactNode[] = [];

  // Variable tiles
  if (side.x.num !== 0) {
    if (xIsInt && xAbs <= 8) {
      for (let i = 0; i < xAbs; i++) {
        elements.push(
          <span
            key={`${prefix}-x-${i}`}
            className={`${
              xVal > 0 ? "tile-x" : "tile-neg-x"
            } inline-flex h-9 min-w-[44px] items-center justify-center rounded-md px-2 font-mono text-xs font-bold`}
          >
            {xVal > 0 ? "+x" : "−x"}
          </span>
        );
      }
    } else {
      elements.push(
        <span
          key={`${prefix}-x-grouped`}
          className={`${
            xVal > 0 ? "tile-x" : "tile-neg-x"
          } inline-flex h-9 items-center justify-center rounded-md px-3 font-mono text-xs font-bold`}
        >
          {formatRat(side.x)}x
        </span>
      );
    }
  }

  // Constant tiles
  if (side.c.num !== 0) {
    if (cIsInt && cAbs <= 12) {
      for (let i = 0; i < cAbs; i++) {
        elements.push(
          <span
            key={`${prefix}-c-${i}`}
            className={`${
              cVal > 0 ? "tile-one" : "tile-neg-one"
            } inline-flex h-8 w-8 items-center justify-center rounded-md font-mono text-xs font-bold`}
          >
            {cVal > 0 ? "+1" : "−1"}
          </span>
        );
      }
    } else {
      elements.push(
        <span
          key={`${prefix}-c-grouped`}
          className={`${
            cVal > 0 ? "tile-one" : "tile-neg-one"
          } inline-flex h-8 items-center justify-center rounded-md px-2.5 font-mono text-xs font-bold`}
        >
          {cVal > 0 ? `+${formatRat(side.c)}` : formatRat(side.c)}
        </span>
      );
    }
  }

  if (elements.length === 0) {
    elements.push(
      <span
        key={`${prefix}-zero`}
        className="inline-flex h-8 items-center rounded-md border border-dashed border-[var(--border)] px-3 font-mono text-xs font-semibold text-[var(--ink-subtle)]"
      >
        0 (kosong)
      </span>
    );
  }

  return elements;
}

export function AlgebraBalanceLab({
  leftX,
  leftC,
  rightX,
  rightC,
  missionLabel,
  missionDescription,
  maxHintLevel = 3,
  fadingBadge,
  compact = false,
  onSolved,
  onHintUsed,
}: AlgebraBalanceLabProps) {
  const [stack, setStack] = useState<EquationState[]>(() => [
    createEquation(leftX, leftC, rightX, rightC),
  ]);
  const [controlMode, setControlMode] = useState<"both" | "single">("both");
  const [customKind, setCustomKind] = useState<BothSidesOp["kind"]>("sub_const");
  const [customAmount, setCustomAmount] = useState<string>("1");
  const [feedback, setFeedback] = useState<{
    tone: "info" | "warn" | "error" | "success";
    message: string;
  } | null>(null);
  const [activePattern, setActivePattern] =
    useState<ErrorPattern>("GENERAL_STUCK");
  const [unlockedHint, setUnlockedHint] = useState<0 | ScaffoldingLevel>(0);
  const [subInput, setSubInput] = useState<string>("");
  const [subResult, setSubResult] = useState<{
    leftStr: string;
    rightStr: string;
    isEqual: boolean;
    candidate: string;
  } | null>(null);
  const [hasNotifiedSolved, setHasNotifiedSolved] = useState(false);

  // Reset when equation props change
  useEffect(() => {
    setStack([createEquation(leftX, leftC, rightX, rightC)]);
    setFeedback(null);
    setActivePattern("GENERAL_STUCK");
    setUnlockedHint(0);
    setSubInput("");
    setSubResult(null);
    setHasNotifiedSolved(false);
  }, [leftX, leftC, rightX, rightC]);

  const current = stack[stack.length - 1];
  const { solved, solution } = checkSolved(current);

  useEffect(() => {
    if (solved && solution && !hasNotifiedSolved) {
      setHasNotifiedSolved(true);
      setSubInput(formatRat(solution));
      onSolved?.(current);
    }
  }, [solved, solution, hasNotifiedSolved, onSolved, current]);

  // Clamp beam tilt angle between -11deg and +11deg
  // Positive tiltDelta means left side is heavier -> rotate counter-clockwise (negative deg)
  const rawAngle = current.isBalanced
    ? 0
    : Math.max(-11, Math.min(11, -current.tiltDelta * 1.8));

  function executeBothSides(op: BothSidesOp) {
    const result = applyBothSides(current, op);
    if (!result.ok) {
      setFeedback({ tone: "error", message: result.message });
      if (result.errorCode === "DIVIDE_BY_ZERO") {
        setActivePattern("DIVIDE_BY_ZERO");
        setUnlockedHint((prev) => (prev === 0 ? 1 : prev));
      }
      return;
    }

    setStack((prev) => [...prev, result.state]);

    if (result.warningCode === "PRODUCES_FRACTION") {
      setFeedback({
        tone: "warn",
        message:
          "Operasi sah secara matematis (pecahan eksak), namun kamu juga bisa mengosongkan konstanta dulu agar bilangan tetap bulat.",
      });
      setActivePattern("PRODUCES_FRACTION");
    } else if (result.state.zeroPairsCancelled > 0) {
      setFeedback({
        tone: "success",
        message: `Pasangan nol aktif! ${result.state.zeroPairsCancelled} pasangan (+ dan −) saling meniadakan menjadi 0.`,
      });
      setActivePattern("GENERAL_STUCK");
    } else {
      setFeedback({
        tone: "info",
        message: `Operasi setara diterapkan pada kedua ruas: ${formatEquation(
          result.state.left,
          result.state.right,
          result.state.relation
        )}.`,
      });
      setActivePattern("GENERAL_STUCK");
    }
  }

  function executeSingleSide(
    side: "left" | "right",
    deltaX: number,
    deltaC: number
  ) {
    const next = applySingleSide(current, side, deltaX, deltaC);
    setStack((prev) => [...prev, next]);

    if (!next.isBalanced) {
      setFeedback({
        tone: "error",
        message: `Timbangan miring! Mengubah ${
          side === "left" ? "ruas kiri" : "ruas kanan"
        } saja merusak kesetaraan (= menjadi ${next.relation}).`,
      });
      setActivePattern("SINGLE_SIDE_OP");
      setUnlockedHint((prev) => (prev === 0 ? 1 : prev));
    } else {
      setFeedback({
        tone: "success",
        message: "Keseimbangan pulih kembali! Kedua ruas kini setara (=).",
      });
      setActivePattern("GENERAL_STUCK");
    }
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(customAmount);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
      setFeedback({
        tone: "error",
        message: "Masukkan bilangan bulat untuk operasi timbangan.",
      });
      return;
    }
    executeBothSides({ kind: customKind, amount: parsed });
  }

  function handleUndo() {
    if (stack.length <= 1) return;
    setStack((prev) => prev.slice(0, -1));
    setFeedback({
      tone: "info",
      message: "Langkah terakhir diurungkan.",
    });
  }

  function handleReset() {
    setStack([createEquation(leftX, leftC, rightX, rightC)]);
    setFeedback(null);
    setActivePattern("GENERAL_STUCK");
    setUnlockedHint(0);
    setSubResult(null);
    setHasNotifiedSolved(false);
  }

  function handleUnlockNextHint() {
    const next = Math.min(maxHintLevel, unlockedHint + 1) as ScaffoldingLevel;
    setUnlockedHint(next);
    onHintUsed?.(next);
  }

  function handleVerifySubstitution(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = subInput.trim();
    let candidate = rat(0);
    if (trimmed.includes("/")) {
      const [nStr, dStr] = trimmed.split("/");
      const n = Number(nStr);
      const d = Number(dStr);
      if (!Number.isInteger(n) || !Number.isInteger(d) || d === 0) return;
      candidate = rat(n, d);
    } else {
      const num = Number(trimmed);
      if (!Number.isFinite(num)) return;
      // Convert finite decimal up to 2 places to exact rational
      const scaled = Math.round(num * 100);
      candidate = rat(scaled, 100);
    }

    const check = verifySubstitution(current, candidate);
    setSubResult({
      leftStr: formatRat(check.leftVal),
      rightStr: formatRat(check.rightVal),
      isEqual: check.isEqual,
      candidate: formatRat(candidate),
    });
  }

  const eqText = formatEquation(current.left, current.right, current.relation);

  return (
    <div className="space-y-4">
      {/* Top Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5">
        <div>
          {missionLabel && (
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--cobalt)]">
              {missionLabel}
            </div>
          )}
          <div className="mt-0.5 flex flex-wrap items-center gap-3">
            <span className="font-mono text-2xl font-bold tracking-tight text-[var(--ink)]">
              {eqText}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs font-semibold ${
                solved
                  ? "bg-[var(--emerald-soft)] text-[var(--emerald)]"
                  : current.isBalanced
                  ? "bg-[var(--cobalt-soft)] text-[var(--cobalt)]"
                  : "bg-[var(--vermilion-soft)] text-[var(--vermilion)]"
              }`}
            >
              {solved ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Selesai · x = {solution ? formatRat(solution) : ""}
                </>
              ) : current.isBalanced ? (
                <>
                  <Scale className="h-3.5 w-3.5" />
                  Seimbang (=)
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Tidak Seimbang ({current.relation})
                </>
              )}
            </span>
          </div>
          {missionDescription && (
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              {missionDescription}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={stack.length <= 1}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Urungkan
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--ink-muted)] transition hover:bg-[var(--surface-muted)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Ulangi
          </button>
        </div>
      </div>

      {/* Main Workspace Grid: Visual Scale (7 cols) + Symbolic Trace & Controls (5 cols) */}
      <div className={`grid gap-4 ${compact ? "lg:grid-cols-12" : "lg:grid-cols-12"}`}>
        {/* Left: Visual Interactive Balance Scale */}
        <div className="space-y-4 lg:col-span-7">
          <div className="math-grid-bg relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="mb-3 flex items-center justify-between text-[11px] font-medium text-[var(--ink-subtle)]">
              <span className="font-mono uppercase tracking-wider">
                Papan Timbangan Aljabar
              </span>
              <div className="flex items-center gap-2 font-mono">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[var(--cobalt)]" />{" "}
                  +x
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[var(--emerald)]" />{" "}
                  +1
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[var(--vermilion)]" />{" "}
                  −1
                </span>
              </div>
            </div>

            {/* Rotating Balance Assembly */}
            <div className="py-4">
              <div
                className="mx-auto max-w-xl transition-transform duration-500 ease-out"
                style={{ transform: `rotate(${rawAngle}deg)` }}
              >
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Pan */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex min-h-[120px] w-full flex-col justify-between rounded-xl border-2 bg-[var(--surface)]/95 p-3 shadow-xs transition ${
                        current.isBalanced
                          ? "border-[var(--border)]"
                          : "border-[var(--vermilion)]/50"
                      }`}
                    >
                      <div className="flex flex-wrap content-start gap-1.5">
                        {renderSideTiles(current.left, "left")}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-[var(--border-subtle)] pt-1.5 font-mono text-xs">
                        <span className="text-[10px] uppercase text-[var(--ink-subtle)]">
                          Ruas Kiri
                        </span>
                        <span className="font-bold text-[var(--ink)]">
                          {formatSide(current.left)}
                        </span>
                      </div>
                    </div>
                    <div className="h-3 w-1.5 bg-[var(--ink)]" />
                  </div>

                  {/* Right Pan */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex min-h-[120px] w-full flex-col justify-between rounded-xl border-2 bg-[var(--surface)]/95 p-3 shadow-xs transition ${
                        current.isBalanced
                          ? "border-[var(--border)]"
                          : "border-[var(--vermilion)]/50"
                      }`}
                    >
                      <div className="flex flex-wrap content-start gap-1.5">
                        {renderSideTiles(current.right, "right")}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-[var(--border-subtle)] pt-1.5 font-mono text-xs">
                        <span className="text-[10px] uppercase text-[var(--ink-subtle)]">
                          Ruas Kanan
                        </span>
                        <span className="font-bold text-[var(--ink)]">
                          {formatSide(current.right)}
                        </span>
                      </div>
                    </div>
                    <div className="h-3 w-1.5 bg-[var(--ink)]" />
                  </div>
                </div>

                {/* Horizontal Beam */}
                <div
                  className={`h-2.5 w-full rounded-full transition-colors ${
                    current.isBalanced
                      ? "bg-[var(--ink)]"
                      : "bg-[var(--vermilion)]"
                  }`}
                />
              </div>

              {/* Stationary Fulcrum Base */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 -mt-1 items-center justify-center rounded-full border-2 font-mono text-lg font-extrabold shadow-xs ${
                    current.isBalanced
                      ? "border-[var(--emerald)] bg-[var(--emerald-soft)] text-[var(--emerald)]"
                      : "border-[var(--vermilion)] bg-[var(--vermilion-soft)] text-[var(--vermilion)]"
                  }`}
                  aria-live="polite"
                >
                  {current.relation}
                </div>
                <div className="h-2 w-28 rounded-t-md bg-[var(--ink)]" />
                <div className="h-1.5 w-40 rounded-full bg-[var(--border)]" />
              </div>
            </div>

            {/* Live Feedback Bar */}
            {feedback && (
              <div
                role="status"
                className={`mt-2 rounded-lg border px-3.5 py-2.5 text-xs font-medium ${
                  feedback.tone === "error"
                    ? "border-[var(--vermilion)]/30 bg-[var(--vermilion-soft)] text-[var(--vermilion)]"
                    : feedback.tone === "warn"
                    ? "border-[var(--ochre-border)] bg-[var(--ochre-bg)] text-[var(--ochre-ink)]"
                    : feedback.tone === "success"
                    ? "border-[var(--emerald)]/30 bg-[var(--emerald-soft)] text-[var(--emerald)]"
                    : "border-[var(--cobalt)]/25 bg-[var(--cobalt-soft)] text-[var(--cobalt)]"
                }`}
              >
                {feedback.message}
              </div>
            )}
          </div>

          {/* Operation Console */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
              <div className="inline-flex rounded-lg bg-[var(--surface-muted)] p-1">
                <button
                  type="button"
                  onClick={() => setControlMode("both")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    controlMode === "both"
                      ? "bg-[var(--surface)] text-[var(--cobalt)] shadow-2xs"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  <Scale className="h-3.5 w-3.5" />
                  Operasi Kedua Ruas (Setara)
                </button>
                <button
                  type="button"
                  onClick={() => setControlMode("single")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    controlMode === "single"
                      ? "bg-[var(--surface)] text-[var(--vermilion)] shadow-2xs"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  <FlaskConical className="h-3.5 w-3.5" />
                  Eksperimen Satu Ruas
                </button>
              </div>
            </div>

            {controlMode === "both" ? (
              <div className="mt-3 space-y-3">
                {/* Quick Tactile Buttons */}
                <div>
                  <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-subtle)]">
                    Aksi Cepat (Kedua Ruas Sekaligus)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        executeBothSides({ kind: "add_const", amount: 1 })
                      }
                      className="tile-one rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition hover:opacity-90"
                    >
                      +1 kedua ruas
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        executeBothSides({ kind: "sub_const", amount: 1 })
                      }
                      className="tile-neg-one rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition hover:opacity-90"
                    >
                      −1 kedua ruas
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        executeBothSides({ kind: "add_x", amount: 1 })
                      }
                      className="tile-x rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition hover:opacity-90"
                    >
                      +x kedua ruas
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        executeBothSides({ kind: "sub_x", amount: 1 })
                      }
                      className="tile-neg-x rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition hover:opacity-90"
                    >
                      −x kedua ruas
                    </button>
                  </div>
                </div>

                {/* Custom Symmetric Operation Form */}
                <form
                  onSubmit={handleCustomSubmit}
                  className="flex flex-wrap items-end gap-2 border-t border-[var(--border-subtle)] pt-3"
                >
                  <div className="min-w-[170px] flex-1">
                    <label
                      htmlFor="op-kind"
                      className="mb-1 block text-[11px] font-semibold text-[var(--ink-muted)]"
                    >
                      Jenis Operasi Kedua Ruas
                    </label>
                    <select
                      id="op-kind"
                      value={customKind}
                      onChange={(e) =>
                        setCustomKind(e.target.value as BothSidesOp["kind"])
                      }
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--ink)]"
                    >
                      <option value="add_const">Tambah konstanta (+)</option>
                      <option value="sub_const">Kurangi konstanta (−)</option>
                      <option value="add_x">Tambah variabel (+ax)</option>
                      <option value="sub_x">Kurangi variabel (−ax)</option>
                      <option value="mul_const">Kalikan kedua ruas (×)</option>
                      <option value="div_const">Bagi kedua ruas (÷)</option>
                    </select>
                  </div>
                  <div className="w-24">
                    <label
                      htmlFor="op-amount"
                      className="mb-1 block text-[11px] font-semibold text-[var(--ink-muted)]"
                    >
                      Bilangan
                    </label>
                    <input
                      id="op-amount"
                      type="number"
                      step="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-xs font-semibold text-[var(--ink)]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-[var(--cobalt)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--cobalt-hover)]"
                  >
                    Terapkan Kedua Ruas
                  </button>
                </form>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <p className="text-xs leading-relaxed text-[var(--ink-muted)]">
                  Mode Eksperimen: Coba ubah <strong>satu ruas saja</strong>{" "}
                  untuk mengamati secara langsung mengapa operasi tidak simetris
                  membuat timbangan miring dan merusak tanda{" "}
                  <code className="font-mono font-bold">=</code>.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3">
                    <div className="mb-2 font-mono text-[11px] font-bold uppercase text-[var(--ink)]">
                      Hanya Ruas Kiri
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => executeSingleSide("left", 0, 1)}
                        className="tile-one rounded px-2.5 py-1 font-mono text-xs font-bold"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => executeSingleSide("left", 0, -1)}
                        className="tile-neg-one rounded px-2.5 py-1 font-mono text-xs font-bold"
                      >
                        −1
                      </button>
                      <button
                        type="button"
                        onClick={() => executeSingleSide("left", 1, 0)}
                        className="tile-x rounded px-2.5 py-1 font-mono text-xs font-bold"
                      >
                        +x
                      </button>
                      <button
                        type="button"
                        onClick={() => executeSingleSide("left", -1, 0)}
                        className="tile-neg-x rounded px-2.5 py-1 font-mono text-xs font-bold"
                      >
                        −x
                      </button>
                    </div>
                  </div>
                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3">
                    <div className="mb-2 font-mono text-[11px] font-bold uppercase text-[var(--ink)]">
                      Hanya Ruas Kanan
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => executeSingleSide("right", 0, 1)}
                        className="tile-one rounded px-2.5 py-1 font-mono text-xs font-bold"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => executeSingleSide("right", 0, -1)}
                        className="tile-neg-one rounded px-2.5 py-1 font-mono text-xs font-bold"
                      >
                        −1
                      </button>
                      <button
                        type="button"
                        onClick={() => executeSingleSide("right", 1, 0)}
                        className="tile-x rounded px-2.5 py-1 font-mono text-xs font-bold"
                      >
                        +x
                      </button>
                      <button
                        type="button"
                        onClick={() => executeSingleSide("right", -1, 0)}
                        className="tile-neg-x rounded px-2.5 py-1 font-mono text-xs font-bold"
                      >
                        −x
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Symbolic Equivalence Trace + Scaffolding + Substitution Check */}
        <div className="space-y-4 lg:col-span-5">
          {/* Synchronized Symbolic Trace */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
              <h3 className="font-display text-sm font-bold text-[var(--ink)]">
                Jejak Simbolik Persamaan Setara (↔)
              </h3>
              <span className="font-mono text-[11px] text-[var(--ink-subtle)]">
                {current.history.length - 1} langkah
              </span>
            </div>

            <ol className="mt-3 max-h-[240px] space-y-2 overflow-y-auto pr-1">
              {current.history.map((step, idx) => (
                <li
                  key={`${idx}-${step.expression}`}
                  className={`rounded-lg border px-3 py-2 ${
                    !step.isBalanced
                      ? "border-[var(--vermilion)]/30 bg-[var(--vermilion-soft)]/50"
                      : idx === current.history.length - 1
                      ? "border-[var(--cobalt)]/40 bg-[var(--cobalt-soft)]/60"
                      : "border-[var(--border-subtle)] bg-[var(--surface-muted)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-bold text-[var(--ink)]">
                      {idx > 0 && (
                        <span className="mr-1.5 text-[var(--cobalt)]">
                          {step.isBalanced ? "↔" : "≠"}
                        </span>
                      )}
                      {step.expression}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--ink-subtle)]">
                      #{idx}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-[var(--ink-muted)]">
                    {step.operationLabel}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Adaptive 3-Level Scaffolding */}
          <ScaffoldingDrawer
            pattern={activePattern}
            equationState={current}
            unlockedLevel={unlockedHint}
            maxAllowedLevel={maxHintLevel}
            fadingBadge={fadingBadge}
            onUnlockNext={handleUnlockNextHint}
          />

          {/* Substitution Check Card */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--emerald)]" />
              <h3 className="font-display text-sm font-bold text-[var(--ink)]">
                Uji Substitusi ke Persamaan Awal
              </h3>
            </div>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              Masukkan nilai <code className="font-mono font-bold">x</code>{" "}
              untuk membuktikan bahwa ruas kiri dan ruas kanan bernilai sama
              pada persamaan awal{" "}
              <code className="font-mono font-semibold text-[var(--ink)]">
                {formatEquation(current.initialLeft, current.initialRight)}
              </code>
              .
            </p>
            <form
              onSubmit={handleVerifySubstitution}
              className="mt-2.5 flex items-center gap-2"
            >
              <span className="font-mono text-xs font-bold text-[var(--ink)]">
                x =
              </span>
              <input
                type="text"
                value={subInput}
                onChange={(e) => setSubInput(e.target.value)}
                placeholder="mis. 4 atau -3 atau 3/2"
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 font-mono text-xs text-[var(--ink)]"
              />
              <button
                type="submit"
                className="rounded-lg bg-[var(--emerald)] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
              >
                Uji Nilai
              </button>
            </form>

            {subResult && (
              <div
                className={`mt-2.5 rounded-lg border px-3 py-2 font-mono text-xs ${
                  subResult.isEqual
                    ? "border-[var(--emerald)]/30 bg-[var(--emerald-soft)] text-[var(--emerald)]"
                    : "border-[var(--vermilion)]/30 bg-[var(--vermilion-soft)] text-[var(--vermilion)]"
                }`}
              >
                Jika x = {subResult.candidate}: Ruas Kiri = {subResult.leftStr}{" "}
                {subResult.isEqual ? "=" : "≠"} Ruas Kanan ={" "}
                {subResult.rightStr} →{" "}
                <strong>
                  {subResult.isEqual
                    ? "TERBUKTI SETARA!"
                    : "BELUM SETARA, cek lagi!"}
                </strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
