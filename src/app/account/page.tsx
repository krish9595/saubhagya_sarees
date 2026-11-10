import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import MobileBottomBar from "@/components/common/MobileBottomBar";
import { User, Package, Heart, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

export const revalidate = 0; // dynamic

export default async function AccountPage() {
  // Demo customer account or guest overview
  const customer = await prisma.customer.findFirst({
    where: { phone: "+91 98123 45678" },
    include: {
      addresses: true,
      orders: {
        include: { items: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
        <div className="border-b border-beige/40 pb-6 mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block mb-1">
              Customer Portal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-espresso font-normal">
              Namaste, {customer?.name || "Patron"}
            </h1>
          </div>
          <div className="mt-3 sm:mt-0 flex gap-3 text-xs">
            <Link
              href="/track-order"
              className="bg-white border border-beige/80 px-4 py-2 text-espresso hover:border-gold font-semibold uppercase tracking-wider"
            >
              Track an Order
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Profile Sidebar */}
          <div className="lg:col-span-4 bg-white p-6 border border-beige/40 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-beige/30">
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-chocolate font-serif text-xl">
                {customer?.name?.[0] || "P"}
              </div>
              <div>
                <h4 className="font-serif text-lg font-medium text-espresso">{customer?.name || "Pooja Singhal"}</h4>
                <p className="text-xs text-charcoal/60">{customer?.phone || "+91 98123 45678"}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-charcoal/80">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>{customer?.email || "pooja.singhal@example.com"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>{customer?.phone || "+91 98123 45678"}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  {customer?.addresses?.[0]?.streetAddress || "House 142, Urban Estate II"}, {customer?.addresses?.[0]?.city || "Hisar"}, Haryana
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-beige/30 space-y-2">
              <Link
                href="/wishlist"
                className="flex items-center justify-between p-2.5 bg-cream/40 hover:bg-cream text-xs text-espresso font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gold" />
                  View Saved Wishlist
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/shop"
                className="flex items-center justify-between p-2.5 bg-cream/40 hover:bg-cream text-xs text-espresso font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gold" />
                  Explore Studio Catalogue
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Orders History */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="font-serif text-2xl font-medium text-espresso pb-2 border-b border-beige/40">
              Recent Studio Orders ({customer?.orders?.length || 0})
            </h3>

            {customer?.orders && customer.orders.length > 0 ? (
              <div className="space-y-4">
                {customer.orders.map((ord) => (
                  <div key={ord.id} className="bg-white p-6 border border-beige/40 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-beige/20 gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-charcoal/50">Order Number</span>
                        <h4 className="font-serif text-lg font-bold text-chocolate">{ord.orderNumber}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {ord.status}
                        </span>
                        <Link
                          href={`/track-order?orderId=${ord.orderNumber}`}
                          className="text-xs text-gold hover:underline font-semibold"
                        >
                          Track →
                        </Link>
                      </div>
                    </div>

                    <div className="divide-y divide-beige/20 space-y-2">
                      {ord.items.map((it) => (
                        <div key={it.id} className="pt-2 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-medium text-espresso block">{it.productName}</span>
                            <span className="text-[11px] text-charcoal/60">Qty: {it.quantity}</span>
                          </div>
                          <span className="font-semibold text-espresso">₹{Number(it.totalPrice).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-beige/20 flex justify-between items-center text-xs">
                      <span className="text-charcoal/60">
                        Placed on {new Date(ord.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="font-bold text-base text-espresso">
                        Total: ₹{Number(ord.totalAmount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 text-center border border-beige/40">
                <p className="text-xs text-charcoal/60">No orders found. Your purchases will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
