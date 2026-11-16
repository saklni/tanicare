import { idr } from "./format";

/** Normalisasi ke format 62xxxxxxxx (digit saja). Mengembalikan null bila tidak valid. */
export function normalizePhone(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  return /^62[0-9]{8,13}$/.test(d) ? d : null;
}
// Satu-satunya pembentuk URL WhatsApp.
export function waLink(number: string, text: string): string | null {
  if (!/^62[0-9]{8,13}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
export type OrderLine = { name: string; price: number; quantity: number };
export function buildOrderMessage(storeName: string, lines: OrderLine[], buyer: { name: string; phone: string; notes: string }) {
  const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const items = lines.map((l, i) => `${i + 1}. ${l.name}\n   Jumlah: ${l.quantity}\n   Harga tertera: ${idr(l.price)}\n   Subtotal: ${idr(l.price * l.quantity)}`).join("\n\n");
  return `Halo ${storeName}, saya ingin menanyakan dan memesan produk berikut:\n\n${items}\n\nTotal perkiraan: ${idr(total)}\n\nNama: ${buyer.name}\nNomor kontak: ${buyer.phone}\nCatatan: ${buyer.notes.trim() || "-"}\n\nMohon konfirmasi ketersediaan stok, harga akhir, ongkos kirim, dan proses pemesanan.\nTerima kasih.`;
}
