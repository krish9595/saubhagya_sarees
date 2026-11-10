"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  FolderTree,
  Tag,
  Star,
  FileEdit,
  BarChart3,
  ShieldCheck,
  Settings,
  History,
  Store,
  Menu,
  X,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, don't show admin sidebar
  if (pathname === "/admin/login") return null;

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Inventory", href: "/admin/inventory", icon: Boxes },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Coupons & Offers", href: "/admin/coupons", icon: Tag },
    { label: "Customer Reviews", href: "/admin/reviews", icon: Star },
    { label: "Homepage CMS", href: "/admin/content", icon: FileEdit },
    { label: "Reports & Exports", href: "/admin/reports", icon: BarChart3 },
    { label: "Staff & RBAC", href: "/admin/staff", icon: ShieldCheck },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: History },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full bg-espresso text-ivory justify-between">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-chocolate/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold/40 shadow-xs shrink-0">
              <Image
                src="/brand/saubhagya-logo-crest.png"
                alt="Saubhagya Logo"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div>
              <span className="font-serif text-lg font-medium tracking-wide text-ivory uppercase block leading-none">
                Saubhagya
              </span>
              <span className="text-[8px] tracking-[0.2em] text-champagne uppercase font-bold block mt-1">
                Enterprise Admin
              </span>
            </div>
          </Link>
          <span className="bg-gold/20 text-champagne text-[9px] uppercase px-2 py-0.5 border border-gold/40 font-bold">
            Studio
          </span>
        </div>

        {/* Links list */}
        <nav aria-label="Admin Navigation" className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? "bg-gold text-espresso font-bold shadow-xs"
                    : "text-beige/80 hover:bg-chocolate hover:text-ivory"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-espresso" : "text-champagne/80"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer shortcut */}
      <div className="p-4 border-t border-chocolate/80 bg-chocolate/40 text-xs">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-beige hover:text-white transition-colors"
        >
          <Store className="w-4 h-4 text-gold" />
          <span>View Public Storefront ↗</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 border-r border-gold/20 shadow-xl z-30">
        <NavContent />
      </aside>

      {/* Mobile Top Bar with Drawer Trigger */}
      <div className="lg:hidden bg-espresso text-ivory p-4 flex items-center justify-between border-b border-chocolate">
        <div>
          <span className="font-serif text-lg font-medium text-ivory uppercase block">
            Saubhagya Admin
          </span>
          <span className="text-[9px] tracking-[0.2em] text-champagne uppercase">
            Hisar Bridal Studio
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-ivory hover:text-gold"
          aria-label="Toggle admin navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="relative z-10 w-4/5 max-w-xs h-full"
            role="dialog"
            aria-label="Admin Navigation Menu"
            aria-modal="true"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-20 text-ivory p-1"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
