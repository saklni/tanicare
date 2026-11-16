import { requireAdmin } from "../../auth";
import SettingsForm from "@/components/admin/SettingsForm";
import type { Settings } from "@/lib/types";
export const metadata = { title: "Pengaturan Toko" };

export default async function Page() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("store_settings").select("*").limit(1).maybeSingle();
  if (!data) return <p role="alert" className="text-danger">Baris pengaturan belum ada. Jalankan supabase/schema.sql.</p>;
  return <div><h1 className="mb-5 text-[28px]">Pengaturan Toko</h1><SettingsForm s={data as Settings} /></div>;
}
