"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Star, Loader2, Link as LinkIcon, Plus } from "lucide-react";

export interface UploadedImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

interface ImageUploaderProps {
  value?: string | string[] | UploadedImage[];
  onChange: (value: any) => void;
  multiple?: boolean;
  label?: string;
  helperText?: string;
}

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  label = "Upload Image from Computer",
  helperText = "Supports JPEG, PNG, WebP, AVIF up to 10MB",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize images array
  const images: UploadedImage[] = React.useMemo(() => {
    if (!value) return [];
    if (typeof value === "string") {
      return value ? [{ url: value, isPrimary: true }] : [];
    }
    if (Array.isArray(value)) {
      return value.map((item, idx) => {
        if (typeof item === "string") {
          return { url: item, isPrimary: idx === 0 };
        }
        return {
          url: item.url,
          alt: item.alt || "",
          isPrimary: item.isPrimary ?? idx === 0,
        };
      });
    }
    return [];
  }, [value]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to upload file");
        }

        uploadedUrls.push(data.url);

        if (!multiple) break; // If single mode, take first file
      }

      if (multiple) {
        const newImages: UploadedImage[] = [
          ...images,
          ...uploadedUrls.map((url, idx) => ({
            url,
            isPrimary: images.length === 0 && idx === 0,
          })),
        ];
        onChange(newImages);
      } else {
        onChange(uploadedUrls[0]);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    if (multiple) {
      const updated = images.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      onChange(updated);
    } else {
      onChange("");
    }
  };

  const handleSetPrimary = (index: number) => {
    if (!multiple) return;
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(updated);
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    if (multiple) {
      const newImages: UploadedImage[] = [
        ...images,
        { url: manualUrl.trim(), isPrimary: images.length === 0 },
      ];
      onChange(newImages);
    } else {
      onChange(manualUrl.trim());
    }
    setManualUrl("");
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal/80">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-chocolate hover:text-gold flex items-center gap-1 font-medium transition-colors"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? "Hide URL input" : "Or enter image URL"}</span>
          </button>
        </div>
      )}

      {/* Manual URL Input Dropdown */}
      {showUrlInput && (
        <div className="flex gap-2 p-3 bg-cream/40 border border-beige/60">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-beige/80 focus:outline-none focus:border-gold text-espresso"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-3 py-1.5 bg-chocolate hover:bg-espresso text-ivory text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        multiple={multiple}
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* Upload Zone */}
      {(!images.length || multiple) && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFileUpload(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed border-beige/80 hover:border-gold bg-ivory/60 hover:bg-cream/40 p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
            uploading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <Loader2 className="w-6 h-6 text-gold animate-spin" />
              <span className="text-xs font-medium text-chocolate">
                Uploading photo from your device...
              </span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center border border-gold/40 text-chocolate">
                <UploadCloud className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-xs font-semibold text-espresso">
                  Click to browse from your computer <span className="text-gold font-normal">or drag & drop</span>
                </p>
                <p className="text-[10px] text-charcoal/50 mt-0.5">{helperText}</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 bg-red-50 p-2 border border-red-200">
          {error}
        </p>
      )}

      {/* Thumbnails display */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">
            {multiple ? `Uploaded Photos (${images.length})` : "Current Image Preview:"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative group border rounded-xs overflow-hidden bg-cream aspect-3/4 flex items-center justify-center ${
                  img.isPrimary ? "border-gold ring-2 ring-gold/40" : "border-beige/60"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `Product image ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />

                {/* Primary Badge */}
                {img.isPrimary && (
                  <span className="absolute top-1.5 left-1.5 bg-chocolate/90 text-gold text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 shadow-xs flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-gold text-gold" /> Primary
                  </span>
                )}

                {/* Action buttons overlay */}
                <div className="absolute inset-0 bg-espresso/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {multiple && !img.isPrimary && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetPrimary(idx);
                      }}
                      title="Set as primary"
                      className="p-1.5 bg-white text-espresso hover:text-gold rounded-xs shadow-xs text-xs font-semibold"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                    title="Remove image"
                    className="p-1.5 bg-red-600 text-white hover:bg-red-700 rounded-xs shadow-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
