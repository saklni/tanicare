export type UserRole = "ADMIN" | "BUYER" | "SELLER";

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  avatar_url?: string | null;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Store = {
  id: string;
  name: string;
  description: string | null;
  whatsapp_number: string;
  address: string | null;
  seller_id: string;
};

export type Product = {
  id: string;
  sku: string | null;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  price: number;
  stock: number;
  image_path: string | null;
  is_featured: boolean;
  is_active: boolean;
  active_ingredient: string | null;
  benefits: string[] | null;
  usage_instructions: string | null;
  label_dosage: string | null;
  warnings: string[] | null;
  manufacturer: string | null;
  registration_number: string | null;
  seller_id?: string | null;
  seller?: {
    id: string;
    name: string;
    phone: string | null;
    store?: {
      id: string;
      name: string;
      whatsapp_number: string;
      address: string | null;
    } | null;
  } | null;
};

export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
};

export type Order = {
  id: string;
  order_number: string;
  buyer_id: string;
  total_price: number;
  status: OrderStatus;
  delivery_address: string | null;
  buyer_phone: string | null;
  notes: string | null;
  created_at: string;
  items?: OrderItem[];
};

export type Settings = {
  id: string;
  store_name: string;
  whatsapp_number: string;
  store_description: string | null;
  address: string | null;
};

export const CATEGORIES = ["Herbisida", "Fungisida", "Insektisida", "Bakterisida", "Pupuk"];
export const USER_ROLES: { role: UserRole; label: string; description: string }[] = [
  { role: "ADMIN", label: "Admin", description: "Kelola seluruh sistem, data pengguna, produk, dan konfigurasi toko" },
  { role: "SELLER", label: "Seller (Mitra Penjual)", description: "Kelola katalog produk, stok, dan pesanan toko sendiri" },
  { role: "BUYER", label: "Buyer (Petani / Pembeli)", description: "Melihat produk pertanian, belanja ke keranjang, dan order via WhatsApp" },
];
