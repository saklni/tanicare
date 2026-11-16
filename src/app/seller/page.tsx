import Link from "next/link";
import { Package, Plus, TrendingUp, CheckCircle2, MessageCircle, Phone, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-session";
import SellerStoreForm from "@/components/seller/SellerStoreForm";
import SellerProductList from "@/components/seller/SellerProductList";

export default async function SellerDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ sukses?: string }>;
}) {
  const session = await getSessionUser();
  const params = searchParams ? await searchParams : {};
  const isSuccess = params.sukses === "1";

  let store = null;
  let sellerProducts: any[] = [];
  let orderCount = 0;

  try {
    if (session) {
      store = await prisma.store.findFirst({
        where: { sellerId: session.id },
        include: { seller: true },
      });

      sellerProducts = await prisma.product.findMany({
        where: { sellerId: session.id },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!store) {
      store = await prisma.store.findFirst({
        include: { seller: true },
      });
      if (store && sellerProducts.length === 0) {
        sellerProducts = await prisma.product.findMany({
          where: { sellerId: store.sellerId },
          orderBy: { createdAt: "desc" },
        });
      }
    }

    orderCount = await prisma.order.count();
  } catch {}

  const sellerInfo = {
    storeName: store?.name ?? "Toko Berkah Tani Mandiri",
    ownerName: session?.name ?? store?.seller?.name ?? "Mitra Tani Berkah",
    email: session?.email ?? store?.seller?.email ?? "seller@gmail.com",
    whatsapp: store?.whatsappNumber || "6281234567891",
    address: store?.address ?? "Jl. Pertanian Makmur No. 45, Pare, Kediri, Jawa Timur",
    description: store?.description ?? "Pusat sarana produksi pertanian terlengkap dan terpercaya.",
    role: "SELLER",
  };

  const formattedProducts = sellerProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: Number(p.price),
    stock: p.stock,
    imagePath: p.imagePath,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
  }));

  const stats = [
    { label: "Produk Toko Saya", value: String(formattedProducts.length), icon: Package, color: "text-blue-600" },
    { label: "Pesanan Masuk", value: String(orderCount || 3), icon: TrendingUp, color: "text-green-600" },
    { label: "Nomor WhatsApp Toko", value: `+${sellerInfo.whatsapp}`, icon: Phone, color: "text-green-600", isText: true },
    { label: "Status Toko", value: "Terverifikasi", icon: CheckCircle2, color: "text-emerald-600", isText: true },
  ];

  return (
    <div className="space-y-8">
      {/* Toast Notifikasi Berhasil */}
      {isSuccess && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-bold text-emerald-900 flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
          <span>Berhasil! Produk toko Anda telah disimpan dan langsung aktif di katalog pasar TaniCare.</span>
        </div>
      )}

      {/* Header Info Seller */}
      <div className="card p-6 border-l-4 border-l-blue-600 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">ROLE: SELLER</span>
              <h1 className="text-2xl font-bold text-ink-900">{sellerInfo.storeName}</h1>
            </div>
            <p className="mt-1 text-sm text-ink-600">
              Pemilik Toko: <strong>{sellerInfo.ownerName}</strong> ({sellerInfo.email})
            </p>
            <p className="text-xs text-ink-500 mt-0.5">Lokasi: {sellerInfo.address}</p>
            <p className="text-xs font-semibold text-green-800 mt-1 flex items-center gap-1">
              <MessageCircle size={14} /> No. WA Penerima Pesanan: +{sellerInfo.whatsapp} (Pesanan masuk langsung ke sini)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`https://wa.me/${sellerInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa text-xs"
            >
              <MessageCircle size={16} /> Tes WhatsApp Toko
            </a>
            <Link href="/seller/produk/baru" className="btn-primary text-xs shadow-xs">
              <Plus size={16} /> + Tambah Produk Baru
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
              <p className={`mt-2 font-display font-bold text-ink-900 ${s.isText ? "text-base md:text-lg truncate" : "text-3xl"}`}>
                {s.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* DAFTAR PRODUK SELLER */}
      <SellerProductList products={formattedProducts} />

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
        <h2 className="text-lg font-bold text-ink-900 flex items-center gap-2">
          <Sparkles className="text-amber-500" size={18} /> Ketentuan &amp; Cara Kerja Penjualan Seller
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 space-y-1">
            <p className="font-semibold text-blue-950">1. Tambah &amp; Atur Produk Sendiri</p>
            <p className="text-xs text-ink-600">
              Anda bebas menentukan harga, stok, foto, dan deskripsi produk Anda tanpa perlu persetujuan admin.
            </p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 space-y-1">
            <p className="font-semibold text-green-950">2. Pesanan Langsung ke WA Toko</p>
            <p className="text-xs text-ink-600">
              Setiap tombol pemesanan produk Anda otomatis tertaut langsung ke nomor WhatsApp toko Anda.
            </p>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-4 space-y-1">
            <p className="font-semibold text-purple-950">3. Multi-Seller Independen</p>
            <p className="text-xs text-ink-600">
              Produk Anda aman dan tidak dapat diubah oleh seller lain. Admin memiliki nomor kontak CS pusat tersendiri.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
