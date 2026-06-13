"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface FormatSelectorProps {
  sourceFormat: string;
  selectedFormat: string;
  onSelectFormat: (format: string) => void;
}

interface FormatOption {
  id: string;
  label: string;
  badge?: string;
  badgeClass?: string;
  desc: string;
}

const TARGET_FORMATS: FormatOption[] = [
  {
    id: "avif",
    label: "AVIF",
    badge: "Next-Gen",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    desc: "Highest efficiency, ultra-modern compression.",
  },
  {
    id: "webp",
    label: "WEBP",
    badge: "Recommended",
    badgeClass: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    desc: "Outstanding web compression with transparency.",
  },
  {
    id: "png",
    label: "PNG",
    badge: "Lossless",
    badgeClass: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
    desc: "Perfect for graphics, screenshots & transparency.",
  },
  {
    id: "jpg",
    label: "JPG",
    badge: "Universal",
    badgeClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    desc: "Universal standard format, ideal for photographs.",
  },
  {
    id: "gif",
    label: "GIF",
    badge: "Legacy",
    badgeClass: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    desc: "Supports simple animation & limited colors.",
  },
  {
    id: "bmp",
    label: "BMP",
    badge: "Lossless",
    badgeClass: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    desc: "Raw, uncompressed bitmap for precise storage.",
  },
  {
    id: "tiff",
    label: "TIFF",
    badge: "Publishing",
    badgeClass: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
    desc: "Professional print standard with detailed metadata.",
  },
];

export default function FormatSelector({
  sourceFormat,
  selectedFormat,
  onSelectFormat,
}: FormatSelectorProps) {
  // Normalize source format to check against target options
  const normalizedSource = sourceFormat.toLowerCase() === "jpeg" ? "jpg" : sourceFormat.toLowerCase();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-bold text-base-content/60 uppercase tracking-wider block mb-2">
          Select Target Format
        </label>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {TARGET_FORMATS.map((format) => {
            const isSameAsSource = format.id === normalizedSource;
            const isSelected = format.id === selectedFormat;

            return (
              <button
                key={format.id}
                type="button"
                disabled={isSameAsSource}
                onClick={() => onSelectFormat(format.id)}
                className={cn(
                  "flex flex-col items-start p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 select-none bg-base-100",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                    : isSameAsSource
                    ? "opacity-35 cursor-not-allowed border-base-content/10 bg-base-200"
                    : "border-base-content/10 hover:border-base-content/25 hover:bg-base-200/50"
                )}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-extrabold text-sm text-base-content tracking-wide">
                    {format.label}
                  </span>
                  {format.badge && (
                    <span className={cn("text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md", format.badgeClass)}>
                      {isSameAsSource ? "Current" : format.badge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-base-content/60 leading-normal font-semibold">
                  {format.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
