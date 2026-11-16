import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await getProducts();
  return [{ url: site }, { url: `${site}/produk` }, ...data.map((p) => ({ url: `${site}/produk/${p.slug}` }))];
}
