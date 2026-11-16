"use client";
import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";
import { imageUrl } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function AddToCart({
  product,
  withQty = false,
  className = "",
}: {
  product: Product;
  withQty?: boolean;
  className?: string;
}) {
  const { add } = useCart();
  const [q, setQ] = useState(1);
  const out = product.stock <= 0;

  const handleAdd = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        imageUrl: imageUrl(product.image_path),
      },
      q,
      product.stock
    );
  };

  const btn = (
    <button
      className={`btn-primary w-full !py-2.5 !text-xs md:!text-sm font-bold flex items-center justify-center gap-2 rounded-xl transition shadow-xs hover:shadow active:scale-[0.99] ${className}`}
      disabled={out}
      onClick={handleAdd}
      title={out ? "Stok produk habis" : "Tambahkan ke Keranjang"}
    >
      <ShoppingCart aria-hidden size={16} className="shrink-0" />
      <span>{out ? "Stok Habis" : "Tambah ke Keranjang"}</span>
    </button>
  );

  if (!withQty) return btn;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        className="flex items-center rounded-xl border border-ink-500/30 bg-white shadow-xs"
        role="group"
        aria-label="Kuantitas"
      >
        <button
          className="btn-ghost !px-3 !min-h-[44px] rounded-l-xl text-ink-700 hover:text-ink-950"
          aria-label="Kurangi kuantitas"
          disabled={out || q <= 1}
          onClick={() => setQ(q - 1)}
        >
          <Minus size={16} />
        </button>
        <span className="w-12 text-center font-bold text-ink-900" aria-live="polite">
          {q}
        </span>
        <button
          className="btn-ghost !px-3 !min-h-[44px] rounded-r-xl text-ink-700 hover:text-ink-950"
          aria-label="Tambah kuantitas"
          disabled={out || q >= product.stock}
          onClick={() => setQ(q + 1)}
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1 min-w-[200px]">{btn}</div>
    </div>
  );
}
