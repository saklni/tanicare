import Link from "next/link";
import type { Metadata } from "next";
import Catalog from "@/components/Catalog";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Katalog Produk", description: "Daftar produk sarana pertanian TaniCare.", alternates: { canonical: "/produk" } };

export default async function Page({ searchParams }: { searchParams: Promise<{ kategori?: string }> }) {
  const { kategori } = await searchParams;
  const { data, error } = await getProducts();
  return (
    <div className="container-x py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-700"><Link href="/">Beranda</Link> / Katalog</nav>
      <h1 className="mb-5 mt-2 text-[28px] md:text-[40px]">Katalog Produk</h1>
      {error ? (
        <div className="card p-8 text-center" role="alert"><p className="font-display text-xl font-bold text-danger">Data produk gagal dimuat</p>
          <Link href="/produk" className="btn-primary mt-4">Coba lagi</Link></div>
      ) : <Catalog products={data} initialCategory={kategori ?? ""} />}
    </div>
  );
}
