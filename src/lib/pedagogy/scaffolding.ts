import { EquationState } from "@/lib/math/plsv-engine";
import { eqRat, formatRat, rat } from "@/lib/math/rational";

export type ScaffoldingLevel = 1 | 2 | 3;

export type ErrorPattern =
  | "SINGLE_SIDE_OP"
  | "SIGN_FLIP_PINDAH_RUAS"
  | "DIVIDE_BY_ZERO"
  | "UNLIKE_TERMS"
  | "DISTRIBUTIVE_OMISSION"
  | "PRODUCES_FRACTION"
  | "GENERAL_STUCK";

export type FocusTarget =
  | "balance_restoration"
  | "variable_both_sides"
  | "clear_constant"
  | "isolate_coefficient"
  | "solved"
  | "conceptual";

export interface ScaffoldingTier {
  readonly level: ScaffoldingLevel;
  readonly tag: string;
  readonly title: string;
  readonly body: string;
}

export interface ScaffoldingResponse {
  readonly pattern: ErrorPattern;
  readonly focusTarget: FocusTarget;
  readonly levels: readonly ScaffoldingTier[];
}

export interface FadingConfig {
  readonly stageNumber: 1 | 2 | 3 | 4;
  readonly showVisualByDefault: boolean;
  readonly maxHintLevel: ScaffoldingLevel;
  readonly fadingLabel: string;
  readonly description: string;
}

function analyzeEquationFocus(state: EquationState): {
  focusTarget: FocusTarget;
  visualCue: string;
  reflectiveQuestion: string;
  analogExample: string;
} {
  if (!state.isBalanced) {
    return {
      focusTarget: "balance_restoration",
      visualCue:
        "Perhatikan lengan timbangan yang sedang miring. Tanda di titik tumpu berubah menjadi bukan sama dengan (≠).",
      reflectiveQuestion:
        "Operasi tadi baru mengubah satu ruas saja. Perlakuan apa yang harus kamu terapkan pada ruas satunya agar timbangan kembali sejajar?",
      analogExample:
        "Contoh analog: Jika pada timbangan seimbang kamu menambah +2 di ruas kiri, kamu juga wajib menambah +2 di ruas kanan agar tanda '=' tetap terjaga.",
    };
  }

  const hasLeftX = state.left.x.num !== 0;
  const hasRightX = state.right.x.num !== 0;

  if (hasLeftX && hasRightX) {
    const smallerSide =
      Math.abs(state.right.x.num / state.right.x.den) <=
      Math.abs(state.left.x.num / state.left.x.den)
        ? "kanan"
        : "kiri";
    const termToClear = smallerSide === "kanan" ? state.right.x : state.left.x;
    const termText = `${formatRat(termToClear)}x`;
    return {
      focusTarget: "variable_both_sides",
      visualCue: `Sorotan visual: Variabel x masih muncul di kedua ruas. Fokuskan pandanganmu pada suku ${termText} di ruas ${smallerSide}.`,
      reflectiveQuestion: `Agar variabel x hanya terkumpul di satu ruas, operasi penjumlahan atau pengurangan variabel apa yang bisa membuat ${termText} di ruas ${smallerSide} menjadi 0 (membentuk pasangan nol)?`,
      analogExample:
        "Contoh analog: Pada 4x + 1 = x + 10, kita kurangi x pada kedua ruas sehingga menjadi 3x + 1 = 10. Sekarang variabel hanya ada di satu ruas.",
    };
  }

  // Variable is on one side only
  const varSide = hasLeftX ? state.left : state.right;
  const varSideName = hasLeftX ? "kiri" : "kanan";

  if (varSide.c.num !== 0) {
    const constStr = formatRat(varSide.c);
    const signWord = varSide.c.num > 0 ? "positif" : "negatif";
    return {
      focusTarget: "clear_constant",
      visualCue: `Sorotan visual: Di ruas ${varSideName}, suku variabel masih ditemani konstanta ${constStr} (${signWord}).`,
      reflectiveQuestion: `Bilangan apa yang jika dijumlahkan dengan ${constStr} menghasilkan 0 (pasangan nol), dan apakah kamu sudah menerapkannya di kedua ruas?`,
      analogExample:
        "Contoh analog: Pada 3x - 4 = 11, konstanta -4 dihilangkan dengan menambah +4 pada kedua ruas → 3x = 15.",
    };
  }

  if (!eqRat(varSide.x, rat(1))) {
    const coeffStr = formatRat(varSide.x);
    return {
      focusTarget: "isolate_coefficient",
      visualCue: `Sorotan visual: Suku variabel sudah sendirian di ruas ${varSideName}, tetapi koefisiennya masih ${coeffStr} (belum 1).`,
      reflectiveQuestion: `Agar koefisien ${coeffStr} berubah menjadi 1 (menjadi x saja), kedua ruas sebaiknya dibagi dengan bilangan berapa?`,
      analogExample:
        "Contoh analog: Pada -3x = 12, kita membagi kedua ruas dengan -3 (bukan menambah 3) sehingga diperoleh x = -4.",
    };
  }

  return {
    focusTarget: "solved",
    visualCue: "Variabel x sudah sendirian dengan koefisien 1 dan timbangan sejajar.",
    reflectiveQuestion:
      "Coba lakukan uji substitusi: jika nilai x tersebut dimasukkan kembali ke persamaan awal, apakah hasil ruas kiri sama dengan ruas kanan?",
    analogExample:
      "Contoh analog: Jika x = 5 untuk 2x + 1 = 11, maka 2(5) + 1 = 11 (benar, kedua ruas setara).",
  };
}

export function getContingentScaffolding(
  pattern: ErrorPattern,
  state: EquationState,
  maxLevelUnlocked: ScaffoldingLevel
): ScaffoldingResponse {
  const eqFocus = analyzeEquationFocus(state);

  let allLevels: ScaffoldingTier[];
  let focusTarget: FocusTarget = eqFocus.focusTarget;

  switch (pattern) {
    case "SINGLE_SIDE_OP":
      focusTarget = "balance_restoration";
      allLevels = [
        {
          level: 1,
          tag: "Bantuan Visual (Anghileri L1)",
          title: "Level 1: Amati Kemiringan Timbangan",
          body: "Tanda '=' berarti kesetaraan nilai kedua ruas. Karena kamu baru mengubah satu ruas, timbangan langsung miring (≠).",
        },
        {
          level: 2,
          tag: "Pertanyaan Reflektif (Anghileri L2)",
          title: "Level 2: Pertanyaan Pemandu Kesetaraan",
          body: "Apa yang harus kamu lakukan pada ruas yang belum disentuh agar keseimbangan timbangan pulih kembali, atau gunakan tombol Urungkan (Undo) lalu pakai panel Operasi Kedua Ruas?",
        },
        {
          level: 3,
          tag: "Jembatan Konseptual (Anghileri L3)",
          title: "Level 3: Contoh Analog Kesetaraan",
          body: "Contoh analog: Jika x + 4 = 9, mengurangi 4 hanya di kiri menghasilkan x ≠ 9 (miring). Mengurangi 4 di kedua ruas menghasilkan x + 4 - 4 = 9 - 4, tetap seimbang.",
        },
      ];
      break;

    case "DIVIDE_BY_ZERO":
      focusTarget = "conceptual";
      allLevels = [
        {
          level: 1,
          tag: "Bantuan Visual (Anghileri L1)",
          title: "Level 1: Aturan Pembagian dengan Nol",
          body: "Operasi membagi kedua ruas dengan nol (0) ditolak karena pembagian dengan 0 tidak terdefinisi dalam matematika.",
        },
        {
          level: 2,
          tag: "Pertanyaan Reflektif (Anghileri L2)",
          title: "Level 2: Pilih Pembagi yang Tepat",
          body: "Lihat angka di depan variabel x (koefisien x). Bilangan tak nol berapa yang jika dipakai membagi koefisien tersebut menghasilkan 1?",
        },
        {
          level: 3,
          tag: "Jembatan Konseptual (Anghileri L3)",
          title: "Level 3: Contoh Analog Pembagian",
          body: "Contoh analog: Untuk 4x = 20, koefisien x adalah 4 (bukan 0). Bagi kedua ruas dengan 4 sehingga diperoleh x = 5.",
        },
      ];
      break;

    case "PRODUCES_FRACTION":
      focusTarget = "clear_constant";
      allLevels = [
        {
          level: 1,
          tag: "Bantuan Visual (Anghileri L1)",
          title: "Level 1: Urutan Penyederhanaan Lebih Mudah",
          body: "Langkah pembagianmu tetap sah secara matematis (pecahan tersimpan eksak), tetapi konstanta di sisi variabel ikut berubah menjadi pecahan.",
        },
        {
          level: 2,
          tag: "Pertanyaan Reflektif (Anghileri L2)",
          title: "Level 2: Strategi Mengosongkan Konstanta Dulu",
          body: "Jika kamu klik Urungkan (Undo), suku konstanta mana yang sebaiknya dibuat nol terlebih dahulu dengan penjumlahan atau pengurangan sebelum membagi?",
        },
        {
          level: 3,
          tag: "Jembatan Konseptual (Anghileri L3)",
          title: "Level 3: Contoh Analog Strategi Efisien",
          body: "Contoh analog: Pada 5x + 2 = 17, kurangi 2 di kedua ruas dulu menjadi 5x = 15, baru bagi kedua ruas dengan 5. Hasilnya bulat tanpa pecahan rumit.",
        },
      ];
      break;

    case "SIGN_FLIP_PINDAH_RUAS":
      focusTarget = "conceptual";
      allLevels = [
        {
          level: 1,
          tag: "Bantuan Visual (Anghileri L1)",
          title: "Level 1: Hindari 'Sihir Pindah Ruas'",
          body: "Hati-hati! Memindahkan angka atau koefisien secara mekanis sering membuat tanda (+ / −) atau operasi (kali vs tambah) tertukar.",
        },
        {
          level: 2,
          tag: "Pertanyaan Reflektif (Anghileri L2)",
          title: "Level 2: Operasi Balikan pada Kedua Ruas",
          body: "Daripada 'memindah ruas', tanyakan: operasi apa yang sedang melekat pada variabel x (tambah, kurang, atau kali), dan apa operasi kebalikannya untuk diterapkan di kedua ruas?",
        },
        {
          level: 3,
          tag: "Jembatan Konseptual (Anghileri L3)",
          title: "Level 3: Contoh Analog Koefisien Negatif",
          body: "Contoh analog: Pada -2x = 10, angka -2 sedang MENGALIKAN x, bukan mengurangi x. Jadi kedua ruas dibagi -2 (bukan ditambah 2).",
        },
      ];
      break;

    case "DISTRIBUTIVE_OMISSION":
      focusTarget = "conceptual";
      allLevels = [
        {
          level: 1,
          tag: "Bantuan Visual (Anghileri L1)",
          title: "Level 1: Perhatikan Tanda Kurung",
          body: "Bilangan di luar tanda kurung berlaku untuk SEMUA suku di dalam tanda kurung, bukan hanya suku pertama.",
        },
        {
          level: 2,
          tag: "Pertanyaan Reflektif (Anghileri L2)",
          title: "Level 2: Cek Setiap Suku di Dalam Kurung",
          body: "Ada berapa suku di dalam tanda kurung? Apakah bilangan di depan kurung sudah dikalikan ke suku variabel DAN suku konstanta?",
        },
        {
          level: 3,
          tag: "Jembatan Konseptual (Anghileri L3)",
          title: "Level 3: Contoh Analog Sifat Distributif",
          body: "Contoh analog: 3(x - 4) artinya ada 3 kelompok (x - 4), sehingga hasilnya 3·x - 3·4 = 3x - 12, bukan 3x - 4.",
        },
      ];
      break;

    case "UNLIKE_TERMS":
      focusTarget = "conceptual";
      allLevels = [
        {
          level: 1,
          tag: "Bantuan Visual (Anghileri L1)",
          title: "Level 1: Suku Variabel vs Suku Konstanta",
          body: "Balok biru (x) dan balok hijau (satuan 1) adalah jenis besaran yang berbeda sehingga tidak dapat digabung menjadi satu suku.",
        },
        {
          level: 2,
          tag: "Pertanyaan Reflektif (Anghileri L2)",
          title: "Level 2: Cek Kesamaan Jenis Suku",
          body: "Apakah 2 kotak bermassa x ditambah 3 koin satuan sama dengan 5 kotak bermassa x? Coba uji jika x = 10.",
        },
        {
          level: 3,
          tag: "Jembatan Konseptual (Anghileri L3)",
          title: "Level 3: Contoh Analog Suku Sejenis",
          body: "Contoh analog: 2x + 3 tetap ditulis 2x + 3. Hanya suku sejenis yang dapat dijumlahkan, misalnya 2x + 4x = 6x.",
        },
      ];
      break;

    case "GENERAL_STUCK":
    default:
      allLevels = [
        {
          level: 1,
          tag: "Bantuan Visual (Anghileri L1)",
          title: "Level 1: Fokus pada Struktur Persamaan",
          body: eqFocus.visualCue,
        },
        {
          level: 2,
          tag: "Pertanyaan Reflektif (Anghileri L2)",
          title: "Level 2: Pertanyaan Pemandu Langkah Berikutnya",
          body: eqFocus.reflectiveQuestion,
        },
        {
          level: 3,
          tag: "Jembatan Konseptual (Anghileri L3)",
          title: "Level 3: Contoh Serupa (Bukan Kunci Soal Ini)",
          body: eqFocus.analogExample,
        },
      ];
      break;
  }

  return {
    pattern,
    focusTarget,
    levels: allLevels.filter((tier) => tier.level <= maxLevelUnlocked),
  };
}

export function getFadingConfig(stageNumber: 1 | 2 | 3 | 4): FadingConfig {
  switch (stageNumber) {
    case 1:
      return {
        stageNumber: 1,
        showVisualByDefault: true,
        maxHintLevel: 3,
        fadingLabel: "Bantuan Penuh (Tahap Awal)",
        description:
          "Seluruh 3 level scaffolding dan petunjuk visual terbuka penuh untuk membangun fondasi konsep PLSV.",
      };
    case 2:
      return {
        stageNumber: 2,
        showVisualByDefault: true,
        maxHintLevel: 3,
        fadingLabel: "Bantuan Terpadu (Visual + Simbolik)",
        description:
          "Timbangan digital aktif berdampingan dengan jejak simbolik (↔) serta scaffolding adaptif 3 level.",
      };
    case 3:
      return {
        stageNumber: 3,
        showVisualByDefault: false,
        maxHintLevel: 2,
        fadingLabel: "Pengurangan Bantuan (Fading)",
        description:
          "Bantuan visual disembunyikan di awal dan scaffolding dibatasi hingga Level 2 (pertanyaan reflektif) untuk melatih kemandirian.",
      };
    case 4:
      return {
        stageNumber: 4,
        showVisualByDefault: false,
        maxHintLevel: 1,
        fadingLabel: "Transfer Tanggung Jawab (Mandiri HOTS)",
        description:
          "Bantuan minimal (Level 1 saja) agar kamu menganalisis, mengevaluasi, dan mencipta soal PLSV secara mandiri.",
      };
  }
}
