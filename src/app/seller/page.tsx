import Link from "next/link";
import { Package, Plus, TrendingUp, AlertTriangle, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-session";
import SellerStoreForm from "@/components/seller/SellerStoreForm";

export default async function SellerDashboardPage() {
  const session = await getSessionUser();

  let store = null;
  let productCount = 0;
  let orderCount = 0;

  try {
    if (session) {
      store = await prisma.store.findFirst({
        where: { sellerId: session.id },
      });
      productCount = await prisma.product.count({
        where: { sellerId: session.id },
      });
    }
    if (!store) {
      store = await prisma.store.findFirst({
        include: { seller: true },
      });
    }
    orderCount = await prisma.order.count();
  } catch {}

  const sellerInfo = {
    storeName: store?.name ?? "Toko Berkah Tani Mandiri",
    ownerName: session?.name ?? "Mitra Tani Berkah",
    email: session?.email ?? "seller@gmail.com",
    whatsapp: store?.whatsappNumber || "6281234567891",
    address: store?.address ?? "Jl. Pertanian Makmur No. 45, Pare, Kediri, Jawa Timur",
    description: store?.description ?? "Pusat sarana produksi pertanian terlengkap dan terpercaya.",
    role: "SELLER",
  };

  const stats = [
    { label: "Produk Toko Saya", value: String(productCount || 5), icon: Package, color: "text-blue-600" },
    { label: "Pesanan Masuk", value: String(orderCount || 3), icon: TrendingUp, color: "text-green-600" },
    { label: "Nomor WhatsApp Toko", value: `+${sellerInfo.whatsapp}`, icon: Phone, color: "text-green-600", isText: true },
    { label: "Status Verifikasi", value: "Aktif", icon: CheckCircle2, color: "text-emerald-600", isText: true },
  ];

  return (
    <div className="space-y-8">
      {/* Header Info Seller */}
      <div className="card p-6 border-l-4 border-l-blue-600 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">ROLE: SELLER</span>
              <h1 className="text-2xl font-bold text-ink-900">{sellerInfo.storeName}</h1>
            </div>
            <p className="mt-1 text-sm text-ink-600">
              Pemilik: <strong>{sellerInfo.ownerName}</strong> ({sellerInfo.email})
            </p>
            <p className="text-xs text-ink-500 mt-0.5">Lokasi: {sellerInfo.address}</p>
            <p className="text-xs font-semibold text-green-800 mt-1 flex items-center gap-1">
              <MessageCircle size={14} /> No. WA Penerima Pesanan: +{sellerInfo.whatsapp} (Khusus Toko Ini)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${sellerInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa text-xs"
            >
              <MessageCircle size={16} /> Tes WhatsApp Toko
            </a>
            <Link href="/admin/produk/baru" className="btn-primary text-xs">
              <Plus size={16} /> Tambah Produk
            </Link>
          </div>
        </div>
      </div>

      {/* Statistik Seller */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink-600">{s.label}</span>
                <Icon className={s.color} size={18} />
              </div>
              <p className={`mt-2 font-display font-bold text-ink-900 ${s.isText ? "text-lg truncate" : "text-3xl"}`}>
                {s.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Form Pengaturan Nomor WhatsApp Toko Khusus Seller Ini */}
      <SellerStoreForm
        initialStore={{
          name: sellerInfo.storeName,
          whatsappNumber: sellerInfo.whatsapp,
          address: sellerInfo.address,
          description: sellerInfo.description,
        }}
      />

      {/* Alur Multi-Seller */}
      <div className="card p-6 bg-white space-y-4 border border-ink-500/10">
        <h2 className="text-lg font-bold text-ink-900">Ketentuan Nomor WhatsApp Multi-Seller</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 space-y-1">
            <p className="font-semibold text-blue-950">1. Nomor WA Berbeda Tiap Seller</p>
            <p className="text-xs text-ink-600">
              Setiap seller memiliki nomor WhatsApp masing-masing yang independen dari admin dan seller lain.
            </p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 space-y-1">
            <p className="font-semibold text-green-950">2. Pesanan Langsung ke Seller</p>
            <p className="text-xs text-ink-600">
              Ketika buyer klik &apos;Pesan via WhatsApp&apos; pada produk Anda, chat otomatis masuk ke WhatsApp Anda.
            </p>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-4 space-y-1">
            <p className="font-semibold text-purple-950">3. Admin Memiliki WA Sendiri</p>
            <p className="text-xs text-ink-600">
              Admin platform memiliki nomor WhatsApp tersendiri khusus layanan pelanggan dan CS pusat TaniCare.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
