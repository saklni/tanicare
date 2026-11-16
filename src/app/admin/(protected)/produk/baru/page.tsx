import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export const metadata = { title: "Tambah Produk - Dikelola oleh Seller" };

export default function Page() {
  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="card p-8 bg-white border border-ink-500/10 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <ShieldAlert size={28} />
        </div>
        <h1 className="text-xl font-bold text-ink-900">Penambahan Produk Dikelola oleh Seller</h1>
        <p className="text-sm text-ink-600">
          Admin tidak menambahkan produk langsung ke katalog. Produk diunggah dan dikelola secara mandiri oleh masing-masing Mitra Seller melalui Dashboard Seller mereka.
        </p>
        <p className="text-xs text-ink-500">
          Sebagai Admin, tugas Anda adalah memantau asal toko/seller, menonaktifkan status tayang, atau menghapus produk yang tidak sesuai ketentuan.
        </p>
        <div className="pt-2">
          <Link href="/admin/produk" className="btn-primary text-xs inline-flex items-center gap-1.5 shadow-xs">
            <ArrowLeft size={16} /> Kembali ke Pengawasan Produk Seller
          </Link>
        </div>
      </div>
    </div>
  );
}
