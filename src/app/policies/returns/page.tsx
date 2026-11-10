import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full prose prose-sm text-charcoal/80">
        <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-normal mb-6">
          Return, Exchange & Cancellation Policy
        </h1>
        <p className="text-xs text-charcoal/60 mb-6">Last updated: November 2026</p>

        <section className="space-y-4 text-xs sm:text-sm leading-relaxed font-light">
          <h2 className="font-serif text-xl text-espresso font-medium">1. Handloom & Ethnic Garment Exchange</h2>
          <p>
            Due to the delicate nature of handwoven sarees, pure silks, and bridal embroideries, we uphold rigorous quality benchmarks. If you receive an item with a transit defect or fabric defect, you may request an exchange within <strong>7 days</strong> of verified delivery.
          </p>

          <h2 className="font-serif text-xl text-espresso font-medium">2. Eligibility Criteria</h2>
          <p>
            - The garment must remain unworn, unaltered, unwashed with original brand tags and security seals intact.<br />
            - The original bill and packaging must be preserved.<br />
            - Bespoke, made-to-measure bridal lehengas customized to individual body dimensions are non-returnable, but complimentary alteration support is gladly extended at our studio.
          </p>

          <h2 className="font-serif text-xl text-espresso font-medium">3. Cancellation Window</h2>
          <p>
            Orders can be cancelled before dispatch (within 12 hours of placement) by calling our studio at +91 99960 88960. Once dispatched to the courier, cancellations cannot be accepted.
          </p>
        </section>
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
