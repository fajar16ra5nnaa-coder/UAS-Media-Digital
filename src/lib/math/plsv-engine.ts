import {
  Rational,
  addRat,
  compareRat,
  divRat,
  eqRat,
  formatRat,
  isIntegerRat,
  mulRat,
  rat,
  subRat,
  toNumber,
} from "./rational";

export interface LinearSide {
  readonly x: Rational;
  readonly c: Rational;
}

export interface EquivalenceStep {
  readonly expression: string;
  readonly operationLabel: string;
  readonly isBalanced: boolean;
  readonly relation: "=" | "<" | ">";
}

export interface EquationState {
  readonly initialLeft: LinearSide;
  readonly initialRight: LinearSide;
  readonly left: LinearSide;
  readonly right: LinearSide;
  readonly targetX: Rational;
  readonly isBalanced: boolean;
  readonly relation: "=" | "<" | ">";
  readonly tiltDelta: number; // leftVal - rightVal
  readonly zeroPairsCancelled: number;
  readonly history: readonly EquivalenceStep[];
}

export type BothSidesOp =
  | { kind: "add_const"; amount: number }
  | { kind: "sub_const"; amount: number }
  | { kind: "add_x"; amount: number }
  | { kind: "sub_x"; amount: number }
  | { kind: "mul_const"; amount: number }
  | { kind: "div_const"; amount: number };

export type ApplyErrorCode = "DIVIDE_BY_ZERO" | "MULTIPLY_BY_ZERO" | "ZERO_AMOUNT";
export type ApplyWarningCode = "PRODUCES_FRACTION";

export type ApplyResult =
  | {
      ok: true;
      state: EquationState;
      warningCode?: ApplyWarningCode;
    }
  | {
      ok: false;
      errorCode: ApplyErrorCode;
      message: string;
    };

export function evaluateSide(side: LinearSide, xValue: Rational): Rational {
  return addRat(mulRat(side.x, xValue), side.c);
}

export function formatSide(side: LinearSide): string {
  const parts: string[] = [];

  if (side.x.num !== 0) {
    if (eqRat(side.x, rat(1))) {
      parts.push("x");
    } else if (eqRat(side.x, rat(-1))) {
      parts.push("-x");
    } else {
      parts.push(`${formatRat(side.x)}x`);
    }
  }

  if (side.c.num !== 0) {
    if (parts.length === 0) {
      parts.push(formatRat(side.c));
    } else if (side.c.num > 0) {
      parts.push(`+ ${formatRat(side.c)}`);
    } else {
      const absC = { num: Math.abs(side.c.num), den: side.c.den };
      parts.push(`- ${formatRat(absC)}`);
    }
  }

  return parts.length === 0 ? "0" : parts.join(" ");
}

export function formatEquation(
  left: LinearSide,
  right: LinearSide,
  relation: "=" | "<" | ">" = "="
): string {
  return `${formatSide(left)} ${relation} ${formatSide(right)}`;
}

function computeBalance(
  left: LinearSide,
  right: LinearSide,
  targetX: Rational
): { isBalanced: boolean; relation: "=" | "<" | ">"; tiltDelta: number } {
  const lVal = evaluateSide(left, targetX);
  const rVal = evaluateSide(right, targetX);
  const cmp = compareRat(lVal, rVal);
  const relation: "=" | "<" | ">" = cmp === 0 ? "=" : cmp < 0 ? "<" : ">";
  const tiltDelta = toNumber(subRat(lVal, rVal));
  return { isBalanced: cmp === 0, relation, tiltDelta };
}

function countZeroPairs(before: Rational, delta: Rational): number {
  if (!isIntegerRat(before) || !isIntegerRat(delta)) return 0;
  if (before.num === 0 || delta.num === 0) return 0;
  // Opposite signs create zero-pairs that cancel out
  if ((before.num > 0 && delta.num < 0) || (before.num < 0 && delta.num > 0)) {
    return Math.min(Math.abs(before.num), Math.abs(delta.num));
  }
  return 0;
}

export function createEquation(
  leftX: number,
  leftC: number,
  rightX: number,
  rightC: number
): EquationState {
  const left: LinearSide = { x: rat(leftX), c: rat(leftC) };
  const right: LinearSide = { x: rat(rightX), c: rat(rightC) };
  const netX = subRat(left.x, right.x);
  if (netX.num === 0) {
    throw new Error("Persamaan linear satu variabel harus memiliki koefisien x yang berbeda di kedua ruas.");
  }
  const targetX = divRat(subRat(right.c, left.c), netX);
  const expression = formatEquation(left, right, "=");

  return {
    initialLeft: left,
    initialRight: right,
    left,
    right,
    targetX,
    isBalanced: true,
    relation: "=",
    tiltDelta: 0,
    zeroPairsCancelled: 0,
    history: [
      {
        expression,
        operationLabel: "Persamaan awal",
        isBalanced: true,
        relation: "=",
      },
    ],
  };
}

export function applyBothSides(state: EquationState, op: BothSidesOp): ApplyResult {
  if (op.amount === 0) {
    if (op.kind === "div_const") {
      return {
        ok: false,
        errorCode: "DIVIDE_BY_ZERO",
        message:
          "Tidak boleh membagi kedua ruas dengan 0 karena pembagian dengan nol tidak terdefinisi.",
      };
    }
    if (op.kind === "mul_const") {
      return {
        ok: false,
        errorCode: "MULTIPLY_BY_ZERO",
        message:
          "Mengalikan kedua ruas dengan 0 membuat variabel x hilang (menjadi 0 = 0), bukan persamaan ekuivalen.",
      };
    }
    return {
      ok: false,
      errorCode: "ZERO_AMOUNT",
      message: "Masukkan bilangan selain 0 agar operasi memberi perubahan pada persamaan.",
    };
  }

  const amt = rat(op.amount);
  let nextLeft: LinearSide;
  let nextRight: LinearSide;
  let opLabel = "";
  let cancelled = 0;

  switch (op.kind) {
    case "add_const":
      cancelled =
        countZeroPairs(state.left.c, amt) + countZeroPairs(state.right.c, amt);
      nextLeft = { x: state.left.x, c: addRat(state.left.c, amt) };
      nextRight = { x: state.right.x, c: addRat(state.right.c, amt) };
      opLabel =
        op.amount > 0
          ? `Tambah ${op.amount} pada kedua ruas`
          : `Kurangi ${Math.abs(op.amount)} pada kedua ruas`;
      break;
    case "sub_const": {
      const negAmt = rat(-op.amount);
      cancelled =
        countZeroPairs(state.left.c, negAmt) + countZeroPairs(state.right.c, negAmt);
      nextLeft = { x: state.left.x, c: subRat(state.left.c, amt) };
      nextRight = { x: state.right.x, c: subRat(state.right.c, amt) };
      opLabel =
        op.amount > 0
          ? `Kurangi ${op.amount} pada kedua ruas`
          : `Tambah ${Math.abs(op.amount)} pada kedua ruas`;
      break;
    }
    case "add_x":
      cancelled =
        countZeroPairs(state.left.x, amt) + countZeroPairs(state.right.x, amt);
      nextLeft = { x: addRat(state.left.x, amt), c: state.left.c };
      nextRight = { x: addRat(state.right.x, amt), c: state.right.c };
      opLabel =
        op.amount === 1
          ? "Tambah x pada kedua ruas"
          : op.amount === -1
            ? "Kurangi x pada kedua ruas"
            : op.amount > 0
              ? `Tambah ${op.amount}x pada kedua ruas`
              : `Kurangi ${Math.abs(op.amount)}x pada kedua ruas`;
      break;
    case "sub_x": {
      const negAmt = rat(-op.amount);
      cancelled =
        countZeroPairs(state.left.x, negAmt) + countZeroPairs(state.right.x, negAmt);
      nextLeft = { x: subRat(state.left.x, amt), c: state.left.c };
      nextRight = { x: subRat(state.right.x, amt), c: state.right.c };
      opLabel =
        op.amount === 1
          ? "Kurangi x pada kedua ruas"
          : op.amount === -1
            ? "Tambah x pada kedua ruas"
            : op.amount > 0
              ? `Kurangi ${op.amount}x pada kedua ruas`
              : `Tambah ${Math.abs(op.amount)}x pada kedua ruas`;
      break;
    }
    case "mul_const":
      nextLeft = { x: mulRat(state.left.x, amt), c: mulRat(state.left.c, amt) };
      nextRight = { x: mulRat(state.right.x, amt), c: mulRat(state.right.c, amt) };
      opLabel = `Kalikan kedua ruas dengan ${op.amount}`;
      break;
    case "div_const":
      nextLeft = { x: divRat(state.left.x, amt), c: divRat(state.left.c, amt) };
      nextRight = { x: divRat(state.right.x, amt), c: divRat(state.right.c, amt) };
      opLabel = `Bagi kedua ruas dengan ${op.amount}`;
      break;
  }

  const balance = computeBalance(nextLeft, nextRight, state.targetX);
  const expression = formatEquation(nextLeft, nextRight, balance.relation);
  const producesFraction =
    !isIntegerRat(nextLeft.x) ||
    !isIntegerRat(nextLeft.c) ||
    !isIntegerRat(nextRight.x) ||
    !isIntegerRat(nextRight.c);

  const nextState: EquationState = {
    ...state,
    left: nextLeft,
    right: nextRight,
    isBalanced: balance.isBalanced,
    relation: balance.relation,
    tiltDelta: balance.tiltDelta,
    zeroPairsCancelled: cancelled,
    history: [
      ...state.history,
      {
        expression,
        operationLabel: opLabel,
        isBalanced: balance.isBalanced,
        relation: balance.relation,
      },
    ],
  };

  return {
    ok: true,
    state: nextState,
    warningCode: producesFraction && op.kind === "div_const" ? "PRODUCES_FRACTION" : undefined,
  };
}

export function applySingleSide(
  state: EquationState,
  side: "left" | "right",
  deltaX: number,
  deltaC: number
): EquationState {
  const dx = rat(deltaX);
  const dc = rat(deltaC);

  const nextLeft: LinearSide =
    side === "left"
      ? { x: addRat(state.left.x, dx), c: addRat(state.left.c, dc) }
      : state.left;

  const nextRight: LinearSide =
    side === "right"
      ? { x: addRat(state.right.x, dx), c: addRat(state.right.c, dc) }
      : state.right;

  const cancelled =
    side === "left"
      ? countZeroPairs(state.left.x, dx) + countZeroPairs(state.left.c, dc)
      : countZeroPairs(state.right.x, dx) + countZeroPairs(state.right.c, dc);

  const balance = computeBalance(nextLeft, nextRight, state.targetX);
  const sideLabel = side === "left" ? "ruas kiri saja" : "ruas kanan saja";
  const parts: string[] = [];
  if (deltaX !== 0) parts.push(deltaX > 0 ? `+${deltaX}x` : `${deltaX}x`);
  if (deltaC !== 0) parts.push(deltaC > 0 ? `+${deltaC}` : `${deltaC}`);

  return {
    ...state,
    left: nextLeft,
    right: nextRight,
    isBalanced: balance.isBalanced,
    relation: balance.relation,
    tiltDelta: balance.tiltDelta,
    zeroPairsCancelled: cancelled,
    history: [
      ...state.history,
      {
        expression: formatEquation(nextLeft, nextRight, balance.relation),
        operationLabel: `Eksperimen ${parts.join(" ")} di ${sideLabel}`,
        isBalanced: balance.isBalanced,
        relation: balance.relation,
      },
    ],
  };
}

export function checkSolved(state: EquationState): {
  solved: boolean;
  solution: Rational | null;
} {
  if (!state.isBalanced) {
    return { solved: false, solution: null };
  }
  const leftIsX =
    eqRat(state.left.x, rat(1)) &&
    state.left.c.num === 0 &&
    state.right.x.num === 0;
  if (leftIsX) {
    return { solved: true, solution: state.right.c };
  }
  const rightIsX =
    eqRat(state.right.x, rat(1)) &&
    state.right.c.num === 0 &&
    state.left.x.num === 0;
  if (rightIsX) {
    return { solved: true, solution: state.left.c };
  }
  return { solved: false, solution: null };
}

export function verifySubstitution(
  state: EquationState,
  candidateX: Rational
): { leftVal: Rational; rightVal: Rational; isEqual: boolean } {
  const leftVal = evaluateSide(state.initialLeft, candidateX);
  const rightVal = evaluateSide(state.initialRight, candidateX);
  return {
    leftVal,
    rightVal,
    isEqual: eqRat(leftVal, rightVal),
  };
}
