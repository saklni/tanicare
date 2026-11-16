"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authenticate, setSessionUser, clearSessionUser } from "./auth-session";
import { prisma } from "./prisma";
import { publicClient } from "./supabase/public";
import type { UserRole } from "./types";

export type AuthState = { error?: string; success?: boolean } | undefined;

export async function loginAction(_: AuthState, fd: FormData): Promise<AuthState> {
  const email = String(fd.get("email") ?? "").trim();
  const password = String(fd.get("password") ?? "").trim();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const user = await authenticate(email, password);
  if (!user) {
    return { error: "Email atau password salah." };
  }

  await setSessionUser(user);
  revalidatePath("/", "layout");

  // Arahkan ke portal sesuai role masing-masing
  if (user.role === "ADMIN") {
    redirect("/admin");
  } else if (user.role === "SELLER") {
    redirect("/seller");
  } else {
    redirect("/buyer");
  }
}

export async function registerAction(_: AuthState, fd: FormData): Promise<AuthState> {
  const name = String(fd.get("name") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "").trim();
  const confirmPassword = String(fd.get("confirm_password") ?? "").trim();
  const phone = String(fd.get("phone") ?? "").trim();
  const roleInput = String(fd.get("role") ?? "BUYER").toUpperCase();
  const role: UserRole = roleInput === "SELLER" ? "SELLER" : "BUYER";

  if (!name || !email || !password || !confirmPassword) {
    return { error: "Semua kolom bertanda bintang wajib diisi." };
  }

  if (password.length < 3) {
    return { error: "Password minimal harus 3 karakter." };
  }

  if (password !== confirmPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password yang Anda masukkan." };
  }

  try {
    let newUser: any = null;

    try {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return { error: "Email sudah terdaftar. Silakan gunakan email lain atau langsung masuk." };
      }

      newUser = await prisma.user.create({
        data: {
          name,
          email,
          password,
          phone: phone || null,
          role: role as any,
          store:
            role === "SELLER"
              ? {
                  create: {
                    name: `Toko ${name}`,
                    description: "Mitra toko pertanian TaniCare.",
                    whatsappNumber: phone || "",
                  },
                }
              : undefined,
        },
      });
    } catch {
      // Supabase fallback jika Prisma offline di serverless Vercel
      const { data: supaExisting } = await publicClient()
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (supaExisting) {
        return { error: "Email sudah terdaftar. Silakan gunakan email lain atau langsung masuk." };
      }

      const { data: supaCreated, error: supaErr } = await publicClient()
        .from("users")
        .insert({
          name,
          email,
          password,
          phone: phone || null,
          role: role,
        })
        .select()
        .single();

      if (supaErr || !supaCreated) {
        return { error: "Gagal mendaftar ke sistem database." };
      }

      newUser = supaCreated;

      if (role === "SELLER") {
        await publicClient().from("stores").insert({
          seller_id: newUser.id,
          name: `Toko ${name}`,
          description: "Mitra toko pertanian TaniCare.",
          whatsapp_number: phone || "",
        });
      }
    }

    const sessionUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: (newUser.role || role) as UserRole,
      phone: newUser.phone,
    };

    await setSessionUser(sessionUser);
    revalidatePath("/", "layout");

    if (role === "SELLER") {
      redirect("/seller");
    } else {
      redirect("/buyer");
    }
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    return { error: "Gagal mendaftar. Silakan periksa koneksi lalu coba lagi." };
  }
}

export async function logoutAction() {
  await clearSessionUser();
  revalidatePath("/", "layout");
  redirect("/");
}
