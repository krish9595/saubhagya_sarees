import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import WhatsAppFloatingButton from "@/components/common/WhatsAppFloatingButton";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#352018",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Saubhagya Sarees & Bridal Studio",
    default: "Saubhagya Sarees & Bridal Studio | Luxury Indian Ethnic Fashion & Bridal Wear Hisar",
  },
  description:
    "Discover timeless handloom sarees, bespoke royal bridal lehengas, festive suits, and designer ethnic wear from Saubhagya Sarees & Bridal Studio in Wholesale Cloth Market, Hisar, Haryana.",
  keywords: [
    "Saubhagya Sarees",
    "Bridal Studio Hisar",
    "Banarasi Sarees",
    "Kanjeevaram Silk",
    "Bridal Lehenga Hisar",
    "Ethnic Wear Haryana",
    "Designer Suits",
    "Wedding Trousseau",
  ],
  authors: [{ name: "Saubhagya Sarees & Bridal Studio" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://saubhagyasarees.com",
    siteName: "Saubhagya Sarees & Bridal Studio",
    title: "Saubhagya Sarees & Bridal Studio | Luxury Indian Ethnic Fashion",
    description: "Elegance Woven in Tradition. Premium sarees, bridal wear, and festive ethnic fashion.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-ivory text-charcoal flex flex-col selection:bg-gold selection:text-white">
        <CartProvider>
          <WishlistProvider>
            {children}
            <WhatsAppFloatingButton />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
