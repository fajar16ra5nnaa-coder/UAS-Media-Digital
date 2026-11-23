import { NextResponse } from "next/server";
import {
  createAdminSupabaseClient,
  createServerSupabaseClient,
} from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const fullName = String(body.full_name ?? "").trim();
    const role = body.role === "guru" ? "guru" : "siswa";
    const className = String(body.class_name ?? "").trim().slice(0, 60);
    const teacherCode = String(body.teacher_code ?? "").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Masukkan alamat email yang valid." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi minimal terdiri dari 6 karakter." },
        { status: 400 }
      );
    }

    if (fullName.length < 2) {
      return NextResponse.json(
        { error: "Nama lengkap minimal terdiri dari 2 karakter." },
        { status: 400 }
      );
    }

    // Server-side validation of teacher registration code (Review Focus #2)
    if (role === "guru") {
      const expectedCode =
        process.env.TEACHER_REGISTRATION_CODE || "GURU-TDPM2026";
      if (teacherCode !== expectedCode) {
        return NextResponse.json(
          {
            error:
              "Kode akses guru tidak valid. Periksa kembali kode dari pengampu atau daftar sebagai Siswa.",
          },
          { status: 403 }
        );
      }
    }

    const admin = createAdminSupabaseClient();
    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

    if (createError || !created.user) {
      const msg = createError?.message ?? "Gagal membuat akun.";
      const friendly = msg.toLowerCase().includes("already")
        ? "Email ini sudah terdaftar. Silakan masuk menggunakan akun tersebut."
        : msg;
      return NextResponse.json({ error: friendly }, { status: 400 });
    }

    const { error: profileError } = await admin.from("profiles").insert({
      id: created.user.id,
      full_name: fullName,
      role,
      class_name: className || (role === "guru" ? "Guru Matematika" : "VII-A"),
      is_demo: false,
    });

    if (profileError) {
      await admin.auth.admin.deleteUser(created.user.id);
      return NextResponse.json(
        { error: "Gagal menyimpan profil pengguna." },
        { status: 500 }
      );
    }

    // Sign the newly created user in so session cookies are immediately established
    const serverSupabase = await createServerSupabaseClient();
    const { error: signInError } =
      await serverSupabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      return NextResponse.json(
        {
          ok: true,
          message: "Akun berhasil dibuat. Silakan masuk melalui halaman Masuk.",
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: created.user.id,
          full_name: fullName,
          role,
          class_name: className,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mendaftarkan akun. Coba lagi." },
      { status: 500 }
    );
  }
}
