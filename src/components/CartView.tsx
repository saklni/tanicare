"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Trash2, MessageCircle, AlertTriangle, Store } from "lucide-react";
import { useCart } from "./CartProvider";
import ProductImage from "./ProductImage";
import { idr } from "@/lib/format";
import { buildOrderMessage, normalizePhone, waLink } from "@/lib/whatsapp";
import { fetchCartProductsDetails, type CartProductDetail } from "@/lib/cart-actions";

export default function CartView({ storeName, waNumber }: { storeName: string; waNumber: string }) {
  const { items, ready, setQty, remove, clear } = useCart();
  const [live, setLive] = useState<Record<string, CartProductDetail> | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", notes: "" });
  const [err, setErr] = useState<{ name?: string; phone?: string }>({});
  const [href, setHref] = useState<string | null>(null);

  // Periksa ulang harga/stok terbaru dan nomor WA seller dari database via server action
  useEffect(() => {
    if (!ready || !items.length) {
      setLive({});
      return;
    }
    const ids = items.map((i) => i.productId);
    fetchCartProductsDetails(ids).then((res) => {
      setLive(res);
    });
  }, [ready, items]);

  const rows = useMemo(() => {
    return items.map((i) => {
      const l = live?.[i.productId];
      const unavailable = !!live && (!l || !l.isActive || l.stock <= 0);
      const price = l ? l.price : i.price;
      const over = !!l && !unavailable && i.quantity > l.stock;
      return {
        ...i,
        price,
        unavailable,
        over,
        stock: l?.stock,
        sellerStoreName: l?.sellerStoreName ?? "Toko Mitra",
        sellerWa: l?.sellerWa ?? waNumber,
        changed: !!l && l.price !== i.price,
      };
    });
  }, [items, live, waNumber]);

  const issues = rows.some((r) => r.unavailable || r.over);
  const lines = rows.filter((r) => !r.unavailable);
  const total = lines.reduce((s, r) => s + r.price * r.quantity, 0);

  // Menentukan nomor WhatsApp tujuan: prioritaskan nomor WhatsApp Seller dari produk di keranjang
  const primarySellerWa = rows.find((r) => r.sellerWa)?.sellerWa || waNumber;
  const primarySellerStore = rows.find((r) => r.sellerStoreName)?.sellerStoreName || storeName;
  const isSellerNumber = primarySellerWa !== waNumber;

  const waOk = /^62[0-9]{8,13}$/.test(primarySellerWa);

  if (!ready || live === null) return <p className="text-ink-700">Memuat keranjang…</p>;
  if (!items.length)
    return (
      <div className="card p-8 text-center bg-white">
        <p className="font-display text-xl font-bold">Keranjang Anda masih kosong</p>
        <Link href="/produk" className="btn-primary mt-4">
          Lihat Katalog
        </Link>
      </div>
    );

  const send = () => {
    const e: typeof err = {};
    if (form.name.trim().length < 2) e.name = "Nama wajib diisi.";
    if (!normalizePhone(form.phone)) e.phone = "Nomor kontak tidak valid.";
    setErr(e);
    if (Object.keys(e).length || issues) return;

    const url = waLink(
      primarySellerWa,
      buildOrderMessage(primarySellerStore, lines, {
        ...form,
        name: form.name.trim(),
        phone: normalizePhone(form.phone)!,
      })
    );
    if (!url) return;
    setHref(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section aria-label="Daftar item" className="space-y-3">
        {rows.map((r) => (
          <div key={r.productId} className={`card flex gap-3 p-3 bg-white ${r.unavailable ? "border-danger/50" : ""}`}>
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
              <ProductImage src={r.imageUrl ?? null} alt={r.name} sizes="96px" />
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/produk/${r.slug}`} className="line-clamp-2 font-semibold hover:text-green-800">
                {r.name}
              </Link>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-xs text-blue-800 font-medium">
                  <Store size={12} /> {r.sellerStoreName}
                </span>
                <span className="text-xs text-ink-500">• WA: +{r.sellerWa}</span>
              </div>
              <p className="text-sm text-ink-700 font-medium mt-1">
                {idr(r.price)}
                {r.changed && " (harga diperbarui)"}
              </p>

              {r.unavailable && (
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-danger">
                  <AlertTriangle aria-hidden size={14} />
                  Tidak tersedia. Hapus dari keranjang.
                </p>
              )}
              {r.over && (
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-warning">
                  <AlertTriangle aria-hidden size={14} />
                  Stok tersisa {r.stock}. Sesuaikan jumlah.
                </p>
              )}

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-ink-500/40" role="group" aria-label={`Kuantitas ${r.name}`}>
                  <button
                    className="btn-ghost !px-3"
                    aria-label="Kurangi"
                    disabled={r.quantity <= 1}
                    onClick={() => setQty(r.productId, r.quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-semibold">{r.quantity}</span>
                  <button
                    className="btn-ghost !px-3"
                    aria-label="Tambah"
                    disabled={r.stock !== undefined && r.quantity >= r.stock}
                    onClick={() => setQty(r.productId, r.quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="font-bold text-green-800">{idr(r.price * r.quantity)}</p>
                <button
                  className="btn-ghost !px-3 text-danger"
                  aria-label={`Hapus ${r.name}`}
                  onClick={() => remove(r.productId)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <button className="btn-ghost text-sm text-ink-600 hover:text-danger" onClick={clear}>
          Kosongkan keranjang
        </button>
      </section>

      <aside className="card h-fit space-y-4 p-5 bg-white shadow-sm" aria-label="Ringkasan pesanan">
        <h2 className="text-xl font-bold text-ink-900">Ringkasan Pesanan</h2>
        <div className="flex justify-between text-sm">
          <span>Total perkiraan ({lines.reduce((s, r) => s + r.quantity, 0)} item)</span>
          <strong className="text-lg text-green-800">{idr(total)}</strong>
        </div>

        {/* Info Tujuan WhatsApp */}
        <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3 text-xs text-ink-700 space-y-1">
          <p className="font-bold text-blue-900 flex items-center gap-1.5">
            <Store size={14} /> Tujuan Pesanan:
          </p>
          <p>
            Toko: <strong>{primarySellerStore}</strong>
          </p>
          <p>
            Nomor WA Seller: <strong>+{primarySellerWa}</strong> {isSellerNumber ? "(Langsung ke Penjual)" : "(Admin CS)"}
          </p>
        </div>

        <div>
          <label className="label" htmlFor="nama">
            Nama pemesan *
          </label>
          <input
            id="nama"
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            aria-invalid={!!err.name}
            aria-describedby={err.name ? "e-nama" : undefined}
            autoComplete="name"
            placeholder="Nama lengkap Anda"
          />
          {err.name && (
            <p id="e-nama" className="mt-1 text-sm text-danger">
              {err.name}
            </p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="hp">
            Nomor WhatsApp Anda *
          </label>
          <input
            id="hp"
            inputMode="tel"
            className="input"
            placeholder="Contoh: 081234567890"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            aria-invalid={!!err.phone}
            aria-describedby={err.phone ? "e-hp" : undefined}
            autoComplete="tel"
          />
          {err.phone && (
            <p id="e-hp" className="mt-1 text-sm text-danger">
              {err.phone}
            </p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="cat">
            Catatan Tambahan (opsional)
          </label>
          <textarea
            id="cat"
            rows={3}
            className="input"
            placeholder="Alamat lengkap pengiriman atau instruksi khusus..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <button
          className="btn-wa w-full !justify-center !py-3 font-semibold shadow-sm"
          onClick={send}
          disabled={!waOk || issues || !lines.length}
        >
          <MessageCircle aria-hidden size={18} />
          Kirim Pesanan ke WA Toko (+{primarySellerWa})
        </button>

        {!waOk && (
          <p className="text-sm text-danger" role="alert">
            Nomor WhatsApp penjual belum valid.
          </p>
        )}
        {issues && (
          <p className="text-sm text-warning" role="alert">
            Perbaiki item yang bermasalah sebelum melanjutkan.
          </p>
        )}

        <p className="text-xs text-ink-500">
          WhatsApp akan terbuka dengan format pesanan otomatis. Anda dapat berdiskusi langsung dengan pihak toko terkait
          ongkir dan metode pengiriman.
        </p>

        {href && (
          <p className="text-xs text-ink-600">
            WhatsApp tidak terbuka otomatis?{" "}
            <a className="font-semibold text-green-700 underline" href={href} target="_blank" rel="noopener noreferrer">
              Klik di sini untuk membuka WhatsApp
            </a>
            .
          </p>
        )}
      </aside>
    </div>
  );
}
