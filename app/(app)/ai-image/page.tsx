"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconSparkles,
  IconPhoto,
  IconEraser,
  IconArrowBigUp,
  IconAspectRatio,
  IconUpload,
  IconDownload,
  IconSettings,
  IconEye,
  IconTrendingUp,
} from "@tabler/icons-react";

type TabType = "bg-remove" | "object-remove" | "upscale" | "resize-compress";

interface UploadedImage {
  publicId: string;
  url: string;
}

export default function AIImageStudio() {
  const [activeTab, setActiveTab] = useState<TabType>("bg-remove");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDownload = (url: string, filename: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const localUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = localUrl;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(localUrl);
      })
      .catch((error) => {
        console.error("Direct download failed, opening in new tab:", error);
        window.open(url, "_blank");
      });
  };

  // Tab 1: Background Removal
  const [bgFile, setBgFile] = useState<UploadedImage | null>(null);
  const [bgResultUrl, setBgResultUrl] = useState<string | null>(null);
  const [isProcessingBg, setIsProcessingBg] = useState(false);

  // Tab 2: Object Removal
  const [objFile, setObjFile] = useState<UploadedImage | null>(null);
  const [objPrompt, setObjPrompt] = useState("");
  const [objResultUrl, setObjResultUrl] = useState<string | null>(null);
  const [isProcessingObj, setIsProcessingObj] = useState(false);

  // Tab 3: AI Upscale
  const [upscaleFile, setUpscaleFile] = useState<UploadedImage | null>(null);
  const [upscaleResultUrl, setUpscaleResultUrl] = useState<string | null>(null);
  const [isProcessingUpscale, setIsProcessingUpscale] = useState(false);

  // Tab 4: Smart Compression & Smart Crop
  const [rcFile, setRcFile] = useState<UploadedImage | null>(null);
  const [rcMode, setRcMode] = useState<"compress" | "smart-crop">("compress");
  const [rcQuality, setRcQuality] = useState<string>("auto");
  const [rcFormat, setRcFormat] = useState("webp");
  const [rcProgressive, setRcProgressive] = useState(false);
  const [rcChroma, setRcChroma] = useState("4:2:0");
  const [rcWidth, setRcWidth] = useState(800);
  const [rcHeight, setRcHeight] = useState(600);
  const [rcGravity, setRcGravity] = useState("auto");
  const [rcResultUrl, setRcResultUrl] = useState<string | null>(null);
  const [rcStats, setRcStats] = useState<{
    originalBytes?: number;
    compressedBytes?: number;
    savedBytes?: number;
  } | null>(null);
  const [isProcessingRc, setIsProcessingRc] = useState(false);

  // Helper to upload image to /api/image-upload
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (img: UploadedImage) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image asset");
      }

      const data = await response.json();
      if (data.publicId) {
        // Build raw url
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxojgqsrh";
        const url = `https://res.cloudinary.com/${cloudName}/image/upload/${data.publicId}`;
        callback({ publicId: data.publicId, url });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      setErrorMsg(err.message || "Failed to upload image. Max limit 10MB.");
    } finally {
      setIsUploading(false);
    }
  };

  // Run Background Removal
  const runBgRemove = async () => {
    if (!bgFile) return;
    setIsProcessingBg(true);
    setBgResultUrl(null);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/bg-remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: bgFile.publicId }),
      });

      const data = await response.json();
      if (data.success) {
        // Since background removal runs asynchronously in the backend, the predicted URL is returned immediately.
        // We will simulate a small processing state and set the URL.
        setTimeout(() => {
          setBgResultUrl(data.resultUrl);
          setIsProcessingBg(false);
        }, 1500);
      } else {
        throw new Error(data.error || "Background removal failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to remove background.");
      setIsProcessingBg(false);
    }
  };

  // Run Object Removal
  const runObjectRemove = async () => {
    if (!objFile || !objPrompt) return;
    setIsProcessingObj(true);
    setObjResultUrl(null);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/object-remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: objFile.publicId, prompt: objPrompt }),
      });

      const data = await response.json();
      if (data.success) {
        setTimeout(() => {
          setObjResultUrl(data.resultUrl);
          setIsProcessingObj(false);
        }, 1500);
      } else {
        throw new Error(data.error || "Object removal failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to remove object.");
      setIsProcessingObj(false);
    }
  };

  // Run AI Upscaler
  const runUpscale = async () => {
    if (!upscaleFile) return;
    setIsProcessingUpscale(true);
    setUpscaleResultUrl(null);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/upscale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: upscaleFile.publicId }),
      });

      const data = await response.json();
      if (data.success) {
        setTimeout(() => {
          setUpscaleResultUrl(data.resultUrl);
          setIsProcessingUpscale(false);
        }, 1500);
      } else {
        throw new Error(data.error || "Upscaling failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upscale image.");
      setIsProcessingUpscale(false);
    }
  };

  // Run Smart Resize & Compression
  const runResizeCompress = async () => {
    if (!rcFile) return;
    setIsProcessingRc(true);
    setRcResultUrl(null);
    setRcStats(null);
    setErrorMsg(null);

    try {
      if (rcMode === "compress") {
        const response = await fetch("/api/manage-image/compress/custom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicId: rcFile.publicId,
            quality: isNaN(parseInt(rcQuality)) ? rcQuality : parseInt(rcQuality),
            format: rcFormat,
            progressive: rcProgressive,
            chromaSubsampling: rcChroma,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setRcResultUrl(data.compressedUrl);
          setRcStats({
            originalBytes: data.originalBytes,
            compressedBytes: data.bytes,
            savedBytes: data.savedBytes,
          });
        } else {
          throw new Error(data.error || "Compression failed");
        }
      } else {
        const response = await fetch("/api/manage-image/resize/smart-crop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicId: rcFile.publicId,
            width: rcWidth,
            height: rcHeight,
            gravity: rcGravity,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setRcResultUrl(data.croppedUrl);
          setRcStats({
            originalBytes: data.stats?.originalBytes,
            compressedBytes: data.stats?.croppedBytes,
            savedBytes: Math.max(0, (data.stats?.originalBytes || 0) - (data.stats?.croppedBytes || 0)),
          });
        } else {
          throw new Error(data.error || "Smart crop failed");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to crop or compress image.");
    } finally {
      setIsProcessingRc(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "bg-remove", label: "Background Removal", icon: <IconPhoto className="w-5 h-5" />, desc: "AI-assisted background removal" },
    { id: "object-remove", label: "Object Eraser", icon: <IconEraser className="w-5 h-5" />, desc: "Generatively remove objects using prompts" },
    { id: "upscale", label: "Super-Resolution", icon: <IconArrowBigUp className="w-5 h-5" />, desc: "Enhance image size & clear visual details" },
    { id: "resize-compress", label: "Resize & Compress", icon: <IconAspectRatio className="w-5 h-5" />, desc: "Smart crop and advanced format compressions" },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-base-content">
          AI Image Studio
        </h1>
        <p className="text-base-content/70 text-sm md:text-base max-w-xl">
          Apply smart filters, wipe objects out of visual scenes, upscale resolutions, and optimize dimensions with Cloudinary AI.
        </p>
      </div>

      {/* Main Grid: Tabs Left (3 cols), Interface Right (9 cols) */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Navigation Tabs - Left Pane */}
        <div className="lg:col-span-3 flex flex-col gap-2 bg-base-200 p-4 border border-base-content/10 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 px-3 mb-1">
            AI Toolsets
          </span>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrorMsg(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-content font-bold shadow-lg shadow-primary/20"
                    : "text-base-content/75 hover:bg-base-300 hover:text-base-content"
                }`}
              >
                {tab.icon}
                <div className="flex flex-col">
                  <span className="text-sm">{tab.label}</span>
                  <span className="text-[9px] opacity-60 font-normal leading-none mt-0.5">
                    {tab.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Workspace Operations Panel - Right Pane */}
        <div className="lg:col-span-9">
          <div className="card bg-base-200 border border-base-content/10 backdrop-blur-md rounded-2xl p-6 md:p-8 min-h-[500px] flex flex-col justify-between">
            <div className="space-y-6">
              {/* Dynamic Tab Heading */}
              <div className="border-b border-base-content/5 pb-4">
                <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                  {tabs.find((t) => t.id === activeTab)?.icon}
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h2>
                <p className="text-xs text-base-content/55 mt-1">
                  {tabs.find((t) => t.id === activeTab)?.desc}. Neural network filters on-the-fly.
                </p>
              </div>

              {/* Error Banner */}
              {errorMsg && (
                <div className="alert alert-error text-xs rounded-xl py-2 px-4 shadow-sm">
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Loader */}
              {isUploading && (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Registering image in the vault...</p>
                    <p className="text-[10px] text-base-content/50">Processing raw image packets</p>
                  </div>
                </div>
              )}

              {/* Tab Contents */}
              {!isUploading && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* TAB 1: BACKGROUND REMOVAL */}
                    {activeTab === "bg-remove" && (
                      <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-base-content/60">Upload Image</span>
                          {!bgFile ? (
                            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40">
                              <IconUpload className="w-8 h-8 opacity-40 mb-2 text-primary" />
                              <span className="text-xs font-bold">Choose an image file</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, setBgFile)}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-base-content/10">
                                  <img src={bgFile.url} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold truncate max-w-sm">Image Registered</p>
                                  <p className="text-[10px] text-base-content/40">Public ID: {bgFile.publicId}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setBgFile(null);
                                  setBgResultUrl(null);
                                }}
                                className="btn btn-ghost btn-xs text-error"
                              >
                                Replace Image
                              </button>
                            </div>
                          )}
                        </div>

                        {bgFile && (
                          <button
                            onClick={runBgRemove}
                            disabled={isProcessingBg}
                            className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3"
                          >
                            {isProcessingBg ? (
                              <span className="flex items-center gap-2">
                                <span className="loading loading-spinner loading-xs"></span>
                                Stripping background layers...
                              </span>
                            ) : (
                              "Remove Image Background"
                            )}
                          </button>
                        )}

                        {bgResultUrl && (
                          <div className="space-y-6 pt-4 border-t border-base-content/5">
                            <div className="grid gap-6 md:grid-cols-2">
                              {/* Before */}
                              <div className="space-y-2">
                                <span className="text-xs font-semibold text-base-content/50 block text-center">Original</span>
                                <div className="border border-base-content/10 rounded-xl overflow-hidden bg-base-100 aspect-video flex items-center justify-center">
                                  <img src={bgFile?.url} alt="Original" className="max-h-56 object-contain" />
                                </div>
                              </div>
                              {/* After */}
                              <div className="space-y-2">
                                <span className="text-xs font-semibold text-primary block text-center">Background Removed</span>
                                <div className="border border-base-content/10 rounded-xl overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] bg-[size:16px_16px] aspect-video flex items-center justify-center">
                                  <img src={bgResultUrl} alt="Background Removed" className="max-h-56 object-contain" />
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDownload(bgResultUrl!, "bg_removed.png")}
                              className="btn btn-success w-full text-white flex items-center justify-center gap-1.5 rounded-xl shadow-sm cursor-pointer"
                            >
                              <IconDownload className="w-4 h-4" />
                              Download PNG (Transparent)
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 2: OBJECT REMOVAL */}
                    {activeTab === "object-remove" && (
                      <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-base-content/60">Upload Source Image</span>
                          {!objFile ? (
                            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40">
                              <IconUpload className="w-8 h-8 opacity-40 mb-2 text-primary" />
                              <span className="text-xs font-bold">Choose an image file</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, setObjFile)}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-base-content/10">
                                  <img src={objFile.url} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold truncate max-w-sm">Image Registered</p>
                                  <p className="text-[10px] text-base-content/40">Public ID: {objFile.publicId}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setObjFile(null);
                                  setObjResultUrl(null);
                                }}
                                className="btn btn-ghost btn-xs text-error"
                              >
                                Replace Image
                              </button>
                            </div>
                          )}
                        </div>

                        {objFile && (
                          <div className="card bg-base-100 border border-base-content/10 p-5 rounded-2xl space-y-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-semibold text-base-content/60">Object to remove (AI prompt)</label>
                              <input
                                type="text"
                                placeholder="Describe the object e.g. 'car', 'person', 'powerline'"
                                value={objPrompt}
                                onChange={(e) => setObjPrompt(e.target.value)}
                                className="input input-bordered input-sm rounded-xl focus:border-primary focus:outline-none"
                              />
                            </div>

                            <button
                              onClick={runObjectRemove}
                              disabled={isProcessingObj || !objPrompt.trim()}
                              className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3"
                            >
                              {isProcessingObj ? (
                                <span className="flex items-center gap-2">
                                  <span className="loading loading-spinner loading-xs"></span>
                                  Applying Generative Fill removal...
                                </span>
                              ) : (
                                "Erase Object"
                              )}
                            </button>
                          </div>
                        )}

                        {objResultUrl && (
                          <div className="space-y-6 pt-4 border-t border-base-content/5">
                            <div className="grid gap-6 md:grid-cols-2">
                              {/* Before */}
                              <div className="space-y-2">
                                <span className="text-xs font-semibold text-base-content/50 block text-center">Original</span>
                                <div className="border border-base-content/10 rounded-xl overflow-hidden bg-base-100 aspect-video flex items-center justify-center">
                                  <img src={objFile?.url} alt="Original" className="max-h-56 object-contain" />
                                </div>
                              </div>
                              {/* After */}
                              <div className="space-y-2">
                                <span className="text-xs font-semibold text-primary block text-center">Object Erased ({objPrompt})</span>
                                <div className="border border-base-content/10 rounded-xl overflow-hidden bg-base-100 aspect-video flex items-center justify-center">
                                  <img src={objResultUrl} alt="Object Removed" className="max-h-56 object-contain" />
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDownload(objResultUrl!, "erased.jpg")}
                              className="btn btn-success w-full text-white flex items-center justify-center gap-1.5 rounded-xl shadow-sm cursor-pointer"
                            >
                              <IconDownload className="w-4 h-4" />
                              Download Erased Image
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 3: AI RESOLUTION UPSCALER */}
                    {activeTab === "upscale" && (
                      <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-base-content/60">Upload Low-Res Image</span>
                          {!upscaleFile ? (
                            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40">
                              <IconUpload className="w-8 h-8 opacity-40 mb-2 text-primary" />
                              <span className="text-xs font-bold">Choose an image file</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, setUpscaleFile)}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-base-content/10">
                                  <img src={upscaleFile.url} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold truncate max-w-sm">Image Registered</p>
                                  <p className="text-[10px] text-base-content/40">Public ID: {upscaleFile.publicId}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setUpscaleFile(null);
                                  setUpscaleResultUrl(null);
                                }}
                                className="btn btn-ghost btn-xs text-error"
                              >
                                Replace Image
                              </button>
                            </div>
                          )}
                        </div>

                        {upscaleFile && (
                          <button
                            onClick={runUpscale}
                            disabled={isProcessingUpscale}
                            className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3"
                          >
                            {isProcessingUpscale ? (
                              <span className="flex items-center gap-2">
                                <span className="loading loading-spinner loading-xs"></span>
                                Enhancing resolution details...
                              </span>
                            ) : (
                              "Upscale Image (Super-Resolution)"
                            )}
                          </button>
                        )}

                        {upscaleResultUrl && (
                          <div className="space-y-6 pt-4 border-t border-base-content/5">
                            <div className="p-4 rounded-xl bg-success/15 border border-success/30 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2.5">
                                <IconTrendingUp className="w-5 h-5 text-success" />
                                <div className="space-y-0.5">
                                  <p className="text-xs font-bold text-success-content">Super Resolution Applied!</p>
                                  <p className="text-[10px] text-success-content/70">
                                    Pixels generated successfully. Output is crystal clear.
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDownload(upscaleResultUrl!, "upscaled.jpg")}
                                className="btn btn-success btn-sm text-white flex items-center gap-1.5 rounded-lg shadow-sm cursor-pointer"
                              >
                                <IconDownload className="w-4 h-4" />
                                Download Upscaled Image
                              </button>
                            </div>

                            <div className="border border-base-content/10 rounded-xl overflow-hidden bg-base-100 flex justify-center p-4">
                              <img src={upscaleResultUrl} alt="Upscaled" className="max-h-96 object-contain rounded-lg" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 4: SMART COMPRESSION & RESIZING */}
                    {activeTab === "resize-compress" && (
                      <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-base-content/60">Upload Image to Process</span>
                          {!rcFile ? (
                            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40">
                              <IconUpload className="w-8 h-8 opacity-40 mb-2 text-primary" />
                              <span className="text-xs font-bold">Choose an image file</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, setRcFile)}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-base-content/10">
                                  <img src={rcFile.url} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold truncate max-w-sm">Image Registered</p>
                                  <p className="text-[10px] text-base-content/40">Public ID: {rcFile.publicId}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setRcFile(null);
                                  setRcResultUrl(null);
                                  setRcStats(null);
                                }}
                                className="btn btn-ghost btn-xs text-error"
                              >
                                Replace Image
                              </button>
                            </div>
                          )}
                        </div>

                        {rcFile && (
                          <div className="card bg-base-100 border border-base-content/10 p-5 rounded-2xl space-y-6">
                            {/* Mode select */}
                            <div className="flex flex-col gap-2">
                              <span className="text-xs font-semibold text-base-content/60">Select Mode</span>
                              <div className="join w-full">
                                <button
                                  type="button"
                                  onClick={() => setRcMode("compress")}
                                  className={`join-item flex-1 btn btn-sm border-base-content/10 cursor-pointer ${
                                    rcMode === "compress" ? "btn-primary text-primary-content" : "bg-transparent text-base-content/50 hover:text-base-content"
                                  }`}
                                >
                                  Advanced Quality Compression
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRcMode("smart-crop")}
                                  className={`join-item flex-1 btn btn-sm border-base-content/10 cursor-pointer ${
                                    rcMode === "smart-crop" ? "btn-primary text-primary-content" : "bg-transparent text-base-content/50 hover:text-base-content"
                                  }`}
                                >
                                  Smart Subject Crop
                                </button>
                              </div>
                            </div>

                            {/* Dynamic settings */}
                            {rcMode === "compress" ? (
                              <div className="grid gap-4 sm:grid-cols-2">
                                {/* Quality */}
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-semibold text-base-content/60">Quality Preset / Value</label>
                                  <select
                                    value={rcQuality}
                                    onChange={(e) => setRcQuality(e.target.value)}
                                    className="select select-bordered select-sm rounded-xl focus:border-primary focus:outline-none"
                                  >
                                    <option value="auto">Auto (Recommended)</option>
                                    <option value="auto:best">Best Quality</option>
                                    <option value="auto:good">Good Compression</option>
                                    <option value="auto:eco">Eco Saver</option>
                                    <option value="auto:low">Low Quality</option>
                                    <option value="80">80% Quality</option>
                                    <option value="60">60% Quality</option>
                                    <option value="40">40% Quality</option>
                                  </select>
                                </div>

                                {/* Format */}
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-semibold text-base-content/60">Output Format</label>
                                  <select
                                    value={rcFormat}
                                    onChange={(e) => setRcFormat(e.target.value)}
                                    className="select select-bordered select-sm rounded-xl focus:border-primary focus:outline-none"
                                  >
                                    <option value="webp">WEBP (Highly Efficient)</option>
                                    <option value="avif">AVIF (Ultra Efficient)</option>
                                    <option value="png">PNG (Lossless)</option>
                                    <option value="jpg">JPG (Standard)</option>
                                  </select>
                                </div>

                                {/* Chroma */}
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-semibold text-base-content/60">Chroma Subsampling</label>
                                  <select
                                    value={rcChroma}
                                    onChange={(e) => setRcChroma(e.target.value)}
                                    className="select select-bordered select-sm rounded-xl focus:border-primary focus:outline-none"
                                  >
                                    <option value="4:2:0">4:2:0 (Standard)</option>
                                    <option value="4:2:2">4:2:2 (Higher Quality)</option>
                                    <option value="4:4:4">4:4:4 (No chroma compression)</option>
                                  </select>
                                </div>

                                {/* Progressive flag */}
                                <div className="flex items-center gap-2 pt-6">
                                  <input
                                    type="checkbox"
                                    checked={rcProgressive}
                                    onChange={(e) => setRcProgressive(e.target.checked)}
                                    className="checkbox checkbox-primary checkbox-sm rounded-md"
                                    id="progressive-chk"
                                  />
                                  <label htmlFor="progressive-chk" className="text-xs font-semibold text-base-content/60 cursor-pointer">
                                    Progressive Image Loading
                                  </label>
                                </div>
                              </div>
                            ) : (
                              <div className="grid gap-4 sm:grid-cols-3">
                                {/* Width */}
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-semibold text-base-content/60">Width (px)</label>
                                  <input
                                    type="number"
                                    value={rcWidth}
                                    onChange={(e) => setRcWidth(parseInt(e.target.value) || 800)}
                                    className="input input-bordered input-sm rounded-xl focus:border-primary focus:outline-none"
                                  />
                                </div>

                                {/* Height */}
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-semibold text-base-content/60">Height (px)</label>
                                  <input
                                    type="number"
                                    value={rcHeight}
                                    onChange={(e) => setRcHeight(parseInt(e.target.value) || 600)}
                                    className="input input-bordered input-sm rounded-xl focus:border-primary focus:outline-none"
                                  />
                                </div>

                                {/* Gravity subject */}
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-semibold text-base-content/60">Focal Point (Gravity)</label>
                                  <select
                                    value={rcGravity}
                                    onChange={(e) => setRcGravity(e.target.value)}
                                    className="select select-bordered select-sm rounded-xl focus:border-primary focus:outline-none"
                                  >
                                    <option value="auto">Auto AI</option>
                                    <option value="subject">Subject focus</option>
                                    <option value="face">Face focus</option>
                                    <option value="body">Body focus</option>
                                  </select>
                                </div>
                              </div>
                            )}

                            <button
                              onClick={runResizeCompress}
                              disabled={isProcessingRc}
                              className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3 mt-4"
                            >
                              {isProcessingRc ? (
                                <span className="flex items-center gap-2 justify-center">
                                  <span className="loading loading-spinner loading-xs"></span>
                                  Processing image modifications...
                                </span>
                              ) : (
                                "Apply Settings"
                              )}
                            </button>
                          </div>
                        )}

                        {rcResultUrl && (
                          <div className="space-y-6 pt-4 border-t border-base-content/5">
                            {rcStats && (
                              <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-inner text-center">
                                  <span className="text-[9px] uppercase tracking-wider font-bold block text-base-content/40">Original</span>
                                  <span className="text-sm font-bold text-base-content">
                                    {rcStats.originalBytes ? `${(rcStats.originalBytes / 1024).toFixed(1)} KB` : "-"}
                                  </span>
                                </div>
                                <div className="p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-inner text-center">
                                  <span className="text-[9px] uppercase tracking-wider font-bold block text-base-content/40">Modified</span>
                                  <span className="text-sm font-bold text-success">
                                    {rcStats.compressedBytes ? `${(rcStats.compressedBytes / 1024).toFixed(1)} KB` : "-"}
                                  </span>
                                </div>
                                <div className="p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-inner text-center">
                                  <span className="text-[9px] uppercase tracking-wider font-bold block text-base-content/40">Savings</span>
                                  <span className="text-sm font-bold text-accent">
                                    {rcStats.originalBytes && rcStats.compressedBytes
                                      ? `${(((rcStats.originalBytes - rcStats.compressedBytes) / rcStats.originalBytes) * 100).toFixed(1)}%`
                                      : "0.0%"}
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="p-4 rounded-xl bg-success/15 border border-success/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <p className="text-xs font-bold text-success-content">Image Compiled Successfully!</p>
                                <p className="text-[10px] text-success-content/70">
                                  Your compressed/cropped image is ready.
                                </p>
                              </div>
                              <button
                                onClick={() => handleDownload(rcResultUrl!, `processed.${rcFormat}`)}
                                className="btn btn-success btn-sm text-white flex items-center gap-1.5 rounded-lg shadow-sm cursor-pointer"
                              >
                                <IconDownload className="w-4 h-4" />
                                Download Image
                              </button>
                            </div>

                            <div className="border border-base-content/10 rounded-xl overflow-hidden bg-base-100 flex justify-center p-4">
                              <img src={rcResultUrl} alt="Result" className="max-h-96 object-contain rounded-lg shadow-sm" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
