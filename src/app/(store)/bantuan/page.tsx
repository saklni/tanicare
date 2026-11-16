import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { waLink } from "@/lib/whatsapp";
export const metadata: Metadata = { title: "Bantuan", alternates: { canonical: "/bantuan" } };

export default async function Page() {
  const s = await getSettings();
  const wa = waLink(s.whatsapp_number, `Halo ${s.store_name}, saya butuh bantuan.`);
  const faq = [["Bagaimana cara memesan?", "Tambahkan produk ke keranjang, isi nama dan nomor kontak, lalu tekan “Kirim Pesanan via WhatsApp”."],
    ["Apakah bisa bayar di website?", "Tidak. Website ini tidak menerima pembayaran. Metode pembayaran dan ongkos kirim dibahas langsung dengan toko."],
    ["Kapan pesanan dikonfirmasi?", "Pesanan belum dikonfirmasi sampai pihak toko membalas melalui WhatsApp."]];
  return (
    <div className="container-x max-w-3xl py-10"><h1 className="text-[28px] md:text-[40px]">Bantuan</h1>
      <div className="mt-6 space-y-4">{faq.map(([q, a]) => <div key={q} className="card p-5"><h2 className="text-lg">{q}</h2><p className="mt-1 text-ink-700">{a}</p></div>)}</div>
      {wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa mt-6">Hubungi via WhatsApp</a> : <p className="mt-6 text-ink-700">Pemesanan WhatsApp belum tersedia. Silakan hubungi toko melalui informasi kontak yang tersedia.</p>}
    </div>
  );
}
