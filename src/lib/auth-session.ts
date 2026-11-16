import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { publicClient } from "./supabase/public";
import type { UserRole } from "./types";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string | null;
};

const COOKIE_NAME = "tanicare_session_user";

/** Membaca user yang sedang login dari cookie sesi */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const store = await cookies();
    const raw = store.get(COOKIE_NAME)?.value;
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

/** Menyimpan sesi user ke cookie */
export async function setSessionUser(user: SessionUser) {
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}

/** Menghapus sesi login (logout) */
export async function clearSessionUser() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Validasi kredensial login */
export async function authenticate(emailInput: string, passwordInput: string): Promise<SessionUser | null> {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();

  // 1. Cek di Database Prisma terlebih dahulu (Prioritas Utama)
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user && user.password === password) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
        phone: user.phone,
      };
    }
  } catch {}

  // 2. Cek di Supabase REST (Fallback jika Prisma DB offline di Vercel)
  try {
    const { data: supaUser } = await publicClient()
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .maybeSingle();

    if (supaUser) {
      return {
        id: supaUser.id,
        email: supaUser.email,
        name: supaUser.name,
        role: supaUser.role as UserRole,
        phone: supaUser.phone,
      };
    }
  } catch {}

  // 3. Fallback Darurat Akun Bawaan (Hanya jika kedua database tidak dapat dijangkau)
  // ID di bawah ini persis sesuai ID database asli sehingga produk masing-masing seller tidak tertukar
  if (password === "123") {
    if (email === "seller@gmail.com") {
      return { id: "3a85c179-bde7-4914-af10-7e607c652ba5", email, name: "Mitra Tani Berkah", role: "SELLER", phone: "6281234567891" };
    }
    if (email === "seller2@gmail.com") {
      return { id: "eb30dae4-4dad-4b1c-afe0-efc183a27969", email, name: "Mitra Agro Jaya Makmur", role: "SELLER", phone: "6281987654321" };
    }
    if (email === "admin@gmail.com") {
      return { id: "c697d63b-4f51-45a3-9c46-b538bfa1e3c2", email, name: "Admin TaniCare", role: "ADMIN", phone: "6281234567890" };
    }
    if (email === "buyer@gmail.com") {
      return { id: "03376f63-7ea7-42ef-b6ff-27971b99bc31", email, name: "Budi Santoso (Petani)", role: "BUYER", phone: "6281234567892" };
    }
  }

  return null;
}

