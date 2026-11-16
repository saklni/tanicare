"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Sprout, ArrowLeft, Mail, Lock, AlertCircle } from "lucide-react";
import { loginAction } from "@/lib/auth-actions";

export default function Page() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [show, setShow] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 p-4">
      <div className="w-full max-w-sm space-y-4">
        <form action={action} className="card bg-white space-y-4 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-ink-500/10 pb-3">
            <h1 className="flex items-center gap-2 text-xl text-green-800 font-bold">
              <Sprout aria-hidden /> Login Administrator
            </h1>
          </div>

          <div>
            <label className="label" htmlFor="email">
              Email Administrator
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@email.com"
                autoComplete="username"
                className="input pl-10"
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-ink-500 pointer-events-none" />
            </div>
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
                placeholder="Masukkan password"
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

          <button className="btn-primary w-full !py-2.5 shadow-sm" disabled={pending}>
            {pending ? "Memverifikasi…" : "Masuk"}
          </button>

          <div className="border-t border-ink-500/10 pt-3 text-center">
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-ink-600 hover:text-green-800">
              <ArrowLeft size={14} /> Kembali ke Beranda
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
