export interface Rational {
  readonly num: number;
  readonly den: number;
}

export class DivisionByZeroError extends Error {
  constructor(message = "Pembagian dengan nol tidak terdefinisi dalam matematika.") {
    super(message);
    this.name = "DivisionByZeroError";
  }
}

function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x === 0 ? 1 : x;
}

export function rat(num: number, den = 1): Rational {
  if (!Number.isFinite(num) || !Number.isFinite(den)) {
    throw new Error("Nilai pembilang dan penyebut harus berupa bilangan berhingga.");
  }
  if (den === 0) {
    throw new DivisionByZeroError();
  }
  // Handle decimal inputs gracefully if passed (up to 4 decimal places)
  let n = num;
  let d = den;
  if (!Number.isInteger(n) || !Number.isInteger(d)) {
    const scale = 10000;
    n = Math.round(n * scale);
    d = Math.round(d * scale);
  }
  if (n === 0) {
    return { num: 0, den: 1 };
  }
  const sign = d < 0 ? -1 : 1;
  const absN = Math.abs(n);
  const absD = Math.abs(d);
  const divisor = gcd(absN, absD);
  return {
    num: (n < 0 ? -1 : 1) * sign * (absN / divisor),
    den: absD / divisor,
  };
}

export function addRat(a: Rational, b: Rational): Rational {
  return rat(a.num * b.den + b.num * a.den, a.den * b.den);
}

export function subRat(a: Rational, b: Rational): Rational {
  return rat(a.num * b.den - b.num * a.den, a.den * b.den);
}

export function mulRat(a: Rational, b: Rational): Rational {
  return rat(a.num * b.num, a.den * b.den);
}

export function divRat(a: Rational, b: Rational): Rational {
  if (b.num === 0) {
    throw new DivisionByZeroError();
  }
  return rat(a.num * b.den, a.den * b.num);
}

export function negRat(a: Rational): Rational {
  return { num: a.num === 0 ? 0 : -a.num, den: a.den };
}

export function eqRat(a: Rational, b: Rational): boolean {
  return a.num * b.den === b.num * a.den;
}

export function compareRat(a: Rational, b: Rational): -1 | 0 | 1 {
  const diff = a.num * b.den - b.num * a.den;
  if (diff < 0) return -1;
  if (diff > 0) return 1;
  return 0;
}

export function isIntegerRat(a: Rational): boolean {
  return a.den === 1;
}

export function toNumber(a: Rational): number {
  return a.num / a.den;
}

export function formatRat(a: Rational): string {
  if (a.den === 1) return `${a.num}`;
  return `${a.num}/${a.den}`;
}

export function parseRationalInput(raw: string): Rational | null {
  const cleaned = raw.trim().replace(/,/g, ".");
  if (!cleaned) return null;
  if (/^-?\d+\s*\/\s*-?\d+$/.test(cleaned)) {
    const [nStr, dStr] = cleaned.split("/");
    const n = Number(nStr.trim());
    const d = Number(dStr.trim());
    if (d === 0) return null;
    return rat(n, d);
  }
  if (/^-?\d+(\.\d+)?$/.test(cleaned)) {
    return rat(Number(cleaned), 1);
  }
  return null;
}
