"use client";

import React, { useState } from "react";
import { BarChart3, Download, Printer, FileSpreadsheet, CheckCircle2 } from "lucide-react";

export default function AdminReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadCSV = async (type: "orders" | "inventory" | "sales") => {
    setDownloading(type);
    try {
      const res = await fetch(`/api/admin/reports?type=${type}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `saubhagya_${type}_report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-beige/60 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold" />
            Business Reports & CSV Exports
          </h1>
          <p className="text-xs text-charcoal/60">
            Export GST audit reports, stock valuation, and order history
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Orders CSV */}
        <div className="bg-white p-6 border border-beige/60 shadow-xs space-y-4">
          <div className="p-3 bg-cream/40 w-max border border-beige/40 text-chocolate">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-espresso">Order History Export</h3>
            <p className="text-xs text-charcoal/70 mt-1 leading-relaxed">
              Complete log of all customer transactions, payment methods, delivery addresses, and fulfillment statuses.
            </p>
          </div>
          <button
            onClick={() => handleDownloadCSV("orders")}
            disabled={downloading === "orders"}
            className="w-full flex items-center justify-center gap-2 bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold py-3 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-gold" />
            <span>{downloading === "orders" ? "Generating..." : "Download Orders CSV"}</span>
          </button>
        </div>

        {/* Inventory Valuation CSV */}
        <div className="bg-white p-6 border border-beige/60 shadow-xs space-y-4">
          <div className="p-3 bg-cream/40 w-max border border-beige/40 text-chocolate">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-espresso">Stock Valuation Report</h3>
            <p className="text-xs text-charcoal/70 mt-1 leading-relaxed">
              Current inventory counts by variant, SKU mapping, low-stock warnings, and retail stock valuation.
            </p>
          </div>
          <button
            onClick={() => handleDownloadCSV("inventory")}
            disabled={downloading === "inventory"}
            className="w-full flex items-center justify-center gap-2 bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold py-3 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-gold" />
            <span>{downloading === "inventory" ? "Generating..." : "Download Stock CSV"}</span>
          </button>
        </div>

        {/* GST & Tax Summary */}
        <div className="bg-white p-6 border border-beige/60 shadow-xs space-y-4">
          <div className="p-3 bg-cream/40 w-max border border-beige/40 text-chocolate">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-espresso">GST & Tax Summary</h3>
            <p className="text-xs text-charcoal/70 mt-1 leading-relaxed">
              Itemized taxable sales, CGST (2.5%), SGST (2.5%), and IGST calculations for accountant filing.
            </p>
          </div>
          <button
            onClick={() => handleDownloadCSV("sales")}
            disabled={downloading === "sales"}
            className="w-full flex items-center justify-center gap-2 bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold py-3 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-gold" />
            <span>{downloading === "sales" ? "Generating..." : "Download Tax CSV"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
