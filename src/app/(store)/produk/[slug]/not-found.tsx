import Link from "next/link";
export default function NotFound() {
  return <div className="container-x py-20 text-center"><h1 className="text-3xl">Produk tidak ditemukan</h1><p className="mt-2 text-ink-700">Produk mungkin sudah tidak tersedia.</p><Link href="/produk" className="btn-primary mt-5">Kembali ke Katalog</Link></div>;
}
