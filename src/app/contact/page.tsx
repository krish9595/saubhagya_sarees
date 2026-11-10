"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import { MapPin, Phone, Clock, Mail, MessageCircle, CheckCircle } from "lucide-react";
import InstagramIcon from "@/components/common/InstagramIcon";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    inquiryType: "Bridal Consultation",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block mb-2">
            Get in Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-espresso font-normal">
            Visit Our Hisar Studio
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 mt-3 leading-relaxed">
            Whether planning your bridal trousseau, seeking tailoring advice or looking for a signature saree, our studio team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Store Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 border border-beige/40 shadow-xs space-y-6">
              <h3 className="font-serif text-xl font-medium text-espresso border-b border-beige/40 pb-3">
                Studio Information
              </h3>

              <div className="space-y-4 text-xs text-charcoal/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-espresso text-sm font-serif">Physical Address</strong>
                    <p className="mt-0.5 leading-relaxed">
                      SCF-31, Phase 1, Wholesale Cloth Market, Opposite Jindal Park, Tayal Bagh Colony, Hisar, Haryana 125001, India.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-espresso text-sm font-serif">Contact Number</strong>
                    <a href="tel:+919996088960" className="hover:text-gold transition-colors block mt-0.5 font-semibold">
                      +91 99960 88960
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-espresso text-sm font-serif">Studio Timings</strong>
                    <p className="mt-0.5">Monday to Sunday: 10:30 AM – 8:30 PM</p>
                    <span className="text-[11px] text-emerald-800 font-medium">Open All 7 Days</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <InstagramIcon className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-espresso text-sm font-serif">Official Instagram</strong>
                    <a
                      href="https://www.instagram.com/saubhagya_sarees_31/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-chocolate hover:text-gold transition-colors font-medium"
                    >
                      @saubhagya_sarees_31
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="pt-2">
                <a
                  href="https://wa.me/919996088960?text=Namaste%20Saubhagya%20Sarees!%20I%20would%20like%20to%20enquire%20about%20visiting%20your%20Hisar%20studio."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs uppercase tracking-widest font-semibold py-3.5 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Google Profile Card */}
            <div className="p-6 bg-cream/40 border border-beige/40 flex items-center justify-between">
              <div>
                <h4 className="font-serif text-base font-medium text-espresso">Google Business Profile</h4>
                <p className="text-[11px] text-charcoal/60">View photos, customer ratings and exact GPS directions</p>
              </div>
              <a
                href="https://share.google/Qec4AEsinZqmrXiUL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-espresso text-ivory px-3.5 py-2 font-semibold uppercase tracking-wider hover:bg-chocolate transition-colors shrink-0"
              >
                View Map
              </a>
            </div>
          </div>

          {/* Form & Map */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 border border-beige/40 shadow-xs">
              <h3 className="font-serif text-xl font-medium text-espresso border-b border-beige/40 pb-3 mb-6">
                Send a Consultation Inquiry
              </h3>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-700 mx-auto" />
                  <h4 className="font-serif text-lg font-medium text-espresso">Inquiry Received</h4>
                  <p className="text-xs text-charcoal/70 max-w-sm mx-auto">
                    Thank you, {formData.name}. Our bridal assistant will contact you via phone or WhatsApp shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contactNameInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        id="contactNameInput"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Meenakshi Bansal"
                        className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="contactPhoneInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        id="contactPhoneInput"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 98123 45678"
                        className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inquiryTypeSelect" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      id="inquiryTypeSelect"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                    >
                      <option value="Bridal Consultation">Bridal Trousseau & Lehenga Consultation</option>
                      <option value="Saree Enquiries">Banarasi & Silk Saree Inquiry</option>
                      <option value="Custom Stitching">Custom Measurements & Blouse Stitching</option>
                      <option value="Order Tracking">Order & Delivery Assistance</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contactMessageInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                      Message or Requirements
                    </label>
                    <textarea
                      id="contactMessageInput"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you are looking for (wedding date, preferred colour palette, event type)..."
                      className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold py-3.5 transition-colors shadow-xs"
                  >
                    Submit Studio Inquiry
                  </button>
                </form>
              )}
            </div>

            {/* Google Map */}
            <div className="aspect-16/9 w-full bg-cream overflow-hidden border border-beige/50 shadow-xs">
              <iframe
                title="Saubhagya Sarees Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3485.47648352824!2d75.725!3d29.155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDA5JzE4LjAiTiA3NcKwNDMnMzAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
