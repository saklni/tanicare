"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "./auth";
import { normalizePhone } from "@/lib/whatsapp";
import { slugify } from "@/lib/format";
import { clearSessionUser } from "@/lib/auth-session";

export type State = { error?: string; ok?: string; fields?: Record<string, string> } | undefined;
const refresh = () => revalidatePath("/", "layout");

export async function login(_: State, fd: FormData): Promise<State> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: String(fd.get("email") ?? ""), password: String(fd.get("password") ?? "") });
  if (error) return { error: "Email atau password salah." };
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase.from("admins").select("user_id").eq("user_id", user!.id).maybeSingle();
  if (!data) { await supabase.auth.signOut(); return { error: "Akun ini tidak memiliki akses admin." }; }
  redirect("/admin");
}
export async function logout() {
  const s = await createClient();
  await s.auth.signOut();
  await clearSessionUser();
  redirect("/login");
}

const lines = (v: FormDataEntryValue | null) => String(v ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
const opt = (v: FormDataEntryValue | null) => (String(v ?? "").trim() || null);
const schema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter."),
  slug: z.string().trim().min(1, "Slug wajib diisi."),
  category: z.string().trim().min(1, "Kategori wajib diisi."),
  price: z.coerce.number({ invalid_type_error: "Harga tidak valid." }).min(0, "Harga tidak boleh negatif."),
  stock: z.coerce.number().int("Stok harus bilangan bulat.").min(0, "Stok tidak boleh negatif."),
});
const MIME: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX = 5 * 1024 * 1024;

export async function saveProduct(_: State, fd: FormData): Promise<State> {
  const { supabase } = await requireAdmin();
  const id = opt(fd.get("id"));
  const parsed = schema.safeParse({ name: fd.get("name"), slug: slugify(String(fd.get("slug") || fd.get("name") || "")), category: fd.get("category"), price: fd.get("price"), stock: fd.get("stock") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Gambar: validasi di server (MIME + ukuran). Gambar lama baru dihapus setelah DB berhasil diperbarui.
  const file = fd.get("image") as File | null;
  let newPath: string | null = null;
  let oldPath: string | null = null;
  if (id) oldPath = (await supabase.from("products").select("image_path").eq("id", id).maybeSingle()).data?.image_path ?? null;
  if (file && file.size > 0) {
    if (!MIME[file.type]) return { error: "Format gambar tidak didukung." };
    if (file.size > MAX) return { error: "Ukuran gambar melebihi batas." };
    newPath = `${crypto.randomUUID()}.${MIME[file.type]}`;
    const up = await supabase.storage.from("product-images").upload(newPath, file, { contentType: file.type });
    if (up.error) return { error: "Upload gambar gagal. Gambar lama dipertahankan." };
  }
  const removing = fd.get("remove_image") === "1" && !newPath;
  const row = {
    ...parsed.data, sku: opt(fd.get("sku")), description: opt(fd.get("description")),
    is_featured: fd.get("is_featured") === "on", is_active: fd.get("is_active") === "on",
    active_ingredient: opt(fd.get("active_ingredient")), benefits: lines(fd.get("benefits")), warnings: lines(fd.get("warnings")),
    usage_instructions: opt(fd.get("usage_instructions")), label_dosage: opt(fd.get("label_dosage")),
    manufacturer: opt(fd.get("manufacturer")), registration_number: opt(fd.get("registration_number")),
    ...(newPath ? { image_path: newPath } : removing ? { image_path: null } : {}),
  };
  const { error } = id ? await supabase.from("products").update(row).eq("id", id) : await supabase.from("products").insert(row);
  if (error) {
    if (newPath) await supabase.storage.from("product-images").remove([newPath]);
    return { error: error.code === "23505" ? "Slug atau SKU sudah dipakai produk lain." : "Perubahan belum tersimpan. Periksa koneksi lalu coba lagi." };
  }
  if (oldPath && (newPath || removing)) {
    const r = await supabase.storage.from("product-images").remove([oldPath]);
    if (r.error) console.error("Gagal menghapus gambar lama:", oldPath);
  }
  refresh();
  redirect("/admin/produk?saved=1");
}

export async function toggleActive(id: string, active: boolean) {
  await requireAdmin();
  try {
    await prisma.product.update({ where: { id }, data: { isActive: active } });
  } catch {
    const { supabase } = await requireAdmin();
    await supabase.from("products").update({ is_active: active }).eq("id", id);
  }
  refresh();
}
export async function deleteProduct(id: string) {
  await requireAdmin();
  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    const { supabase } = await requireAdmin();
    await supabase.from("products").delete().eq("id", id);
  }
  refresh();
}

export async function saveSettings(_: State, fd: FormData): Promise<State> {
  const { supabase } = await requireAdmin();
  const name = String(fd.get("store_name") ?? "").trim();
  if (!name) return { error: "Nama toko wajib diisi." };
  const raw = String(fd.get("whatsapp_number") ?? "").trim();
  const wa = raw ? normalizePhone(raw) : "";
  if (wa === null) return { error: "Nomor WhatsApp tidak valid." };
  const id = String(fd.get("id") ?? "");
  const { error } = await supabase.from("store_settings").update({ store_name: name, whatsapp_number: wa, store_description: opt(fd.get("store_description")), address: opt(fd.get("address")) }).eq("id", id);
  if (error) return { error: "Perubahan belum tersimpan. Periksa koneksi lalu coba lagi." };
  refresh();
  return { ok: "Pengaturan toko berhasil disimpan." };
}
