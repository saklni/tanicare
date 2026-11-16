import { notFound } from "next/navigation";
import { requireAdmin } from "@/app/admin/auth";
import ProductForm from "@/components/admin/ProductForm";
import type { Product } from "@/lib/types";
export const metadata = { title: "Edit Produk" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("products").select("*").eq("id", (await params).id).maybeSingle();
  if (!data) notFound();
  return <div><h1 className="mb-5 text-[28px]">Edit Produk</h1><ProductForm product={{ ...(data as Product), price: Number(data.price) }} /></div>;
}
