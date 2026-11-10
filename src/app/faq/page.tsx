import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Saubhagya Sarees & Bridal Studio",
  description: "Answers about handloom care, bridal custom measurements, delivery times, and payments.",
};

const faqs = [
  {
    q: "How can I be assured of the authenticity of your Banarasi and Silk sarees?",
    a: "Every pure silk creation at Saubhagya Sarees is woven from authentic mulberry silk and certified by authorized weaver clusters. We maintain long-standing direct relationships with generational master weavers in Varanasi, Kanchipuram and Chanderi.",
  },
  {
    q: "Do you offer custom stitching and measurements for bridal lehengas and blouses?",
    a: "Yes. Our bridal studio in Hisar provides bespoke tailoring for lehengas, bridal blouses and suits. You can provide your measurements during checkout or connect directly via WhatsApp at +91 99960 88960 with our master tailor.",
  },
  {
    q: "What are your shipping timelines across India?",
    a: "Ready-to-wear sarees and unstitched suits are dispatched within 24 to 48 hours via premium express air couriers (BlueDart / Delhivery / DTDC), typically reaching major cities in 3 to 5 business days. Custom-stitched bridal ensembles take 7 to 14 days depending on hand embroidery requirements.",
  },
  {
    q: "What payment methods are supported on your platform?",
    a: "We accept all major Indian payment methods through our secure Razorpay gateway: UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay, Visa, Mastercard, and Net Banking across all scheduled Indian banks. Cash on Delivery (COD) is also available.",
  },
  {
    q: "Can I visit your physical studio to view the collections?",
    a: "Absolutely. Our flagship studio is located at SCF-31, Phase 1, Wholesale Cloth Market, Opposite Jindal Park, Tayal Bagh Colony, Hisar, Haryana 125001. We are open all 7 days from 10:30 AM to 8:30 PM.",
  },
  {
    q: "How do I care for my handloom saree or zardozi lehenga?",
    a: "All fine ethnic garments should be dry-cleaned only. We recommend wrapping pure silk sarees in breathable cotton or muslin fabric and storing them flat in a cool, dry place. Avoid direct spray of perfumes or deodorants on zari threads.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block mb-1">
            Customer Assistance
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-espresso font-normal">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-charcoal/70 mt-2">
            Everything you need to know about our bridal studio, ordering, tailoring and shipping.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white p-6 border border-beige/40 shadow-xs space-y-2">
              <h3 className="font-serif text-lg font-medium text-espresso">{f.q}</h3>
              <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">{f.a}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
