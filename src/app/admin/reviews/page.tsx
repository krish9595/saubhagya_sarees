"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (reviewId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, status }),
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-beige/60 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso flex items-center gap-2">
            <Star className="w-5 h-5 text-gold" />
            Customer Reviews Moderation
          </h1>
          <p className="text-xs text-charcoal/60">
            {reviews.length} total customer reviews submitted
          </p>
        </div>
      </div>

      <div className="bg-white border border-beige/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/40 text-charcoal/70 uppercase tracking-wider text-[10px] border-b border-beige/40">
              <tr>
                <th className="py-3 px-4">Design</th>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20 text-charcoal">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-cream/20 transition-colors">
                  <td className="py-3 px-4 font-serif font-medium text-espresso">
                    {rev.product?.title || "Product"}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-espresso block">{rev.authorName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-800 font-semibold">
                        ✓ Verified Buyer
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current" : "text-beige/40"}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs text-charcoal/80 line-clamp-2">
                    {rev.comment}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                        rev.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {rev.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {rev.status !== "APPROVED" && (
                        <button
                          onClick={() => handleUpdateStatus(rev.id, "APPROVED")}
                          className="px-2.5 py-1 bg-emerald-700 text-white font-semibold uppercase text-[10px]"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== "REJECTED" && (
                        <button
                          onClick={() => handleUpdateStatus(rev.id, "REJECTED")}
                          className="px-2.5 py-1 bg-red-700 text-white font-semibold uppercase text-[10px]"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
