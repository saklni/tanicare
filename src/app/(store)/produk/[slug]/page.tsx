import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle, TriangleAlert, Store, ShieldCheck, MapPin, Phone } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import StockBadge from "@/components/StockBadge";
import AddToCart from "@/components/AddToCart";
import { getProduct, getSettings } from "@/lib/data";
import { idr, imageUrl } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await getProduct((await params).slug);
  if (!data) return { title: "Produk tidak ditemukan" };
  const img = imageUrl(data.image_path);
  return {
    title: data.name,
    description: data.description?.slice(0, 155) ?? `${data.name} — ${data.category}`,
    alternates: { canonical: `/produk/${data.slug}` },
    openGraph: { title: data.name, images: img ? [img] : [] },
  };
}

export default async function Page({ params }: Props) {
  const { data: p, error } = await getProduct((await params).slug);
  if (error)
    return (
      <div className="container-x py-16 text-center" role="alert">
        <p className="text-danger">Data produk gagal dimuat.</p>
      </div>
    );
  if (!p) notFound();

  const s = await getSettings();

  // 1. WhatsApp khusus SELLER pemilik produk ini
  const sellerStore = p.seller?.store;
  const sellerWaNumber = sellerStore?.whatsapp_number || p.seller?.phone || s.whatsapp_number;
  const sellerStoreName = sellerStore?.name || p.seller?.name || s.store_name;
  const sellerAddress = sellerStore?.address || "Indonesia";

  const askSeller = sellerWaNumber
    ? waLink(
        sellerWaNumber,
        `Halo ${sellerStoreName}, saya melihat produk "${p.name}" (${idr(p.price)}) di TaniCare dan ingin bertanya ketersediaan stok serta pemesanan.`
      )
    : null;

  // 2. WhatsApp khusus ADMIN (CS Pusat TaniCare)
  const askAdmin = s.whatsapp_number
    ? waLink(
        s.whatsapp_number,
        `Halo Admin TaniCare, saya ingin bertanya tentang produk "${p.name}" dari toko ${sellerStoreName}.`
      )
    : null;

  const Section = ({ t, children }: { t: string; children: React.ReactNode }) => (
    <section className="mt-6">
      <h2 className="text-xl font-bold text-ink-900">{t}</h2>
      <div className="mt-2 text-ink-700">{children}</div>
    </section>
  );

  return (
    <div className="container-x py-8 space-y-8">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-600">
        <Link href="/" className="hover:underline">Beranda</Link> /{" "}
        <Link href="/produk" className="hover:underline">Katalog</Link> /{" "}
        <span className="font-semibold text-ink-900">{p.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="card relative aspect-[4/3] overflow-hidden bg-white shadow-sm">
          <ProductImage src={imageUrl(p.image_path)} alt={p.name} priority sizes="(min-width:768px) 50vw, 100vw" />
        </div>

        <div className="space-y-4">
          <div>
            <span className="badge bg-green-100 text-green-800 font-semibold">{p.category}</span>
            <h1 className="mt-2 text-[26px] md:text-[36px] font-bold text-ink-900">{p.name}</h1>
            <p className="mt-2 text-3xl font-bold text-green-800">{idr(p.price)}</p>
            <div className="mt-2">
              <StockBadge stock={p.stock} />
            </div>
          </div>

          {/* Kotak Informasi Penjual (Seller) dengan nomor WhatsApp unik */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="text-blue-700" size={18} />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Dijual oleh Mitra Seller:</span>
              </div>
              <span className="rounded bg-blue-200 px-2 py-0.5 text-[11px] font-bold text-blue-900">SELLER VERIFIED</span>
            </div>
            <div>
              <p className="font-bold text-ink-900 text-base">{sellerStoreName}</p>
              <p className="flex items-center gap-1.5 text-xs text-ink-600 mt-0.5">
                <MapPin size={13} className="text-blue-700 shrink-0" /> {sellerAddress}
              </p>
              {sellerWaNumber && (
                <p className="flex items-center gap-1.5 text-xs text-ink-600 mt-0.5">
                  <Phone size={13} className="text-blue-700 shrink-0" /> WA Seller: +{sellerWaNumber}
                </p>
              )}
            </div>
          </div>

          {/* Keranjang & Tombol Pemesanan */}
          <div className="pt-2 space-y-3">
            <AddToCart product={p} withQty />

            {/* Tombol Pesan ke Seller */}
            {askSeller ? (
              <a
                href={askSeller}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa w-full !justify-center !py-3 text-sm shadow-sm"
              >
                <MessageCircle size={18} />
                Chat & Pesan ke Seller via WhatsApp (+{sellerWaNumber})
              </a>
            ) : (
              <p className="text-sm text-ink-600">WhatsApp penjual belum tersedia.</p>
            )}

            {/* Opsi Bantuan Admin CS */}
            {askAdmin && (
              <div className="flex items-center justify-between pt-2 border-t border-ink-500/10 text-xs text-ink-500">
                <span>Butuh bantuan platform?</span>
                <a
                  href={askAdmin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-green-800 hover:underline inline-flex items-center gap-1"
                >
                  <ShieldCheck size={14} /> Hubungi CS Admin (+{s.whatsapp_number})
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl border-t border-ink-500/15 pt-6">
        {p.description && (
          <Section t="Deskripsi">
            <p className="whitespace-pre-line leading-relaxed">{p.description}</p>
          </Section>
        )}
        {p.active_ingredient && (
          <Section t="Bahan aktif">
            <p className="font-medium text-ink-800">{p.active_ingredient}</p>
          </Section>
        )}
        {!!p.benefits?.length && (
          <Section t="Manfaat">
            <ul className="list-disc pl-5 space-y-1">
              {p.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </Section>
        )}
        {(p.usage_instructions || p.label_dosage) && (
          <Section t="Aturan penggunaan (sesuai label)">
            {p.usage_instructions && <p className="whitespace-pre-line">{p.usage_instructions}</p>}
            {p.label_dosage && (
              <p className="mt-2 whitespace-pre-line">
                <strong>Dosis label:</strong> {p.label_dosage}
              </p>
            )}
          </Section>
        )}
        {!!p.warnings?.length && (
          <section className="mt-6 rounded-xl border border-warning/30 bg-amber-50 p-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-warning">
              <TriangleAlert aria-hidden /> Peringatan
            </h2>
            <ul className="mt-2 list-disc pl-5 text-warning space-y-1">
              {p.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </section>
        )}
        {(p.manufacturer || p.registration_number) && (
          <Section t="Produsen & Registrasi">
            {p.manufacturer && <p>Produsen: {p.manufacturer}</p>}
            {p.registration_number && <p className="text-xs text-ink-500 mt-1">No. pendaftaran: {p.registration_number}</p>}
          </Section>
        )}
      </div>
    </div>
  );
}
