// Authentic 4-Question Posttest Kemampuan Berpikir Kreatif from lecturer-approved
// "Soal Tes dan kunci jawaban.pdf".
// Per explicit user instruction: scoring rubrics ("pedoman penskoran") are IGNORED/OMITTED,
// and the full multi-alternative Kunci Jawaban is surfaced as rich feedback after submission.

export interface EvalAlternative {
  readonly title: string;
  readonly known: readonly string[];
  readonly steps: readonly string[];
  readonly conclusion: string;
  readonly diagramVariant?: "alt1" | "alt2" | "alt3" | "alt4";
}

export interface EvalSubQuestion {
  readonly key: string;
  readonly label: string;
  readonly placeholder: string;
  readonly inputKind: "textarea" | "yesno_reason" | "number_and_work";
}

export interface EvaluationProblem {
  readonly id: string;
  readonly number: 1 | 2 | 3 | 4;
  readonly topic: "PLSV" | "PtLSV";
  readonly title: string;
  readonly prompt: string;
  readonly subQuestions: readonly EvalSubQuestion[];
  readonly quickCheck: {
    readonly key: string;
    readonly label: string;
    readonly unit: string;
    readonly acceptedValues: readonly string[];
    readonly expectedDisplay: string;
  };
  readonly alternatives: readonly EvalAlternative[];
  readonly numberLineSummary?: {
    readonly boundaryLabel: string;
    readonly op: "<=" | ">=" | "<" | ">";
    readonly interval: string;
    readonly setBuilder: string;
  };
}

export interface CreativeEvaluationSummary {
  readonly answeredProblems: number;
  readonly totalProblems: number;
  readonly quickCheckMatches: Record<string, boolean>;
  readonly matchedQuickChecks: number;
}

export function normalizeEvalNumber(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/,/g, ".")
    .replace(/\s+/g, "")
    .replace(/(pcs|cm|m2|m²|m|kg|jam)$/i, "");
}

export function evaluateCreativeSubmission(
  responses: Record<string, string>,
  quickChecks: Record<string, string>
): CreativeEvaluationSummary {
  let answeredProblems = 0;
  let matchedQuickChecks = 0;
  const quickCheckMatches: Record<string, boolean> = {};

  for (const problem of USER_EVALUATION_PROBLEMS) {
    const hasWrittenAnswer = problem.subQuestions.some(
      (sq) => (responses[sq.key] ?? "").trim().length >= 3
    );
    if (hasWrittenAnswer) answeredProblems += 1;

    const userVal = normalizeEvalNumber(
      quickChecks[problem.quickCheck.key] ?? ""
    );
    const matched =
      userVal.length > 0 &&
      problem.quickCheck.acceptedValues.some(
        (acc) => normalizeEvalNumber(acc) === userVal
      );
    quickCheckMatches[problem.id] = matched;
    if (matched) matchedQuickChecks += 1;
  }

  return {
    answeredProblems,
    totalProblems: USER_EVALUATION_PROBLEMS.length,
    quickCheckMatches,
    matchedQuickChecks,
  };
}

export const USER_EVALUATION_PROBLEMS: readonly EvaluationProblem[] = [
  {
    id: "eval1",
    number: 1,
    topic: "PLSV",
    title: "Penjualan Baju Hasan di Pasar Malam",
    prompt:
      "Hasan menjual baju di pasar malam alun-alun kota. Harga jual baju tersebut adalah Rp50.000 per baju. Adapun harga beli satu baju dari produsen sebesar Rp35.000. Hasan menyimpan uang hasil jualannya dalam sebuah kotak. Setelah selesai berjualan, ia menghitung uang di kotak tersebut yang berjumlah Rp1.500.000. Dari hasil penjualan tersebut, Hasan memperoleh keuntungan sebesar Rp450.000. Sementara itu, jika Hasan ingin mendapat keuntungan Rp1.500.000 ia harus menjual 70 baju lagi. Benarkah bahwa jumlah baju yang dijual Hasan sebanyak 20 pcs? Berikan alasan atas jawaban kalian masing-masing.",
    subQuestions: [
      {
        key: "q1_work",
        label:
          "Benarkah jumlah baju yang dijual Hasan sebanyak 20 pcs? Jelaskan alasan serta langkah penyelesaian PLSV-mu:",
        placeholder:
          "Contoh: Tidak benar. Misalkan x = banyak baju terjual, maka 50.000x = 1.500.000 ↔ x = 30 pcs...",
        inputKind: "yesno_reason",
      },
    ],
    quickCheck: {
      key: "qc1",
      label: "Kesimpulan banyak baju yang terjual",
      unit: "pcs",
      acceptedValues: ["30"],
      expectedDisplay: "30 pcs (pernyataan 20 pcs tidak benar)",
    },
    alternatives: [
      {
        title: "Alternatif 1 — Menggunakan Omset Penjualan",
        known: [
          "Harga jual baju = Rp50.000",
          "Omset penjualan = Rp1.500.000",
        ],
        steps: [
          "Misalkan x = jumlah baju yang dijual.",
          "50.000 × x = 1.500.000",
          "↔ 50.000x = 1.500.000",
          "↔ 50.000x / 50.000 = 1.500.000 / 50.000",
          "↔ x = 30",
        ],
        conclusion:
          "Tidak benar Hasan menjual 20 pcs, melainkan sebanyak 30 pcs.",
      },
      {
        title: "Alternatif 2 — Menggunakan Keuntungan Penjualan",
        known: [
          "Harga jual = Rp50.000 dan Harga beli = Rp35.000",
          "Keuntungan tiap 1 baju = Rp50.000 − Rp35.000 = Rp15.000",
          "Total keuntungan = Rp450.000",
        ],
        steps: [
          "Misalkan x = jumlah baju yang dijual.",
          "15.000 × x = 450.000",
          "↔ 15.000x / 15.000 = 450.000 / 15.000",
          "↔ x = 30",
        ],
        conclusion:
          "Tidak benar Hasan menjual 20 pcs, melainkan sebanyak 30 pcs.",
      },
      {
        title: "Alternatif 3 — Menggunakan Target Tambahan 70 Baju",
        known: [
          "Keuntungan tiap 1 baju = Rp15.000",
          "Menjual 70 baju lagi → total keuntungan menjadi Rp1.500.000",
        ],
        steps: [
          "x × 15.000 + 70 × 15.000 = 1.500.000",
          "↔ 15.000x + 1.050.000 = 1.500.000",
          "↔ 15.000x + 1.050.000 − 1.050.000 = 1.500.000 − 1.050.000",
          "↔ 15.000x = 450.000",
          "↔ 15.000x / 15.000 = 450.000 / 15.000",
          "↔ x = 30",
        ],
        conclusion:
          "Tidak benar Hasan menjual 20 pcs, melainkan sebanyak 30 pcs.",
      },
      {
        title: "Alternatif 4 — Uji Kontradiksi via Omset (Jika 20 pcs)",
        known: [
          "Harga jual = Rp50.000",
          "Uji dugaan terjual = 20 pcs",
          "Omset sebenarnya = Rp1.500.000",
        ],
        steps: [
          "20 × 50.000 = 1.000.000",
          "1.000.000 ≠ 1.500.000",
        ],
        conclusion:
          "Apabila Hasan menjual 20 pcs, uang di kotak hanya Rp1.000.000 (bukan Rp1.500.000). Jadi pernyataan 20 pcs tidak benar.",
      },
      {
        title: "Alternatif 5 — Uji Kontradiksi via Keuntungan (Jika 20 pcs)",
        known: [
          "Keuntungan per baju = Rp15.000",
          "Uji dugaan terjual = 20 pcs",
          "Keuntungan sebenarnya = Rp450.000",
        ],
        steps: [
          "20 × 15.000 = 300.000",
          "300.000 ≠ 450.000",
        ],
        conclusion:
          "Apabila Hasan menjual 20 pcs, keuntungannya hanya Rp300.000 (bukan Rp450.000). Jadi pernyataan 20 pcs tidak benar.",
      },
    ],
  },
  {
    id: "eval2",
    number: 2,
    topic: "PLSV",
    title: "Persegi Panjang Dipotong Pola Belah Ketupat",
    prompt:
      "Perhatikan gambar di bawah ini! Sebuah persegi panjang berukuran panjang 14 cm dan lebar x dengan luas 56 cm² dipotong dengan pola belah ketupat pada bagian tengahnya. Sisa dari hasil pemotongan tersebut membentuk empat segitiga siku-siku identik dengan total luasnya adalah 28 cm².",
    subQuestions: [
      {
        key: "q2a",
        label:
          "a. Buatlah minimal 3 persamaan linear satu variabel yang dapat dibentuk berdasarkan gambar tersebut:",
        placeholder:
          "Persamaan 1: ...\nPersamaan 2: ...\nPersamaan 3: ...",
        inputKind: "textarea",
      },
      {
        key: "q2b",
        label:
          "b. Tentukan nilai x yang memenuhi berdasarkan salah satu persamaan yang kamu susun:",
        placeholder: "Tuliskan langkah penyelesaian aljabar untuk mencari x...",
        inputKind: "number_and_work",
      },
    ],
    quickCheck: {
      key: "qc2",
      label: "Nilai x yang diperoleh",
      unit: "cm",
      acceptedValues: ["4"],
      expectedDisplay: "x = 4 cm",
    },
    alternatives: [
      {
        title: "Alternatif 1 — Jumlah Luas 4 Segitiga Siku-Siku Identik",
        known: [
          "Total luas 4 segitiga siku-siku identik = 28 cm²",
          "Alas tiap segitiga = x/2 dan tinggi = 14/2 = 7 cm",
        ],
        steps: [
          "28 = 4 × (1/2) × alas × tinggi",
          "↔ 28 = 4 × (1/2) × (x/2) × 7",
          "↔ 28 = 7x",
          "↔ 28 / 7 = 7x / 7",
          "↔ x = 4",
        ],
        conclusion: "Nilai x = 4 cm.",
        diagramVariant: "alt1",
      },
      {
        title:
          "Alternatif 2 — Menggabungkan 4 Segitiga Menjadi Persegi Panjang (7 cm × x)",
        known: [
          "Keempat segitiga siku-siku identik dapat disusun menjadi persegi panjang berukuran 7 cm × x dengan luas 28 cm²",
        ],
        steps: [
          "28 = panjang × lebar",
          "↔ 28 = 7 × x",
          "↔ 28 = 7x",
          "↔ 28 / 7 = 7x / 7",
          "↔ x = 4",
        ],
        conclusion: "Nilai x = 4 cm.",
        diagramVariant: "alt2",
      },
      {
        title:
          "Alternatif 3 — Luas Belah Ketupat = Luas Persegi Panjang − Luas 4 Segitiga",
        known: [
          "Diagonal belah ketupat: d₁ = x dan d₂ = 14 cm",
          "Luas belah ketupat = 56 − 28 = 28 cm²",
        ],
        steps: [
          "(1/2) × d₁ × d₂ = 56 − 28",
          "↔ (1/2) × x × 14 = 28",
          "↔ 7x = 28",
          "↔ 7x / 7 = 28 / 7",
          "↔ x = 4",
        ],
        conclusion: "Nilai x = 4 cm.",
        diagramVariant: "alt3",
      },
      {
        title: "Alternatif 4 — Luas Persegi Panjang Utuh (14 cm × x = 56 cm²)",
        known: [
          "Panjang persegi panjang = 14 cm, lebar = x",
          "Luas persegi panjang utuh = 56 cm²",
        ],
        steps: [
          "56 = panjang × lebar",
          "↔ 56 = 14 × x",
          "↔ 56 = 14x",
          "↔ 56 / 14 = 14x / 14",
          "↔ x = 4",
        ],
        conclusion: "Nilai x = 4 cm.",
        diagramVariant: "alt4",
      },
    ],
  },
  {
    id: "eval3",
    number: 3,
    topic: "PtLSV",
    title: "Perancangan Kolam Ikan di Kebun Pak Edi",
    prompt:
      "Pak Edi memiliki kebun berbentuk persegi dengan ukuran sisinya 20 m. Beliau hendak membuat kolam ikan berbentuk persegi panjang di tengah kebun tersebut. Pak Edi ingin luas kolam tersebut minimal 112 m² supaya ikan yang dipelihara dapat berkembang dengan baik.",
    subQuestions: [
      {
        key: "q3a",
        label:
          "a. Apabila lebar kolam 8 m, tuliskan PtLSV-nya dan berikan setidaknya 3 kemungkinan ukuran panjang kolam sehingga luas kolam minimal 112 m²:",
        placeholder:
          "Contoh: 8x ≥ 112 ↔ x ≥ 14. Karena panjang kebun 20 m, kemungkinan panjang: 14 m, 15 m, 16 m...",
        inputKind: "textarea",
      },
      {
        key: "q3b",
        label:
          "b. Jika Pak Edi ingin membuat kolam seluas mungkin dengan hanya mengubah ukuran panjangnya, ukuran panjang manakah yang harus dipilih dan berapa luas maksimumnya?",
        placeholder:
          "Tuliskan alasan memilih ukuran panjang terbesar yang muat di kebun 20 m beserta perhitungan luasnya...",
        inputKind: "number_and_work",
      },
    ],
    quickCheck: {
      key: "qc3",
      label: "Panjang kolam maksimum yang dipilih",
      unit: "m",
      acceptedValues: ["20"],
      expectedDisplay: "20 m (menghasilkan luas maksimum 160 m²)",
    },
    alternatives: [
      {
        title: "Bagian (a) — Menyusun PtLSV & Kemungkinan Panjang Kolam",
        known: [
          "Sisi kebun persegi = 20 m (batas panjang maksimum kolam)",
          "Lebar kolam = 8 m",
          "Luas kolam minimal 112 m²",
        ],
        steps: [
          "Misalkan x = ukuran panjang kolam.",
          "Luas persegi panjang ≥ 112",
          "↔ panjang × lebar ≥ 112",
          "↔ x × 8 ≥ 112",
          "↔ 8x / 8 ≥ 112 / 8",
          "↔ x ≥ 14",
          "Himpunan penyelesaian aljabar: [14, ∞), namun karena kebun berukuran 20 m × 20 m maka x ≤ 20.",
        ],
        conclusion:
          "Kemungkinan ukuran panjang kolam yang memenuhi adalah 14 m, 15 m, 16 m, 17 m, 18 m, 19 m, hingga 20 m (14 ≤ x ≤ 20).",
      },
      {
        title: "Bagian (b) — Ukuran Panjang & Luas Kolam Maksimum",
        known: [
          "Rentang ukuran panjang yang mungkin: 14 m s.d. 20 m",
          "Lebar kolam tetap 8 m",
        ],
        steps: [
          "Agar luas kolam maksimum, pilih nilai x terbesar dalam rentang yang tersedia, yaitu x = 20 m.",
          "Luas maksimum = panjang × lebar = 20 m × 8 m = 160 m².",
        ],
        conclusion:
          "Pak Edi dapat memilih panjang 20 m untuk memperoleh kolam terluas dengan luas 160 m².",
      },
    ],
  },
  {
    id: "eval4",
    number: 4,
    topic: "PtLSV",
    title: "Batas Polutan Mesin Industri Pabrik Merdeka",
    prompt:
      "Pabrik Merdeka menggunakan sebuah mesin dalam proses industri. Ketika memulai bekerja, mesin tersebut menghasilkan 5 kg polutan untuk menghidupkan mesin dan menghasilkan 3 kg polutan setiap jam pemakaiannya. Pabrik tersebut bisa mengelola polutan maksimal sebesar 150 kg per 5 hari kerja supaya polutan tidak mencemari lingkungan.",
    subQuestions: [
      {
        key: "q4a",
        label:
          "a. Buatlah bentuk pertidaksamaan dari durasi penggunaan mesin per hari dan sebutkan minimal 3 himpunan penyelesaian yang memenuhi:",
        placeholder:
          "Batas per hari = 150 ÷ 5 = 30 kg. Model: 5 + 3x ≤ 30 ↔ ...",
        inputKind: "textarea",
      },
      {
        key: "q4b",
        label:
          "b. Nyatakan himpunan penyelesaian pertidaksamaan tersebut dalam 3 cara berbeda (Notasi Interval, Notasi Pembentuk Himpunan, dan Garis Bilangan):",
        placeholder:
          "1. Notasi interval: ...\n2. Notasi pembentuk himpunan: ...\n3. Garis bilangan: ...",
        inputKind: "textarea",
      },
      {
        key: "q4c",
        label:
          "c. Apabila mesin digunakan selama 6 jam setiap harinya, apakah polutan dapat dikelola dengan baik? Tuliskan langkah pembuktian substitusi secara rinci:",
        placeholder: "Substitusi x = 6 ke 5 + 3x ≤ 30: ...",
        inputKind: "yesno_reason",
      },
    ],
    quickCheck: {
      key: "qc4",
      label: "Total polutan saat mesin beroperasi 6 jam/hari",
      unit: "kg",
      acceptedValues: ["23"],
      expectedDisplay: "23 kg (≤ 30 kg, sehingga polutan dapat dikelola dengan baik)",
    },
    numberLineSummary: {
      boundaryLabel: "8,3 (25/3)",
      op: "<=",
      interval: "(−∞, 8,3]  (dalam konteks durasi tak negatif: [0, 8,3])",
      setBuilder: "{x | x ≤ 8,3}",
    },
    alternatives: [
      {
        title: "Bagian (a) — Bentuk PtLSV & Kemungkinan Durasi",
        known: [
          "Polutan awal menghidupkan mesin = 5 kg",
          "Polutan setiap jam pemakaian = 3 kg/jam",
          "Batas pengelolaan polutan = 150 kg / 5 hari kerja = 30 kg per hari",
        ],
        steps: [
          "Misalkan x = durasi pemakaian mesin per hari (dalam jam).",
          "5 + 3x ≤ 30",
          "↔ 5 + 3x − 5 ≤ 30 − 5",
          "↔ 3x ≤ 25",
          "↔ 3x / 3 ≤ 25 / 3",
          "↔ x ≤ 25/3 ≈ 8,3 jam",
        ],
        conclusion:
          "Durasi pemakaian maksimal 8,3 jam per hari (durasi ≥ 0). Contoh 3 penyelesaian yang memenuhi: 1 jam, 5 jam, 8 jam.",
      },
      {
        title: "Bagian (b) — 3 Cara Menyatakan Himpunan Penyelesaian",
        known: ["Hasil pertidaksamaan: x ≤ 8,3 (tepatnya x ≤ 25/3)"],
        steps: [
          "1. Notasi Interval: (−∞, 8,3]  (atau dalam konteks durasi ≥ 0: [0, 8,3])",
          "2. Notasi Pembentuk Himpunan: {x | x ≤ 8,3}",
          "3. Garis Bilangan: bulatan penuh (●) di titik 8,3 dengan panah mengarah ke kiri.",
        ],
        conclusion:
          "Tanda ≤ ditunjukkan dengan kurung siku ']' dan bulatan penuh ● karena batas 8,3 termasuk himpunan penyelesaian.",
      },
      {
        title: "Bagian (c) — Pembuktian Durasi 6 Jam per Hari",
        known: ["Substitusikan x = 6 ke 5 + 3x ≤ 30"],
        steps: [
          "5 + 3(6) ≤ 30",
          "↔ 5 + 18 ≤ 30",
          "↔ 23 ≤ 30   (Bernilai Benar!)",
        ],
        conclusion:
          "YA, polutan dapat dikelola dengan baik karena 23 kg berada di bawah batas maksimal 30 kg/hari sehingga tidak mencemari lingkungan.",
      },
    ],
  },
];
