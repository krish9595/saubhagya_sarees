import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full prose prose-sm text-charcoal/80">
        <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-normal mb-6">
          Terms & Conditions
        </h1>
        <p className="text-xs text-charcoal/60 mb-6">Last updated: November 2026</p>

        <section className="space-y-4 text-xs sm:text-sm leading-relaxed font-light">
          <p>
            Welcome to the official digital platform of <strong>Saubhagya Sarees & Bridal Studio</strong>, situated at SCF-31, Wholesale Cloth Market, Hisar, Haryana. By accessing or purchasing from our platform, you agree to comply with Indian commercial and consumer laws.
          </p>

          <h2 className="font-serif text-xl text-espresso font-medium">1. Colour & Weave Variations</h2>
          <p>
            Due to the handmade nature of traditional Banarasi, Kanjeevaram and Chanderi handlooms, subtle irregularities in motifs, slubs, and yarn shading are natural attributes of authentic craftsmanship and must not be treated as defects. Hand-shot photography is color-calibrated to reflect true garment hues.
          </p>

          <h2 className="font-serif text-xl text-espresso font-medium">2. Pricing & Currency</h2>
          <p>
            All listed prices are denominated in Indian Rupees (INR) and are inclusive of standard applicable GST (5% for ethnic textiles). Prices are subject to revision prior to order confirmation.
          </p>
        </section>
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
