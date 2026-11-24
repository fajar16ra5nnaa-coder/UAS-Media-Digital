import { describe, expect, it } from "vitest";
import {
  LKS1_CONTENT,
  LKS2_CONTENT,
  LKS3_CONTENT,
  isAcceptedMathAnswer,
} from "../src/lib/content/lkpd-user-content";
import {
  USER_EVALUATION_PROBLEMS,
  evaluateCreativeSubmission,
} from "../src/lib/content/evaluasi-user-content";

describe("User-approved 3-LKS LKPD content & confirmed typo fixes", () => {
  it("preserves album rosie price verbatim (Rp4.000.000 / Rp500.000) per user choice", () => {
    expect(LKS1_CONTENT.introContext.story).toContain("Rp4.000.000");
    expect(LKS1_CONTENT.introContext.story).toContain("Rp500.000");
  });

  it("applies all 5 confirmed mathematical typo corrections across LKS 1-3", () => {
    // 1. Consistent variable x in LKS 1 open sentence example
    expect(LKS1_CONTENT.openSentenceExample.statement).toContain("bilangan x");
    expect(LKS1_CONTENT.openSentenceExample.formula).toContain("x");

    // 2. Corrected basketball balance solution x = 6 (not 3)
    expect(LKS1_CONTENT.basketballWorkedExample.solutionValue).toBe(6);
    expect(LKS1_CONTENT.basketballWorkedExample.conclusion).toContain("x = 6");
    expect(LKS1_CONTENT.basketballWorkedExample.conclusion).toContain("{6}");

    // 3. Clarified Alif sentence 4 as "kurang dari 80" for x < 80
    const alif4 = LKS2_CONTENT.alifMatching.find((a) => a.id === "alif4");
    expect(alif4?.sentence).toContain("kurang dari 80");
    expect(alif4?.expectedSymbol).toBe("x < 80");

    // 4. Corrected row 4 inequality sign check to "<" for "kurang dari"
    const sign4 = LKS2_CONTENT.inequalitySignChecks.find(
      (s) => s.id === "isc4"
    );
    expect(sign4?.text).toContain("tanda <");
    expect(sign4?.text).toContain("kurang dari");

    // 5. Consistent variable z in LKS 3 positive division pattern
    const divPos = LKS3_CONTENT.observationPatterns.find((p) =>
      p.left.includes("3z < 18")
    );
    expect(divPos?.left).toContain("z < 6");
    expect(divPos?.right).toContain("z > 6");
  });

  it("matches student math input tolerating whitespace and unicode minus", () => {
    expect(isAcceptedMathAnswer(" 4x − 9 ", ["4x-9"])).toBe(true);
    expect(isAcceptedMathAnswer("6y - 12", ["6y-12"])).toBe(true);
    expect(isAcceptedMathAnswer("-3", ["-3", "p=-3"])).toBe(true);
    expect(isAcceptedMathAnswer("", ["15"])).toBe(false);
  });
});

describe("User-approved 4-Question Creative Evaluation & Multi-Alternative Feedback", () => {
  it("contains all 4 problems with full multi-alternative answer keys and zero scoring rubric", () => {
    expect(USER_EVALUATION_PROBLEMS).toHaveLength(4);
    expect(USER_EVALUATION_PROBLEMS[0].alternatives).toHaveLength(5);
    expect(USER_EVALUATION_PROBLEMS[1].alternatives).toHaveLength(4);
    expect(USER_EVALUATION_PROBLEMS[2].alternatives).toHaveLength(2);
    expect(USER_EVALUATION_PROBLEMS[3].alternatives).toHaveLength(3);
    expect(USER_EVALUATION_PROBLEMS[3].numberLineSummary?.op).toBe("<=");

    const serialized = JSON.stringify(USER_EVALUATION_PROBLEMS).toLowerCase();
    expect(serialized).not.toContain("pedoman penskoran");
    expect(serialized).not.toContain("skor 4");
    expect(serialized).not.toContain("skor 3");
  });

  it("evaluates quick-checks and counts answered problems accurately", () => {
    const res = evaluateCreativeSubmission(
      {
        q1_work: "Tidak benar, 50.000x = 1.500.000 maka x = 30 pcs",
        q2a: "56 = 14x; 28 = 7x; 28 = 4 * 0.5 * (x/2) * 7",
        q2b: "x = 4 cm",
        q3a: "8x >= 112 maka x >= 14, pilihan 14, 15, 20 m",
        q4a: "5 + 3x <= 30 maka x <= 8.3 jam",
      },
      {
        qc1: "30 pcs",
        qc2: "4 cm",
        qc3: "20 m",
        qc4: "23 kg",
      }
    );

    expect(res.answeredProblems).toBe(4);
    expect(res.matchedQuickChecks).toBe(4);
    expect(res.quickCheckMatches.eval1).toBe(true);
    expect(res.quickCheckMatches.eval2).toBe(true);
    expect(res.quickCheckMatches.eval3).toBe(true);
    expect(res.quickCheckMatches.eval4).toBe(true);
  });
});
