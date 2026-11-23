"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Flame,
  HeartHandshake,
  Medal,
  Play,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { QUIZ_BANK, type QuizQuestion } from "@/lib/content/plsv-curriculum";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";

const QUIZ_LENGTH = 8;
const SECONDS_PER_Q = 45;

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  class_name: string;
  best_score: number;
  correct_count: number;
  max_streak: number;
}

function pickRandomQuestions(count: number): QuizQuestion[] {
  const copy = [...QUIZ_BANK];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export default function KuisPage() {
  const { user, profile } = useAuth();
  const [phase, setPhase] = useState<"lobby" | "playing" | "result">("lobby");
  const [mode, setMode] = useState<"kompetitif" | "latihan">("kompetitif");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_Q);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const loadLeaderboard = useCallback(async () => {
    setLoadingBoard(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("quiz_attempts")
        .select(
          "user_id, score, correct_count, max_streak, profiles(full_name, class_name)"
        )
        .eq("mode", "kompetitif")
        .order("score", { ascending: false })
        .limit(100);

      if (data) {
        const bestByUser = new Map<string, LeaderboardEntry>();
        for (const row of data as unknown as Array<{
          user_id: string;
          score: number;
          correct_count: number;
          max_streak: number;
          profiles: { full_name: string; class_name: string } | null;
        }>) {
          const existing = bestByUser.get(row.user_id);
          if (!existing || row.score > existing.best_score) {
            bestByUser.set(row.user_id, {
              user_id: row.user_id,
              full_name: row.profiles?.full_name ?? "Peserta",
              class_name: row.profiles?.class_name ?? "VII",
              best_score: row.score,
              correct_count: row.correct_count,
              max_streak: row.max_streak,
            });
          }
        }
        const sorted = Array.from(bestByUser.values()).sort(
          (a, b) => b.best_score - a.best_score
        );
        setLeaderboard(sorted);
      }
    } catch {
      // keep empty if offline
    } finally {
      setLoadingBoard(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const finishQuiz = useCallback(
    async (
      finalScore: number,
      finalCorrect: number,
      finalMaxStreak: number,
      activeMode: "kompetitif" | "latihan"
    ) => {
      setPhase("result");
      const duration = Math.max(1, Math.round((Date.now() - startedAt) / 1000));

      if (!user) {
        setSavedNotice(
          activeMode === "kompetitif"
            ? "Skor tampil di bawah. Masuk akun untuk mencatat namamu di Papan Peringkat kelas!"
            : "Mode Latihan selesai! Mode ini bersifat pribadi tanpa papan peringkat."
        );
        return;
      }

      try {
        const supabase = createClient();
        await supabase.from("quiz_attempts").insert({
          user_id: user.id,
          mode: activeMode,
          score: finalScore,
          correct_count: finalCorrect,
          total_questions: QUIZ_LENGTH,
          max_streak: finalMaxStreak,
          duration_seconds: duration,
        });
        if (activeMode === "kompetitif") {
          setSavedNotice("Skor kompetitif berhasil dicatat ke Papan Peringkat!");
          loadLeaderboard();
        } else {
          setSavedNotice(
            "Latihan santai tersimpan sebagai catatan pribadi (tidak ditampilkan di papan peringkat publik)."
          );
        }
      } catch {
        setSavedNotice("Sesi kuis selesai.");
      }
    },
    [startedAt, user, loadLeaderboard]
  );

  // Countdown timer ONLY in competitive mode while awaiting answer
  useEffect(() => {
    if (phase !== "playing" || mode !== "kompetitif" || selectedOpt !== null) {
      return;
    }
    if (timeLeft <= 0) {
      setSelectedOpt("__TIMEOUT__");
      setStreak(0);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, mode, selectedOpt, timeLeft]);

  function startQuiz(chosenMode: "kompetitif" | "latihan") {
    setMode(chosenMode);
    setQuestions(pickRandomQuestions(QUIZ_LENGTH));
    setCurrentIdx(0);
    setTimeLeft(SECONDS_PER_Q);
    setSelectedOpt(null);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setMaxStreak(0);
    setSavedNotice(null);
    setStartedAt(Date.now());
    setPhase("playing");
  }

  function handleAnswer(optionId: string) {
    if (selectedOpt !== null) return;
    setSelectedOpt(optionId);
    const q = questions[currentIdx];
    const isCorrect = optionId === q.correctOptionId;

    if (isCorrect) {
      const nextStreak = streak + 1;
      const timeBonus = mode === "kompetitif" ? Math.round(timeLeft * 0.5) : 0;
      const streakBonus = Math.min(40, nextStreak * 10);
      setScore((s) => s + 100 + timeBonus + streakBonus);
      setCorrectCount((c) => c + 1);
      setStreak(nextStreak);
      setMaxStreak((m) => Math.max(m, nextStreak));
    } else {
      setStreak(0);
    }
  }

  function handleNext() {
    if (currentIdx + 1 >= questions.length) {
      finishQuiz(score, correctCount, maxStreak, mode);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOpt(null);
      setTimeLeft(SECONDS_PER_Q);
    }
  }

  const currentQuestion = questions[currentIdx];
  const top10 = leaderboard.slice(0, 10);
  const personalRankIdx = user
    ? leaderboard.findIndex((e) => e.user_id === user.id)
    : -1;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="border-b border-[var(--border)] pb-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--cobalt)]">
          Modul 04 · Gamifikasi Inklusif &amp; Etis (BAB II.4 TDPM)
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-[var(--ink)]">
          Kuis Ketangkasan &amp; Papan Peringkat
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm text-[var(--ink-muted)]">
          Pilih <strong>Mode Kompetitif</strong> untuk masuk ke Top 10 Papan
          Peringkat, atau pilih <strong>Mode Latihan Santai</strong> tanpa
          timer dan tanpa peringkat publik agar belajar tetap nyaman bebas
          kecemasan.
        </p>
      </div>

      {/* LOBBY VIEW */}
      {phase === "lobby" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Mode Cards */}
          <div className="space-y-4 lg:col-span-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cobalt-soft)] px-2.5 py-1 font-mono text-[11px] font-bold text-[var(--cobalt)]">
                  <Trophy className="h-3.5 w-3.5" />
                  Mode Kompetitif
                </span>
                <span className="font-mono text-xs text-[var(--ink-subtle)]">
                  8 soal acak · 45 dtk/soal
                </span>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-[var(--ink)]">
                Tantangan Waktu &amp; Papan Peringkat
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-muted)]">
                Soal diacak dari bank 16 butir PLSV. Dapatkan bonus kecepatan
                dan bonus <em>streak</em> beruntun. Hanya skor terbaikmu yang
                ditampilkan di Top 10 agar persaingan tetap sehat.
              </p>
              <button
                type="button"
                onClick={() => startQuiz("kompetitif")}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--cobalt)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--cobalt-hover)]"
              >
                <Play className="h-4 w-4" />
                Mulai Kuis Kompetitif
              </button>
            </div>

            <div className="rounded-xl border border-[var(--emerald)]/35 bg-[var(--emerald-soft)]/40 p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[var(--emerald)]">
                  <HeartHandshake className="h-3.5 w-3.5" />
                  Mode Inklusif · Bebas Cemas
                </span>
                <span className="font-mono text-xs text-[var(--emerald)]">
                  Tanpa Timer · Privat
                </span>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-[var(--ink)]">
                Mode Latihan Santai
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-muted)]">
                Berlatih 8 soal acak dengan kecepatan belajarmu sendiri. Tidak
                ada hitung mundur dan hasil tidak dipublikasikan ke papan
                peringkat.
              </p>
              <button
                type="button"
                onClick={() => startQuiz("latihan")}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--emerald)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <Play className="h-4 w-4" />
                Mulai Latihan Santai
              </button>
            </div>
          </div>

          {/* Inclusive Top 10 Leaderboard + Personal Rank Card */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 lg:col-span-6">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-[var(--cobalt)]" />
                <h2 className="font-display text-lg font-bold text-[var(--ink)]">
                  Top 10 Papan Peringkat Kelas
                </h2>
              </div>
              <span className="font-mono text-[11px] text-[var(--ink-subtle)]">
                Skor Terbaik per Siswa
              </span>
            </div>

            {loadingBoard ? (
              <div className="mt-4 space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-11 animate-pulse rounded-lg bg-[var(--surface-muted)]"
                  />
                ))}
              </div>
            ) : top10.length === 0 ? (
              <p className="mt-4 text-xs text-[var(--ink-muted)]">
                Belum ada skor kompetitif tercatat. Jadilah yang pertama!
              </p>
            ) : (
              <ol className="mt-4 space-y-2">
                {top10.map((entry, idx) => {
                  const isMe = user && entry.user_id === user.id;
                  return (
                    <li
                      key={entry.user_id}
                      className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 ${
                        isMe
                          ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)]/70"
                          : "border-[var(--border-subtle)] bg-[var(--surface-muted)]/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold ${
                            idx === 0
                              ? "bg-[var(--cobalt)] text-white"
                              : idx === 1
                              ? "bg-[var(--emerald)] text-white"
                              : "bg-white text-[var(--ink)] border border-[var(--border)]"
                          }`}
                        >
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-[var(--ink)]">
                            {entry.full_name}{" "}
                            {isMe && (
                              <span className="font-mono text-[10px] text-[var(--cobalt)]">
                                (Kamu)
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-[var(--ink-muted)]">
                            {entry.class_name} · Benar {entry.correct_count}/
                            {QUIZ_LENGTH} · Streak {entry.max_streak}
                          </div>
                        </div>
                      </div>
                      <div className="font-mono text-base font-extrabold text-[var(--cobalt)]">
                        {entry.best_score}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            {/* Personal Rank Card (Inclusive — never shames ranks > 10 publicly) */}
            {profile && (
              <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-3.5 text-xs">
                <div className="font-mono text-[10px] font-bold uppercase text-[var(--ink-subtle)]">
                  Kartu Peringkat Pribadi ({profile.full_name})
                </div>
                {personalRankIdx >= 0 ? (
                  <p className="mt-1 text-[var(--ink)]">
                    Peringkat terbaikmu saat ini:{" "}
                    <strong className="font-mono text-[var(--cobalt)]">
                      #{personalRankIdx + 1}
                    </strong>{" "}
                    dengan skor{" "}
                    <strong className="font-mono">
                      {leaderboard[personalRankIdx].best_score}
                    </strong>
                    .
                  </p>
                ) : (
                  <p className="mt-1 text-[var(--ink-muted)]">
                    Kamu belum memiliki skor kompetitif. Selesaikan 1 sesi Mode
                    Kompetitif untuk melihat peringkat pribadimu di sini.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PLAYING VIEW */}
      {phase === "playing" && currentQuestion && (
        <div className="mx-auto mt-6 max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
            <span className="font-mono text-xs font-bold text-[var(--cobalt)]">
              SOAL {currentIdx + 1} / {questions.length} ·{" "}
              {mode === "kompetitif" ? "KOMPETITIF" : "LATIHAN SANTAI"}
            </span>
            <div className="flex items-center gap-3 font-mono text-xs font-bold">
              <span className="inline-flex items-center gap-1 text-[var(--emerald)]">
                <Flame className="h-4 w-4" />
                Streak {streak}
              </span>
              <span className="text-[var(--ink)]">Skor: {score}</span>
              {mode === "kompetitif" && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${
                    timeLeft <= 10
                      ? "bg-[var(--vermilion-soft)] text-[var(--vermilion)]"
                      : "bg-[var(--surface-muted)] text-[var(--ink)]"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {timeLeft}d
                </span>
              )}
            </div>
          </div>

          <p className="mt-5 text-base font-semibold text-[var(--ink)]">
            {currentQuestion.prompt}
          </p>
          {currentQuestion.equationDisplay && (
            <div className="mt-3 inline-block rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-2.5 font-mono text-xl font-bold text-[var(--cobalt)]">
              {currentQuestion.equationDisplay}
            </div>
          )}

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {currentQuestion.options.map((opt) => {
              const isChosen = selectedOpt === opt.id;
              const isCorrect = opt.id === currentQuestion.correctOptionId;
              let btnStyle =
                "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--cobalt)] hover:bg-[var(--cobalt-soft)]/50";
              if (selectedOpt !== null) {
                if (isCorrect) {
                  btnStyle =
                    "border-[var(--emerald)] bg-[var(--emerald-soft)] text-[var(--emerald)] font-bold";
                } else if (isChosen) {
                  btnStyle =
                    "border-[var(--vermilion)] bg-[var(--vermilion-soft)] text-[var(--vermilion)] font-bold";
                } else {
                  btnStyle =
                    "border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--ink-subtle)] opacity-65";
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={selectedOpt !== null}
                  onClick={() => handleAnswer(opt.id)}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left font-mono text-sm transition ${btnStyle}`}
                >
                  <span className="uppercase opacity-70">{opt.id}.</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {selectedOpt !== null && (
            <div className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <div className="flex items-center gap-2 text-xs font-bold">
                {selectedOpt === currentQuestion.correctOptionId ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-[var(--emerald)]" />
                    <span className="text-[var(--emerald)]">
                      Tepat sekali!
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-[var(--vermilion)]" />
                    <span className="text-[var(--vermilion)]">
                      {selectedOpt === "__TIMEOUT__"
                        ? "Waktu habis pada soal ini."
                        : "Belum tepat — pelajari langkah singkatnya:"}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1.5 font-mono text-xs text-[var(--ink)]">
                {currentQuestion.quickExplanation}
              </p>
              <button
                type="button"
                onClick={handleNext}
                className="mt-3 rounded-lg bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--cobalt)]"
              >
                {currentIdx + 1 >= questions.length
                  ? "Lihat Ringkasan Hasil"
                  : "Soal Berikutnya →"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* RESULT VIEW */}
      {phase === "result" && (
        <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--emerald-soft)] text-[var(--emerald)]">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-[var(--ink)]">
            Sesi {mode === "kompetitif" ? "Kuis Kompetitif" : "Latihan Santai"}{" "}
            Selesai!
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-[var(--surface-muted)] p-3">
              <div className="font-mono text-[10px] uppercase text-[var(--ink-subtle)]">
                Total Skor
              </div>
              <div className="mt-1 font-mono text-2xl font-extrabold text-[var(--cobalt)]">
                {score}
              </div>
            </div>
            <div className="rounded-lg bg-[var(--surface-muted)] p-3">
              <div className="font-mono text-[10px] uppercase text-[var(--ink-subtle)]">
                Akurasi
              </div>
              <div className="mt-1 font-mono text-2xl font-extrabold text-[var(--emerald)]">
                {correctCount}/{QUIZ_LENGTH}
              </div>
            </div>
            <div className="rounded-lg bg-[var(--surface-muted)] p-3">
              <div className="font-mono text-[10px] uppercase text-[var(--ink-subtle)]">
                Streak Maks.
              </div>
              <div className="mt-1 font-mono text-2xl font-extrabold text-[var(--ink)]">
                {maxStreak}
              </div>
            </div>
          </div>

          {savedNotice && (
            <p className="mt-4 rounded-lg bg-[var(--emerald-soft)] px-4 py-2.5 text-xs font-semibold text-[var(--emerald)]">
              {savedNotice}
            </p>
          )}

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setPhase("lobby")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Kembali ke Papan Peringkat
            </button>
            <button
              type="button"
              onClick={() => startQuiz(mode)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--cobalt)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--cobalt-hover)]"
            >
              Main Lagi (Soal Baru Acak)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
