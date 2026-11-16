"use server";
import { prisma } from "./prisma";

export type CartProductDetail = {
  id: string;
  price: number;
  stock: number;
  isActive: boolean;
  sellerId: string | null;
  sellerName: string | null;
  sellerStoreName: string | null;
  sellerWa: string | null;
};

export async function fetchCartProductsDetails(ids: string[]): Promise<Record<string, CartProductDetail>> {
  if (!ids.length) return {};
  try {
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      include: {
        seller: {
          include: {
            store: true,
          },
        },
      },
    });

    const result: Record<string, CartProductDetail> = {};
    for (const p of products) {
      result[p.id] = {
        id: p.id,
        price: Number(p.price),
        stock: p.stock,
        isActive: p.isActive,
        sellerId: p.sellerId,
        sellerName: p.seller?.name ?? null,
        sellerStoreName: p.seller?.store?.name ?? p.seller?.name ?? null,
        sellerWa: p.seller?.store?.whatsappNumber ?? p.seller?.phone ?? null,
      };
    }
    return result;
  } catch {
    return {};
  }
}

