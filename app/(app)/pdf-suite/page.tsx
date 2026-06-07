"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconFileText,
  IconGitMerge,
  IconRotate,
  IconAward,
  IconDatabase,
  IconLayoutGrid,
  IconExchange,
  IconUpload,
  IconDownload,
  IconPlus,
  IconTrash,
  IconRefresh,
  IconEye,
  IconSettings,
} from "@tabler/icons-react";

type TabType = "merge" | "rotate" | "watermark" | "optimize" | "pages" | "converter";

interface UploadedFile {
  name: string;
  publicId: string;
  url: string;
  pages: number;
  bytes: number;
}

export default function PDFSuite() {
  const [activeTab, setActiveTab] = useState<TabType>("merge");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tab 1: Merge
  const [mergeFiles, setMergeFiles] = useState<UploadedFile[]>([]);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [isProcessingMerge, setIsProcessingMerge] = useState(false);

  // Tab 2: Rotate
  const [rotateFile, setRotateFile] = useState<UploadedFile | null>(null);
  const [rotateAngle, setRotateAngle] = useState<90 | 180 | 270>(90);
  const [rotatedUrl, setRotatedUrl] = useState<string | null>(null);
  const [isProcessingRotate, setIsProcessingRotate] = useState(false);

  // Tab 3: Watermark
  const [watermarkFile, setWatermarkFile] = useState<UploadedFile | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkOpacity, setWatermarkOpacity] = useState(30);
  const [watermarkGravity, setWatermarkGravity] = useState<string>("center");
  const [watermarkFontSize, setWatermarkFontSize] = useState(60);
  const [watermarkColor, setWatermarkColor] = useState("red");
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);
  const [isProcessingWatermark, setIsProcessingWatermark] = useState(false);

  // Tab 4: Optimize
  const [optimizeFile, setOptimizeFile] = useState<UploadedFile | null>(null);
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null);
  const [optimizeStats, setOptimizeStats] = useState<{
    originalBytes: number;
    optimizedBytes: number;
    savedBytes: number;
    savedPercent: string;
  } | null>(null);
  const [isProcessingOptimize, setIsProcessingOptimize] = useState(false);

  // Tab 5: Page Manager (Extract/Remove)
  const [managerFile, setManagerFile] = useState<UploadedFile | null>(null);
  const [pagesInput, setPagesInput] = useState("");
  const [isProcessingPages, setIsProcessingPages] = useState(false);
  const [extractedPages, setExtractedPages] = useState<{ page: number; imageUrl: string }[]>([]);
  const [removedPagesUrl, setRemovedPagesUrl] = useState<string | null>(null);

  // Tab 6: Format Converter (PDF-to-Image / Image-to-PDF)
  const [convertFile, setConvertFile] = useState<UploadedFile | null>(null);
  const [convertPage, setConvertPage] = useState(1);
  const [convertFormat, setConvertFormat] = useState<"jpg" | "png" | "webp">("jpg");
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(null);
  const [isProcessingConvert, setIsProcessingConvert] = useState(false);

  // Images to PDF
  const [imageFiles, setImageFiles] = useState<{ name: string; publicId: string }[]>([]);
  const [imageTag, setImageTag] = useState("");
  const [createdPdfUrl, setCreatedPdfUrl] = useState<string | null>(null);
  const [isCreatingPdfFromImages, setIsCreatingPdfFromImages] = useState(false);

  // Generic File Upload Helper (converts file to base64, uploads to backend)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (file: UploadedFile) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Url = reader.result as string;

      try {
        const response = await fetch("/api/manage-pdf/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUrl: base64Url }),
        });

        if (!response.ok) {
          throw new Error("Failed to upload PDF to server");
        }

        const data = await response.json();
        if (data.success) {
          callback({
            name: file.name,
            publicId: data.publicId,
            url: data.url,
            pages: data.pages || 1,
            bytes: data.bytes || file.size,
          });
        } else {
          throw new Error(data.error || "Unknown upload error");
        }
      } catch (err: any) {
        console.error("PDF upload error:", err);
        setErrorMsg(err.message || "Failed to upload file. Make sure it is a valid PDF.");
      } finally {
        setIsUploading(false);
      }
    };
  };

  // Helper to upload images for Image to PDF conversion
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
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      if (data.publicId) {
        setImageFiles((prev) => [...prev, { name: file.name, publicId: data.publicId }]);
        // Create an automatic tag if not set
        if (!imageTag) {
          setImageTag(`img2pdf_${Date.now()}`);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      setErrorMsg(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Run PDF Merge
  const runMerge = async () => {
    if (mergeFiles.length < 2) return;
    setIsProcessingMerge(true);
    setMergedUrl(null);
    setErrorMsg(null);

    try {
      const ids = mergeFiles.map((f) => f.publicId);
      const tag = `merge_${Date.now()}`;
      const response = await fetch("/api/manage-pdf/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicIds: ids, mergeTag: tag }),
      });

      const data = await response.json();
      if (data.success) {
        setMergedUrl(data.mergedPdfUrl);
      } else {
        throw new Error(data.error || "Merge failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to merge PDF files.");
    } finally {
      setIsProcessingMerge(false);
    }
  };

  // Run PDF Rotate
  const runRotate = async () => {
    if (!rotateFile) return;
    setIsProcessingRotate(true);
    setRotatedUrl(null);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/manage-pdf/rotate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: rotateFile.publicId, angle: rotateAngle }),
      });

      const data = await response.json();
      if (data.success) {
        setRotatedUrl(data.rotatedUrl);
      } else {
        throw new Error(data.error || "Rotate failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to rotate PDF.");
    } finally {
      setIsProcessingRotate(false);
    }
  };

  // Run PDF Watermark
  const runWatermark = async () => {
    if (!watermarkFile) return;
    setIsProcessingWatermark(true);
    setWatermarkedUrl(null);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/manage-pdf/watermark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: watermarkFile.publicId,
          text: watermarkText,
          opacity: watermarkOpacity,
          gravity: watermarkGravity,
          fontSize: watermarkFontSize,
          color: watermarkColor,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setWatermarkedUrl(data.watermarkedUrl);
      } else {
        throw new Error(data.error || "Watermark failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to apply watermark.");
    } finally {
      setIsProcessingWatermark(false);
    }
  };

  // Run PDF Optimize
  const runOptimize = async () => {
    if (!optimizeFile) return;
    setIsProcessingOptimize(true);
    setOptimizedUrl(null);
    setOptimizeStats(null);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/manage-pdf/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: optimizeFile.publicId }),
      });

      const data = await response.json();
      if (data.success) {
        setOptimizedUrl(data.optimizedUrl);
        setOptimizeStats(data.stats);
      } else {
        throw new Error(data.error || "Optimization failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to optimize PDF.");
    } finally {
      setIsProcessingOptimize(false);
    }
  };

  // Run Page Manager (Extract/Remove)
  const runPageManager = async (action: "extract" | "remove") => {
    if (!managerFile) return;
    setIsProcessingPages(true);
    setExtractedPages([]);
    setRemovedPagesUrl(null);
    setErrorMsg(null);

    const pagesArray = pagesInput
      .split(",")
      .map((p) => parseInt(p.trim()))
      .filter((p) => !isNaN(p) && p > 0);

    if (pagesArray.length === 0) {
      setErrorMsg("Please enter valid page numbers (e.g. 1,3,5)");
      setIsProcessingPages(false);
      return;
    }

    try {
      if (action === "extract") {
        const response = await fetch("/api/manage-pdf/extract-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: managerFile.publicId, pages: pagesArray }),
        });

        const data = await response.json();
        if (data.success) {
          setExtractedPages(data.extractedPages);
        } else {
          throw new Error(data.error || "Extraction failed");
        }
      } else {
        const response = await fetch("/api/manage-pdf/remove-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicId: managerFile.publicId,
            totalPages: managerFile.pages,
            removePages: pagesArray,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setRemovedPagesUrl(data.pdfUrl);
        } else {
          throw new Error(data.error || "Removal failed");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to perform page operation.`);
    } finally {
      setIsProcessingPages(false);
    }
  };

  // Convert PDF page to Image
  const runConvertToImage = async () => {
    if (!convertFile) return;
    setIsProcessingConvert(true);
    setConvertedImageUrl(null);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/manage-pdf/to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: convertFile.publicId,
          page: convertPage,
          format: convertFormat,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConvertedImageUrl(data.imageUrl);
      } else {
        throw new Error(data.error || "Conversion failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to convert page to image.");
    } finally {
      setIsProcessingConvert(false);
    }
  };

  // Convert Images to PDF
  const runImagesToPdf = async () => {
    if (imageFiles.length === 0 || !imageTag) return;
    setIsCreatingPdfFromImages(true);
    setCreatedPdfUrl(null);
    setErrorMsg(null);

    try {
      const ids = imageFiles.map((img) => img.publicId);
      const response = await fetch("/api/manage-pdf/from-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: imageTag, publicIds: ids }),
      });

      const data = await response.json();
      if (data.success) {
        setCreatedPdfUrl(data.pdfUrl);
      } else {
        throw new Error(data.error || "Failed to compile PDF");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create PDF from images.");
    } finally {
      setIsCreatingPdfFromImages(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "merge", label: "Merge PDFs", icon: <IconGitMerge className="w-5 h-5" />, desc: "Combine multiple PDF files into one" },
    { id: "rotate", label: "Rotate PDF", icon: <IconRotate className="w-5 h-5" />, desc: "Rotate all pages in a PDF document" },
    { id: "watermark", label: "Watermark", icon: <IconAward className="w-5 h-5" />, desc: "Stamp a custom watermark overlay on PDF pages" },
    { id: "optimize", label: "Optimize", icon: <IconDatabase className="w-5 h-5" />, desc: "Compress PDF sizes using auto-quality codecs" },
    { id: "pages", label: "Page Manager", icon: <IconLayoutGrid className="w-5 h-5" />, desc: "Extract or remove specific pages from a PDF" },
    { id: "converter", label: "Converter", icon: <IconExchange className="w-5 h-5" />, desc: "Convert PDF pages to images or merge images to PDF" },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-base-content">
          Document PDF Suite
        </h1>
        <p className="text-base-content/70 text-sm md:text-base max-w-xl">
          Upload, merge, rotate, watermark, compress, and restructure your PDF documents in real-time.
        </p>
      </div>

      {/* Main Grid: Tabs Left (3 cols), Interface Right (9 cols) */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Navigation Tabs - Left Pane */}
        <div className="lg:col-span-3 flex flex-col gap-2 bg-base-200 p-4 border border-base-content/10 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 px-3 mb-1">
            PDF Operations
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
                  {tabs.find((t) => t.id === activeTab)?.desc}. Cloudinary serverless execution.
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
                    <p className="font-semibold text-sm">Uploading and registering PDF with Vault...</p>
                    <p className="text-[10px] text-base-content/50">Processing raw document stream</p>
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
                    {/* TAB 1: MERGE */}
                    {activeTab === "merge" && (
                      <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-base-content/60">Upload PDFs to Merge</span>
                          <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40">
                            <IconUpload className="w-8 h-8 opacity-40 mb-2 text-primary" />
                            <span className="text-xs font-bold">Choose a PDF file to add</span>
                            <span className="text-[10px] text-base-content/40 mt-1">Upload multiple documents</span>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) =>
                                handleFileUpload(e, (newFile) => {
                                  setMergeFiles((prev) => [...prev, newFile]);
                                })
                              }
                              className="hidden"
                            />
                          </label>
                        </div>

                        {mergeFiles.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-base-content/50">
                                Merge Order list ({mergeFiles.length} files)
                              </span>
                              <button
                                onClick={() => setMergeFiles([])}
                                className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                              >
                                Clear All
                              </button>
                            </div>

                            <div className="space-y-2">
                              {mergeFiles.map((file, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-3 rounded-xl bg-base-100 border border-base-content/5 shadow-sm"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                      {idx + 1}
                                    </span>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold truncate max-w-xs">{file.name}</p>
                                      <p className="text-[10px] text-base-content/40">
                                        Pages: {file.pages} • Size: {(file.bytes / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() =>
                                      setMergeFiles((prev) => prev.filter((_, i) => i !== idx))
                                    }
                                    className="btn btn-ghost btn-circle btn-xs text-base-content/40 hover:text-error hover:bg-error/10"
                                  >
                                    <IconTrash className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={runMerge}
                              disabled={mergeFiles.length < 2 || isProcessingMerge}
                              className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3 cursor-pointer"
                            >
                              {isProcessingMerge ? (
                                <span className="flex items-center gap-2">
                                  <span className="loading loading-spinner loading-xs"></span>
                                  Merging PDF files...
                                </span>
                              ) : (
                                "Combine & Generate Merged PDF"
                              )}
                            </button>
                          </div>
                        )}

                        {mergedUrl && (
                          <div className="p-4 rounded-xl bg-success/15 border border-success/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-bold text-success-content">Merge Completed Successfully!</p>
                              <p className="text-[10px] text-success-content/70">
                                Your newly compiled PDF has been delivered.
                              </p>
                            </div>
                            <a
                              href={mergedUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-success btn-sm text-white flex items-center gap-1.5 self-start md:self-auto rounded-lg shadow-sm"
                            >
                              <IconDownload className="w-4 h-4" />
                              Download PDF
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 2: ROTATE */}
                    {activeTab === "rotate" && (
                      <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-base-content/60">Upload PDF to Rotate</span>
                          {!rotateFile ? (
                            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40">
                              <IconUpload className="w-8 h-8 opacity-40 mb-2 text-primary" />
                              <span className="text-xs font-bold">Choose a PDF file</span>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handleFileUpload(e, setRotateFile)}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-sm">
                              <div className="flex items-center gap-3">
                                <IconFileText className="w-8 h-8 text-primary" />
                                <div>
                                  <p className="text-xs font-bold truncate max-w-sm">{rotateFile.name}</p>
                                  <p className="text-[10px] text-base-content/40">
                                    Pages: {rotateFile.pages} • Size: {(rotateFile.bytes / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setRotateFile(null);
                                  setRotatedUrl(null);
                                }}
                                className="btn btn-ghost btn-xs text-error"
                              >
                                Replace File
                              </button>
                            </div>
                          )}
                        </div>

                        {rotateFile && (
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <span className="text-xs font-semibold text-base-content/60">Select Rotation Angle</span>
                              <div className="grid grid-cols-3 gap-3">
                                {([90, 180, 270] as const).map((angle) => (
                                  <button
                                    key={angle}
                                    type="button"
                                    onClick={() => setRotateAngle(angle)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                                      rotateAngle === angle
                                        ? "bg-primary/10 border-primary text-primary font-bold shadow-inner"
                                        : "bg-base-100/40 border-base-content/10 text-base-content/75 hover:border-base-content/25"
                                    }`}
                                  >
                                    <IconRotate className="w-6 h-6 mb-1" />
                                    <span className="text-sm font-semibold">{angle}° Clockwise</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={runRotate}
                              disabled={isProcessingRotate}
                              className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3"
                            >
                              {isProcessingRotate ? (
                                <span className="flex items-center gap-2">
                                  <span className="loading loading-spinner loading-xs"></span>
                                  Rotating pages...
                                </span>
                              ) : (
                                "Apply Rotation"
                              )}
                            </button>
                          </div>
                        )}

                        {rotatedUrl && (
                          <div className="p-4 rounded-xl bg-success/15 border border-success/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-bold text-success-content">Rotation Completed!</p>
                              <p className="text-[10px] text-success-content/70">
                                PDF has been rotated {rotateAngle} degrees clockwise.
                              </p>
                            </div>
                            <a
                              href={rotatedUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-success btn-sm text-white flex items-center gap-1.5 rounded-lg shadow-sm"
                            >
                              <IconDownload className="w-4 h-4" />
                              Download Rotated PDF
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 3: WATERMARK */}
                    {activeTab === "watermark" && (
                      <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-base-content/60">Upload PDF for Watermark</span>
                          {!watermarkFile ? (
                            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40">
                              <IconUpload className="w-8 h-8 opacity-40 mb-2 text-primary" />
                              <span className="text-xs font-bold">Choose a PDF file</span>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handleFileUpload(e, setWatermarkFile)}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-sm">
                              <div className="flex items-center gap-3">
                                <IconFileText className="w-8 h-8 text-primary" />
                                <div>
                                  <p className="text-xs font-bold truncate max-w-sm">{watermarkFile.name}</p>
                                  <p className="text-[10px] text-base-content/40">
                                    Pages: {watermarkFile.pages} • Size: {(watermarkFile.bytes / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setWatermarkFile(null);
                                  setWatermarkedUrl(null);
                                }}
                                className="btn btn-ghost btn-xs text-error"
                              >
                                Replace File
                              </button>
                            </div>
                          )}
                        </div>

                        {watermarkFile && (
                          <div className="card bg-base-100 border border-base-content/10 p-5 rounded-2xl space-y-4">
                            <h3 className="text-sm font-bold text-base-content flex items-center gap-2">
                              <IconSettings className="w-4 h-4 text-primary" />
                              Watermark Configuration Settings
                            </h3>

                            <div className="grid gap-4 md:grid-cols-2">
                              {/* Text input */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-base-content/60">Watermark Text</label>
                                <input
                                  type="text"
                                  value={watermarkText}
                                  onChange={(e) => setWatermarkText(e.target.value)}
                                  className="input input-bordered input-sm rounded-xl focus:border-primary focus:outline-none"
                                />
                              </div>

                              {/* Color select */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-base-content/60">Watermark Color</label>
                                <select
                                  value={watermarkColor}
                                  onChange={(e) => setWatermarkColor(e.target.value)}
                                  className="select select-bordered select-sm rounded-xl focus:border-primary focus:outline-none"
                                >
                                  <option value="red">Red</option>
                                  <option value="black">Black</option>
                                  <option value="grey">Grey</option>
                                  <option value="blue">Blue</option>
                                  <option value="green">Green</option>
                                </select>
                              </div>

                              {/* Font Size input */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-base-content/60">Font Size (px)</label>
                                <input
                                  type="number"
                                  value={watermarkFontSize}
                                  onChange={(e) => setWatermarkFontSize(parseInt(e.target.value) || 40)}
                                  className="input input-bordered input-sm rounded-xl focus:border-primary focus:outline-none"
                                />
                              </div>

                              {/* Gravity positioning */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-base-content/60">Position (Gravity)</label>
                                <select
                                  value={watermarkGravity}
                                  onChange={(e) => setWatermarkGravity(e.target.value)}
                                  className="select select-bordered select-sm rounded-xl focus:border-primary focus:outline-none"
                                >
                                  <option value="center">Center</option>
                                  <option value="north">Top (North)</option>
                                  <option value="south">Bottom (South)</option>
                                  <option value="east">Right (East)</option>
                                  <option value="west">Left (West)</option>
                                  <option value="north_east">Top Right (NE)</option>
                                  <option value="north_west">Top Left (NW)</option>
                                  <option value="south_east">Bottom Right (SE)</option>
                                  <option value="south_west">Bottom Left (SW)</option>
                                </select>
                              </div>

                              {/* Opacity slider */}
                              <div className="flex flex-col gap-1.5 md:col-span-2">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                  <span className="text-base-content/60">Opacity</span>
                                  <span>{watermarkOpacity}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="10"
                                  max="100"
                                  value={watermarkOpacity}
                                  onChange={(e) => setWatermarkOpacity(parseInt(e.target.value))}
                                  className="range range-primary range-xs"
                                />
                              </div>
                            </div>

                            <button
                              onClick={runWatermark}
                              disabled={isProcessingWatermark}
                              className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3 mt-4"
                            >
                              {isProcessingWatermark ? (
                                <span className="flex items-center gap-2">
                                  <span className="loading loading-spinner loading-xs"></span>
                                  Embedding watermark...
                                </span>
                              ) : (
                                "Apply Watermark Overlay"
                              )}
                            </button>
                          </div>
                        )}

                        {watermarkedUrl && (
                          <div className="p-4 rounded-xl bg-success/15 border border-success/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <p className="text-xs font-bold text-success-content">Watermark Applied!</p>
                              <p className="text-[10px] text-success-content/70">
                                Watermark text "{watermarkText}" has been permanently stamped onto pages.
                              </p>
                            </div>
                            <a
                              href={watermarkedUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-success btn-sm text-white flex items-center gap-1.5 rounded-lg shadow-sm"
                            >
                              <IconDownload className="w-4 h-4" />
                              Download Watermarked PDF
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 4: OPTIMIZE */}
                    {activeTab === "optimize" && (
                      <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-base-content/60">Upload PDF to Compress</span>
                          {!optimizeFile ? (
                            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40">
                              <IconUpload className="w-8 h-8 opacity-40 mb-2 text-primary" />
                              <span className="text-xs font-bold">Choose a PDF file</span>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handleFileUpload(e, setOptimizeFile)}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-sm">
                              <div className="flex items-center gap-3">
                                <IconFileText className="w-8 h-8 text-primary" />
                                <div>
                                  <p className="text-xs font-bold truncate max-w-sm">{optimizeFile.name}</p>
                                  <p className="text-[10px] text-base-content/40">
                                    Pages: {optimizeFile.pages} • Size: {(optimizeFile.bytes / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setOptimizeFile(null);
                                  setOptimizedUrl(null);
                                  setOptimizeStats(null);
                                }}
                                className="btn btn-ghost btn-xs text-error"
                              >
                                Replace File
                              </button>
                            </div>
                          )}
                        </div>

                        {optimizeFile && (
                          <button
                            onClick={runOptimize}
                            disabled={isProcessingOptimize}
                            className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3"
                          >
                            {isProcessingOptimize ? (
                              <span className="flex items-center gap-2">
                                <span className="loading loading-spinner loading-xs"></span>
                                Optimizing document bytes...
                              </span>
                            ) : (
                              "Compress PDF Size"
                            )}
                          </button>
                        )}

                        {optimizeStats && optimizedUrl && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-inner text-center">
                                <span className="text-[9px] uppercase tracking-wider font-bold block text-base-content/40">Original</span>
                                <span className="text-lg font-bold text-base-content">
                                  {(optimizeStats.originalBytes / 1024).toFixed(1)} KB
                                </span>
                              </div>
                              <div className="p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-inner text-center">
                                <span className="text-[9px] uppercase tracking-wider font-bold block text-base-content/40">Optimized</span>
                                <span className="text-lg font-bold text-success">
                                  {(optimizeStats.optimizedBytes / 1024).toFixed(1)} KB
                                </span>
                              </div>
                              <div className="p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-inner text-center">
                                <span className="text-[9px] uppercase tracking-wider font-bold block text-base-content/40">Efficiency</span>
                                <span className="text-lg font-bold text-accent">
                                  {optimizeStats.savedPercent}
                                </span>
                              </div>
                            </div>

                            <div className="p-4 rounded-xl bg-success/15 border border-success/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <p className="text-xs font-bold text-success-content">Compression Completed!</p>
                                <p className="text-[10px] text-success-content/70">
                                  Saved {((optimizeStats.savedBytes) / 1024).toFixed(1)} KB. Ready for download.
                                </p>
                              </div>
                              <a
                                href={optimizedUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-success btn-sm text-white flex items-center gap-1.5 rounded-lg shadow-sm"
                              >
                                <IconDownload className="w-4 h-4" />
                                Download Optimized PDF
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 5: PAGE MANAGER */}
                    {activeTab === "pages" && (
                      <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-base-content/60">Upload PDF to Manage</span>
                          {!managerFile ? (
                            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40">
                              <IconUpload className="w-8 h-8 opacity-40 mb-2 text-primary" />
                              <span className="text-xs font-bold">Choose a PDF file</span>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handleFileUpload(e, setManagerFile)}
                                className="hidden"
                              />
                            </label>
                          ) : (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-base-100 border border-base-content/5 shadow-sm">
                              <div className="flex items-center gap-3">
                                <IconFileText className="w-8 h-8 text-primary" />
                                <div>
                                  <p className="text-xs font-bold truncate max-w-sm">{managerFile.name}</p>
                                  <p className="text-[10px] text-base-content/40">
                                    Pages: {managerFile.pages} • Size: {(managerFile.bytes / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setManagerFile(null);
                                  setPagesInput("");
                                  setExtractedPages([]);
                                  setRemovedPagesUrl(null);
                                }}
                                className="btn btn-ghost btn-xs text-error"
                              >
                                Replace File
                              </button>
                            </div>
                          )}
                        </div>

                        {managerFile && (
                          <div className="card bg-base-100 border border-base-content/10 p-5 rounded-2xl space-y-4">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-center text-xs font-semibold">
                                <span className="text-base-content/60">Enter Page Numbers</span>
                                <span className="text-[10px] opacity-50">Range: 1 to {managerFile.pages}</span>
                              </div>
                              <input
                                type="text"
                                placeholder="Comma-separated page numbers e.g. 1, 3, 5"
                                value={pagesInput}
                                onChange={(e) => setPagesInput(e.target.value)}
                                className="input input-bordered input-sm rounded-xl focus:border-primary focus:outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                              <button
                                onClick={() => runPageManager("extract")}
                                disabled={isProcessingPages || !pagesInput.trim()}
                                className="btn btn-primary btn-outline rounded-xl py-3 flex items-center gap-1.5"
                              >
                                <IconEye className="w-4 h-4" />
                                Extract Pages (JPG)
                              </button>
                              <button
                                onClick={() => runPageManager("remove")}
                                disabled={isProcessingPages || !pagesInput.trim()}
                                className="btn btn-error btn-outline rounded-xl py-3 flex items-center gap-1.5"
                              >
                                <IconTrash className="w-4 h-4" />
                                Delete Pages (PDF)
                              </button>
                            </div>

                            {isProcessingPages && (
                              <div className="flex items-center justify-center py-6 gap-2 text-xs">
                                <span className="loading loading-spinner loading-xs text-primary"></span>
                                <span>Running page operation...</span>
                              </div>
                            )}

                            {/* Extracted pages results */}
                            {extractedPages.length > 0 && (
                              <div className="space-y-4 pt-4 border-t border-base-content/5">
                                <span className="text-xs font-bold uppercase tracking-wider text-base-content/50">
                                  Extracted Page Images
                                </span>
                                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                                  {extractedPages.map((pageObj, idx) => (
                                    <div
                                      key={idx}
                                      className="group relative border border-base-content/10 rounded-xl overflow-hidden bg-base-200 aspect-3/4 flex flex-col justify-between shadow-sm"
                                    >
                                      <img
                                        src={pageObj.imageUrl}
                                        alt={`Page ${pageObj.page}`}
                                        className="w-full h-full object-contain"
                                      />
                                      <div className="absolute bottom-0 inset-x-0 p-2 bg-black/60 backdrop-blur-xs text-[10px] text-white flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>Page {pageObj.page}</span>
                                        <a
                                          href={pageObj.imageUrl}
                                          download={`page_${pageObj.page}.jpg`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-white hover:text-primary"
                                        >
                                          <IconDownload className="w-3.5 h-3.5" />
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Removed pages results */}
                            {removedPagesUrl && (
                              <div className="p-4 rounded-xl bg-success/15 border border-success/30 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                                <div>
                                  <p className="text-xs font-bold text-success-content">Pages Deleted!</p>
                                  <p className="text-[10px] text-success-content/70">
                                    Document recompiled without pages {pagesInput}.
                                  </p>
                                </div>
                                <a
                                  href={removedPagesUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-success btn-sm text-white flex items-center gap-1.5 rounded-lg shadow-sm"
                                >
                                  <IconDownload className="w-4 h-4" />
                                  Download Recompiled PDF
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 6: CONVERTER */}
                    {activeTab === "converter" && (
                      <div className="space-y-10">
                        {/* Area 1: PDF to Image */}
                        <div className="space-y-4">
                          <h3 className="text-md font-bold text-base-content flex items-center gap-2">
                            <IconExchange className="w-5 h-5 text-primary" />
                            PDF to Image Converter
                          </h3>

                          <div className="flex flex-col gap-2">
                            {!convertFile ? (
                              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40">
                                <IconUpload className="w-8 h-8 opacity-40 mb-2 text-primary" />
                                <span className="text-xs font-bold">Choose a PDF file to convert</span>
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  onChange={(e) => handleFileUpload(e, setConvertFile)}
                                  className="hidden"
                                />
                              </label>
                            ) : (
                              <div className="space-y-4 bg-base-100 p-4 rounded-xl border border-base-content/5 shadow-sm">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <IconFileText className="w-8 h-8 text-primary" />
                                    <div>
                                      <p className="text-xs font-bold truncate max-w-sm">{convertFile.name}</p>
                                      <p className="text-[10px] text-base-content/40">
                                        Pages: {convertFile.pages} • Size: {(convertFile.bytes / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setConvertFile(null);
                                      setConvertedImageUrl(null);
                                    }}
                                    className="btn btn-ghost btn-xs text-error"
                                  >
                                    Replace
                                  </button>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3 pt-2">
                                  {/* Page Number */}
                                  <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-semibold uppercase text-base-content/50">Page</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max={convertFile.pages}
                                      value={convertPage}
                                      onChange={(e) => setConvertPage(parseInt(e.target.value) || 1)}
                                      className="input input-bordered input-sm rounded-xl focus:border-primary focus:outline-none"
                                    />
                                  </div>

                                  {/* Format select */}
                                  <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-semibold uppercase text-base-content/50">Format</label>
                                    <select
                                      value={convertFormat}
                                      onChange={(e) => setConvertFormat(e.target.value as any)}
                                      className="select select-bordered select-sm rounded-xl focus:border-primary focus:outline-none"
                                    >
                                      <option value="jpg">JPG</option>
                                      <option value="png">PNG</option>
                                      <option value="webp">WEBP</option>
                                    </select>
                                  </div>

                                  {/* Trigger */}
                                  <button
                                    onClick={runConvertToImage}
                                    disabled={isProcessingConvert}
                                    className="btn btn-primary btn-sm self-end rounded-xl py-2 cursor-pointer h-9"
                                  >
                                    {isProcessingConvert ? "Converting..." : "Convert Page"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {convertedImageUrl && (
                            <div className="p-4 bg-base-100 rounded-xl border border-base-content/5 flex flex-col items-center gap-4">
                              <span className="text-[10px] font-semibold text-base-content/40 uppercase">Conversion Preview</span>
                              <div className="max-h-[300px] overflow-hidden border border-base-content/10 rounded-lg shadow-sm">
                                <img
                                  src={convertedImageUrl}
                                  alt="Converted PDF page"
                                  className="max-h-[300px] object-contain"
                                />
                              </div>
                              <a
                                href={convertedImageUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline btn-xs flex items-center gap-1 hover:bg-base-200"
                              >
                                <IconDownload className="w-3 h-3" />
                                Download Converted Image
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Area 2: Images to PDF */}
                        <div className="space-y-4 pt-6 border-t border-base-content/5">
                          <h3 className="text-md font-bold text-base-content flex items-center gap-2">
                            <IconExchange className="w-5 h-5 text-secondary" />
                            Images to PDF Generator
                          </h3>

                          <div className="grid gap-4 md:grid-cols-2">
                            {/* Upload Zone */}
                            <div className="flex flex-col gap-2">
                              <span className="text-xs font-semibold text-base-content/60">Upload Source Images</span>
                              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40">
                                <IconUpload className="w-6 h-6 opacity-40 mb-2 text-secondary" />
                                <span className="text-xs font-bold text-center">Add Image (JPG/PNG)</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {/* Tag Input */}
                            <div className="flex flex-col gap-2">
                              <span className="text-xs font-semibold text-base-content/60">Configuration Tag</span>
                              <input
                                type="text"
                                placeholder="Auto-generated tag..."
                                value={imageTag}
                                onChange={(e) => setImageTag(e.target.value)}
                                className="input input-bordered w-full rounded-xl bg-base-100 border-base-content/10 text-sm focus:border-primary focus:outline-none"
                              />
                            </div>
                          </div>

                          {imageFiles.length > 0 && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between pt-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50">
                                  Image Sequence ({imageFiles.length} files)
                                </span>
                                <button
                                  onClick={() => {
                                    setImageFiles([]);
                                    setImageTag("");
                                    setCreatedPdfUrl(null);
                                  }}
                                  className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                                >
                                  Clear Sequence
                                </button>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {imageFiles.map((fileObj, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-base-100 rounded-xl border border-base-content/5 relative shadow-xs flex flex-col items-center justify-center text-center"
                                  >
                                    <span className="w-5 h-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center text-[10px] font-bold mb-1">
                                      {idx + 1}
                                    </span>
                                    <p className="text-[10px] font-bold truncate max-w-full">{fileObj.name}</p>
                                    <button
                                      onClick={() =>
                                        setImageFiles((prev) => prev.filter((_, i) => i !== idx))
                                      }
                                      className="absolute top-1 right-1 text-base-content/30 hover:text-error transition-colors"
                                    >
                                      <IconTrash className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>

                              <button
                                onClick={runImagesToPdf}
                                disabled={imageFiles.length === 0 || isCreatingPdfFromImages}
                                className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3"
                              >
                                {isCreatingPdfFromImages ? (
                                  <span className="flex items-center gap-2 justify-center">
                                    <span className="loading loading-spinner loading-xs"></span>
                                    Compiling Images to PDF...
                                  </span>
                                ) : (
                                  "Compile Images into PDF"
                                )}
                              </button>
                            </div>
                          )}

                          {createdPdfUrl && (
                            <div className="p-4 rounded-xl bg-success/15 border border-success/30 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                              <div>
                                <p className="text-xs font-bold text-success-content">PDF Compiled Successfully!</p>
                                <p className="text-[10px] text-success-content/70">
                                  Your sequential image PDF is ready.
                                </p>
                              </div>
                              <a
                                href={createdPdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-success btn-sm text-white flex items-center gap-1.5 rounded-lg shadow-sm"
                              >
                                <IconDownload className="w-4 h-4" />
                                Download Compiled PDF
                              </a>
                            </div>
                          )}
                        </div>
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
