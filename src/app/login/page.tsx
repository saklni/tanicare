"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Sprout, ArrowRight, Shield, Store, User } from "lucide-react";
import { loginAction } from "@/lib/auth-actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fillAccount = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-2xl font-bold text-green-800">
            <Sprout size={28} />
            TaniCare
          </Link>
          <p className="text-sm text-ink-600">Masuk untuk mengakses layanan katalog dan portal pengguna.</p>
        </div>

        {/* Card Form */}
        <div className="card bg-white p-6 md:p-8 shadow-sm">
          <h1 className="text-xl font-bold text-ink-900 mb-5">Masuk ke Akun</h1>

          <form action={action} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Alamat Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gmail.com"
                autoComplete="username"
                className="input"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
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
              {pending ? "Memproses…" : "Masuk"}
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="mt-6 border-t border-ink-500/15 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500 text-center mb-3">
              ⚡ Akun Contoh Cepat (Klik untuk Isi):
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillAccount("buyer@gmail.com", "123")}
                className="w-full flex items-center justify-between rounded-lg border border-green-200 bg-green-50/50 p-2.5 text-xs text-left hover:bg-green-100/60 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200 text-green-800">
                    <User size={14} />
                  </span>
                  <div>
                    <strong className="text-green-900">Buyer (Petani)</strong>
                    <p className="text-ink-500 text-[11px]">buyer@gmail.com • pw: 123</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-green-800" />
              </button>

              <button
                type="button"
                onClick={() => fillAccount("seller@gmail.com", "123")}
                className="w-full flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/50 p-2.5 text-xs text-left hover:bg-blue-100/60 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 text-blue-800">
                    <Store size={14} />
                  </span>
                  <div>
                    <strong className="text-blue-900">Seller 1: Toko Berkah</strong>
                    <p className="text-ink-500 text-[11px]">seller@gmail.com • WA: +6281234567891</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-blue-800" />
              </button>

              <button
                type="button"
                onClick={() => fillAccount("seller2@gmail.com", "123")}
                className="w-full flex items-center justify-between rounded-lg border border-teal-200 bg-teal-50/50 p-2.5 text-xs text-left hover:bg-teal-100/60 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-200 text-teal-800">
                    <Store size={14} />
                  </span>
                  <div>
                    <strong className="text-teal-900">Seller 2: Toko Agro Jaya</strong>
                    <p className="text-ink-500 text-[11px]">seller2@gmail.com • WA: +6281987654321</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-teal-800" />
              </button>

              <button
                type="button"
                onClick={() => fillAccount("admin@gmail.com", "123")}
                className="w-full flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50/50 p-2.5 text-xs text-left hover:bg-purple-100/60 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-200 text-purple-800">
                    <Shield size={14} />
                  </span>
                  <div>
                    <strong className="text-purple-900">Admin (Kelola Sistem)</strong>
                    <p className="text-ink-500 text-[11px]">admin@gmail.com • pw: 123</p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-purple-800" />
              </button>
            </div>
          </div>

          {/* Navigasi Daftar */}
          <div className="mt-6 text-center text-sm text-ink-600">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-green-800 hover:underline">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

