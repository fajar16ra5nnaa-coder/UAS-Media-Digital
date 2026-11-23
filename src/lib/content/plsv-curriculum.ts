import { DiagnosticQuestion } from "@/lib/pedagogy/diagnostic-engine";

export interface SandboxMission {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly difficulty: "Dasar" | "Menengah" | "Lanjut";
  readonly description: string;
  readonly leftX: number;
  readonly leftC: number;
  readonly rightX: number;
  readonly rightC: number;
  readonly expectedX: number;
  readonly note?: string;
}

export const SANDBOX_MISSIONS: readonly SandboxMission[] = [
  {
    id: "m1",
    number: 1,
    title: "Mengenal Kesetaraan Pertama",
    difficulty: "Dasar",
    description: "Temukan nilai x dengan mengosongkan konstanta di ruas kiri.",
    leftX: 1,
    leftC: 3,
    rightX: 0,
    rightC: 7,
    expectedX: 4,
  },
  {
    id: "m2",
    number: 2,
    title: "Pasangan Nol untuk Pengurangan",
    difficulty: "Dasar",
    description: "Gunakan sifat pasangan nol untuk menetralkan -4 di ruas kiri.",
    leftX: 1,
    leftC: -4,
    rightX: 0,
    rightC: 5,
    expectedX: 9,
  },
  {
    id: "m3",
    number: 3,
    title: "Koefisien Lebih dari Satu",
    difficulty: "Dasar",
    description: "Kosongkan konstanta dulu, lalu bagi kedua ruas dengan koefisien x.",
    leftX: 2,
    leftC: 1,
    rightX: 0,
    rightC: 9,
    expectedX: 4,
  },
  {
    id: "m4",
    number: 4,
    title: "Kombinasi Perkalian dan Pengurangan",
    difficulty: "Dasar",
    description: "Netralkan -5 dengan pasangan nol sebelum membagi kedua ruas.",
    leftX: 3,
    leftC: -5,
    rightX: 0,
    rightC: 10,
    expectedX: 5,
  },
  {
    id: "m5",
    number: 5,
    title: "Variabel di Kedua Ruas",
    difficulty: "Menengah",
    description: "Kumpulkan variabel x ke satu ruas menggunakan operasi setara.",
    leftX: 3,
    leftC: 2,
    rightX: 1,
    rightC: 8,
    expectedX: 3,
  },
  {
    id: "m6",
    number: 6,
    title: "Variabel Lebih Besar di Kanan",
    difficulty: "Menengah",
    description: "Tanda '=' bersifat simetris; variabel boleh dikumpulkan di ruas kanan atau kiri.",
    leftX: 1,
    leftC: 9,
    rightX: 4,
    rightC: 3,
    expectedX: 2,
  },
  {
    id: "m7",
    number: 7,
    title: "Solusi Bilangan Negatif",
    difficulty: "Menengah",
    description: "Ubin negatif (-1) membantu melihat solusi ketika nilai x negatif.",
    leftX: 2,
    leftC: 7,
    rightX: 0,
    rightC: 1,
    expectedX: -3,
  },
  {
    id: "m8",
    number: 8,
    title: "Koefisien Negatif (Anti Sihir Pindah Ruas)",
    difficulty: "Lanjut",
    description: "Perhatikan tanda negatif pada -2x. Bagi kedua ruas dengan -2, bukan ditambah 2.",
    leftX: -2,
    leftC: 6,
    rightX: 0,
    rightC: 2,
    expectedX: 2,
  },
  {
    id: "m9",
    number: 9,
    title: "Negatif di Kedua Ruas",
    difficulty: "Lanjut",
    description: "Selesaikan persamaan dengan konstanta negatif dan variabel di kedua ruas.",
    leftX: 4,
    leftC: -6,
    rightX: 2,
    rightC: -2,
    expectedX: 2,
  },
  {
    id: "m10",
    number: 10,
    title: "Hasil Jabaran Sifat Distributif",
    difficulty: "Lanjut",
    description: "Bentuk 2(x + 3) = 14 setelah dijabarkan menjadi 2x + 6 = 14. Selesaikan!",
    leftX: 2,
    leftC: 6,
    rightX: 0,
    rightC: 14,
    expectedX: 4,
    note: "Bentuk asal: 2(x + 3) = 14 ↔ 2x + 6 = 14",
  },
];

export interface ClassificationCard {
  readonly id: string;
  readonly expression: string;
  readonly isPlsv: boolean;
  readonly explanation: string;
}

export interface LkpdBalanceCase {
  readonly id: string;
  readonly title: string;
  readonly leftX: number;
  readonly leftC: number;
  readonly rightX: number;
  readonly rightC: number;
  readonly expectedX: number;
}

export interface ContextualProblem {
  readonly id: string;
  readonly title: string;
  readonly story: string;
  readonly variablePrompt: string;
  readonly modelOptions: readonly { id: string; label: string; isCorrect: boolean; hint: string }[];
  readonly expectedX: number;
  readonly unitLabel: string;
  readonly finalQuestion: string;
  readonly expectedFinalAnswer: number;
  readonly steps: readonly string[];
}

export interface ErrorAnalysisCase {
  readonly id: string;
  readonly studentName: string;
  readonly problemText: string;
  readonly lines: readonly { lineNo: number; text: string }[];
  readonly wrongLineNo: number;
  readonly reasonOptions: readonly { id: string; label: string; isCorrect: boolean }[];
  readonly correctFinalX: number;
  readonly explanation: string;
}

export const LKPD_STAGES = [
  {
    stageNumber: 1 as const,
    title: "Tahap 1: Orientasi & Klasifikasi PLSV",
    subtitle: "Membedakan PLSV dan bukan PLSV untuk mencegah miskonsepsi klasifikasional.",
    classificationCards: [
      {
        id: "c1",
        expression: "2x + 5 = 11",
        isPlsv: true,
        explanation: "PLSV: memiliki tanda '=', satu variabel (x), dan pangkat tertingginya 1.",
      },
      {
        id: "c2",
        expression: "x² + 3 = 12",
        isPlsv: false,
        explanation: "Bukan PLSV: variabel x berpangkat 2 (persamaan kuadrat, bukan linear).",
      },
      {
        id: "c3",
        expression: "3p - 4 = p + 6",
        isPlsv: true,
        explanation: "PLSV: meski p muncul di kedua ruas, jenis variabelnya tetap satu (p) berpangkat 1.",
      },
      {
        id: "c4",
        expression: "2x + y = 8",
        isPlsv: false,
        explanation: "Bukan PLSV: memiliki dua variabel berbeda (x dan y).",
      },
      {
        id: "c5",
        expression: "4m - 1 > 7",
        isPlsv: false,
        explanation: "Bukan PLSV: memakai tanda ketidaksamaan '>', jadi ini Pertidaksamaan (PtLSV).",
      },
      {
        id: "c6",
        expression: "5x + 3",
        isPlsv: false,
        explanation: "Bukan PLSV: tidak memiliki tanda sama dengan '=' (hanya bentuk/ekspresi aljabar).",
      },
      {
        id: "c7",
        expression: "7 = 2a - 3",
        isPlsv: true,
        explanation: "PLSV: posisi variabel boleh di ruas kanan; tetap satu variabel (a) berpangkat 1 dengan tanda '='.",
      },
      {
        id: "c8",
        expression: "2(x - 1) = 10",
        isPlsv: true,
        explanation: "PLSV: jika dijabarkan menjadi 2x - 2 = 10, bervariabel satu (x) dan berpangkat 1.",
      },
    ] as readonly ClassificationCard[],
  },
  {
    stageNumber: 2 as const,
    title: "Tahap 2: Eksplorasi Sifat Kesetaraan",
    subtitle: "Menemukan prinsip operasi kedua ruas secara langsung melalui timbangan digital.",
    balanceCases: [
      { id: "b1", title: "Kasus A: 2x + 3 = 11", leftX: 2, leftC: 3, rightX: 0, rightC: 11, expectedX: 4 },
      { id: "b2", title: "Kasus B: 3x - 2 = x + 6", leftX: 3, leftC: -2, rightX: 1, rightC: 6, expectedX: 4 },
      { id: "b3", title: "Kasus C: -2x + 8 = 2", leftX: -2, leftC: 8, rightX: 0, rightC: 2, expectedX: 3 },
    ] as readonly LkpdBalanceCase[],
  },
  {
    stageNumber: 3 as const,
    title: "Tahap 3: Pemodelan Masalah Kontekstual",
    subtitle: "Menerjemahkan soal cerita nyata ke model PLSV (bantuan visual mulai dikurangi).",
    problems: [
      {
        id: "p1",
        title: "Taman Persegi Panjang Sekolah",
        story:
          "Sebuah taman berbentuk persegi panjang memiliki panjang (2x + 3) meter dan lebar x meter. Jika keliling taman tersebut adalah 30 meter, berapakah nilai x dan panjang taman?",
        variablePrompt: "x menyatakan lebar taman (dalam meter).",
        modelOptions: [
          {
            id: "m1a",
            label: "(2x + 3) + x = 30",
            isCorrect: false,
            hint: "Hati-hati! Keliling persegi panjang adalah 2 × (panjang + lebar), bukan hanya panjang + lebar.",
          },
          {
            id: "m1b",
            label: "2((2x + 3) + x) = 30",
            isCorrect: true,
            hint: "Tepat! Rumus keliling = 2(p + l), sehingga 2(3x + 3) = 30 ↔ 6x + 6 = 30.",
          },
          {
            id: "m1c",
            label: "2(2x + 3) + x = 30",
            isCorrect: false,
            hint: "Sifat distributif berlaku untuk panjang DAN lebar sekaligus (lebar juga ada 2 sisi).",
          },
        ],
        expectedX: 4,
        unitLabel: "meter",
        finalQuestion: "Panjang taman = 2x + 3 = ... meter",
        expectedFinalAnswer: 11,
        steps: [
          "Keliling = 2 × (panjang + lebar) = 30",
          "↔ 2((2x + 3) + x) = 30",
          "↔ 2(3x + 3) = 30",
          "↔ 6x + 6 = 30   (sifat distributif)",
          "↔ 6x = 24       (kurangi 6 pada kedua ruas)",
          "↔ x = 4         (bagi kedua ruas dengan 6)",
          "Panjang = 2(4) + 3 = 11 meter.",
        ],
      },
      {
        id: "p2",
        title: "Paket Buku Tulis Koperasi",
        story:
          "Raka membeli 4 buku tulis dengan harga sama dan 1 penghapus seharga Rp3.000. Total uang yang dibayarkan Raka adalah Rp23.000. Berapa harga 1 buku tulis (dalam ribuan rupiah, misal x = 5 berarti Rp5.000)?",
        variablePrompt: "x menyatakan harga 1 buku tulis dalam ribuan rupiah.",
        modelOptions: [
          {
            id: "m2a",
            label: "4x + 3 = 23",
            isCorrect: true,
            hint: "Benar! 4 buku (4x) ditambah penghapus (3 ribu) setara dengan 23 ribu.",
          },
          {
            id: "m2b",
            label: "4(x + 3) = 23",
            isCorrect: false,
            hint: "Raka hanya membeli 1 penghapus, bukan 4 penghapus.",
          },
          {
            id: "m2c",
            label: "x + 4 + 3 = 23",
            isCorrect: false,
            hint: "Harga 4 buku tulis adalah 4 dikali x (4x), bukan x ditambah 4.",
          },
        ],
        expectedX: 5,
        unitLabel: "ribu rupiah",
        finalQuestion: "Jadi harga 2 buku tulis adalah ... ribu rupiah",
        expectedFinalAnswer: 10,
        steps: [
          "4x + 3 = 23",
          "↔ 4x + 3 - 3 = 23 - 3   (kurangi 3 pada kedua ruas)",
          "↔ 4x = 20",
          "↔ x = 5                 (bagi kedua ruas dengan 4)",
          "Harga 1 buku = Rp5.000, maka 2 buku = Rp10.000 (10 ribu).",
        ],
      },
    ] as readonly ContextualProblem[],
  },
  {
    stageNumber: 4 as const,
    title: "Tahap 4: Tantangan HOTS (C4–C6)",
    subtitle: "Menganalisis & mengevaluasi kesalahan prosedur, lalu mencipta masalah kontekstual sendiri.",
    errorCases: [
      {
        id: "e1",
        studentName: "Dito",
        problemText: "Selesaikan persamaan: 2(x - 3) = 10",
        lines: [
          { lineNo: 1, text: "2(x - 3) = 10" },
          { lineNo: 2, text: "2x - 3 = 10" },
          { lineNo: 3, text: "2x = 13" },
          { lineNo: 4, text: "x = 6,5" },
        ],
        wrongLineNo: 2,
        reasonOptions: [
          {
            id: "r1a",
            label: "Pada baris 2, angka 2 hanya dikalikan dengan x dan lupa dikalikan dengan -3 (kesalahan sifat distributif).",
            isCorrect: true,
          },
          {
            id: "r1b",
            label: "Pada baris 3, seharusnya 10 dikurangi 3 bukan ditambah 3.",
            isCorrect: false,
          },
          {
            id: "r1c",
            label: "Pada baris 4, 13 dibagi 2 seharusnya 6 bukan 6,5.",
            isCorrect: false,
          },
        ],
        correctFinalX: 8,
        explanation: "2(x - 3) = 10 ↔ 2x - 6 = 10 ↔ 2x = 16 ↔ x = 8.",
      },
      {
        id: "e2",
        studentName: "Sinta",
        problemText: "Selesaikan persamaan: -3x + 4 = 16",
        lines: [
          { lineNo: 1, text: "-3x + 4 = 16" },
          { lineNo: 2, text: "-3x = 12" },
          { lineNo: 3, text: "x = 12 + 3" },
          { lineNo: 4, text: "x = 15" },
        ],
        wrongLineNo: 3,
        reasonOptions: [
          {
            id: "r2a",
            label: "Pada baris 2, 16 - 4 seharusnya 20.",
            isCorrect: false,
          },
          {
            id: "r2b",
            label: "Pada baris 3, Sinta memakai aturan 'pindah ruas ganti tanda' untuk koefisien -3 padahal -3 mengalikan x sehingga kedua ruas harus dibagi -3.",
            isCorrect: true,
          },
          {
            id: "r2c",
            label: "Persamaan dengan koefisien negatif tidak memiliki penyelesaian.",
            isCorrect: false,
          },
        ],
        correctFinalX: -4,
        explanation: "-3x + 4 = 16 ↔ -3x = 12 ↔ x = 12 ÷ (-3) = -4.",
      },
    ] as readonly ErrorAnalysisCase[],
    createProblemTarget: "3x + 5 = 20",
  },
] as const;

export const DIAGNOSTIC_QUESTIONS: readonly DiagnosticQuestion[] = [
  {
    id: "d1",
    number: 1,
    category: "klasifikasional",
    cognitiveLevel: "C2",
    prompt: "Manakah di antara kalimat matematika berikut yang merupakan Persamaan Linear Satu Variabel (PLSV)?",
    options: [
      {
        id: "a",
        label: "x² - 4 = 5",
        misconceptionCode: "M1-Pangkat",
        distractorFeedback: "x² berpangkat dua sehingga merupakan persamaan kuadrat, bukan linear.",
      },
      {
        id: "b",
        label: "3y - 2 = y + 6",
        distractorFeedback: "",
      },
      {
        id: "c",
        label: "2x + y = 10",
        misconceptionCode: "M1-DuaVariabel",
        distractorFeedback: "Terdapat dua variabel berbeda (x dan y), sehingga ini PLDV bukan PLSV.",
      },
      {
        id: "d",
        label: "4x - 1 < 11",
        misconceptionCode: "M1-Pertidaksamaan",
        distractorFeedback: "Tanda '<' menunjukkan pertidaksamaan (PtLSV), bukan persamaan ('=').",
      },
    ],
    correctOptionId: "b",
    equivalenceSteps: [
      "Syarat PLSV: memuat tanda '=', hanya satu jenis variabel, dan pangkat tertinggi variabel adalah 1.",
      "Pada 3y - 2 = y + 6, variabelnya hanya y (meski muncul di dua ruas) dan pangkatnya 1.",
    ],
    conceptSummary: "Variabel yang sama di kedua ruas tetap dihitung sebagai satu variabel.",
    remedialRoute: "/lkpd",
    remedialLabel: "Ulangi Tahap 1 LKPD (Klasifikasi PLSV)",
    verificationEquation: { leftX: 3, leftC: -2, rightX: 1, rightC: 6, expectedX: 4 },
  },
  {
    id: "d2",
    number: 2,
    category: "klasifikasional",
    cognitiveLevel: "C3",
    prompt: "Persamaan manakah yang EKUIVALEN (memiliki himpunan penyelesaian yang sama) dengan persamaan di bawah ini?",
    equationDisplay: "2x + 4 = 10",
    options: [
      {
        id: "a",
        label: "2x = 14",
        misconceptionCode: "M1-SalahEkuivalen",
        distractorFeedback: "Jika +4 dihilangkan dengan mengurangi 4 pada kedua ruas, ruas kanan menjadi 10 - 4 = 6, bukan 14.",
      },
      {
        id: "b",
        label: "x + 4 = 5",
        misconceptionCode: "M1-BagiParsial",
        distractorFeedback: "Jika kedua ruas dibagi 2, suku +4 juga harus dibagi 2 menjadi x + 2 = 5, bukan x + 4 = 5.",
      },
      {
        id: "c",
        label: "x + 2 = 5",
      },
      {
        id: "d",
        label: "2x + 4 = 12",
        misconceptionCode: "M1-OperasiSatuRuas",
        distractorFeedback: "Hanya ruas kanan yang ditambah 2 sehingga kesetaraan rusak.",
      },
    ],
    correctOptionId: "c",
    equivalenceSteps: [
      "2x + 4 = 10",
      "↔ (2x + 4) ÷ 2 = 10 ÷ 2   (bagi kedua ruas dengan 2)",
      "↔ x + 2 = 5",
      "Keduanya memiliki penyelesaian yang sama, yaitu x = 3.",
    ],
    conceptSummary: "Persamaan ekuivalen diperoleh ketika seluruh suku di kedua ruas dikenai operasi setara.",
    remedialRoute: "/sandbox",
    remedialLabel: "Latih Ekuivalensi di Lab Timbangan",
    verificationEquation: { leftX: 2, leftC: 4, rightX: 0, rightC: 10, expectedX: 3 },
  },
  {
    id: "d3",
    number: 3,
    category: "klasifikasional",
    cognitiveLevel: "C2",
    prompt: "Dalam persamaan 8 + 4 = x + 5, makna tanda sama dengan ('=') yang tepat secara matematis adalah...",
    options: [
      {
        id: "a",
        label: "Menunjukkan hasil hitung dari 8 + 4 sehingga x = 12",
        misconceptionCode: "M1-EqualOperasional",
        distractorFeedback: "Ini adalah pandangan operasional tanda '=' (Knuth et al., 2006). Jika x = 12 maka ruas kanan menjadi 17, tidak setara dengan 12.",
      },
      {
        id: "b",
        label: "Menyatakan bahwa nilai keseluruhan ruas kiri setara dengan nilai keseluruhan ruas kanan sehingga x = 7",
      },
      {
        id: "c",
        label: "Menjumlahkan semua angka yang ada sehingga x = 17",
        misconceptionCode: "M1-EqualJumlahSemua",
        distractorFeedback: "Tanda '=' bukan perintah menjumlahkan seluruh angka, melainkan relasi kesetaraan.",
      },
      {
        id: "d",
        label: "Variabel x tidak bisa dicari karena ada tanda '+' setelah '='",
        misconceptionCode: "M1-BentukNonStandar",
        distractorFeedback: "Persamaan tetap sah meskipun kedua ruas memuat operasi hitung.",
      },
    ],
    correctOptionId: "b",
    equivalenceSteps: [
      "8 + 4 = x + 5",
      "↔ 12 = x + 5",
      "↔ 12 - 5 = x + 5 - 5   (kurangi 5 pada kedua ruas)",
      "↔ 7 = x  atau  x = 7",
    ],
    conceptSummary: "Tanda '=' bermakna relasional: nilai ruas kiri sama dengan nilai ruas kanan.",
    remedialRoute: "/sandbox",
    remedialLabel: "Eksplorasi Makna '=' di Lab Timbangan",
    verificationEquation: { leftX: 0, leftC: 12, rightX: 1, rightC: 5, expectedX: 7 },
  },
  {
    id: "d4",
    number: 4,
    category: "korelasional",
    cognitiveLevel: "C3",
    prompt: "Tentukan nilai x yang memenuhi persamaan berikut dengan sifat kesetaraan kedua ruas:",
    equationDisplay: "3x - 7 = x + 5",
    options: [
      {
        id: "a",
        label: "x = -1",
        misconceptionCode: "M2-SalahTandaKurang",
        distractorFeedback: "Periksa langkah penetralan -7: untuk membuat -7 menjadi 0, kedua ruas ditambah +7 (5 + 7 = 12), bukan dikurangi 7.",
      },
      {
        id: "b",
        label: "x = 3",
        misconceptionCode: "M2-SalahGabungX",
        distractorFeedback: "Untuk menghilangkan x di kanan, kedua ruas dikurangi x (3x - x = 2x), bukan dijumlahkan menjadi 4x.",
      },
      {
        id: "c",
        label: "x = 6",
      },
      {
        id: "d",
        label: "x = 12",
        misconceptionCode: "M2-LupaBagiKoefisien",
        distractorFeedback: "2x = 12 belum selesai; kedua ruas masih perlu dibagi 2 sehingga x = 6.",
      },
    ],
    correctOptionId: "c",
    equivalenceSteps: [
      "3x - 7 = x + 5",
      "↔ 3x - x - 7 = x - x + 5   (kurangi x pada kedua ruas)",
      "↔ 2x - 7 = 5",
      "↔ 2x - 7 + 7 = 5 + 7       (tambah 7 pada kedua ruas)",
      "↔ 2x = 12",
      "↔ x = 6                    (bagi kedua ruas dengan 2)",
    ],
    conceptSummary: "Kumpulkan variabel di satu ruas, netralkan konstanta, lalu bagi dengan koefisien x.",
    remedialRoute: "/sandbox",
    remedialLabel: "Coba Misi 5 di Lab Timbangan",
    verificationEquation: { leftX: 3, leftC: -7, rightX: 1, rightC: 5, expectedX: 6 },
  },
  {
    id: "d5",
    number: 5,
    category: "korelasional",
    cognitiveLevel: "C3",
    prompt: "Nilai x yang memenuhi persamaan berikut adalah...",
    equationDisplay: "-4x + 5 = 21",
    options: [
      {
        id: "a",
        label: "x = 4",
        misconceptionCode: "M2-AbaikanTandaNegatif",
        distractorFeedback: "16 dibagi -4 menghasilkan bilangan negatif (-4), bukan +4.",
      },
      {
        id: "b",
        label: "x = -4",
      },
      {
        id: "c",
        label: "x = 20",
        misconceptionCode: "M2-PindahRuasKoefisien",
        distractorFeedback: "Terdeteksi 'sihir pindah ruas': -4 pada -4x adalah faktor pengali, jadi bukan 16 + 4, melainkan 16 ÷ (-4).",
      },
      {
        id: "d",
        label: "x = -6,5",
        misconceptionCode: "M2-SalahNetralKonstanta",
        distractorFeedback: "Untuk menetralkan +5, kedua ruas dikurangi 5 (21 - 5 = 16), bukan ditambah 5.",
      },
    ],
    correctOptionId: "b",
    equivalenceSteps: [
      "-4x + 5 = 21",
      "↔ -4x + 5 - 5 = 21 - 5     (kurangi 5 pada kedua ruas)",
      "↔ -4x = 16",
      "↔ (-4x) ÷ (-4) = 16 ÷ (-4) (bagi kedua ruas dengan -4)",
      "↔ x = -4",
    ],
    conceptSummary: "Koefisien negatif dihilangkan dengan membagi kedua ruas dengan bilangan negatif tersebut.",
    remedialRoute: "/sandbox",
    remedialLabel: "Coba Misi 8 (Koefisien Negatif)",
    verificationEquation: { leftX: -4, leftC: 5, rightX: 0, rightC: 21, expectedX: -4 },
  },
  {
    id: "d6",
    number: 6,
    category: "korelasional",
    cognitiveLevel: "C4",
    prompt:
      "Keliling sebuah persegi panjang adalah 34 cm. Jika panjangnya (x + 5) cm dan lebarnya x cm, berapakah nilai x?",
    options: [
      {
        id: "a",
        label: "x = 6",
      },
      {
        id: "b",
        label: "x = 14,5",
        misconceptionCode: "M2-KelilingTanpaKali2",
        distractorFeedback: "Kamu baru menjumlahkan 1 panjang + 1 lebar (2x + 5 = 34). Keliling persegi panjang adalah 2(p + l).",
      },
      {
        id: "c",
        label: "x = 7,25",
        misconceptionCode: "M2-DistributifKeliling",
        distractorFeedback: "Perhatikan 2(2x + 5) = 4x + 10, bukan 4x + 5.",
      },
      {
        id: "d",
        label: "x = 11",
        misconceptionCode: "M2-SalahModelKeliling",
        distractorFeedback: "Jika x = 11 maka p = 16 dan l = 11, kelilingnya 2(16 + 11) = 54 cm (bukan 34 cm).",
      },
    ],
    correctOptionId: "a",
    equivalenceSteps: [
      "Keliling = 2(panjang + lebar) = 34",
      "↔ 2((x + 5) + x) = 34",
      "↔ 2(2x + 5) = 34",
      "↔ 4x + 10 = 34",
      "↔ 4x = 24  (kurangi 10 pada kedua ruas)",
      "↔ x = 6    (bagi kedua ruas dengan 4)",
    ],
    conceptSummary: "Uji selalu nilai x hasil hitungan ke cerita awal (substitusi kontekstual).",
    remedialRoute: "/lkpd",
    remedialLabel: "Latih Pemodelan di Tahap 3 LKPD",
    verificationEquation: { leftX: 4, leftC: 10, rightX: 0, rightC: 34, expectedX: 6 },
  },
  {
    id: "d7",
    number: 7,
    category: "korelasional",
    cognitiveLevel: "C3",
    prompt:
      "Dengan metode substitusi, manakah nilai m yang membuat kalimat 5m - 8 = 2m + 7 menjadi kalimat bernilai BENAR?",
    options: [
      {
        id: "a",
        label: "m = 3",
        misconceptionCode: "M2-SalahSubstitusi",
        distractorFeedback: "Uji m = 3: ruas kiri 5(3) - 8 = 7, ruas kanan 2(3) + 7 = 13 (7 ≠ 13).",
      },
      {
        id: "b",
        label: "m = 5",
      },
      {
        id: "c",
        label: "m = -5",
        misconceptionCode: "M2-SalahTandaSubstitusi",
        distractorFeedback: "Uji m = -5: ruas kiri -25 - 8 = -33, ruas kanan -10 + 7 = -3 (-33 ≠ -3).",
      },
      {
        id: "d",
        label: "m = 1",
        misconceptionCode: "M2-OperasiBilBulat",
        distractorFeedback: "Uji m = 1: ruas kiri 5 - 8 = -3, ruas kanan 2 + 7 = 9 (-3 ≠ 9).",
      },
    ],
    correctOptionId: "b",
    equivalenceSteps: [
      "Uji substitusi m = 5 ke 5m - 8 = 2m + 7:",
      "Ruas kiri  = 5(5) - 8 = 25 - 8 = 17",
      "Ruas kanan = 2(5) + 7 = 10 + 7 = 17",
      "Karena 17 = 17, maka m = 5 adalah penyelesaian yang benar.",
    ],
    conceptSummary: "Substitusi memastikan kedua ruas menghasilkan bilangan yang identik.",
    remedialRoute: "/sandbox",
    remedialLabel: "Gunakan Fitur Uji Substitusi di Sandbox",
    verificationEquation: { leftX: 5, leftC: -8, rightX: 2, rightC: 7, expectedX: 5 },
  },
  {
    id: "d8",
    number: 8,
    category: "teoritikal",
    cognitiveLevel: "C3",
    prompt: "Hasil penyederhanaan yang benar untuk menyelesaikan persamaan berikut adalah...",
    equationDisplay: "3(x - 4) = 15",
    options: [
      {
        id: "a",
        label: "3x - 4 = 15, sehingga x = 19/3",
        misconceptionCode: "M3-LupaDistributif",
        distractorFeedback: "Kesalahan sifat distributif: 3 harus dikalikan dengan x DAN dengan -4 (hasilnya 3x - 12).",
      },
      {
        id: "b",
        label: "3x - 12 = 15, sehingga x = 9",
      },
      {
        id: "c",
        label: "3x + 12 = 15, sehingga x = 1",
        misconceptionCode: "M3-SalahTandaDistributif",
        distractorFeedback: "Positif 3 dikali negatif 4 menghasilkan -12, bukan +12.",
      },
      {
        id: "d",
        label: "3x - 12 = 45, sehingga x = 19",
        misconceptionCode: "M3-KaliRuasKananGanda",
        distractorFeedback: "Menjabarkan 3(x - 4) hanyalah penulisan ulang ruas kiri, bukan mengalikan kedua ruas dengan 3.",
      },
    ],
    correctOptionId: "b",
    equivalenceSteps: [
      "3(x - 4) = 15",
      "↔ 3x - 12 = 15      (terapkan sifat distributif pada ruas kiri)",
      "↔ 3x = 27           (tambah 12 pada kedua ruas)",
      "↔ x = 9             (bagi kedua ruas dengan 3)",
    ],
    conceptSummary: "Sifat distributif a(b + c) = ab + ac berlaku untuk semua suku di dalam tanda kurung.",
    remedialRoute: "/sandbox",
    remedialLabel: "Coba Misi 10 (Sifat Distributif)",
    verificationEquation: { leftX: 3, leftC: -12, rightX: 0, rightC: 15, expectedX: 9 },
  },
  {
    id: "d9",
    number: 9,
    category: "teoritikal",
    cognitiveLevel: "C4",
    prompt:
      "Budi menyederhanakan persamaan 2x + 3 = 13 menjadi 5x = 13. Kesalahan konsep aljabar apa yang dilakukan Budi?",
    options: [
      {
        id: "a",
        label: "Budi menggabungkan suku yang tidak sejenis (2x dan konstanta 3)",
      },
      {
        id: "b",
        label: "Budi seharusnya mengalikan 2x dengan 3 menjadi 6x = 13",
        misconceptionCode: "M3-GabungSukuTakSejenis",
        distractorFeedback: "Operasi antara 2x dan 3 adalah penjumlahan, dan keduanya tetap tidak bisa digabung menjadi satu suku x.",
      },
      {
        id: "c",
        label: "Budi lupa membagi 13 dengan 5",
        misconceptionCode: "M3-AbaikanSukuTakSejenis",
        distractorFeedback: "Kesalahan utamanya sudah terjadi sejak 2x + 3 diubah menjadi 5x.",
      },
      {
        id: "d",
        label: "Langkah Budi benar karena 2 + 3 = 5",
        misconceptionCode: "M3-SukuTakSejenisBenar",
        distractorFeedback: "2x berarti dua kali nilai x, sedangkan 3 adalah satuan konstan; keduanya tidak sejenis.",
      },
    ],
    correctOptionId: "a",
    equivalenceSteps: [
      "2x + 3 = 13  (2x dan 3 bukan suku sejenis, tidak boleh dijumlah menjadi 5x)",
      "↔ 2x + 3 - 3 = 13 - 3   (kurangi 3 pada kedua ruas)",
      "↔ 2x = 10",
      "↔ x = 5                 (bagi kedua ruas dengan 2)",
    ],
    conceptSummary: "Hanya suku sejenis (sesama suku x atau sesama konstanta) yang dapat dijumlahkan/dikurangkan.",
    remedialRoute: "/lkpd",
    remedialLabel: "Pelajari Kembali Tahap 4 LKPD (HOTS)",
    verificationEquation: { leftX: 2, leftC: 3, rightX: 0, rightC: 13, expectedX: 5 },
  },
  {
    id: "d10",
    number: 10,
    category: "teoritikal",
    cognitiveLevel: "C5",
    prompt:
      "Perhatikan langkah berikut untuk menyelesaikan 2(x + 1) - x = 9:\n(1) 2x + 2 - x = 9\n(2) x + 2 = 9\n(3) x = 7\nManakah evaluasi yang paling tepat terhadap langkah tersebut?",
    options: [
      {
        id: "a",
        label: "Salah di langkah (1), seharusnya 2x + 1 - x = 9",
        misconceptionCode: "M3-LupaDistributifEvaluasi",
        distractorFeedback: "2(x + 1) memang benar dijabarkan menjadi 2x + 2 karena 2 × 1 = 2.",
      },
      {
        id: "b",
        label: "Salah di langkah (2), seharusnya 2x - x = 2",
        misconceptionCode: "M3-SalahKurangVariabel",
        distractorFeedback: "2x dikurangi 1x adalah 1x (ditulis x), bukan 2.",
      },
      {
        id: "c",
        label: "Seluruh langkah benar dan x = 7 memenuhi persamaan awal",
      },
      {
        id: "d",
        label: "Salah di langkah (3), seharusnya x = 11",
        misconceptionCode: "M3-SalahInversTambah",
        distractorFeedback: "Untuk menetralkan +2, kedua ruas dikurangi 2 (9 - 2 = 7), bukan ditambah 2.",
      },
    ],
    correctOptionId: "c",
    equivalenceSteps: [
      "2(x + 1) - x = 9",
      "↔ 2x + 2 - x = 9   (sifat distributif benar)",
      "↔ x + 2 = 9        (suku sejenis 2x - x = x benar)",
      "↔ x = 7            (kurangi 2 pada kedua ruas)",
      "Uji substitusi: 2(7 + 1) - 7 = 16 - 7 = 9 (Benar!).",
    ],
    conceptSummary: "Gabungan sifat distributif, penyederhanaan suku sejenis, dan sifat kesetaraan menghasilkan solusi akurat.",
    remedialRoute: "/lkpd",
    remedialLabel: "Latih Evaluasi Langkah di Tahap 4 LKPD",
    verificationEquation: { leftX: 1, leftC: 2, rightX: 0, rightC: 9, expectedX: 7 },
  },
];

export interface QuizQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly equationDisplay?: string;
  readonly options: readonly { id: string; label: string }[];
  readonly correctOptionId: string;
  readonly quickExplanation: string;
  readonly verificationEquation?: {
    leftX: number;
    leftC: number;
    rightX: number;
    rightC: number;
    expectedX: number;
  };
}

export const QUIZ_BANK: readonly QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Nilai x yang memenuhi persamaan berikut adalah...",
    equationDisplay: "x + 8 = 15",
    options: [
      { id: "a", label: "x = 7" },
      { id: "b", label: "x = 23" },
      { id: "c", label: "x = -7" },
      { id: "d", label: "x = 8" },
    ],
    correctOptionId: "a",
    quickExplanation: "Kurangi 8 pada kedua ruas: x = 15 - 8 = 7.",
    verificationEquation: { leftX: 1, leftC: 8, rightX: 0, rightC: 15, expectedX: 7 },
  },
  {
    id: "q2",
    prompt: "Penyelesaian dari persamaan berikut adalah...",
    equationDisplay: "x - 6 = 11",
    options: [
      { id: "a", label: "x = 5" },
      { id: "b", label: "x = 17" },
      { id: "c", label: "x = -5" },
      { id: "d", label: "x = -17" },
    ],
    correctOptionId: "b",
    quickExplanation: "Tambah 6 pada kedua ruas: x = 11 + 6 = 17.",
    verificationEquation: { leftX: 1, leftC: -6, rightX: 0, rightC: 11, expectedX: 17 },
  },
  {
    id: "q3",
    prompt: "Tentukan nilai x yang setara:",
    equationDisplay: "3x = 24",
    options: [
      { id: "a", label: "x = 21" },
      { id: "b", label: "x = 27" },
      { id: "c", label: "x = 8" },
      { id: "d", label: "x = 72" },
    ],
    correctOptionId: "c",
    quickExplanation: "Bagi kedua ruas dengan 3: x = 24 ÷ 3 = 8.",
    verificationEquation: { leftX: 3, leftC: 0, rightX: 0, rightC: 24, expectedX: 8 },
  },
  {
    id: "q4",
    prompt: "Tentukan nilai x dari persamaan berikut:",
    equationDisplay: "2x + 5 = 17",
    options: [
      { id: "a", label: "x = 11" },
      { id: "b", label: "x = 6" },
      { id: "c", label: "x = 12" },
      { id: "d", label: "x = 4" },
    ],
    correctOptionId: "b",
    quickExplanation: "2x + 5 = 17 ↔ 2x = 12 ↔ x = 6.",
    verificationEquation: { leftX: 2, leftC: 5, rightX: 0, rightC: 17, expectedX: 6 },
  },
  {
    id: "q5",
    prompt: "Nilai x yang menyeimbangkan kedua ruas adalah...",
    equationDisplay: "4x - 3 = 13",
    options: [
      { id: "a", label: "x = 2,5" },
      { id: "b", label: "x = 16" },
      { id: "c", label: "x = 4" },
      { id: "d", label: "x = -4" },
    ],
    correctOptionId: "c",
    quickExplanation: "Tambah 3 di kedua ruas → 4x = 16 → bagi 4 → x = 4.",
    verificationEquation: { leftX: 4, leftC: -3, rightX: 0, rightC: 13, expectedX: 4 },
  },
  {
    id: "q6",
    prompt: "Selesaikan persamaan dengan variabel di kedua ruas:",
    equationDisplay: "5x + 2 = 3x + 10",
    options: [
      { id: "a", label: "x = 4" },
      { id: "b", label: "x = 6" },
      { id: "c", label: "x = 1,5" },
      { id: "d", label: "x = 8" },
    ],
    correctOptionId: "a",
    quickExplanation: "Kurangi 3x lalu kurangi 2 pada kedua ruas → 2x = 8 → x = 4.",
    verificationEquation: { leftX: 5, leftC: 2, rightX: 3, rightC: 10, expectedX: 4 },
  },
  {
    id: "q7",
    prompt: "Hati-hati koefisien negatif! Nilai x adalah...",
    equationDisplay: "-3x = 18",
    options: [
      { id: "a", label: "x = 21" },
      { id: "b", label: "x = 6" },
      { id: "c", label: "x = -6" },
      { id: "d", label: "x = 15" },
    ],
    correctOptionId: "c",
    quickExplanation: "Bagi kedua ruas dengan -3: x = 18 ÷ (-3) = -6.",
    verificationEquation: { leftX: -3, leftC: 0, rightX: 0, rightC: 18, expectedX: -6 },
  },
  {
    id: "q8",
    prompt: "Tentukan nilai x dari persamaan berikut:",
    equationDisplay: "-2x + 9 = 3",
    options: [
      { id: "a", label: "x = -3" },
      { id: "b", label: "x = 3" },
      { id: "c", label: "x = 6" },
      { id: "d", label: "x = -6" },
    ],
    correctOptionId: "b",
    quickExplanation: "Kurangi 9 di kedua ruas → -2x = -6 → bagi -2 → x = 3.",
    verificationEquation: { leftX: -2, leftC: 9, rightX: 0, rightC: 3, expectedX: 3 },
  },
  {
    id: "q9",
    prompt: "Gunakan sifat distributif untuk menemukan x:",
    equationDisplay: "2(x + 4) = 18",
    options: [
      { id: "a", label: "x = 7" },
      { id: "b", label: "x = 5" },
      { id: "c", label: "x = 11" },
      { id: "d", label: "x = 9" },
    ],
    correctOptionId: "b",
    quickExplanation: "2(x + 4) = 18 ↔ 2x + 8 = 18 ↔ 2x = 10 ↔ x = 5.",
    verificationEquation: { leftX: 2, leftC: 8, rightX: 0, rightC: 18, expectedX: 5 },
  },
  {
    id: "q10",
    prompt: "Selesaikan persamaan berikut:",
    equationDisplay: "3(x - 2) = 15",
    options: [
      { id: "a", label: "x = 7" },
      { id: "b", label: "x = 3" },
      { id: "c", label: "x = 17/3" },
      { id: "d", label: "x = 5" },
    ],
    correctOptionId: "a",
    quickExplanation: "3x - 6 = 15 ↔ 3x = 21 ↔ x = 7.",
    verificationEquation: { leftX: 3, leftC: -6, rightX: 0, rightC: 15, expectedX: 7 },
  },
  {
    id: "q11",
    prompt: "Manakah yang BUKAN merupakan Persamaan Linear Satu Variabel?",
    options: [
      { id: "a", label: "7x - 2 = 12" },
      { id: "b", label: "4 = 2a + 8" },
      { id: "c", label: "x + y = 9" },
      { id: "d", label: "3m = m + 4" },
    ],
    correctOptionId: "c",
    quickExplanation: "x + y = 9 memiliki dua variabel berbeda (x dan y).",
  },
  {
    id: "q12",
    prompt: "Persamaan yang ekuivalen dengan 3x - 6 = 9 adalah...",
    options: [
      { id: "a", label: "x - 6 = 3" },
      { id: "b", label: "x - 2 = 3" },
      { id: "c", label: "3x = 3" },
      { id: "d", label: "x + 2 = 3" },
    ],
    correctOptionId: "b",
    quickExplanation: "Bagi seluruh suku di kedua ruas dengan 3: x - 2 = 3 (keduanya x = 5).",
    verificationEquation: { leftX: 3, leftC: -6, rightX: 0, rightC: 9, expectedX: 5 },
  },
  {
    id: "q13",
    prompt: "Tentukan nilai x yang menghasilkan solusi negatif:",
    equationDisplay: "2x + 10 = 4",
    options: [
      { id: "a", label: "x = 3" },
      { id: "b", label: "x = -3" },
      { id: "c", label: "x = 7" },
      { id: "d", label: "x = -7" },
    ],
    correctOptionId: "b",
    quickExplanation: "Kurangi 10 pada kedua ruas → 2x = -6 → bagi 2 → x = -3.",
    verificationEquation: { leftX: 2, leftC: 10, rightX: 0, rightC: 4, expectedX: -3 },
  },
  {
    id: "q14",
    prompt: "Jika 15 = 3x + 3, maka nilai x adalah...",
    options: [
      { id: "a", label: "x = 4" },
      { id: "b", label: "x = 6" },
      { id: "c", label: "x = 12" },
      { id: "d", label: "x = -4" },
    ],
    correctOptionId: "a",
    quickExplanation: "Kurangi 3 di kedua ruas → 12 = 3x → bagi 3 → x = 4.",
    verificationEquation: { leftX: 0, leftC: 15, rightX: 3, rightC: 3, expectedX: 4 },
  },
  {
    id: "q15",
    prompt: "Tentukan nilai x pada persamaan dua ruas berikut:",
    equationDisplay: "6x - 4 = 2x + 12",
    options: [
      { id: "a", label: "x = 2" },
      { id: "b", label: "x = 4" },
      { id: "c", label: "x = 1" },
      { id: "d", label: "x = 8" },
    ],
    correctOptionId: "b",
    quickExplanation: "Kurangi 2x lalu tambah 4 di kedua ruas → 4x = 16 → x = 4.",
    verificationEquation: { leftX: 6, leftC: -4, rightX: 2, rightC: 12, expectedX: 4 },
  },
  {
    id: "q16",
    prompt: "Jumlah tiga kali suatu bilangan dengan 5 adalah 26. Bilangan tersebut adalah...",
    options: [
      { id: "a", label: "7" },
      { id: "b", label: "9" },
      { id: "c", label: "10" },
      { id: "d", label: "6" },
    ],
    correctOptionId: "a",
    quickExplanation: "Model: 3x + 5 = 26 ↔ 3x = 21 ↔ x = 7.",
    verificationEquation: { leftX: 3, leftC: 5, rightX: 0, rightC: 26, expectedX: 7 },
  },
];
