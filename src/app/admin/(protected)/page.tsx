import { requireAdmin } from "../auth";
export const metadata = { title: "Dashboard" };

export default async function Page() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("products").select("is_active,stock,is_featured");
  const p = data ?? [];
  const stats = [["Produk aktif", p.filter((x) => x.is_active).length], ["Produk nonaktif", p.filter((x) => !x.is_active).length], ["Stok habis", p.filter((x) => x.stock <= 0).length], ["Produk unggulan", p.filter((x) => x.is_featured).length]];
  return (<div><h1 className="text-[28px]">Dashboard</h1>
    <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">{stats.map(([l, n]) => <div key={l as string} className="card p-5"><p className="text-sm text-ink-700">{l}</p><p className="font-display text-4xl font-bold text-green-800">{n}</p></div>)}</div></div>);
}
