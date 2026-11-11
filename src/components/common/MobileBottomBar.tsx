"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Heart, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function MobileBottomBar() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) return null;

  // On product detail page (/product/[slug]), the sticky purchase bar takes priority,
  // so we hide the main bottom navigation to prevent double bottom bars
  const isPDP = pathname?.startsWith("/product/") && pathname !== "/product";

  if (isPDP) return null;

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Shop",
      href: "/shop",
      icon: Sparkles,
      isActive: pathname?.startsWith("/shop"),
    },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      isActive: pathname === "/wishlist",
      badge: wishlistCount,
    },
    {
      label: "Account",
      href: "/account",
      icon: User,
      isActive: pathname?.startsWith("/account"),
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F8F4EC]/95 backdrop-blur-md border-t border-[#D8C6AD]/60 shadow-[0_-4px_20px_rgba(53,32,24,0.06)] transition-all duration-300"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 6px)" }}
    >
      <div className="grid grid-cols-5 h-14 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
                item.isActive ? "text-[#B18A4A]" : "text-[#26221F]/70 hover:text-[#352018]"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                    item.isActive ? "scale-110 stroke-[2.2]" : "stroke-[1.7]"
                  }`}
                />
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#B18A4A] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] tracking-wider uppercase mt-1 leading-none ${
                  item.isActive ? "font-bold text-[#B18A4A]" : "font-medium"
                }`}
              >
                {item.label}
              </span>
              {item.isActive && (
                <span className="w-1 h-1 rounded-full bg-[#B18A4A] mt-0.5" />
              )}
            </Link>
          );
        })}

        {/* 5th item: Bag with cart trigger */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
            pathname === "/cart" ? "text-[#B18A4A]" : "text-[#352018]"
          }`}
          aria-label={`Open shopping bag with ${itemCount} items`}
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8] text-[#4A2D23]" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#4A2D23] text-white text-[8px] font-bold min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[9px] tracking-wider uppercase font-semibold text-[#4A2D23] mt-1 leading-none">
            Bag
          </span>
          {pathname === "/cart" && (
            <span className="w-1 h-1 rounded-full bg-[#B18A4A] mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
}
