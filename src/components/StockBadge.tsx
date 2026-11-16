import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
export default function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="badge bg-red-50 text-danger"><XCircle aria-hidden size={14} />Stok Habis</span>;
  if (stock <= 5) return <span className="badge bg-amber-50 text-warning"><AlertTriangle aria-hidden size={14} />Stok Menipis ({stock})</span>;
  return <span className="badge bg-green-100 text-green-800"><CheckCircle2 aria-hidden size={14} />Stok Tersedia</span>;
}
