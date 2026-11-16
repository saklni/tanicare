"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

const SORTS = { featured: "Unggulan", low: "Harga Terendah", high: "Harga Tertinggi", name: "Nama A–Z" } as const;

export default function Catalog({ products, initialCategory = "" }: { products: Product[]; initialCategory?: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initialCategory);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sort, setSort] = useState<keyof typeof SORTS>("featured");
  const cats = useMemo(() => Array.from(new Set(products.map((p) => p.category))).sort(), [products]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const r = products.filter((p) =>
      (!cat || p.category === cat) && (!onlyFeatured || p.is_featured) &&
      (!s || [p.name, p.description, p.category, p.active_ingredient].some((v) => v?.toLowerCase().includes(s))));
    return [...r].sort((a, b) =>
      sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "name" ? a.name.localeCompare(b.name, "id")
        : Number(b.is_featured) - Number(a.is_featured));
  }, [products, q, cat, onlyFeatured, sort]);
  const active = q || cat || onlyFeatured;

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <label htmlFor="cari" className="sr-only">Cari produk</label>
          <Search aria-hidden className="pointer-events-none absolute left-3 top-3.5 text-ink-500" size={18} />
          <input id="cari" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, deskripsi, atau bahan aktif" className="input pl-10" />
        </div>
        <div>
          <label htmlFor="urut" className="sr-only">Urutkan</label>
          <select id="urut" value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} className="input">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filter kategori">
        {["", ...cats].map((c) => (
          <button key={c || "all"} onClick={() => setCat(c)} aria-pressed={cat === c}
            className={`btn shrink-0 !rounded-full border ${cat === c ? "border-green-700 bg-green-700 text-white" : "border-ink-500/30 bg-white text-ink-700"}`}>
            {c || "Semua"}
          </button>
        ))}
        <button onClick={() => setOnlyFeatured(!onlyFeatured)} aria-pressed={onlyFeatured}
          className={`btn shrink-0 !rounded-full border ${onlyFeatured ? "border-warning bg-amber-50 text-warning" : "border-ink-500/30 bg-white text-ink-700"}`}>★ Unggulan</button>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-ink-700">
        <p aria-live="polite">{list.length} produk ditemukan</p>
        {active && <button className="btn-ghost" onClick={() => { setQ(""); setCat(""); setOnlyFeatured(false); }}>Reset filter</button>}
      </div>
      {list.length === 0 ? (
        <div className="card mt-4 p-8 text-center">
          <p className="font-display text-xl font-bold">{products.length ? "Produk tidak ditemukan" : "Belum ada produk yang tersedia"}</p>
          <p className="mt-1 text-ink-700">{products.length ? "Coba kata kunci atau filter lain." : "Silakan hubungi toko untuk informasi produk."}</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
