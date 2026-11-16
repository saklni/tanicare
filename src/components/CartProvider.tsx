"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type CartItem = { productId: string; slug: string; name: string; price: number; imageUrl?: string | null; quantity: number };
type Ctx = {
  items: CartItem[]; count: number; ready: boolean; toast: string;
  add: (p: Omit<CartItem, "quantity">, qty: number, stock: number) => void;
  setQty: (id: string, q: number) => void; remove: (id: string) => void; clear: () => void;
};
const C = createContext<Ctx>(null!);
export const useCart = () => useContext(C);
const KEY = "tanicare-cart";

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }, [items, ready]);
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };
  const add: Ctx["add"] = useCallback((p, qty, stock) => {
    setItems((cur) => {
      const ex = cur.find((i) => i.productId === p.productId);
      const q = Math.min((ex?.quantity ?? 0) + qty, stock);
      return ex ? cur.map((i) => (i.productId === p.productId ? { ...i, ...p, quantity: q } : i)) : [...cur, { ...p, quantity: q }];
    });
    say("Produk ditambahkan ke keranjang.");
  }, []);
  const setQty = (id: string, q: number) => setItems((c) => c.map((i) => (i.productId === id ? { ...i, quantity: Math.max(1, q) } : i)));
  const remove = (id: string) => setItems((c) => c.filter((i) => i.productId !== id));
  const clear = () => setItems([]);
  return (
    <C.Provider value={{ items, count: items.reduce((s, i) => s + i.quantity, 0), ready, toast, add, setQty, remove, clear }}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4">
        {toast && <div className="rounded-lg bg-green-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">{toast}</div>}
      </div>
    </C.Provider>
  );
}
