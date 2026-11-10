"use client";

import React, { useState, useEffect } from "react";
import { Boxes, Plus, Minus, AlertTriangle, History, Edit3, X, Check, Search, Filter } from "lucide-react";

export default function AdminInventoryPage() {
  const [variants, setVariants] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State for Edit Stock
  const [editingVariant, setEditingVariant] = useState<any | null>(null);
  const [exactQty, setExactQty] = useState<number>(0);
  const [changeType, setChangeType] = useState<string>("RESTOCK");
  const [auditNotes, setAuditNotes] = useState<string>("");

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

  const handleQuickAdjust = async (variantId: string, delta: number, note?: string) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId,
          changeDelta: delta,
          notes: note || `Stock update (${delta > 0 ? `+${delta}` : delta})`,
          changeType: delta > 0 ? "RESTOCK" : "DAMAGE_OR_CORRECTION",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchInventory();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (v: any) => {
    setEditingVariant(v);
    setExactQty(v.stockQuantity);
    setChangeType("PHYSICAL_AUDIT");
    setAuditNotes(`Physical inventory verification by store manager`);
  };

  const handleSaveExactStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariant) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: editingVariant.id,
          exactQuantity: Number(exactQty),
          changeType,
          notes: auditNotes || `Stock reset to ${exactQty}`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEditingVariant(null);
        fetchInventory();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = variants.filter((v) => {
    const matchesSearch =
      (v.product?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.sku || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "low") {
      return matchesSearch && v.stockQuantity <= 3 && v.stockQuantity > 0;
    }
    if (statusFilter === "out") {
      return matchesSearch && v.stockQuantity <= 0;
    }
    if (statusFilter === "healthy") {
      return matchesSearch && v.stockQuantity > 3;
    }
    return matchesSearch;
  });

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
            Real-time stock control, direct count overrides, physical audit reconciliation & movements
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-beige/60 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72 text-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-9 pr-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs">
          <span className="text-charcoal/70 uppercase font-semibold">Stock Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso font-medium"
          >
            <option value="all">All Items ({variants.length})</option>
            <option value="healthy">Healthy Stock (&gt; 3 units)</option>
            <option value="low">Low Stock Alert (≤ 3 units)</option>
            <option value="out">Out of Stock (0 units)</option>
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white border border-beige/60 shadow-xs overflow-hidden">
        <div className="p-4 bg-cream/40 border-b border-beige/30 flex justify-between items-center text-xs">
          <span className="font-semibold text-espresso uppercase tracking-wider">
            Variant Stock Matrix ({filtered.length} shown)
          </span>
          <span className="text-charcoal/60">
            Low-Stock Alert: ≤ 3 units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/20 text-charcoal/70 uppercase tracking-wider text-[10px] border-b border-beige/40">
              <tr>
                <th className="py-3 px-4">Product Design</th>
                <th className="py-3 px-4">Variant / Size</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Edit & Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20 text-charcoal">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-charcoal/50">
                    Loading inventory records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-charcoal/50">
                    No items match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => {
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
                        {v.stockQuantity} units
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
                          {/* Quick Adjust Buttons */}
                          <button
                            onClick={() => handleQuickAdjust(v.id, -1, "Manual deduction -1")}
                            disabled={submitting || v.stockQuantity <= 0}
                            className="px-2 py-1 bg-ivory border border-beige/80 hover:bg-beige/40 text-charcoal font-bold disabled:opacity-30"
                            title="Quick Reduce -1"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(v.id, 1, "Quick restock +1")}
                            disabled={submitting}
                            className="px-2 py-1 bg-ivory border border-beige/80 hover:bg-beige/40 text-charcoal font-bold"
                            title="Quick Restock +1"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(v.id, 5, "Batch Restock +5")}
                            disabled={submitting}
                            className="px-2 py-1 bg-chocolate hover:bg-espresso text-ivory text-[10px] font-semibold"
                            title="Batch Restock +5 units"
                          >
                            +5
                          </button>
                          {/* Exact Edit Button */}
                          <button
                            onClick={() => openEditModal(v)}
                            className="px-2.5 py-1 bg-gold hover:bg-gold/80 text-espresso text-[11px] font-bold flex items-center gap-1"
                            title="Edit exact stock count & notes"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Audit Log */}
      <div className="bg-white border border-beige/60 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-beige/30">
          <h3 className="font-serif text-lg font-medium text-espresso flex items-center gap-2">
            <History className="w-4 h-4 text-gold" />
            Stock Movement Audit Trail
          </h3>
          <span className="text-[11px] text-charcoal/60">Last 30 operational changes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/30 text-charcoal/70 uppercase tracking-wider text-[10px] border-y border-beige/30">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Item / SKU</th>
                <th className="py-2.5 px-3">Change Type</th>
                <th className="py-2.5 px-3">Delta</th>
                <th className="py-2.5 px-3">Balance After</th>
                <th className="py-2.5 px-3">Notes</th>
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
                  <td className="py-2.5 px-3 font-mono font-semibold text-chocolate">
                    {m.notes ? m.notes.slice(0, 32) : "Stock Update"}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-cream border border-beige/60 text-espresso">
                      {m.changeType}
                    </span>
                  </td>
                  <td
                    className={`py-2.5 px-3 font-bold ${
                      m.quantityDelta > 0 ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {m.quantityDelta > 0 ? `+${m.quantityDelta}` : m.quantityDelta}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-espresso">
                    {m.balanceAfter} units
                  </td>
                  <td className="py-2.5 px-3 text-charcoal/70">{m.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Stock Modal */}
      {editingVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs"
            onClick={() => setEditingVariant(null)}
            aria-hidden="true"
          />
          <div
            className="relative z-10 w-full max-w-lg bg-white border border-beige/60 shadow-2xl p-6"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-beige/40 mb-4">
              <div>
                <h3 className="font-serif text-lg font-medium text-espresso">
                  Edit Stock Count
                </h3>
                <p className="text-xs text-charcoal/60">
                  {editingVariant.product?.title} ({editingVariant.sku})
                </p>
              </div>
              <button
                onClick={() => setEditingVariant(null)}
                className="p-1 text-charcoal/60 hover:text-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExactStock} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Exact Available Stock Units *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={exactQty}
                  onChange={(e) => setExactQty(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-lg font-bold text-espresso font-mono"
                />
                <p className="text-[10px] text-charcoal/50 mt-1">
                  Previous stock: {editingVariant.stockQuantity} units • Change delta:{" "}
                  <strong className={exactQty - editingVariant.stockQuantity >= 0 ? "text-emerald-700" : "text-red-700"}>
                    {exactQty - editingVariant.stockQuantity >= 0 ? `+${exactQty - editingVariant.stockQuantity}` : exactQty - editingVariant.stockQuantity} units
                  </strong>
                </p>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Audit Reason / Adjustment Type *
                </label>
                <select
                  value={changeType}
                  onChange={(e) => setChangeType(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso font-medium"
                >
                  <option value="PHYSICAL_AUDIT">Physical Stock Count / Store Audit</option>
                  <option value="RESTOCK">Supplier Restock Shipment</option>
                  <option value="CUSTOMER_RETURN">Customer Return / Exchange</option>
                  <option value="DAMAGED_GOODS">Damaged / Defective Stock Removal</option>
                  <option value="MANUAL_ADJUSTMENT">Manual Administrative Correction</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Reason & Audit Notes
                </label>
                <textarea
                  rows={2}
                  value={auditNotes}
                  onChange={(e) => setAuditNotes(e.target.value)}
                  placeholder="e.g. Received new lot from Surat artisan workshop..."
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-beige/30">
                <button
                  type="button"
                  onClick={() => setEditingVariant(null)}
                  className="px-4 py-2 border border-beige/80 text-charcoal/80 hover:bg-cream font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-chocolate hover:bg-espresso text-ivory font-semibold uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {submitting ? "Updating..." : "Save Stock Count"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
