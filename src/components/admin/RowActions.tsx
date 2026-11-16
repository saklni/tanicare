"use client";
import { useTransition } from "react";
import { Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { deleteProduct, toggleActive } from "@/app/admin/actions";

export function RowActions({
  id,
  name,
  active,
  slug,
}: {
  id: string;
  name: string;
  active: boolean;
  slug?: string;
}) {
  const [pending, start] = useTransition();

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {slug && (
        <Link
          href={`/produk/${slug}`}
          target="_blank"
          className="btn-ghost !p-2 text-ink-600 hover:text-green-800"
          title="Lihat Produk di Etalase Toko"
        >
          <Eye size={16} />
        </Link>
      )}
      <button
        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer disabled:opacity-50 ${
          active
            ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
            : "border-green-300 bg-green-50 text-green-800 hover:bg-green-100"
        }`}
        disabled={pending}
        onClick={() => start(() => toggleActive(id, !active))}
        title={active ? "Klik untuk menonaktifkan produk dari katalog" : "Klik untuk mengaktifkan kembali produk"}
      >
        {active ? "Nonaktifkan" : "Aktifkan"}
      </button>
      <button
        className="btn-danger !p-2 !min-h-0 text-white rounded-lg hover:opacity-90 transition cursor-pointer disabled:opacity-50"
        aria-label={`Hapus ${name}`}
        disabled={pending}
        title="Hapus Produk Permanen"
        onClick={() =>
          confirm(`Hapus produk "${name}" secara permanen dari sistem?`) &&
          start(() => deleteProduct(id))
        }
      >
        <Trash2 aria-hidden size={16} />
      </button>
    </div>
  );
}
