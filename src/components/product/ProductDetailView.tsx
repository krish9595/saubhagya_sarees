"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Check,
  Plus,
  Minus,
  MapPin,
  Sparkles,
  Ruler,
  HelpCircle,
  Share2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/product/ProductCard";

interface ProductDetailViewProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.[0]?.id || null
  );
  const [quantity, setQuantity] = useState(1);
  const [customMeasurements, setCustomMeasurements] = useState("");
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "care" | "shipping" | "reviews">("specs");

  // Review submission state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const currentVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  const priceNum = Number(product.price) + (currentVariant ? Number(currentVariant.additionalPrice || 0) : 0);
  const mrpNum = Number(product.mrp) + (currentVariant ? Number(currentVariant.additionalPrice || 0) : 0);
  const hasDiscount = mrpNum > priceNum;
  const discountPct = product.discountPercent || (hasDiscount ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0);

  const images = product.images || [];
  const currentImage = images[activeImageIndex]?.url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000";

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (redirectAfter = false) => {
    addItem({
      productId: product.id,
      variantId: selectedVariantId,
      title: product.title,
      slug: product.slug,
      sku: currentVariant?.sku || product.sku,
      price: priceNum,
      mrp: mrpNum,
      image: currentImage,
      quantity,
      size: currentVariant?.size || "Free Size",
      color: product.primaryColor || currentVariant?.color || "Standard",
      customMeasurements: customMeasurements.trim() || undefined,
    });

    if (redirectAfter) {
      router.push("/checkout");
    } else {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeStatus("Please enter a valid 6-digit Indian PIN code.");
      return;
    }
    // Realistic simulation for Indian postal hubs
    setPincodeStatus(`✓ Delivery available to PIN ${pincode.trim()} in 3 to 5 business days. Free shipping applicable!`);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          authorName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      if (res.ok) {
        setReviewSuccess(true);
        setReviewName("");
        setReviewComment("");
      }
    } catch (err) {
      console.error(err);
    }
    setReviewSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-charcoal/60 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-gold transition-colors">
          Shop
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/shop/${product.category.slug}`} className="hover:text-gold transition-colors capitalize">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-espresso font-medium line-clamp-1">{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left: Interactive Media Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sticky top-24">
          {/* Thumbnails list */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[580px] shrink-0 pb-2 sm:pb-0">
              {images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 shrink-0 border-2 overflow-hidden bg-cream/30 transition-all ${
                    activeImageIndex === idx ? "border-gold shadow-sm scale-102" : "border-beige/40 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image src={img.url} alt={img.alt || product.title} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}

          {/* Large Main Photograph */}
          <div className="relative flex-1 aspect-3/4 max-h-[640px] bg-white border border-beige/40 shadow-md overflow-hidden group">
            <Image
              src={currentImage}
              alt={product.title}
              fill
              priority
              className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-105 will-change-transform"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
              {product.isNewArrival && (
                <span className="bg-espresso text-ivory text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 shadow-sm">
                  New Arrival
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-gold text-white text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 shadow-sm">
                  Bestseller
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-charcoal/60 mb-2">
              <span className="uppercase tracking-widest text-chocolate font-bold">
                {product.category?.name || "Luxury Ethnic"}
              </span>
              <span className="font-mono text-[11px] text-charcoal/50">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-espresso leading-tight">
              {product.title}
            </h1>

            {/* Price & MRP */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-espresso">
                ₹{priceNum.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-charcoal/40 line-through">
                    ₹{mrpNum.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs uppercase font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-charcoal/60 mt-1">
              (Inclusive of all taxes & complimentary Pan-India shipping above ₹4,999)
            </p>
          </div>

          {/* Short Highlights */}
          {product.shortDescription && (
            <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-light border-y border-beige/40 py-3.5">
              {product.shortDescription}
            </p>
          )}

          {/* Variants / Size Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-espresso">
                  Select Size / Style:
                </label>
                {product.customizationAvailable && (
                  <button
                    onClick={() => setShowCustomModal(true)}
                    className="text-xs text-chocolate hover:text-gold flex items-center gap-1 font-medium underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Custom Measurements Guide</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-4 py-2 text-xs font-medium border transition-all ${
                      selectedVariantId === v.id
                        ? "border-espresso bg-espresso text-ivory shadow-xs"
                        : "border-beige/80 bg-white hover:border-gold text-charcoal"
                    }`}
                  >
                    {v.size || v.color || "Standard"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Measurements Input if Requested */}
          {product.customizationAvailable && (
            <div className="p-3.5 bg-cream/40 border border-beige/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-espresso flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  Bespoke Studio Tailoring Available
                </span>
              </div>
              <textarea
                value={customMeasurements}
                onChange={(e) => setCustomMeasurements(e.target.value)}
                rows={2}
                placeholder="Enter custom measurements (Bust, Waist, Hip, Kurti length, Blouse details) or requests..."
                className="w-full text-xs p-2.5 bg-white border border-beige/80 focus:outline-none focus:border-gold"
              />
              <p className="text-[11px] text-charcoal/60">
                Our senior master tailor in Hisar will review and confirm measurements via WhatsApp after ordering.
              </p>
            </div>
          )}

          {/* Quantity and Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-espresso">
                Quantity:
              </span>
              <div className="flex items-center border border-beige/80 bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-cream text-charcoal"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 hover:bg-cream text-charcoal"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() =>
                  toggleWishlist({
                    productId: product.id,
                    title: product.title,
                    slug: product.slug,
                    sku: product.sku,
                    price: priceNum,
                    mrp: mrpNum,
                    image: currentImage,
                    categoryName: product.category?.name,
                  })
                }
                className={`p-2.5 border transition-all ${
                  inWishlist
                    ? "border-rose-300 bg-rose-50 text-rose-600"
                    : "border-beige/80 bg-white text-charcoal hover:text-rose-600"
                }`}
                aria-label={inWishlist ? "Saved in Wishlist" : "Save to Wishlist"}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Buttons: Add to Bag + Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleAddToCart(false)}
                className="w-full flex items-center justify-center gap-2 bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold py-4 shadow-md active:scale-[0.98] transition-all duration-200 ease-luxury group"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-champagne group-hover:scale-110 transition-transform duration-300 ease-luxury" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-champagne text-espresso text-xs uppercase tracking-widest font-semibold py-4 shadow-md active:scale-[0.98] transition-all duration-200 ease-luxury"
              >
                <span>Buy It Now</span>
              </button>
            </div>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="p-4 bg-white border border-beige/60 space-y-2">
            <label htmlFor="pincodeInput" className="text-xs font-semibold uppercase tracking-wider text-espresso flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gold" />
              Check Estimated Delivery
            </label>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                id="pincodeInput"
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit PIN code (e.g. 125001)"
                className="flex-1 text-xs px-3 py-2 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="bg-espresso hover:bg-chocolate text-ivory text-xs px-4 py-2 font-medium tracking-wider uppercase transition-colors"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className={`text-xs mt-1.5 ${pincodeStatus.startsWith("✓") ? "text-emerald-800" : "text-red-600"}`}>
                {pincodeStatus}
              </p>
            )}
          </div>

          {/* Studio Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-charcoal/70">
            <div className="p-2 bg-cream/30 border border-beige/30">
              <ShieldCheck className="w-4 h-4 text-gold mx-auto mb-1" />
              <span>100% Authentic Handcrafted</span>
            </div>
            <div className="p-2 bg-cream/30 border border-beige/30">
              <Truck className="w-4 h-4 text-gold mx-auto mb-1" />
              <span>Complimentary Shipping &gt; ₹4,999</span>
            </div>
            <div className="p-2 bg-cream/30 border border-beige/30">
              <RotateCcw className="w-4 h-4 text-gold mx-auto mb-1" />
              <span>Easy Exchange Support</span>
            </div>
          </div>

          {/* WhatsApp Direct Enquiry */}
          <div className="pt-2">
            <a
              href={`https://wa.me/919996088960?text=${encodeURIComponent(
                `Namaste Saubhagya Sarees! I am interested in "${product.title}" (SKU: ${product.sku}, Price: ₹${priceNum}). Please share more details and availability.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/40 text-xs font-semibold uppercase tracking-wider py-3 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#25D366]" />
              <span>Enquire About This Piece on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TABS: Specifications, Fabric & Care, Delivery, Reviews    */}
      {/* ======================================================== */}
      <section className="mt-16 sm:mt-24 border-t border-beige/40 pt-10">
        <div className="flex border-b border-beige/40 gap-4 sm:gap-8 overflow-x-auto text-xs uppercase tracking-widest font-semibold pb-3">
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "specs" ? "border-gold text-espresso font-bold" : "border-transparent text-charcoal/60 hover:text-espresso"
            }`}
          >
            Specifications & Details
          </button>
          <button
            onClick={() => setActiveTab("care")}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "care" ? "border-gold text-espresso font-bold" : "border-transparent text-charcoal/60 hover:text-espresso"
            }`}
          >
            Fabric & Wash Care
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "shipping" ? "border-gold text-espresso font-bold" : "border-transparent text-charcoal/60 hover:text-espresso"
            }`}
          >
            Shipping & Returns
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "reviews" ? "border-gold text-espresso font-bold" : "border-transparent text-charcoal/60 hover:text-espresso"
            }`}
          >
            Customer Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        {/* Tab 1: Specifications */}
        {activeTab === "specs" && (
          <div className="py-8 space-y-6">
            <div className="prose prose-sm max-w-none text-charcoal/80 leading-relaxed font-light whitespace-pre-line">
              {product.description}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl text-xs bg-white p-6 border border-beige/40 shadow-xs">
              {product.fabric && (
                <div className="flex justify-between py-1.5 border-b border-beige/20">
                  <span className="text-charcoal/60 font-medium">Fabric</span>
                  <span className="text-espresso font-semibold">{product.fabric}</span>
                </div>
              )}
              {product.occasion && (
                <div className="flex justify-between py-1.5 border-b border-beige/20">
                  <span className="text-charcoal/60 font-medium">Occasion</span>
                  <span className="text-espresso font-semibold">{product.occasion}</span>
                </div>
              )}
              {product.primaryColor && (
                <div className="flex justify-between py-1.5 border-b border-beige/20">
                  <span className="text-charcoal/60 font-medium">Primary Colour</span>
                  <span className="text-espresso font-semibold">{product.primaryColor}</span>
                </div>
              )}
              {product.sareeLength && (
                <div className="flex justify-between py-1.5 border-b border-beige/20">
                  <span className="text-charcoal/60 font-medium">Saree Length</span>
                  <span className="text-espresso font-semibold">{product.sareeLength}</span>
                </div>
              )}
              {product.blouseDetails && (
                <div className="flex justify-between py-1.5 border-b border-beige/20">
                  <span className="text-charcoal/60 font-medium">Blouse</span>
                  <span className="text-espresso font-semibold">{product.blouseDetails}</span>
                </div>
              )}
              {product.suitComponents && (
                <div className="flex justify-between py-1.5 border-b border-beige/20">
                  <span className="text-charcoal/60 font-medium">Ensemble Components</span>
                  <span className="text-espresso font-semibold">{product.suitComponents}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Care */}
        {activeTab === "care" && (
          <div className="py-8 max-w-2xl text-xs sm:text-sm text-charcoal/80 space-y-4">
            <h4 className="font-serif text-lg font-medium text-espresso">
              Preserving Your Heirloom Garment
            </h4>
            <p className="leading-relaxed">
              {product.careInstructions ||
                "Dry Clean Only. Pure handloom silks and intricate zardozi garments should be stored carefully wrapped in unbleached pure cotton or muslin fabric. Avoid applying scents or perfumes directly onto metal zari work."}
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-charcoal/70 pt-2">
              <li>Always dry clean in certified facilities specializing in Indian ethnic embroideries.</li>
              <li>Refold sarees periodically along alternate folds to prevent zari wear.</li>
              <li>Aerate fabrics in a sheltered shaded area once every few months.</li>
            </ul>
          </div>
        )}

        {/* Tab 3: Shipping */}
        {activeTab === "shipping" && (
          <div className="py-8 max-w-2xl text-xs sm:text-sm text-charcoal/80 space-y-4 leading-relaxed">
            <h4 className="font-serif text-lg font-medium text-espresso">
              Shipping & Delivery Information
            </h4>
            <p>
              We provide <strong>Complimentary Pan-India Shipping</strong> on all domestic orders valued at ₹4,999 and above. For orders below ₹4,999, a flat nominal delivery charge of ₹150 applies.
            </p>
            <p>
              Orders are packaged in moisture-resistant luxury protective covers from our Hisar wholesale market studio and dispatched via premium air couriers (BlueDart / Delhivery / DTDC). Standard dispatch occurs within 24 to 48 working hours.
            </p>
            <h5 className="font-serif text-base font-medium text-espresso pt-2">
              Returns & Exchange Policy
            </h5>
            <p className="text-xs text-charcoal/70">
              In the unlikely event of receiving a damaged, defective or incorrect piece, our studio provides a hassle-free exchange within 7 days of verified delivery. Custom stitched and tailored garments are customized specifically to your measurements.
            </p>
          </div>
        )}

        {/* Tab 4: Reviews */}
        {activeTab === "reviews" && (
          <div className="py-8 space-y-8 max-w-3xl">
            {/* Reviews list */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev: any) => (
                  <div key={rev.id} className="p-4 bg-white border border-beige/40 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex text-gold">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current text-gold" : "text-beige/40"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-espresso">{rev.authorName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 font-medium">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-charcoal/40">
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {rev.title && <h5 className="font-serif text-sm font-semibold text-espresso">{rev.title}</h5>}
                    <p className="text-xs text-charcoal/80 leading-relaxed font-light">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="p-6 bg-white border border-beige/40 text-center text-xs text-charcoal/60">
                  No verified customer reviews yet for this design. Be the first to share your experience!
                </div>
              )}
            </div>

            {/* Submit Review Form */}
            <div className="p-6 bg-cream/40 border border-beige/60 space-y-4">
              <h4 className="font-serif text-lg font-medium text-espresso">Write a Review</h4>
              {reviewSuccess ? (
                <p className="text-xs text-emerald-800 bg-emerald-50 p-3 border border-emerald-200">
                  ✓ Thank you! Your review has been submitted and will be displayed following studio moderation.
                </p>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-espresso">Your Rating:</span>
                    <div className="flex gap-1 text-gold cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star className={`w-4 h-4 ${star <= reviewRating ? "fill-current text-gold" : "text-beige"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Your Name (e.g. Anjali Sharma)"
                    className="w-full text-xs p-2.5 bg-white border border-beige/80 focus:outline-none focus:border-gold"
                    required
                  />

                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Share your thoughts on the fabric quality, fitting, zari finish, and packaging..."
                    className="w-full text-xs p-2.5 bg-white border border-beige/80 focus:outline-none focus:border-gold"
                    required
                  />

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="bg-chocolate hover:bg-espresso text-ivory text-xs uppercase tracking-widest font-semibold px-6 py-2.5 transition-colors"
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* RELATED PRODUCTS SECTION                                 */}
      {/* ======================================================== */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-beige/40">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold block mb-1">
              Complementary Masterpieces
            </span>
            <h2 className="font-serif text-3xl text-espresso font-normal">
              You May Also Adore
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Custom Measurements Guide Modal conforming to Modern Web Guidance */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-charcoal/70 backdrop-blur-xs"
            onClick={() => setShowCustomModal(false)}
            aria-hidden="true"
          />
          <div
            className="relative z-10 w-full max-w-lg bg-ivory border border-beige/60 shadow-2xl p-6 sm:p-8"
            role="dialog"
            aria-label="Custom Measurements Guide"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-beige/40 mb-4">
              <h3 className="font-serif text-xl font-medium text-espresso flex items-center gap-2">
                <Ruler className="w-5 h-5 text-gold" />
                Measurement Instructions
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="p-1 text-charcoal/70 hover:text-espresso"
                aria-label="Close"
                autoFocus
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-charcoal/80 space-y-3 leading-relaxed">
              <p>
                Our bridal studio in Hisar specializes in tailor-made stitching for bridal lehengas, padded blouses, and anarkalis.
              </p>
              <div className="bg-cream/40 p-3 border border-beige/40 space-y-1.5 font-medium">
                <p>1. <strong>Bust / Chest:</strong> Measure around the fullest part of your bust.</p>
                <p>2. <strong>Waist:</strong> Measure natural waistline above navel.</p>
                <p>3. <strong>Hips:</strong> Measure around fullest part of your hips.</p>
                <p>4. <strong>Length:</strong> Shoulder to floor (including shoe heel height).</p>
                <p>5. <strong>Blouse Style:</strong> Deep neck / High neck / Sweetheart / Boat neck.</p>
              </div>
              <p className="text-[11px] text-charcoal/60">
                You can attach measurements in the order form, or WhatsApp us directly at <strong>+91 99960 88960</strong> with your Order ID for a personal consultation.
              </p>
              <button
                onClick={() => setShowCustomModal(false)}
                className="w-full mt-4 bg-chocolate text-ivory text-xs uppercase tracking-widest font-semibold py-2.5"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
