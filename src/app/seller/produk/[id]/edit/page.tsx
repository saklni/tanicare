import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import SellerProductForm from "@/components/seller/SellerProductForm";
import { getSessionUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Edit Produk Toko - Dashboard Seller TaniCare",
};

export default async function EditProdukSellerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSessionUser();
  if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
    redirect("/login?role=seller");
  }

  const { id } = await params;
  const p = await prisma.product.findUnique({
    where: { id },
  });

  if (!p) notFound();

  // Pastikan produk milik seller ini (kecuali ADMIN)
  if (session.role !== "ADMIN" && p.sellerId !== session.id) {
    redirect("/seller");
  }

  const formattedProduct = {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: Number(p.price),
    stock: p.stock,
    sku: p.sku,
    description: p.description,
    activeIngredient: p.activeIngredient,
    benefits: p.benefits,
    usageInstructions: p.usageInstructions,
    labelDosage: p.labelDosage,
    warnings: p.warnings,
    manufacturer: p.manufacturer,
    registrationNumber: p.registrationNumber,
    imagePath: p.imagePath,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
  };

  return (
    <div className="py-2">
      <SellerProductForm product={formattedProduct} />
    </div>
  );
}
