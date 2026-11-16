"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Sprout, Store, User, Lock, AlertCircle } from "lucide-react";
import { registerAction } from "@/lib/auth-actions";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerAction, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (password !== confirmPassword) {
      e.preventDefault();
      setClientError("Konfirmasi password tidak cocok dengan password yang dimasukkan.");
      return;
    }
    setClientError("");
  };

  const errorMessage = clientError || state?.error;

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
          <p className="text-sm text-ink-600">Daftar akun baru sebagai Petani (Buyer) atau Mitra Toko (Seller).</p>
        </div>

        {/* Card Form */}
        <div className="card bg-white p-6 md:p-8 shadow-sm">
          <h1 className="text-xl font-bold text-ink-900 mb-5">Daftar Akun Baru</h1>

          <form action={action} onSubmit={handleSubmit} className="space-y-4">
            {/* Pilihan Peran */}
            <div>
              <label className="label">Daftar Sebagai: *</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
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
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
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
                {role === "BUYER" ? "Nama Lengkap Petani *" : "Nama Toko / Pemilik Mitra *"}
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
                Alamat Email *
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
                No. WhatsApp / Telepon *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                className="input"
              />
              <p className="text-[11px] text-ink-500 mt-1">
                {role === "SELLER"
                  ? "Nomor WhatsApp ini akan digunakan pembeli untuk memesan produk toko Anda."
                  : "Nomor WhatsApp untuk konfirmasi pengiriman pesanan Anda."}
              </p>
            </div>

            {/* Input Password 1 */}
            <div>
              <label className="label" htmlFor="password">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (clientError) setClientError("");
                  }}
                  placeholder="Masukkan password"
                  autoComplete="new-password"
                  className="input pr-12"
                />
                <button
                  type="button"
                  className="absolute right-1 top-0.5 btn-ghost !px-3"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Input Password 2 (Konfirmasi Password) */}
            <div>
              <label className="label" htmlFor="confirm_password">
                Konfirmasi Password *
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (clientError) setClientError("");
                  }}
                  placeholder="Ulangi password di atas"
                  autoComplete="new-password"
                  className={`input pr-12 ${
                    confirmPassword && password !== confirmPassword ? "border-danger focus:ring-danger" : ""
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-1 top-0.5 btn-ghost !px-3"
                  aria-label={showConfirm ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-danger mt-1 flex items-center gap-1">
                  <AlertCircle size={13} /> Password tidak cocok
                </p>
              )}
            </div>

            {errorMessage && (
              <div className="rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger flex items-center gap-2" role="alert">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button type="submit" className="btn-primary w-full !py-2.5 shadow-sm" disabled={pending}>
              {pending ? "Mendaftarkan Akun…" : "Daftar Akun"}
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
