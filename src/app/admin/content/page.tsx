"use client";

import React, { useState, useEffect } from "react";
import { FileEdit, Save, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminContentPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [successKey, setSuccessKey] = useState<string | null>(null);

  // Editable form state for key sections
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementBadge, setAnnouncementBadge] = useState("");

  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroSubheadline, setHeroSubheadline] = useState("");
  const [heroDesktopImg, setHeroDesktopImg] = useState("");
  const [heroTagline, setHeroTagline] = useState("");

  const [bridalHeadline, setBridalHeadline] = useState("");
  const [bridalDesc, setBridalDesc] = useState("");
  const [bridalBannerImg, setBridalBannerImg] = useState("");

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      if (data.success) {
        setSections(data.sections);
        const map = new Map<string, any>(data.sections.map((s: any) => [s.sectionKey, s]));

        if (map.has("announcement_bar")) {
          const parsed = JSON.parse(map.get("announcement_bar")!.contentJson);
          setAnnouncementText(parsed.text || "");
          setAnnouncementBadge(parsed.badge || "");
        }
        if (map.has("hero_section")) {
          const parsed = JSON.parse(map.get("hero_section")!.contentJson);
          setHeroHeadline(parsed.headline || "");
          setHeroSubheadline(parsed.subheadline || "");
          setHeroDesktopImg(parsed.desktopImage || "");
          setHeroTagline(parsed.tagline || "");
        }
        if (map.has("bridal_feature")) {
          const parsed = JSON.parse(map.get("bridal_feature")!.contentJson);
          setBridalHeadline(parsed.headline || "");
          setBridalDesc(parsed.description || "");
          setBridalBannerImg(parsed.bannerImage || "");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSaveSection = async (sectionKey: string, contentObj: any) => {
    setSavingKey(sectionKey);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionKey,
          contentJson: JSON.stringify(contentObj),
        }),
      });
      if (res.ok) {
        setSuccessKey(sectionKey);
        setTimeout(() => setSuccessKey(null), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-beige/60 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-espresso flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-gold" />
            Homepage CMS & Content Management
          </h1>
          <p className="text-xs text-charcoal/60">
            Dynamically configure marketing banners, editorial campaigns, and upload photos directly from computer
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-chocolate hover:text-gold font-semibold uppercase tracking-wider"
        >
          <span>Preview Live Homepage</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-charcoal/60">Loading CMS sections...</div>
      ) : (
        <div className="space-y-8 max-w-4xl">
          {/* Section 1: Top Announcement Bar */}
          <div className="bg-white p-6 border border-beige/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-beige/30 pb-3">
              <h3 className="font-serif text-lg font-medium text-espresso">
                1. Top Announcement Strip
              </h3>
              {successKey === "announcement_bar" && (
                <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                  <Check className="w-4 h-4" /> Saved Successfully!
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block uppercase font-semibold text-charcoal/80 mb-1">
                  Highlight Badge Text
                </label>
                <input
                  type="text"
                  value={announcementBadge}
                  onChange={(e) => setAnnouncementBadge(e.target.value)}
                  placeholder="e.g. NEW FESTIVE EDIT"
                  className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-charcoal/80 mb-1">
                  Announcement Message
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Complimentary Shipping Across India on Orders Above ₹4,999"
                  className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    handleSaveSection("announcement_bar", {
                      badge: announcementBadge,
                      text: announcementText,
                      isActive: true,
                    })
                  }
                  disabled={savingKey === "announcement_bar"}
                  className="bg-chocolate hover:bg-espresso text-ivory px-5 py-2 uppercase font-semibold tracking-wider text-xs shadow-xs"
                >
                  {savingKey === "announcement_bar" ? "Saving..." : "Save Announcement"}
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Luxury Hero Campaign */}
          <div className="bg-white p-6 border border-beige/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-beige/30 pb-3">
              <h3 className="font-serif text-lg font-medium text-espresso">
                2. Luxury Hero Banner Campaign
              </h3>
              {successKey === "hero_section" && (
                <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                  <Check className="w-4 h-4" /> Saved Successfully!
                </span>
              )}
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-semibold text-charcoal/80 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={heroTagline}
                    onChange={(e) => setHeroTagline(e.target.value)}
                    placeholder="SAUBHAGYA BRIDAL STUDIO • HISAR"
                    className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block uppercase font-semibold text-charcoal/80 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={heroHeadline}
                    onChange={(e) => setHeroHeadline(e.target.value)}
                    placeholder="Elegance Woven in Tradition"
                    className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold font-serif text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-semibold text-charcoal/80 mb-1">
                  Supporting Editorial Copy
                </label>
                <textarea
                  rows={2}
                  value={heroSubheadline}
                  onChange={(e) => setHeroSubheadline(e.target.value)}
                  placeholder="Discover timeless sarees, exquisite bridal ensembles..."
                  className="w-full p-2.5 bg-ivory border border-beige/80 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Upload Hero Image from computer */}
              <div className="p-4 bg-cream/20 border border-beige/60">
                <ImageUploader
                  label="Hero Banner Image (Upload From Computer)"
                  helperText="Upload a high resolution 16:9 or 21:9 editorial campaign photograph"
                  multiple={false}
                  value={heroDesktopImg}
                  onChange={(url) => setHeroDesktopImg(url)}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    handleSaveSection("hero_section", {
                      headline: heroHeadline,
                      subheadline: heroSubheadline,
                      desktopImage: heroDesktopImg,
                      tagline: heroTagline,
                      cta1Text: "Explore Collections",
                      cta1Link: "/shop",
                      cta2Text: "Discover Bridal",
                      cta2Link: "/shop/bridal",
                    })
                  }
                  disabled={savingKey === "hero_section"}
                  className="bg-chocolate hover:bg-espresso text-ivory px-5 py-2 uppercase font-semibold tracking-wider text-xs shadow-xs"
                >
                  {savingKey === "hero_section" ? "Saving..." : "Save Hero Campaign"}
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Bridal Editorial Spotlight */}
          <div className="bg-white p-6 border border-beige/60 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-beige/30 pb-3">
              <h3 className="font-serif text-lg font-medium text-espresso">
                3. Bridal Editorial Spotlight
              </h3>
              {successKey === "bridal_feature" && (
                <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                  <Check className="w-4 h-4" /> Saved Successfully!
                </span>
              )}
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-semibold text-charcoal/80 mb-1">
                  Bridal Feature Headline
                </label>
                <input
                  type="text"
                  value={bridalHeadline}
                  onChange={(e) => setBridalHeadline(e.target.value)}
                  placeholder="For Moments That Become Memories"
                  className="w-full p-2.5 bg-ivory border border-beige/80 font-serif text-sm"
                />
              </div>

              <div>
                <label className="block uppercase font-semibold text-charcoal/80 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={bridalDesc}
                  onChange={(e) => setBridalDesc(e.target.value)}
                  placeholder="Discover exquisite bridal and wedding occasionwear..."
                  className="w-full p-2.5 bg-ivory border border-beige/80"
                />
              </div>

              {/* Upload Bridal Banner from computer */}
              <div className="p-4 bg-cream/20 border border-beige/60">
                <ImageUploader
                  label="Bridal Spotlight Banner (Upload From Computer)"
                  helperText="Upload an opulent bridal lehenga or wedding editorial banner"
                  multiple={false}
                  value={bridalBannerImg}
                  onChange={(url) => setBridalBannerImg(url)}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    handleSaveSection("bridal_feature", {
                      headline: bridalHeadline,
                      description: bridalDesc,
                      bannerImage: bridalBannerImg,
                      ctaText: "Discover Bridal Collection",
                      ctaLink: "/shop/bridal",
                      eyebrow: "THE BRIDAL SUITE",
                    })
                  }
                  disabled={savingKey === "bridal_feature"}
                  className="bg-chocolate hover:bg-espresso text-ivory px-5 py-2 uppercase font-semibold tracking-wider text-xs shadow-xs"
                >
                  {savingKey === "bridal_feature" ? "Saving..." : "Save Bridal Editorial"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
