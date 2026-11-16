"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Eye, CheckCircle2, XCircle, Package } from "lucide-react";
import ProductImage from "../ProductImage";
import { idr, imageUrl } from "@/lib/format";
import { deleteSellerProductAction, toggleSellerProductAction } from "@/lib/seller-actions";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  imagePath: string | null;
  isActive: boolean;
  isFeatured: boolean;
};

export default function SellerProductList({ products }: { products: ProductRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticProducts, setOptimisticProducts] = useState(products);

  const handleToggle = (id: string, current: boolean) => {
    setOptimisticProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !current } : p))
    );
    startTransition(async () => {
      await toggleSellerProductAction(id, current);
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}" dari toko Anda?`)) return;
    setOptimisticProducts((prev) => prev.filter((p) => p.id !== id));
    startTransition(async () => {
      await deleteSellerProductAction(id);
    });
  };

  return (
    <div className="card bg-white p-6 shadow-sm border border-ink-500/10 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-500/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-ink-900 flex items-center gap-2">
            <Package className="text-blue-600" size={22} />
            Katalog Produk Toko Saya
          </h2>
          <p className="text-xs text-ink-600 mt-1">
            Kelola produk yang Anda jual di marketplace TaniCare. Pesanan otomatis masuk ke nomor WhatsApp toko Anda.
          </p>
        </div>
        <Link
          href="/seller/produk/baru"
          className="btn-primary text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
        >
          <Plus size={16} /> Tambah Produk Baru
        </Link>
      </div>

      {optimisticProducts.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-ink-500/20 bg-cream-50/50">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
            <Package size={24} />
          </div>
          <h3 className="font-bold text-ink-900 text-base">Belum Ada Produk di Toko Anda</h3>
          <p className="text-xs text-ink-600 max-w-md mx-auto mt-1 mb-4">
            Mulai tambahkan produk pupuk, obat hama, herbisida, atau sarana pertanian Anda sekarang agar bisa dibeli oleh petani.
          </p>
          <Link href="/seller/produk/baru" className="btn-primary text-xs inline-flex items-center gap-1.5">
            <Plus size={16} /> Tambah Produk Pertama Anda
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-500/10 text-xs font-semibold text-ink-600 uppercase bg-cream-50/60">
                <th className="py-3 px-3">Produk</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Harga</th>
                <th className="py-3 px-3">Stok</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-500/10">
              {optimisticProducts.map((p) => (
                <tr key={p.id} className="hover:bg-cream-50/30 transition">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-ink-500/10 bg-white">
                        <ProductImage src={imageUrl(p.imagePath)} alt={p.name} sizes="48px" />
                      </div>
                      <div>
                        <Link
                          href={`/produk/${p.slug}`}
                          className="font-bold text-ink-900 hover:text-green-700 transition line-clamp-1"
                        >
                          {p.name}
                        </Link>
                        {p.isFeatured && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold inline-block mt-0.5">
                            ★ Unggulan
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-800">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-green-800">
                    {idr(p.price)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold ${
                        p.stock > 10 ? "text-ink-800" : p.stock > 0 ? "text-amber-600 font-bold" : "text-danger font-bold"
                      }`}
                    >
                      {p.stock} unit
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleToggle(p.id, p.isActive)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                        p.isActive
                          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                      title={p.isActive ? "Klik untuk menonaktifkan" : "Klik untuk mengaktifkan"}
                    >
                      {p.isActive ? (
                        <>
                          <CheckCircle2 size={13} /> Aktif
                        </>
                      ) : (
                        <>
                          <XCircle size={13} /> Nonaktif
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/produk/${p.slug}`}
                        target="_blank"
                        className="btn-ghost !p-2 text-ink-600 hover:text-green-700"
                        title="Lihat di Katalog Publik"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/seller/produk/${p.id}/edit`}
                        className="btn-ghost !p-2 text-blue-700 hover:text-blue-900"
                        title="Edit Produk"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={isPending}
                        className="btn-ghost !p-2 text-red-600 hover:text-red-800"
                        title="Hapus Produk"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
