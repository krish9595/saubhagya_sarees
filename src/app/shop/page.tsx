import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import ShopClient from "@/components/shop/ShopClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Indian Ethnic Collections | Saubhagya Sarees & Bridal Studio",
  description:
    "Explore our complete range of handwoven sarees, royal bridal lehengas, festive anarkalis, chanderi suits and Indo-western dresses.",
};

export const revalidate = 60;

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1">
        <ShopClient
          initialProducts={products as any}
          categories={categories}
          pageTitle="All Ethnic Fashion Collections"
          pageDescription="Handcrafted Banarasi silks, royal bridal lehengas, pure organza drapes, and festive suits curated with generational artistry."
        />
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
