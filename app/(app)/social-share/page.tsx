"use client";

import React, { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import {
  IconPhoto,
  IconSparkles,
  IconDownload,
  IconUpload,
  IconZoomIn,
  IconZoomOut,
  IconGrid3x3,
  IconDimensions,
  IconMaximize,
} from "@tabler/icons-react";
import { toast } from "@/app/store/Toast";
import { cn } from "@/app/lib/utils";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1", label: "Instagram Square", desc: "Perfect for feed posts" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5", label: "Instagram Portrait", desc: "Ideal for taller feed posts" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9", label: "Twitter Post", desc: "Standard feed image layout" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1", label: "Twitter Header", desc: "Profile header banner" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78", label: "Facebook Cover", desc: "Page header layout" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  
  // Canvas Viewport Controls
  const [zoomLevel, setZoomLevel] = useState<number>(80); // percentage zoom
  const [showGridGuides, setShowGridGuides] = useState<boolean>(false);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
      const timer = setTimeout(() => {
        setIsTransforming(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [selectedFormat, uploadedImage]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      if (data.publicId) {
        setUploadedImage(data.publicId);
        toast("Image registered in Social Share workspace!", "success");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast("Failed to register image. Limit size: 10MB.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!uploadedImage) return;
    const format = socialFormats[selectedFormat];
    
    // Build direct Cloudinary URL with secure transformations
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxojgqsrh";
    const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_auto,w_${format.width},h_${format.height}/${uploadedImage}`;

    toast("Beginning high-resolution image compilation...", "info");

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast("Optimized social asset downloaded!", "success");
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
        toast("Failed to download image. Opening in a new tab.", "error");
        window.open(imageUrl, "_blank");
      });
  };

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col justify-between">
      {/* Visualizer canvas and sidebar */}
      {!uploadedImage ? (
        /* Empty / Upload State Panel */
        <div className="max-w-2xl mx-auto w-full pt-12">
          <div className="card bg-base-200 border border-base-content/10 backdrop-blur-md rounded-3xl p-8 md:p-14 text-center hover:border-primary/30 transition-all duration-300 shadow-2xl">
            <div className="flex flex-col items-center justify-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                {isUploading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <IconPhoto className="w-8 h-8" />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-base-content">
                  {isUploading ? "Uploading Canvas..." : "Upload Canvas Asset"}
                </h3>
                <p className="text-base-content/60 text-xs sm:text-sm max-w-sm leading-normal">
                  Drop a high-resolution portrait or landscape image here to format it to social media platform ratios.
                </p>
              </div>

              <label className="btn btn-primary text-primary-content border-none rounded-xl px-6 py-3 cursor-pointer shadow-lg shadow-primary/25 mt-4 transition-all duration-200 hover:scale-105">
                <span>Browse Files</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>
      ) : (
        /* Workspace Editor Layout */
        <div className="grid gap-6 lg:grid-cols-12 items-stretch h-full min-h-[70vh]">
          {/* Controls - Left Pane (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-base-200 border border-base-content/10 rounded-2xl p-5 space-y-6 shadow-xl h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-base-content/5">
                <IconSparkles className="w-5 h-5 text-pink-400" />
                <h2 className="text-base font-bold text-base-content uppercase tracking-wider">
                  Aspect Presets
                </h2>
              </div>

              {/* Format presets lists */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {Object.keys(socialFormats).map((key) => {
                  const format = socialFormats[key as SocialFormat];
                  const isSelected = selectedFormat === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedFormat(key as SocialFormat)}
                      className={cn(
                        "w-full flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                        isSelected
                          ? "bg-primary/10 border-primary text-primary shadow-inner"
                          : "bg-base-100/40 border-base-content/5 text-base-content/70 hover:border-base-content/20 hover:text-base-content"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-extrabold text-xs">{format.label}</span>
                        <span className="text-[9px] bg-base-350 border border-base-content/10 px-2 py-0.5 rounded-md font-mono font-bold">
                          {format.aspectRatio}
                        </span>
                      </div>
                      <span className="text-[10px] opacity-60 leading-normal">{format.desc}</span>
                      <span className="text-[9px] opacity-40 font-mono mt-1 flex items-center gap-1">
                        <IconDimensions className="w-3 h-3 text-primary" />
                        Target: {format.width}x{format.height}px
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-base-content/5 flex flex-col gap-2.5 shrink-0">
              <button
                onClick={handleDownload}
                className="btn btn-primary w-full text-primary-content border-none shadow-lg shadow-primary/20 rounded-xl py-3 font-semibold cursor-pointer transition-transform duration-150 active:scale-98 flex items-center justify-center gap-1.5"
              >
                <IconDownload className="w-4 h-4" />
                Compile & Download
              </button>
              <button
                onClick={() => setUploadedImage(null)}
                className="btn btn-outline w-full border-base-content/10 text-base-content/70 hover:bg-base-300 hover:text-base-content rounded-xl py-3 cursor-pointer"
              >
                <IconUpload className="w-4 h-4 inline mr-1" />
                Upload Different Asset
              </button>
            </div>
          </div>

          {/* Visualizer Preview Canvas - Right Pane (lg:col-span-8) */}
          <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-base-content/10 rounded-2xl overflow-hidden shadow-2xl relative min-h-[500px]">
            {/* Viewport Control Bar */}
            <div className="h-12 border-b border-white/5 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between z-10 shrink-0 select-none text-white/70 text-xs">
              <div className="flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Workspace Canvas Viewport</span>
              </div>

              {/* Viewport adjustments */}
              <div className="flex items-center gap-4">
                {/* Rule of thirds grid toggle */}
                <button
                  onClick={() => setShowGridGuides(!showGridGuides)}
                  className={cn(
                    "p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white cursor-pointer transition-colors flex items-center gap-1",
                    showGridGuides && "border-pink-500 bg-pink-500/10 text-pink-400"
                  )}
                  title="Toggle Crop grid guides"
                >
                  <IconGrid3x3 className="w-4 h-4" />
                  <span className="text-[10px] font-bold hidden sm:inline">Grid Guides</span>
                </button>

                {/* Zoom percentage controls */}
                <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-0.5">
                  <button
                    onClick={() => setZoomLevel(Math.max(30, zoomLevel - 10))}
                    className="p-1 rounded-md hover:bg-white/10 hover:text-white cursor-pointer"
                    title="Zoom Out"
                  >
                    <IconZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold w-9 text-center shrink-0">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                    className="p-1 rounded-md hover:bg-white/10 hover:text-white cursor-pointer"
                    title="Zoom In"
                  >
                    <IconZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(80)}
                    className="p-1 rounded-md hover:bg-white/10 hover:text-white cursor-pointer border-l border-white/10 pl-1.5"
                    title="Reset Zoom (80%)"
                  >
                    <IconMaximize className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Editor Viewport Pane with grid pattern background */}
            <div className="flex-1 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:16px_16px] bg-slate-950 flex items-center justify-center p-8 overflow-hidden relative">
              {isTransforming ? (
                /* Glowing Transformation Loader */
                <div className="flex flex-col items-center gap-4 text-center z-10">
                  <div className="w-12 h-12 rounded-full border-4 border-t-pink-500 border-white/10 animate-spin"></div>
                  <div className="space-y-1">
                    <p className="font-bold text-white text-xs">Applying Gravity Frame...</p>
                    <p className="text-[10px] text-white/55">Cloudinary smart cropping active</p>
                  </div>
                </div>
              ) : (
                /* Dynamic Preview Card */
                <div
                  className="relative transition-all duration-300 ease-out flex items-center justify-center max-w-full max-h-full"
                  style={{
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: "center center",
                  }}
                >
                  <div className="relative border border-white/10 shadow-2xl rounded-lg overflow-hidden bg-black select-none max-w-full">
                    {/* Visualizer crop aspect wrapper */}
                    <div
                      style={{
                        aspectRatio: socialFormats[selectedFormat].aspectRatio.replace(":", "/"),
                        maxHeight: "380px",
                        width: "550px",
                        maxWidth: "100%",
                      }}
                      className="relative overflow-hidden flex items-center justify-center"
                    >
                      <CldImage
                        width={socialFormats[selectedFormat].width}
                        height={socialFormats[socialFormats[selectedFormat].label as SocialFormat]?.height || socialFormats[selectedFormat].height}
                        src={uploadedImage}
                        sizes="(max-width: 768px) 100vw, 800px"
                        crop="fill"
                        gravity="auto"
                        alt="Transformed Social Media Asset"
                        className="object-cover w-full h-full rounded-md transition-all duration-300"
                      />

                      {/* Rule of Thirds Crop Overlay */}
                      {showGridGuides && (
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none animate-fade-in">
                          <div className="border-r border-b border-white/25 border-dashed"></div>
                          <div className="border-r border-b border-white/25 border-dashed"></div>
                          <div className="border-b border-white/25 border-dashed"></div>
                          <div className="border-r border-b border-white/25 border-dashed"></div>
                          <div className="border-r border-b border-white/25 border-dashed"></div>
                          <div className="border-b border-white/25 border-dashed"></div>
                          <div className="border-r border-white/25 border-dashed"></div>
                          <div className="border-r border-white/25 border-dashed"></div>
                          <div></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Info bar */}
            <div className="h-10 border-t border-white/5 bg-slate-950/90 text-[10px] text-white/50 px-4 flex items-center justify-between shrink-0 font-mono">
              <span>Aspect Ratio: {socialFormats[selectedFormat].aspectRatio}</span>
              <span>Cloudinary gravity: dynamic auto-face</span>
              <span>Signed CDN delivery</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
