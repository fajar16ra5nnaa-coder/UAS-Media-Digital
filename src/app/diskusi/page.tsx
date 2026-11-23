"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Hash,
  Lock,
  MessageSquare,
  Pin,
  Send,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessageRow } from "@/lib/supabase/types";

type ChannelKey = "umum" | "sandbox" | "lkpd" | "evaluasi";

const CHANNELS: Array<{
  key: ChannelKey;
  label: string;
  desc: string;
}> = [
  {
    key: "umum",
    label: "Diskusi Umum PLSV",
    desc: "Tanya jawab konsep dasar kesetaraan & pengumuman guru",
  },
  {
    key: "sandbox",
    label: "Lab Timbangan",
    desc: "Bahas strategi misi timbangan & pasangan nol",
  },
  {
    key: "lkpd",
    label: "LKPD 4 Tahap",
    desc: "Diskusi soal cerita, keliling, dan tantangan HOTS",
  },
  {
    key: "evaluasi",
    label: "Refleksi Evaluasi",
    desc: "Bahas miskonsepsi Klasifikasional, Korelasional, & Teoritikal",
  },
];

const MATH_SYMBOLS = ["x", "=", "↔", "≠", "+", "−", "×", "÷", "(", ")", "²"];

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function DiskusiPage() {
  const { user, profile, loading, loginDemo } = useAuth();
  const [channel, setChannel] = useState<ChannelKey>("umum");
  const [messages, setMessages] = useState<ChatMessageRow[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Read optional ?channel= query param on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ch = params.get("channel") as ChannelKey | null;
    if (ch && CHANNELS.some((c) => c.key === ch)) {
      setChannel(ch);
    }
  }, []);

  const fetchMessages = useCallback(async (activeChannel: ChannelKey) => {
    setLoadingMsgs(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("chat_messages")
        .select(
          "id, channel, user_id, content, is_verified, is_pinned, created_at, profiles(full_name, role, class_name)"
        )
        .eq("channel", activeChannel)
        .order("created_at", { ascending: true })
        .limit(100);

      if (!error && data) {
        setMessages(data as unknown as ChatMessageRow[]);
      }
    } catch {
      // ignore offline
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchMessages(channel);

    const supabase = createClient();
    const realtimeChannel = supabase
      .channel(`ruassetara-chat-${channel}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
          filter: `channel=eq.${channel}`,
        },
        () => {
          fetchMessages(channel);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, [user, channel, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const content = draft.trim();
    if (!content) return;
    if (content.length > 1000) {
      setErrorMsg("Pesan maksimal 1000 karakter.");
      return;
    }

    setSending(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("chat_messages").insert({
        channel,
        user_id: user.id,
        content,
      });

      if (error) {
        setErrorMsg("Gagal mengirim pesan. Coba lagi.");
      } else {
        setDraft("");
        await fetchMessages(channel);
      }
    } catch {
      setErrorMsg("Koneksi terputus saat mengirim pesan.");
    } finally {
      setSending(false);
    }
  }

  async function toggleGuruFlag(
    msg: ChatMessageRow,
    field: "is_verified" | "is_pinned"
  ) {
    if (profile?.role !== "guru") return;
    const supabase = createClient();
    const { error } = await supabase
      .from("chat_messages")
      .update({ [field]: !msg[field] })
      .eq("id", msg.id);

    if (!error) {
      fetchMessages(channel);
    }
  }

  function insertSymbol(sym: string) {
    setDraft((prev) => `${prev}${sym}`);
    inputRef.current?.focus();
  }

  const activeChannelMeta =
    CHANNELS.find((c) => c.key === channel) ?? CHANNELS[0];
  const pinnedMessages = messages.filter((m) => m.is_pinned);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="border-b border-[var(--border)] pb-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--cobalt)]">
          Modul 05 · Kolaborasi Kelas Real-Time (Supabase Realtime)
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-[var(--ink)]">
          Ruang Diskusi Kelas PLSV
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-[var(--ink-muted)]">
          Diskusikan langkah penyelesaian persamaan bersama teman dan guru secara
          langsung. Pesan dari Guru ditandai lencana{" "}
          <span className="rounded bg-[var(--emerald)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
            GURU
          </span>{" "}
          dan guru dapat memverifikasi jawaban konsep yang tepat.
        </p>
      </div>

      {loading ? (
        <div className="mt-6 h-80 animate-pulse rounded-xl bg-[var(--surface-muted)]" />
      ) : !user || !profile ? (
        <div className="mx-auto mt-8 max-w-xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cobalt-soft)] text-[var(--cobalt)]">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="mt-3 font-display text-xl font-bold text-[var(--ink)]">
            Masuk untuk Bergabung ke Ruang Diskusi
          </h2>
          <p className="mt-1.5 text-sm text-[var(--ink-muted)]">
            Agar setiap pesan menampilkan identitas nama dan peran (GURU / SISWA)
            secara jelas, silakan masuk dengan akun terdaftar atau gunakan Demo
            1-Klik.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              onClick={() => loginDemo("siswa")}
              className="rounded-lg bg-[var(--cobalt)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--cobalt-hover)]"
            >
              Masuk Demo Siswa (1-Klik)
            </button>
            <button
              type="button"
              onClick={() => loginDemo("guru")}
              className="rounded-lg bg-[var(--emerald)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
            >
              Masuk Demo Guru (1-Klik)
            </button>
            <Link
              href="/masuk"
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)]"
            >
              Halaman Masuk
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xs lg:grid-cols-12">
          {/* Left Channel Sidebar */}
          <aside className="border-b border-[var(--border)] bg-[var(--surface-muted)] p-3 lg:col-span-3 lg:border-r lg:border-b-0">
            <div className="px-2 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--ink-subtle)]">
              Kanal Topik Kelas
            </div>
            <div className="mt-1 flex gap-1.5 overflow-x-auto lg:flex-col">
              {CHANNELS.map((ch) => {
                const active = ch.key === channel;
                return (
                  <button
                    key={ch.key}
                    type="button"
                    onClick={() => setChannel(ch.key)}
                    className={`flex shrink-0 items-start gap-2 rounded-lg px-3 py-2.5 text-left transition ${
                      active
                        ? "bg-[var(--surface)] text-[var(--cobalt)] shadow-2xs ring-1 ring-[var(--border)]"
                        : "text-[var(--ink-muted)] hover:bg-[var(--surface)]/60 hover:text-[var(--ink)]"
                    }`}
                  >
                    <Hash className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">{ch.label}</div>
                      <div className="hidden text-[11px] leading-snug opacity-80 lg:block">
                        {ch.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-[11px] text-[var(--ink-muted)] lg:block">
              <div className="flex items-center gap-1.5 font-semibold text-[var(--ink)]">
                <UserCheck className="h-3.5 w-3.5 text-[var(--emerald)]" />
                Aktif sebagai:
              </div>
              <div className="mt-1 font-semibold text-[var(--ink)]">
                {profile.full_name}
              </div>
              <div className="mt-0.5 font-mono text-[10px] uppercase text-[var(--cobalt)]">
                Peran: {profile.role} · {profile.class_name}
              </div>
            </div>
          </aside>

          {/* Main Chat Workspace */}
          <div className="flex h-[600px] flex-col lg:col-span-9">
            {/* Channel Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4.5 w-4.5 text-[var(--cobalt)]" />
                <div>
                  <h2 className="font-display text-sm font-bold text-[var(--ink)]">
                    #{activeChannelMeta.key} — {activeChannelMeta.label}
                  </h2>
                  <p className="text-[11px] text-[var(--ink-muted)]">
                    {activeChannelMeta.desc}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--emerald-soft)] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[var(--emerald)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--emerald)]" />
                LIVE
              </span>
            </div>

            {/* Pinned Banner */}
            {pinnedMessages.length > 0 && (
              <div className="border-b border-[var(--ochre-border)] bg-[var(--ochre-bg)] px-4 py-2 text-xs text-[var(--ochre-ink)]">
                <div className="flex items-start gap-2">
                  <Pin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <div>
                    <span className="font-bold">Disematkan Guru:</span>{" "}
                    {pinnedMessages[pinnedMessages.length - 1].content}
                  </div>
                </div>
              </div>
            )}

            {/* Messages Canvas */}
            <div className="chat-canvas-bg flex-1 space-y-3 overflow-y-auto p-4">
              {loadingMsgs && messages.length === 0 ? (
                <div className="py-12 text-center text-xs text-[var(--ink-muted)]">
                  Memuat percakapan kelas...
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center text-xs text-[var(--ink-muted)]">
                  Belum ada pesan di kanal ini. Mulailah diskusi dengan
                  mengajukan pertanyaan atau berbagi strategi PLSV!
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.user_id === user.id;
                  const senderRole = msg.profiles?.role ?? "siswa";
                  const senderName = msg.profiles?.full_name ?? "Pengguna";
                  const isGuruMsg = senderRole === "guru";

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl border px-3.5 py-2.5 shadow-2xs sm:max-w-[72%] ${
                          isMine
                            ? "border-[var(--cobalt)]/30 bg-[var(--cobalt-soft)]"
                            : isGuruMsg
                            ? "border-[var(--emerald)]/40 border-l-4 border-l-[var(--emerald)] bg-white"
                            : "border-[var(--border)] bg-white"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                              isGuruMsg
                                ? "bg-[var(--emerald)] text-white"
                                : "bg-[var(--cobalt)] text-white"
                            }`}
                          >
                            {senderRole}
                          </span>
                          <span className="text-xs font-bold text-[var(--ink)]">
                            {senderName}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--ink-subtle)]">
                            {formatTime(msg.created_at)}
                          </span>
                        </div>

                        <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink)]">
                          {msg.content}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {msg.is_verified && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--emerald-soft)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--emerald)]">
                                <BadgeCheck className="h-3 w-3" />
                                Diverifikasi Guru
                              </span>
                            )}
                            {msg.is_pinned && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--ochre-bg)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--ochre-ink)]">
                                <Pin className="h-3 w-3" />
                                Disematkan
                              </span>
                            )}
                          </div>

                          {/* Guru-only moderation tools (also enforced by RLS) */}
                          {profile.role === "guru" && (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleGuruFlag(msg, "is_verified")
                                }
                                className="rounded border border-[var(--border)] bg-white px-2 py-0.5 text-[10px] font-semibold text-[var(--emerald)] hover:bg-[var(--emerald-soft)]"
                              >
                                {msg.is_verified
                                  ? "Batal Verifikasi"
                                  : "✓ Verifikasi"}
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleGuruFlag(msg, "is_pinned")}
                                className="rounded border border-[var(--border)] bg-white px-2 py-0.5 text-[10px] font-semibold text-[var(--ochre-ink)] hover:bg-[var(--ochre-bg)]"
                              >
                                {msg.is_pinned ? "Lepas Pin" : "Sematkan"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Math Symbol Bar + Message Composer */}
            <div className="border-t border-[var(--border)] bg-[var(--surface)] p-3">
              <div className="mb-2 flex flex-wrap items-center gap-1">
                <span className="mr-1 font-mono text-[10px] font-semibold uppercase text-[var(--ink-subtle)]">
                  Simbol:
                </span>
                {MATH_SYMBOLS.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => insertSymbol(sym)}
                    className="rounded border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-0.5 font-mono text-xs font-bold text-[var(--ink)] transition hover:border-[var(--cobalt)] hover:bg-[var(--cobalt-soft)]"
                  >
                    {sym}
                  </button>
                ))}
              </div>

              {errorMsg && (
                <p className="mb-2 text-xs font-medium text-[var(--vermilion)]">
                  {errorMsg}
                </p>
              )}

              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={1000}
                  placeholder={`Tulis pertanyaan atau penjelasan di #${channel}...`}
                  className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--cobalt)] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--cobalt)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--cobalt-hover)] disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  Kirim
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
