"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    coupon,
    couponError,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(couponCodeInput.trim());
    setApplyingCoupon(false);
  };

  const freeShippingThreshold = 4999;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed backdrop with overscroll contain */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out drawer sheet */}
      <aside
        className="relative z-10 w-full max-w-md bg-ivory text-charcoal h-full flex flex-col shadow-2xl border-l border-beige/40 gpu-accelerate ease-luxury duration-300 transform transition-transform"
        role="dialog"
        aria-label="Shopping Bag"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-beige/40 flex items-center justify-between bg-cream/40">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-gold" />
            <h2 className="text-xl font-serif font-medium tracking-tight text-espresso">
              Shopping Bag ({itemCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-charcoal/70 hover:text-espresso rounded-full hover:bg-beige/30 transition-colors"
            aria-label="Close Shopping Bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-cream/60 border-b border-beige/30 text-xs">
          {amountNeededForFreeShipping > 0 ? (
            <p className="text-charcoal/80 mb-1.5">
              Add <strong className="text-espresso">₹{amountNeededForFreeShipping.toLocaleString("en-IN")}</strong> more for <span className="text-gold font-semibold">Complimentary Pan-India Shipping</span>!
            </p>
          ) : (
            <p className="text-emerald-800 font-medium mb-1.5 flex items-center gap-1.5">
              <span>🎉</span> You have unlocked <strong>Free Complimentary Shipping</strong>!
            </p>
          )}
          <div className="w-full bg-beige/40 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gold h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mb-4 text-chocolate/40">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif text-2xl text-espresso mb-1">Your bag is empty</p>
              <p className="text-sm text-charcoal/60 mb-6 max-w-xs">
                Explore our handcrafted Banarasi silks, royal bridal wear, and festive suits.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="inline-block bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-none transition-colors"
              >
                <Link href="/shop">Start Shopping</Link>
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId || "default"}`}
                className="flex gap-4 p-3.5 bg-white/70 rounded-none border border-beige/40 shadow-xs"
              >
                <div className="relative w-20 h-24 bg-cream shrink-0 overflow-hidden">
                  <Image
                    src={item.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200"}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-serif text-base font-medium text-espresso hover:text-gold line-clamp-1 transition-colors"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-charcoal/40 hover:text-red-700 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-charcoal/60 mt-0.5 space-x-2">
                      {item.size && <span>Size: <strong>{item.size}</strong></span>}
                      {item.color && <span>• Color: <strong>{item.color}</strong></span>}
                    </div>

                    {item.customMeasurements && (
                      <p className="text-[11px] text-gold font-medium mt-0.5">
                        ✓ Custom measurements attached
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-beige/20">
                    <div className="flex items-center border border-beige/60 bg-ivory">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                        className="p-1 hover:bg-beige/40 text-charcoal transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        className="p-1 hover:bg-beige/40 text-charcoal transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-semibold text-espresso">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-beige/40 bg-cream/40 space-y-4">
            {/* Promo Code Input */}
            <div>
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <span>
                      Code <strong>{coupon.code}</strong> applied (-₹{discountAmount.toLocaleString("en-IN")})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-700 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. SAUBHAGYA10)"
                    className="flex-1 text-xs px-3 py-2 bg-white border border-beige/80 rounded-none focus:outline-none focus:border-gold uppercase"
                  />
                  <button
                    type="submit"
                    disabled={applyingCoupon || !couponCodeInput.trim()}
                    className="bg-chocolate hover:bg-espresso text-ivory text-xs px-4 py-2 font-medium tracking-wider uppercase transition-colors disabled:opacity-50"
                  >
                    {applyingCoupon ? "..." : "Apply"}
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-charcoal/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Pan-India Shipping</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-800">Free</strong> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-[11px] text-charcoal/50">
                <span>Included GST (5%)</span>
                <span>₹{Math.round((subtotal * 0.05) / 1.05).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-semibold text-espresso pt-2 border-t border-beige/40">
                <span>Final Payable</span>
                <span className="text-lg text-chocolate">₹{Math.round(total).toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold py-3.5 transition-all shadow-md group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-charcoal/60">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>100% Authentic Handcrafted Wear • Secure Razorpay Checkout</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
