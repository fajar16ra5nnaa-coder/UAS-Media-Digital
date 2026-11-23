export type MisconceptionCategory =
  | "klasifikasional"
  | "korelasional"
  | "teoritikal";

export type ConfidenceLevel = "yakin" | "ragu";

export type DiagnosticTierStatus =
  | "paham_konsep"
  | "tebak_benar"
  | "miskonsepsi"
  | "tidak_paham";

export interface DiagnosticOption {
  readonly id: string;
  readonly label: string;
  readonly misconceptionCode?: string;
  readonly distractorFeedback?: string;
}

export interface DiagnosticQuestion {
  readonly id: string;
  readonly number: number;
  readonly category: MisconceptionCategory;
  readonly cognitiveLevel: "C2" | "C3" | "C4" | "C5";
  readonly prompt: string;
  readonly equationDisplay?: string;
  readonly options: readonly DiagnosticOption[];
  readonly correctOptionId: string;
  readonly equivalenceSteps: readonly string[];
  readonly conceptSummary: string;
  readonly remedialRoute: string;
  readonly remedialLabel: string;
  readonly verificationEquation?: {
    leftX: number;
    leftC: number;
    rightX: number;
    rightC: number;
    expectedX: number;
  };
}

export interface DiagnosticUserAnswer {
  readonly selectedOptionId: string;
  readonly confidence: ConfidenceLevel;
}

export interface ItemReview {
  readonly questionId: string;
  readonly number: number;
  readonly category: MisconceptionCategory;
  readonly prompt: string;
  readonly equationDisplay?: string;
  readonly selectedOptionId: string;
  readonly selectedLabel: string;
  readonly correctOptionId: string;
  readonly correctLabel: string;
  readonly confidence: ConfidenceLevel;
  readonly isCorrect: boolean;
  readonly tierStatus: DiagnosticTierStatus;
  readonly misconceptionCode?: string;
  readonly feedback: string;
  readonly equivalenceSteps: readonly string[];
  readonly conceptSummary: string;
}

export interface CategorySummary {
  readonly category: MisconceptionCategory;
  readonly label: string;
  readonly total: number;
  readonly correct: number;
  readonly misconceptionCount: number;
  readonly masteryPercent: number;
}

export interface RemedialRecommendation {
  readonly category: MisconceptionCategory;
  readonly title: string;
  readonly reason: string;
  readonly href: string;
  readonly actionLabel: string;
}

export interface DiagnosticReport {
  readonly score: number;
  readonly correctCount: number;
  readonly totalQuestions: number;
  readonly predicate: string;
  readonly categoryBreakdown: Record<MisconceptionCategory, CategorySummary>;
  readonly detectedMisconceptions: readonly string[];
  readonly remedialRecommendations: readonly RemedialRecommendation[];
  readonly itemReviews: readonly ItemReview[];
}

export const CATEGORY_LABELS: Record<MisconceptionCategory, string> = {
  klasifikasional: "Miskonsepsi Klasifikasional (Bentuk & Ekuivalensi PLSV)",
  korelasional: "Miskonsepsi Korelasional (Operasi Kedua Ruas & Pemodelan)",
  teoritikal: "Miskonsepsi Teoritikal (Distributif & Penyederhanaan Aljabar)",
};

export function gradeDiagnosticAttempt(
  questions: readonly DiagnosticQuestion[],
  answers: Record<string, DiagnosticUserAnswer>
): DiagnosticReport {
  const itemReviews: ItemReview[] = [];
  const detectedSet = new Set<string>();
  const remedialMap = new Map<MisconceptionCategory, RemedialRecommendation>();

  const stats: Record<
    MisconceptionCategory,
    { total: number; correct: number; misconceptionCount: number }
  > = {
    klasifikasional: { total: 0, correct: 0, misconceptionCount: 0 },
    korelasional: { total: 0, correct: 0, misconceptionCount: 0 },
    teoritikal: { total: 0, correct: 0, misconceptionCount: 0 },
  };

  let correctCount = 0;

  for (const q of questions) {
    stats[q.category].total += 1;
    const ans = answers[q.id];
    const selectedOpt = q.options.find((o) => o.id === ans?.selectedOptionId);
    const correctOpt = q.options.find((o) => o.id === q.correctOptionId)!;
    const confidence: ConfidenceLevel = ans?.confidence ?? "ragu";
    const isCorrect = selectedOpt?.id === q.correctOptionId;

    let tierStatus: DiagnosticTierStatus;
    if (isCorrect && confidence === "yakin") {
      tierStatus = "paham_konsep";
    } else if (isCorrect && confidence === "ragu") {
      tierStatus = "tebak_benar";
    } else if (!isCorrect && confidence === "yakin") {
      tierStatus = "miskonsepsi";
    } else {
      tierStatus = "tidak_paham";
    }

    if (isCorrect) {
      correctCount += 1;
      stats[q.category].correct += 1;
    } else {
      if (tierStatus === "miskonsepsi") {
        stats[q.category].misconceptionCount += 1;
      }
      if (selectedOpt?.misconceptionCode) {
        detectedSet.add(selectedOpt.misconceptionCode);
      }
      if (!remedialMap.has(q.category)) {
        remedialMap.set(q.category, {
          category: q.category,
          title: CATEGORY_LABELS[q.category],
          reason:
            selectedOpt?.distractorFeedback ??
            "Perlu penguatan konsep pada kategori ini melalui eksplorasi bertahap.",
          href: q.remedialRoute,
          actionLabel: q.remedialLabel,
        });
      }
    }

    const feedback = isCorrect
      ? confidence === "yakin"
        ? "Tepat dan yakin! Pemahaman konsep pada indikator ini sudah kuat."
        : "Jawabanmu benar, namun kamu masih ragu. Pelajari langkah ekuivalensi di bawah agar makin mantap."
      : (selectedOpt?.distractorFeedback ??
        "Jawaban belum tepat. Periksa kembali langkah ekuivalensi kedua ruas di bawah ini.");

    itemReviews.push({
      questionId: q.id,
      number: q.number,
      category: q.category,
      prompt: q.prompt,
      equationDisplay: q.equationDisplay,
      selectedOptionId: selectedOpt?.id ?? "",
      selectedLabel: selectedOpt?.label ?? "Belum dijawab",
      correctOptionId: correctOpt.id,
      correctLabel: correctOpt.label,
      confidence,
      isCorrect,
      tierStatus,
      misconceptionCode: isCorrect ? undefined : selectedOpt?.misconceptionCode,
      feedback,
      equivalenceSteps: q.equivalenceSteps,
      conceptSummary: q.conceptSummary,
    });
  }

  const totalQuestions = questions.length;
  const score =
    totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);

  let predicate = "Perlu Pendampingan Intensif";
  if (score >= 90) predicate = "Sangat Menguasai Konsep";
  else if (score >= 75) predicate = "Menguasai Konsep dengan Baik";
  else if (score >= 60) predicate = "Cukup Paham, Perlu Penguatan";

  const makeCategorySummary = (
    cat: MisconceptionCategory
  ): CategorySummary => {
    const s = stats[cat];
    return {
      category: cat,
      label: CATEGORY_LABELS[cat],
      total: s.total,
      correct: s.correct,
      misconceptionCount: s.misconceptionCount,
      masteryPercent: s.total === 0 ? 100 : Math.round((s.correct / s.total) * 100),
    };
  };

  return {
    score,
    correctCount,
    totalQuestions,
    predicate,
    categoryBreakdown: {
      klasifikasional: makeCategorySummary("klasifikasional"),
      korelasional: makeCategorySummary("korelasional"),
      teoritikal: makeCategorySummary("teoritikal"),
    },
    detectedMisconceptions: Array.from(detectedSet),
    remedialRecommendations: Array.from(remedialMap.values()),
    itemReviews,
  };
}
