"use client";
import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";
import { imageUrl } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function AddToCart({ product, withQty = false }: { product: Product; withQty?: boolean }) {
  const { add } = useCart();
  const [q, setQ] = useState(1);
  const out = product.stock <= 0;
  const btn = (
    <button className="btn-primary flex-1" disabled={out}
      onClick={() => add({ productId: product.id, slug: product.slug, name: product.name, price: product.price, imageUrl: imageUrl(product.image_path) }, q, product.stock)}>
      <ShoppingCart aria-hidden size={18} />{out ? "Stok Habis" : "Tambah ke Keranjang"}
    </button>
  );
  if (!withQty) return btn;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-lg border border-ink-500/40 bg-white" role="group" aria-label="Kuantitas">
        <button className="btn-ghost !px-3" aria-label="Kurangi" disabled={out || q <= 1} onClick={() => setQ(q - 1)}><Minus size={16} /></button>
        <span className="w-10 text-center font-semibold" aria-live="polite">{q}</span>
        <button className="btn-ghost !px-3" aria-label="Tambah" disabled={out || q >= product.stock} onClick={() => setQ(q + 1)}><Plus size={16} /></button>
      </div>
      {btn}
    </div>
  );
}
