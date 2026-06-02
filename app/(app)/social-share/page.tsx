"use client";

import React, { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { IconPhoto, IconSparkles, IconDownload, IconUpload } from "@tabler/icons-react";

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

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
      // Simulate transformation delay
      const timer = setTimeout(() => {
        setIsTransforming(false);
      }, 1000);
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
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
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
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
        alert("Failed to download image. Please try again.");
      });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-base-content">
          Social Share Studio
        </h1>
        <p className="text-base-content/70 text-sm md:text-base max-w-xl">
          Upload any high-res image and automatically format it to match optimal dimensions for social media platforms.
        </p>
      </div>

      {!uploadedImage ? (
        /* Upload Panel */
        <div className="max-w-2xl mx-auto">
          <div className="card bg-base-200 border border-base-content/10 backdrop-blur-md rounded-2xl p-8 md:p-12 text-center hover:border-primary/30 transition-colors duration-300">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                {isUploading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <IconPhoto className="w-8 h-8" />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-base-content">
                  {isUploading ? "Uploading Asset..." : "Upload Studio Image"}
                </h3>
                <p className="text-base-content/60 text-sm max-w-sm">
                  Drag and drop your image file here, or click the button below to browse your workspace files.
                </p>
              </div>

              <label className="btn btn-primary text-primary-content border-none rounded-xl px-6 py-3 cursor-pointer shadow-lg shadow-primary/25 mt-4 transition-transform duration-200 hover:scale-105 active:scale-95">
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
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Controls - Left Pane */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card bg-base-200 border border-base-content/10 backdrop-blur-md rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
                <IconSparkles className="w-5 h-5 text-primary" />
                Presets & Cropping
              </h2>

              <div className="space-y-3">
                {Object.keys(socialFormats).map((key) => {
                  const format = socialFormats[key as SocialFormat];
                  const isSelected = selectedFormat === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedFormat(key as SocialFormat)}
                      className={`w-full flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 border-primary text-primary shadow-inner"
                          : "bg-base-100/40 border-base-content/10 text-base-content/70 hover:border-base-content/25 hover:text-base-content"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-sm">{format.label}</span>
                        <span className="text-[10px] bg-base-300 px-2 py-0.5 rounded-md font-semibold opacity-70">
                          {format.aspectRatio}
                        </span>
                      </div>
                      <span className="text-xs opacity-60 leading-normal">{format.desc}</span>
                      <span className="text-[10px] opacity-40 font-mono mt-1">
                        Resolution: {format.width}x{format.height}px
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-base-content/5 flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  className="btn btn-primary w-full text-primary-content border-none shadow-lg shadow-primary/20 rounded-xl py-3 font-semibold cursor-pointer transition-transform duration-200 hover:scale-102 active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <IconDownload className="w-4 h-4" />
                  Download Optimized Asset
                </button>
                <button
                  onClick={() => setUploadedImage(null)}
                  className="btn btn-outline w-full border-base-content/10 text-base-content/70 hover:bg-base-300 hover:text-base-content rounded-xl py-3 cursor-pointer"
                >
                  <IconUpload className="w-4 h-4 inline mr-1" />
                  Upload New Image
                </button>
              </div>
            </div>
          </div>

          {/* Visualizer Preview - Right Pane */}
          <div className="lg:col-span-8">
            <div className="card bg-base-200 border border-base-content/10 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center min-h-[500px]">
              {isTransforming ? (
                /* Glowing Transformation Loader */
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-t-primary border-primary/10 animate-spin"></div>
                  <div className="space-y-1">
                    <p className="font-bold text-base-content">Applying Dynamic Crop...</p>
                    <p className="text-xs text-base-content/50">Cloudinary AI-assisted content framing active</p>
                  </div>
                </div>
              ) : (
                /* Dynamic Preview Card */
                <div className="w-full flex flex-col items-center gap-6">
                  <div className="bg-base-300/40 p-4 rounded-2xl border border-base-content/5 shadow-inner flex items-center justify-center max-w-full overflow-hidden">
                    <div
                      className="relative border border-base-content/10 shadow-2xl rounded-xl overflow-hidden bg-base-100"
                      style={{
                        aspectRatio: socialFormats[selectedFormat].aspectRatio.replace(":", "/"),
                        maxHeight: "450px",
                        maxWidth: "100%",
                      }}
                    >
                      <CldImage
                        width={socialFormats[selectedFormat].width}
                        height={socialFormats[selectedFormat].height}
                        src={uploadedImage}
                        sizes="(max-width: 768px) 100vw, 800px"
                        crop="fill"
                        gravity="auto"
                        alt="Transformed Social Media Asset"
                        className="object-cover rounded-xl transition-all duration-500"
                      />
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">Live Transformation Studio Preview</span>
                    <p className="text-xs text-base-content/70">
                      Asset cropped intelligently using gravity detection. Ready for download.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
