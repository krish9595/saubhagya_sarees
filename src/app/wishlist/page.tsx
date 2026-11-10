"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToBag = (item: any) => {
    addItem({
      productId: item.productId,
      title: item.title,
      slug: item.slug,
      sku: item.sku,
      price: item.price,
      mrp: item.mrp,
      image: item.image,
      quantity: 1,
      size: "Free Size",
    });
    removeItem(item.productId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-beige/40 pb-6 mb-10">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block mb-1">
              Personal Curation
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-normal">
              My Saved Designs ({items.length})
            </h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="mt-3 sm:mt-0 text-xs text-charcoal/60 hover:text-red-700 font-semibold uppercase tracking-wider"
            >
              Clear All Saved
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-12 text-center max-w-lg mx-auto border border-beige/40 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center text-chocolate/40">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-espresso">Your wishlist is empty</h3>
            <p className="text-xs text-charcoal/60 leading-relaxed max-w-xs mx-auto">
              Save your favourite sarees, bridal ensembles and suits to review them anytime before placing your order.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-block bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-8 py-3.5 transition-colors"
              >
                Discover Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-beige/40 shadow-xs flex flex-col justify-between overflow-hidden group"
              >
                <div className="relative aspect-3/4 bg-cream/30 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-2.5 right-2.5 z-10 p-2 bg-white/90 text-charcoal hover:text-red-600 rounded-full shadow-xs transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {item.categoryName && (
                      <span className="text-[10px] uppercase tracking-widest text-chocolate font-semibold block mb-0.5">
                        {item.categoryName}
                      </span>
                    )}
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-serif text-base text-espresso hover:text-gold line-clamp-1 transition-colors"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-semibold text-espresso">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-charcoal/40 line-through">
                          ₹{item.mrp.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleMoveToBag(item)}
                    className="w-full flex items-center justify-center gap-2 bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold py-2.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-champagne" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
