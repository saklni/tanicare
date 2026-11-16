import Link from "next/link";
import {
  ShieldCheck,
  Leaf,
  Store,
  Sparkles,
  ArrowRight,
  Truck,
  CheckCircle2,
  Package,
  MapPin,
  TrendingUp,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getProducts, getSettings } from "@/lib/data";
import { CATEGORIES } from "@/lib/types";

const categoryMeta: Record<string, { desc: string; icon: string; bg: string; text: string }> = {
  Herbisida: {
    desc: "Basmi gulma & rumput liar tuntas hingga ke akar",
    icon: "🌿",
    bg: "bg-emerald-50 border-emerald-200 hover:border-emerald-500",
    text: "text-emerald-900",
  },
  Fungisida: {
    desc: "Cegah bercak daun, busuk batang, & serangan jamur",
    icon: "🛡️",
    bg: "bg-blue-50 border-blue-200 hover:border-blue-500",
    text: "text-blue-900",
  },
  Insektisida: {
    desc: "Kendalikan hama ulat, wereng, kutu daun, & thrips",
    icon: "🐛",
    bg: "bg-amber-50 border-amber-200 hover:border-amber-500",
    text: "text-amber-900",
  },
  Pupuk: {
    desc: "Pupuk NPK seimbang, nutrisi buah lebat & daun subur",
    icon: "🌱",
    bg: "bg-lime-50 border-lime-200 hover:border-lime-500",
    text: "text-lime-900",
  },
  Bakterisida: {
    desc: "Lindungi tanaman dari bahaya penyakit layu bakteri",
    icon: "🔬",
    bg: "bg-purple-50 border-purple-200 hover:border-purple-500",
    text: "text-purple-900",
  },
};

export default async function Home() {
  const [{ data, error }, s] = await Promise.all([getProducts(), getSettings()]);
  const featured = data.filter((p) => p.is_featured).slice(0, 8);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-950 via-green-900 to-green-900 text-white">
        {/* Dekorasi Latar Belakang */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-green-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        <div className="container-x relative py-16 md:py-24">
          <div className="max-w-3xl space-y-6">
            {/* Badge Highlight */}
            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-800/60 px-3.5 py-1 text-xs font-semibold text-green-200 backdrop-blur-sm">
              <Sparkles size={14} className="text-yellow-400" />
              <span>Platform Sarana Pertanian & Mitra Toko Tani Terpercaya</span>
            </div>

            <h1 className="text-[32px] leading-tight font-extrabold tracking-tight md:text-[54px] text-white">
              Penuhi Kebutuhan Pupuk, Benih & Obat Pertanian Terbaik
            </h1>

            <p className="max-w-2xl text-base md:text-lg leading-relaxed text-green-100">
              Jelajahi katalog herbisida, insektisida, dan nutrisi tanaman resmi dari mitra toko terpercaya. Informasi
              transparan langsung sesuai label kemasan dengan kemudahan pemesanan langsung ke penjual.
            </p>

            {/* Tombol Aksi Hero */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/produk"
                className="btn bg-white text-green-900 hover:bg-green-100 font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm"
              >
                <span>Lihat Semua Produk</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/register?role=seller"
                className="btn border border-green-400/40 bg-white/10 text-white hover:bg-white/20 font-semibold px-5 py-3 rounded-xl backdrop-blur-sm transition flex items-center gap-2 text-sm"
              >
                <Store size={16} />
                <span>Daftar Jadi Mitra Seller</span>
              </Link>
            </div>

            {/* Trust Highlights Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/15 text-xs text-green-200">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-400 shrink-0" />
                <span>100% Produk Asli & Terdaftar</span>
              </div>
              <div className="flex items-center gap-2">
                <Store size={18} className="text-green-400 shrink-0" />
                <span>Mitra Toko Terverifikasi</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-green-400 shrink-0" />
                <span>Pengiriman Aman ke Petani</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                <span>Dosis & Label Transparan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KATEGORI PRODUK PILIHAN */}
      <section className="container-x">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
          <div>
            <div className="flex items-center gap-2 text-green-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Package size={14} />
              <span>Kategori Pilihan</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-ink-900">Jelajahi Berdasarkan Kebutuhan</h2>
          </div>
          <Link
            href="/produk"
            className="text-xs font-bold text-green-800 hover:underline flex items-center gap-1 group"
          >
            Lihat Semua Kategori <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((c) => {
            const meta = categoryMeta[c] || {
              desc: "Katalog produk pertanian",
              icon: "🌱",
              bg: "bg-green-50 border-green-200 hover:border-green-500",
              text: "text-green-900",
            };
            return (
              <Link
                key={c}
                href={`/produk?kategori=${encodeURIComponent(c)}`}
                className={`group card p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between ${meta.bg}`}
              >
                <div>
                  <span className="text-3xl mb-3 block transform group-hover:scale-110 transition duration-200">
                    {meta.icon}
                  </span>
                  <h3 className={`font-bold text-lg ${meta.text}`}>{c}</h3>
                  <p className="mt-1.5 text-xs text-ink-600 leading-relaxed">{meta.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-ink-500/10 flex items-center justify-between text-xs font-semibold text-green-800">
                  <span>Lihat Produk</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. PRODUK UNGGULAN */}
      <section className="bg-cream-50 py-12 border-y border-ink-500/10">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <div className="flex items-center gap-2 text-green-800 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles size={14} className="text-yellow-600" />
                <span>Paling Banyak Dicari</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-ink-900">Produk Unggulan Pilihan Petani</h2>
              <p className="text-sm text-ink-600 mt-1">
                Herbisida, fungisida, dan nutrisi berkualitas tinggi yang direkomendasikan untuk hasil panen optimal.
              </p>
            </div>
            <Link
              href="/produk"
              className="btn-secondary !bg-white text-xs font-bold shrink-0 self-start md:self-end flex items-center gap-1.5"
            >
              <span>Katalog Lengkap ({data.length} Produk)</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-danger">
              <p className="font-semibold">Data produk gagal dimuat.</p>
              <Link className="btn-secondary mt-3 inline-block" href="/">
                Coba Muat Ulang
              </Link>
            </div>
          ) : featured.length === 0 ? (
            <div className="card p-10 text-center bg-white">
              <Package size={40} className="mx-auto text-ink-400 mb-2" />
              <p className="text-ink-700 font-semibold">Belum ada produk unggulan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. KEUNGGULAN BELANJA DI TANICARE */}
      <section className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-green-800 bg-green-100 rounded-full px-3 py-1">
            Kenapa Memilih TaniCare?
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink-900">Kemudahan & Keamanan untuk Petani</h2>
          <p className="text-sm text-ink-600 leading-relaxed">
            Kami menghadirkan platform yang transparan, mudah diakses, dan langsung menghubungkan petani ke penjual resmi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 bg-white rounded-2xl hover:shadow-md transition space-y-3 border-t-4 border-t-green-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-800">
              <Leaf size={24} />
            </div>
            <h3 className="text-lg font-bold text-ink-900">Informasi Sesuai Label Resmi</h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              Dosis, bahan aktif, petunjuk pakai, dan nomor pendaftaran Kementan dicantumkan secara akurat agar petani
              mengaplikasikan dosis yang tepat.
            </p>
          </div>

          <div className="card p-6 bg-white rounded-2xl hover:shadow-md transition space-y-3 border-t-4 border-t-blue-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
              <Store size={24} />
            </div>
            <h3 className="text-lg font-bold text-ink-900">Multi-Seller Terverifikasi</h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              Bermitra dengan toko pertanian resmi di berbagai wilayah. Setiap toko memiliki stok asli dan nomor kontak
              khusus untuk melayani Anda.
            </p>
          </div>

          <div className="card p-6 bg-white rounded-2xl hover:shadow-md transition space-y-3 border-t-4 border-t-emerald-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-ink-900">Stok Asli & Konfirmasi Cepat</h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              Harga dan ketersediaan selalu diperbarui secara berkala oleh pemilik toko sehingga transaksi berjalan lancar
              dan terpercaya.
            </p>
          </div>
        </div>
      </section>

      {/* 5. BANNER AJAKAN UNTUK TOKO PERTANIAN (SELLER) */}
      <section className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 text-white p-8 md:p-12 shadow-md">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-green-200">
              <TrendingUp size={14} className="text-green-300" />
              Untuk Pemilik Toko Pertanian
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Punya Toko Pertanian? Buka Cabang Digital di TaniCare
            </h2>
            <p className="text-sm md:text-base text-green-100 leading-relaxed">
              Daftarkan produk Anda, atur stok dengan mudah, dan terima pemesanan langsung dari petani di daerah Anda
              melalui kontak toko Anda sendiri.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/register?role=seller"
                className="btn bg-white text-green-900 hover:bg-green-100 font-bold px-6 py-2.5 rounded-xl shadow text-sm"
              >
                Daftar Sebagai Seller Sekarang
              </Link>
              <Link
                href="/seller"
                className="btn border border-white/30 text-white hover:bg-white/10 font-semibold px-5 py-2.5 rounded-xl text-sm"
              >
                Lihat Demo Portal Seller
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
