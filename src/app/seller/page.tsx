import Link from "next/link";
import { Package, Plus, CheckCircle2, MessageCircle, Phone, CheckCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { publicClient } from "@/lib/supabase/public";
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

  // 1. Coba ambil dari Prisma
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
  } catch {}

  // 2. Fallback Supabase REST API (Aktif di Vercel)
  if (sellerProducts.length === 0) {
    try {
      let query = publicClient()
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (session?.id) {
        query = query.eq("seller_id", session.id);
      }

      const { data: supaP } = await query;
      if (supaP && supaP.length > 0) {
        sellerProducts = supaP.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          price: Number(p.price),
          stock: p.stock,
          imagePath: p.image_path,
          isActive: p.is_active,
          isFeatured: p.is_featured,
        }));
      } else {
        const { data: allP } = await publicClient()
          .from("products")
          .select("*")
          .limit(6)
          .order("created_at", { ascending: false });

        if (allP && allP.length > 0) {
          sellerProducts = allP.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.category,
            price: Number(p.price),
            stock: p.stock,
            imagePath: p.image_path,
            isActive: p.is_active,
            isFeatured: p.is_featured,
          }));
        }
      }
    } catch {}
  }

  if (!store) {
    try {
      const { data: supaStore } = await publicClient()
        .from("stores")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (supaStore) {
        store = {
          name: supaStore.name,
          whatsappNumber: supaStore.whatsapp_number,
          address: supaStore.address,
          description: supaStore.description,
          seller: null,
        };
      }
    } catch {}
  }

  const sellerInfo = {
    storeName: store?.name ?? "Toko Berkah Tani Mandiri",
    ownerName: session?.name ?? store?.seller?.name ?? "Mitra Tani Berkah",
    email: session?.email ?? store?.seller?.email ?? "seller@gmail.com",
    whatsapp: store?.whatsappNumber || "6281234567891",
    address: store?.address ?? "Jl. Pertanian Makmur No. 45, Pare, Kediri, Jawa Timur",
    description: store?.description ?? "Pusat sarana produksi pertanian terlengkap dan terpercaya.",
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

  const activeProductsCount = formattedProducts.filter((p) => p.isActive).length;

  const stats = [
    { label: "Total Produk Toko", value: String(formattedProducts.length), icon: Package, color: "text-blue-600" },
    { label: "Produk Aktif Tayang", value: String(activeProductsCount), icon: CheckCheck, color: "text-emerald-600" },
    { label: "Nomor WhatsApp Pesanan", value: `+${sellerInfo.whatsapp}`, icon: Phone, color: "text-green-600", isText: true },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notifikasi Berhasil */}
      {isSuccess && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-bold text-emerald-900 flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
          <span>Berhasil! Produk toko Anda telah disimpan dan langsung aktif di katalog pasar TaniCare.</span>
        </div>
      )}

      {/* Header Info Seller yang Ringkas & Profesional */}
      <div className="card p-6 border-l-4 border-l-blue-600 bg-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">PORTAL SELLER</span>
              <h1 className="text-2xl font-bold text-ink-900">{sellerInfo.storeName}</h1>
            </div>
            <p className="text-sm text-ink-600">
              Pemilik: <strong>{sellerInfo.ownerName}</strong> ({sellerInfo.email}) · Lokasi: {sellerInfo.address}
            </p>
            <p className="text-xs font-semibold text-green-800 flex items-center gap-1.5 pt-0.5">
              <MessageCircle size={14} className="text-green-600" /> Pesanan pembeli otomatis masuk ke WA: +{sellerInfo.whatsapp}
            </p>
          </div>
          <div className="shrink-0">
            <Link href="/seller/produk/baru" className="btn-primary text-xs shadow-xs !py-2.5 !px-4">
              <Plus size={16} /> + Tambah Produk Baru
            </Link>
          </div>
        </div>
      </div>

      {/* Statistik Ringkas Seller (3 Kartu Fungsional) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5 bg-white shadow-xs border border-ink-500/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink-600">{s.label}</span>
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

      {/* Form Pengaturan Nomor WhatsApp & Profil Toko */}
      <SellerStoreForm
        initialStore={{
          name: sellerInfo.storeName,
          whatsappNumber: sellerInfo.whatsapp,
          address: sellerInfo.address,
          description: sellerInfo.description,
        }}
      />
    </div>
  );
}
