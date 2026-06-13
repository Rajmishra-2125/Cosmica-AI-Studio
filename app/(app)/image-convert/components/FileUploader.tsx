"use client";

import React, { useState } from "react";
import { IconUpload, IconCloudUpload, IconX, IconPhoto } from "@tabler/icons-react";
import { toast } from "@/app/store/Toast";
import { filesize } from "filesize";
import { cn } from "@/app/lib/utils";

interface UploadedFile {
  publicId: string;
  url: string;
  name: string;
  size: number;
  format: string;
}

interface FileUploaderProps {
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  uploadedFile: UploadedFile | null;
  onUploadSuccess: (file: UploadedFile) => void;
  onClear: () => void;
}

export default function FileUploader({
  isUploading,
  setIsUploading,
  uploadedFile,
  onUploadSuccess,
  onClear,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast("File exceeds 10MB upload limit.", "error");
      return;
    }

    // Validate if it is an image
    if (!file.type.startsWith("image/")) {
      toast("Invalid file type. Please upload an image.", "error");
      return;
    }

    setIsUploading(true);
    toast("Uploading asset to Cloudinary Vault...", "info");

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
        const format = file.name.split(".").pop()?.toLowerCase() || "png";

        onUploadSuccess({
          publicId: data.publicId,
          url,
          name: file.name,
          size: file.size,
          format,
        });

        toast("Image registered to workspace successfully!", "success");
      } else {
        throw new Error("Invalid response format from upload api");
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      toast(err.message || "Failed to upload image.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      {!uploadedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 bg-base-100/40 relative min-h-[180px]",
            isDragOver
              ? "border-primary bg-primary/5 scale-[0.99] shadow-inner"
              : "border-base-content/15 hover:border-primary/50 hover:bg-base-100/60"
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 pointer-events-none text-center">
              <span className="loading loading-spinner loading-md text-primary"></span>
              <span className="text-xs font-bold text-base-content/85">Uploading asset...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <IconCloudUpload className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-base-content">
                Drag and drop your image, or <span className="text-primary hover:underline">browse</span>
              </span>
              <span className="text-[10px] text-base-content/40 mt-1">
                Supports PNG, JPG, WEBP, AVIF, HEIC, GIF, BMP, TIFF (Max 10MB)
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200 border border-base-content/10 shadow-sm transition-all">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-base-content/10 bg-slate-900 shrink-0 relative flex items-center justify-center">
              <img
                src={uploadedFile.url}
                alt="Source Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback for non-browser-native images like HEIC
                  e.currentTarget.style.display = "none";
                }}
              />
              <IconPhoto className="w-5 h-5 absolute opacity-30 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-base-content truncate max-w-[180px] sm:max-w-[300px]">
                {uploadedFile.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] bg-primary/10 text-primary font-bold uppercase rounded-md px-1.5 py-0.5">
                  {uploadedFile.format}
                </span>
                <span className="text-[10px] text-base-content/40 font-semibold">
                  {filesize(uploadedFile.size)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClear}
            className="btn btn-circle btn-ghost btn-sm text-error/80 hover:text-error hover:bg-error/10 cursor-pointer"
            title="Remove file"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
