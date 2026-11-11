"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Eye, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import QuickViewModal from "./QuickViewModal";

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    sku: string;
    price: number | string;
    mrp: number | string;
    discountPercent?: number;
    primaryColor?: string | null;
    fabric?: string | null;
    isNewArrival?: boolean;
    isBestseller?: boolean;
    rating?: number | string;
    reviewCount?: number;
    images: { url: string; alt?: string | null }[];
    variants?: { id: string; size?: string | null; color?: string | null; colorHex?: string | null; stockQuantity: number }[];
    category?: { name: string; slug: string } | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const priceNum = Number(product.price);
  const mrpNum = Number(product.mrp);
  const hasDiscount = mrpNum > priceNum;
  const discountPct = product.discountPercent || (hasDiscount ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0);

  const primaryImg = product.images[0]?.url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600";
  const hoverImg = product.images[1]?.url || primaryImg;

  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const firstVariant = product.variants?.[0];
    addItem({
      productId: product.id,
      variantId: firstVariant?.id || null,
      title: product.title,
      slug: product.slug,
      sku: product.sku,
      price: priceNum,
      mrp: mrpNum,
      image: primaryImg,
      quantity: 1,
      size: firstVariant?.size || "Free Size",
      color: product.primaryColor || firstVariant?.color || "Standard",
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      sku: product.sku,
      price: priceNum,
      mrp: mrpNum,
      image: primaryImg,
      categoryName: product.category?.name,
    });
  };

  return (
    <>
      <div
        className="group relative flex flex-col bg-white border border-beige/40 shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-luxury overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges: New, Bestseller, Discount */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-20 flex flex-col gap-1">
          {product.isNewArrival && (
            <span className="bg-espresso text-ivory text-[8px] sm:text-[9px] uppercase tracking-wider sm:tracking-widest font-bold px-1.5 sm:px-2 py-0.5 shadow-xs">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-gold text-white text-[8px] sm:text-[9px] uppercase tracking-wider sm:tracking-widest font-bold px-1.5 sm:px-2 py-0.5 shadow-xs">
              Bestseller
            </span>
          )}
          {hasDiscount && (
            <span className="bg-chocolate text-ivory text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold px-1.5 sm:px-2 py-0.5 shadow-xs">
              {discountPct}% Off
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
            inWishlist
              ? "bg-rose-50 text-rose-600 shadow-md"
              : "bg-white/90 text-charcoal/70 hover:text-rose-600 hover:bg-white shadow-xs"
          }`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? "fill-current text-rose-600" : ""}`} />
        </button>

        {/* Product Image Area */}
        <Link href={`/product/${product.slug}`} className="relative aspect-3/4 w-full bg-cream/30 overflow-hidden">
          <Image
            src={isHovered ? hoverImg : primaryImg}
            alt={product.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105 will-change-transform"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Quick Actions Hover Overlay on Desktop */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-espresso/90 via-espresso/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-luxury flex items-center justify-between gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              className="flex-1 bg-ivory/95 hover:bg-ivory text-espresso text-[11px] font-semibold uppercase tracking-wider py-2 px-2 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-gold" />
              <span>Quick View</span>
            </button>

            <button
              onClick={handleQuickAdd}
              className="bg-gold hover:bg-champagne text-white hover:text-espresso p-2 transition-colors"
              aria-label="Quick Add to Bag"
            >
              {addedNotice ? <Check className="w-4 h-4 text-emerald-800" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </Link>

        {/* Product Details */}
        <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between bg-ivory/30">
          <div>
            {product.category && (
              <span className="text-[9px] sm:text-[10px] text-chocolate/70 uppercase tracking-widest block font-medium mb-0.5 sm:mb-1">
                {product.category.name}
              </span>
            )}

            <Link href={`/product/${product.slug}`}>
              <h3 className="font-serif text-xs sm:text-base font-normal text-espresso hover:text-gold line-clamp-1 transition-colors">
                {product.title}
              </h3>
            </Link>

            {product.fabric && (
              <p className="text-[10px] sm:text-[11px] text-charcoal/60 line-clamp-1 mt-0.5">
                {product.fabric}
              </p>
            )}
          </div>

          <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-beige/40 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-base font-semibold text-espresso">
                ₹{priceNum.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-charcoal/40 line-through">
                  ₹{mrpNum.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Quick Add Button for Mobile */}
            <button
              onClick={handleQuickAdd}
              className="lg:hidden text-chocolate hover:text-gold p-1 bg-cream/50 rounded-full active:scale-90 transition-transform"
              aria-label="Add to Bag"
            >
              {addedNotice ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal conforming to Modern Web Guidance */}
      {quickViewOpen && (
        <QuickViewModal
          product={product}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
