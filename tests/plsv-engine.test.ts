import { describe, expect, it } from "vitest";
import {
  applyBothSides,
  applySingleSide,
  checkSolved,
  createEquation,
  evaluateSide,
  formatEquation,
  verifySubstitution,
} from "@/lib/math/plsv-engine";
import { eqRat, rat } from "@/lib/math/rational";

describe("PLSV balance engine", () => {
  it("creates a balanced equation and computes exact targetX", () => {
    const eq = createEquation(2, 3, 1, 7); // 2x + 3 = x + 7 -> x = 4
    expect(eq.isBalanced).toBe(true);
    expect(eq.targetX).toEqual(rat(4));
    expect(formatEquation(eq.left, eq.right)).toBe("2x + 3 = x + 7");
    expect(eq.history).toHaveLength(1);
  });

  it("solves 2x + 3 = x + 7 through valid two-side operations with ↔ trace", () => {
    let eq = createEquation(2, 3, 1, 7);

    const step1 = applyBothSides(eq, { kind: "sub_x", amount: 1 });
    expect(step1.ok).toBe(true);
    if (!step1.ok) return;
    eq = step1.state;
    expect(formatEquation(eq.left, eq.right)).toBe("x + 3 = 7");
    expect(eq.zeroPairsCancelled).toBeGreaterThanOrEqual(1);

    const step2 = applyBothSides(eq, { kind: "sub_const", amount: 3 });
    expect(step2.ok).toBe(true);
    if (!step2.ok) return;
    eq = step2.state;
    expect(formatEquation(eq.left, eq.right)).toBe("x = 4");

    const solved = checkSolved(eq);
    expect(solved.solved).toBe(true);
    expect(solved.solution).toEqual(rat(4));
    expect(eq.history).toHaveLength(3);
  });

  it("solves equations with negative constants and negative coefficients", () => {
    let eq = createEquation(-2, 6, 0, 2); // -2x + 6 = 2 -> x = 2
    expect(eq.targetX).toEqual(rat(2));

    const s1 = applyBothSides(eq, { kind: "sub_const", amount: 6 });
    expect(s1.ok).toBe(true);
    if (!s1.ok) return;

    const s2 = applyBothSides(s1.state, { kind: "div_const", amount: -2 });
    expect(s2.ok).toBe(true);
    if (!s2.ok) return;

    const solved = checkSolved(s2.state);
    expect(solved.solved).toBe(true);
    expect(solved.solution).toEqual(rat(2));
  });

  it("Review Focus #1: rejects division by zero without mutating state", () => {
    const eq = createEquation(2, 3, 0, 7);
    const res = applyBothSides(eq, { kind: "div_const", amount: 0 });
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.errorCode).toBe("DIVIDE_BY_ZERO");
    expect(eq.left.x).toEqual(rat(2));
  });

  it("Review Focus #1: keeps exact fractions and warns when dividing before clearing constant", () => {
    const eq = createEquation(2, 3, 0, 7); // 2x + 3 = 7
    const res = applyBothSides(eq, { kind: "div_const", amount: 2 });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.warningCode).toBe("PRODUCES_FRACTION");
    expect(res.state.left.x).toEqual(rat(1));
    expect(res.state.left.c).toEqual(rat(3, 2));
    expect(res.state.right.c).toEqual(rat(7, 2));
    expect(formatEquation(res.state.left, res.state.right)).toBe("x + 3/2 = 7/2");
  });

  it("tilts the balance when applying an operation to only one side", () => {
    const eq = createEquation(2, 3, 0, 9); // x = 3
    const tilted = applySingleSide(eq, "left", 0, 2); // left is now 11, right is 9
    expect(tilted.isBalanced).toBe(false);
    expect(tilted.relation).toBe(">");
    expect(eqRat(evaluateSide(tilted.left, tilted.targetX), rat(11))).toBe(true);
    expect(eqRat(evaluateSide(tilted.right, tilted.targetX), rat(9))).toBe(true);
  });

  it("verifies substitution accurately for correct and incorrect candidates", () => {
    const eq = createEquation(3, -5, 1, 7); // 3x - 5 = x + 7 -> x = 6
    const ok = verifySubstitution(eq, rat(6));
    expect(ok.isEqual).toBe(true);
    expect(ok.leftVal).toEqual(rat(13));
    expect(ok.rightVal).toEqual(rat(13));

    const wrong = verifySubstitution(eq, rat(2));
    expect(wrong.isEqual).toBe(false);
  });
});
