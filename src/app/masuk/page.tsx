"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  GraduationCap,
  KeyRound,
  LogIn,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export default function MasukPage() {
  const router = useRouter();
  const { refreshProfile, loginDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState<"guru" | "siswa" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error: signInErr } = await supabase.auth.signInWithPassword(
        {
          email: email.trim().toLowerCase(),
          password,
        }
      );

      if (signInErr || !data.user) {
        setError(
          "Email atau kata sandi belum cocok. Periksa kembali atau gunakan akun Demo di sebelah kanan."
        );
        return;
      }

      await refreshProfile();
      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      router.push(prof?.role === "guru" ? "/guru" : "/sandbox");
      router.refresh();
    } catch {
      setError("Gagal terhubung ke layanan autentikasi. Coba beberapa saat lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDemo(role: "guru" | "siswa") {
    setError(null);
    setDemoLoading(role);
    const result = await loginDemo(role);
    setDemoLoading(null);

    if (!result.ok) {
      setError(result.error || "Gagal masuk akun demo.");
      return;
    }

    router.push(role === "guru" ? "/guru" : "/sandbox");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--cobalt)]">
          Autentikasi Dual-Path · RuasSetara
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
          Masuk ke Ruang Belajar PLSV
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)] sm:text-base">
          Gunakan akun terdaftar untuk menyimpan progres LKPD, hasil evaluasi
          diagnostik, skor kuis, dan berdiskusi secara real-time. Untuk
          pengujian cepat oleh dosen atau pengamat, tersedia akses Demo 1-Klik.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-[var(--vermilion)]/30 bg-[var(--vermilion-soft)] px-4 py-3 text-sm font-medium text-[var(--vermilion)]"
        >
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Path 1: Real Email & Password Login */}
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs lg:col-span-7">
          <div className="mb-5 flex items-center gap-2.5 border-b border-[var(--border-subtle)] pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--cobalt-soft)] text-[var(--cobalt)]">
              <KeyRound className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-[var(--ink)]">
                Masuk dengan Akun Terdaftar
              </h2>
              <p className="text-xs text-[var(--ink-muted)]">
                Berlaku untuk akun Siswa maupun Guru (Supabase Auth)
              </p>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
              >
                Alamat Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sekolah.sch.id"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-subtle)] focus:border-[var(--cobalt)] focus:outline-none focus:ring-2 focus:ring-[var(--cobalt)]/20"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
              >
                Kata Sandi
              </label>
              <input
                id="login-password"
                type="password"
                required
                minLength={6}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-subtle)] focus:border-[var(--cobalt)] focus:outline-none focus:ring-2 focus:ring-[var(--cobalt)]/20"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || demoLoading !== null}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--cobalt)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--cobalt-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              {submitting ? "Memverifikasi Akun..." : "Masuk Sekarang"}
            </button>
          </form>

          <div className="mt-5 border-t border-[var(--border-subtle)] pt-4 text-sm text-[var(--ink-muted)]">
            Belum memiliki akun RuasSetara?{" "}
            <Link
              href="/daftar"
              className="font-semibold text-[var(--cobalt)] underline-offset-4 hover:underline"
            >
              Daftar Akun Baru (Siswa / Guru)
            </Link>
          </div>
        </section>

        {/* Path 2: 1-Click Demo Login for Lecturer / Evaluator */}
        <aside className="flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-6 lg:col-span-5">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--emerald)]/30 bg-[var(--emerald-soft)] px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--emerald)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Akses Pengujian Cepat
            </div>
            <h2 className="mt-3 font-display text-lg font-semibold text-[var(--ink)]">
              Mode Demo 1-Klik
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-muted)]">
              Dirancang khusus untuk memudahkan dosen pengampu atau pengamat
              mengevaluasi fitur penuh dari perspektif Siswa dan Guru tanpa
              perlu mendaftar ulang. Data demo terhubung langsung ke basis data
              asli.
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => handleDemo("siswa")}
                disabled={demoLoading !== null || submitting}
                className="group flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3.5 text-left transition hover:border-[var(--cobalt)] hover:shadow-xs disabled:opacity-60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--cobalt-soft)] text-[var(--cobalt)]">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--ink)]">
                      {demoLoading === "siswa"
                        ? "Membuka Sesi Siswa..."
                        : "Masuk sebagai Siswa Demo"}
                    </div>
                    <div className="text-xs text-[var(--ink-muted)]">
                      Nadia Putri · Kelas VII-A · Akses Sandbox, LKPD, Evaluasi,
                      Kuis & Diskusi
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ink-subtle)] transition group-hover:translate-x-0.5 group-hover:text-[var(--cobalt)]" />
              </button>

              <button
                type="button"
                onClick={() => handleDemo("guru")}
                disabled={demoLoading !== null || submitting}
                className="group flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3.5 text-left transition hover:border-[var(--emerald)] hover:shadow-xs disabled:opacity-60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--emerald-soft)] text-[var(--emerald)]">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--ink)]">
                      {demoLoading === "guru"
                        ? "Membuka Sesi Guru..."
                        : "Masuk sebagai Guru Demo"}
                    </div>
                    <div className="text-xs text-[var(--ink-muted)]">
                      Ibu Sari Wulandari, M.Pd. · Panel Analitik Kelas &
                      Verifikasi Diskusi
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--ink-subtle)] transition group-hover:translate-x-0.5 group-hover:text-[var(--emerald)]" />
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-3 text-xs text-[var(--ink-muted)]">
            <span className="font-semibold text-[var(--ink)]">Catatan:</span>{" "}
            Lab Timbangan Aljabar (<Link href="/sandbox" className="text-[var(--cobalt)] underline">/sandbox</Link>) juga dapat dieksplorasi secara bebas tanpa login terlebih dahulu.
          </div>
        </aside>
      </div>
    </div>
  );
}
