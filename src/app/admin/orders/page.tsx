"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Search,
  Filter,
  Truck,
  Printer,
  X,
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  // Status edit state
  const [newStatus, setNewStatus] = useState("");
  const [awbCode, setAwbCode] = useState("");
  const [courierName, setCourierName] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  const fetchOrders = async (status = statusFilter) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?status=${status}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(statusFilter);
  }, [statusFilter]);

  const openOrderDrawer = (ord: any) => {
    setSelectedOrder(ord);
    setNewStatus(ord.status);
    setAwbCode(ord.awbCode || "");
    setCourierName(ord.courierName || "BlueDart Express");
    setTrackingUrl(ord.trackingUrl || "");
    setInternalNotes(ord.internalAdminNotes || "");
  };

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSavingStatus(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: newStatus,
          awbCode: awbCode.trim() || undefined,
          courierName: courierName.trim() || undefined,
          trackingUrl: trackingUrl.trim() || undefined,
          internalAdminNotes: internalNotes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedOrder(data.order);
        fetchOrders(statusFilter);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingStatus(false);
    }
  };

  const filtered = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(term) ||
      (o.guestName && o.guestName.toLowerCase().includes(term)) ||
      (o.guestPhone && o.guestPhone.includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-beige/60">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-gold" />
            Order Processing & Fulfillment
          </h1>
          <p className="text-xs text-charcoal/60">
            {orders.length} total customer orders in database
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-beige/40 gap-2 sm:gap-4 overflow-x-auto text-xs uppercase tracking-wider font-semibold pb-2">
        {["ALL", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 transition-colors whitespace-nowrap ${
              statusFilter === st
                ? "bg-espresso text-ivory font-bold"
                : "bg-white text-charcoal/70 hover:bg-cream border border-beige/40"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 border border-beige/60 shadow-xs flex items-center gap-4">
        <div className="relative w-full sm:w-80 text-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, customer, phone..."
            className="w-full pl-9 pr-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-beige/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/40 text-charcoal/70 uppercase tracking-wider text-[10px] border-b border-beige/40">
              <tr>
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Date Placed</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20 text-charcoal">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal/50">
                    Loading orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal/50">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-chocolate">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-charcoal/60">
                      {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-espresso block">{ord.guestName}</span>
                      <span className="text-[10px] text-charcoal/50">{ord.guestPhone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-charcoal/80 block">
                        {ord.paymentMethod}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          ord.paymentStatus === "PAID" ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        ● {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-espresso">
                      ₹{Number(ord.totalAmount).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                          ord.status === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : ord.status === "CONFIRMED"
                            ? "bg-blue-50 text-blue-800 border border-blue-200"
                            : ord.status === "SHIPPED"
                            ? "bg-purple-50 text-purple-800 border border-purple-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {ord.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openOrderDrawer(ord)}
                        className="bg-chocolate hover:bg-espresso text-ivory text-[11px] font-semibold px-3 py-1.5 transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Fulfillment Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
            aria-hidden="true"
          />
          <aside
            className="relative z-10 w-full max-w-xl bg-ivory text-charcoal h-full flex flex-col shadow-2xl border-l border-beige/40"
            role="dialog"
            aria-label={`Order ${selectedOrder.orderNumber}`}
            aria-modal="true"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-beige/40 flex items-center justify-between bg-cream/40">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-charcoal/50">
                  Managing Order
                </span>
                <h3 className="font-serif text-2xl font-bold text-espresso">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInvoice(true)}
                  className="flex items-center gap-1 bg-white border border-beige/80 px-3 py-1.5 text-xs text-espresso hover:border-gold font-semibold uppercase tracking-wider"
                >
                  <Printer className="w-3.5 h-3.5 text-gold" />
                  <span>Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-charcoal/70 hover:text-espresso"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Status Update Form */}
              <form onSubmit={handleUpdateOrderStatus} className="bg-white p-5 border border-beige/40 shadow-xs space-y-4">
                <h4 className="font-serif text-base font-semibold text-espresso border-b border-beige/30 pb-2">
                  Update Order Pipeline Status
                </h4>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Order Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold font-medium text-espresso"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
                    <option value="CONFIRMED">CONFIRMED (Payment Verified)</option>
                    <option value="PROCESSING">PROCESSING (Tailoring & Inspection)</option>
                    <option value="PACKED">PACKED (Ready for Courier)</option>
                    <option value="SHIPPED">SHIPPED (In Transit)</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="RETURNED">RETURNED</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                      Courier Carrier
                    </label>
                    <input
                      type="text"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder="e.g. BlueDart Express"
                      className="w-full p-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                      AWB / Tracking Number
                    </label>
                    <input
                      type="text"
                      value={awbCode}
                      onChange={(e) => setAwbCode(e.target.value)}
                      placeholder="e.g. SR-HISAR-998811"
                      className="w-full p-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Internal Admin Notes
                  </label>
                  <textarea
                    rows={2}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Staff notes for warehouse, packaging, or customer requests..."
                    className="w-full p-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingStatus}
                  className="w-full bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold py-2.5 transition-colors shadow-xs"
                >
                  {savingStatus ? "Updating..." : "Save Status & Dispatch Details"}
                </button>
              </form>

              {/* Items List */}
              <div className="bg-white p-5 border border-beige/40 shadow-xs space-y-3">
                <h4 className="font-serif text-base font-semibold text-espresso border-b border-beige/30 pb-2">
                  Order Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="divide-y divide-beige/20 space-y-2">
                  {selectedOrder.items?.map((it: any) => (
                    <div key={it.id} className="pt-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 bg-cream shrink-0 border border-beige/30 overflow-hidden">
                          <Image
                            src={it.imageUrl || "https://images.unsplash.com/photo-1610030469983-98e550d6193c"}
                            alt={it.productName}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <span className="font-serif font-medium text-espresso block">{it.productName}</span>
                          <span className="text-[10px] text-charcoal/60">
                            Qty: {it.quantity} • SKU: {it.productSku}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-espresso">₹{Number(it.totalPrice).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-beige/30 space-y-1 text-charcoal/80">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{Number(selectedOrder.subtotal).toLocaleString("en-IN")}</span>
                  </div>
                  {Number(selectedOrder.discountAmount) > 0 && (
                    <div className="flex justify-between text-emerald-800">
                      <span>Discount ({selectedOrder.couponCode}):</span>
                      <span>-₹{Number(selectedOrder.discountAmount).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-espresso text-sm pt-1 border-t border-beige/20">
                    <span>Final Total:</span>
                    <span>₹{Number(selectedOrder.totalAmount).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-5 border border-beige/40 shadow-xs space-y-2">
                <h4 className="font-serif text-base font-semibold text-espresso border-b border-beige/30 pb-2">
                  Shipping Destination
                </h4>
                <div className="text-charcoal/80 space-y-1">
                  <p className="font-semibold text-espresso">{selectedOrder.guestName}</p>
                  <p className="text-charcoal/70">Phone: {selectedOrder.guestPhone}</p>
                  <p className="text-charcoal/70">Email: {selectedOrder.guestEmail || "N/A"}</p>
                  <p className="text-charcoal/70 pt-1">
                    {selectedOrder.shippingAddressJson
                      ? JSON.parse(selectedOrder.shippingAddressJson).streetAddress + ", " + JSON.parse(selectedOrder.shippingAddressJson).city + ", " + JSON.parse(selectedOrder.shippingAddressJson).state + " - " + JSON.parse(selectedOrder.shippingAddressJson).postalCode
                      : "Standard Address"}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Printable Invoice Modal conforming to Modern Web Guidance */}
      {showInvoice && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs">
          <div
            className="relative z-10 w-full max-w-2xl bg-white p-8 sm:p-10 shadow-2xl border border-beige/60 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-label="Tax Invoice"
            aria-modal="true"
          >
            <div className="flex justify-between items-start border-b border-beige/40 pb-6 mb-6">
              <div>
                <span className="font-serif text-2xl font-bold text-espresso uppercase block">
                  Saubhagya Sarees & Bridal Studio
                </span>
                <span className="text-[10px] text-charcoal/70 block">
                  SCF-31, Wholesale Cloth Market, Hisar, Haryana 125001
                </span>
                <span className="text-[10px] text-charcoal/70 block">GSTIN: 06AAFPS1234F1Z8</span>
                <span className="text-[10px] text-charcoal/70 block">Studio Contact: +91 99960 88960</span>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase tracking-widest font-bold text-gold block">
                  Tax Invoice
                </span>
                <span className="font-mono text-sm font-bold text-chocolate block">
                  {selectedOrder.orderNumber}
                </span>
                <span className="text-[10px] text-charcoal/50 block">
                  Date: {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>

            <div className="mb-6 text-xs text-charcoal/80">
              <strong className="block text-espresso">Billed & Shipped To:</strong>
              <p>{selectedOrder.guestName}</p>
              <p>Phone: {selectedOrder.guestPhone}</p>
            </div>

            <table className="w-full text-left text-xs mb-6 border border-beige/40">
              <thead className="bg-cream/40 text-charcoal/70 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-2 border-b border-beige/40">Item & SKU</th>
                  <th className="p-2 border-b border-beige/40 text-center">Qty</th>
                  <th className="p-2 border-b border-beige/40 text-right">Price</th>
                  <th className="p-2 border-b border-beige/40 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/20">
                {selectedOrder.items.map((it: any) => (
                  <tr key={it.id}>
                    <td className="p-2 font-medium text-espresso">{it.productName} ({it.productSku})</td>
                    <td className="p-2 text-center">{it.quantity}</td>
                    <td className="p-2 text-right">₹{Number(it.unitPrice).toLocaleString("en-IN")}</td>
                    <td className="p-2 text-right font-semibold">₹{Number(it.totalPrice).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end text-xs text-charcoal/80 mb-6">
              <div className="w-56 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{Number(selectedOrder.subtotal).toLocaleString("en-IN")}</span>
                </div>
                {Number(selectedOrder.discountAmount) > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Discount:</span>
                    <span>-₹{Number(selectedOrder.discountAmount).toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-espresso pt-2 border-t border-beige/30">
                  <span>Grand Total:</span>
                  <span>₹{Number(selectedOrder.totalAmount).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-beige/40 flex justify-between items-center text-xs">
              <button
                onClick={() => window.print()}
                className="bg-espresso text-ivory px-4 py-2 uppercase tracking-wider font-semibold hover:bg-chocolate"
              >
                Print Invoice
              </button>
              <button
                onClick={() => setShowInvoice(false)}
                className="text-charcoal/60 hover:text-espresso underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
