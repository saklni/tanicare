import Link from "next/link";
import { Store, ArrowLeft, LogOut } from "lucide-react";
import { getSessionUser } from "@/lib/auth-session";
import { logoutAction } from "@/lib/auth-actions";

export const metadata = {
  title: "Portal Seller - Mitra TaniCare",
  description: "Dashboard mitra penjual untuk mengelola produk dan inventaris toko pertanian.",
};

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-ink-500/15 bg-blue-900 text-white">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-white hover:opacity-90">
              <Store aria-hidden />
              <span>
                TaniCare <span className="rounded bg-blue-700 px-2 py-0.5 text-xs font-medium">Seller Portal</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden md:inline text-blue-200">
              Masuk sebagai: <strong>{user?.name ?? "Mitra Tani Berkah (SELLER)"}</strong>
            </span>
            <Link href="/" className="btn-secondary !bg-white/10 !text-white hover:!bg-white/20 !border-white/20 text-xs">
              <ArrowLeft size={14} /> Ke Toko
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="btn-ghost !text-white/80 hover:!text-white hover:!bg-white/10 text-xs"
                title="Keluar"
              >
                <LogOut size={16} /> Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="container-x py-8">{children}</div>
    </div>
  );
}
