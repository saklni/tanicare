"use client";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct, toggleActive } from "@/app/admin/actions";

export function RowActions({ id, name, active }: { id: string; name: string; active: boolean }) {
  const [pending, start] = useTransition();
  return (<>
    <button className="btn-ghost border border-ink-500/30" disabled={pending} onClick={() => start(() => toggleActive(id, !active))}>{active ? "Nonaktifkan" : "Aktifkan"}</button>
    <button className="btn-danger" aria-label={`Hapus ${name}`} disabled={pending}
      onClick={() => confirm(`Hapus produk "${name}"? Tindakan ini tidak dapat dibatalkan.`) && start(() => deleteProduct(id))}><Trash2 aria-hidden size={16} /></button>
  </>);
}
