"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Scale,
  Trophy,
  X,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const NAV_ITEMS = [
  { href: "/sandbox", label: "Lab Timbangan", icon: Scale },
  { href: "/lkpd", label: "LKPD Digital", icon: BookOpen },
  { href: "/evaluasi", label: "Evaluasi", icon: ClipboardCheck },
  { href: "/kuis", label: "Kuis & Peringkat", icon: Trophy },
  { href: "/diskusi", label: "Diskusi Kelas", icon: MessageSquare },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus:outline-none"
          aria-label="RuasSetara Beranda"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect
              x="1"
              y="1"
              width="30"
              height="30"
              rx="8"
              fill="#FFFFFF"
              stroke="#D5DDE5"
              strokeWidth="1.5"
            />
            <line
              x1="7"
              y1="14"
              x2="25"
              y2="14"
              stroke="#101828"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <polygon points="16,15 11.5,24 20.5,24" fill="#101828" />
            <rect x="6.5" y="9" width="6" height="4" rx="1.2" fill="#1D4ED8" />
            <rect x="19.5" y="9" width="6" height="4" rx="1.2" fill="#0D7A5F" />
          </svg>
          <div className="leading-none">
            <span className="font-display text-lg font-bold tracking-tight text-[var(--ink)]">
              Ruas<span className="text-[var(--cobalt)]">Setara</span>
            </span>
            <span className="mt-0.5 block font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--ink-subtle)]">
              PLSV · SMP VII
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--cobalt-soft)] text-[var(--cobalt)]"
                    : "text-[var(--ink-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          {profile?.role === "guru" && (
            <Link
              href="/guru"
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                pathname === "/guru"
                  ? "bg-[var(--emerald-soft)] text-[var(--emerald)]"
                  : "text-[var(--emerald)] hover:bg-[var(--emerald-soft)]/70"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Panel Guru
            </Link>
          )}
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden items-center gap-2.5 lg:flex">
          {loading ? (
            <div className="h-8 w-28 animate-pulse rounded-lg bg-[var(--surface-muted)]" />
          ) : profile ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1.5">
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                    profile.role === "guru"
                      ? "bg-[var(--emerald)] text-white"
                      : "bg-[var(--cobalt)] text-white"
                  }`}
                >
                  {profile.role}
                </span>
                <span className="max-w-[140px] truncate text-xs font-semibold text-[var(--ink)]">
                  {profile.full_name}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                title="Keluar"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-medium text-[var(--ink-muted)] transition hover:border-[var(--vermilion)]/40 hover:text-[var(--vermilion)]"
              >
                <LogOut className="h-3.5 w-3.5" />
                Keluar
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/masuk"
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--surface-muted)]"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="rounded-lg bg-[var(--cobalt)] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--cobalt-hover)]"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu navigasi"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--ink)] lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 lg:hidden">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    active
                      ? "bg-[var(--cobalt-soft)] text-[var(--cobalt)]"
                      : "text-[var(--ink-muted)] hover:bg-[var(--surface-muted)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            {profile?.role === "guru" && (
              <Link
                href="/guru"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--emerald)] hover:bg-[var(--emerald-soft)]"
              >
                <LayoutDashboard className="h-4 w-4" />
                Panel Guru
              </Link>
            )}
          </div>

          <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
            {profile ? (
              <div className="flex items-center justify-between">
                <div>
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                      profile.role === "guru"
                        ? "bg-[var(--emerald)] text-white"
                        : "bg-[var(--cobalt)] text-white"
                    }`}
                  >
                    {profile.role}
                  </span>
                  <div className="mt-1 text-sm font-semibold text-[var(--ink)]">
                    {profile.full_name}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--vermilion)]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Keluar
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/masuk"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-[var(--border)] py-2.5 text-center text-sm font-medium text-[var(--ink)]"
                >
                  Masuk
                </Link>
                <Link
                  href="/daftar"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-[var(--cobalt)] py-2.5 text-center text-sm font-semibold text-white"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
