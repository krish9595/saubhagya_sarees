import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import { Sparkles, MapPin, Heart, ShieldCheck, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Our Heritage & Studio | Saubhagya Sarees & Bridal Studio Hisar",
  description:
    "Learn about Saubhagya Sarees & Bridal Studio in Wholesale Cloth Market, Hisar, Haryana. Dedicated to timeless Indian ethnic grace and bespoke bridal craftsmanship.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1">
        {/* Banner */}
        <section className="bg-espresso text-ivory py-16 sm:py-24 text-center px-4 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-champagne block">
              Hisar, Haryana
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-ivory leading-tight">
              Tradition, Elegance & The Art of Dressing Beautifully
            </h1>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>
        </section>

        {/* Narrative */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5 text-xs sm:text-sm text-charcoal/80 leading-relaxed font-light">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-chocolate block">
                The Saubhagya Story
              </span>
              <h2 className="font-serif text-3xl text-espresso font-normal leading-snug">
                A Celebrated Ethnic Fashion Destination
              </h2>
              <p>
                Situated at SCF-31 in the landmark Wholesale Cloth Market, opposite Jindal Park in Hisar, Saubhagya Sarees & Bridal Studio was established with a singular vision: to bring the purest essence of Indian textile artistry and regal bridal couture to discerning women across Haryana and beyond.
              </p>
              <p>
                From heirloom Banarasi katan silks and regal Kanjeevarams to contemporary organza drapes, hand-embroidered anarkalis, and bridal lehengas, our studio serves as an intimate salon where every bride and patron finds garments worthy of life&apos;s greatest celebrations.
              </p>
            </div>
            <div className="relative aspect-4/3 bg-cream overflow-hidden border border-beige/60 shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                alt="Saubhagya Sarees Studio Craft"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-beige/40">
            <div className="p-6 bg-white border border-beige/40 shadow-xs space-y-3">
              <Sparkles className="w-6 h-6 text-gold" />
              <h3 className="font-serif text-lg font-medium text-espresso">Generational Craft</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Direct connections with certified weaver collectives in Varanasi and South India ensure authentic zari and silk integrity.
              </p>
            </div>
            <div className="p-6 bg-white border border-beige/40 shadow-xs space-y-3">
              <Heart className="w-6 h-6 text-gold" />
              <h3 className="font-serif text-lg font-medium text-espresso">Bespoke Bridal Suite</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Personalized consultations, in-studio draping sessions, and custom blouse tailoring tailored to your silhouettes.
              </p>
            </div>
            <div className="p-6 bg-white border border-beige/40 shadow-xs space-y-3">
              <ShieldCheck className="w-6 h-6 text-gold" />
              <h3 className="font-serif text-lg font-medium text-espresso">Trust & Integrity</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Clear pricing, authentic craftsmanship, and dedicated customer care for domestic and worldwide patrons.
              </p>
            </div>
          </div>

          {/* Location Banner */}
          <div className="p-8 sm:p-12 bg-cream/50 border border-beige/60 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="font-serif text-2xl text-espresso mb-1">
                Experience Our Studio in Person
              </h3>
              <p className="text-xs text-charcoal/70 max-w-xl">
                SCF-31, Phase 1, Wholesale Cloth Market, Opposite Jindal Park, Hisar, Haryana 125001. Open all 7 days from 10:30 AM to 8:30 PM.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-6 py-3.5 transition-colors shrink-0 shadow-md"
            >
              Get Studio Directions
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
