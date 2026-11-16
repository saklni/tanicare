import { prisma } from "./prisma";
import { publicClient } from "./supabase/public";
import type { Product, Settings } from "./types";

export async function getSettings(): Promise<Settings> {
  try {
    const s = await prisma.storeSettings.findFirst();
    if (s) {
      return {
        id: s.id,
        store_name: s.storeName,
        whatsapp_number: s.whatsappNumber,
        store_description: s.storeDescription,
        address: s.address,
      };
    }
  } catch {}

  const { data } = await publicClient().from("store_settings").select("*").limit(1).maybeSingle();
  return (data as Settings) ?? { id: "", store_name: "TaniCare", whatsapp_number: "", store_description: null, address: null };
}

export async function getProducts(): Promise<{ data: Product[]; error: boolean }> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        seller: {
          include: {
            store: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    if (products && products.length > 0) {
      return {
        data: products.map((p) => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          slug: p.slug,
          category: p.category,
          description: p.description,
          price: Number(p.price),
          stock: p.stock,
          image_path: p.imagePath,
          is_featured: p.isFeatured,
          is_active: p.isActive,
          active_ingredient: p.activeIngredient,
          benefits: p.benefits,
          usage_instructions: p.usageInstructions,
          label_dosage: p.labelDosage,
          warnings: p.warnings,
          manufacturer: p.manufacturer,
          registration_number: p.registrationNumber,
          seller_id: p.sellerId,
          seller: p.seller
            ? {
                id: p.seller.id,
                name: p.seller.name,
                phone: p.seller.phone,
                store: p.seller.store
                  ? {
                      id: p.seller.store.id,
                      name: p.seller.store.name,
                      whatsapp_number: p.seller.store.whatsappNumber,
                      address: p.seller.store.address,
                    }
                  : null,
              }
            : null,
        })),
        error: false,
      };
    }
  } catch {}

  const { data, error } = await publicClient().from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
  return { data: ((data ?? []) as Product[]).map((p) => ({ ...p, price: Number(p.price) })), error: !!error };
}

export async function getProduct(slug: string): Promise<{ data: Product | null; error: boolean }> {
  try {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: {
        seller: {
          include: {
            store: true,
          },
        },
      },
    });
    if (p && p.isActive) {
      return {
        data: {
          id: p.id,
          sku: p.sku,
          name: p.name,
          slug: p.slug,
          category: p.category,
          description: p.description,
          price: Number(p.price),
          stock: p.stock,
          image_path: p.imagePath,
          is_featured: p.isFeatured,
          is_active: p.isActive,
          active_ingredient: p.activeIngredient,
          benefits: p.benefits,
          usage_instructions: p.usageInstructions,
          label_dosage: p.labelDosage,
          warnings: p.warnings,
          manufacturer: p.manufacturer,
          registration_number: p.registrationNumber,
          seller_id: p.sellerId,
          seller: p.seller
            ? {
                id: p.seller.id,
                name: p.seller.name,
                phone: p.seller.phone,
                store: p.seller.store
                  ? {
                      id: p.seller.store.id,
                      name: p.seller.store.name,
                      whatsapp_number: p.seller.store.whatsappNumber,
                      address: p.seller.store.address,
                    }
                  : null,
              }
            : null,
        },
        error: false,
      };
    }
  } catch {}

  const { data, error } = await publicClient().from("products").select("*").eq("slug", slug).eq("is_active", true).maybeSingle();
  return { data: data ? { ...(data as Product), price: Number(data.price) } : null, error: !!error };
}
