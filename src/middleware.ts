import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const { pathname } = req.nextUrl;

  // 1. Cek sesi lokal aplikasi
  const sessionCookie = req.cookies.get("tanicare_session_user")?.value;
  let sessionUser = null;
  if (sessionCookie) {
    try {
      sessionUser = JSON.parse(sessionCookie);
    } catch {}
  }

  // Jika sudah login sebagai Admin via sesi aplikasi, izinkan akses /admin
  if (sessionUser && sessionUser.role === "ADMIN" && pathname.startsWith("/admin")) {
    return res;
  }

  // 2. Cek sesi Supabase Auth (jika kredensial tersedia)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll(list: Array<{ name: string; value: string; options?: any }>) {
            list.forEach(({ name, value }) => req.cookies.set(name, value));
            res = NextResponse.next({ request: req });
            list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
          },
        },
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) return res;
    } catch {}
  }

  if (!sessionUser && pathname.startsWith("/admin") && pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/login?role=admin", req.url));
  }

  return res;
}

export const config = { matcher: ["/admin/:path*"] };
