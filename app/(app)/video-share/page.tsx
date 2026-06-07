"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  IconCloudUpload,
  IconVideo,
  IconSparkles,
  IconDatabase,
  IconPercentage,
  IconDownload,
} from "@tabler/icons-react";
import VideoCard from "@/generated/VideoCard";

interface Video {
  id: string;
  title: string;
  description?: string;
  publicId: string;
  originalSize: string;
  compressedSize: string;
  duration: number;
  createdAt: string;
}

export default function VideoShare() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70MB Limit

  // Fetch all videos from the API
  const fetchVideos = useCallback(async () => {
    setIsLoadingVideos(true);
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoadingVideos(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        // Pre-fill title with file name without extension
        const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "");
        setTitle(cleanName);
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds the 70MB workspace compression limit.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      // Setup progress tracking
      const response = await axios.post("/api/video-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 50;
          setUploadProgress(percent);
        },
      });

      if (response.status === 200 || response.status === 201) {
        // Clear Form
        setFile(null);
        setTitle("");
        setDescription("");
        setUploadProgress(0);
        // Refresh videos gallery
        fetchVideos();
      } else {
        alert("Upload completed but returned an unexpected status.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("An error occurred while uploading and compressing the video.");
    } finally {
      setIsUploading(false);
    }
  };

  // Utility helpers for formatting video details
  const formatSize = (bytesStr: string) => {
    const bytes = parseFloat(bytesStr);
    if (isNaN(bytes)) return "0.00 MB";
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const calculateSavings = (original: string, compressed: string) => {
    const orig = parseFloat(original);
    const comp = parseFloat(compressed);
    if (isNaN(orig) || isNaN(comp) || orig === 0) return 0;
    const ratio = ((orig - comp) / orig) * 100;
    return Math.max(0, Math.round(ratio));
  };

  const handleDownload = useCallback((url: String, title: String) => {
    const urlString = url.toString();
    const titleString = title.toString();
    fetch(urlString)
      .then((response) => response.blob())
      .then((blob) => {
        const localUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = localUrl;
        link.setAttribute("download", `${titleString}.mp4`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(localUrl);
      })
      .catch((error) => {
        console.error("Direct download failed, opening in new tab:", error);
        const link = document.createElement("a");
        link.href = urlString;
        link.setAttribute("target", "_blank");
        link.click();
      });
  }, []);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-base-content">
          Video Compressor & Library
        </h1>
        <p className="text-base-content/70 text-sm md:text-base max-w-xl">
          Upload video files, compress them using optimized formatting, and organize your files instantly.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Upload Form - Left Pane (lg:col-span-4) */}
        <div className="lg:col-span-4">
          <div className="card bg-base-200 border border-base-content/10 backdrop-blur-md rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <IconCloudUpload className="w-5 h-5 text-primary" />
              Workspace Compressor
            </h2>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Drop Area */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-base-content/60">Select Video File</span>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-350/20">
                  <IconVideo className="w-6 h-6 opacity-50 mb-2" />
                  <span className="text-xs font-semibold text-base-content text-center truncate max-w-50">
                    {file ? file.name : "Browse .mp4, .mov"}
                  </span>
                  <span className="text-[10px] text-base-content/40 mt-1">Max file size: 70MB</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                    disabled={isUploading}
                  />
                </label>
              </div>

              {/* Title Field */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-base-content/60">Video Title</label>
                <input
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered input-md rounded-xl bg-base-100 border-base-content/10 text-base-content text-sm focus:border-primary focus:outline-none"
                  required
                  disabled={isUploading}
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-base-content/60">Description (Optional)</label>
                <textarea
                  placeholder="Enter brief description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea textarea-bordered rounded-xl bg-base-100 border-base-content/10 text-base-content text-sm focus:border-primary focus:outline-none h-20"
                  disabled={isUploading}
                />
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-primary">Compressing & Uploading</span>
                    <span className="text-base-content/70">{uploadProgress}%</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full bg-base-350"
                    value={uploadProgress}
                    max="100"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full text-primary-content border-none shadow-lg shadow-primary/20 rounded-xl py-3 mt-4 cursor-pointer transition-transform duration-200 hover:scale-102 active:scale-98"
                disabled={isUploading || !file}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-xs"></span>
                    Compressing...
                  </span>
                ) : (
                  "Compress & Upload"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Library / Gallery - Right Pane (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <IconSparkles className="w-5 h-5 text-secondary" />
              Asset Library
            </h2>
            <button
              onClick={fetchVideos}
              className="btn btn-ghost btn-xs text-base-content/60 hover:text-base-content flex items-center gap-1.5 cursor-pointer"
              disabled={isLoadingVideos}
            >
              <svg
                className={`w-3.5 h-3.5 ${isLoadingVideos ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15.22L21.2 16"
                />
              </svg>
              Sync Library
            </button>
          </div>

          {isLoadingVideos && videos.length === 0 ? (
            /* Loading Grid Skeletons */
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="card bg-base-200/30 border border-base-content/10 p-5 rounded-2xl space-y-4 animate-pulse">
                  <div className="h-44 w-full rounded-xl bg-base-350/40"></div>
                  <div className="h-5 w-3/4 bg-base-350/40 rounded"></div>
                  <div className="h-4 w-1/2 bg-base-350/40 rounded"></div>
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            /* Empty State */
            <div className="card bg-base-200/50 border border-base-content/10 p-12 text-center rounded-2xl">
              <div className="flex flex-col items-center gap-4 text-base-content/40">
                <IconVideo className="w-12 h-12 opacity-60" />
                <div className="space-y-1">
                  <p className="font-semibold text-base-content/60">No compressed assets in library</p>
                  <p className="text-xs opacity-50">Upload a video file to begin compression matching.</p>
                </div>
              </div>
            </div>
          ) : (
            /* Video Gallery Grid */
            <div className="grid gap-6 md:grid-cols-2">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={{
                    ...video,
                    duration: video.duration || 0,
                    originalSize: String(video.originalSize),
                    compressedSize: String(video.compressedSize),
                  } as any}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
