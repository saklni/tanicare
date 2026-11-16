import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { requireAdmin } from "../../auth";
import ProductImage from "@/components/ProductImage";
import { RowActions } from "@/components/admin/RowActions";
import { idr, imageUrl } from "@/lib/format";
import type { Product } from "@/lib/types";
export const metadata = { title: "Kelola Produk" };

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; saved?: string }> }) {
  const { q = "", saved } = await searchParams;
  const { supabase } = await requireAdmin();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (q) query = query.ilike("name", `%${q.replace(/[%,]/g, "")}%`);
  const { data, error } = await query;
  const list = (data ?? []) as Product[];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-[28px]">Kelola Produk</h1>
        <Link href="/admin/produk/baru" className="btn-primary"><Plus aria-hidden size={18} />Tambah Produk</Link></div>
      {saved && <p role="status" className="mt-4 rounded-lg bg-green-100 p-3 font-semibold text-green-800">Produk berhasil disimpan.</p>}
      <form className="mt-4 flex gap-2"><label htmlFor="q" className="sr-only">Cari produk</label><input id="q" name="q" defaultValue={q} placeholder="Cari nama produk" className="input max-w-sm" /><button className="btn-secondary">Cari</button></form>
      {error && <p role="alert" className="mt-4 text-danger">Data gagal dimuat.</p>}
      {!error && list.length === 0 ? <div className="card mt-4 p-8 text-center"><p className="font-display text-xl font-bold">Belum ada produk</p><Link href="/admin/produk/baru" className="btn-primary mt-3">Tambah produk</Link></div> : (
        <ul className="mt-4 space-y-3">
          {list.map((p) => (
            <li key={p.id} className="card flex flex-wrap items-center gap-3 p-3">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg"><ProductImage src={imageUrl(p.image_path)} alt={p.name} sizes="80px" /></div>
              <div className="min-w-0 flex-1 basis-48"><p className="font-semibold">{p.name}</p>
                <p className="text-sm text-ink-700">{p.category} · {idr(Number(p.price))} · Stok {p.stock}{p.stock <= 0 && " (Habis)"}</p></div>
              <span className={`badge ${p.is_active ? "bg-green-100 text-green-800" : "bg-cream-200 text-ink-700"}`}>{p.is_active ? "Aktif" : "Nonaktif"}</span>
              <Link href={`/admin/produk/${p.id}/edit`} className="btn-secondary" aria-label={`Edit ${p.name}`}><Pencil aria-hidden size={16} />Edit</Link>
              <RowActions id={p.id} name={p.name} active={p.is_active} />
            </li>))}
        </ul>)}
    </div>
  );
}
