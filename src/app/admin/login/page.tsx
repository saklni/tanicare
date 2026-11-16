"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Sprout, ArrowLeft } from "lucide-react";
import { loginAction } from "@/lib/auth-actions";

export default function Page() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [show, setShow] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 p-4">
      <div className="w-full max-w-sm space-y-4">
        <form action={action} className="card bg-white space-y-4 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-2xl text-green-800 font-bold">
              <Sprout aria-hidden /> Login Admin
            </h1>
          </div>
          <p className="text-xs text-ink-600">Gunakan akun <strong>admin@gmail.com</strong> (pw: <strong>123</strong>)</p>

          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue="admin@gmail.com"
              autoComplete="username"
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
                defaultValue="123"
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
            <p role="alert" className="text-sm font-semibold text-danger">
              {state.error}
            </p>
          )}

          <button className="btn-primary w-full" disabled={pending}>
            {pending ? "Masuk…" : "Masuk"}
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
