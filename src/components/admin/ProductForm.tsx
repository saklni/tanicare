"use client";
import { useActionState, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { saveProduct } from "@/app/admin/actions";
import { CATEGORIES, type Product } from "@/lib/types";
import { fmtSize, imageUrl } from "@/lib/format";

const T = (id: string, label: string, p: Record<string, unknown> = {}) => (
  <div><label className="label" htmlFor={id}>{label}</label><input id={id} name={id} className="input" {...p} /></div>);
const A = (id: string, label: string, v?: string, hint?: string) => (
  <div><label className="label" htmlFor={id}>{label}</label><textarea id={id} name={id} rows={3} defaultValue={v} className="input" />{hint && <p className="mt-1 text-xs text-ink-700">{hint}</p>}</div>);

export default function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const [preview, setPreview] = useState<string | null>(imageUrl(product?.image_path ?? null));
  const [meta, setMeta] = useState("");
  const [removed, setRemoved] = useState(false);
  const [clientErr, setClientErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const pick = (f?: File) => {
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) return setClientErr("Format gambar tidak didukung.");
    if (f.size > 5 * 1024 * 1024) return setClientErr("Ukuran gambar melebihi batas.");
    setClientErr(""); setRemoved(false); setPreview(URL.createObjectURL(f)); setMeta(`${f.name} · ${fmtSize(f.size)}`);
    if (fileRef.current) { const dt = new DataTransfer(); dt.items.add(f); fileRef.current.files = dt.files; }
  };
  const cats = Array.from(new Set([...CATEGORIES, ...(product ? [product.category] : [])]));

  return (
    <form action={action} className="max-w-3xl space-y-4">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="remove_image" value={removed ? "1" : ""} />
      <div className="grid gap-4 md:grid-cols-2">
        {T("name", "Nama produk *", { required: true, minLength: 3, defaultValue: product?.name })}
        {T("slug", "Slug (otomatis dari nama bila kosong)", { defaultValue: product?.slug })}
        <div><label className="label" htmlFor="category">Kategori *</label>
          <input id="category" name="category" list="cats" required className="input" defaultValue={product?.category ?? CATEGORIES[0]} /><datalist id="cats">{cats.map((c) => <option key={c} value={c} />)}</datalist></div>
        {T("sku", "SKU (opsional)", { defaultValue: product?.sku ?? "" })}
        {T("price", "Harga (Rp) *", { type: "number", min: 0, step: 1, required: true, inputMode: "numeric", defaultValue: product?.price ?? 0 })}
        {T("stock", "Stok *", { type: "number", min: 0, step: 1, required: true, inputMode: "numeric", defaultValue: product?.stock ?? 0 })}
      </div>
      {A("description", "Deskripsi", product?.description ?? "")}
      {T("active_ingredient", "Bahan aktif", { defaultValue: product?.active_ingredient ?? "" })}
      {A("benefits", "Manfaat (satu per baris)", product?.benefits?.join("\n"))}
      {A("usage_instructions", "Aturan penggunaan", product?.usage_instructions ?? "", "Isi hanya bila bersumber dari label resmi produk.")}
      {A("label_dosage", "Dosis (kutipan label)", product?.label_dosage ?? "", "Jangan mengisi dosis yang tidak tertulis pada label.")}
      {A("warnings", "Peringatan (satu per baris)", product?.warnings?.join("\n"))}
      <div className="grid gap-4 md:grid-cols-2">{T("manufacturer", "Produsen", { defaultValue: product?.manufacturer ?? "" })}{T("registration_number", "Nomor pendaftaran", { defaultValue: product?.registration_number ?? "" })}</div>

      <fieldset className="card space-y-3 p-4"><legend className="px-1 font-semibold">Gambar produk</legend>
        <div className="relative aspect-[4/3] max-w-xs overflow-hidden rounded-lg bg-green-50"
          onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]); }}>
          {preview && !removed ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={preview} alt="Pratinjau gambar produk" className="h-full w-full object-cover" />
            : <div className="flex h-full items-center justify-center p-4 text-center text-sm text-ink-500">Belum ada gambar. Seret file ke sini atau pilih gambar.</div>}
        </div>
        {meta && <p className="text-sm text-ink-700">{meta}</p>}
        <input ref={fileRef} id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        <div className="flex flex-wrap gap-2">
          <label htmlFor="image" className="btn-secondary cursor-pointer"><ImagePlus aria-hidden size={18} />{preview && !removed ? "Ganti Gambar" : "Pilih Gambar"}</label>
          {product?.image_path && !removed && <button type="button" className="btn-ghost text-danger" onClick={() => confirm("Hapus gambar produk saat disimpan?") && (setRemoved(true), setPreview(null))}><Trash2 aria-hidden size={18} />Hapus Gambar</button>}
        </div>
        <p className="text-xs text-ink-700">Format JPG, PNG, atau WebP. Maksimum 5 MB.</p>
        {clientErr && <p role="alert" className="text-sm font-semibold text-danger">{clientErr}</p>}
      </fieldset>

      <div className="flex flex-wrap gap-6">
        <label className="flex min-h-[44px] items-center gap-2"><input type="checkbox" name="is_featured" defaultChecked={product?.is_featured} className="h-5 w-5" />Produk unggulan</label>
        <label className="flex min-h-[44px] items-center gap-2"><input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} className="h-5 w-5" />Aktif (tampil di katalog)</label>
      </div>
      {state?.error && <p role="alert" className="rounded-lg bg-red-50 p-3 font-semibold text-danger">{state.error}</p>}
      <button className="btn-primary" disabled={pending || !!clientErr}>{pending ? "Menyimpan & mengunggah…" : "Simpan Produk"}</button>
    </form>
  );
}
