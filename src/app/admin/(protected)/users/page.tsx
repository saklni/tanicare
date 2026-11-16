import { requireAdmin } from "../../auth";
import { prisma } from "@/lib/prisma";
import { UserRole, USER_ROLES } from "@/lib/types";
import { ShieldCheck, Store, ShoppingBag, User as UserIcon } from "lucide-react";

export const metadata = { title: "Kelola Pengguna - TaniCare Admin" };

type DisplayUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  address: string | null;
  created_at: string;
};

// Sample fallback users jika database belum di-migrate
const defaultUsers: DisplayUser[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    email: "admin@gmail.com",
    name: "Admin TaniCare",
    phone: "6281234567890",
    role: "ADMIN" as UserRole,
    address: "Kantor Pusat TaniCare",
    created_at: new Date().toISOString(),
  },
  {
    id: "b0000000-0000-0000-0000-000000000002",
    email: "seller@gmail.com",
    name: "Mitra Tani Berkah",
    phone: "6281234567891",
    role: "SELLER" as UserRole,
    address: "Jl. Pertanian Makmur No. 45, Jawa Timur",
    created_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-0000-0000-000000000003",
    email: "buyer@gmail.com",
    name: "Budi Santoso (Petani)",
    phone: "6281234567892",
    role: "BUYER" as UserRole,
    address: "Desa Subur RT 02/RW 03, Kediri, Jawa Timur",
    created_at: new Date().toISOString(),
  },
];

export default async function UsersPage() {
  await requireAdmin();

  let users: DisplayUser[] = defaultUsers;
  try {
    const dbUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (dbUsers && dbUsers.length > 0) {
      users = dbUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        phone: u.phone,
        role: u.role as UserRole,
        address: u.address,
        created_at: u.createdAt.toISOString(),
      }));
    }
  } catch {
    // Gunakan default demo jika DB URL belum terhubung
  }

  const roleBadge = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-800"><ShieldCheck size={14} />Admin</span>;
      case "SELLER":
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800"><Store size={14} />Seller</span>;
      case "BUYER":
        return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800"><ShoppingBag size={14} />Buyer</span>;
    }
  };

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const sellerCount = users.filter((u) => u.role === "SELLER").length;
  const buyerCount = users.filter((u) => u.role === "BUYER").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-ink-900">Kelola Pengguna</h1>
          <p className="text-sm text-ink-600">Daftar pengguna dengan 3 peran sistem: Admin, Seller, dan Buyer.</p>
        </div>
      </div>

      {/* Ringkasan 3 Role */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card border-l-4 border-l-purple-600 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink-600">Total Admin</span>
            <ShieldCheck className="text-purple-600" size={20} />
          </div>
          <p className="mt-2 text-3xl font-bold text-purple-900">{adminCount}</p>
          <p className="mt-1 text-xs text-ink-500">Kelola sistem & konfigurasi</p>
        </div>

        <div className="card border-l-4 border-l-blue-600 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink-600">Total Seller</span>
            <Store className="text-blue-600" size={20} />
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-900">{sellerCount}</p>
          <p className="mt-1 text-xs text-ink-500">Mitra penjual & pemilik produk</p>
        </div>

        <div className="card border-l-4 border-l-green-600 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink-600">Total Buyer</span>
            <ShoppingBag className="text-green-600" size={20} />
          </div>
          <p className="mt-2 text-3xl font-bold text-green-900">{buyerCount}</p>
          <p className="mt-1 text-xs text-ink-500">Petani & pelanggan belanja</p>
        </div>
      </div>

      {/* Tabel Pengguna */}
      <div className="card overflow-hidden">
        <div className="border-b border-ink-500/10 px-5 py-4">
          <h2 className="font-semibold text-ink-900">Daftar Akun Pengguna</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-100 text-xs font-semibold uppercase text-ink-600">
              <tr>
                <th className="px-5 py-3">Nama & Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">No. WhatsApp</th>
                <th className="px-5 py-3">Alamat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-500/10">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-cream-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-200 text-green-900 font-bold">
                        <UserIcon size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-ink-900">{u.name}</p>
                        <p className="text-xs text-ink-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">{roleBadge(u.role)}</td>
                  <td className="px-5 py-4 text-ink-700">{u.phone ?? "-"}</td>
                  <td className="px-5 py-4 text-ink-600 text-xs max-w-xs truncate">{u.address ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Keterangan Hak Akses Peran */}
      <div className="card p-5 bg-cream-50">
        <h3 className="text-sm font-bold text-ink-900 mb-3">Struktur 3 Role TaniCare</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {USER_ROLES.map((r) => (
            <div key={r.role} className="rounded-lg border border-ink-500/15 bg-white p-3 space-y-1">
              <p className="font-semibold text-ink-900">{r.label}</p>
              <p className="text-ink-600 leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

