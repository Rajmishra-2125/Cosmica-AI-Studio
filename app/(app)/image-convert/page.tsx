"use client";

import React, { useState } from "react";
import { IconExchange, IconSettings, IconAlertTriangle } from "@tabler/icons-react";
import FileUploader from "./components/FileUploader";
import FormatSelector from "./components/FormatSelector";
import ConversionPreview from "./components/ConversionPreview";
import { toast } from "@/app/store/Toast";

interface UploadedFile {
  publicId: string;
  url: string;
  name: string;
  size: number;
  format: string;
}

export default function ImageConvertPage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [targetFormat, setTargetFormat] = useState<string>("webp");
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUploadSuccess = (file: UploadedFile) => {
    setUploadedFile(file);
    setConvertedUrl(null);
    setErrorMsg(null);

    // Set a sensible default target format that isn't the same as source
    const srcFmt = file.format.toLowerCase();
    if (srcFmt === "webp" || srcFmt === "avif") {
      setTargetFormat("png");
    } else {
      setTargetFormat("webp");
    }
  };

  const handleClear = () => {
    setUploadedFile(null);
    setConvertedUrl(null);
    setTargetFormat("webp");
    setErrorMsg(null);
  };

  const getConvertEndpoint = (sourceFormat: string) => {
    const fmt = sourceFormat.toLowerCase();
    if (fmt === "jpeg") return "jpg-to-any";
    if (fmt === "heif") return "heic-to-any";
    return `${fmt}-to-any`;
  };

  const handleConvert = async () => {
    if (!uploadedFile) return;

    setIsConverting(true);
    setConvertedUrl(null);
    setErrorMsg(null);
    toast("Initiating image conversion...", "info");

    const endpointName = getConvertEndpoint(uploadedFile.format);

    try {
      const response = await fetch(`/api/manage-image/convert/${endpointName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId: uploadedFile.publicId,
          targetFormat: targetFormat,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setConvertedUrl(data.transformedUrl);
        toast(`Converted successfully to ${targetFormat.toUpperCase()}!`, "success");
      } else {
        throw new Error(data.error || "Format conversion failed");
      }
    } catch (err: any) {
      console.error("Conversion error:", err);
      const msg = err.message || "Failed to convert image format.";
      setErrorMsg(msg);
      toast(msg, "error");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-base-200/50 border border-base-content/10 p-6 md:p-8 rounded-3xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-lg">
            <IconExchange className="w-3.5 h-3.5 animate-pulse" />
            Conversion Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Image Format Converter Studio
          </h1>
          <p className="text-xs md:text-sm text-base-content/70 max-w-2xl leading-relaxed">
            Convert image formats instantly using high-performance Cloudinary transformations.
            Upload your source file, choose the desired output layout/format, and download the result.
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Controls Panel */}
        <div className="lg:col-span-4 bg-base-200 border border-base-content/10 rounded-2xl p-5 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-base-content/5">
            <IconSettings className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xs font-bold text-base-content uppercase tracking-wider">
              Configuration Panel
            </h2>
          </div>

          {/* Section 1: Upload Source */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-base-content/60 uppercase tracking-wider block">
              Source Asset
            </label>
            <FileUploader
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              uploadedFile={uploadedFile}
              onUploadSuccess={handleUploadSuccess}
              onClear={handleClear}
            />
          </div>

          {/* Section 2: Format Selector (shown only after upload) */}
          {uploadedFile && (
            <div className="pt-4 border-t border-base-content/5 animate-fade-in">
              <FormatSelector
                sourceFormat={uploadedFile.format}
                selectedFormat={targetFormat}
                onSelectFormat={setTargetFormat}
              />
            </div>
          )}

          {/* Section 3: Error Notification */}
          {errorMsg && (
            <div className="alert alert-error text-xs rounded-xl flex items-start gap-2 py-3 px-4 shadow-sm text-error-content bg-error/15 border border-error/20">
              <IconAlertTriangle className="w-4 h-4 shrink-0 text-error mt-0.5" />
              <div className="leading-normal">
                <span className="font-bold">Conversion Error:</span> {errorMsg}
              </div>
            </div>
          )}
        </div>

        {/* Right Preview Visualizer */}
        <div className="lg:col-span-8">
          <ConversionPreview
            uploadedFile={uploadedFile}
            convertedUrl={convertedUrl}
            targetFormat={targetFormat}
            isProcessing={isConverting}
            onConvert={handleConvert}
          />
        </div>
      </div>
    </div>
  );
}
