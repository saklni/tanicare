import type { Metadata } from "next";
import CartView from "@/components/CartView";
import { getSettings } from "@/lib/data";
export const metadata: Metadata = { title: "Keranjang", robots: { index: false } };

export default async function Page() {
  const s = await getSettings();
  return <div className="container-x py-8"><h1 className="mb-5 text-[28px] md:text-[40px]">Keranjang</h1><CartView storeName={s.store_name} waNumber={s.whatsapp_number} /></div>;
}
