"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Sprout, Lock, Mail, AlertCircle } from "lucide-react";
import { loginAction } from "@/lib/auth-actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [show, setShow] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-2xl font-bold text-green-800">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-green-800 to-green-600 text-white shadow-sm">
              <Sprout size={20} />
            </span>
            TaniCare
          </Link>
          <p className="text-sm text-ink-600">Masuk ke akun Anda untuk melanjutkan belanja atau mengelola toko.</p>
        </div>

        {/* Card Form */}
        <div className="card bg-white p-6 md:p-8 shadow-sm">
          <h1 className="text-xl font-bold text-ink-900 mb-5">Masuk ke Akun</h1>

          <form action={action} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="nama@email.com"
                  autoComplete="username"
                  className="input pl-10"
                />
                <Mail size={16} className="absolute left-3.5 top-3.5 text-ink-500 pointer-events-none" />
              </div>
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
                  placeholder="Masukkan password Anda"
                  autoComplete="current-password"
                  className="input pl-10 pr-12"
                />
                <Lock size={16} className="absolute left-3.5 top-3.5 text-ink-500 pointer-events-none" />
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
              <div className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger flex items-center gap-2" role="alert">
                <AlertCircle size={16} className="shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <button type="submit" className="btn-primary w-full !py-2.5 shadow-sm" disabled={pending}>
              {pending ? "Memverifikasi Akun…" : "Masuk"}
            </button>
          </form>

          {/* Navigasi Daftar */}
          <div className="mt-6 text-center text-sm text-ink-600 border-t border-ink-500/15 pt-5">
            Belum memiliki akun?{" "}
            <Link href="/register" className="font-semibold text-green-800 hover:underline">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
