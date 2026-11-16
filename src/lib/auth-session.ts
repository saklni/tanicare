import { cookies } from "next/headers";
import { prisma } from "./prisma";
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

  // 1. Akun Cepat Bawaan (Admin, Seller, Buyer)
  if (password === "123") {
    if (email === "admin@gmail.com") {
      return { id: "a0000000-0000-0000-0000-000000000001", email, name: "Admin TaniCare", role: "ADMIN", phone: "6281234567890" };
    }
    if (email === "seller@gmail.com") {
      return { id: "b0000000-0000-0000-0000-000000000002", email, name: "Mitra Tani Berkah", role: "SELLER", phone: "6281234567891" };
    }
    if (email === "seller2@gmail.com") {
      return { id: "b0000000-0000-0000-0000-000000000004", email, name: "Mitra Agro Jaya Makmur", role: "SELLER", phone: "6281987654321" };
    }
    if (email === "buyer@gmail.com") {
      return { id: "c0000000-0000-0000-0000-000000000003", email, name: "Budi Santoso (Petani)", role: "BUYER", phone: "6281234567892" };
    }
  }

  // 2. Cek di Database Prisma
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

  return null;
}

