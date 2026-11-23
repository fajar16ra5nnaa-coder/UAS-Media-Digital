import { describe, expect, it } from "vitest";
import {
  DIAGNOSTIC_QUESTIONS,
  LKPD_STAGES,
  QUIZ_BANK,
  SANDBOX_MISSIONS,
} from "@/lib/content/plsv-curriculum";
import { createEquation, verifySubstitution } from "@/lib/math/plsv-engine";
import { rat } from "@/lib/math/rational";

describe("Review Focus #3: mathematical integrity of all PLSV curriculum items", () => {
  it("verifies all 10 Sandbox missions solve cleanly to their declared expectedX", () => {
    expect(SANDBOX_MISSIONS).toHaveLength(10);
    for (const mission of SANDBOX_MISSIONS) {
      const eq = createEquation(
        mission.leftX,
        mission.leftC,
        mission.rightX,
        mission.rightC
      );
      const check = verifySubstitution(eq, rat(mission.expectedX));
      expect(check.isEqual, `Mission ${mission.id} failed substitution`).toBe(true);
    }
  });

  it("verifies all 10 Diagnostic questions cover all 3 Sarla et al. categories with valid options & equations", () => {
    expect(DIAGNOSTIC_QUESTIONS).toHaveLength(10);
    const categories = new Set(DIAGNOSTIC_QUESTIONS.map((q) => q.category));
    expect(categories).toEqual(
      new Set(["klasifikasional", "korelasional", "teoritikal"])
    );

    for (const q of DIAGNOSTIC_QUESTIONS) {
      const ids = q.options.map((o) => o.id);
      expect(new Set(ids).size).toBe(q.options.length);
      expect(ids).toContain(q.correctOptionId);
      expect(q.equivalenceSteps.length).toBeGreaterThanOrEqual(1);

      if (q.verificationEquation) {
        const { leftX, leftC, rightX, rightC, expectedX } = q.verificationEquation;
        const eq = createEquation(leftX, leftC, rightX, rightC);
        expect(
          verifySubstitution(eq, rat(expectedX)).isEqual,
          `Diagnostic ${q.id} math mismatch`
        ).toBe(true);
      }
    }
  });

  it("verifies all 16 Quiz items have valid unique answers and mathematically true equation roots", () => {
    expect(QUIZ_BANK).toHaveLength(16);
    for (const q of QUIZ_BANK) {
      const ids = q.options.map((o) => o.id);
      expect(new Set(ids).size).toBe(q.options.length);
      expect(ids).toContain(q.correctOptionId);

      if (q.verificationEquation) {
        const { leftX, leftC, rightX, rightC, expectedX } = q.verificationEquation;
        const eq = createEquation(leftX, leftC, rightX, rightC);
        expect(
          verifySubstitution(eq, rat(expectedX)).isEqual,
          `Quiz ${q.id} math mismatch`
        ).toBe(true);
      }
    }
  });

  it("verifies LKPD has 4 structured stages with valid Stage 2 balance equations", () => {
    expect(LKPD_STAGES).toHaveLength(4);
    expect(LKPD_STAGES[0].classificationCards.length).toBe(8);
    for (const caseItem of LKPD_STAGES[1].balanceCases) {
      const eq = createEquation(
        caseItem.leftX,
        caseItem.leftC,
        caseItem.rightX,
        caseItem.rightC
      );
      expect(verifySubstitution(eq, rat(caseItem.expectedX)).isEqual).toBe(true);
    }
  });
});
