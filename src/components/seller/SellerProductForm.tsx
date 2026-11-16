"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, Image as ImageIcon, Check } from "lucide-react";
import { saveSellerProductAction } from "@/lib/seller-actions";
import { CATEGORIES } from "@/lib/types";

type ProductData = {
  id?: string;
  name?: string;
  slug?: string;
  category?: string;
  price?: number;
  stock?: number;
  sku?: string | null;
  description?: string | null;
  activeIngredient?: string | null;
  benefits?: string[] | null;
  usageInstructions?: string | null;
  labelDosage?: string | null;
  warnings?: string[] | null;
  manufacturer?: string | null;
  registrationNumber?: string | null;
  imagePath?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
};

const TEMPLATE_IMAGES = [
  { label: "Roundup 486 SL", path: "/images/products/roundup.svg" },
  { label: "Gramoxone 276 SL", path: "/images/products/gramoxone.svg" },
  { label: "Antracol 70 WP", path: "/images/products/antracol.svg" },
  { label: "Score 250 EC", path: "/images/products/score.svg" },
  { label: "Decis 25 EC", path: "/images/products/decis.svg" },
  { label: "Curacron 500 EC", path: "/images/products/curacron.svg" },
  { label: "NPK Mutiara 16-16-16", path: "/images/products/npk-mutiara.svg" },
  { label: "MKP Pak Tani", path: "/images/products/mkp-pak-tani.svg" },
  { label: "Bactocyn 150 AL", path: "/images/products/bactocyn.svg" },
];

export default function SellerProductForm({ product }: { product?: ProductData }) {
  const [state, formAction, isPending] = useActionState(saveSellerProductAction, undefined);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    product?.imagePath && product.imagePath.startsWith("/images/products/")
      ? product.imagePath
      : TEMPLATE_IMAGES[0].path
  );
  const [customUrl, setCustomUrl] = useState(
    product?.imagePath && !product.imagePath.startsWith("/images/products/") ? product.imagePath : ""
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/seller"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-600 hover:text-green-800 transition"
        >
          <ArrowLeft size={16} /> Kembali ke Dashboard Seller
        </Link>
      </div>

      <form action={formAction} className="card bg-white p-6 md:p-8 space-y-6 shadow-sm border border-ink-500/10">
        <div className="border-b border-ink-500/10 pb-4">
          <h1 className="text-2xl font-bold text-ink-900">
            {product?.id ? "Edit Produk Toko" : "Tambah Produk Baru Toko"}
          </h1>
          <p className="text-xs text-ink-600 mt-1">
            Produk ini akan otomatis terdaftar dengan nama toko Anda dan pembeli dapat langsung memesan ke nomor WhatsApp toko Anda.
          </p>
        </div>

        {product?.id && <input type="hidden" name="id" value={product.id} />}

        {state?.error && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-danger" role="alert">
            {state.error}
          </div>
        )}

        {/* Informasi Utama */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600" /> Informasi Dasar Produk
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="name">
                Nama Produk <span className="text-danger">*</span>
              </label>
              <input
                id="name"
                name="name"
                required
                minLength={3}
                defaultValue={product?.name ?? ""}
                placeholder="Contoh: Herbisida Noxone 276 SL (1 Liter)"
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="category">
                Kategori <span className="text-danger">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue={product?.category ?? CATEGORIES[0]}
                className="input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="price">
                Harga Jual Satuan (Rp) <span className="text-danger">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                step={500}
                required
                defaultValue={product?.price ?? 85000}
                placeholder="Contoh: 85000"
                className="input font-semibold"
              />
            </div>

            <div>
              <label className="label" htmlFor="stock">
                Jumlah Stok Tersedia <span className="text-danger">*</span>
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min={0}
                step={1}
                required
                defaultValue={product?.stock ?? 25}
                placeholder="Contoh: 50"
                className="input font-semibold"
              />
            </div>

            <div>
              <label className="label" htmlFor="sku">
                Kode SKU / Kode Barang (Opsional)
              </label>
              <input
                id="sku"
                name="sku"
                defaultValue={product?.sku ?? ""}
                placeholder="Contoh: PROD-TNI-001"
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="slug">
                Custom URL Slug (Opsional)
              </label>
              <input
                id="slug"
                name="slug"
                defaultValue={product?.slug ?? ""}
                placeholder="Kosongkan untuk otomatis dibuatkan"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Pemilihan Gambar Produk */}
        <div className="space-y-4 pt-4 border-t border-ink-500/10">
          <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
            <ImageIcon size={18} className="text-green-600" /> Gambar / Ilustrasi Kemasan Produk
          </h2>

          <div className="space-y-3">
            <p className="text-xs text-ink-600">
              Pilih salah satu template visual kemasan berkualitas tinggi di bawah ini, atau unggah foto asli produk Anda:
            </p>

            {/* Template Selection Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {TEMPLATE_IMAGES.map((t) => {
                const isSelected = selectedTemplate === t.path;
                return (
                  <button
                    key={t.path}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(t.path);
                      setCustomUrl("");
                    }}
                    className={`relative aspect-[4/3] rounded-lg border-2 p-1 text-center transition flex flex-col items-center justify-center bg-cream-50 ${
                      isSelected ? "border-green-600 shadow-md ring-2 ring-green-600/30" : "border-ink-500/20 hover:border-ink-500/50"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.path} alt={t.label} className="w-full h-full object-contain" />
                    {isSelected && (
                      <span className="absolute top-1 right-1 bg-green-700 text-white rounded-full p-0.5">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="image_template" value={selectedTemplate} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="label" htmlFor="image">
                  Atau Upload File Foto Sendiri (JPG, PNG, WebP)
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="input file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-100 file:text-green-800 hover:file:bg-green-200 cursor-pointer"
                />
              </div>
              <div>
                <label className="label" htmlFor="image_url">
                  Atau Masukkan URL Gambar Langsung
                </label>
                <input
                  id="image_url"
                  name="image_url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://... atau /images/products/..."
                  className="input text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detail Produk & Label Pertanian */}
        <div className="space-y-4 pt-4 border-t border-ink-500/10">
          <h2 className="text-base font-bold text-ink-900">Deskripsi &amp; Informasi Pertanian</h2>

          <div>
            <label className="label" htmlFor="description">
              Deskripsi Produk
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={product?.description ?? ""}
              placeholder="Jelaskan fungsi, keunggulan, dan cara kerja produk secara umum..."
              className="input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="active_ingredient">
                Bahan Aktif / Kandungan
              </label>
              <input
                id="active_ingredient"
                name="active_ingredient"
                defaultValue={product?.activeIngredient ?? ""}
                placeholder="Contoh: Parakuat Diklorida 276 g/l"
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="manufacturer">
                Produsen / Distributor
              </label>
              <input
                id="manufacturer"
                name="manufacturer"
                defaultValue={product?.manufacturer ?? ""}
                placeholder="Contoh: PT Syngenta Indonesia"
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="label_dosage">
                Dosis Pemakaian (Sesuai Label)
              </label>
              <input
                id="label_dosage"
                name="label_dosage"
                defaultValue={product?.labelDosage ?? ""}
                placeholder="Contoh: 1.5 - 2 Liter / Hektar"
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="registration_number">
                Nomor Pendaftaran Kementan (Opsional)
              </label>
              <input
                id="registration_number"
                name="registration_number"
                defaultValue={product?.registrationNumber ?? ""}
                placeholder="Contoh: RI. 0102011974112"
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="usage_instructions">
              Petunjuk Penggunaan &amp; Pencampuran
            </label>
            <textarea
              id="usage_instructions"
              name="usage_instructions"
              rows={2}
              defaultValue={product?.usageInstructions ?? ""}
              placeholder="Contoh: Larutkan 80-100 ml per tangki 15 liter air bersih..."
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="benefits">
              Keunggulan / Manfaat Utama (Satu per baris)
            </label>
            <textarea
              id="benefits"
              name="benefits"
              rows={3}
              defaultValue={product?.benefits?.join("\n") ?? ""}
              placeholder={"Reaksi cepat membasmi gulma\nTahan hujan 1-2 jam\nAman untuk olah tanah"}
              className="input"
            />
          </div>
        </div>

        {/* Status Produk */}
        <div className="pt-4 border-t border-ink-500/10 flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-ink-900">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={product?.isActive ?? true}
              className="w-5 h-5 rounded text-green-700 focus:ring-green-700"
            />
            Aktif (Tampilkan di Katalog Pasar)
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-ink-900">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={product?.isFeatured ?? false}
              className="w-5 h-5 rounded text-amber-600 focus:ring-amber-600"
            />
            Tandai sebagai Produk Unggulan Toko
          </label>
        </div>

        {/* Tombol Simpan */}
        <div className="pt-4 border-t border-ink-500/10 flex items-center justify-end gap-3">
          <Link href="/seller" className="btn-ghost">
            Batal
          </Link>
          <button type="submit" disabled={isPending} className="btn-primary !px-6">
            <Save size={16} />
            {isPending ? "Menyimpan Produk..." : product?.id ? "Perbarui Produk" : "Tambah Produk ke Toko"}
          </button>
        </div>
      </form>
    </div>
  );
}

