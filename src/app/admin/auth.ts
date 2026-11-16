import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth-session";

/** Verifikasi sesi Admin dari cookie sesi atau Supabase Auth. */
export async function requireAdmin() {
  // 1. Cek sesi aplikasi
  const sessionUser = await getSessionUser();
  if (sessionUser && sessionUser.role === "ADMIN") {
    const supabase = await createClient();
    return {
      supabase,
      user: {
        id: sessionUser.id,
        email: sessionUser.email,
        user_metadata: { name: sessionUser.name },
      } as any,
    };
  }

  // 2. Cek sesi Supabase Auth sebagai cadangan
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?role=admin");

  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!data) redirect("/login?denied=1");

  return { supabase, user };
}
