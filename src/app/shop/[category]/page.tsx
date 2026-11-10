import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import ShopClient from "@/components/shop/ShopClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return { title: "Category Not Found | Saubhagya Sarees" };
  }

  return {
    title: category.seoTitle || `${category.name} Collection | Saubhagya Sarees & Bridal Studio`,
    description:
      category.seoDescription ||
      `Discover our exclusive ${category.name} collection at Saubhagya Sarees & Bridal Studio, Hisar.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;

  const [category, products, categories] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
    }),
    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        category: { slug },
      },
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

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1">
        <ShopClient
          initialProducts={products as any}
          categories={categories}
          currentCategorySlug={category.slug}
          pageTitle={`${category.name}`}
          pageDescription={
            category.description ||
            `Curated ${category.name} handcrafted by master artisans for celebratory milestones.`
          }
        />
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
