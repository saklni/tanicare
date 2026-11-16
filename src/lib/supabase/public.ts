import { createClient } from "@supabase/supabase-js";

// Klien anonim tanpa sesi: hanya untuk data publik (RLS membatasi ke produk aktif).
export const publicClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-tanicare.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
  return createClient(url, key, { auth: { persistSession: false } });
};
