"use client";
import Image from "next/image";
import { useState } from "react";
import { Sprout } from "lucide-react";

export default function ProductImage({
  src,
  alt,
  priority = false,
  sizes = "(min-width:1024px) 25vw, 50vw",
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [bad, setBad] = useState(false);
  const isSvg = src?.endsWith(".svg") || src?.includes(".svg");

  if (!src || bad) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-50 to-emerald-100/50 text-ink-500 p-4">
        <div className="w-12 h-12 rounded-full bg-white/80 shadow-xs flex items-center justify-center text-green-700">
          <Sprout aria-hidden size={24} />
        </div>
        <span className="text-xs font-semibold text-ink-600 text-center line-clamp-1">
          {alt || "Produk TaniCare"}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={Boolean(isSvg)}
      onError={() => setBad(true)}
      className="object-cover group-hover:scale-105 transition-transform duration-300"
    />
  );
}
