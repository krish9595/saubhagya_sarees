import React from "react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import ProductCard from "@/components/product/ProductCard";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Crown,
  ChevronRight,
} from "lucide-react";
import InstagramIcon from "@/components/common/InstagramIcon";

export const revalidate = 60; // ISR every 60 seconds

async function getHomepageData() {
  const [categories, newArrivals, bestsellers, cmsSections] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", isNewArrival: true },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        category: true,
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", isBestseller: true },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        category: true,
      },
      take: 4,
      orderBy: { salesCount: "desc" },
    }),
    prisma.homepageSection.findMany({
      where: { isActive: true },
    }),
  ]);

  const sectionsMap = new Map(cmsSections.map((s) => [s.sectionKey, s]));
  return { categories, newArrivals, bestsellers, sectionsMap };
}

export default async function HomePage() {
  const { categories, newArrivals, bestsellers, sectionsMap } = await getHomepageData();

  // Parse CMS content with graceful fallbacks
  const announcementData = sectionsMap.has("announcement_bar")
    ? JSON.parse(sectionsMap.get("announcement_bar")!.contentJson)
    : null;

  const heroData = sectionsMap.has("hero_section")
    ? JSON.parse(sectionsMap.get("hero_section")!.contentJson)
    : null;

  const bridalData = sectionsMap.has("bridal_feature")
    ? JSON.parse(sectionsMap.get("bridal_feature")!.contentJson)
    : null;

  const brandStoryData = sectionsMap.has("brand_story")
    ? JSON.parse(sectionsMap.get("brand_story")!.contentJson)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      {/* Header */}
      <Header
        announcementText={announcementData?.text}
        announcementBadge={announcementData?.badge}
      />

      <main className="flex-1">
        {/* ======================================================== */}
        {/* HERO SECTION — LUXURY INDIAN ETHNIC CAMPAIGN             */}
        {/* ======================================================== */}
        <section className="relative w-full min-h-[580px] lg:min-h-[720px] bg-espresso overflow-hidden flex items-center">
          {/* Background Image with warm gradient overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-102"
            style={{
              backgroundImage: `url(${heroData?.desktopImage || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=85"})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/60 to-transparent" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-espresso/30 to-espresso/80" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-xl text-left space-y-6">
              <div className="inline-flex items-center gap-2 bg-gold/25 border border-gold/40 px-3.5 py-1 text-[11px] uppercase tracking-[0.25em] text-champagne font-semibold shadow-xs">
                <Crown className="w-3.5 h-3.5 text-gold" />
                <span>{heroData?.tagline || "Saubhagya Bridal Studio • Hisar"}</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-ivory tracking-tight leading-[1.08]">
                {heroData?.headline || "Elegance Woven in Tradition"}
              </h1>

              <p className="text-sm sm:text-base text-beige/90 leading-relaxed font-light max-w-lg">
                {heroData?.subheadline ||
                  "Discover timeless sarees, exquisite bridal ensembles and thoughtfully curated ethnic fashion for every celebration."}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href={heroData?.cta1Link || "/shop"}
                  className="bg-gold hover:bg-champagne text-espresso font-semibold text-xs uppercase tracking-widest px-8 py-4 text-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {heroData?.cta1Text || "Explore Collections"}
                </Link>

                <Link
                  href={heroData?.cta2Link || "/shop/bridal"}
                  className="border border-ivory/60 hover:border-gold hover:bg-gold/15 text-ivory text-xs uppercase tracking-widest font-semibold px-8 py-4 text-center transition-all duration-300 backdrop-blur-xs"
                >
                  {heroData?.cta2Text || "Discover Bridal"}
                </Link>
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-beige/70">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  <span>Wholesale Cloth Market Studio</span>
                </div>
                <span>•</span>
                <span>Custom Bridal Measurements</span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SHOP BY CATEGORY                                         */}
        {/* ======================================================== */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block mb-2">
              Curated Masterpieces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso">
              Shop by Category
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className="group relative aspect-4/5 bg-cream/30 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 border border-beige/40 flex flex-col justify-end p-5"
              >
                <Image
                  src={cat.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/40 to-transparent group-hover:from-espresso transition-colors duration-500" />

                <div className="relative z-10 text-ivory">
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-ivory group-hover:text-champagne transition-colors mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-beige/80 line-clamp-1 mb-2 font-light">
                    {cat.description || "Explore curated ethnic designs"}
                  </p>
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-gold group-hover:text-white flex items-center gap-1">
                    Explore Collection <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* NEW ARRIVALS CAROUSEL / GRID                             */}
        {/* ======================================================== */}
        <section className="py-16 sm:py-20 bg-cream/30 border-y border-beige/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 pb-4 border-b border-beige/50">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-chocolate block mb-1">
                  Fresh from the studio
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-espresso font-normal">
                  New Arrivals
                </h2>
              </div>
              <Link
                href="/shop?filter=new"
                className="mt-3 sm:mt-0 text-xs uppercase tracking-widest font-semibold text-chocolate hover:text-gold flex items-center gap-1.5 transition-colors"
              >
                <span>View All New Additions</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.map((prod) => (
                <ProductCard key={prod.id} product={prod as any} />
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* EDITORIAL BRIDAL FEATURE SECTION                         */}
        {/* ======================================================== */}
        <section className="py-20 lg:py-28 bg-chocolate text-ivory relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{
              backgroundImage: `url(${bridalData?.bannerImage || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1600"})`,
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs uppercase tracking-[0.3em] text-champagne font-semibold flex items-center gap-2">
                  <Crown className="w-4 h-4 text-gold" />
                  {bridalData?.eyebrow || "The Bridal Suite"}
                </span>

                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-ivory leading-tight">
                  {bridalData?.headline || "For Moments That Become Memories"}
                </h2>

                <p className="text-sm sm:text-base text-beige/90 leading-relaxed font-light max-w-xl">
                  {bridalData?.description ||
                    "Discover exquisite bridal and wedding occasionwear, thoughtfully curated for your most special celebrations."}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-center">
                  <div className="p-3 bg-espresso/60 border border-gold/20">
                    <span className="block font-serif text-lg text-champagne">Bridal Lehengas</span>
                    <span className="text-[10px] text-beige/70 uppercase tracking-wider">Micro Velvet & Silk</span>
                  </div>
                  <div className="p-3 bg-espresso/60 border border-gold/20">
                    <span className="block font-serif text-lg text-champagne">Wedding Sarees</span>
                    <span className="text-[10px] text-beige/70 uppercase tracking-wider">Kanjeevaram & Banarasi</span>
                  </div>
                  <div className="p-3 bg-espresso/60 border border-gold/20">
                    <span className="block font-serif text-lg text-champagne">Reception Gowns</span>
                    <span className="text-[10px] text-beige/70 uppercase tracking-wider">Handcrafted Fusion</span>
                  </div>
                  <div className="p-3 bg-espresso/60 border border-gold/20">
                    <span className="block font-serif text-lg text-champagne">Sangeet & Festive</span>
                    <span className="text-[10px] text-beige/70 uppercase tracking-wider">Shararas & Anarkalis</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href={bridalData?.ctaLink || "/shop/bridal"}
                    className="inline-flex items-center gap-3 bg-gold hover:bg-champagne text-espresso font-semibold text-xs uppercase tracking-widest px-8 py-4 shadow-xl transition-all"
                  >
                    <span>{bridalData?.ctaText || "Discover Bridal Collection"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative aspect-3/4 max-w-md mx-auto bg-espresso border-4 border-gold/30 shadow-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
                    alt="Saubhagya Bridal Trousseau"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-espresso/90 border border-gold/30 text-center">
                    <p className="font-serif text-base text-champagne">
                      Bespoke Bridal Consultations
                    </p>
                    <p className="text-[11px] text-beige/80">
                      Visit our Hisar studio or book online WhatsApp assistance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* BESTSELLERS                                              */}
        {/* ======================================================== */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block mb-2">
              Beloved by our patrons
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso">
              Studio Bestsellers
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.map((prod) => (
              <ProductCard key={prod.id} product={prod as any} />
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* BRAND STORY & PHILOSOPHY                                 */}
        {/* ======================================================== */}
        <section className="py-16 sm:py-24 bg-cream/40 border-y border-beige/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-6 relative aspect-4/3 sm:aspect-square bg-cream overflow-hidden border border-beige/60 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80"
                  alt="Saubhagya Sarees Store Craftsmanship"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="md:col-span-6 space-y-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-chocolate block">
                  {brandStoryData?.eyebrow || "Our Philosophy"}
                </span>

                <h2 className="font-serif text-3xl sm:text-4xl text-espresso font-normal leading-tight">
                  {brandStoryData?.headline || "Tradition, Elegance & The Art of Dressing Beautifully"}
                </h2>

                <p className="text-sm text-charcoal/80 leading-relaxed font-light">
                  {brandStoryData?.body ||
                    "Located in the heart of Hisar at the Wholesale Cloth Market, Saubhagya Sarees & Bridal Studio has been a cherished ethnic fashion destination for women seeking timeless grace. From opulent bridal trousseaus and pure Kanjeevaram silks to breezy festive suits and contemporary fusion dresses, our studio curates attire that celebrates the warmth and vibrancy of Indian culture."}
                </p>

                <div className="pt-2 border-t border-beige/60 space-y-3 text-xs text-charcoal/80">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span>
                      {brandStoryData?.storeLocation ||
                        "SCF-31, Phase 1, Wholesale Cloth Market, Opposite Jindal Park, Tayal Bagh Colony, Hisar, Haryana 125001"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-gold shrink-0" />
                    <span>{brandStoryData?.phone || "+91 99960 88960"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-gold shrink-0" />
                    <span>{brandStoryData?.hours || "Monday to Sunday: 10:30 AM – 8:30 PM"}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-chocolate hover:text-gold transition-colors"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* INSTAGRAM GALLERY                                        */}
        {/* ======================================================== */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block mb-2">
              Instagram Showcase
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-espresso font-normal">
              Follow Our Journey
            </h2>
            <p className="text-xs text-charcoal/70 mt-2">
              Join our community <strong className="text-espresso">@saubhagya_sarees_31</strong> for real bridal captures, festive styling and live arrivals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
              "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500",
              "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
              "https://images.unsplash.com/photo-1583391733975-08149ebffb5e?w=500",
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
              "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
            ].map((url, idx) => (
              <a
                key={idx}
                href="https://www.instagram.com/saubhagya_sarees_31/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square bg-cream overflow-hidden shadow-xs hover:shadow-lg transition-all"
              >
                <Image
                  src={url}
                  alt={`Saubhagya Instagram post ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-espresso/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <InstagramIcon className="w-6 h-6 text-champagne transform group-hover:scale-110 transition-transform" />
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="https://www.instagram.com/saubhagya_sarees_31/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-espresso hover:bg-chocolate text-ivory text-xs uppercase tracking-widest font-semibold px-6 py-3.5 shadow-md transition-colors"
            >
              <InstagramIcon className="w-4 h-4 text-gold" />
              <span>Follow @saubhagya_sarees_31 on Instagram</span>
            </a>
          </div>
        </section>

        {/* ======================================================== */}
        {/* STORE LOCATION & VISIT                                   */}
        {/* ======================================================== */}
        <section className="py-16 sm:py-20 bg-cream/60 border-t border-beige/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 sm:p-10 border border-beige/60 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block">
                  Studio Flagship Visit
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-espresso font-normal">
                  Visit Saubhagya Sarees & Bridal Studio
                </h3>
                <p className="text-xs text-charcoal/80 leading-relaxed font-light">
                  Experience our royal fabrics, bridal lehengas, and handloom silks in person. Our studio assistants and bridal consultants are delighted to assist you in selecting your dream wedding trousseau.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 text-xs text-charcoal/80">
                  <div className="p-3.5 bg-ivory border border-beige/40 space-y-1">
                    <strong className="text-espresso block font-medium">Studio Address:</strong>
                    <p className="text-[11px] text-charcoal/70">
                      SCF-31, Phase 1, Wholesale Cloth Market, Opposite Jindal Park, Tayal Bagh Colony, Hisar, Haryana 125001
                    </p>
                  </div>
                  <div className="p-3.5 bg-ivory border border-beige/40 space-y-1">
                    <strong className="text-espresso block font-medium">Operating Hours:</strong>
                    <p className="text-[11px] text-charcoal/70">
                      Monday to Sunday: 10:30 AM – 8:30 PM (All 7 Days Open)
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-4">
                  <a
                    href="https://share.google/Qec4AEsinZqmrXiUL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-5 py-3 transition-colors shadow-xs"
                  >
                    <MapPin className="w-4 h-4 text-gold" />
                    <span>Get Google Maps Directions</span>
                  </a>

                  <a
                    href="tel:+919996088960"
                    className="inline-flex items-center gap-2 border border-chocolate hover:bg-cream text-chocolate text-xs uppercase tracking-widest font-semibold px-5 py-3 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call +91 99960 88960</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-16/10 sm:aspect-4/3 bg-cream overflow-hidden border border-beige/50">
                <iframe
                  title="Saubhagya Sarees Hisar Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3485.47648352824!2d75.725!3d29.155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDA5JzE4LjAiTiA3NcKwNDMnMzAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                  className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer & Mobile Bottom Bar */}
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
