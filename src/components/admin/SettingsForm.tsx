"use client";
import { useActionState, useState } from "react";
import { saveSettings } from "@/app/admin/actions";
import { normalizePhone } from "@/lib/whatsapp";
import type { Settings } from "@/lib/types";

export default function SettingsForm({ s }: { s: Settings }) {
  const [state, action, pending] = useActionState(saveSettings, undefined);
  const [wa, setWa] = useState(s.whatsapp_number);
  const n = wa.trim() ? normalizePhone(wa) : "";
  return (
    <form action={action} className="max-w-xl space-y-4">
      <input type="hidden" name="id" value={s.id} />
      <div><label className="label" htmlFor="store_name">Nama toko *</label><input id="store_name" name="store_name" required className="input" defaultValue={s.store_name} /></div>
      <div><label className="label" htmlFor="store_description">Deskripsi singkat</label><textarea id="store_description" name="store_description" rows={2} className="input" defaultValue={s.store_description ?? ""} /></div>
      <div><label className="label" htmlFor="address">Alamat</label><textarea id="address" name="address" rows={2} className="input" defaultValue={s.address ?? ""} /></div>
      <div><label className="label" htmlFor="whatsapp_number">Nomor WhatsApp pemesanan</label>
        <input id="whatsapp_number" name="whatsapp_number" inputMode="tel" placeholder="08xxxxxxxxxx / 62xxxxxxxxxx / +62xxxxxxxxxx" className="input" value={wa} onChange={(e) => setWa(e.target.value)} aria-describedby="wa-prev" />
        <p id="wa-prev" className={`mt-1 text-sm ${n === null ? "font-semibold text-danger" : "text-ink-700"}`}>
          {n === null ? "Nomor WhatsApp tidak valid." : n ? `Akan disimpan sebagai: ${n}` : "Belum diatur. Tombol pemesanan WhatsApp akan dinonaktifkan."}</p>
        <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-warning">Nomor ini akan digunakan sebagai tujuan tombol pemesanan dan konsultasi WhatsApp di website.</p></div>
      {state?.error && <p role="alert" className="font-semibold text-danger">{state.error}</p>}
      {state?.ok && <p role="status" className="font-semibold text-green-800">{state.ok}</p>}
      <button className="btn-primary" disabled={pending || n === null}>{pending ? "Menyimpan…" : "Simpan Pengaturan"}</button>
    </form>
  );
}
