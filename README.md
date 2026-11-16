# TaniCare

Platform katalog produk pertanian & pemesanan (Next.js App Router, Supabase, Prisma ORM).

---

## 3 Role Pengguna

Sistem TaniCare kini mendukung 3 peran pengguna:
1. **Admin** (`/admin`):
   - Mengelola seluruh sistem, katalog produk, pengguna, dan pengaturan toko.
   - Mengakses menu baru **Kelola Pengguna** di `/admin/users` untuk memantau akun Admin, Seller, dan Buyer.
2. **Seller** (`/seller`):
   - Portal khusus mitra penjual/toko tani.
   - Mengelola katalog produk yang dijual, memantau pesanan masuk, dan informasi toko mitra.
3. **Buyer** (`/buyer`):
   - Area akun pembeli/petani untuk melihat riwayat pesanan, status pesanan, keranjang belanja, dan info pengiriman.

---

## Integrasi Prisma ORM

- **File Schema**: [prisma/schema.prisma](file:///e:/pelatihan/opencode/TaniCare/prisma/schema.prisma)
- **Konfigurasi Prisma (v7)**: [prisma.config.ts](file:///e:/pelatihan/opencode/TaniCare/prisma.config.ts)
- **Prisma Client Helper**: [src/lib/prisma.ts](file:///e:/pelatihan/opencode/TaniCare/src/lib/prisma.ts)
- **Seed Script**: [prisma/seed.ts](file:///e:/pelatihan/opencode/TaniCare/prisma/seed.ts)

### Perintah Prisma
- `npm run prisma:generate` - Generate Prisma Client TypeScript
- `npm run prisma:push` - Sinkronisasi schema ke database
- `npm run prisma:seed` - Seed data 3 role pengguna (Admin, Seller, Buyer)

---

## Menjalankan Aplikasi
1. `npm install`
2. Salin environment: `cp .env.example .env.local` dan pastikan konfigurasi Supabase & `DATABASE_URL` terisi.
3. Eksekusi [supabase/schema.sql](file:///e:/pelatihan/opencode/TaniCare/supabase/schema.sql) di Supabase SQL Editor atau jalankan `npm run prisma:push`.
4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
5. Akses portal:
   - Toko & Katalog: [http://localhost:3000](http://localhost:3000)
   - Portal Admin: [http://localhost:3000/admin](http://localhost:3000/admin)
   - Portal Seller: [http://localhost:3000/seller](http://localhost:3000/seller)
   - Area Buyer: [http://localhost:3000/buyer](http://localhost:3000/buyer)
