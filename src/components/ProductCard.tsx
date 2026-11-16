import Link from "next/link";
import { Star, Store } from "lucide-react";
import ProductImage from "./ProductImage";
import StockBadge from "./StockBadge";
import AddToCart from "./AddToCart";
import { idr, imageUrl } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="group card flex flex-col overflow-hidden bg-white rounded-2xl border border-ink-500/15 hover:border-green-600/40 hover:shadow-lg transition-all duration-200">
      <Link
        href={`/produk/${p.slug}`}
        className="relative block aspect-[4/3] bg-cream-50 overflow-hidden"
        aria-label={`Lihat detail ${p.name}`}
      >
        <ProductImage src={imageUrl(p.image_path)} alt={p.name} />
        {p.is_featured && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-amber-500/95 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
            <Star size={11} fill="white" /> Unggulan
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-1 text-xs">
          <span className="rounded-md bg-green-50 px-2 py-0.5 font-bold text-green-800 text-[11px]">
            {p.category}
          </span>
          <StockBadge stock={p.stock} />
        </div>

        <h3 className="line-clamp-2 text-sm font-bold text-ink-900 group-hover:text-green-800 transition" title={p.name}>
          <Link href={`/produk/${p.slug}`}>{p.name}</Link>
        </h3>

        {p.seller?.store?.name && (
          <div className="flex items-center gap-1 text-[11px] text-blue-900 font-medium">
            <Store size={12} className="text-blue-700 shrink-0" />
            <span className="line-clamp-1">{p.seller.store.name}</span>
          </div>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between gap-2 border-t border-ink-500/10">
          <div>
            <span className="text-[10px] text-ink-500 block leading-none">Harga</span>
            <p className="text-base font-extrabold text-green-800 mt-0.5">{idr(p.price)}</p>
          </div>
          <div className="shrink-0">
            <AddToCart product={p} />
          </div>
        </div>
      </div>
    </article>
  );
}
