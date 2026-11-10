import React from "react";
import prisma from "@/lib/prisma";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Indian Ethnic Creations | Saubhagya Sarees & Bridal Studio",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let products: any[] = [];
  if (query) {
    products = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { fabric: { contains: query } },
          { occasion: { contains: query } },
          { primaryColor: { contains: query } },
          { tags: { contains: query } },
          { sku: { contains: query } },
        ],
      },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block mb-2">
            Search Catalogue
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-normal">
            {query ? `Search Results for "${query}"` : "Search Our Collections"}
          </h1>
          <p className="text-xs text-charcoal/70 mt-2">
            {products.length} {products.length === 1 ? "design" : "designs"} found matching your inquiry.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white p-12 text-center max-w-xl mx-auto border border-beige/40 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center text-chocolate/40">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-espresso">No designs matched &quot;{query}&quot;</h3>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              We couldn&apos;t find exact matches for your search term. Try exploring popular bridal categories or searching for &quot;Silk&quot;, &quot;Banarasi&quot;, &quot;Velvet&quot;, or &quot;Anarkali&quot;.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-block bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-6 py-3 transition-colors"
              >
                Browse All Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
