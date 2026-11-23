"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldAlert, UserCheck, UserPlus } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function DaftarPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [role, setRole] = useState<"siswa" | "guru">("siswa");
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("VII-A");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teacherCode, setTeacherCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          role,
          class_name: className,
          teacher_code: role === "guru" ? teacherCode : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Pendaftaran gagal. Coba periksa isian Anda.");
        return;
      }

      await refreshProfile();
      router.push(role === "guru" ? "/guru" : "/sandbox");
      router.refresh();
    } catch {
      setError("Koneksi ke server terputus. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--cobalt)]">
          Registrasi Akun · RuasSetara
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--ink)]">
          Buat Akun RuasSetara
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Pilih peran Anda. Akun Siswa dapat langsung digunakan untuk
          mengerjakan LKPD, evaluasi diagnostik, kuis, dan diskusi. Pendaftaran
          peran Guru diverifikasi melalui kode akses dari pengampu.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-[var(--vermilion)]/30 bg-[var(--vermilion-soft)] px-4 py-3 text-sm font-medium text-[var(--vermilion)]"
        >
          {error}
        </div>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs">
        {/* Role Selector */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setRole("siswa");
              setClassName("VII-A");
            }}
            className={`flex items-center gap-3 rounded-lg border p-3.5 text-left transition ${
              role === "siswa"
                ? "border-[var(--cobalt)] bg-[var(--cobalt-soft)] text-[var(--ink)] ring-1 ring-[var(--cobalt)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            <GraduationCap
              className={`h-5 w-5 shrink-0 ${
                role === "siswa" ? "text-[var(--cobalt)]" : ""
              }`}
            />
            <div>
              <div className="text-sm font-semibold">Siswa SMP</div>
              <div className="text-xs opacity-80">Belajar & kerjakan LKPD</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("guru");
              setClassName("Guru Matematika");
            }}
            className={`flex items-center gap-3 rounded-lg border p-3.5 text-left transition ${
              role === "guru"
                ? "border-[var(--emerald)] bg-[var(--emerald-soft)] text-[var(--ink)] ring-1 ring-[var(--emerald)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            <UserCheck
              className={`h-5 w-5 shrink-0 ${
                role === "guru" ? "text-[var(--emerald)]" : ""
              }`}
            />
            <div>
              <div className="text-sm font-semibold">Guru / Pendidik</div>
              <div className="text-xs opacity-80">Pantau analitik kelas</div>
            </div>
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-name"
                className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
              >
                Nama Lengkap
              </label>
              <input
                id="reg-name"
                type="text"
                required
                minLength={2}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={
                  role === "guru" ? "Contoh: Budi Santoso, S.Pd." : "Contoh: Anisa Rahma"
                }
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--cobalt)] focus:outline-none focus:ring-2 focus:ring-[var(--cobalt)]/20"
              />
            </div>

            <div>
              <label
                htmlFor="reg-class"
                className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
              >
                {role === "guru" ? "Instansi / Jabatan" : "Kelas"}
              </label>
              <input
                id="reg-class"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder={role === "guru" ? "SMPN 1 Yogyakarta" : "VII-A"}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--cobalt)] focus:outline-none focus:ring-2 focus:ring-[var(--cobalt)]/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-email"
              className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
            >
              Alamat Email
            </label>
            <input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--cobalt)] focus:outline-none focus:ring-2 focus:ring-[var(--cobalt)]/20"
            />
          </div>

          <div>
            <label
              htmlFor="reg-password"
              className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
            >
              Kata Sandi
            </label>
            <input
              id="reg-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--cobalt)] focus:outline-none focus:ring-2 focus:ring-[var(--cobalt)]/20"
            />
          </div>

          {role === "guru" && (
            <div className="rounded-lg border border-[var(--ochre-border)] bg-[var(--ochre-bg)] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--ochre-ink)]">
                <ShieldAlert className="h-4 w-4" />
                Verifikasi Peran Pendidik (Validasi Server)
              </div>
              <label
                htmlFor="reg-teacher-code"
                className="mb-1.5 block text-xs font-medium text-[var(--ink)]"
              >
                Kode Akses Guru
              </label>
              <input
                id="reg-teacher-code"
                type="text"
                required
                value={teacherCode}
                onChange={(e) => setTeacherCode(e.target.value)}
                placeholder="Masukkan kode akses guru (contoh: GURU-TDPM2026)"
                className="w-full rounded-lg border border-[var(--ochre-border)] bg-[var(--surface)] px-3.5 py-2 font-mono text-sm text-[var(--ink)] focus:border-[var(--emerald)] focus:outline-none"
              />
              <p className="mt-1.5 text-[11px] text-[var(--ink-muted)]">
                Untuk keperluan uji coba UAS TDPM 2026, gunakan kode{" "}
                <code className="rounded bg-white px-1.5 py-0.5 font-mono font-semibold text-[var(--ink)]">
                  GURU-TDPM2026
                </code>
                .
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 ${
              role === "guru"
                ? "bg-[var(--emerald)] hover:opacity-90"
                : "bg-[var(--cobalt)] hover:bg-[var(--cobalt-hover)]"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            {submitting
              ? "Mendaftarkan Akun..."
              : role === "guru"
              ? "Daftar sebagai Guru"
              : "Daftar sebagai Siswa"}
          </button>
        </form>

        <div className="mt-5 border-t border-[var(--border-subtle)] pt-4 text-sm text-[var(--ink-muted)]">
          Sudah punya akun atau ingin langsung mencoba mode demo?{" "}
          <Link
            href="/masuk"
            className="font-semibold text-[var(--cobalt)] underline-offset-4 hover:underline"
          >
            Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
