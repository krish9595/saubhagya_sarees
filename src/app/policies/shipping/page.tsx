import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full prose prose-sm text-charcoal/80">
        <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-normal mb-6">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-charcoal/60 mb-6">Last updated: November 2026</p>

        <section className="space-y-4 text-xs sm:text-sm leading-relaxed font-light">
          <h2 className="font-serif text-xl text-espresso font-medium">1. Pan-India Delivery</h2>
          <p>
            Saubhagya Sarees & Bridal Studio ships to all serviceable Indian postal codes across 28 states and 8 union territories. All consignments are dispatched from our studio warehouse in Wholesale Cloth Market, Hisar, Haryana.
          </p>

          <h2 className="font-serif text-xl text-espresso font-medium">2. Shipping Charges</h2>
          <p>
            - <strong>Orders of ₹4,999 and above:</strong> Complimentary (Free) Pan-India Shipping.<br />
            - <strong>Orders below ₹4,999:</strong> A nominal flat shipping fee of ₹150 is applied at checkout.
          </p>

          <h2 className="font-serif text-xl text-espresso font-medium">3. Dispatch & Transit Timelines</h2>
          <p>
            - Standard Ready-to-Ship Products: Dispatched within 24 to 48 business hours.<br />
            - Custom Tailored / Bridal Lehengas: 7 to 14 business days, as agreed during bridal consultation.<br />
            - Standard Courier Transit Time: 3 to 5 business days for metro and Tier-1 cities; 4 to 7 business days for regional hubs.
          </p>

          <h2 className="font-serif text-xl text-espresso font-medium">4. Courier Partners & Tracking</h2>
          <p>
            All shipments are handled by verified premium express air couriers including BlueDart, Delhivery, and DTDC. As soon as your order is manifested, you will receive an automated SMS / WhatsApp notification with your unique Airway Bill (AWB) tracking number.
          </p>
        </section>
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
