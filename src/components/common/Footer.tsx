"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import InstagramIcon from "@/components/common/InstagramIcon";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setMsg(data.message || "Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMsg(data.message || "Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again later.");
    }
  };

  return (
    <footer className="w-full bg-espresso text-ivory pt-16 pb-24 lg:pb-12 border-t border-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Propositions Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 mb-12 border-b border-chocolate">
          <div className="flex items-center gap-3.5 p-4 bg-chocolate/30 border border-gold/15">
            <Sparkles className="w-6 h-6 text-gold shrink-0" />
            <div>
              <h5 className="font-serif text-sm font-semibold text-ivory">Authentic Handlooms</h5>
              <p className="text-[11px] text-beige/70">Certified pure silks & generational weaves</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-4 bg-chocolate/30 border border-gold/15">
            <Truck className="w-6 h-6 text-gold shrink-0" />
            <div>
              <h5 className="font-serif text-sm font-semibold text-ivory">Complimentary Delivery</h5>
              <p className="text-[11px] text-beige/70">Pan-India free shipping above ₹4,999</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-4 bg-chocolate/30 border border-gold/15">
            <ShieldCheck className="w-6 h-6 text-gold shrink-0" />
            <div>
              <h5 className="font-serif text-sm font-semibold text-ivory">Secure Indian Checkout</h5>
              <p className="text-[11px] text-beige/70">UPI, NetBanking, Cards & Razorpay</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-4 bg-chocolate/30 border border-gold/15">
            <MapPin className="w-6 h-6 text-gold shrink-0" />
            <div>
              <h5 className="font-serif text-sm font-semibold text-ivory">Hisar Bridal Studio</h5>
              <p className="text-[11px] text-beige/70">Opposite Jindal Park, Tayal Bagh</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-chocolate">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="block font-serif text-2xl lg:text-3xl font-medium tracking-wide text-ivory uppercase">
                Saubhagya
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-champagne uppercase font-medium -mt-1">
                Sarees & Bridal Studio
              </span>
            </Link>

            <p className="text-xs text-beige/80 leading-relaxed max-w-sm">
              An ethnic fashion destination in Hisar offering timeless sarees, royal bridal wear, non-bridal ensembles, festive suits, and dresses crafted with devotion to Indian heritage.
            </p>

            <div className="space-y-2 text-xs text-beige/90 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  SCF-31, Phase 1, Wholesale Cloth Market, Opposite Jindal Park, Tayal Bagh Colony, Hisar, Haryana 125001, India.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="tel:+919996088960" className="hover:text-gold transition-colors">
                  +91 99960 88960
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gold shrink-0" />
                <span>Monday – Sunday: 10:30 AM to 8:30 PM</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.instagram.com/saubhagya_sarees_31/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs bg-chocolate/60 hover:bg-gold text-ivory hover:text-espresso px-3.5 py-2 border border-gold/30 transition-all font-medium"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>@saubhagya_sarees_31</span>
              </a>
              <a
                href="https://share.google/Qec4AEsinZqmrXiUL"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs bg-chocolate/60 hover:bg-gold text-ivory hover:text-espresso px-3.5 py-2 border border-gold/30 transition-all font-medium"
              >
                <MapPin className="w-4 h-4" />
                <span>Google Profile</span>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-champagne uppercase tracking-widest mb-4">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-beige/80">
              <li>
                <Link href="/shop" className="hover:text-gold transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop/sarees" className="hover:text-gold transition-colors">
                  Banarasi & Silk Sarees
                </Link>
              </li>
              <li>
                <Link href="/shop/bridal" className="hover:text-gold transition-colors">
                  Bridal Lehengas & Gowns
                </Link>
              </li>
              <li>
                <Link href="/shop/suits" className="hover:text-gold transition-colors">
                  Suits & Anarkalis
                </Link>
              </li>
              <li>
                <Link href="/shop/kurtis" className="hover:text-gold transition-colors">
                  Festive Silk Kurtis
                </Link>
              </li>
              <li>
                <Link href="/shop/dresses" className="hover:text-gold transition-colors">
                  Indo-Western Dresses
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="hover:text-gold transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-champagne uppercase tracking-widest mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-beige/80">
              <li>
                <Link href="/track-order" className="hover:text-gold transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-gold transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-gold transition-colors">
                  Returns & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-gold transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-champagne uppercase tracking-widest mb-4">
              The Bridal Circle
            </h4>
            <p className="text-xs text-beige/80 mb-3 leading-relaxed">
              Subscribe for new festive collection previews, bridal trousseau consultations, and studio announcements.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full text-xs px-3.5 py-2.5 bg-chocolate/50 border border-gold/40 text-ivory placeholder:text-beige/40 focus:outline-none focus:border-champagne"
                  required
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-gold hover:bg-champagne text-espresso font-semibold text-xs transition-colors flex items-center justify-center"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {status === "success" && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {msg}
                </p>
              )}
              {status === "error" && (
                <p className="text-[11px] text-red-300">{msg}</p>
              )}
            </form>

            <div className="mt-4 pt-4 border-t border-chocolate/80">
              <p className="text-[11px] text-beige/60">
                Studio visits by appointment or walk-in. Tailoring and bridal measurements available on-site.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Payment Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-beige/60 gap-4">
          <p>
            © {new Date().getFullYear()} Saubhagya Sarees & Bridal Studio. All rights reserved. Wholesale Cloth Market, Hisar.
          </p>
          <div className="flex items-center gap-3 text-beige/50 text-[11px]">
            <span>Secured by Razorpay</span>
            <span>•</span>
            <span>UPI / RuPay / Cards</span>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-gold text-beige/60">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
