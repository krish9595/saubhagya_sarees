"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Filter, X, ChevronDown, SlidersHorizontal, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  sku: string;
  price: number | string;
  mrp: number | string;
  discountPercent?: number;
  primaryColor?: string | null;
  fabric?: string | null;
  occasion?: string | null;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  images: { url: string; alt?: string | null }[];
  variants?: { id: string; size?: string | null; color?: string | null; stockQuantity: number }[];
  category?: { id: string; name: string; slug: string } | null;
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface ShopClientProps {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
  currentCategorySlug?: string;
  pageTitle?: string;
  pageDescription?: string;
}

export default function ShopClient({
  initialProducts,
  categories,
  currentCategorySlug,
  pageTitle = "All Ethnic Collections",
  pageDescription = "Explore handcrafted bridal lehengas, authentic Banarasi silks, organza sarees, and festive designer suits.",
}: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategorySlug || "all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [selectedFabric, setSelectedFabric] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract unique filter options from actual products
  const occasions = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.occasion) set.add(p.occasion);
    });
    return Array.from(set);
  }, [initialProducts]);

  const fabrics = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.fabric) {
        // extract primary fabric word
        const parts = p.fabric.split(" ");
        if (parts.length > 0) set.add(parts[0]);
      }
    });
    return Array.from(set);
  }, [initialProducts]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Category filter
        if (selectedCategory !== "all") {
          if (p.category?.slug !== selectedCategory) return false;
        }
        // Occasion filter
        if (selectedOccasion !== "all") {
          if (p.occasion !== selectedOccasion) return false;
        }
        // Fabric filter
        if (selectedFabric !== "all") {
          if (!p.fabric || !p.fabric.toLowerCase().includes(selectedFabric.toLowerCase())) {
            return false;
          }
        }
        // Price filter
        if (Number(p.price) > priceRange) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a.price);
        const priceB = Number(b.price);
        if (sortBy === "price_asc") return priceA - priceB;
        if (sortBy === "price_desc") return priceB - priceA;
        if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        if (sortBy === "bestseller") return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
        return 0; // recommended
      });
  }, [initialProducts, selectedCategory, selectedOccasion, selectedFabric, priceRange, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedOccasion("all");
    setSelectedFabric("all");
    setPriceRange(100000);
    setSortBy("recommended");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-charcoal/60 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-gold transition-colors">
          Shop
        </Link>
        {currentCategorySlug && (
          <>
            <span>/</span>
            <span className="text-espresso font-medium capitalize">
              {currentCategorySlug.replace("-", " ")}
            </span>
          </>
        )}
      </nav>

      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left border-b border-beige/40 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso mb-2">
          {pageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-charcoal/70 max-w-3xl leading-relaxed">
          {pageDescription}
        </p>
      </div>

      {/* Controls Bar: Mobile filter button, Product count, Sorting */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-cream/40 p-4 border border-beige/40">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-white px-3.5 py-2 border border-beige/80 text-xs font-semibold uppercase tracking-wider text-espresso"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold" />
            <span>Filters</span>
          </button>

          <span className="text-xs text-charcoal/80">
            Showing <strong className="text-espresso">{filteredProducts.length}</strong> creations
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <label htmlFor="sortSelect" className="text-xs text-charcoal/70 uppercase tracking-wider font-semibold whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs px-3 py-2 bg-white border border-beige/80 focus:outline-none focus:border-gold text-espresso font-medium"
          >
            <option value="recommended">Curated / Recommended</option>
            <option value="newest">Newest Additions</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="bestseller">Bestselling</option>
          </select>
        </div>
      </div>

      {/* Layout Grid: Desktop Sidebar + Product Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-6 border border-beige/40 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-beige/40 pb-3">
            <h3 className="font-serif text-lg font-medium text-espresso flex items-center gap-2">
              <Filter className="w-4 h-4 text-gold" />
              Refine Collection
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-[11px] text-chocolate/80 hover:text-gold uppercase tracking-wider font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-espresso mb-3">
              Categories
            </h4>
            <div className="space-y-1.5 text-xs text-charcoal/80">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`block w-full text-left py-1 px-2 rounded-xs transition-colors ${
                  selectedCategory === "all" ? "bg-cream text-espresso font-bold" : "hover:text-gold"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`block w-full text-left py-1 px-2 rounded-xs transition-colors ${
                    selectedCategory === cat.slug ? "bg-cream text-espresso font-bold" : "hover:text-gold"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="border-t border-beige/30 pt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-espresso">
                Max Price
              </h4>
              <span className="text-xs font-bold text-chocolate">
                ₹{priceRange.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={3000}
              max={100000}
              step={2000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#B18A4A] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-charcoal/50 mt-1">
              <span>₹3,000</span>
              <span>₹1,00,000+</span>
            </div>
          </div>

          {/* Occasion Filter */}
          {occasions.length > 0 && (
            <div className="border-t border-beige/30 pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-espresso mb-3">
                Occasion
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedOccasion("all")}
                  className={`text-[11px] px-2.5 py-1 border transition-colors ${
                    selectedOccasion === "all" ? "border-espresso bg-espresso text-ivory" : "border-beige/80 bg-ivory text-charcoal"
                  }`}
                >
                  All
                </button>
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`text-[11px] px-2.5 py-1 border transition-colors ${
                      selectedOccasion === occ ? "border-espresso bg-espresso text-ivory" : "border-beige/80 bg-ivory text-charcoal"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fabric Filter */}
          {fabrics.length > 0 && (
            <div className="border-t border-beige/30 pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-espresso mb-3">
                Fabric Type
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedFabric("all")}
                  className={`text-[11px] px-2.5 py-1 border transition-colors ${
                    selectedFabric === "all" ? "border-espresso bg-espresso text-ivory" : "border-beige/80 bg-ivory text-charcoal"
                  }`}
                >
                  All
                </button>
                {fabrics.map((fab) => (
                  <button
                    key={fab}
                    onClick={() => setSelectedFabric(fab)}
                    className={`text-[11px] px-2.5 py-1 border transition-colors ${
                      selectedFabric === fab ? "border-espresso bg-espresso text-ivory" : "border-beige/80 bg-ivory text-charcoal"
                    }`}
                  >
                    {fab}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 text-center border border-beige/40 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center text-gold mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-espresso mb-2">No creations found</h3>
              <p className="text-xs text-charcoal/70 max-w-sm mx-auto mb-6">
                Try relaxing your price slider or filter selections to view available handcrafted pieces.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-6 py-3 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer conforming to Modern Web Guidance */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="relative z-10 w-4/5 max-w-xs bg-ivory text-charcoal h-full flex flex-col shadow-2xl border-r border-beige/40"
            role="dialog"
            aria-label="Filter Options"
            aria-modal="true"
          >
            <div className="p-4 border-b border-beige/40 flex items-center justify-between bg-cream/40">
              <h3 className="font-serif text-lg font-medium text-espresso">Filter Products</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-charcoal/70"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Category */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-espresso mb-2">
                  Category
                </h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setMobileFilterOpen(false);
                    }}
                    className={`block w-full text-left py-1.5 px-2 ${selectedCategory === "all" ? "bg-cream font-bold" : ""}`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.slug);
                        setMobileFilterOpen(false);
                      }}
                      className={`block w-full text-left py-1.5 px-2 ${selectedCategory === c.slug ? "bg-cream font-bold" : ""}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-beige/30 pt-4">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="font-semibold uppercase tracking-wider text-espresso">Max Price</span>
                  <span className="font-bold text-chocolate">₹{priceRange.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min={3000}
                  max={100000}
                  step={2000}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#B18A4A]"
                />
              </div>

              {/* Reset */}
              <div className="pt-4 border-t border-beige/30">
                <button
                  onClick={() => {
                    clearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full py-2.5 bg-chocolate text-ivory text-xs uppercase tracking-widest font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
