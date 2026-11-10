"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import { Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, MapPin } from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";

  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchOrderTracking = async (id: string, ph?: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(id.trim())}&phone=${encodeURIComponent(ph || "")}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setOrderData(data.order);
      } else {
        setErrorMsg(data.message || "Order not found. Please verify your order number and phone number.");
        setOrderData(null);
      }
    } catch {
      setErrorMsg("Failed to track order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchOrderTracking(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrderTracking(orderId, phone);
  };

  const statusSteps = [
    { key: "CONFIRMED", label: "Order Confirmed", desc: "Order & payment verified" },
    { key: "PROCESSING", label: "Studio Tailoring & Inspection", desc: "Inspected at Hisar Studio" },
    { key: "SHIPPED", label: "Dispatched with Courier", desc: "Handed over to carrier" },
    { key: "DELIVERED", label: "Delivered", desc: "Safely received" },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "PENDING":
      case "PAYMENT_PENDING":
        return 0;
      case "CONFIRMED":
        return 1;
      case "PROCESSING":
      case "PACKED":
        return 2;
      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = orderData ? getStepIndex(orderData.status) : 0;

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block mb-2">
          Real-time Shipment Updates
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-normal">
          Track Your Order
        </h1>
        <p className="text-xs text-charcoal/70 mt-2">
          Enter your Order Number (e.g. <strong>SSB-2026-1001</strong>) to view the live status and courier tracking.
        </p>
      </div>

      {/* Tracking Search Box */}
      <div className="bg-white p-6 sm:p-8 border border-beige/40 shadow-xs mb-10 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label htmlFor="orderIdInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
              Order Number *
            </label>
            <input
              id="orderIdInput"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. SSB-2026-1001"
              className="w-full p-3 bg-ivory border border-beige/80 focus:outline-none focus:border-gold uppercase font-mono"
              required
            />
          </div>

          <div>
            <label htmlFor="phoneInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
              Contact Phone (Optional Verification)
            </label>
            <input
              id="phoneInput"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 98123 45678"
              className="w-full p-3 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold py-3.5 transition-colors shadow-xs"
          >
            {loading ? "Searching Records..." : "Track My Shipment"}
          </button>
        </form>
      </div>

      {/* Order Tracking Progress Card */}
      {orderData && (
        <div className="bg-white border border-beige/40 shadow-md p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-beige/40 gap-2">
            <div>
              <span className="text-xs text-charcoal/60">Order Reference:</span>
              <h3 className="font-serif text-2xl font-semibold text-espresso">
                {orderData.orderNumber}
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-charcoal/60 block">Current Status:</span>
              <span className="inline-block bg-gold/15 text-gold border border-gold/40 text-xs uppercase tracking-wider font-bold px-3 py-1 mt-0.5">
                {orderData.status.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Timeline Visual */}
          <div className="py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
              {statusSteps.map((step, idx) => {
                const isPassed = currentStep > idx;
                const isCurrent = currentStep === idx + 1;
                return (
                  <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 relative z-10">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                        isPassed || isCurrent
                          ? "bg-chocolate text-ivory border-gold"
                          : "bg-ivory text-charcoal/40 border-beige/60"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5 text-champagne" /> : <span>{idx + 1}</span>}
                    </div>
                    <div>
                      <h5 className="font-serif text-sm font-semibold text-espresso">
                        {step.label}
                      </h5>
                      <p className="text-[11px] text-charcoal/60">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Details if Shipped */}
          {orderData.awbCode && (
            <div className="p-4 bg-cream/40 border border-beige/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-chocolate font-bold block">
                  Carrier Information
                </span>
                <p className="text-sm font-serif font-medium text-espresso">
                  Courier: <strong>{orderData.courierName || "Express Air Courier"}</strong>
                </p>
                <p className="text-charcoal/70">
                  AWB / Tracking ID: <strong className="font-mono text-espresso">{orderData.awbCode}</strong>
                </p>
              </div>
              {orderData.trackingUrl && (
                <a
                  href={orderData.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-espresso text-ivory px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-chocolate transition-colors"
                >
                  Live Courier Tracking →
                </a>
              )}
            </div>
          )}

          {/* Items Preview */}
          <div className="pt-4 border-t border-beige/30">
            <h4 className="font-serif text-lg text-espresso mb-3">Ensemble in Shipment</h4>
            <div className="space-y-2">
              {orderData.items?.map((it: any) => (
                <div key={it.id} className="flex items-center justify-between text-xs py-2 border-b border-beige/20">
                  <span className="font-medium text-charcoal/80">{it.productName} (Qty: {it.quantity})</span>
                  <span className="font-semibold text-espresso">₹{Number(it.totalPrice).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-xs">Loading tracking...</div>}>
        <TrackOrderContent />
      </Suspense>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
