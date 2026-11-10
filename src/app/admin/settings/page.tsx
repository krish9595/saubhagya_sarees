"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    store_name: "Saubhagya Sarees & Bridal Studio",
    store_phone: "+91 99960 88960",
    store_whatsapp: "919996088960",
    store_address: "SCF-31, Phase 1, Wholesale Cloth Market, Opposite Jindal Park, Tayal Bagh Colony, Hisar, Haryana 125001",
    free_shipping_threshold: "4999",
    standard_shipping_fee: "150",
    tax_gst_rate: "5",
    enable_cod: "true",
    razorpay_mode: "TEST",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          const map: any = {};
          data.settings.forEach((s: any) => {
            map[s.key] = s.value;
          });
          setFormData((prev) => ({ ...prev, ...map }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-beige/60 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso flex items-center gap-2">
            <Settings className="w-5 h-5 text-gold" />
            Store & Payment Configuration
          </h1>
          <p className="text-xs text-charcoal/60">
            Shipping rules, payment options, WhatsApp support, and Hisar store details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Business Identity */}
        <div className="bg-white p-6 border border-beige/60 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-medium text-espresso border-b border-beige/30 pb-2">
            1. Business Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-semibold text-charcoal/80 mb-1">Store Name</label>
              <input
                type="text"
                value={formData.store_name}
                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-beige/80"
                required
              />
            </div>
            <div>
              <label className="block uppercase font-semibold text-charcoal/80 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.store_phone}
                onChange={(e) => setFormData({ ...formData, store_phone: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-beige/80"
                required
              />
            </div>
            <div>
              <label className="block uppercase font-semibold text-charcoal/80 mb-1">WhatsApp Number (e.g. 919996088960)</label>
              <input
                type="text"
                value={formData.store_whatsapp}
                onChange={(e) => setFormData({ ...formData, store_whatsapp: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-beige/80"
                required
              />
            </div>
            <div>
              <label className="block uppercase font-semibold text-charcoal/80 mb-1">Physical Address</label>
              <input
                type="text"
                value={formData.store_address}
                onChange={(e) => setFormData({ ...formData, store_address: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-beige/80"
                required
              />
            </div>
          </div>
        </div>

        {/* Shipping & Taxes */}
        <div className="bg-white p-6 border border-beige/60 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-medium text-espresso border-b border-beige/30 pb-2">
            2. Shipping & GST Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block uppercase font-semibold text-charcoal/80 mb-1">Free Shipping Min Order (₹)</label>
              <input
                type="number"
                value={formData.free_shipping_threshold}
                onChange={(e) => setFormData({ ...formData, free_shipping_threshold: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-beige/80"
                required
              />
            </div>
            <div>
              <label className="block uppercase font-semibold text-charcoal/80 mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={formData.standard_shipping_fee}
                onChange={(e) => setFormData({ ...formData, standard_shipping_fee: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-beige/80"
                required
              />
            </div>
            <div>
              <label className="block uppercase font-semibold text-charcoal/80 mb-1">Textile GST Rate (%)</label>
              <input
                type="number"
                value={formData.tax_gst_rate}
                onChange={(e) => setFormData({ ...formData, tax_gst_rate: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-beige/80"
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Gateway */}
        <div className="bg-white p-6 border border-beige/60 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-medium text-espresso border-b border-beige/30 pb-2">
            3. Payment Modes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-semibold text-charcoal/80 mb-1">Cash on Delivery (COD)</label>
              <select
                value={formData.enable_cod}
                onChange={(e) => setFormData({ ...formData, enable_cod: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-beige/80 font-medium"
              >
                <option value="true">Enabled (Accept Cash on Delivery)</option>
                <option value="false">Disabled (Prepaid Online Only)</option>
              </select>
            </div>
            <div>
              <label className="block uppercase font-semibold text-charcoal/80 mb-1">Razorpay Environment</label>
              <select
                value={formData.razorpay_mode}
                onChange={(e) => setFormData({ ...formData, razorpay_mode: e.target.value })}
                className="w-full p-2.5 bg-ivory border border-beige/80 font-medium"
              >
                <option value="TEST">TEST Sandbox Mode</option>
                <option value="LIVE">LIVE Production Mode</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {success ? (
            <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Settings updated successfully!
            </span>
          ) : <span />}

          <button
            type="submit"
            disabled={saving}
            className="bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-8 py-3.5 transition-colors shadow-xs"
          >
            {saving ? "Saving Changes..." : "Save Store Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
