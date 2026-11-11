import type { Metadata, Viewport } from "next";
import { Allura, Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-poppins", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500"], variable: "--font-cormorant", display: "swap" });
const allura = Allura({ subsets: ["latin"], weight: ["400"], variable: "--font-allura", display: "swap" });

export const metadata: Metadata = {
  title: "Jyarsh — every package looks premium",
  description: "Scroll to open the Jyarsh drawer box and unfold it flat.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${cormorant.variable} ${allura.variable}`}>
      <body className="bg-white font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
