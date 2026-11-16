import Link from "next/link";
import { Sprout, Phone, MapPin, Store, ShieldCheck, Mail, ArrowUpRight } from "lucide-react";
import CartProvider from "@/components/CartProvider";
import Navbar from "@/components/Navbar";
import { getSettings } from "@/lib/data";
import { waLink } from "@/lib/whatsapp";
import { getSessionUser } from "@/lib/auth-session";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const user = await getSessionUser();
  const wa = waLink(s.whatsapp_number, `Halo CS ${s.store_name}, saya ingin berkonsultasi mengenai produk pertanian.`);

  return (
    <CartProvider>
      {/* Navbar modern tanpa tombol WhatsApp dan tanpa banner atas */}
      <Navbar storeName={s.store_name} user={user} />

      <main id="main" className="min-h-[70vh]">
        {children}
      </main>

      {/* Footer Modern & Informatif */}
      <footer className="mt-20 border-t border-ink-500/15 bg-green-900 text-green-100">
        <div className="container-x py-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Kolom 1: Brand Info */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700 text-white shadow-sm">
                  <Sprout size={20} />
                </span>
                {s.store_name}
              </Link>
              <p className="text-sm leading-relaxed text-green-200">
                {s.store_description ||
                  "Platform marketplace sarana pertanian terpercaya yang menghubungkan petani dengan toko pertanian resmi dan bersertifikat di seluruh Indonesia."}
              </p>
              <div className="flex items-center gap-2 text-xs text-green-300">
                <ShieldCheck size={16} className="text-green-400" />
                <span>100% Produk Original & Terdaftar Kementan</span>
              </div>
            </div>

            {/* Kolom 2: Navigasi Cepat */}
            <div className="space-y-3 text-sm">
              <p className="font-display font-bold text-white text-base">Menu Navigasi</p>
              <ul className="space-y-2 text-green-200">
                <li>
                  <Link href="/" className="hover:text-white transition">Beranda</Link>
                </li>
                <li>
                  <Link href="/produk" className="hover:text-white transition">Katalog Semua Produk</Link>
                </li>
                <li>
                  <Link href="/produk?kategori=Herbisida" className="hover:text-white transition">Herbisida & Pembasmi Gulma</Link>
                </li>
                <li>
                  <Link href="/produk?kategori=Pupuk" className="hover:text-white transition">Pupuk Majemuk & Nutrisi</Link>
                </li>
                <li>
                  <Link href="/produk?kategori=Insektisida" className="hover:text-white transition">Insektisida Hama</Link>
                </li>
                <li>
                  <Link href="/bantuan" className="hover:text-white transition">Panduan Pemesanan</Link>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Layanan Pengguna & Mitra */}
            <div className="space-y-3 text-sm">
              <p className="font-display font-bold text-white text-base">Portal Pengguna</p>
              <ul className="space-y-2 text-green-200">
                <li>
                  <Link href="/buyer" className="hover:text-white transition flex items-center gap-1">
                    Area Petani (Buyer) <ArrowUpRight size={14} />
                  </Link>
                </li>
                <li>
                  <Link href="/seller" className="hover:text-white transition flex items-center gap-1">
                    Portal Mitra Toko (Seller) <ArrowUpRight size={14} />
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition">Daftar Akun Baru</Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition">Masuk ke Akun</Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white transition">Login Admin</Link>
                </li>
              </ul>
            </div>

            {/* Kolom 4: Kontak & Alamat Kantor */}
            <div className="space-y-3 text-sm">
              <p className="font-display font-bold text-white text-base">Kontak & Lokasi</p>
              <div className="space-y-2.5 text-green-200">
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="text-green-400 shrink-0 mt-0.5" />
                  <span>{s.address || "Jl. Agrikultur Subur No. 88, Jawa Timur, Indonesia"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-green-400 shrink-0" />
                  <span>CS Pusat: +{s.whatsapp_number || "6281234567890"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-green-400 shrink-0" />
                  <span>support@tanicare.id</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-green-300 gap-4">
            <p>© {new Date().getFullYear()} {s.store_name} Indonesia. Hak Cipta Dilindungi.</p>
            <p className="text-green-400 text-center md:text-right">
              Pemberdayaan Digital Toko Pertanian & Petani Indonesia
            </p>
          </div>
        </div>
      </footer>
    </CartProvider>
  );
}
