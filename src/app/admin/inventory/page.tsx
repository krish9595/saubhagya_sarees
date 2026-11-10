"use client";

import React, { useState, useEffect } from "react";
import { Boxes, Plus, Minus, AlertTriangle, History, ArrowUpDown, Check } from "lucide-react";

export default function AdminInventoryPage() {
  const [variants, setVariants] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState<number>(1);
  const [adjustmentNotes, setAdjustmentNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      if (data.success) {
        setVariants(data.variants);
        setMovements(data.movements);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjust = async (variantId: string, delta: number, note?: string) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId,
          changeDelta: delta,
          notes: note || `Stock update (${delta > 0 ? `+${delta}` : delta})`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdjustingId(null);
        setAdjustmentNotes("");
        fetchInventory();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-beige/60">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso flex items-center gap-2">
            <Boxes className="w-5 h-5 text-gold" />
            Inventory & Stock Operations
          </h1>
          <p className="text-xs text-charcoal/60">
            Real-time stock control, variant thresholds, and movement audit logs
          </p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white border border-beige/60 shadow-xs overflow-hidden">
        <div className="p-4 bg-cream/40 border-b border-beige/30 flex justify-between items-center text-xs">
          <span className="font-semibold text-espresso uppercase tracking-wider">
            Variant Stock Matrix ({variants.length})
          </span>
          <span className="text-charcoal/60">
            Threshold: ≤ 3 units triggers low-stock alert
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/20 text-charcoal/70 uppercase tracking-wider text-[10px] border-b border-beige/40">
              <tr>
                <th className="py-3 px-4">Product Design</th>
                <th className="py-3 px-4">Variant / Size</th>
                <th className="py-3 px-4">Variant SKU</th>
                <th className="py-3 px-4">Current Units</th>
                <th className="py-3 px-4">Stock Health</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20 text-charcoal">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-charcoal/50">
                    Loading inventory records...
                  </td>
                </tr>
              ) : variants.map((v) => {
                const isLow = v.stockQuantity <= 3 && v.stockQuantity > 0;
                const isOut = v.stockQuantity <= 0;

                return (
                  <tr key={v.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 px-4 font-serif font-medium text-espresso">
                      {v.product?.title || "Ethnic Ensemble"}
                    </td>
                    <td className="py-3 px-4">{v.size || v.color || v.title}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-chocolate">{v.sku}</td>
                    <td className="py-3 px-4 font-bold text-sm text-espresso">
                      {v.stockQuantity}
                    </td>
                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-red-100 text-red-800 border border-red-300">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Healthy
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAdjust(v.id, -1, "Reduced 1 unit")}
                          disabled={submitting || v.stockQuantity <= 0}
                          className="px-2 py-1 bg-ivory border border-beige/80 hover:bg-beige/40 text-charcoal font-bold disabled:opacity-30"
                          title="Reduce 1"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleAdjust(v.id, 1, "Added 1 unit")}
                          disabled={submitting}
                          className="px-2 py-1 bg-ivory border border-beige/80 hover:bg-beige/40 text-charcoal font-bold"
                          title="Add 1"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleAdjust(v.id, 5, "Batch Restock +5")}
                          disabled={submitting}
                          className="px-2.5 py-1 bg-chocolate hover:bg-espresso text-ivory text-[11px] font-semibold"
                          title="Restock +5 units"
                        >
                          +5 Batch
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Audit Log */}
      <div className="bg-white border border-beige/60 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-beige/30">
          <h3 className="font-serif text-lg font-medium text-espresso flex items-center gap-2">
            <History className="w-4 h-4 text-gold" />
            Recent Stock Movement Audit Trail
          </h3>
          <span className="text-[11px] text-charcoal/60">Last 20 transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/30 text-charcoal/70 uppercase tracking-wider text-[10px] border-y border-beige/30">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Change Delta</th>
                <th className="py-2.5 px-3">Balance After</th>
                <th className="py-2.5 px-3">Operational Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20 text-charcoal">
              {movements.map((m) => (
                <tr key={m.id} className="hover:bg-cream/10">
                  <td className="py-2.5 px-3 text-[11px] text-charcoal/60">
                    {new Date(m.createdAt).toLocaleString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold uppercase tracking-wider text-chocolate text-[10px]">
                      {m.changeType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold">
                    <span className={m.quantityDelta > 0 ? "text-emerald-700" : "text-red-700"}>
                      {m.quantityDelta > 0 ? `+${m.quantityDelta}` : m.quantityDelta}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium">{m.balanceAfter}</td>
                  <td className="py-2.5 px-3 text-charcoal/80">{m.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
