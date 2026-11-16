"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Sprout, Store, User } from "lucide-react";
import { registerAction } from "@/lib/auth-actions";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);
  const [show, setShow] = useState(false);
  const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-2xl font-bold text-green-800">
            <Sprout size={28} />
            TaniCare
          </Link>
          <p className="text-sm text-ink-600">Daftar akun baru sebagai Petani (Buyer) atau Mitra Toko (Seller).</p>
        </div>

        {/* Card Form */}
        <div className="card bg-white p-6 md:p-8 shadow-sm">
          <h1 className="text-xl font-bold text-ink-900 mb-5">Daftar Akun Baru</h1>

          <form action={action} className="space-y-4">
            {/* Pilihan Peran */}
            <div>
              <label className="label">Daftar Sebagai:</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 text-sm font-semibold transition ${
                    role === "BUYER"
                      ? "border-green-800 bg-green-50 text-green-800 ring-2 ring-green-800/20"
                      : "border-ink-500/20 bg-white text-ink-700 hover:bg-cream-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="BUYER"
                    checked={role === "BUYER"}
                    onChange={() => setRole("BUYER")}
                    className="sr-only"
                  />
                  <User size={16} />
                  <span>Buyer (Petani)</span>
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 text-sm font-semibold transition ${
                    role === "SELLER"
                      ? "border-blue-800 bg-blue-50 text-blue-800 ring-2 ring-blue-800/20"
                      : "border-ink-500/20 bg-white text-ink-700 hover:bg-cream-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="SELLER"
                    checked={role === "SELLER"}
                    onChange={() => setRole("SELLER")}
                    className="sr-only"
                  />
                  <Store size={16} />
                  <span>Seller (Toko)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="label" htmlFor="name">
                Nama Lengkap
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder={role === "BUYER" ? "Contoh: Budi Santoso" : "Contoh: Mitra Tani Berkah"}
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="email">
                Alamat Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="nama@gmail.com"
                autoComplete="email"
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="phone">
                No. WhatsApp / Telepon
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Contoh: 081234567890"
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  required
                  placeholder="Minimal 3 karakter"
                  autoComplete="new-password"
                  className="input pr-12"
                />
                <button
                  type="button"
                  className="absolute right-1 top-0.5 btn-ghost !px-3"
                  aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {state?.error && (
              <div className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger" role="alert">
                {state.error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={pending}>
              {pending ? "Mendaftarkan…" : "Daftar Akun"}
            </button>
          </form>

          {/* Navigasi Masuk */}
          <div className="mt-6 text-center text-sm text-ink-600 border-t border-ink-500/15 pt-5">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="font-semibold text-green-800 hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

