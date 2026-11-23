"use client";

import React from "react";
import { HelpCircle, Lightbulb, Sparkles } from "lucide-react";
import {
  getContingentScaffolding,
  type ErrorPattern,
  type ScaffoldingLevel,
} from "@/lib/pedagogy/scaffolding";
import type { EquationState } from "@/lib/math/plsv-engine";

interface ScaffoldingDrawerProps {
  pattern: ErrorPattern;
  equationState: EquationState;
  unlockedLevel: 0 | ScaffoldingLevel;
  maxAllowedLevel?: ScaffoldingLevel;
  fadingBadge?: string;
  onUnlockNext: () => void;
}

export function ScaffoldingDrawer({
  pattern,
  equationState,
  unlockedLevel,
  maxAllowedLevel = 3,
  fadingBadge,
  onUnlockNext,
}: ScaffoldingDrawerProps) {
  const response =
    unlockedLevel > 0
      ? getContingentScaffolding(
          pattern,
          equationState,
          Math.min(unlockedLevel, maxAllowedLevel) as ScaffoldingLevel
        )
      : null;

  const canUnlockMore = unlockedLevel < maxAllowedLevel;
  const nextLevel = (unlockedLevel + 1) as ScaffoldingLevel;

  return (
    <div className="rounded-xl border border-[var(--ochre-border)] bg-[var(--ochre-bg)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/80 text-[var(--ochre-ink)]">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-[var(--ochre-ink)]">
              Scaffolding Adaptif Bertingkat
            </h3>
            <p className="text-[11px] text-[var(--ochre-ink)]/80">
              {fadingBadge ??
                "Petunjuk bertahap (Anghileri 2006) — tidak langsung membuka jawaban akhir"}
            </p>
          </div>
        </div>

        {canUnlockMore ? (
          <button
            type="button"
            onClick={onUnlockNext}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ochre-ink)]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ochre-ink)] transition hover:bg-[var(--ochre-ink)] hover:text-white"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {unlockedLevel === 0
              ? "Minta Petunjuk Level 1"
              : `Buka Petunjuk Level ${nextLevel}`}
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 font-mono text-[11px] font-semibold text-[var(--ochre-ink)]">
            <Sparkles className="h-3 w-3" />
            Maks. Level {maxAllowedLevel} terbuka
          </span>
        )}
      </div>

      {response && response.levels.length > 0 ? (
        <div className="mt-3 space-y-2.5">
          {response.levels.map((tier) => (
            <div
              key={tier.level}
              className="rounded-lg border border-[var(--ochre-border)] bg-white/95 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-xs font-bold text-[var(--ink)]">
                  {tier.title}
                </span>
                <span className="rounded bg-[var(--ochre-bg)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--ochre-ink)]">
                  {tier.tag}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-muted)]">
                {tier.body}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2.5 text-xs leading-relaxed text-[var(--ochre-ink)]/85">
          Coba susun langkah operasinya secara mandiri terlebih dahulu. Jika
          ragu atau timbangan miring, klik tombol di atas untuk membuka bantuan
          secara bertahap (Level 1 → Level 2 → Level 3).
        </p>
      )}
    </div>
  );
}
