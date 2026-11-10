"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Trash2, Edit3, Sparkles, Filter, X, ExternalLink, Check, AlertCircle } from "lucide-react";
import ImageUploader, { UploadedImage } from "@/components/admin/ImageUploader";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    sku: string;
    price: string;
    mrp: string;
    categoryId: string;
    fabric: string;
    occasion: string;
    primaryColor: string;
    description: string;
    shortDescription: string;
    status: string;
    isNewArrival: boolean;
    isBestseller: boolean;
    isFeatured: boolean;
    images: UploadedImage[];
    initialStock?: string;
  }>({
    title: "",
    sku: "",
    price: "",
    mrp: "",
    categoryId: "",
    fabric: "Pure Silk",
    occasion: "Bridal",
    primaryColor: "Red",
    description: "",
    shortDescription: "",
    status: "PUBLISHED",
    isNewArrival: true,
    isBestseller: false,
    isFeatured: false,
    images: [],
    initialStock: "10",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        if (data.categories[0] && !formData.categoryId) {
          setFormData((f) => ({ ...f, categoryId: data.categories[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      sku: "",
      price: "",
      mrp: "",
      categoryId: categories[0]?.id || "",
      fabric: "Pure Silk",
      occasion: "Bridal",
      primaryColor: "Red",
      description: "",
      shortDescription: "",
      status: "PUBLISHED",
      isNewArrival: true,
      isBestseller: false,
      isFeatured: false,
      images: [],
      initialStock: "10",
    });
    setEditingProduct(null);
    setShowAddModal(false);
  };

  const openEditModal = (prod: any) => {
    setEditingProduct(prod);
    const existingImages: UploadedImage[] = (prod.images || []).map((img: any) => ({
      url: img.url,
      alt: img.alt || prod.title,
      isPrimary: !!img.isPrimary,
    }));

    setFormData({
      id: prod.id,
      title: prod.title || "",
      sku: prod.sku || "",
      price: String(prod.price || ""),
      mrp: String(prod.mrp || prod.price || ""),
      categoryId: prod.categoryId || categories[0]?.id || "",
      fabric: prod.fabric || "Pure Silk",
      occasion: prod.occasion || "Bridal",
      primaryColor: prod.primaryColor || "Red",
      description: prod.description || "",
      shortDescription: prod.shortDescription || "",
      status: prod.status || "PUBLISHED",
      isNewArrival: !!prod.isNewArrival,
      isBestseller: !!prod.isBestseller,
      isFeatured: !!prod.isFeatured,
      images: existingImages,
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const isEditing = !!editingProduct;
      const url = "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        ...formData,
        id: editingProduct?.id,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: isEditing
            ? `Successfully updated "${formData.title}"`
            : `Successfully created "${formData.title}"`,
        });
        resetForm();
        fetchProducts();
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage({
          type: "error",
          text: data.message || "Failed to save product",
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: err?.message || "An unexpected error occurred",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setStatusMessage({ type: "success", text: `Deleted "${title}"` });
        fetchProducts();
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCat === "all" || p.categoryId === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-beige/60">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso">
            Product Management & Catalog Editor
          </h1>
          <p className="text-xs text-charcoal/60">
            {products.length} luxury ethnic designs in live database • Full image uploads & editing enabled
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
          <span>Add New Creation</span>
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-beige/60 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72 text-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or SKU..."
            className="w-full pl-9 pr-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs">
          <span className="text-charcoal/70 uppercase font-semibold">Category:</span>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-beige/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/40 text-charcoal/70 uppercase tracking-wider text-[10px] border-b border-beige/40">
              <tr>
                <th className="py-3 px-4">Design</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">MRP</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20 text-charcoal">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-charcoal/50">
                    Loading studio catalogue...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-charcoal/50">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const totalStock = prod.variants?.reduce((sum: number, v: any) => sum + v.stockQuantity, 0) || 0;
                  const primaryImg = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100";

                  return (
                    <tr key={prod.id} className="hover:bg-cream/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 bg-cream shrink-0 border border-beige/30 overflow-hidden">
                            <Image src={primaryImg} alt={prod.title} fill className="object-cover" sizes="40px" />
                          </div>
                          <div>
                            <Link
                              href={`/product/${prod.slug}`}
                              target="_blank"
                              className="font-serif font-medium text-espresso hover:text-gold block"
                            >
                              {prod.title}
                            </Link>
                            <span className="text-[10px] text-charcoal/50">{prod.fabric || "Handloom"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-chocolate">{prod.sku}</td>
                      <td className="py-3 px-4">{prod.category?.name || "Uncategorized"}</td>
                      <td className="py-3 px-4 font-semibold text-espresso">
                        ₹{Number(prod.price).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4 text-charcoal/50 line-through">
                        ₹{Number(prod.mrp).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            totalStock <= 3 ? "text-red-700 bg-red-50 px-2 py-0.5 border border-red-200" : "text-emerald-800"
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {prod.isNewArrival && (
                            <span className="px-1.5 py-0.5 text-[9px] bg-gold/15 text-gold font-bold uppercase tracking-wider">
                              New
                            </span>
                          )}
                          {prod.isBestseller && (
                            <span className="px-1.5 py-0.5 text-[9px] bg-chocolate/10 text-chocolate font-bold uppercase tracking-wider">
                              Best
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {prod.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 bg-cream/80 hover:bg-gold/20 text-chocolate hover:text-espresso rounded-xs transition-colors"
                            title="Edit Product Details & Images"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            href={`/product/${prod.slug}`}
                            target="_blank"
                            className="p-1.5 bg-cream/80 hover:bg-gold/20 text-charcoal/70 hover:text-gold rounded-xs transition-colors"
                            title="View on Storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.title)}
                            className="p-1.5 bg-cream/80 hover:bg-red-50 text-charcoal/60 hover:text-red-700 rounded-xs transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs"
            onClick={resetForm}
            aria-hidden="true"
          />
          <div
            className="relative z-10 w-full max-w-3xl bg-white border border-beige/60 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-beige/40 mb-6">
              <h3 className="font-serif text-xl font-medium text-espresso flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                {editingProduct ? `Edit Creation: ${editingProduct.title}` : "Add New Ethnic Creation"}
              </h3>
              <button
                onClick={resetForm}
                className="p-1 text-charcoal/60 hover:text-espresso"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              {/* Product Title */}
              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Design Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Wine Banarasi Katan Silk Saree"
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold font-serif text-sm text-espresso"
                />
              </div>

              {/* SKU, Category, Price, MRP */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SS-SAR-001"
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold font-mono uppercase text-chocolate font-bold"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="18500"
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso font-bold"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    MRP (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="24500"
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso font-bold"
                  />
                </div>
              </div>

              {/* Fabric, Occasion, Color, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Fabric
                  </label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="Pure Katan Silk"
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Occasion
                  </label>
                  <input
                    type="text"
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    placeholder="Bridal / Wedding Guest"
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Primary Color
                  </label>
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="Wine Maroon"
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso font-medium"
                  >
                    <option value="PUBLISHED">PUBLISHED (Live)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              {/* Badges / Checkboxes */}
              <div className="flex flex-wrap gap-6 py-2 px-3 bg-cream/30 border border-beige/40">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="font-semibold text-espresso">New Arrival Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="font-semibold text-espresso">Bestseller Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="font-semibold text-espresso">Feature on Homepage</span>
                </label>
              </div>

              {/* Computer Image Uploader */}
              <div className="p-4 bg-cream/20 border border-beige/60 space-y-2">
                <ImageUploader
                  label="Product Photography (Upload From Computer)"
                  helperText="Upload 1 or more high-resolution photos. Drag & drop or browse from your PC/Mac. The first photo is the primary storefront image."
                  multiple={true}
                  value={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Full Editorial Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the handloom craftsmanship, zari border, weaving method, styling suggestions..."
                  className="w-full px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold text-espresso"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-beige/40">
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
                  {submitting ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
