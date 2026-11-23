import { NextResponse } from "next/server";
import {
  createAdminSupabaseClient,
  createServerSupabaseClient,
} from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = body.role === "guru" ? "guru" : "siswa";

    const email =
      role === "guru"
        ? process.env.DEMO_GURU_EMAIL || "guru.demo@ruassetara.id"
        : process.env.DEMO_SISWA_EMAIL || "siswa.demo@ruassetara.id";

    const password =
      role === "guru"
        ? process.env.DEMO_GURU_PASSWORD || "DemoGuru#RuasSetara2026"
        : process.env.DEMO_SISWA_PASSWORD || "DemoSiswa#RuasSetara2026";

    const serverSupabase = await createServerSupabaseClient();
    let signInResult = await serverSupabase.auth.signInWithPassword({
      email,
      password,
    });

    // Self-heal if demo user wasn't seeded yet
    if (signInResult.error) {
      const admin = createAdminSupabaseClient();
      const fullName =
        role === "guru"
          ? "Ibu Sari Wulandari, M.Pd."
          : "Nadia Putri (Demo)";

      const { data: created } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

      if (created?.user) {
        await admin.from("profiles").upsert({
          id: created.user.id,
          full_name: fullName,
          role,
          class_name: role === "guru" ? "Pengampu Kelas VII" : "VII-A",
          is_demo: true,
        });
      }

      signInResult = await serverSupabase.auth.signInWithPassword({
        email,
        password,
      });
    }

    if (signInResult.error || !signInResult.data.user) {
      return NextResponse.json(
        { error: "Gagal masuk menggunakan akun demo. Coba lagi." },
        { status: 500 }
      );
    }

    const { data: profile } = await serverSupabase
      .from("profiles")
      .select("*")
      .eq("id", signInResult.data.user.id)
      .single();

    return NextResponse.json({
      ok: true,
      role,
      profile,
    });
  } catch (err) {
    console.error("Demo login error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat masuk ke mode demo." },
      { status: 500 }
    );
  }
}
