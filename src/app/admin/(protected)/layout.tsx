import Link from "next/link";
import { LayoutDashboard, Package, Settings, Users, LogOut } from "lucide-react";
import { requireAdmin } from "../auth";
import { logout } from "../actions";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  const nav = [
    ["/admin", "Dashboard", LayoutDashboard],
    ["/admin/produk", "Kelola Produk", Package],
    ["/admin/users", "Kelola Pengguna", Users],
    ["/admin/pengaturan", "Pengaturan Toko", Settings],
  ] as const;
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-ink-500/15 bg-green-900 text-white md:w-60 md:border-b-0">
        <p className="px-4 pt-4 font-display text-xl font-bold">TaniCare Admin</p>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto p-2 md:flex-col">
          {nav.map(([h, l, I]) => <Link key={h} href={h} className="btn !justify-start whitespace-nowrap text-white hover:bg-white/10"><I aria-hidden size={18} />{l}</Link>)}
          <form action={logout}><button className="btn w-full !justify-start whitespace-nowrap text-white hover:bg-white/10"><LogOut aria-hidden size={18} />Keluar</button></form>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="border-b border-ink-500/15 bg-white px-4 py-3 text-sm text-ink-700 md:px-8">Masuk sebagai <strong>{user.email}</strong></header>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
