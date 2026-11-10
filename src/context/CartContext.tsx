"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  productId: string;
  variantId?: string | null;
  title: string;
  slug: string;
  sku: string;
  price: number;
  mrp: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  customMeasurements?: string;
  customNotes?: string;
}

export interface CouponData {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
  coupon: CouponData | null;
  couponError: string | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<CouponData | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("saubhagya_cart_v1");
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem("saubhagya_coupon_v1");
      if (storedCoupon) {
        setCoupon(JSON.parse(storedCoupon));
      }
    } catch (e) {
      console.error("Failed to load cart from storage:", e);
    }
    setMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("saubhagya_cart_v1", JSON.stringify(items));
      if (coupon) {
        localStorage.setItem("saubhagya_coupon_v1", JSON.stringify(coupon));
      } else {
        localStorage.removeItem("saubhagya_coupon_v1");
      }
    } catch (e) {
      console.error("Failed to save cart to storage:", e);
    }
  }, [items, coupon, mounted]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate discount
  let discountAmount = 0;
  if (coupon && subtotal >= coupon.minOrderValue) {
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }
  }

  // Free shipping threshold ₹4,999, else ₹150
  const shippingFee = subtotal === 0 || subtotal >= 4999 ? 0 : 150;
  // Inclusive GST 5% display breakdown (no extra surcharge)
  const taxAmount = Math.round((subtotal * 0.05) / 1.05 * 100) / 100;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && (i.variantId ?? "") === (item.variantId ?? "")
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string, variantId?: string | null) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && (i.variantId ?? "") === (variantId ?? "")))
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string | null) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.productId === productId && (i.variantId ?? "") === (variantId ?? "")) {
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setCouponError(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setCouponError(data.message || "Invalid or expired coupon code.");
        return false;
      }
      setCoupon(data.coupon);
      return true;
    } catch {
      setCouponError("Failed to validate coupon. Please try again.");
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        total,
        coupon,
        couponError,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
