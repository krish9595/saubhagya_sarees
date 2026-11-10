"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function MobileBottomBar() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-ivory/95 backdrop-blur-md border-t border-beige/60 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around"
    >
      <Link
        href="/"
        className={`flex flex-col items-center py-1 px-3 text-[10px] tracking-wider uppercase font-medium transition-colors ${
          pathname === "/" ? "text-gold font-bold" : "text-charcoal/70 hover:text-espresso"
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </Link>

      <Link
        href="/shop"
        className={`flex flex-col items-center py-1 px-3 text-[10px] tracking-wider uppercase font-medium transition-colors ${
          pathname.startsWith("/shop") ? "text-gold font-bold" : "text-charcoal/70 hover:text-espresso"
        }`}
      >
        <Sparkles className="w-5 h-5 mb-0.5" />
        <span>Shop</span>
      </Link>

      <Link
        href="/wishlist"
        className={`relative flex flex-col items-center py-1 px-3 text-[10px] tracking-wider uppercase font-medium transition-colors ${
          pathname === "/wishlist" ? "text-gold font-bold" : "text-charcoal/70 hover:text-espresso"
        }`}
      >
        <Heart className="w-5 h-5 mb-0.5" />
        <span>Saved</span>
        {wishlistCount > 0 && (
          <span className="absolute top-0.5 right-2 bg-gold text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </Link>

      <Link
        href="/account"
        className={`flex flex-col items-center py-1 px-3 text-[10px] tracking-wider uppercase font-medium transition-colors ${
          pathname.startsWith("/account") ? "text-gold font-bold" : "text-charcoal/70 hover:text-espresso"
        }`}
      >
        <User className="w-5 h-5 mb-0.5" />
        <span>Account</span>
      </Link>

      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center py-1 px-3 text-[10px] tracking-wider uppercase font-medium text-charcoal/70 hover:text-espresso"
        aria-label={`Open shopping bag with ${itemCount} items`}
      >
        <ShoppingBag className="w-5 h-5 mb-0.5 text-chocolate" />
        <span className="text-chocolate font-semibold">Bag</span>
        {itemCount > 0 && (
          <span className="absolute top-0.5 right-2 bg-chocolate text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>
    </nav>
  );
}
