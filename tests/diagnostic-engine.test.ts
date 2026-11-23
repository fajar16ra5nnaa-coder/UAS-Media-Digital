import { describe, expect, it } from "vitest";
import { DIAGNOSTIC_QUESTIONS } from "@/lib/content/plsv-curriculum";
import { gradeDiagnosticAttempt } from "@/lib/pedagogy/diagnostic-engine";

describe("diagnostic misconception scorer (Sarla et al., 2025)", () => {
  it("scores 100% Paham Konsep when all answers are correct and confident", () => {
    const answers = Object.fromEntries(
      DIAGNOSTIC_QUESTIONS.map((q) => [
        q.id,
        { selectedOptionId: q.correctOptionId, confidence: "yakin" as const },
      ])
    );

    const report = gradeDiagnosticAttempt(DIAGNOSTIC_QUESTIONS, answers);
    expect(report.score).toBe(100);
    expect(report.correctCount).toBe(DIAGNOSTIC_QUESTIONS.length);
    expect(report.detectedMisconceptions).toHaveLength(0);
    expect(report.categoryBreakdown.klasifikasional.masteryPercent).toBe(100);
    expect(report.categoryBreakdown.korelasional.masteryPercent).toBe(100);
    expect(report.categoryBreakdown.teoritikal.masteryPercent).toBe(100);
  });

  it("classifies confident wrong answers as Miskonsepsi and generates targeted feedback + remedial links", () => {
    const answers = Object.fromEntries(
      DIAGNOSTIC_QUESTIONS.map((q) => {
        const wrongOpt = q.options.find((o) => o.id !== q.correctOptionId)!;
        return [
          q.id,
          { selectedOptionId: wrongOpt.id, confidence: "yakin" as const },
        ];
      })
    );

    const report = gradeDiagnosticAttempt(DIAGNOSTIC_QUESTIONS, answers);
    expect(report.score).toBe(0);
    expect(report.itemReviews.every((r) => r.tierStatus === "miskonsepsi")).toBe(true);
    expect(report.detectedMisconceptions.length).toBeGreaterThan(0);
    expect(report.remedialRecommendations.length).toBeGreaterThan(0);
  });

  it("distinguishes lucky guess (correct + ragu) and tidak paham (wrong + ragu)", () => {
    const [q1, q2] = DIAGNOSTIC_QUESTIONS;
    const wrongQ2 = q2.options.find((o) => o.id !== q2.correctOptionId)!;
    const report = gradeDiagnosticAttempt([q1, q2], {
      [q1.id]: { selectedOptionId: q1.correctOptionId, confidence: "ragu" },
      [q2.id]: { selectedOptionId: wrongQ2.id, confidence: "ragu" },
    });

    expect(report.itemReviews[0].tierStatus).toBe("tebak_benar");
    expect(report.itemReviews[1].tierStatus).toBe("tidak_paham");
  });
});
