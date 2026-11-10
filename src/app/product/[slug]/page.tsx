import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import ProductDetailView from "@/components/product/ProductDetailView";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { where: { isPrimary: true } } },
  });

  if (!product) {
    return { title: "Product Not Found | Saubhagya Sarees" };
  }

  const primaryImage = product.images[0]?.url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c";

  return {
    title: product.seoTitle || `${product.title} | Saubhagya Sarees & Bridal Studio`,
    description:
      product.seoDescription ||
      product.shortDescription ||
      `Buy authentic ${product.title} online or visit our Hisar studio. Handcrafted Indian ethnic wear.`,
    openGraph: {
      title: product.title,
      description: product.shortDescription || "",
      images: [{ url: primaryImage }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      variants: true,
      category: true,
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products in same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: "PUBLISHED",
    },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      variants: true,
      category: true,
    },
    take: 4,
  });

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1">
        <ProductDetailView product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
