"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface QuickViewModalProps {
  product: {
    id: string;
    title: string;
    slug: string;
    sku: string;
    price: number | string;
    mrp: number | string;
    discountPercent?: number;
    fabric?: string | null;
    primaryColor?: string | null;
    shortDescription?: string | null;
    images: { url: string; alt?: string | null }[];
    variants?: { id: string; size?: string | null; color?: string | null; stockQuantity: number }[];
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.[0]?.id || null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const priceNum = Number(product.price);
  const mrpNum = Number(product.mrp);
  const hasDiscount = mrpNum > priceNum;
  const primaryImg = product.images[selectedImg]?.url || product.images[0]?.url || "";

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariantId,
      title: product.title,
      slug: product.slug,
      sku: (currentVariant as any)?.sku || product.sku,
      price: priceNum,
      mrp: mrpNum,
      image: primaryImg,
      quantity,
      size: currentVariant?.size || "Free Size",
      color: product.primaryColor || currentVariant?.color || "Standard",
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed backdrop with overscroll contain */}
      <div
        className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal dialog box */}
      <div
        className="relative z-10 w-full max-w-4xl bg-ivory border border-beige/60 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-label={product.title}
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-ivory/80 rounded-full text-charcoal hover:text-espresso hover:bg-ivory shadow-xs"
          aria-label="Close dialog"
          autoFocus
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery on Left */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 bg-cream/30 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-3/4 max-h-[420px] bg-white overflow-hidden shadow-xs">
            <Image
              src={primaryImg}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto w-full pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`relative w-14 h-16 shrink-0 border-2 overflow-hidden transition-all ${
                    selectedImg === idx ? "border-gold" : "border-beige/40 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt="thumbnail" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details on Right */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-chocolate font-semibold mb-1">
              SKU: {product.sku}
            </div>

            <h2 className="font-serif text-2xl font-normal text-espresso mb-2">
              {product.title}
            </h2>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-semibold text-espresso">
                ₹{priceNum.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-charcoal/40 line-through">
                    ₹{mrpNum.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    Save ₹{(mrpNum - priceNum).toLocaleString("en-IN")}
                  </span>
                </>
              )}
            </div>

            {product.fabric && (
              <p className="text-xs text-charcoal/70 mb-2">
                <strong>Fabric:</strong> {product.fabric}
              </p>
            )}

            {product.shortDescription && (
              <p className="text-xs text-charcoal/80 leading-relaxed mb-6 line-clamp-3">
                {product.shortDescription}
              </p>
            )}

            {/* Size / Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-espresso mb-2">
                  Select Size / Style:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-3.5 py-1.5 text-xs font-medium border transition-all ${
                        selectedVariantId === v.id
                          ? "border-espresso bg-espresso text-ivory"
                          : "border-beige/80 bg-white hover:border-gold text-charcoal"
                      }`}
                    >
                      {v.size || v.color || "Standard"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-espresso">
                Quantity:
              </span>
              <div className="flex items-center border border-beige/80 bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 hover:bg-cream text-charcoal"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 hover:bg-cream text-charcoal"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-beige/40">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className="w-full flex items-center justify-center gap-2 bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold py-3.5 shadow-md transition-colors"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-champagne" />
                  <span>Add to Shopping Bag</span>
                </>
              )}
            </button>

            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-chocolate hover:text-gold font-semibold py-2 transition-colors"
            >
              <span>View Full Product Specifications</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-charcoal/60 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>Complimentary Pan-India Shipping on orders above ₹4,999</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
