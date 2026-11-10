import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  IndianRupee,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const revalidate = 0; // live operational metrics

async function getAdminDashboardMetrics() {
  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    totalProducts,
    totalCustomers,
    allOrders,
    categories,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PENDING", "PAYMENT_PENDING", "CONFIRMED", "PROCESSING"] } } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.customer.count(),
    prisma.order.findMany({
      select: {
        totalAmount: true,
        paymentStatus: true,
        paymentMethod: true,
        createdAt: true,
        status: true,
      },
    }),
    prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.productVariant.count({
      where: { stockQuantity: { lte: 3 } },
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    }),
  ]);

  // Real calculations
  const paidOrders = allOrders.filter((o) => o.paymentStatus === "PAID" || o.status === "DELIVERED");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayOrders = paidOrders.filter((o) => new Date(o.createdAt) >= startOfDay);
  const todaySales = todayOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const monthOrders = paidOrders.filter((o) => new Date(o.createdAt) >= startOfMonth);
  const monthSales = monthOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const aov = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  // Payment methods breakdown
  const razorpayOrders = allOrders.filter((o) => o.paymentMethod === "RAZORPAY").length;
  const codOrders = allOrders.filter((o) => o.paymentMethod === "COD").length;

  return {
    totalRevenue,
    todaySales,
    monthSales,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalProducts,
    totalCustomers,
    lowStockProducts,
    aov,
    categories,
    razorpayOrders,
    codOrders,
    recentOrders,
  };
}

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardMetrics();

  return (
    <div className="space-y-8">
      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-5 border border-beige/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-charcoal/60 text-xs">
            <span className="uppercase tracking-wider font-semibold">Total Revenue (Verified)</span>
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xs">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-espresso">
            ₹{data.totalRevenue.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-charcoal/60">
            This Month: <strong className="text-espresso">₹{data.monthSales.toLocaleString("en-IN")}</strong>
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 border border-beige/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-charcoal/60 text-xs">
            <span className="uppercase tracking-wider font-semibold">Total Orders</span>
            <div className="p-2 bg-amber-50 text-amber-800 rounded-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-espresso">
            {data.totalOrders}
          </div>
          <p className="text-[11px] text-charcoal/60">
            <span className="text-amber-800 font-semibold">{data.pendingOrders} pending</span> processing
          </p>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-5 border border-beige/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-charcoal/60 text-xs">
            <span className="uppercase tracking-wider font-semibold">Average Order Value</span>
            <div className="p-2 bg-blue-50 text-blue-800 rounded-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-espresso">
            ₹{Math.round(data.aov).toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-charcoal/60">Based on completed bridal and saree sales</p>
        </div>

        {/* Inventory & Low Stock */}
        <div className="bg-white p-5 border border-beige/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-charcoal/60 text-xs">
            <span className="uppercase tracking-wider font-semibold">Active Catalogue</span>
            <div className="p-2 bg-purple-50 text-purple-800 rounded-xs">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-espresso">
            {data.totalProducts} Designs
          </div>
          <p className="text-[11px] text-charcoal/60">
            {data.lowStockProducts > 0 ? (
              <span className="text-amber-700 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {data.lowStockProducts} items low in stock
              </span>
            ) : (
              <span className="text-emerald-700">All stock healthy</span>
            )}
          </p>
        </div>
      </div>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Processing Table */}
        <div className="lg:col-span-8 bg-white p-6 border border-beige/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-beige/30">
            <div>
              <h3 className="font-serif text-lg font-medium text-espresso">Recent Studio Orders</h3>
              <p className="text-xs text-charcoal/60">Live orders placed online or via COD</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs uppercase tracking-wider text-chocolate hover:text-gold font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/40 text-charcoal/70 uppercase tracking-wider text-[10px] border-y border-beige/30">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/20 text-charcoal">
                {data.recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-chocolate">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-espresso block">{ord.guestName}</span>
                      <span className="text-[10px] text-charcoal/50">{ord.guestPhone}</span>
                    </td>
                    <td className="py-3 px-3">
                      {ord.items.length} {ord.items.length === 1 ? "piece" : "pieces"}
                    </td>
                    <td className="py-3 px-3 font-semibold text-espresso">
                      ₹{Number(ord.totalAmount).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : ord.status === "CONFIRMED"
                            ? "bg-blue-50 text-blue-800 border border-blue-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/orders`}
                        className="text-xs text-gold hover:text-espresso font-semibold"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right breakdown: Payment & Categories */}
        <div className="lg:col-span-4 space-y-6">
          {/* Payment Method Distribution */}
          <div className="bg-white p-6 border border-beige/60 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-medium text-espresso border-b border-beige/30 pb-2">
              Payment Gateway Split
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-charcoal/80 mb-1">
                  <span>Razorpay (UPI / Cards / NetBanking)</span>
                  <strong className="text-espresso">{data.razorpayOrders} orders</strong>
                </div>
                <div className="w-full bg-beige/30 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gold h-full rounded-full"
                    style={{
                      width: `${data.totalOrders > 0 ? (data.razorpayOrders / data.totalOrders) * 100 : 50}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-charcoal/80 mb-1">
                  <span>Cash on Delivery (COD)</span>
                  <strong className="text-espresso">{data.codOrders} orders</strong>
                </div>
                <div className="w-full bg-beige/30 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-chocolate h-full rounded-full"
                    style={{
                      width: `${data.totalOrders > 0 ? (data.codOrders / data.totalOrders) * 100 : 50}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-6 border border-beige/60 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-medium text-espresso border-b border-beige/30 pb-2">
              Catalogue Architecture
            </h3>
            <div className="space-y-2 text-xs">
              {data.categories.map((c) => (
                <div key={c.id} className="flex justify-between py-1 border-b border-beige/20 text-charcoal/80">
                  <span className="font-medium text-espresso">{c.name}</span>
                  <span className="bg-cream px-2 py-0.5 text-[11px] font-semibold text-chocolate">
                    {c._count.products} {c._count.products === 1 ? "design" : "designs"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
