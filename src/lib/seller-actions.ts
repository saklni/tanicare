"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { getSessionUser } from "./auth-session";
import { normalizePhone } from "./whatsapp";

export type SellerActionState = { error?: string; ok?: string } | undefined;

export async function updateSellerStoreAction(_: SellerActionState, fd: FormData): Promise<SellerActionState> {
  const session = await getSessionUser();
  if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
    return { error: "Akses ditolak. Silakan login sebagai Seller." };
  }

  const storeName = String(fd.get("store_name") ?? "").trim();
  const rawWa = String(fd.get("whatsapp_number") ?? "").trim();
  const address = String(fd.get("address") ?? "").trim();
  const description = String(fd.get("description") ?? "").trim();

  if (!storeName) return { error: "Nama toko wajib diisi." };

  const wa = rawWa ? normalizePhone(rawWa) : null;
  if (rawWa && !wa) {
    return { error: "Nomor WhatsApp tidak valid. Format: 08xxxxxxxxxx atau 62xxxxxxxxxx." };
  }

  try {
    const existingStore = await prisma.store.findFirst({
      where: { sellerId: session.id },
    });

    if (existingStore) {
      await prisma.store.update({
        where: { id: existingStore.id },
        data: {
          name: storeName,
          whatsappNumber: wa || existingStore.whatsappNumber,
          address: address || existingStore.address,
          description: description || existingStore.description,
        },
      });
    } else {
      await prisma.store.create({
        data: {
          sellerId: session.id,
          name: storeName,
          whatsappNumber: wa || "",
          address,
          description,
        },
      });
    }

    if (wa) {
      await prisma.user.update({
        where: { id: session.id },
        data: { phone: wa },
      });
    }

    revalidatePath("/", "layout");
    revalidatePath("/seller");
    return { ok: "Pengaturan toko dan nomor WhatsApp berhasil disimpan!" };
  } catch (err: any) {
    return { error: "Gagal menyimpan pengaturan: " + (err?.message ?? "Kesalahan server") };
  }
}

