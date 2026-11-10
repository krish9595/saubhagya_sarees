import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopNav from "@/components/admin/AdminTopNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Management Console | Saubhagya Sarees & Bridal Studio",
  description: "Enterprise e-commerce operations, catalogue, inventory, orders, and CMS management.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4EFEA] flex flex-col lg:flex-row text-[#26221F]">
      {/* Persistent Enterprise Sidebar */}
      <AdminSidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopNav />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
