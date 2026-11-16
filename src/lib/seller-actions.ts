"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { getSessionUser } from "./auth-session";
import { normalizePhone } from "./whatsapp";
import { slugify } from "./format";
import { createClient as createSupabaseServerClient } from "./supabase/server";

export type SellerActionState = { error?: string; ok?: string } | undefined;

/**
 * 1. Update Pengaturan Toko & Nomor WhatsApp Seller
 */
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

/**
 * 2. Simpan atau Tambah Produk Baru oleh Seller
 */
export async function saveSellerProductAction(_: SellerActionState, fd: FormData): Promise<SellerActionState> {
  const session = await getSessionUser();
  if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
    return { error: "Akses ditolak. Silakan login sebagai Seller terlebih dahulu." };
  }

  const id = fd.get("id") ? String(fd.get("id")).trim() : null;
  const name = String(fd.get("name") ?? "").trim();
  const category = String(fd.get("category") ?? "").trim();
  const price = Number(fd.get("price") ?? 0);
  const stock = Number(fd.get("stock") ?? 0);
  const rawSlug = String(fd.get("slug") || name).trim();
  const slug = slugify(rawSlug);
  const sku = fd.get("sku") ? String(fd.get("sku")).trim() : null;
  const description = fd.get("description") ? String(fd.get("description")).trim() : null;
  const activeIngredient = fd.get("active_ingredient") ? String(fd.get("active_ingredient")).trim() : null;
  const usageInstructions = fd.get("usage_instructions") ? String(fd.get("usage_instructions")).trim() : null;
  const labelDosage = fd.get("label_dosage") ? String(fd.get("label_dosage")).trim() : null;
  const manufacturer = fd.get("manufacturer") ? String(fd.get("manufacturer")).trim() : null;
  const registrationNumber = fd.get("registration_number") ? String(fd.get("registration_number")).trim() : null;

  const benefits = String(fd.get("benefits") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const warnings = String(fd.get("warnings") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const isActive = fd.get("is_active") === "on" || fd.get("is_active") === "true";
  const isFeatured = fd.get("is_featured") === "on" || fd.get("is_featured") === "true";

  // Validasi Dasar
  if (!name || name.length < 3) return { error: "Nama produk minimal 3 karakter." };
  if (!category) return { error: "Kategori produk wajib dipilih." };
  if (isNaN(price) || price < 0) return { error: "Harga produk tidak valid." };
  if (isNaN(stock) || stock < 0) return { error: "Stok produk tidak valid." };

  // Penanganan Gambar
  let imagePath: string | null = null;
  const templateImage = fd.get("image_template") ? String(fd.get("image_template")).trim() : null;
  const directImageUrl = fd.get("image_url") ? String(fd.get("image_url")).trim() : null;
  const file = fd.get("image") as File | null;

  if (file && file.size > 0) {
    try {
      const supabase = await createSupabaseServerClient();
      const ext = file.type.split("/")[1] || "jpg";
      const newFileName = `seller-${session.id}-${Date.now()}.${ext}`;
      const up = await supabase.storage.from("product-images").upload(newFileName, file, { contentType: file.type });
      if (!up.error) {
        imagePath = newFileName;
      }
    } catch {}
  }

  if (!imagePath && directImageUrl) {
    imagePath = directImageUrl;
  } else if (!imagePath && templateImage) {
    imagePath = templateImage;
  }

  try {
    if (id) {
      // Pastikan produk milik seller ini
      const existing = await prisma.product.findUnique({ where: { id } });
      if (!existing) return { error: "Produk tidak ditemukan." };
      if (session.role !== "ADMIN" && existing.sellerId !== session.id) {
        return { error: "Anda tidak berhak mengubah produk milik seller lain." };
      }

      await prisma.product.update({
        where: { id },
        data: {
          name,
          slug,
          category,
          price,
          stock,
          sku: sku || existing.sku,
          description,
          activeIngredient,
          usageInstructions,
          labelDosage,
          manufacturer,
          registrationNumber,
          benefits,
          warnings,
          isActive,
          isFeatured,
          imagePath: imagePath ?? existing.imagePath,
        },
      });
    } else {
      // Pastikan slug unik
      let uniqueSlug = slug;
      const count = await prisma.product.count({ where: { slug: uniqueSlug } });
      if (count > 0) {
        uniqueSlug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      await prisma.product.create({
        data: {
          name,
          slug: uniqueSlug,
          category,
          price,
          stock,
          sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
          description,
          activeIngredient,
          usageInstructions,
          labelDosage,
          manufacturer,
          registrationNumber,
          benefits,
          warnings,
          isActive,
          isFeatured,
          imagePath: imagePath || "/images/products/roundup.svg",
          sellerId: session.id, // Mengaitkan otomatis ke Seller yang sedang login
        },
      });
    }

    revalidatePath("/", "layout");
    revalidatePath("/seller");
    revalidatePath("/produk");
  } catch (err: any) {
    return { error: "Gagal menyimpan produk: " + (err?.message ?? "Terjadi kesalahan") };
  }

  redirect("/seller?sukses=1");
}

/**
 * 3. Hapus Produk Milik Seller
 */
export async function deleteSellerProductAction(productId: string) {
  const session = await getSessionUser();
  if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
    throw new Error("Akses ditolak.");
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return;
  if (session.role !== "ADMIN" && product.sellerId !== session.id) {
    throw new Error("Anda tidak memiliki izin menghapus produk ini.");
  }

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/", "layout");
  revalidatePath("/seller");
  revalidatePath("/produk");
}

/**
 * 4. Toggle Status Aktif / Nonaktif Produk Seller
 */
export async function toggleSellerProductAction(productId: string, currentStatus: boolean) {
  const session = await getSessionUser();
  if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
    throw new Error("Akses ditolak.");
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return;
  if (session.role !== "ADMIN" && product.sellerId !== session.id) {
    throw new Error("Akses ditolak.");
  }

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: !currentStatus },
  });

  revalidatePath("/", "layout");
  revalidatePath("/seller");
  revalidatePath("/produk");
}
