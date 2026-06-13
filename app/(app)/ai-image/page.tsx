"use client";

import React, { useState, useEffect } from "react";
import {
  IconSparkles,
  IconPhoto,
  IconEraser,
  IconArrowBigUp,
  IconAspectRatio,
  IconUpload,
  IconDownload,
  IconSettings,
} from "@tabler/icons-react";
import { toast } from "@/app/store/Toast";
import { cn } from "@/app/lib/utils";

// Components
import BgRemove from "./components/BgRemove";
import ObjectRemove from "./components/ObjectRemove";
import Upscale from "./components/Upscale";
import ResizeCompress from "./components/ResizeCompress";
import ImageCanvas from "./components/ImageCanvas";

type TabType = "bg-remove" | "object-remove" | "upscale" | "resize-compress";

interface UploadedImage {
  publicId: string;
  url: string;
}

export default function AIImageStudio() {
  const [activeTab, setActiveTab] = useState<TabType>("bg-remove");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Shared Source File State
  const [sharedFile, setSharedFile] = useState<UploadedImage | null>(null);

  // Split View & Slider States
  const [showSplitView, setShowSplitView] = useState<boolean>(true);
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // Tab 1: Background Removal
  const [bgResultUrl, setBgResultUrl] = useState<string | null>(null);
  const [isProcessingBg, setIsProcessingBg] = useState(false);

  // Tab 2: Object Removal
  const [objPrompt, setObjPrompt] = useState("");
  const [objResultUrl, setObjResultUrl] = useState<string | null>(null);
  const [isProcessingObj, setIsProcessingObj] = useState(false);

  // Tab 3: AI Upscale
  const [upscaleResultUrl, setUpscaleResultUrl] = useState<string | null>(null);
  const [isProcessingUpscale, setIsProcessingUpscale] = useState(false);

  // Tab 4: Smart Compression & Smart Crop
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

  // Reset results when the source image changes
  useEffect(() => {
    setBgResultUrl(null);
    setObjResultUrl(null);
    setUpscaleResultUrl(null);
    setRcResultUrl(null);
    setRcStats(null);
    setErrorMsg(null);
  }, [sharedFile]);

  const handleDownload = (url: string, filename: string) => {
    toast("Downloading processed file...", "info");
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
        toast("Download completed!", "success");
      })
      .catch((error) => {
        console.error("Direct download failed, opening in new tab:", error);
        window.open(url, "_blank");
      });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxojgqsrh";
        const url = `https://res.cloudinary.com/${cloudName}/image/upload/${data.publicId}`;
        setSharedFile({ publicId: data.publicId, url });
        toast("Image registered to AI Studio workspace!", "success");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      setErrorMsg(err.message || "Failed to upload image. Max limit 10MB.");
      toast("Upload failed.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const runBgRemove = async () => {
    if (!sharedFile) return;
    setIsProcessingBg(true);
    setBgResultUrl(null);
    setErrorMsg(null);
    toast("Initiating neural background removal...", "info");

    try {
      const response = await fetch("/api/bg-remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: sharedFile.publicId }),
      });

      const data = await response.json();
      if (data.success) {
        setTimeout(() => {
          setBgResultUrl(data.resultUrl);
          setIsProcessingBg(false);
          toast("Background removal completed!", "success");
        }, 2000);
      } else {
        throw new Error(data.error || "Background removal failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to remove background.");
      setIsProcessingBg(false);
      toast("Background removal failed.", "error");
    }
  };

  const runObjectRemove = async () => {
    if (!sharedFile || !objPrompt) return;
    setIsProcessingObj(true);
    setObjResultUrl(null);
    setErrorMsg(null);
    toast("Applying Generative Inpainting...", "info");

    try {
      const response = await fetch("/api/object-remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: sharedFile.publicId, prompt: objPrompt }),
      });

      const data = await response.json();
      if (data.success) {
        setTimeout(() => {
          setObjResultUrl(data.resultUrl);
          setIsProcessingObj(false);
          toast("Object erased successfully!", "success");
        }, 2000);
      } else {
        throw new Error(data.error || "Object removal failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to remove object.");
      setIsProcessingObj(false);
      toast("Inpainting failed.", "error");
    }
  };

  const runUpscale = async () => {
    if (!sharedFile) return;
    setIsProcessingUpscale(true);
    setUpscaleResultUrl(null);
    setErrorMsg(null);
    toast("Enhancing details with AI Upscaler...", "info");

    try {
      const response = await fetch("/api/upscale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: sharedFile.publicId }),
      });

      const data = await response.json();
      if (data.success) {
        setTimeout(() => {
          setUpscaleResultUrl(data.resultUrl);
          setIsProcessingUpscale(false);
          toast("Upscaling complete! Image enhanced to 4K.", "success");
        }, 2000);
      } else {
        throw new Error(data.error || "Upscaling failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upscale image.");
      setIsProcessingUpscale(false);
      toast("Upscaling failed.", "error");
    }
  };

  const runResizeCompress = async () => {
    if (!sharedFile) return;
    setIsProcessingRc(true);
    setRcResultUrl(null);
    setRcStats(null);
    setErrorMsg(null);
    toast("Processing size optimization...", "info");

    try {
      if (rcMode === "compress") {
        const response = await fetch("/api/manage-image/compress/custom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicId: sharedFile.publicId,
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
          toast("Compression applied successfully!", "success");
        } else {
          throw new Error(data.error || "Compression failed");
        }
      } else {
        const response = await fetch("/api/manage-image/resize/smart-crop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicId: sharedFile.publicId,
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
          toast("Smart crop applied successfully!", "success");
        } else {
          throw new Error(data.error || "Smart crop failed");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to crop or compress image.");
      toast("Operation failed.", "error");
    } finally {
      setIsProcessingRc(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "bg-remove", label: "Background Removal", icon: <IconPhoto className="w-5 h-5" />, desc: "AI background removal" },
    { id: "object-remove", label: "Object Eraser", icon: <IconEraser className="w-5 h-5" />, desc: "Generatively remove objects" },
    { id: "upscale", label: "Super-Resolution", icon: <IconArrowBigUp className="w-5 h-5" />, desc: "Enhance details & pixels" },
    { id: "resize-compress", label: "Resize & Compress", icon: <IconAspectRatio className="w-5 h-5" />, desc: "Custom compression presets" },
  ];

  const getActiveResultUrl = () => {
    switch (activeTab) {
      case "bg-remove":
        return bgResultUrl;
      case "object-remove":
        return objResultUrl;
      case "upscale":
        return upscaleResultUrl;
      case "resize-compress":
        return rcResultUrl;
    }
  };

  const activeResultUrl = getActiveResultUrl();
  const isProcessing = isProcessingBg || isProcessingObj || isProcessingUpscale || isProcessingRc;

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <div className="grid gap-6 lg:grid-cols-12 items-stretch min-h-[70vh]">
        {/* Left Control Panel (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-base-200 border border-base-content/10 rounded-2xl p-5 space-y-6 shadow-xl h-full">
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-base-content/5">
              <IconSettings className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xs font-bold text-base-content uppercase tracking-wider">
                AI Parameters
              </h2>
            </div>

            {/* AI Action Tabs Selector */}
            <div className="flex flex-col gap-2 bg-base-100/40 p-2 rounded-xl border border-base-content/5">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setErrorMsg(null);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer text-xs font-semibold",
                      isActive
                        ? "bg-primary text-primary-content shadow-md"
                        : "text-base-content/75 hover:bg-base-300 hover:text-base-content"
                    )}
                  >
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Section 1: Upload Source Image */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-base-content/60 uppercase tracking-wider pl-1">
                Source Image
              </span>

              {!sharedFile ? (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40">
                  <IconUpload className="w-6 h-6 opacity-40 mb-1.5 text-primary animate-bounce-slow" />
                  <span className="text-xs font-bold text-base-content">Choose Source File</span>
                  <span className="text-[9px] text-base-content/40 mt-0.5 font-semibold">Max file size: 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-base-100 border border-base-content/5 shadow-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-base-content/10 shrink-0 bg-slate-900 flex items-center justify-center">
                      <img src={sharedFile.url} alt="Source Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-base-content truncate">Active Canvas</p>
                      <p className="text-[9px] text-base-content/40 truncate mt-0.5 font-mono">{sharedFile.publicId}</p>
                    </div>
                  </div>
                  <label className="btn btn-ghost btn-xs text-error font-bold cursor-pointer">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Section 2: Tab Inputs */}
            {sharedFile && (
              <div className="pt-4 border-t border-base-content/5 space-y-4 animate-fade-in">
                {activeTab === "bg-remove" && (
                  <BgRemove
                    isProcessingBg={isProcessingBg}
                    isProcessing={isProcessing}
                    onRunBgRemove={runBgRemove}
                  />
                )}

                {activeTab === "object-remove" && (
                  <ObjectRemove
                    objPrompt={objPrompt}
                    setObjPrompt={setObjPrompt}
                    isProcessingObj={isProcessingObj}
                    isProcessing={isProcessing}
                    onRunObjectRemove={runObjectRemove}
                  />
                )}

                {activeTab === "upscale" && (
                  <Upscale
                    isProcessingUpscale={isProcessingUpscale}
                    isProcessing={isProcessing}
                    onRunUpscale={runUpscale}
                  />
                )}

                {activeTab === "resize-compress" && (
                  <ResizeCompress
                    rcMode={rcMode}
                    setRcMode={setRcMode}
                    rcQuality={rcQuality}
                    setRcQuality={setRcQuality}
                    rcFormat={rcFormat}
                    setRcFormat={setRcFormat}
                    rcWidth={rcWidth}
                    setRcWidth={setRcWidth}
                    rcHeight={rcHeight}
                    setRcHeight={setRcHeight}
                    isProcessingRc={isProcessingRc}
                    isProcessing={isProcessing}
                    onRunResizeCompress={runResizeCompress}
                  />
                )}
              </div>
            )}

            {/* Error notifications */}
            {errorMsg && (
              <div className="alert alert-error text-xs rounded-xl py-2 px-3 shadow-sm text-error-content bg-error/15 border border-error/20">
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Download Action */}
          {activeResultUrl && (
            <div className="pt-4 border-t border-base-content/5 shrink-0 animate-fade-in">
              <button
                onClick={() => handleDownload(activeResultUrl, `ai_${activeTab}_result.png`)}
                className="btn btn-success w-full text-white flex items-center justify-center gap-1.5 rounded-xl shadow-md cursor-pointer font-bold"
              >
                <IconDownload className="w-4 h-4" />
                Download Processed Canvas
              </button>
            </div>
          )}
        </div>

        {/* Right Preview Canvas */}
        <div className="lg:col-span-8">
          <ImageCanvas
            sharedFile={sharedFile}
            activeResultUrl={activeResultUrl}
            activeTab={activeTab}
            isUploading={isUploading}
            isProcessing={isProcessing}
            rcStats={rcStats}
            showSplitView={showSplitView}
            setShowSplitView={setShowSplitView}
            sliderPosition={sliderPosition}
            setSliderPosition={setSliderPosition}
          />
        </div>
      </div>
    </div>
  );
}
