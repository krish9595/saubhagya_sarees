"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FolderTree, Plus, Edit3, Trash2, ExternalLink, Check, AlertCircle, X, Sparkles } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    image: "",
    displayOrder: 0,
    isActive: true,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      slug: "",
      description: "",
      image: "",
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setEditingCategory(null);
    setShowAddModal(false);
  };

  const openEditModal = (c: any) => {
    setEditingCategory(c);
    setFormData({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      image: c.image || "",
      displayOrder: c.displayOrder || 0,
      isActive: c.isActive,
    });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const isEditing = !!editingCategory;
      const url = "/api/admin/categories";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: isEditing
            ? `Updated category "${formData.name}"`
            : `Created category "${formData.name}"`,
        });
        resetForm();
        fetchCategories();
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        setStatusMessage({
          type: "error",
          text: data.message || "Failed to save category",
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err?.message || "An error occurred" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (c: any) => {
    if (!confirm(`Are you sure you want to delete category "${c.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${c.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: "success", text: `Deleted category "${c.name}"` });
        fetchCategories();
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        setStatusMessage({ type: "error", text: data.message || "Could not delete category" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-beige/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-gold" />
            Category & Collection Architecture
          </h1>
          <p className="text-xs text-charcoal/60">
            {categories.length} active collection taxonomies in storefront navigation • Upload category tiles & manage routes
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-4 py-2.5 flex items-center gap-2 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add Category</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-3 text-xs flex items-center gap-2 border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
              : "bg-red-50 text-red-800 border-red-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white border border-beige/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/40 text-charcoal/70 uppercase tracking-wider text-[10px] border-b border-beige/40">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Image Tile</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">URL Route</th>
                <th className="py-3 px-4">Linked Designs</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20 text-charcoal">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal/50">
                    Loading category taxonomies...
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-chocolate">#{c.displayOrder}</td>
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-14 bg-cream border border-beige/40 overflow-hidden">
                        <Image
                          src={c.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100"}
                          alt={c.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-serif font-medium text-base text-espresso">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-charcoal/60">/shop/{c.slug}</td>
                    <td className="py-3 px-4 font-semibold text-espresso">
                      {c._count?.products || 0} {c._count?.products === 1 ? "design" : "designs"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase font-bold border ${
                          c.isActive
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-red-50 text-red-800 border-red-200"
                        }`}
                      >
                        {c.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 bg-cream/80 hover:bg-gold/20 text-chocolate hover:text-espresso rounded-xs transition-colors"
                          title="Edit Category & Change Image"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/shop/${c.slug}`}
                          target="_blank"
                          className="p-1.5 bg-cream/80 hover:bg-gold/20 text-charcoal/70 hover:text-gold rounded-xs transition-colors"
                          title="Preview Category"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(c)}
                          className="p-1.5 bg-cream/80 hover:bg-red-50 text-charcoal/60 hover:text-red-700 rounded-xs transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {(showAddModal || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs"
            onClick={resetForm}
            aria-hidden="true"
          />
          <div
            className="relative z-10 w-full max-w-xl bg-white border border-beige/60 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-beige/40 mb-5">
              <h3 className="font-serif text-xl font-medium text-espresso flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
              </h3>
              <button
                onClick={resetForm}
                className="p-1 text-charcoal/60 hover:text-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarees, Bridal Suite, Kurtis..."
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold font-serif text-base text-espresso"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. sarees (auto-generated if empty)"
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold font-mono text-chocolate"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A short subtitle shown on homepage tiles and collection pages..."
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso"
                />
              </div>

              {/* Computer Image Uploader for Category Tile */}
              <div className="p-4 bg-cream/20 border border-beige/60">
                <ImageUploader
                  label="Category Cover Image (Upload From Computer)"
                  helperText="Upload a high quality portrait or editorial photo for this category tile"
                  multiple={false}
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="font-semibold text-espresso">Category Visible on Storefront Navigation</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-beige/30">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-beige/80 text-charcoal/80 hover:bg-cream font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-chocolate hover:bg-espresso text-ivory font-semibold uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
