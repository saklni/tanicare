import Link from "next/link";
import { ShoppingBag, ArrowLeft, User, Phone, MapPin, PackageCheck, ShoppingCart, LogOut } from "lucide-react";
import { getSessionUser } from "@/lib/auth-session";
import { logoutAction } from "@/lib/auth-actions";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/format";

export const metadata = {
  title: "Profil Buyer - TaniCare",
  description: "Area akun pembeli dan petani untuk melihat pesanan dan informasi pengiriman.",
};

export default async function BuyerPortalPage() {
  const session = await getSessionUser();

  const buyerInfo = {
    name: session?.name ?? "Budi Santoso (Petani)",
    email: session?.email ?? "buyer@gmail.com",
    phone: session?.phone ?? "6281234567892",
    role: "BUYER",
    address: "Jl. Raya Pertanian No. 15, Kediri, Jawa Timur",
  };

  type DisplayOrder = {
    id: string;
    date: string;
    items: string;
    total: string;
    status: string;
    statusClass: string;
  };

  let orders: DisplayOrder[] = [];
  try {
    const dbOrders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    if (dbOrders && dbOrders.length > 0) {
      orders = dbOrders.map((o) => ({
        id: o.orderNumber,
        date: new Date(o.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        items: o.items.map((i) => `${i.product.name} (${i.quantity}x)`).join(", ") || "Produk pertanian",
        total: formatRupiah(Number(o.totalPrice)),
        status: o.status,
        statusClass:
          o.status === "COMPLETED"
            ? "bg-green-100 text-green-800"
            : o.status === "SHIPPED"
            ? "bg-blue-100 text-blue-800"
            : "bg-amber-100 text-amber-800",
      }));
    }
  } catch {}

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-ink-500/15 bg-green-900 text-white">
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-white hover:opacity-90">
              <ShoppingBag aria-hidden />
              <span>
                TaniCare <span className="rounded bg-green-700 px-2 py-0.5 text-xs font-medium">Buyer Area</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="btn-secondary !bg-white/10 !text-white hover:!bg-white/20 !border-white/20 text-xs">
              <ArrowLeft size={14} /> Belanja Lagi
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

      <main className="container-x py-8 space-y-6">
        {/* Info Akun Buyer */}
        <div className="card p-6 border-l-4 border-l-green-600 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-800">
                <User size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">ROLE: BUYER</span>
                  <h1 className="text-2xl font-bold text-ink-900">{buyerInfo.name}</h1>
                </div>
                <div className="mt-2 space-y-1 text-sm text-ink-600">
                  <p className="flex items-center gap-2">
                    <Phone size={14} /> {buyerInfo.phone} ({buyerInfo.email})
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} /> {buyerInfo.address}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/keranjang" className="btn-primary text-xs">
                <ShoppingCart size={16} /> Buka Keranjang
              </Link>
            </div>
          </div>
        </div>

        {/* Riwayat Pesanan Buyer */}
        <div className="card overflow-hidden bg-white">
          <div className="border-b border-ink-500/10 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PackageCheck className="text-green-800" size={20} />
              <h2 className="font-semibold text-ink-900">Riwayat Pesanan Saya</h2>
            </div>
            <span className="text-xs text-ink-500">Total {orders.length} transaksi</span>
          </div>

          <div className="divide-y divide-ink-500/10">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-sm text-ink-500">Belum ada riwayat pesanan.</div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-cream-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-ink-800">{order.id}</span>
                      <span className="text-xs text-ink-500">{order.date}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${order.statusClass}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-ink-900">{order.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-500">Total Bayar</p>
                    <p className="font-display text-lg font-bold text-green-900">{order.total}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
