"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  MapPin,
  Phone,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import CartDrawer from "./CartDrawer";

interface HeaderProps {
  announcementText?: string;
  announcementBadge?: string;
}

export default function Header({
  announcementText = "Complimentary Shipping Across India on Orders Above ₹4,999 | Studio Visits: Wholesale Cloth Market, Hisar",
  announcementBadge = "NEW FESTIVE EDIT",
}: HeaderProps) {
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    {
      label: "Shop",
      href: "/shop",
      megaMenu: true,
      items: [
        { name: "All Collections", href: "/shop", desc: "Browse full catalogue" },
        { name: "Sarees", href: "/shop/sarees", desc: "Banarasi, Kanjeevaram & Organza" },
        { name: "Bridal Suite", href: "/shop/bridal", desc: "Lehengas & Wedding Ensembles" },
        { name: "Suits & Anarkalis", href: "/shop/suits", desc: "Chanderi, Sharara & Anarkali" },
        { name: "Kurtis & Tunics", href: "/shop/kurtis", desc: "Silk and festive essentials" },
        { name: "Dresses & Gowns", href: "/shop/dresses", desc: "Indo-Western & Fusion" },
      ],
      editorial: {
        title: "The Royal Silk Legacy",
        subtitle: "Handloom Banarasi Katan & South Silks",
        href: "/shop/sarees",
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
      },
    },
    { label: "About", href: "/about" },
    { label: "Our Store", href: "/contact" },
  ];

  return (
    <>
      <header className="w-full z-40 relative">
        {/* Top Announcement Bar */}
        <div className="bg-espresso text-ivory px-4 py-2 text-xs tracking-wider border-b border-gold/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-center">
            <div className="hidden lg:flex items-center gap-4 text-beige/70 text-[11px]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                Hisar Wholesale Cloth Market
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gold" />
                +91 99960 88960
              </span>
            </div>

            <div className="w-full lg:w-auto flex items-center justify-center gap-2">
              <span className="bg-gold/20 text-champagne px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest border border-gold/40">
                {announcementBadge}
              </span>
              <span className="text-[11px] sm:text-xs text-ivory/95 font-medium">
                {announcementText}
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-3 text-[11px] text-beige/80">
              <Link href="/track-order" className="hover:text-gold transition-colors">
                Track Order
              </Link>
              <span>|</span>
              <Link href="/admin/login" className="hover:text-gold transition-colors">
                Staff Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Main Sticky Navigation Bar */}
        <nav
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? "fixed top-0 left-0 bg-ivory/95 backdrop-blur-md shadow-md py-3 border-b border-beige/60 z-40"
              : "bg-ivory py-4 border-b border-beige/40"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left: Mobile Menu Trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-espresso hover:text-gold transition-colors"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-espresso hover:text-gold transition-colors ml-1"
                aria-label="Open search dialog"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo - Centered on mobile, Left on desktop */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 group">
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-full overflow-hidden border border-gold/40 shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/brand/saubhagya-logo-crest.png"
                    alt="Saubhagya Sarees & Bridal Studio Logo"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 36px, 44px"
                  />
                </div>
                <div className="text-left">
                  <span className="block font-serif text-xl sm:text-2xl lg:text-2xl font-normal tracking-wide text-espresso uppercase group-hover:text-gold transition-colors leading-none">
                    Saubhagya
                  </span>
                  <span className="block text-[8px] sm:text-[9.5px] tracking-[0.25em] text-chocolate/80 uppercase font-medium mt-1">
                    Sarees & Bridal Studio
                  </span>
                </div>
              </Link>
            </div>

            {/* Center Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => link.megaMenu && setActiveMegaMenu(link.label)}
                  onMouseLeave={() => link.megaMenu && setActiveMegaMenu(null)}
                >
                  <Link
                    href={link.href}
                    className="text-xs uppercase tracking-widest font-medium transition-colors py-2 flex items-center gap-1 text-espresso/90 hover:text-gold"
                  >
                    {link.label}
                    {link.megaMenu && <ChevronDown className="w-3 h-3 opacity-60" />}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {link.megaMenu && activeMegaMenu === link.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[680px] bg-ivory border border-beige/60 shadow-2xl p-6 grid grid-cols-2 gap-6 z-50 animate-smooth-in gpu-accelerate">
                      <div>
                        <h4 className="text-[11px] uppercase tracking-widest font-bold text-gold border-b border-beige/40 pb-2 mb-3">
                          Curated Collections
                        </h4>
                        <div className="space-y-3">
                          {link.items?.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="group/item block"
                            >
                              <div className="text-sm font-serif font-medium text-espresso group-hover/item:text-gold transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-charcoal/60">
                                {item.desc}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {link.editorial && (
                        <div className="relative bg-cream/70 p-4 border border-beige/40 flex flex-col justify-end overflow-hidden group/edit">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/edit:scale-105"
                            style={{ backgroundImage: `url(${link.editorial.image})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/50 to-transparent opacity-85" />
                          <div className="relative z-10 text-ivory p-2">
                            <span className="text-[9px] uppercase tracking-widest bg-gold text-white px-2 py-0.5 font-bold mb-2 inline-block">
                              Featured Edit
                            </span>
                            <h5 className="font-serif text-lg font-medium text-white mb-1">
                              {link.editorial.title}
                            </h5>
                            <p className="text-xs text-beige/80 mb-3">
                              {link.editorial.subtitle}
                            </p>
                            <Link
                              href={link.editorial.href}
                              className="text-xs uppercase tracking-wider text-champagne hover:text-white font-semibold flex items-center gap-1"
                            >
                              Explore Handlooms →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Icons: Search, Wishlist, Account, Cart */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex items-center text-espresso hover:text-gold transition-colors p-2"
                aria-label="Search catalogue"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/account"
                className="text-espresso hover:text-gold transition-colors p-2"
                aria-label="Customer Account"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/wishlist"
                className="relative text-espresso hover:text-gold transition-colors p-2"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-chocolate hover:bg-espresso text-ivory px-3.5 py-2 flex items-center gap-2 transition-colors group shadow-xs"
                aria-label={`Shopping bag with ${itemCount} items`}
              >
                <ShoppingBag className="w-4 h-4 text-champagne" />
                <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline-block">
                  Bag
                </span>
                <span className="bg-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Modern Web Guidance: Native dialog for search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs"
            onClick={() => setSearchOpen(false)}
            aria-hidden="true"
          />
          <div
            className="relative z-10 w-full max-w-2xl bg-ivory border border-beige/60 shadow-2xl p-6 sm:p-8"
            role="dialog"
            aria-label="Product Search"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 border-b border-beige/40">
              <h3 className="text-xl font-serif text-espresso font-medium flex items-center gap-2">
                <Search className="w-5 h-5 text-gold" />
                Search Saubhagya Catalogue
              </h3>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-charcoal/60 hover:text-espresso"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-6">
              <div className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by saree type, bridal lehenga, fabric, colour, or SKU..."
                  className="w-full pl-4 pr-12 py-3.5 bg-cream/30 border border-beige/80 text-sm focus:outline-none focus:border-gold text-charcoal"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-chocolate hover:text-gold"
                  aria-label="Submit Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-charcoal/70">
                <span className="text-[11px] font-semibold text-espresso uppercase tracking-wider">
                  Popular Searches:
                </span>
                {["Banarasi Katan", "Bridal Velvet Lehenga", "Organza Sarees", "Emerald Anarkali", "Sharara Sets"].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        router.push(`/search?q=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className="px-2.5 py-1 bg-cream/70 hover:bg-beige/40 text-charcoal border border-beige/40 rounded-none transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer conforming to modern web guidance */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="relative z-10 w-4/5 max-w-xs bg-ivory text-charcoal h-full flex flex-col shadow-2xl border-r border-beige/40"
            role="dialog"
            aria-label="Mobile Navigation"
            aria-modal="true"
          >
            <div className="p-5 border-b border-beige/40 flex items-center justify-between bg-cream/30">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden border border-gold/40 shadow-xs">
                  <Image
                    src="/brand/saubhagya-logo-crest.png"
                    alt="Saubhagya Logo"
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </div>
                <div>
                  <span className="font-serif text-lg font-medium tracking-wide text-espresso uppercase block leading-none">
                    Saubhagya
                  </span>
                  <span className="text-[8px] tracking-[0.2em] text-chocolate/80 uppercase font-semibold mt-0.5 block">
                    Hisar Bridal Studio
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-charcoal/70 hover:text-espresso"
                aria-label="Close mobile navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2.5 px-3 text-sm font-medium tracking-wider uppercase transition-colors text-espresso hover:bg-cream/40"
                    >
                      {link.label}
                    </Link>
                    {link.items && (
                      <div className="pl-4 py-1 space-y-1 bg-cream/20 border-l border-gold/40 my-1">
                        {link.items.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1.5 px-3 text-xs text-charcoal/80 hover:text-gold"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-beige/40 space-y-2">
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-wider text-charcoal/80 py-1.5 px-3 hover:text-gold"
                >
                  Track Your Order
                </Link>
                <Link
                  href="/policies/shipping"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-wider text-charcoal/80 py-1.5 px-3 hover:text-gold"
                >
                  Shipping & Delivery Policy
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-wider text-gold py-1.5 px-3 font-semibold"
                >
                  Staff Admin Login
                </Link>
              </div>

              <div className="pt-4 border-t border-beige/40 text-xs text-charcoal/70 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>Wholesale Cloth Market, Hisar, Haryana</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold shrink-0" />
                  <span>+91 99960 88960</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Cart Drawer Component */}
      <CartDrawer />
    </>
  );
}
