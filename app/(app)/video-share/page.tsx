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
  IconDimensions,
  IconClock,
  IconLayoutGrid,
  IconList,
  IconTrash,
} from "@tabler/icons-react";
import VideoCard from "@/generated/VideoCard";
import { toast } from "@/app/store/Toast";
import { cn } from "@/app/lib/utils";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Selected file client-side metadata state
  const [videoMeta, setVideoMeta] = useState<{
    duration: number;
    width: number;
    height: number;
    type: string;
  } | null>(null);

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
      toast("Failed to sync video library.", "error");
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
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast("File size exceeds the 70MB workspace compression limit.", "error");
        return;
      }

      setFile(selectedFile);
      setVideoMeta(null);

      // Pre-fill title
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(cleanName);

      // Extract metadata client-side using a temporary URL
      const tempUrl = URL.createObjectURL(selectedFile);
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.src = tempUrl;
      videoElement.onloadedmetadata = () => {
        setVideoMeta({
          duration: videoElement.duration,
          width: videoElement.videoWidth,
          height: videoElement.videoHeight,
          type: selectedFile.type,
        });
        URL.revokeObjectURL(tempUrl);
      };
      videoElement.onerror = () => {
        URL.revokeObjectURL(tempUrl);
        console.error("Could not extract video metadata.");
      };
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    toast("Starting perception-aware video compression...", "info");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description || "Compressed via Video Engineering Studio.");
    formData.append("originalSize", file.size.toString());

    try {
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
        toast("Video compressed and added to vault!", "success");
        setFile(null);
        setTitle("");
        setDescription("");
        setVideoMeta(null);
        setUploadProgress(0);
        fetchVideos();
      } else {
        toast("Upload completed with unexpected status code.", "info");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast("An error occurred during video upload and compression.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = useCallback((url: String, title: String) => {
    const urlString = url.toString();
    const titleString = title.toString();
    toast("Downloading compressed MP4 video...", "info");
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
        toast("Download completed successfully!", "success");
      })
      .catch((error) => {
        console.error("Direct download failed, opening in new tab:", error);
        window.open(urlString, "_blank");
      });
  }, []);

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

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <div className="grid gap-6 lg:grid-cols-12 items-stretch">
        {/* Upload Form - Left Pane (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-base-200 border border-base-content/10 rounded-2xl p-5 space-y-6 shadow-xl h-full">
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-base-content/5 shrink-0">
              <IconCloudUpload className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-base-content uppercase tracking-wider">
                Video Compressor
              </h2>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Drop Area */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-base-content/60 uppercase pl-1">Select Video Source</span>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-base-content/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-base-100/40 text-center">
                  <IconVideo className="w-6 h-6 opacity-40 mb-1.5 text-primary" />
                  <span className="text-xs font-bold text-base-content max-w-56 truncate">
                    {file ? file.name : "Browse raw .mp4, .mov"}
                  </span>
                  <span className="text-[9px] text-base-content/40 mt-1">Max limit: 70MB</span>
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

              {/* Client-side extracted metadata dashboard */}
              {file && videoMeta && (
                <div className="bg-base-100/60 border border-base-content/5 p-3 rounded-xl space-y-2 text-[10px] font-mono text-base-content/75">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-base-content/40 block">
                    Source Telemetry
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <IconDimensions className="w-3.5 h-3.5 text-primary" />
                      <span>{videoMeta.width}x{videoMeta.height}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IconClock className="w-3.5 h-3.5 text-primary" />
                      <span>{formatDuration(videoMeta.duration)}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 truncate">
                      <IconDatabase className="w-3.5 h-3.5 text-primary" />
                      <span className="truncate">Raw Size: {formatSize(file.size.toString())}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Title Field */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-base-content/60 uppercase pl-1">Video Title</label>
                <input
                  type="text"
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered input-sm rounded-xl bg-base-100 border-base-content/10 text-xs focus:border-primary focus:outline-none"
                  required
                  disabled={isUploading}
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-base-content/60 uppercase pl-1">Description</label>
                <textarea
                  placeholder="Describe this asset..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea textarea-bordered rounded-xl bg-base-100 border-base-content/10 text-xs focus:border-primary focus:outline-none h-16 resize-none"
                  disabled={isUploading}
                />
              </div>

              {/* Compression Mode Spec Indicator */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-2.5 text-[9px] text-base-content/70 leading-relaxed font-semibold">
                <IconSparkles className="w-3.5 h-3.5 text-primary inline mr-1 mb-0.5 animate-pulse" />
                Optimizing with Cloudinary perception-aware auto bitrate intelligence. High fidelity conversion.
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                    <span className="text-primary">Optimizing stream...</span>
                    <span className="text-base-content/70">{uploadProgress}%</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full h-1.5 bg-base-300"
                    value={uploadProgress}
                    max="100"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full text-primary-content border-none shadow-lg shadow-primary/20 rounded-xl py-3 mt-4 cursor-pointer text-xs font-bold"
                disabled={isUploading || !file}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner loading-xs"></span>
                    Transcoding...
                  </span>
                ) : (
                  "Transcode & Compress"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Library / Gallery - Right Pane (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-base-content/10 pb-3">
            <h2 className="text-base font-bold text-base-content uppercase tracking-wider flex items-center gap-2">
              <IconSparkles className="w-5 h-5 text-secondary" />
              Studio Asset Library
            </h2>

            <div className="flex items-center gap-3">
              {/* Sync Library Trigger */}
              <button
                onClick={fetchVideos}
                className="btn btn-ghost btn-xs text-base-content/60 hover:text-base-content flex items-center gap-1.5 cursor-pointer font-bold"
                disabled={isLoadingVideos}
              >
                <svg
                  className={cn("w-3.5 h-3.5", isLoadingVideos && "animate-spin")}
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
                Sync Vault
              </button>

              {/* View Switcher */}
              <div className="join border border-base-content/10 rounded-xl p-0.5 bg-base-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "join-item btn btn-xs px-2 rounded-lg border-none text-[10px] cursor-pointer",
                    viewMode === "grid" ? "bg-primary text-primary-content" : "bg-transparent text-base-content/50"
                  )}
                >
                  <IconLayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "join-item btn btn-xs px-2 rounded-lg border-none text-[10px] cursor-pointer",
                    viewMode === "list" ? "bg-primary text-primary-content" : "bg-transparent text-base-content/50"
                  )}
                >
                  <IconList className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {isLoadingVideos && videos.length === 0 ? (
            /* Loading Grid Skeletons */
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="card bg-base-200/35 border border-base-content/10 p-5 rounded-2xl space-y-4 animate-pulse">
                  <div className="h-40 w-full rounded-xl bg-base-350/40"></div>
                  <div className="h-4 w-3/4 bg-base-350/40 rounded"></div>
                  <div className="h-3 w-1/2 bg-base-350/40 rounded"></div>
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            /* Empty State */
            <div className="card bg-base-200 border border-base-content/10 p-12 text-center rounded-2xl flex-1 flex flex-col justify-center items-center">
              <div className="flex flex-col items-center gap-4 text-base-content/40 max-w-xs">
                <IconVideo className="w-12 h-12 opacity-60" />
                <div className="space-y-1">
                  <p className="font-bold text-sm text-base-content">No assets inside catalog</p>
                  <p className="text-xs opacity-50leading-normal">Upload a video in the left panel to begin perception auto-transcoding.</p>
                </div>
              </div>
            </div>
          ) : viewMode === "grid" ? (
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
          ) : (
            /* List Table View */
            <div className="overflow-x-auto bg-base-200 border border-base-content/10 rounded-2xl shadow-xl flex-1">
              <table className="table table-md w-full text-xs">
                <thead>
                  <tr className="border-b border-base-content/10 text-base-content/50 text-[10px] uppercase tracking-wider font-extrabold bg-base-300/40">
                    <th className="py-3 px-4">Video Asset</th>
                    <th className="py-3 px-4">Original Size</th>
                    <th className="py-3 px-4">Optimized Size</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Savings Ratio</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-content/5">
                  {videos.map((video) => {
                    const savings = Math.max(
                      0,
                      Math.round((1 - Number(video.compressedSize) / Number(video.originalSize)) * 100)
                    );
                    return (
                      <tr key={video.id} className="hover:bg-base-100/50 transition-colors">
                        <td className="py-3 px-4 font-bold max-w-xs truncate">
                          <div>
                            <p className="truncate text-base-content font-bold">{video.title}</p>
                            <p className="text-[10px] text-base-content/40 truncate mt-0.5">{video.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-base-content/60">
                          {formatSize(video.originalSize)}
                        </td>
                        <td className="py-3 px-4 font-mono text-primary font-bold">
                          {formatSize(video.compressedSize)}
                        </td>
                        <td className="py-3 px-4 font-mono text-base-content/60">
                          {formatDuration(video.duration)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-accent/10 border border-accent/20 text-accent font-bold px-2 py-0.5 rounded-lg font-mono">
                            {savings}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() =>
                              handleDownload(
                                `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxojgqsrh"}/video/upload/${video.publicId}`,
                                video.title
                              )
                            }
                            className="btn btn-outline btn-xs rounded-lg border-base-content/10 text-base-content hover:bg-primary hover:text-primary-content hover:border-transparent cursor-pointer font-bold"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
