"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle,
  Truck,
  CreditCard,
  MapPin,
  User,
  ShoppingBag,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    coupon,
    clearCart,
  } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    streetAddress: "",
    landmark: "",
    city: "Hisar",
    state: "Haryana",
    postalCode: "",
    paymentMethod: "RAZORPAY", // "RAZORPAY" or "COD"
    customerNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!formData.phone.trim() || !/^\+?[0-9\s-]{10,14}$/.test(formData.phone.trim())) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.streetAddress.trim()) {
      setErrorMessage("Please enter your delivery street address.");
      return;
    }
    if (!/^\d{6}$/.test(formData.postalCode.trim())) {
      setErrorMessage("Please enter a valid 6-digit Indian PIN code.");
      return;
    }
    if (items.length === 0) {
      setErrorMessage("Your bag is empty. Please add items to checkout.");
      return;
    }

    setLoading(true);

    try {
      // 1. Call server API to create order in MySQL with server-side price validation
      const createRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim() || undefined,
          },
          shippingAddress: {
            fullName: formData.fullName.trim(),
            phone: formData.phone.trim(),
            streetAddress: formData.streetAddress.trim(),
            landmark: formData.landmark.trim() || undefined,
            city: formData.city.trim(),
            state: formData.state.trim(),
            postalCode: formData.postalCode.trim(),
          },
          cartItems: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            customMeasurements: i.customMeasurements,
          })),
          couponCode: coupon?.code,
          paymentMethod: formData.paymentMethod,
          customerNotes: formData.customerNotes.trim() || undefined,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok || !createData.success) {
        setErrorMessage(createData.message || "Failed to create order. Please check details.");
        setLoading(false);
        return;
      }

      const { order, razorpayOrder } = createData;

      // 2. If Cash on Delivery, order is confirmed immediately
      if (formData.paymentMethod === "COD") {
        setConfirmedOrder(order);
        clearCart();
        setLoading(false);
        return;
      }

      // 3. For Online Razorpay, handle payment checkout
      // We load Razorpay SDK or use verification API
      const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          if ((window as any).Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && (window as any).Razorpay && razorpayOrder) {
        const options = {
          key: razorpayOrder.key,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Saubhagya Sarees & Bridal Studio",
          description: `Order ${order.orderNumber} - Handcrafted Indian Ethnic Wear`,
          image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100",
          order_id: razorpayOrder.id,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#352018",
          },
          handler: async (response: any) => {
            // Verify payment on server
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderNumber: order.orderNumber,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setConfirmedOrder(order);
              clearCart();
            } else {
              setErrorMessage("Payment verification failed. Please contact our support team.");
            }
          },
          modal: {
            ondismiss: () => {
              setErrorMessage("Payment cancelled. You can retry checkout anytime.");
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback simulator for development/test environment
        const verifyRes = await fetch("/api/payments/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderNumber: order.orderNumber,
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_order_id: razorpayOrder?.id || `order_sim_${Date.now()}`,
            razorpay_signature: "simulated_signature_verified",
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          setConfirmedOrder(order);
          clearCart();
        } else {
          setErrorMessage("Payment verification failed.");
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setErrorMessage("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-between">
        <header className="border-b border-beige/40 bg-white py-4 px-6 text-center">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl font-normal tracking-wide text-espresso uppercase">
              Saubhagya
            </span>
            <span className="block text-[9px] tracking-[0.25em] text-chocolate uppercase font-semibold">
              Bridal Studio Hisar
            </span>
          </Link>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-200">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold block mb-1">
            Order Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-normal mb-2">
            Thank You, {formData.fullName}!
          </h1>
          <p className="text-sm text-charcoal/70 mb-6">
            Your ethnic ensemble is being prepared at our Hisar studio.
          </p>

          <div className="bg-white p-6 sm:p-8 border border-beige/40 shadow-sm text-left space-y-4 mb-8">
            <div className="flex items-center justify-between border-b border-beige/30 pb-3">
              <span className="text-xs text-charcoal/60">Order Reference:</span>
              <span className="text-base font-serif font-bold text-chocolate">
                {confirmedOrder.orderNumber}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-beige/30 pb-3 text-xs">
              <span className="text-charcoal/60">Payment Method:</span>
              <span className="font-semibold text-espresso">
                {formData.paymentMethod === "COD" ? "Cash on Delivery (COD)" : "Online Payment (Razorpay)"}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-beige/30 pb-3 text-xs">
              <span className="text-charcoal/60">Total Payable:</span>
              <span className="font-bold text-espresso text-base">
                ₹{Math.round(confirmedOrder.totalAmount).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="text-xs text-charcoal/80 space-y-1 pt-1">
              <strong className="block text-espresso">Shipping To:</strong>
              <p>{formData.fullName}</p>
              <p>{formData.streetAddress}, {formData.landmark ? `${formData.landmark}, ` : ""}{formData.city}, {formData.state} – {formData.postalCode}</p>
              <p>Phone: {formData.phone}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/track-order?orderId=${confirmedOrder.orderNumber}`}
              className="w-full sm:w-auto bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-8 py-3.5 transition-colors shadow-md"
            >
              Track Order Progress
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto border border-chocolate hover:bg-cream text-chocolate text-xs uppercase tracking-widest font-semibold px-8 py-3.5 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </main>

        <footer className="py-6 text-center text-xs text-charcoal/50 border-t border-beige/30">
          Need assistance with your order? Call +91 99960 88960 or WhatsApp our studio.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <header className="border-b border-beige/40 bg-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl font-normal tracking-wide text-espresso uppercase">
              Saubhagya
            </span>
            <span className="block text-[9px] tracking-[0.25em] text-chocolate uppercase font-semibold">
              Bridal Studio Hisar
            </span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-charcoal/60">
            <Lock className="w-3.5 h-3.5 text-gold" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Form */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 pb-24 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Customer & Address Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-beige/40 shadow-xs space-y-8">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Step 1: Customer Details */}
              <div>
                <h3 className="font-serif text-xl font-medium text-espresso flex items-center gap-2 mb-4 pb-2 border-b border-beige/30">
                  <User className="w-4 h-4 text-gold" />
                  1. Customer Details (Guest Checkout Available)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label htmlFor="fullNameInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                      Full Name *
                    </label>
                    <input
                      id="fullNameInput"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Pooja Singhal"
                      className="w-full text-base sm:text-xs p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                      Mobile Number (for Order Updates & WhatsApp) *
                    </label>
                    <input
                      id="phoneInput"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 98123 45678"
                      className="w-full text-base sm:text-xs p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="emailInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                      Email Address (Optional, for invoice)
                    </label>
                    <input
                      id="emailInput"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. pooja@example.com"
                      className="w-full text-base sm:text-xs p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div>
                <h3 className="font-serif text-xl font-medium text-espresso flex items-center gap-2 mb-4 pb-2 border-b border-beige/30">
                  <MapPin className="w-4 h-4 text-gold" />
                  2. Delivery Address in India
                </h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label htmlFor="streetAddressInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                      Flat / House No., Street, Colony *
                    </label>
                    <input
                      id="streetAddressInput"
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      placeholder="e.g. House 142, Sector 14, Urban Estate"
                      className="w-full text-base sm:text-xs p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="landmarkInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        id="landmarkInput"
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        placeholder="Near Jindal Park / Market"
                        className="w-full text-base sm:text-xs p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label htmlFor="postalCodeInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                        PIN Code *
                      </label>
                      <input
                        id="postalCodeInput"
                        type="text"
                        maxLength={6}
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="e.g. 125001"
                        className="w-full text-base sm:text-xs p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cityInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                        City / District *
                      </label>
                      <input
                        id="cityInput"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full text-base sm:text-xs p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="stateInput" className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                        State *
                      </label>
                      <input
                        id="stateInput"
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full text-base sm:text-xs p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div>
                <h3 className="font-serif text-xl font-medium text-espresso flex items-center gap-2 mb-4 pb-2 border-b border-beige/30">
                  <CreditCard className="w-4 h-4 text-gold" />
                  3. Select Payment Mode
                </h3>
                <div className="space-y-3 text-xs">
                  <label className="flex items-center gap-3 p-3.5 bg-ivory border border-beige/80 cursor-pointer hover:border-gold">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={formData.paymentMethod === "RAZORPAY"}
                      onChange={handleInputChange}
                      className="accent-[#B18A4A]"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-espresso block">
                        Online Payment via Razorpay (UPI, Credit/Debit Cards, NetBanking)
                      </span>
                      <span className="text-charcoal/60 text-[11px]">
                        Instant verification • GPay, PhonePe, Paytm, RuPay & all banks supported
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 bg-ivory border border-beige/80 cursor-pointer hover:border-gold">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === "COD"}
                      onChange={handleInputChange}
                      className="accent-[#B18A4A]"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-espresso block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-charcoal/60 text-[11px]">
                        Pay cash upon delivery at your doorstep
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label htmlFor="customerNotesInput" className="block text-xs uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Special Tailoring or Delivery Notes (Optional)
                </label>
                <textarea
                  id="customerNotesInput"
                  name="customerNotes"
                  value={formData.customerNotes}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="e.g. Call before delivery, gift wrap, urgent bridal dispatch..."
                  className="w-full text-base sm:text-xs p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold py-4 shadow-md transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Processing Your Order...</span>
                ) : (
                  <>
                    <span>Place Order (₹{Math.round(total).toLocaleString("en-IN")})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Order Review Summary */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-beige/40 shadow-xs space-y-6 sticky top-8">
            <div className="flex items-center justify-between border-b border-beige/40 pb-3">
              <h3 className="font-serif text-xl font-medium text-espresso flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-gold" />
                Order Review ({itemCount})
              </h3>
              <Link href="/cart" className="text-xs text-chocolate hover:text-gold uppercase tracking-wider font-semibold">
                Edit Bag
              </Link>
            </div>

            {/* Selected Items */}
            <div className="divide-y divide-beige/20 max-h-72 overflow-y-auto pr-1 space-y-2">
              {items.map((i) => (
                <div key={`${i.productId}-${i.variantId || ""}`} className="py-2.5 flex items-center gap-3">
                  <div className="relative w-14 h-16 bg-cream shrink-0 border border-beige/30">
                    <Image src={i.image} alt={i.title} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif text-xs font-medium text-espresso line-clamp-1">{i.title}</h5>
                    <p className="text-[10px] text-charcoal/60">
                      Qty: {i.quantity} {i.size ? `• Size: ${i.size}` : ""}
                    </p>
                    <span className="text-xs font-semibold text-espresso">
                      ₹{(i.price * i.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-charcoal/80 border-t border-beige/30 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800 font-medium">
                  <span>Coupon Discount ({coupon?.code})</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Pan-India Shipping</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-800">Free</strong> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-[11px] text-charcoal/50">
                <span>Included GST (5%)</span>
                <span>₹{Math.round((subtotal * 0.05) / 1.05).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-lg font-serif font-semibold text-espresso pt-3 border-t border-beige/40">
                <span>Total Payable</span>
                <span className="text-xl text-chocolate">₹{Math.round(total).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="p-3 bg-cream/40 border border-beige/30 text-[11px] text-charcoal/70 space-y-1">
              <p className="font-semibold text-espresso flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-gold" />
                Dispatched from Hisar Wholesale Market
              </p>
              <p>Hand-inspected for fabric flawlessness, zari integrity, and packaged in protective cloth covers.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
