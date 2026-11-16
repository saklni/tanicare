export const idr = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
export const formatRupiah = idr;
export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
export const imageUrl = (path: string | null) =>
  path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}` : null;
export const fmtSize = (b: number) => (b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.ceil(b / 1024) + " KB");
