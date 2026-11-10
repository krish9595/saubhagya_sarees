import React from "react";
import prisma from "@/lib/prisma";
import { Users, Phone, Mail, ShoppingBag, MapPin, IndianRupee } from "lucide-react";

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      addresses: true,
      orders: {
        select: {
          id: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-beige/60 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso flex items-center gap-2">
            <Users className="w-5 h-5 text-gold" />
            Customer CRM & Profiles
          </h1>
          <p className="text-xs text-charcoal/60">
            {customers.length} registered patrons and studio shoppers
          </p>
        </div>
      </div>

      <div className="bg-white border border-beige/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/40 text-charcoal/70 uppercase tracking-wider text-[10px] border-b border-beige/40">
              <tr>
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Primary City</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spent</th>
                <th className="py-3 px-4">Account Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20 text-charcoal">
              {customers.map((c) => {
                const totalSpent = c.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
                const defaultAddress = c.addresses[0];

                return (
                  <tr key={c.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 px-4 font-serif font-medium text-espresso text-sm">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 font-mono">{c.phone}</td>
                    <td className="py-3 px-4 text-charcoal/70">{c.email || "N/A"}</td>
                    <td className="py-3 px-4">{defaultAddress ? `${defaultAddress.city}, ${defaultAddress.state}` : "Hisar"}</td>
                    <td className="py-3 px-4 font-semibold text-espresso">
                      {c.orders.length} {c.orders.length === 1 ? "order" : "orders"}
                    </td>
                    <td className="py-3 px-4 font-bold text-chocolate">
                      ₹{totalSpent.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-cream text-espresso border border-beige/60">
                        {c.isGuest ? "Guest Checkout" : "Registered Member"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
