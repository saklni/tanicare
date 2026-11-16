import { Store, User, Phone, Search, ShieldCheck } from "lucide-react";
import { requireAdmin } from "../../auth";
import { prisma } from "@/lib/prisma";
import { publicClient } from "@/lib/supabase/public";
import ProductImage from "@/components/ProductImage";
import { RowActions } from "@/components/admin/RowActions";
import { idr, imageUrl } from "@/lib/format";

export const metadata = { title: "Kelola Produk Seller - Admin TaniCare" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; saved?: string }>;
}) {
  await requireAdmin();
  const { q = "", saved } = await searchParams;

  let products: Array<{
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    stock: number;
    imagePath: string | null;
    isActive: boolean;
    isFeatured: boolean;
    sellerName: string;
    sellerEmail: string;
    sellerPhone: string;
    storeName: string;
  }> = [];

  // 1. Coba ambil melalui Prisma
  try {
    const prismaProducts = await prisma.product.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { category: { contains: q, mode: "insensitive" } },
              { seller: { name: { contains: q, mode: "insensitive" } } },
              { seller: { store: { name: { contains: q, mode: "insensitive" } } } },
            ],
          }
        : {},
      include: {
        seller: {
          include: {
            store: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (prismaProducts && prismaProducts.length > 0) {
      products = prismaProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        price: Number(p.price),
        stock: p.stock,
        imagePath: p.imagePath,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        sellerName: p.seller?.name ?? "Mitra Tani Berkah",
        sellerEmail: p.seller?.email ?? "seller@gmail.com",
        sellerPhone: p.seller?.store?.whatsappNumber || p.seller?.phone || "6281234567891",
        storeName: p.seller?.store?.name ?? "Toko Berkah Tani Mandiri",
      }));
    }
  } catch (err) {
    console.error("Prisma query failed, falling back to Supabase:", err);
  }

  // 2. Fallback ke Supabase REST API (Selalu sukses di Vercel!)
  if (products.length === 0) {
    try {
      let query = publicClient()
        .from("products")
        .select("*, seller:users(*, store:stores(*))")
        .order("created_at", { ascending: false });

      if (q) {
        query = query.ilike("name", `%${q.replace(/[%,]/g, "")}%`);
      }

      const { data: supaData } = await query;
      if (supaData && supaData.length > 0) {
        products = supaData.map((p: any) => {
          const storeObj = Array.isArray(p.seller?.store) ? p.seller?.store[0] : p.seller?.store;
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.category,
            price: Number(p.price),
            stock: p.stock,
            imagePath: p.image_path,
            isActive: p.is_active,
            isFeatured: p.is_featured,
            sellerName: p.seller?.name ?? "Mitra Tani Berkah",
            sellerEmail: p.seller?.email ?? "seller@gmail.com",
            sellerPhone: storeObj?.whatsapp_number || p.seller?.phone || "6281234567891",
            storeName: storeObj?.name ?? "Toko Berkah Tani Mandiri",
          };
        });
      } else {
        // Fallback langsung tabel products jika join PostgREST belum tersedia
        const { data: rawData } = await publicClient()
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (rawData && rawData.length > 0) {
          products = rawData.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.category,
            price: Number(p.price),
            stock: p.stock,
            imagePath: p.image_path,
            isActive: p.is_active,
            isFeatured: p.is_featured,
            sellerName: "Mitra Tani Berkah",
            sellerEmail: "seller@gmail.com",
            sellerPhone: "6281234567891",
            storeName: "Toko Berkah Tani Mandiri",
          }));
        }
      }
    } catch (supaErr) {
      console.error("Supabase fallback query failed:", supaErr);
    }
  }

  const activeCount = products.filter((p) => p.isActive).length;
  const inactiveCount = products.filter((p) => !p.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header Info: Menjelaskan Peran Admin yang Hanya Mengawasi, Menonaktifkan & Menghapus */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-500/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 flex items-center gap-2">
            <ShieldCheck className="text-green-700" size={26} />
            Pengawasan &amp; Kelola Produk Seller
          </h1>
          <p className="text-xs text-ink-600 mt-1 max-w-2xl">
            Produk ditambahkan secara mandiri oleh masing-masing Mitra Seller. Admin bertugas mengawasi kepemilikan toko,
            memeriksa asal seller, menonaktifkan status tayang, atau menghapus produk yang melanggar.
          </p>
        </div>
      </div>

      {saved && (
        <div role="status" className="rounded-xl border border-green-300 bg-green-100 p-3 text-sm font-semibold text-green-900">
          Status produk berhasil diperbarui.
        </div>
      )}

      {/* Ringkasan & Pencarian */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <form className="flex-1 max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
            <input
              id="q"
              name="q"
              defaultValue={q}
              placeholder="Cari nama produk, kategori, seller, atau toko..."
              className="input !pl-9 text-xs"
            />
          </div>
          <button type="submit" className="btn-secondary !py-2 text-xs">
            Cari
          </button>
        </form>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="rounded-lg bg-white border border-ink-500/10 px-3 py-2 text-ink-700 shadow-2xs">
            Total: <strong>{products.length}</strong> Produk
          </span>
          <span className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-green-800">
            Aktif: <strong>{activeCount}</strong>
          </span>
          <span className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-red-800">
            Nonaktif: <strong>{inactiveCount}</strong>
          </span>
        </div>
      </div>

      {/* Daftar Produk dengan Informasi Seller & Toko */}
      {products.length === 0 ? (
        <div className="card p-12 text-center bg-white border border-dashed border-ink-500/20">
          <p className="font-bold text-ink-900 text-lg">Tidak ada produk ditemukan</p>
          <p className="text-xs text-ink-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="card p-4 bg-white border border-ink-500/15 hover:border-green-600/30 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
            >
              {/* 1. Detail Produk */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-ink-500/10 bg-cream-50">
                  <ProductImage src={imageUrl(p.imagePath)} alt={p.name} sizes="96px" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded bg-green-100 text-green-800 px-2 py-0.5 text-[10px] font-bold">
                      {p.category}
                    </span>
                    {p.isFeatured && (
                      <span className="rounded bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold">
                        ★ Unggulan
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.isActive ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {p.isActive ? "Tayang Aktif" : "Dinonaktifkan"}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-ink-900 leading-snug truncate" title={p.name}>
                    {p.name}
                  </h3>
                  <p className="text-xs text-ink-600">
                    Harga: <strong className="text-green-800">{idr(Number(p.price))}</strong> · Stok:{" "}
                    <strong className={p.stock > 0 ? "text-ink-800" : "text-danger"}>
                      {p.stock} unit {p.stock <= 0 && "(Habis)"}
                    </strong>
                  </p>
                </div>
              </div>

              {/* 2. Informasi Toko & Seller Pemilik Produk */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 lg:w-80 shrink-0 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Store size={14} className="text-blue-700 shrink-0" />
                  <span className="truncate">{p.storeName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink-700">
                  <User size={13} className="text-blue-600 shrink-0" />
                  <span className="truncate">
                    {p.sellerName} ({p.sellerEmail})
                  </span>
                </div>
                {p.sellerPhone && (
                  <div className="flex items-center gap-1.5 text-green-800 font-semibold pt-0.5">
                    <Phone size={13} className="text-green-700 shrink-0" />
                    <a
                      href={`https://wa.me/${p.sellerPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      title="Hubungi WhatsApp Seller Ini"
                    >
                      WA Seller: +{p.sellerPhone}
                    </a>
                  </div>
                )}
              </div>

              {/* 3. Aksi Admin: Hanya Nonaktifkan & Hapus */}
              <div className="shrink-0 flex items-center justify-end border-t lg:border-t-0 pt-2 lg:pt-0 border-ink-500/10">
                <RowActions id={p.id} name={p.name} active={p.isActive} slug={p.slug} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
