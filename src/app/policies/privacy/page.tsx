import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full prose prose-sm text-charcoal/80">
        <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-normal mb-6">
          Privacy Policy
        </h1>
        <p className="text-xs text-charcoal/60 mb-6">Last updated: November 2026</p>

        <section className="space-y-4 text-xs sm:text-sm leading-relaxed font-light">
          <p>
            At Saubhagya Sarees & Bridal Studio, your privacy is sacred. We never sell, rent or compromise our customers&apos; personal information to third parties.
          </p>

          <h2 className="font-serif text-xl text-espresso font-medium">1. Data We Collect</h2>
          <p>
            We collect basic contact details (name, phone number, shipping address, email) solely to process your orders, fulfill delivery, issue tax invoices, and communicate transactional dispatch updates via SMS and WhatsApp.
          </p>

          <h2 className="font-serif text-xl text-espresso font-medium">2. Payment Security</h2>
          <p>
            All online financial transactions are handled exclusively through PCI-DSS Level 1 certified payment gateways (Razorpay). We do not record or store debit card, credit card, CVV, or banking passwords on our servers.
          </p>
        </section>
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
