"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Trash2, Edit3, Sparkles, Filter, X, ExternalLink } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    sku: "",
    price: "",
    mrp: "",
    categoryId: "",
    fabric: "Pure Silk",
    occasion: "Bridal",
    primaryColor: "Red",
    description: "",
    imageUrl: "",
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
        if (data.categories[0]) {
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

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowAddModal(false);
        fetchProducts();
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
          imageUrl: "",
          initialStock: "10",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      fetchProducts();
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
            Product Management
          </h1>
          <p className="text-xs text-charcoal/60">
            {products.length} ethnic fashion designs in database
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-4 py-2.5 flex items-center gap-2 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add New Creation</span>
        </button>
      </div>

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
                <th className="py-3 px-4">Available Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/20 text-charcoal">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-charcoal/50">
                    Loading studio catalogue...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-charcoal/50">
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
                        <span className="inline-block px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {prod.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/product/${prod.slug}`}
                            target="_blank"
                            className="p-1 text-charcoal/60 hover:text-gold"
                            title="View on Storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.title)}
                            className="p-1 text-charcoal/60 hover:text-red-700"
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

      {/* Add Product Modal conforming to Modern Web Guidance */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs"
            onClick={() => setShowAddModal(false)}
            aria-hidden="true"
          />
          <div
            className="relative z-10 w-full max-w-2xl bg-white border border-beige/60 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-label="Add Product Creation"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-beige/40 mb-6">
              <h3 className="font-serif text-xl font-medium text-espresso flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                Add New Ethnic Creation
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-charcoal/60 hover:text-espresso"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Royal Banarasi Pure Katan Silk Saree"
                  className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. SBS-SR-0999"
                    className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold uppercase font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 14500"
                    className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="e.g. 18500"
                    className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Initial Stock Units
                  </label>
                  <input
                    type="number"
                    value={formData.initialStock}
                    onChange={(e) => setFormData({ ...formData, initialStock: e.target.value })}
                    placeholder="10"
                    className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Fabric
                  </label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g. Pure Katan Silk"
                    className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
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
                    placeholder="e.g. Bridal / Wedding Guest"
                    className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                    Primary Colour
                  </label>
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="e.g. Crimson Maroon"
                    className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider font-semibold text-charcoal/80 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed craftsmanship notes, weave type, blouse details..."
                  className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-4 border-t border-beige/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-beige/80 text-charcoal hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-chocolate hover:bg-espresso text-ivory font-semibold uppercase tracking-wider shadow-xs"
                >
                  Save Product to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
