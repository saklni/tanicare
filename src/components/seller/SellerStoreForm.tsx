"use client";
import { useActionState } from "react";
import { MessageCircle, Save, CheckCircle, AlertCircle } from "lucide-react";
import { updateSellerStoreAction } from "@/lib/seller-actions";

export default function SellerStoreForm({
  initialStore,
}: {
  initialStore: {
    name: string;
    whatsappNumber: string;
    address: string;
    description: string;
  };
}) {
  const [state, action, pending] = useActionState(updateSellerStoreAction, undefined);

  return (
    <form action={action} className="card p-6 bg-white space-y-4 shadow-sm border border-ink-500/10">
      <div className="flex items-center justify-between border-b border-ink-500/10 pb-3">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Pengaturan Toko & Nomor WhatsApp Seller</h2>
          <p className="text-xs text-ink-600">
            Setiap penjual memiliki nomor WhatsApp berbeda untuk menerima pemesanan langsung dari pembeli.
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">
          <MessageCircle size={14} /> WhatsApp Toko
        </div>
      </div>

      {state?.ok && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-800 border border-green-200">
          <CheckCircle size={18} />
          {state.ok}
        </div>
      )}

      {state?.error && (
        <div className="flex items-center gap-2 rounded-lg bg-danger/10 p-3 text-sm font-medium text-danger border border-danger/20">
          <AlertCircle size={18} />
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="store_name">
            Nama Toko Pertanian *
          </label>
          <input
            id="store_name"
            name="store_name"
            defaultValue={initialStore.name}
            required
            className="input"
            placeholder="Contoh: Toko Berkah Tani Mandiri"
          />
        </div>

        <div>
          <label className="label" htmlFor="whatsapp_number">
            Nomor WhatsApp Khusus Penjual *
          </label>
          <input
            id="whatsapp_number"
            name="whatsapp_number"
            type="tel"
            defaultValue={initialStore.whatsappNumber}
            required
            className="input font-mono font-medium"
            placeholder="Contoh: 081234567891 atau 6281234567891"
          />
          <p className="text-[11px] text-ink-500 mt-1">
            Pembeli yang mengklik &apos;Pesan via WhatsApp&apos; pada produk Anda akan otomatis menghubungi nomor ini.
          </p>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="address">
          Alamat Toko / Lokasi Gudang
        </label>
        <input
          id="address"
          name="address"
          defaultValue={initialStore.address}
          className="input"
          placeholder="Contoh: Jl. Pertanian Makmur No. 45, Pare, Kediri"
        />
      </div>

      <div>
        <label className="label" htmlFor="description">
          Deskripsi Singkat Toko
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={initialStore.description}
          className="input"
          placeholder="Jelaskan spesialisasi produk Anda..."
        />
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" className="btn-primary flex items-center gap-2 text-sm" disabled={pending}>
          <Save size={16} />
          {pending ? "Menyimpan…" : "Simpan Pengaturan WhatsApp Toko"}
        </button>
      </div>
    </form>
  );
}

