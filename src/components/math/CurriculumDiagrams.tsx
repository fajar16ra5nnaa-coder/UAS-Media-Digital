"use client";

import React from "react";

export function NumberLineSvg({
  boundaryLabel,
  op,
}: {
  boundaryLabel: string;
  op: ">=" | ">" | "<=" | "<";
}) {
  const isRight = op === ">=" || op === ">";
  const isClosed = op === ">=" || op === "<=";

  return (
    <svg
      viewBox="0 0 280 56"
      className="h-14 w-full max-w-[280px]"
      role="img"
      aria-label={`Garis bilangan batas ${boundaryLabel} arah ${isRight ? "kanan" : "kiri"}`}
    >
      <line x1="16" y1="26" x2="264" y2="26" stroke="#98A6B8" strokeWidth="2" />
      <polygon points="12,26 20,21 20,31" fill="#98A6B8" />
      <polygon points="268,26 260,21 260,31" fill="#98A6B8" />

      {[56, 100, 140, 180, 224].map((x) => (
        <line
          key={x}
          x1={x}
          y1="21"
          x2={x}
          y2="31"
          stroke="#98A6B8"
          strokeWidth="1.5"
        />
      ))}

      {isRight ? (
        <>
          <line
            x1="140"
            y1="26"
            x2="252"
            y2="26"
            stroke="#1D4ED8"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <polygon points="262,26 248,19 248,33" fill="#1D4ED8" />
        </>
      ) : (
        <>
          <line
            x1="140"
            y1="26"
            x2="28"
            y2="26"
            stroke="#1D4ED8"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <polygon points="18,26 32,19 32,33" fill="#1D4ED8" />
        </>
      )}

      <circle
        cx="140"
        cy="26"
        r="6"
        fill={isClosed ? "#1D4ED8" : "#FFFFFF"}
        stroke="#1D4ED8"
        strokeWidth="2.5"
      />
      <text
        x="140"
        y="48"
        textAnchor="middle"
        fontSize="11.5"
        fontWeight="700"
        fill="#101828"
        fontFamily="monospace"
      >
        {boundaryLabel}
      </text>
    </svg>
  );
}

export function NeracaIllustration({
  leftBoxes,
  leftWeights,
  rightBoxes,
  rightWeights,
  boxLabel = "x",
  caption,
}: {
  leftBoxes: number;
  leftWeights: number;
  rightBoxes: number;
  rightWeights: number;
  boxLabel?: string;
  caption?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)]/60 p-3">
      <svg viewBox="0 0 260 116" className="h-28 w-full max-w-[260px]">
        <line x1="130" y1="22" x2="130" y2="96" stroke="#101828" strokeWidth="4" />
        <rect x="92" y="94" width="76" height="8" rx="4" fill="#101828" />
        <line
          x1="42"
          y1="30"
          x2="218"
          y2="30"
          stroke="#101828"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="130" cy="30" r="5" fill="#1D4ED8" />

        {/* Left Pan */}
        <line x1="56" y1="30" x2="36" y2="68" stroke="#475467" strokeWidth="1.5" />
        <line x1="56" y1="30" x2="76" y2="68" stroke="#475467" strokeWidth="1.5" />
        <path d="M22 68 Q56 80 90 68 Z" fill="#101828" />

        {/* Right Pan */}
        <line x1="204" y1="30" x2="184" y2="68" stroke="#475467" strokeWidth="1.5" />
        <line x1="204" y1="30" x2="224" y2="68" stroke="#475467" strokeWidth="1.5" />
        <path d="M170 68 Q204 80 238 68 Z" fill="#101828" />

        {/* Left items */}
        {Array.from({ length: leftBoxes }).map((_, i) => (
          <g key={`lb-${i}`} transform={`translate(${26 + i * 22}, 48)`}>
            <rect width="19" height="18" rx="3" fill="#1D4ED8" />
            <text
              x="9.5"
              y="13"
              textAnchor="middle"
              fill="#FFF"
              fontSize="10"
              fontWeight="700"
              fontFamily="monospace"
            >
              {boxLabel}
            </text>
          </g>
        ))}
        {Array.from({ length: leftWeights }).map((_, i) => (
          <g
            key={`lw-${i}`}
            transform={`translate(${26 + leftBoxes * 21 + (i % 3) * 12}, ${
              56 - Math.floor(i / 3) * 11
            })`}
          >
            <rect width="10" height="10" rx="2" fill="#0D7A5F" />
            <text x="5" y="8" textAnchor="middle" fill="#FFF" fontSize="7" fontWeight="700">
              1
            </text>
          </g>
        ))}

        {/* Right items */}
        {Array.from({ length: rightBoxes }).map((_, i) => (
          <g key={`rb-${i}`} transform={`translate(${174 + i * 22}, 48)`}>
            <rect width="19" height="18" rx="3" fill="#1D4ED8" />
            <text
              x="9.5"
              y="13"
              textAnchor="middle"
              fill="#FFF"
              fontSize="10"
              fontWeight="700"
              fontFamily="monospace"
            >
              {boxLabel}
            </text>
          </g>
        ))}
        {Array.from({ length: rightWeights }).map((_, i) => (
          <g
            key={`rw-${i}`}
            transform={`translate(${174 + rightBoxes * 21 + (i % 3) * 12}, ${
              56 - Math.floor(i / 3) * 11
            })`}
          >
            <rect width="10" height="10" rx="2" fill="#0D7A5F" />
            <text x="5" y="8" textAnchor="middle" fill="#FFF" fontSize="7" fontWeight="700">
              1
            </text>
          </g>
        ))}
      </svg>
      {caption && (
        <span className="mt-1 font-mono text-[11px] font-semibold text-[var(--ink-muted)]">
          {caption}
        </span>
      )}
    </div>
  );
}

export function JajargenjangDiagram() {
  return (
    <svg
      viewBox="0 0 260 140"
      className="h-36 w-full max-w-[260px]"
      role="img"
      aria-label="Persegi panjang 16 cm dipotong menjadi jajargenjang luas 96 cm persegi"
    >
      <rect x="30" y="26" width="180" height="96" fill="#FFFFFF" stroke="#101828" strokeWidth="2" />
      <polygon points="30,26 210,74 210,122 30,74" fill="#EBF2FE" stroke="#1D4ED8" strokeWidth="2" />
      <line x1="25" y1="50" x2="35" y2="50" stroke="#101828" strokeWidth="2" />
      <line x1="25" y1="98" x2="35" y2="98" stroke="#101828" strokeWidth="2" />
      <line x1="205" y1="50" x2="215" y2="50" stroke="#101828" strokeWidth="2" />
      <line x1="205" y1="98" x2="215" y2="98" stroke="#101828" strokeWidth="2" />
      <text x="120" y="18" textAnchor="middle" fontSize="12" fontWeight="700" fill="#101828" fontFamily="monospace">
        16 cm
      </text>
      <text x="224" y="54" fontSize="12" fontWeight="700" fill="#1D4ED8" fontFamily="monospace">
        x
      </text>
      <text x="224" y="102" fontSize="12" fontWeight="700" fill="#1D4ED8" fontFamily="monospace">
        x
      </text>
      <text x="120" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1D4ED8" fontFamily="monospace">
        L = 96 cm²
      </text>
    </svg>
  );
}

export function SegitigaPtLsvDiagram() {
  return (
    <svg
      viewBox="0 0 220 120"
      className="h-28 w-full max-w-[220px]"
      role="img"
      aria-label="Segitiga alas 10 cm dan tinggi x"
    >
      <polygon points="30,96 190,96 120,22" fill="#FEF7E6" stroke="#9A4A06" strokeWidth="2" />
      <line x1="120" y1="22" x2="120" y2="96" stroke="#1D4ED8" strokeWidth="2" strokeDasharray="4 3" />
      <rect x="108" y="84" width="12" height="12" fill="none" stroke="#0D7A5F" strokeWidth="1.5" />
      <text x="132" y="64" fontSize="13" fontWeight="700" fill="#1D4ED8" fontFamily="monospace">
        x
      </text>
      <text x="110" y="114" textAnchor="middle" fontSize="12" fontWeight="700" fill="#101828" fontFamily="monospace">
        10 cm
      </text>
    </svg>
  );
}

export function KelilingBangunDiagram() {
  return (
    <svg
      viewBox="0 0 220 120"
      className="h-28 w-full max-w-[220px]"
      role="img"
      aria-label="Bangun segi enam dengan dua sisi 8 cm dan empat sisi sama panjang w"
    >
      <polygon
        points="110,104 56,50 83,23 110,50 137,23 164,50"
        fill="#FDEEEB"
        stroke="#C83E2B"
        strokeWidth="2"
      />
      <line x1="66" y1="32" x2="74" y2="40" stroke="#101828" strokeWidth="1.8" />
      <line x1="93" y1="40" x2="101" y2="32" stroke="#101828" strokeWidth="1.8" />
      <line x1="119" y1="32" x2="127" y2="40" stroke="#101828" strokeWidth="1.8" />
      <line x1="146" y1="40" x2="154" y2="32" stroke="#101828" strokeWidth="1.8" />
      <text x="64" y="92" fontSize="11" fontWeight="700" fill="#101828" fontFamily="monospace">
        8 cm
      </text>
      <text x="134" y="92" fontSize="11" fontWeight="700" fill="#101828" fontFamily="monospace">
        8 cm
      </text>
      <text x="166" y="34" fontSize="13" fontWeight="700" fill="#1D4ED8" fontFamily="monospace">
        w
      </text>
    </svg>
  );
}

export function TimbanganTelurDiagram() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex flex-col items-center rounded-lg border border-[var(--border-subtle)] bg-white p-3">
        <svg viewBox="0 0 220 110" className="h-24 w-full max-w-[220px]">
          <g transform="rotate(8 110 72)">
            <line x1="34" y1="68" x2="186" y2="68" stroke="#101828" strokeWidth="4" strokeLinecap="round" />
            <rect x="24" y="42" width="48" height="24" rx="4" fill="#0D7A5F" />
            <text x="48" y="58" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="700" fontFamily="monospace">
              250 g
            </text>
            <rect x="144" y="40" width="54" height="26" rx="10" fill="#FEF7E6" stroke="#9A4A06" strokeWidth="2" />
            <text x="171" y="57" textAnchor="middle" fill="#9A4A06" fontSize="10" fontWeight="700" fontFamily="monospace">
              5 Telur
            </text>
          </g>
          <polygon points="110,72 94,102 126,102" fill="#101828" />
        </svg>
        <span className="font-mono text-xs font-bold text-[var(--cobalt)]">
          250 g &lt; 5 telur (telur lebih berat)
        </span>
      </div>

      <div className="flex flex-col items-center rounded-lg border border-[var(--border-subtle)] bg-white p-3">
        <svg viewBox="0 0 220 110" className="h-24 w-full max-w-[220px]">
          <g transform="rotate(-8 110 72)">
            <line x1="34" y1="68" x2="186" y2="68" stroke="#101828" strokeWidth="4" strokeLinecap="round" />
            <rect x="24" y="42" width="48" height="24" rx="4" fill="#0D7A5F" />
            <text x="48" y="58" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="700" fontFamily="monospace">
              260 g
            </text>
            <rect x="144" y="40" width="54" height="26" rx="10" fill="#FEF7E6" stroke="#9A4A06" strokeWidth="2" />
            <text x="171" y="57" textAnchor="middle" fill="#9A4A06" fontSize="10" fontWeight="700" fontFamily="monospace">
              5 Telur
            </text>
          </g>
          <polygon points="110,72 94,102 126,102" fill="#101828" />
        </svg>
        <span className="font-mono text-xs font-bold text-[var(--vermilion)]">
          260 g &gt; 5 telur (bandul lebih berat)
        </span>
      </div>
    </div>
  );
}

export function BelahKetupatDiagram({
  variant = "main",
}: {
  variant?: "main" | "alt1" | "alt2" | "alt3" | "alt4";
}) {
  return (
    <svg
      viewBox="0 0 280 148"
      className="h-36 w-full max-w-[280px]"
      role="img"
      aria-label="Persegi panjang 14 cm kali x dipotong pola belah ketupat di bagian tengah"
    >
      <rect
        x="30"
        y="28"
        width="196"
        height="96"
        fill={variant === "alt4" ? "#EBF2FE" : variant === "alt2" ? "#FFFFFF" : "#D6E6FD"}
        stroke="#101828"
        strokeWidth="2"
      />

      {variant === "alt2" ? (
        <>
          <rect x="128" y="28" width="98" height="96" fill="#BFDBFE" stroke="#1D4ED8" strokeWidth="2" />
          <line x1="128" y1="28" x2="226" y2="76" stroke="#1D4ED8" strokeWidth="1.5" />
          <line x1="128" y1="124" x2="226" y2="76" stroke="#1D4ED8" strokeWidth="1.5" />
          <polygon
            points="128,28 226,76 128,124 30,76"
            fill="none"
            stroke="#475467"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text x="177" y="140" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#1D4ED8" fontFamily="monospace">
            7 cm (gabungan 4Δ)
          </text>
        </>
      ) : (
        <polygon
          points="128,28 226,76 128,124 30,76"
          fill={variant === "alt3" ? "#E6F6F1" : "#FFFFFF"}
          stroke={variant === "alt3" ? "#0D7A5F" : "#1D4ED8"}
          strokeWidth="2"
        />
      )}

      {variant === "alt1" && (
        <>
          <text x="48" y="46" fontSize="10" fontWeight="700" fill="#1D4ED8" fontFamily="monospace">L1</text>
          <text x="198" y="46" fontSize="10" fontWeight="700" fill="#1D4ED8" fontFamily="monospace">L2</text>
          <text x="198" y="114" fontSize="10" fontWeight="700" fill="#1D4ED8" fontFamily="monospace">L3</text>
          <text x="48" y="114" fontSize="10" fontWeight="700" fill="#1D4ED8" fontFamily="monospace">L4</text>
        </>
      )}

      {variant === "alt3" && (
        <>
          <line x1="30" y1="76" x2="226" y2="76" stroke="#0D7A5F" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="128" y1="28" x2="128" y2="124" stroke="#0D7A5F" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="128" y="72" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0D7A5F" fontFamily="monospace">
            d₂ = 14, d₁ = x
          </text>
        </>
      )}

      <text x="128" y="18" textAnchor="middle" fontSize="12" fontWeight="700" fill="#101828" fontFamily="monospace">
        14 cm
      </text>
      <text x="242" y="80" fontSize="13" fontWeight="700" fill="#1D4ED8" fontFamily="monospace">
        x
      </text>
    </svg>
  );
}

export function KebunKolamDiagram() {
  return (
    <svg
      viewBox="0 0 240 160"
      className="h-36 w-full max-w-[240px]"
      role="img"
      aria-label="Kebun persegi 20 meter kali 20 meter berisi kolam persegi panjang lebar 8 meter dan panjang x"
    >
      <rect x="44" y="24" width="128" height="118" fill="#E6F6F1" stroke="#0D7A5F" strokeWidth="2" rx="4" />
      <rect x="58" y="54" width="100" height="54" fill="#EBF2FE" stroke="#1D4ED8" strokeWidth="2" rx="3" />
      <text x="108" y="16" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#0D7A5F" fontFamily="monospace">
        Kebun 20 m
      </text>
      <text x="196" y="86" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#0D7A5F" fontFamily="monospace">
        20 m
      </text>
      <text x="108" y="78" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1D4ED8" fontFamily="monospace">
        Kolam ≥ 112 m²
      </text>
      <text x="108" y="96" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#1D4ED8" fontFamily="monospace">
        panjang = x, lebar = 8 m
      </text>
    </svg>
  );
}
