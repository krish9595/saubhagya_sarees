"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, Check, X, Percent, IndianRupee } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "10",
    minOrderValue: "2999",
    maxDiscount: "1500",
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowModal(false);
        fetchCoupons();
        setFormData({
          code: "",
          description: "",
          discountType: "PERCENTAGE",
          discountValue: "10",
          minOrderValue: "2999",
          maxDiscount: "1500",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-beige/60 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso flex items-center gap-2">
            <Tag className="w-5 h-5 text-gold" />
            Promotions & Coupon Management
          </h1>
          <p className="text-xs text-charcoal/60">
            {coupons.length} promotional vouchers configured
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-4 py-2.5 flex items-center gap-2 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Create Promo Voucher</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white p-6 border border-beige/60 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-bold text-chocolate tracking-wider bg-cream px-3 py-1 border border-beige/60">
                {c.code}
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                Active
              </span>
            </div>

            <p className="text-xs text-charcoal/80 leading-relaxed min-h-[36px]">
              {c.description || "Complimentary promotional savings"}
            </p>

            <div className="pt-2 border-t border-beige/30 space-y-1 text-xs text-charcoal/70">
              <div className="flex justify-between">
                <span>Discount:</span>
                <strong className="text-espresso">
                  {c.discountType === "PERCENTAGE" ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Minimum Cart:</span>
                <span>₹{Number(c.minOrderValue).toLocaleString("en-IN")}</span>
              </div>
              {c.maxDiscount && (
                <div className="flex justify-between">
                  <span>Max Cap:</span>
                  <span>₹{Number(c.maxDiscount).toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-1 text-chocolate">
                <span>Times Redeemed:</span>
                <span>{c.usageCount} times</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-md bg-white p-6 border border-beige/60 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-beige/40 mb-4">
              <h3 className="font-serif text-lg font-medium text-espresso">Create New Voucher</h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-charcoal/60">✕</button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-semibold text-charcoal/80 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE20"
                  className="w-full p-2.5 bg-ivory border border-beige/80 uppercase font-mono"
                  required
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-charcoal/80 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 20% off on all bridal lehengas"
                  className="w-full p-2.5 bg-ivory border border-beige/80"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-charcoal/80 mb-1">Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full p-2.5 bg-ivory border border-beige/80"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Rupee (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase font-semibold text-charcoal/80 mb-1">Value *</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full p-2.5 bg-ivory border border-beige/80"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-semibold text-charcoal/80 mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    className="w-full p-2.5 bg-ivory border border-beige/80"
                  />
                </div>
                <div>
                  <label className="block uppercase font-semibold text-charcoal/80 mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full p-2.5 bg-ivory border border-beige/80"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-beige/80">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-chocolate text-ivory font-semibold uppercase tracking-wider">
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
