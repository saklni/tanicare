"use client";
import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

export default function ProductImage({ src, alt, priority = false, sizes = "(min-width:1024px) 25vw, 50vw" }: { src: string | null; alt: string; priority?: boolean; sizes?: string }) {
  const [bad, setBad] = useState(false);
  if (!src || bad)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-green-50 text-ink-500">
        <ImageOff aria-hidden size={28} /><span className="text-xs">Gambar belum tersedia</span>
      </div>
    );
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} onError={() => setBad(true)} className="object-cover" />;
}
