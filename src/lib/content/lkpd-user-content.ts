// Authentic 3-LKS curriculum adapted directly from lecturer-approved "4 LKPD.pdf"
// Confirmed mathematical typo corrections applied:
// 1. LKS 1 Tabel hal. 164: consistent variable x in "Enam dikurangi suatu bilangan x menghasilkan 2"
// 2. LKS 1 Neraca bola basket hal. 167: corrected conclusion x = 6 and {6}
// 3. LKS 2 Kalimat Alif hal. 173: sentence 4 clarified as "kurang dari 80" for x < 80
// 4. LKS 2 Ceklis tanda hal. 174: row 4 corrected to "<" for "kurang dari"
// 5. LKS 3 Tabel hal. 178: variable z kept consistent (z < 6 and z > 6)
// Note: LKS 1 album rosie price kept verbatim per user confirmation (Rp4.000.000 / Rp500.000).

export interface LksScaffoldingHints {
  readonly level1: string;
  readonly level2: string;
  readonly level3: string;
}

export interface YesNoStatement {
  readonly id: string;
  readonly text: string;
  readonly expected: "ya" | "tidak";
  readonly explanation: string;
}

export interface Lks1RecallItem {
  readonly id: string;
  readonly label: string;
  readonly expression: string;
  readonly acceptedAnswers: readonly string[];
  readonly canonicalAnswer: string;
  readonly explanation: string;
}

export interface LksClassifyItem {
  readonly id: string;
  readonly expression: string;
  readonly isPlsv: boolean;
  readonly explanation: string;
}

export interface StepReviewCase {
  readonly id: string;
  readonly title: string;
  readonly equation: string;
  readonly steps: readonly { math: string; note?: string }[];
  readonly isAllCorrect: boolean;
  readonly expectedAnswerText: string;
}

export function normalizeMathText(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/−/g, "-")
    .replace(/\s+/g, "");
}

export function isAcceptedMathAnswer(
  input: string,
  accepted: readonly string[]
): boolean {
  const norm = normalizeMathText(input);
  if (!norm) return false;
  return accepted.some((a) => normalizeMathText(a) === norm);
}

export const LKS_SCAFFOLDING: Record<1 | 2 | 3, LksScaffoldingHints> = {
  1: {
    level1:
      "Periksa ciri utama kalimat terbuka (masih ada variabel) dan PLSV: harus ada tanda '=', hanya 1 jenis variabel, serta pangkat variabelnya tepat 1.",
    level2:
      "Pada neraca setimbang, mengambil atau menambah beban yang sama di kedua sisi tidak mengubah kesetimbangan. Jika 2x + 3 = 4 + x, kurangi kedua ruas dengan x lalu kurangi dengan 3.",
    level3:
      "Langkah utuh 2x + 3 = 4 + x: (1) Kurangi x di kedua ruas → x + 3 = 4; (2) Kurangi 3 di kedua ruas → x = 1. Himpunan penyelesaian = {1}. Cek: 2(1)+3 = 5 dan 4+1 = 5 (Setara!).",
  },
  2: {
    level1:
      "Saat memeriksa langkah penyelesaian PLSV, pastikan operasi perkalian/pembagian diterapkan ke SELURUH suku di kedua ruas, bukan hanya satu suku saja. Untuk PtLSV, cermati apakah batas termasuk (≤, ≥) atau tidak (<, >).",
    level2:
      "Pada jajargenjang 96 cm², luas persegi panjang utuh = 2 × 96 = 192 cm² dengan panjang 16 cm dan lebar 2x. Pada garis bilangan PtLSV, bulatan penuh (●) & kurung siku [ ] berarti tanda ≤ atau ≥; bulatan kosong (○) & kurung biasa ( ) berarti < atau >.",
    level3:
      "Contoh penyajian x ≥ 8: Notasi interval [8, ∞), Notasi pembentuk himpunan {x | x ≥ 8}, Garis bilangan: bulatan penuh ● di angka 8 dengan panah ke kanan. Untuk Bank Sampah: (1/3)×330 + 5k = 330 ↔ 110 + 5k = 330 ↔ 5k = 220 ↔ k = 44 keluarga.",
  },
  3: {
    level1:
      "Sifat ketidaksamaan hampir sama dengan kesetaraan, KECUALI satu aturan emas: mengalikan atau membagi kedua ruas dengan bilangan NEGATIF akan MEMBALIK arah tanda pertidaksamaan!",
    level2:
      "Pada masalah pabrik limbah, ubah dulu batas total 5 hari menjadi batas per hari (410 ÷ 5 = 82 liter/hari), lalu susun 2 + 16x ≤ 82. Pada pabrik baru, gunakan 20p ≥ 640 sekaligus ingat batas panjang lahan 40 m.",
    level3:
      "Langkah pabrik limbah: 2 + 16x ≤ 82 ↔ 16x ≤ 80 ↔ x ≤ 5 jam/hari. Uji 8 jam: 2 + 16(8) = 130 > 82 (melebihi batas). Langkah pabrik baru: 20p ≥ 640 ↔ p ≥ 32 m, dibatasi lahan ≤ 40 m → 32 ≤ p ≤ 40, luas terbesar = 40 × 20 = 800 m².",
  },
};

export const LKS1_CONTENT = {
  number: 1 as const,
  code: "LKS 1",
  shortTitle: "Konsep PLSV",
  title: "Konsep Persamaan Linear Satu Variabel (PLSV)",
  objectives: [
    "Siswa mampu mengidentifikasi kalimat terbuka dan kalimat tertutup.",
    "Siswa mampu menentukan penyelesaian dan himpunan penyelesaian.",
    "Siswa mampu mengidentifikasi persamaan linear satu variabel dan penyelesaiannya.",
  ],
  introContext: {
    title: "Masalah Kontekstual: Tabungan Raya untuk Album 'rosie'",
    story:
      "Raya sangat mengidolakan Rosé BLACKPINK. Ia sudah menabung sejak lama untuk membeli album solo Rosé yang berjudul \"rosie\". Harga album \"rosie\" yang diinginkan Raya adalah 35.000 Won atau setara dengan Rp4.000.000. Raya menyimpan uang di tabungan ayah dan tabungan ibunya dengan nominal yang sama. Raya juga memiliki uang yang ia simpan sendiri sebesar Rp500.000. Menurutmu, apakah Raya bisa membeli album rosie tersebut?",
    modelHint:
      "Jika nominal tabungan di ayah (dan sama dengan di ibu) dimisalkan x, maka total uang Raya adalah 2x + 500.000. Raya dapat membeli album tersebut apabila 2x + 500.000 = 4.000.000 (yaitu x = Rp1.750.000 di masing-masing tabungan ayah dan ibu) atau lebih!",
  },
  recallItems: [
    {
      id: "r1a",
      label: "1a. Operasi Bilangan Bulat",
      expression: "23 + (−6) − 2",
      acceptedAnswers: ["15"],
      canonicalAnswer: "15",
      explanation: "23 + (−6) = 17, kemudian 17 − 2 = 15.",
    },
    {
      id: "r1b",
      label: "1b. Operasi Bilangan Bulat",
      expression: "(−13) − 4 + 20",
      acceptedAnswers: ["3"],
      canonicalAnswer: "3",
      explanation: "(−13) − 4 = −17, kemudian −17 + 20 = 3.",
    },
    {
      id: "r2a",
      label: "2a. Operasi Aljabar",
      expression: "x − 16 + 3x + 7",
      acceptedAnswers: ["4x-9", "-9+4x"],
      canonicalAnswer: "4x − 9",
      explanation: "Kelompokkan suku sejenis: (x + 3x) + (−16 + 7) = 4x − 9.",
    },
    {
      id: "r2b",
      label: "2b. Operasi Aljabar",
      expression: "9y − 3(y + 4)",
      acceptedAnswers: ["6y-12", "-12+6y"],
      canonicalAnswer: "6y − 12",
      explanation: "Sifat distributif: 9y − 3y − 12 = 6y − 12.",
    },
  ] as readonly Lks1RecallItem[],
  quizDialogueSummary: {
    title: "Kuis Jelajah Tata Surya (Moderator, Andi Tim A, & Sari Tim B)",
    groups: [
      {
        heading: "Kalimat yang Belum Dapat Dinilai Kebenarannya (Kalimat Terbuka)",
        items: [
          "Peristiwa x merupakan perputaran bumi pada porosnya.",
          "Planet y dikenal sebagai 'Planet Merah'.",
          "Planet a, b, c, dan d adalah planet-planet yang termasuk planet dalam.",
          "Sabuk h adalah wilayah di antara orbit Mars dan Jupiter yang dipenuhi jutaan asteroid.",
          "Planet q memiliki cincin yang paling indah di tata surya.",
          "Planet r merupakan planet terbesar di tata surya.",
        ],
      },
      {
        heading: "Kalimat yang Bernilai Benar (Kalimat Tertutup Benar)",
        items: [
          "Planet Mars merupakan planet yang dikenal sebagai 'Planet Merah'.",
          "Planet yang termasuk planet dalam adalah Merkurius, Venus, Bumi, dan Mars.",
          "Sabuk asteroid adalah wilayah di antara orbit Mars dan Jupiter yang dipenuhi jutaan asteroid.",
          "Planet terbesar di tata surya adalah Jupiter.",
        ],
      },
      {
        heading: "Kalimat yang Bernilai Salah (Kalimat Tertutup Salah)",
        items: [
          "Peristiwa revolusi bumi adalah perputaran bumi pada porosnya. (Salah, seharusnya rotasi bumi)",
          "Planet yang memiliki cincin yang paling indah adalah Uranus. (Salah, seharusnya Saturnus)",
        ],
      },
    ],
  },
  agreementGroup1: [
    {
      id: "ag1_1",
      text: "Kalimat yang tidak dapat dinilai kebenarannya adalah kalimat yang mengandung variabel yang belum bisa ditentukan benar atau salahnya sebelum mengganti variabel tersebut.",
      expected: "ya",
      explanation:
        "Benar! Variabel membuat kalimat belum dapat dinilai benar/salah sebelum disubstitusi.",
    },
    {
      id: "ag1_2",
      text: "Kalimat yang bernilai benar adalah kalimat yang sudah dapat dinilai kebenarannya dan mengandung nilai benar.",
      expected: "ya",
      explanation: "Benar! Contohnya: Planet terbesar di tata surya adalah Jupiter.",
    },
    {
      id: "ag1_3",
      text: "Kalimat yang bernilai salah adalah kalimat yang sudah dapat dinilai kebenarannya dan mengandung nilai salah.",
      expected: "ya",
      explanation:
        "Benar! Kalimat yang bernilai salah tetap termasuk kalimat tertutup karena nilai kebenarannya sudah pasti.",
    },
  ] as readonly YesNoStatement[],
  openSentenceExample: {
    statement: "Enam dikurangi suatu bilangan x menghasilkan 2.",
    formula: "6 − x = 2",
    variable: "x",
    trueClosed: "6 − 4 = 2 (Benar)",
    falseClosed: "6 − 3 = 2 (Salah)",
  },
  openSentenceTable: [
    {
      id: "os1",
      statement: "y ditambah dua lebih dari lima belas.",
      expectedFormula: "y + 2 > 15",
      acceptedFormulas: ["y+2>15", "2+y>15"],
      expectedVar: "y",
      sampleTrue: "15 + 2 > 15 (Benar)",
      sampleFalse: "10 + 2 > 15 (Salah)",
    },
    {
      id: "os2",
      statement: "Negatif lima dikurangi q sama dengan enam belas.",
      expectedFormula: "−5 − q = 16",
      acceptedFormulas: ["-5-q=16", "16=-5-q"],
      expectedVar: "q",
      sampleTrue: "−5 − (−21) = 16 (Benar)",
      sampleFalse: "−5 − 2 = 16 (Salah)",
    },
    {
      id: "os3",
      statement: "a dikurangi enam kurang dari tujuh.",
      expectedFormula: "a − 6 < 7",
      acceptedFormulas: ["a-6<7"],
      expectedVar: "a",
      sampleTrue: "10 − 6 < 7 (Benar)",
      sampleFalse: "15 − 6 < 7 (Salah)",
    },
  ],
  agreementGroup2: [
    {
      id: "ag2_1",
      text: "Kalimat terbuka adalah kalimat yang belum dapat dinyatakan nilai kebenarannya karena memiliki unsur yang belum diketahui atau disebut variabel.",
      expected: "ya",
      explanation: "Tepat!",
    },
    {
      id: "ag2_2",
      text: "Kalimat tertutup adalah kalimat yang dapat dinyatakan nilai kebenarannya yaitu benar saja atau salah saja dan tidak kedua-duanya.",
      expected: "ya",
      explanation: "Tepat!",
    },
    {
      id: "ag2_3",
      text: "Untuk mengubah kalimat terbuka menjadi kalimat tertutup dilakukan dengan memberikan nilai pada variabel sehingga dapat ditentukan nilai kebenarannya.",
      expected: "ya",
      explanation: "Tepat!",
    },
    {
      id: "ag2_4",
      text: "Nilai yang menggantikan variabel dan membuat kalimat bernilai benar disebut suatu penyelesaian, dan kumpulan penyelesaian disebut himpunan penyelesaian.",
      expected: "ya",
      explanation:
        "Tepat! Jika tidak ada nilai yang memenuhi, himpunan penyelesaiannya ditulis {} atau ∅.",
    },
  ] as readonly YesNoStatement[],
  plsvClassifyItems: [
    {
      id: "pc1",
      expression: "x + 8 = 11",
      isPlsv: true,
      explanation:
        "PLSV: memuat tanda '=', satu variabel (x), dan pangkat tertinggi variabel adalah 1.",
    },
    {
      id: "pc2",
      expression: "−3y − 4 = 5y + 10",
      isPlsv: true,
      explanation:
        "PLSV: meskipun y muncul di kedua ruas, hanya ada satu jenis variabel (y) berpangkat 1 dengan tanda '='.",
    },
    {
      id: "pc3",
      expression: "x² − 9 = 0",
      isPlsv: false,
      explanation:
        "Bukan PLSV: variabel x berpangkat 2 (persamaan kuadrat, bukan linear).",
    },
    {
      id: "pc4",
      expression: "3a − 5 < 9",
      isPlsv: false,
      explanation:
        "Bukan PLSV: menggunakan tanda '<' (Pertidaksamaan Linear Satu Variabel / PtLSV).",
    },
    {
      id: "pc5",
      expression: "17 − 4m ≥ 7m",
      isPlsv: false,
      explanation: "Bukan PLSV: menggunakan tanda '≥' (PtLSV).",
    },
  ] as readonly LksClassifyItem[],
  definitionStatements: [
    {
      id: "def1",
      text: "Persamaan linear satu variabel (PLSV) adalah kalimat terbuka yang memuat tanda sama dengan (=) dan mengandung satu variabel yang berderajat satu (berpangkat satu), dengan bentuk umum ax + b = c (a ≠ 0).",
      expected: "ya",
      explanation: "Benar! Itulah definisi formal dan bentuk umum PLSV.",
    },
    {
      id: "def2",
      text: "Kalimat terbuka yang memuat tanda pertidaksamaan (<, >, ≤, ≥) atau variabel berpangkat 2 tetap termasuk PLSV asalkan hanya memiliki satu variabel.",
      expected: "tidak",
      explanation:
        "Tidak! Tanda pertidaksamaan membentuk PtLSV, sedangkan pangkat 2 membentuk persamaan kuadrat.",
    },
  ] as readonly YesNoStatement[],
  basketballWorkedExample: {
    equation: "2x + 3 = 9 + x",
    steps: [
      "2x + 3 = 9 + x",
      "↔ 2x + 3 − x = 9 + x − x   (ambil 1 bola basket dari kedua sisi)",
      "↔ x + 3 = 9",
      "↔ x + 3 − 3 = 9 − 3   (ambil 3 bandul dari kedua sisi)",
      "↔ x = 6",
    ],
    solutionValue: 6,
    conclusion:
      "Jadi, berat 1 bola basket adalah 6 bandul (x = 6), sehingga himpunan penyelesaiannya adalah {6}. Cek kesetaraan: 2(6) + 3 = 15 dan 9 + 6 = 15 (Setimbang!).",
  },
  balanceStepReview: [
    {
      id: "lks1_sr1",
      title: "Kasus 1: 2x + 18 = 12 − 4x",
      equation: "2x + 18 = 12 − 4x",
      steps: [
        {
          math: "2x + 18 − 12 = 12 − 4x − 12  →  2x + 6 = −4x",
          note: "Kedua ruas dikurangi 12",
        },
        {
          math: "2x + 6 + 4x = −4x + 4x  →  6x + 6 = 0",
          note: "Kedua ruas ditambah 4x",
        },
        {
          math: "6x + 6 − 6 = 0 − 6  →  6x = −6",
          note: "Kedua ruas dikurangi 6",
        },
        {
          math: "6x / 6 = −6 / 6  →  x = −1",
          note: "Kedua ruas dibagi 6",
        },
      ],
      isAllCorrect: true,
      expectedAnswerText:
        "Seluruh langkah BENAR. Setiap operasi dilakukan secara adil di kedua ruas. Uji substitusi: 2(−1) + 18 = 16 dan 12 − 4(−1) = 16 (Setara!).",
    },
    {
      id: "lks1_sr2",
      title: "Kasus 2: 9 − (1/3)y = 2",
      equation: "9 − (1/3)y = 2",
      steps: [
        {
          math: "9 − (1/3)y − 9 = 2 − 9  →  −(1/3)y = −7",
          note: "Kedua ruas dikurangi 9",
        },
        {
          math: "−(1/3)y × (−3) = −7 × (−3)  →  y = 21",
          note: "Kedua ruas dikali −3",
        },
      ],
      isAllCorrect: true,
      expectedAnswerText:
        "Seluruh langkah BENAR. Mengalikan kedua ruas dengan −3 mengubah koefisien −1/3 menjadi 1. Uji substitusi: 9 − (1/3)(21) = 9 − 7 = 2 (Setara!).",
    },
  ] as readonly StepReviewCase[],
  equivalenceProperties: [
    {
      id: "eqp1",
      text: "Apabila sebuah PLSV ditambah dengan nilai yang sama pada kedua ruasnya, persamaan tetap setara/setimbang.",
      expected: "ya",
      explanation: "Benar (Sifat Penjumlahan Kesetaraan).",
    },
    {
      id: "eqp2",
      text: "Apabila sebuah PLSV dikurang dengan nilai yang sama pada kedua ruasnya, persamaan tetap setara/setimbang.",
      expected: "ya",
      explanation: "Benar (Sifat Pengurangan Kesetaraan).",
    },
    {
      id: "eqp3",
      text: "Apabila sebuah PLSV dikali dengan nilai tak nol yang sama pada kedua ruasnya, persamaan tetap setara/setimbang.",
      expected: "ya",
      explanation: "Benar (Sifat Perkalian Kesetaraan untuk bilangan ≠ 0).",
    },
    {
      id: "eqp4",
      text: "Apabila sebuah PLSV dibagi dengan nilai tak nol yang sama pada kedua ruasnya, persamaan tetap setara/setimbang.",
      expected: "ya",
      explanation: "Benar (Sifat Pembagian Kesetaraan untuk bilangan ≠ 0).",
    },
  ] as readonly YesNoStatement[],
} as const;

export const LKS2_CONTENT = {
  number: 2 as const,
  code: "LKS 2",
  shortTitle: "Penyelesaian PLSV & Konsep PtLSV",
  title:
    "Penyelesaian PLSV & Konsep Pertidaksamaan Linear Satu Variabel (PtLSV)",
  objectives: [
    "Siswa mampu menyelesaikan masalah kontekstual yang berhubungan dengan PLSV.",
    "Siswa mampu mengidentifikasi pertidaksamaan linear satu variabel (PtLSV).",
    "Siswa mampu membedakan penggunaan bentuk tanda pertidaksamaan (<, >, ≤, ≥).",
    "Siswa mampu menyajikan himpunan penyelesaian PtLSV dalam 3 cara: notasi interval, pembentuk himpunan, dan garis bilangan.",
  ],
  introContext: {
    title: "Masalah Kontekstual: Kalung Emas Bu Ani",
    story:
      "Bu Ani memiliki sebuah kalung emas yang ia beli beberapa tahun yang lalu seharga Rp2.500.000. Sekarang ia mendapat penawaran sebesar Rp3.800.000. Harga emas naik rata-rata Rp50.000 per gram setiap tahunnya. Jika berat kalung emas Bu Ani adalah 10 gram, benarkah Bu Ani telah menyimpan kalung tersebut selama 5 tahun?",
    feedback:
      "Kenaikan nilai kalung 10 gram per tahun = 10 × Rp50.000 = Rp500.000. Model PLSV: 2.500.000 + 500.000t = 3.800.000 ↔ 500.000t = 1.300.000 ↔ t = 2,6 tahun. Jadi TIDAK BENAR 5 tahun (dalam 5 tahun nilainya sudah Rp5.000.000).",
  },
  recallClassify: [
    {
      id: "l2r1",
      expression: "18 = 7x + 1",
      isPlsv: true,
      explanation: "PLSV: satu variabel (x) berpangkat 1 dengan tanda '='.",
    },
    {
      id: "l2r2",
      expression: "6y − x = 15",
      isPlsv: false,
      explanation: "Bukan PLSV: memiliki dua variabel berbeda (y dan x).",
    },
    {
      id: "l2r3",
      expression: "7b + (−8) = 6 − b",
      isPlsv: true,
      explanation:
        "PLSV: hanya satu jenis variabel (b) berpangkat 1 dengan tanda '='.",
    },
  ] as readonly LksClassifyItem[],
  recallErrorCase: {
    id: "l2_err_recall",
    title: "Periksa Langkah: 17 − 3r = r − 5",
    equation: "17 − 3r = r − 5",
    steps: [
      {
        math: "17 − 3r + 5 = r − 5 + 5  →  12 − 3r = r",
        note: "Kedua ruas ditambah 5",
      },
      {
        math: "12 − 3r + 3r = r + 3r  →  12 = 4r",
        note: "Kedua ruas ditambah 3r",
      },
      {
        math: "12 / 4 = 4r / 4  →  3 = r",
        note: "Kedua ruas dibagi 4",
      },
    ],
    isAllCorrect: false,
    expectedAnswerText:
      "TIDAK BENAR! Kesalahan terjadi di baris 1: 17 + 5 = 22 (bukan 12). Penyelesaian benar: 22 − 3r = r ↔ 22 = 4r ↔ r = 5,5 (atau 11/2).",
  },
  solvePractice: [
    {
      id: "l2s1",
      equation: "3p + 15 = 3 − p",
      acceptedAnswers: ["-3", "p=-3"],
      canonicalAnswer: "p = −3",
      steps:
        "3p + 15 = 3 − p ↔ 4p + 15 = 3 ↔ 4p = −12 ↔ p = −3. Uji: 3(−3)+15 = 6 dan 3−(−3) = 6 (Benar).",
    },
    {
      id: "l2s2",
      equation: "−13 − (2/3)q = −15",
      acceptedAnswers: ["3", "q=3"],
      canonicalAnswer: "q = 3",
      steps:
        "−13 − (2/3)q = −15 ↔ −(2/3)q = −2 ↔ q = −2 × (−3/2) = 3. Uji: −13 − (2/3)(3) = −15 (Benar).",
    },
  ],
  errorAuditCases: [
    {
      id: "l2ea",
      title: "Soal 1a: 25 − 9b = −7b + 9",
      equation: "25 − 9b = −7b + 9",
      steps: [
        { math: "25 − 9b + 9b = −7b + 9 + 9b  →  25 = −16b + 9" },
        { math: "25 − 9 = −16b + 9 − 9  →  16 = −16b" },
        { math: "16 / (−16) = −16b / (−16)  →  −1 = b" },
      ],
      isAllCorrect: false,
      expectedAnswerText:
        "SALAH pada baris 1: −7b + 9b seharusnya +2b (bukan −16b). Koreksi: 25 = 2b + 9 ↔ 16 = 2b ↔ b = 8.",
    },
    {
      id: "l2eb",
      title: "Soal 1b: 14 = 8 + (2/3)x",
      equation: "14 = 8 + (2/3)x",
      steps: [
        { math: "14 × 3 = 8 + (2/3)x × 3  →  42 = 8 + 2x" },
        { math: "42 − 8 = 8 + 2x − 8  →  36 = 2x" },
        { math: "36 / 2 = 2x / 2  →  18 = x" },
      ],
      isAllCorrect: false,
      expectedAnswerText:
        "SALAH pada baris 1: saat kedua ruas dikali 3, suku 8 di ruas kanan tidak ikut dikali 3! Seharusnya 42 = 24 + 2x ↔ 18 = 2x ↔ x = 9.",
    },
    {
      id: "l2ec",
      title: "Soal 1c: 2r − 5 = 9 + (1/4)r",
      equation: "2r − 5 = 9 + (1/4)r",
      steps: [
        { math: "2r − 5 × 4 = 9 + (1/4)r × 4  →  2r − 20 = 9 + r" },
        { math: "2r − 20 − r = 36 + r − r  →  r − 20 = 36" },
        { math: "r − 20 + 20 = 36 + 20  →  r = 56" },
      ],
      isAllCorrect: false,
      expectedAnswerText:
        "SALAH pada baris 1: suku 2r tidak ikut dikali 4 (dan suku 9 baru berubah menjadi 36 di baris 2). Koreksi: 8r − 20 = 36 + r ↔ 7r = 56 ↔ r = 8.",
    },
  ] as readonly StepReviewCase[],
  contextualDiskusi: {
    jajargenjang: {
      prompt:
        "Bangun jajargenjang dengan luas 96 cm² diperoleh dari sebuah persegi panjang berukuran panjang 16 cm yang dipotong dengan pola segitiga siku-siku pada sisi atas dan bawahnya. Diketahui bahwa luas persegi panjang sebelum dipotong adalah dua kali luas jajargenjang tersebut. Temukan persamaan linear satu variabel dari gambar dan tentukan nilai x!",
      acceptedX: ["6", "x=6"],
      feedback:
        "Luas persegi panjang = 2 × 96 = 192 cm². Karena lebar total persegi panjang terdiri dari dua bagian sama panjang (2x), maka: Alternatif 1: 16 × 2x = 192 ↔ 32x = 192 ↔ x = 6 cm; Alternatif 2: Luas jajargenjang = alas × tinggi = x × 16 = 96 ↔ x = 6 cm. Himpunan penyelesaian = {6}.",
    },
    bankSampah: {
      prompt:
        "Bank Sampah Lestari menimbang total sampah pekan ini sebanyak 330 kg. Sepertiga dari total sampah berasal dari toko/badan usaha dan sisanya berasal dari masyarakat Desa Makmur. Jika rata-rata sampah yang disetorkan tiap keluarga adalah 5 kg, berapa jumlah keluarga yang menyetorkan sampah pada pekan tersebut?",
      acceptedKeluarga: ["44", "44keluarga"],
      feedback:
        "Sampah toko = (1/3) × 330 = 110 kg. Misal k = banyak keluarga, maka 5k + 110 = 330 ↔ 5k = 220 ↔ k = 44 keluarga.",
    },
  },
  alifMatching: [
    {
      id: "alif1",
      sentence:
        "Alif menganggap dirinya berhasil melewati ujian matematika jika nilainya lebih dari 80.",
      expectedSymbol: "x > 80",
      hp: "{81, 82, 83, ...}",
    },
    {
      id: "alif2",
      sentence:
        "Alif menganggap dirinya berhasil melewati ujian matematika jika nilainya tidak kurang dari 80.",
      expectedSymbol: "x ≥ 80",
      hp: "{80, 81, 82, ...}",
    },
    {
      id: "alif3",
      sentence:
        "Alif menganggap dirinya gagal melewati ujian matematika jika nilainya tidak lebih dari 80.",
      expectedSymbol: "x ≤ 80",
      hp: "{..., 78, 79, 80}",
    },
    {
      id: "alif4",
      sentence:
        "Alif menganggap dirinya gagal melewati ujian matematika jika nilainya kurang dari 80.",
      expectedSymbol: "x < 80",
      hp: "{..., 77, 78, 79}",
    },
  ],
  inequalitySignChecks: [
    {
      id: "isc1",
      text: "Penggunaan tanda > biasanya ditandai dengan kalimat 'lebih dari'. Pada himpunan penyelesaian, angka batas TIDAK termasuk.",
      expected: "ya",
      explanation:
        "Benar! Pada garis bilangan digambarkan dengan bulatan kosong (○).",
    },
    {
      id: "isc2",
      text: "Penggunaan tanda ≥ biasanya ditandai dengan kalimat 'lebih dari sama dengan', 'minimal', atau 'tidak kurang dari'. Angka batas TERMASUK.",
      expected: "ya",
      explanation:
        "Benar! Pada garis bilangan digambarkan dengan bulatan penuh (●).",
    },
    {
      id: "isc3",
      text: "Penggunaan tanda ≤ biasanya ditandai dengan kalimat 'kurang dari sama dengan', 'maksimal', atau 'paling banyak'. Angka batas TERMASUK.",
      expected: "ya",
      explanation:
        "Benar! Pada garis bilangan digambarkan dengan bulatan penuh (●).",
    },
    {
      id: "isc4",
      text: "Penggunaan tanda < biasanya ditandai dengan kalimat 'kurang dari'. Pada himpunan penyelesaian, angka batas TIDAK termasuk.",
      expected: "ya",
      explanation:
        "Benar! Pada garis bilangan digambarkan dengan bulatan kosong (○).",
    },
  ] as readonly YesNoStatement[],
  representationPractice: [
    {
      id: "rep1",
      inequality: "x ≥ 8",
      boundary: 8,
      boundaryLabel: "8",
      op: ">=" as const,
      expectedInterval: "[8, ∞)",
      expectedSetBuilder: "{x | x ≥ 8}",
      sampleHp: "{8, 9, 10, ...}",
    },
    {
      id: "rep2",
      inequality: "x > −1",
      boundary: -1,
      boundaryLabel: "−1",
      op: ">" as const,
      expectedInterval: "(−1, ∞)",
      expectedSetBuilder: "{x | x > −1}",
      sampleHp: "{0, 1, 2, ...}",
    },
    {
      id: "rep3",
      inequality: "x ≤ −15",
      boundary: -15,
      boundaryLabel: "−15",
      op: "<=" as const,
      expectedInterval: "(−∞, −15]",
      expectedSetBuilder: "{x | x ≤ −15}",
      sampleHp: "{..., −17, −16, −15}",
    },
    {
      id: "rep4",
      inequality: "x < 20",
      boundary: 20,
      boundaryLabel: "20",
      op: "<" as const,
      expectedInterval: "(−∞, 20)",
      expectedSetBuilder: "{x | x < 20}",
      sampleHp: "{..., 17, 18, 19}",
    },
  ],
  arcticAndGeometry: {
    arcticStory:
      "Menurut data National Snow and Ice Data Center (NSIDC), pada bulan September 2020 luas 'es abadi' di Kutub Utara tidak lebih dari 230.000 km², jauh lebih tinggi dibanding tahun 2019 ketika luas es abadi kurang dari 55.000 km². Pada September 2020, volume es abadi di Samudra Arktik tidak lebih dari seperempat dari volume 40 tahun lalu yakni 900.000 km³.",
    arcticFeedback:
      "PtLSV yang terbentuk: (1) Luas es 2020: L ≤ 230.000; (2) Luas es 2019: L < 55.000; (3) Volume es 2020: V ≤ (1/4) × 900.000 atau V ≤ 225.000.",
    trianglePrompt:
      "Luas segitiga dengan alas 10 cm dan tinggi x kurang dari 45 cm².",
    triangleAnswer: "(1/2) × 10 × x < 45  ↔  5x < 45  ↔  x < 9",
    perimeterPrompt:
      "Keliling bangun (dua sisi bawah 8 cm dan empat sisi atas sama panjang w) tidak kurang dari 32 cm.",
    perimeterAnswer: "8 + 8 + 4w ≥ 32  ↔  4w + 16 ≥ 32  ↔  w ≥ 4",
  },
} as const;

export const LKS3_CONTENT = {
  number: 3 as const,
  code: "LKS 3",
  shortTitle: "Menyelesaikan PtLSV",
  title: "Menyelesaikan Pertidaksamaan Linear Satu Variabel (PtLSV)",
  objectives: [
    "Siswa mampu menggunakan sifat-sifat ketidaksamaan (termasuk perkalian/pembagian bilangan negatif) untuk menyelesaikan PtLSV.",
    "Siswa mampu menyelesaikan masalah kontekstual yang berkaitan dengan PtLSV.",
  ],
  introContext: {
    title: "Masalah Kontekstual: Ongkos Ojek Online Bu Ani",
    story:
      "Bu Ani ingin pergi ke pasar yang berjarak kurang dari 12 km dari rumahnya. Tarif ojek online tersebut adalah Rp6.000 untuk biaya panggil dan Rp3.500 per kilometer. Jika Bu Ani memiliki uang Rp50.000, apakah uang tersebut cukup untuk membayar tarif ojek online itu?",
    feedback:
      "Karena jarak d < 12 km, biaya total = 6.000 + 3.500d < 6.000 + 3.500(12) = 6.000 + 42.000 = Rp48.000. Karena Rp48.000 < Rp50.000, uang Bu Ani CUKUP!",
  },
  recallPrompt:
    "Buatlah PtLSV dari pernyataan: \"Siswa yang mendapatkan nilai tidak lebih dari 75 harus mengikuti remedial\", lalu nyatakan himpunan penyelesaiannya dalam 3 cara!",
  recallFeedback:
    "Model: x ≤ 75. (1) Notasi interval: (−∞, 75] atau dalam konteks nilai [0, 75]; (2) Notasi pembentuk himpunan: {x | x ≤ 75}; (3) Garis bilangan: titik penuh ● di 75 dengan panah ke kiri.",
  observationPatterns: [
    {
      op: "Pengurangan",
      left: "x + 8 < 5  →  x < −3",
      right: "x + 8 > 5  →  x > −3",
      signChanged: false,
    },
    {
      op: "Penjumlahan",
      left: "y − 3 < 11  →  y < 14",
      right: "y − 3 > 11  →  y > 14",
      signChanged: false,
    },
    {
      op: "Pembagian Bilangan Positif",
      left: "3z < 18  →  z < 6",
      right: "3z > 18  →  z > 6",
      signChanged: false,
    },
    {
      op: "Perkalian Bilangan Positif",
      left: "(1/5)j < 10  →  j < 50",
      right: "(1/5)j > 10  →  j > 50",
      signChanged: false,
    },
    {
      op: "Pembagian Bilangan Negatif",
      left: "−7k < 14  →  k > −2",
      right: "−7k > 14  →  k < −2",
      signChanged: true,
    },
    {
      op: "Perkalian Bilangan Negatif",
      left: "−(1/4)m < 12  →  m > −48",
      right: "−(1/4)m > 12  →  m < −48",
      signChanged: true,
    },
  ],
  inequalityProperties: [
    {
      id: "ip1",
      text: "Operasi pengurangan dan penjumlahan pada kedua ruas PtLSV TIDAK mengubah arah tanda pertidaksamaan.",
      expected: "ya",
      explanation: "Benar! Jika a < b maka a ± c < b ± c.",
    },
    {
      id: "ip2",
      text: "Operasi perkalian dan pembagian dengan bilangan POSITIF pada kedua ruas PtLSV TIDAK mengubah arah tanda pertidaksamaan.",
      expected: "ya",
      explanation: "Benar! Untuk c > 0, jika a < b maka ac < bc dan a/c < b/c.",
    },
    {
      id: "ip3",
      text: "Operasi perkalian dan pembagian dengan bilangan NEGATIF pada kedua ruas PtLSV AKAN MEMBALIK arah tanda pertidaksamaan.",
      expected: "ya",
      explanation:
        "Benar! Contoh: −7k < 14 dibagi −7 menghasilkan k > −2 (tanda < berbalik menjadi >).",
    },
  ] as readonly YesNoStatement[],
  anaEggsProblem: {
    story:
      "Ana membantu ibunya berjualan di pasar. Seorang pembeli membeli 5 butir telur. Saat Ana meletakkan bandul 250 gram (100g + 100g + 50g), ternyata timbangan telur lebih berat. Namun, ketika Ana menambahkan bandul 10 gram lagi (total 260 gram), timbangan bandul menjadi lebih berat. Berapakah kemungkinan berat 5 butir telur (dan berat rata-rata 1 butir telur) tersebut?",
    feedback:
      "Misal T = berat 5 butir telur → 250 < T < 260 gram (kemungkinan antara 250 g dan 260 g, misal 255 g). Jika t = berat 1 butir telur → 250 < 5t < 260 ↔ 50 < t < 52 gram per butir.",
  },
  diskusiProblems: {
    limbahPabrik: {
      story:
        "Sebuah pabrik menghasilkan limbah cair sebesar 16 liter per jam dan menghasilkan 2 liter untuk memulai beroperasi. Untuk menjaga kualitas air agar tetap baik, jumlah limbah total tidak boleh melebihi 410 liter dalam lima hari kerja.",
      acceptedMaxHours: ["5", "5jam", "x<=5"],
      feedback:
        "Batas limbah per hari = 410 ÷ 5 = 82 liter/hari. (a) Model: 2 + 16x ≤ 82 ↔ 16x ≤ 80 ↔ x ≤ 5 jam/hari. (b) 3 cara penyajian: Interval (−∞, 5] (konteks durasi: [0, 5]), Pembentuk himpunan {x | x ≤ 5}, Garis bilangan ● di 5 dengan panah ke kiri. (c) Jika beroperasi 8 jam/hari: 2 + 16(8) = 130 liter > 82 liter → YA, berpotensi menurunkan kualitas air!",
    },
    pabrikBaru: {
      story:
        "Sebuah perusahaan ingin membangun pabrik baru berbentuk persegi panjang dengan luas minimal 640 m² dan lebar 20 m. Lahan yang tersedia berbentuk persegi panjang berukuran panjang 40 m dan lebar 30 m.",
      acceptedMaxArea: ["800", "800m2"],
      feedback:
        "(a) Luas ≥ 640 ↔ 20p ≥ 640 ↔ p ≥ 32 m. Karena panjang lahan maksimal 40 m, kemungkinan panjang pabrik adalah 32 m, 33 m, ..., hingga 40 m (32 ≤ p ≤ 40). (b) Dengan lebar tetap 20 m, luas terbesar adalah 40 m × 20 m = 800 m² (catatan: jika seluruh lahan dipakai tanpa batasan lebar 20 m, luas lahan total 40 × 30 = 1.200 m²).",
    },
  },
} as const;
