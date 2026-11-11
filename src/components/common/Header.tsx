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
  ChevronRight,
  Sparkles,
  MapPin,
  Phone,
  Crown,
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
  const [mobileShopExpanded, setMobileShopExpanded] = useState(true);

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
        <div className="bg-espresso text-ivory text-xs tracking-wider border-b border-gold/30">
          {/* Desktop Announcement Layout (100% UNCHANGED) */}
          <div className="hidden lg:flex max-w-7xl mx-auto px-4 py-2 items-center justify-between text-center">
            <div className="flex items-center gap-4 text-beige/70 text-[11px]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                Hisar Wholesale Cloth Market
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gold" />
                +91 99960 88960
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="bg-gold/20 text-champagne px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest border border-gold/40">
                {announcementBadge}
              </span>
              <span className="text-xs text-ivory/95 font-medium">
                {announcementText}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-beige/80">
              <Link href="/track-order" className="hover:text-gold transition-colors">
                Track Order
              </Link>
              <span>|</span>
              <Link href="/admin/login" className="hover:text-gold transition-colors">
                Staff Portal
              </Link>
            </div>
          </div>

          {/* Mobile Announcement Bar (Slim, Elegant, Single-line) */}
          <div className="lg:hidden px-3 py-1.5 flex items-center justify-center text-center overflow-hidden">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-ivory/95 font-medium truncate">
              <span className="bg-gold/20 text-champagne px-1.5 py-0.2 uppercase font-bold tracking-wider text-[9px] border border-gold/40 shrink-0">
                {announcementBadge}
              </span>
              <span className="truncate">
                Free Pan-India Delivery on Orders ₹4,999+ • Hisar Studio
              </span>
            </div>
          </div>
        </div>

        {/* Main Sticky Navigation Bar */}
        <nav
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? "fixed top-0 left-0 bg-ivory/95 backdrop-blur-md shadow-md py-2.5 lg:py-3 border-b border-beige/60 z-40"
              : "bg-ivory py-3 lg:py-4 border-b border-beige/40"
          }`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left: Mobile Controls (Menu Trigger & Search) */}
            <div className="flex items-center lg:hidden gap-0.5 shrink-0 w-16">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 text-espresso hover:text-gold transition-colors"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 text-espresso hover:text-gold transition-colors"
                aria-label="Open search dialog"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Brand Logo - Centered on mobile, Left on desktop */}
            <div className="flex-1 lg:flex-none flex justify-center lg:justify-start items-center min-w-0 px-1">
              <Link href="/" className="inline-flex items-center gap-1.5 sm:gap-3 group max-w-full">
                <div className="relative w-7 h-7 sm:w-11 sm:h-11 shrink-0 rounded-full overflow-hidden border border-gold/40 shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/brand/saubhagya-logo-crest.png"
                    alt="Saubhagya Sarees & Bridal Studio Logo"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 28px, 44px"
                  />
                </div>
                <div className="text-left shrink min-w-0">
                  <span className="block font-serif text-base sm:text-2xl font-normal tracking-wide text-espresso uppercase group-hover:text-gold transition-colors leading-none truncate">
                    Saubhagya
                  </span>
                  <span className="block text-[7px] sm:text-[9.5px] tracking-[0.16em] sm:tracking-[0.25em] text-chocolate/80 uppercase font-medium mt-0.5 truncate">
                    Sarees & Bridal Studio
                  </span>
                </div>
              </Link>
            </div>

            {/* Center Desktop Navigation (100% UNCHANGED) */}
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

            {/* Right Icons */}
            <div className="flex items-center justify-end space-x-1.5 sm:space-x-3 lg:space-x-4 shrink-0 w-16 lg:w-auto">
              {/* Desktop-only Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex items-center text-espresso hover:text-gold transition-colors p-2"
                aria-label="Search catalogue"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Desktop-only Account button (on mobile, accessible via bottom bar & drawer) */}
              <Link
                href="/account"
                className="hidden lg:flex text-espresso hover:text-gold transition-colors p-2"
                aria-label="Customer Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative text-espresso hover:text-gold transition-colors p-1.5 sm:p-2"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-gold text-white text-[9px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button: Desktop uses full pill; Mobile uses sleek compact icon button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="hidden lg:flex relative bg-chocolate hover:bg-espresso text-ivory px-3.5 py-2 items-center gap-2 transition-colors group shadow-xs"
                aria-label={`Shopping bag with ${itemCount} items`}
              >
                <ShoppingBag className="w-4 h-4 text-champagne" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Bag
                </span>
                <span className="bg-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {itemCount}
                </span>
              </button>

              {/* Mobile-only compact Bag trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="lg:hidden relative p-1.5 text-espresso hover:text-gold transition-colors"
                aria-label={`Open shopping bag (${itemCount} items)`}
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0 bg-chocolate text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-charcoal/70 backdrop-blur-xs">
          <div
            className="fixed inset-0"
            onClick={() => setSearchOpen(false)}
            aria-hidden="true"
          />
          <div
            className="relative z-10 w-full max-w-2xl bg-ivory border border-beige/60 shadow-2xl p-6"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-beige/40">
              <span className="text-xs uppercase tracking-widest font-semibold text-chocolate">
                Search Collections & Designs
              </span>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-charcoal/60 hover:text-espresso"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-4">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by fabric, color, occasion (e.g. Banarasi, Red, Bridal)..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-beige/60 focus:outline-none focus:border-gold font-serif text-base text-espresso"
                  autoFocus
                />
                <Search className="w-5 h-5 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-charcoal/70">
                <span className="text-[11px] font-semibold text-espresso uppercase tracking-wider">
                  Popular:
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
                      className="px-2 py-0.5 bg-cream/70 hover:bg-beige/40 text-charcoal text-[11px] border border-beige/40 transition-colors"
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

      {/* Redesigned Luxury Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="relative z-10 w-[84%] max-w-sm bg-ivory text-charcoal h-full flex flex-col shadow-2xl border-r border-beige/40 overflow-hidden"
            role="dialog"
            aria-label="Mobile Navigation Drawer"
            aria-modal="true"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-beige/40 flex items-center justify-between bg-cream/40">
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

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* Primary Navigation Links */}
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 text-xs font-semibold tracking-wider uppercase text-espresso hover:bg-cream/40 transition-colors"
                >
                  Home
                </Link>

                {/* Expandable Shop All Collections */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileShopExpanded(!mobileShopExpanded)}
                    className="w-full flex items-center justify-between py-2.5 px-3 text-xs font-semibold tracking-wider uppercase text-espresso hover:bg-cream/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-gold" />
                      Shop Collections
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-charcoal/60 transition-transform duration-200 ${
                        mobileShopExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileShopExpanded && (
                    <div className="pl-4 py-1 space-y-1 bg-cream/30 border-l-2 border-gold/60 my-1 rounded-xs">
                      <Link
                        href="/shop"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 px-3 text-xs font-medium text-chocolate hover:text-gold"
                      >
                        All Collections (Full Catalogue)
                      </Link>
                      <Link
                        href="/shop/sarees"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 px-3 text-xs text-charcoal/80 hover:text-gold"
                      >
                        Sarees (Banarasi, Kanjeevaram, Organza)
                      </Link>
                      <Link
                        href="/shop/bridal"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 px-3 text-xs text-charcoal/80 hover:text-gold flex items-center justify-between"
                      >
                        <span>Bridal Collection & Lehengas</span>
                        <span className="text-[9px] bg-gold/20 text-chocolate px-1.5 py-0.2 font-bold uppercase">
                          Bridal
                        </span>
                      </Link>
                      <Link
                        href="/shop/suits"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 px-3 text-xs text-charcoal/80 hover:text-gold"
                      >
                        Suits, Anarkalis & Shararas
                      </Link>
                      <Link
                        href="/shop/kurtis"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 px-3 text-xs text-charcoal/80 hover:text-gold"
                      >
                        Kurtis & Festive Tunics
                      </Link>
                      <Link
                        href="/shop/dresses"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 px-3 text-xs text-charcoal/80 hover:text-gold"
                      >
                        Dresses & Fusion Gowns
                      </Link>
                      <Link
                        href="/shop?filter=new"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 px-3 text-xs font-semibold text-gold hover:text-espresso"
                      >
                        ✦ New Arrivals
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 text-xs font-semibold tracking-wider uppercase text-espresso hover:bg-cream/40 transition-colors"
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 text-xs font-semibold tracking-wider uppercase text-espresso hover:bg-cream/40 transition-colors"
                >
                  Our Hisar Store
                </Link>

                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 text-xs font-semibold tracking-wider uppercase text-espresso hover:bg-cream/40 transition-colors"
                >
                  Track Order
                </Link>
              </div>

              {/* Account & Policies */}
              <div className="pt-3 border-t border-beige/40 space-y-1 text-xs">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 text-charcoal/80 hover:text-gold uppercase tracking-wider text-[11px]"
                >
                  My Account / Saved Orders
                </Link>
                <Link
                  href="/policies/shipping"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 text-charcoal/80 hover:text-gold uppercase tracking-wider text-[11px]"
                >
                  Shipping & Pan-India Delivery
                </Link>
                <Link
                  href="/policies/returns"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 text-charcoal/80 hover:text-gold uppercase tracking-wider text-[11px]"
                >
                  Returns & Exchanges Policy
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 text-gold font-bold uppercase tracking-wider text-[11px]"
                >
                  Staff Admin Login ↗
                </Link>
              </div>

              {/* Store Address & Contact */}
              <div className="pt-3 border-t border-beige/40 text-xs text-charcoal/80 space-y-2 bg-cream/30 p-3 border border-beige/40">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">
                    SCF-31, Phase 1, Wholesale Cloth Market, Opposite Jindal Park, Tayal Bagh Colony, Hisar, Haryana 125001
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gold shrink-0" />
                  <a href="tel:+919996088960" className="text-[11px] font-semibold text-espresso">
                    +91 99960 88960
                  </a>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Assistance at bottom of drawer */}
            <div className="p-4 border-t border-beige/40 bg-white">
              <a
                href="https://wa.me/919996088960?text=Namaste!%20I%20would%20like%20to%20enquire%20about%20bridal%20and%20saree%20collections."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs hover:bg-[#20ba59] transition-colors"
              >
                <span>WhatsApp Studio Assistance</span>
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* Cart Drawer Component */}
      <CartDrawer />
    </>
  );
}
