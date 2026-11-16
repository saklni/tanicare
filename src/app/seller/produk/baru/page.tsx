import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SellerProductForm from "@/components/seller/SellerProductForm";
import { getSessionUser } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Tambah Produk Toko - Dashboard Seller TaniCare",
};

export default async function TambahProdukSellerPage() {
  const session = await getSessionUser();
  if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
    redirect("/login?role=seller");
  }

  return (
    <div className="py-2">
      <SellerProductForm />
    </div>
  );
}

