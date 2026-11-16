"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShoppingCart,
  Sprout,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Shield,
  Store,
  Search,
  LayoutDashboard,
} from "lucide-react";
import { useCart } from "./CartProvider";
import { logoutAction } from "@/lib/auth-actions";
import type { SessionUser } from "@/lib/auth-session";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Katalog" },
  { href: "/bantuan", label: "Bantuan" },
];

export default function Navbar({
  storeName,
  user,
}: {
  storeName: string;
  user?: SessionUser | null;
  wa?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { count } = useCart();

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produk?q=${encodeURIComponent(searchQuery.trim())}`);
      setOpen(false);
    }
  };

  const getPortalLink = () => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin";
    if (user.role === "SELLER") return "/seller";
    return "/buyer";
  };

  const getRoleBadge = () => {
    if (!user) return null;
    if (user.role === "ADMIN") {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-800">
          <Shield size={12} /> Admin
        </span>
      );
    }
    if (user.role === "SELLER") {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
          <Store size={12} /> Seller
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800">
        <User size={12} /> Buyer
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-500/15 bg-white/95 backdrop-blur-md transition-all shadow-sm">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold text-green-800 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-green-800 to-green-600 text-white shadow-sm">
            <Sprout size={20} />
          </span>
          <span className="tracking-tight">{storeName}</span>
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex relative flex-1 max-w-sm lg:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari benih, pupuk, herbisida, obat hama..."
            className="w-full h-10 pl-9 pr-4 rounded-full border border-ink-500/25 bg-cream-50/70 text-xs focus:bg-white focus:border-green-700 focus:ring-1 focus:ring-green-700 transition"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-ink-500" />
        </form>

        {/* Navigasi Link Desktop */}
        <nav aria-label="Utama" className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-sm font-medium text-ink-700 hover:text-green-800 hover:bg-cream-100 rounded-lg transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Bagian Kanan: User Auth & Keranjang */}
        <div className="flex items-center gap-3">
          {/* User Auth Controls (Desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={getPortalLink()}
                  className="flex items-center gap-2 rounded-lg border border-ink-500/15 bg-cream-50 px-3 py-1.5 text-xs font-medium text-ink-800 hover:bg-cream-100 transition shadow-xs"
                >
                  <LayoutDashboard size={14} className="text-green-800" />
                  <span className="font-semibold">{user.name.split(" ")[0]}</span>
                  {getRoleBadge()}
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-600 hover:text-danger hover:bg-danger/10 transition"
                    title="Keluar dari akun"
                  >
                    <LogOut size={16} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 rounded-lg border border-ink-500/20 px-3 py-1.5 text-xs font-semibold text-ink-800 hover:bg-cream-100 transition"
                >
                  <LogIn size={14} /> Masuk
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 rounded-lg bg-green-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-green-800 shadow-xs transition"
                >
                  <UserPlus size={14} /> Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Keranjang Belanja */}
          <Link
            href="/keranjang"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-ink-500/20 bg-cream-50 text-ink-800 hover:bg-cream-100 transition shadow-xs"
            aria-label={`Keranjang belanja, ${count} item`}
          >
            <ShoppingCart size={19} />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[11px] font-bold text-white shadow-xs">
                {count}
              </span>
            )}
          </Link>

          {/* Hamburger Mobile Toggle */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-cream-100 md:hidden"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu Seluler Drawer */}
      {open && (
        <div className="border-t border-ink-500/15 bg-white py-4 px-4 md:hidden space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2">
          {/* Form Pencarian Mobile */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk pertanian..."
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-ink-500/25 bg-cream-50 text-sm focus:bg-white focus:border-green-700"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-ink-500" />
          </form>

          {/* Navigasi Links Mobile */}
          <nav aria-label="Menu seluler" className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-ink-800 hover:bg-cream-100 transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* User Auth Mobile */}
          <div className="border-t border-ink-500/15 pt-3">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={getPortalLink()}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg bg-cream-100 p-3 text-sm font-semibold text-ink-900"
                >
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{user.name}</span>
                  </div>
                  {getRoleBadge()}
                </Link>
                <form action={logoutAction} className="w-full">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-lg p-2.5 text-sm font-semibold text-danger hover:bg-danger/10 transition"
                  >
                    <LogOut size={16} /> Keluar dari Akun
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-ink-500/25 py-2.5 text-sm font-semibold text-ink-800 hover:bg-cream-100"
                >
                  <LogIn size={16} /> Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-green-700 py-2.5 text-sm font-semibold text-white hover:bg-green-800 shadow-xs"
                >
                  <UserPlus size={16} /> Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
