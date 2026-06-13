"use client";

import React, { useState } from "react";
import { IconUpload, IconTrash, IconDownload } from "@tabler/icons-react";
import { toast } from "@/app/store/Toast";
import PdfUploader from "./PdfUploader";

interface UploadedFile {
  name: string;
  publicId: string;
  url: string;
  pages: number;
  bytes: number;
}

interface PdfConverterProps {
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  setErrorMsg: (error: string | null) => void;
  handleDownload: (url: string, filename: string) => void;
}

export default function PdfConverter({
  isUploading,
  setIsUploading,
  setErrorMsg,
  handleDownload,
}: PdfConverterProps) {
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

  // Helper: Get Cloudinary Page Thumbnail URL
  const getPdfPageThumbnailUrl = (publicId: string, pageNumber: number) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxojgqsrh";
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_260,c_fill,pg_${pageNumber}/${publicId}.jpg`;
  };

  // Convert PDF page to Image
  const runConvertToImage = async () => {
    if (!convertFile) return;
    setIsProcessingConvert(true);
    setConvertedImageUrl(null);
    setErrorMsg(null);
    toast("Converting page to raster formats...", "info");

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
        toast("Page converted to image successfully!", "success");
      } else {
        throw new Error(data.error || "Conversion failed");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to convert page to image.");
      toast("Conversion failed.", "error");
    } finally {
      setIsProcessingConvert(false);
    }
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
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      if (data.publicId) {
        setImageFiles((prev) => [...prev, { name: file.name, publicId: data.publicId }]);
        if (!imageTag) {
          setImageTag(`img2pdf_${Date.now()}`);
        }
        toast("Image added to PDF compiler queue!", "success");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: unknown) {
      console.error("Image upload error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to upload image.");
      toast("Image upload failed.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Convert Images to PDF
  const runImagesToPdf = async () => {
    if (imageFiles.length === 0 || !imageTag) return;
    setIsCreatingPdfFromImages(true);
    setCreatedPdfUrl(null);
    setErrorMsg(null);
    toast("Compiling images into PDF...", "info");

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
        toast("Compiled PDF successfully generated!", "success");
      } else {
        throw new Error(data.error || "Failed to compile PDF");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to create PDF from images.");
      toast("Compilation failed.", "error");
    } finally {
      setIsCreatingPdfFromImages(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* PDF to Image */}
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-base-content/50 pl-1 block">
          PDF Page to Image Conversion
        </span>
        <div className="grid gap-5 md:grid-cols-2 items-start">
          <div className="space-y-4 bg-base-100 p-4 border border-base-content/10 rounded-xl">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-base-content/50">Upload PDF</label>
              {!convertFile ? (
                <PdfUploader
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                  setErrorMsg={setErrorMsg}
                  onUploadSuccess={(file) => {
                    setConvertFile(file);
                    setConvertPage(1);
                  }}
                  label="Choose a PDF file"
                />
              ) : (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-base-200 border border-base-content/5">
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{convertFile.name}</p>
                    <p className="text-[9px] opacity-50 mt-0.5 font-semibold">Pages: {convertFile.pages}</p>
                  </div>
                  <button
                    onClick={() => {
                      setConvertFile(null);
                      setConvertedImageUrl(null);
                    }}
                    className="btn btn-ghost btn-xs text-error font-bold"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {convertFile && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-base-content/50">Page number</label>
                  <input
                    type="number"
                    min="1"
                    max={convertFile.pages}
                    value={convertPage}
                    onChange={(e) => setConvertPage(Number(e.target.value))}
                    className="input input-bordered input-xs rounded-lg bg-base-200 text-[10px]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-base-content/50">Format</label>
                  <select
                    value={convertFormat}
                    onChange={(e) => setConvertFormat(e.target.value as any)}
                    className="select select-bordered select-xs rounded-lg bg-base-200 text-[10px]"
                  >
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WEBP</option>
                  </select>
                </div>
              </div>
            )}

            {convertFile && (
              <button
                onClick={runConvertToImage}
                disabled={isProcessingConvert}
                className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3 text-xs font-bold cursor-pointer"
              >
                {isProcessingConvert ? (
                  <span className="flex items-center gap-1.5">
                    <span className="loading loading-spinner loading-xs"></span>
                    Converting page...
                  </span>
                ) : (
                  "Convert Page"
                )}
              </button>
            )}
          </div>

          {/* Display converted image preview */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-base-content/50 pl-1 block">
              Output Image Viewport
            </span>
            <div className="bg-slate-900 border border-base-content/10 rounded-xl p-4 flex items-center justify-center relative min-h-[220px]">
              {convertedImageUrl ? (
                <div className="relative w-36 aspect-[3/4] bg-base-100 shadow-2xl rounded-md overflow-hidden flex flex-col items-center justify-center select-none group">
                  <img
                    src={convertedImageUrl}
                    alt="Converted output"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button
                      onClick={() => handleDownload(convertedImageUrl, `page_${convertPage}.${convertFormat}`)}
                      className="btn btn-primary btn-xs text-[10px] font-bold border-none rounded-md cursor-pointer"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ) : (
                <span className="text-[10px] text-white/40">Oven idle. Hit convert page.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Images to PDF */}
      <div className="space-y-4 pt-4 border-t border-base-content/5 animate-fade-in">
        <span className="text-xs font-bold uppercase tracking-wider text-base-content/50 pl-1 block">
          Compile Images to PDF Document
        </span>
        <div className="grid gap-5 md:grid-cols-2 items-start">
          <div className="space-y-4 bg-base-100 p-4 border border-base-content/10 rounded-xl">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-base-content/50">Add image asset</label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-200/50">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="loading loading-spinner loading-xs text-primary"></span>
                    <span className="text-[9px] font-bold">Uploading image...</span>
                  </div>
                ) : (
                  <>
                    <IconUpload className="w-5 h-5 opacity-40 mb-1 text-primary" />
                    <span className="text-[10px] font-bold">Choose an image file</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {imageFiles.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-base-content/50">Document Tag</label>
                  <input
                    type="text"
                    placeholder="Enter identifier tag"
                    value={imageTag}
                    onChange={(e) => setImageTag(e.target.value)}
                    className="input input-bordered input-xs rounded-lg bg-base-200 text-[10px] focus:outline-none"
                  />
                </div>

                <button
                  onClick={runImagesToPdf}
                  disabled={isCreatingPdfFromImages || !imageTag}
                  className="btn btn-primary w-full text-primary-content border-none shadow-md rounded-xl py-3 text-xs font-bold cursor-pointer"
                >
                  {isCreatingPdfFromImages ? (
                    <span className="flex items-center gap-1.5">
                      <span className="loading loading-spinner loading-xs"></span>
                      Compiling document...
                    </span>
                  ) : (
                    "Generate PDF Document"
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-base-content/50 pl-1 block">
              Images Queue ({imageFiles.length} files added)
            </span>
            <div className="bg-slate-900 border border-base-content/10 rounded-xl p-4 min-h-[160px] max-h-[200px] overflow-y-auto space-y-2">
              {imageFiles.length === 0 ? (
                <div className="h-full flex items-center justify-center py-10">
                  <span className="text-[10px] text-white/40">Queue is currently empty.</span>
                </div>
              ) : (
                imageFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs text-white/80 border border-white/5"
                  >
                    <span className="truncate max-w-[180px] font-mono text-[10px]">{file.name}</span>
                    <button
                      onClick={() => setImageFiles((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {createdPdfUrl && (
        <div className="p-4 rounded-xl bg-success/15 border border-success/35 flex items-center justify-between gap-4 animate-fade-in">
          <div>
            <p className="text-xs font-bold text-success-content">PDF Document Compiled!</p>
            <p className="text-[10px] text-success-content/70 mt-0.5 font-semibold">Images joined successfully.</p>
          </div>
          <button
            onClick={() => handleDownload(createdPdfUrl, "compiled.pdf")}
            className="btn btn-success btn-sm text-white flex items-center gap-1.5 rounded-lg shadow-sm cursor-pointer"
          >
            <IconDownload className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
