-- ====================================================================
-- TaniCare Schema (Supabase + Prisma Compatible)
-- Mendukung 3 Role Pengguna: ADMIN, BUYER, SELLER
-- ====================================================================

create extension if not exists pgcrypto;

-- 1. Enum Tipe Role & Status Pesanan
do $$ begin
  create type "Role" as enum ('ADMIN', 'BUYER', 'SELLER');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type "OrderStatus" as enum ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED');
exception
  when duplicate_object then null;
end $$;

-- 2. Tabel Pengguna (Users) - 3 Peran: ADMIN, BUYER, SELLER
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  password text,
  phone text,
  role "Role" not null default 'BUYER',
  avatar_url text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Tabel Toko Mitra (Store) - Untuk Role SELLER
create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  whatsapp_number text not null default '',
  address text,
  seller_id uuid unique not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Tabel Admins (Kompatibilitas auth.users Supabase)
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function is_admin() returns boolean language sql security definer stable set search_path = public as
$$ select exists (select 1 from admins where user_id = auth.uid()) $$;

-- 5. Tabel Produk (Products) - Milik Toko / Penjual
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null check (char_length(name) >= 3),
  slug text not null unique,
  category text not null,
  description text,
  price numeric not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_path text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  active_ingredient text,
  benefits text[],
  usage_instructions text,
  label_dosage text,
  warnings text[],
  manufacturer text,
  registration_number text,
  seller_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Tabel Pesanan (Orders) - Dibuat oleh BUYER
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  buyer_id uuid not null references users(id) on delete cascade,
  total_price numeric not null check (total_price >= 0),
  status "OrderStatus" not null default 'PENDING',
  delivery_address text,
  buyer_phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Tabel Item Pesanan (Order Items)
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  price numeric not null check (price >= 0)
);

-- 8. Tabel Pengaturan Toko Global (Store Settings)
create table if not exists store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null default 'TaniCare',
  whatsapp_number text not null default '' check (whatsapp_number = '' or whatsapp_number ~ '^62[0-9]{8,13}$'),
  store_description text,
  address text,
  updated_at timestamptz not null default now()
);

insert into store_settings (store_name) 
select 'TaniCare' where not exists (select 1 from store_settings);

-- 9. Trigger touch_updated_at
create or replace function touch_updated_at() returns trigger language plpgsql as $$ 
begin 
  new.updated_at = now(); 
  return new; 
end $$;

drop trigger if exists users_touch on users;
create trigger users_touch before update on users for each row execute function touch_updated_at();

drop trigger if exists stores_touch on stores;
create trigger stores_touch before update on stores for each row execute function touch_updated_at();

drop trigger if exists products_touch on products;
create trigger products_touch before update on products for each row execute function touch_updated_at();

drop trigger if exists orders_touch on orders;
create trigger orders_touch before update on orders for each row execute function touch_updated_at();

drop trigger if exists settings_touch on store_settings;
create trigger settings_touch before update on store_settings for each row execute function touch_updated_at();

-- 10. Row Level Security
alter table admins enable row level security;
alter table users enable row level security;
alter table stores enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table store_settings enable row level security;

-- Policies RLS
create policy "admins baca diri sendiri" on admins for select using (user_id = auth.uid());
create policy "publik baca users publik" on users for select using (true);
create policy "publik baca toko" on stores for select using (true);
create policy "publik baca produk aktif" on products for select using (is_active or is_admin());
create policy "admin dan seller kelola produk" on products for all using (is_admin() or auth.uid() = seller_id);
create policy "publik baca pengaturan" on store_settings for select using (true);
create policy "admin ubah pengaturan" on store_settings for update using (is_admin()) with check (is_admin());

-- 11. Storage bucket untuk gambar produk
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

create policy "admin upload gambar" on storage.objects for insert with check (bucket_id = 'product-images' and is_admin());
create policy "admin ubah gambar" on storage.objects for update using (bucket_id = 'product-images' and is_admin());
create policy "admin hapus gambar" on storage.objects for delete using (bucket_id = 'product-images' and is_admin());

-- 12. Data Awal Contoh 3 User (Admin, Seller, Buyer)
insert into users (id, email, password, name, phone, role)
values 
  ('a0000000-0000-0000-0000-000000000001', 'admin@gmail.com', '123', 'Admin TaniCare', '6281234567890', 'ADMIN'),
  ('b0000000-0000-0000-0000-000000000002', 'seller@gmail.com', '123', 'Mitra Tani Berkah', '6281234567891', 'SELLER'),
  ('c0000000-0000-0000-0000-000000000003', 'buyer@gmail.com', '123', 'Budi Santoso (Petani)', '6281234567892', 'BUYER')
on conflict (email) do update set password = '123', role = excluded.role;

insert into stores (name, description, whatsapp_number, address, seller_id)
values (
  'Toko Berkah Tani Mandiri',
  'Penyedia benih, pupuk, dan obat pertanian terpercaya untuk petani lokal.',
  '6281234567891',
  'Jl. Pertanian Makmur No. 45, Pare, Kediri, Jawa Timur',
  'b0000000-0000-0000-0000-000000000002'
)
on conflict (seller_id) do nothing;
