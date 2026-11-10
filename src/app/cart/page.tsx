"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    discountAmount,
    shippingFee,
    taxAmount,
    total,
    coupon,
    couponError,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(couponCodeInput.trim());
    setApplyingCoupon(false);
  };

  const freeShippingThreshold = 4999;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div className="border-b border-beige/40 pb-6 mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block mb-1">
              Your Selection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-normal">
              Shopping Bag ({itemCount} {itemCount === 1 ? "item" : "items"})
            </h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="mt-2 sm:mt-0 text-xs text-charcoal/60 hover:text-red-700 uppercase tracking-wider font-semibold"
            >
              Clear Bag
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-12 text-center max-w-lg mx-auto border border-beige/40 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center text-chocolate/40">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-espresso">Your bag is empty</h3>
            <p className="text-xs text-charcoal/60 leading-relaxed max-w-xs mx-auto">
              You haven&apos;t added any sarees, bridal outfits or suits yet. Explore our handcrafted collections today.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-block bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-8 py-3.5 transition-colors shadow-md"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Items Column */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Alert Strip */}
              <div className="p-4 bg-cream/60 border border-beige/40 text-xs">
                {amountNeeded > 0 ? (
                  <p className="text-charcoal/80 mb-2">
                    Add <strong className="text-espresso">₹{amountNeeded.toLocaleString("en-IN")}</strong> more for <span className="text-gold font-bold">Complimentary Pan-India Shipping</span>!
                  </p>
                ) : (
                  <p className="text-emerald-800 font-medium mb-2 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    You qualify for <strong>Free Complimentary Shipping</strong> across India!
                  </p>
                )}
                <div className="w-full bg-beige/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-gold h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white border border-beige/40 divide-y divide-beige/30 shadow-xs">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId || "default"}`}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
                  >
                    <div className="relative w-24 sm:w-28 aspect-3/4 bg-cream shrink-0 overflow-hidden border border-beige/40">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between w-full h-full min-h-[120px]">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <Link
                            href={`/product/${item.slug}`}
                            className="font-serif text-lg font-normal text-espresso hover:text-gold transition-colors"
                          >
                            {item.title}
                          </Link>
                          <button
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="text-charcoal/40 hover:text-red-700 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-xs text-charcoal/60 mt-1 space-x-3">
                          {item.size && <span>Size: <strong>{item.size}</strong></span>}
                          {item.color && <span>• Colour: <strong>{item.color}</strong></span>}
                          <span>• SKU: {item.sku}</span>
                        </div>

                        {item.customMeasurements && (
                          <div className="mt-2 p-2 bg-cream/40 border border-beige/30 text-[11px] text-charcoal/80">
                            <strong>Custom Measurements:</strong> {item.customMeasurements}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-beige/20">
                        {/* Quantity */}
                        <div className="flex items-center border border-beige/80 bg-ivory">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                            className="p-1.5 hover:bg-beige/40 text-charcoal"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3.5 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                            className="p-1.5 hover:bg-beige/40 text-charcoal"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-lg font-semibold text-espresso">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-chocolate hover:text-gold font-semibold transition-colors"
                >
                  <span>← Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4 bg-white p-6 border border-beige/40 shadow-sm space-y-6 sticky top-24">
              <h3 className="font-serif text-xl font-medium text-espresso border-b border-beige/40 pb-3">
                Order Summary
              </h3>

              {/* Promo Code Input */}
              <div>
                {coupon ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-700" />
                      <span>
                        Promo <strong>{coupon.code}</strong> applied (-₹{discountAmount.toLocaleString("en-IN")})
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
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        placeholder="Coupon code (e.g. SAUBHAGYA10)"
                        className="flex-1 text-xs px-3 py-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold uppercase"
                      />
                      <button
                        type="submit"
                        disabled={applyingCoupon || !couponCodeInput.trim()}
                        className="bg-chocolate hover:bg-espresso text-ivory text-xs px-4 py-2 font-medium tracking-wider uppercase transition-colors"
                      >
                        {applyingCoupon ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                  </form>
                )}
              </div>

              {/* Calculations breakdown */}
              <div className="space-y-2.5 text-xs text-charcoal/80 border-t border-beige/30 pt-4">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-espresso">₹{subtotal.toLocaleString("en-IN")}</span>
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
                  <span>Inclusive of 5% GST</span>
                  <span>₹{taxAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-lg font-serif font-semibold text-espresso pt-3 border-t border-beige/40">
                  <span>Total Payable</span>
                  <span className="text-xl text-chocolate">₹{Math.round(total).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold py-4 shadow-md transition-all group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-charcoal/60 text-center">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                <span>Encrypted 256-bit secure Indian checkout</span>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
