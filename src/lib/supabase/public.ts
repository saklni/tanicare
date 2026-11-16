import { createClient } from "@supabase/supabase-js";
// Klien anonim tanpa sesi: hanya untuk data publik (RLS membatasi ke produk aktif).
export const publicClient = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
