import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import ProductCard from "@/components/product/ProductCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({
    where: { slug },
  });

  if (!collection) {
    return { title: "Collection Not Found | Saubhagya Sarees" };
  }

  return {
    title: `${collection.name} | Saubhagya Sarees & Bridal Studio`,
    description: collection.description || `Discover the ${collection.name} at Saubhagya Bridal Studio Hisar.`,
  };
}

export default async function CollectionDetailPage({ params }: CollectionPageProps) {
  const { slug } = await params;

  const [collection, products] = await Promise.all([
    prisma.collection.findUnique({
      where: { slug },
    }),
    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        collection: { slug },
      },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!collection) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-espresso text-ivory py-16 sm:py-20 text-center px-4 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-3 relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block">
              Curated Edit
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-ivory font-normal">
              {collection.name}
            </h1>
            {collection.tagline && (
              <p className="text-xs sm:text-sm text-champagne font-light italic">
                &ldquo;{collection.tagline}&rdquo;
              </p>
            )}
            {collection.description && (
              <p className="text-xs text-beige/80 max-w-xl mx-auto leading-relaxed pt-2 font-light">
                {collection.description}
              </p>
            )}
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-beige/40">
            <span className="text-xs text-charcoal/70">
              Showing <strong>{products.length}</strong> master creations
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
