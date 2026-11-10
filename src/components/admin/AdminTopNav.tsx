"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Bell, ExternalLink, Shield } from "lucide-react";

export default function AdminTopNav() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/admin/login") return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  const pageNames: Record<string, string> = {
    "/admin": "Operations Overview",
    "/admin/products": "Catalogue & Product Master",
    "/admin/inventory": "Inventory & Stock Movement",
    "/admin/orders": "Order Processing & Shipping",
    "/admin/customers": "Customer CRM & Profiles",
    "/admin/categories": "Category & Collection Architecture",
    "/admin/coupons": "Promotions & Discount Vouchers",
    "/admin/reviews": "Customer Reviews & Moderation",
    "/admin/content": "Homepage CMS & Editorial Banners",
    "/admin/reports": "Business Intelligence & CSV Exports",
    "/admin/staff": "Staff Roles & Access Permissions",
    "/admin/settings": "Store & Payment Gateway Settings",
    "/admin/audit-logs": "Security & Activity Audit Trail",
  };

  const currentPageTitle = pageNames[pathname] || "Admin Console";

  return (
    <header className="bg-white border-b border-beige/60 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div>
        <h2 className="font-serif text-lg font-medium text-espresso">
          {currentPageTitle}
        </h2>
        <span className="text-[11px] text-charcoal/60">
          Saubhagya Studio • Wholesale Cloth Market, Hisar
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs text-chocolate hover:text-gold font-medium border border-beige/60 px-3 py-1.5 bg-cream/30 transition-colors"
        >
          <span>Live Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Staff User Pill */}
        <div className="flex items-center gap-2 pl-3 border-l border-beige/40">
          <div className="w-7 h-7 rounded-full bg-espresso text-champagne text-xs font-serif flex items-center justify-center font-bold">
            S
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-semibold text-espresso block -mb-0.5">
              Super Admin
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">● Online</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-1.5 text-charcoal/60 hover:text-red-700 transition-colors"
          title="Sign Out of Admin Console"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
