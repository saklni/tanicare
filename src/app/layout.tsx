import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["600", "700"] });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap", weight: ["400", "600", "700"] });
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "TaniCare — Katalog Produk Pertanian", template: "%s | TaniCare" },
  description: "Katalog sarana pertanian. Susun daftar pesanan lalu konfirmasi langsung ke toko via WhatsApp.",
  openGraph: { type: "website", locale: "id_ID", siteName: "TaniCare" },
  alternates: { canonical: "/" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
