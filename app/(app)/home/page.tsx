"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "motion/react";
import { filesize } from "filesize";
import {
  IconSearch,
  IconSparkles,
  IconVideo,
  IconDatabase,
  IconPercentage,
  IconPlus,
  IconPhoto,
  IconFileText,
  IconCpu,
  IconLayoutGrid,
  IconList,
  IconArrowUpRight,
  IconCloudUpload,
} from "@tabler/icons-react";
import VideoCard from "@/generated/VideoCard";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
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

export default function Home() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "savings">("date");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

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
        toast(`Downloaded: ${titleString}`, "success");
      })
      .catch((error) => {
        console.error("Direct download failed, opening in new tab:", error);
        const link = document.createElement("a");
        link.href = urlString;
        link.setAttribute("target", "_blank");
        link.click();
      });
  }, []);

  // Inline Quick Video Upload handler
  const handleQuickUpload = async (file: File) => {
    const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70MB
    if (file.size > MAX_FILE_SIZE) {
      toast("File exceeds 70MB workspace compression limit.", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name.replace(/\.[^/.]+$/, ""));
    formData.append("description", "Uploaded directly from dashboard console.");
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
        toast("Video uploaded and compressed successfully!", "success");
        fetchVideos();
      } else {
        toast("Upload finished with unexpected status code.", "info");
      }
    } catch (error) {
      console.error("Quick upload failed:", error);
      toast("An error occurred during video upload and compression.", "error");
    } finally {
      setIsUploading(false);
    }
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
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      handleQuickUpload(droppedFile);
    } else {
      toast("Only video file formats are supported.", "error");
    }
  };

  // Compute aggregated dashboard statistics
  const stats = useMemo(() => {
    if (videos.length === 0) {
      return { totalCount: 0, originalTotal: 0, compressedTotal: 0, savedTotal: 0, avgRatio: 0 };
    }

    let origSum = 0;
    let compSum = 0;

    videos.forEach((v) => {
      origSum += parseFloat(v.originalSize) || 0;
      compSum += parseFloat(v.compressedSize) || 0;
    });

    const savedSum = Math.max(0, origSum - compSum);
    const avgRatio = origSum > 0 ? Math.round((savedSum / origSum) * 100) : 0;

    return {
      totalCount: videos.length,
      originalTotal: origSum,
      compressedTotal: compSum,
      savedTotal: savedSum,
      avgRatio,
    };
  }, [videos]);

  // Handle live search and sorting
  const filteredVideos = useMemo(() => {
    let result = [...videos];

    // Filter by query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.description?.toLowerCase().includes(query)
      );
    }

    // Sort by criteria
    if (sortBy === "date") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "savings") {
      result.sort((a, b) => {
        const savingsA = parseFloat(a.originalSize) - parseFloat(a.compressedSize);
        const savingsB = parseFloat(b.originalSize) - parseFloat(b.compressedSize);
        return savingsB - savingsA;
      });
    }

    return result;
  }, [videos, searchQuery, sortBy]);

  if (loading || !isUserLoaded) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10 animate-fade-in">
      {/* Workspace Greeting Header */}
      <div className="bg-base-200/50 border border-base-content/10 p-6 md:p-8 rounded-3xl backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-lg">
            <IconSparkles className="w-3.5 h-3.5 animate-pulse" />
            Active Console Workspace
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">
            Welcome back, {user?.firstName || "Creator"}!
          </h1>
          <p className="text-xs md:text-sm text-base-content/70 max-w-xl leading-relaxed">
            Monitor digital asset volume, run live AI transformations, adjust social presets, compress heavy video payloads, and manage PDF suites.
          </p>
        </div>

        <Link
          href="/video-share"
          className="btn btn-primary text-primary-content border-none shadow-lg shadow-primary/20 rounded-2xl px-5 py-3.5 flex items-center gap-2 self-start md:self-auto transition-all hover:scale-105 shrink-0"
        >
          <IconPlus className="w-4 h-4" />
          Compress New Video
        </Link>
      </div>

      {/* Stats Widgets Section */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Videos */}
        <div className="card bg-base-200 border border-base-content/10 rounded-2xl p-5 flex flex-row items-center justify-between shadow-xl">
          <div className="space-y-1.5">
            <span className="text-[10px] text-base-content/50 uppercase font-black tracking-wider block">Total Vault Videos</span>
            <span className="text-3xl font-black leading-none">{stats.totalCount}</span>
            <span className="text-[10px] text-base-content/40 block">Stored in active Postgres</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <IconVideo className="w-6 h-6" />
          </div>
        </div>

        {/* Space Saved */}
        <div className="card bg-base-200 border border-base-content/10 rounded-2xl p-5 flex flex-row items-center justify-between shadow-xl">
          <div className="space-y-1.5">
            <span className="text-[10px] text-base-content/50 uppercase font-black tracking-wider block">Storage Saved</span>
            <span className="text-3xl font-black leading-none">
              {stats.savedTotal > 0 ? filesize(stats.savedTotal, { round: 1 }) : "0.0 MB"}
            </span>
            <span className="text-[10px] text-base-content/40 block">From visual transcodes</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-inner">
            <IconDatabase className="w-6 h-6" />
          </div>
        </div>

        {/* Avg Compression Ratio */}
        <div className="card bg-base-200 border border-base-content/10 rounded-2xl p-5 flex flex-row items-center justify-between shadow-xl">
          <div className="space-y-1.5">
            <span className="text-[10px] text-base-content/50 uppercase font-black tracking-wider block">Average Savings Ratio</span>
            <span className="text-3xl font-black text-accent leading-none">{stats.avgRatio}%</span>
            <span className="text-[10px] text-base-content/40 block">Bandwidth conservation rate</span>
          </div>
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-base-content/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-accent"
                strokeDasharray={`${stats.avgRatio}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[10px] font-black text-accent">{stats.avgRatio}%</span>
          </div>
        </div>

        {/* Total Vault Usage */}
        <div className="card bg-base-200 border border-base-content/10 rounded-2xl p-5 flex flex-row items-center justify-between shadow-xl">
          <div className="space-y-1.5">
            <span className="text-[10px] text-base-content/50 uppercase font-black tracking-wider block">Vault Usage</span>
            <span className="text-3xl font-black leading-none">
              {stats.compressedTotal > 0 ? filesize(stats.compressedTotal, { round: 1 }) : "0.0 MB"}
            </span>
            <span className="text-[10px] text-base-content/40 block">Out of 5GB default cap</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-info/10 border border-info/20 flex items-center justify-center text-info shadow-inner">
            <IconPlus className="w-6 h-6 rotate-45 text-info" />
          </div>
        </div>
      </div>

      {/* Grid of Workspaces */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/50 pl-1">Workspace Hub</h3>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/social-share" className="group card bg-base-200 border border-base-content/10 hover:border-pink-500/35 p-5 rounded-2xl flex flex-col justify-between shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <IconPhoto className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-base-content flex items-center gap-1 group-hover:text-pink-400 transition-colors">
                  Social Share Studio
                  <IconArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-[11px] text-base-content/60 leading-normal mt-1">
                  Crop and transform graphics into optimal presets using face-aware gravity detection.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/ai-image" className="group card bg-base-200 border border-base-content/10 hover:border-emerald-500/35 p-5 rounded-2xl flex flex-col justify-between shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <IconSparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-base-content flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
                  AI Image Studio
                  <IconArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-[11px] text-base-content/60 leading-normal mt-1">
                  Erase object clusters, upscale to 4K, remove backgrounds, and compress formats dynamically.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/video-share" className="group card bg-base-200 border border-base-content/10 hover:border-indigo-500/35 p-5 rounded-2xl flex flex-col justify-between shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <IconVideo className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-base-content flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                  Video Compressor
                  <IconArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-[11px] text-base-content/60 leading-normal mt-1">
                  Resize, convert, and compress large media formats to under 70MB web envelopes.
                </p>
              </div>
            </div>
          </Link>

          <Link href="/pdf-suite" className="group card bg-base-200 border border-base-content/10 hover:border-purple-500/35 p-5 rounded-2xl flex flex-col justify-between shadow-md transition-all duration-300">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <IconFileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-base-content flex items-center gap-1 group-hover:text-purple-400 transition-colors">
                  Document PDF Suite
                  <IconArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <p className="text-[11px] text-base-content/60 leading-normal mt-1">
                  watermark pages, rotate sheets, extract sections, and compile multiple documents visually.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Library Visualizer Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-content/10 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-lg font-black tracking-tight">Media Library Vault</h3>
            <p className="text-xs text-base-content/50">Search, filter, download, and catalog compressed video assets.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="join border border-base-content/10 rounded-xl p-0.5 bg-base-200">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "join-item btn btn-xs px-2.5 rounded-lg border-none text-[10px] cursor-pointer",
                  viewMode === "grid" ? "bg-primary text-primary-content shadow-sm" : "bg-transparent text-base-content/50 hover:text-base-content"
                )}
                title="Grid view"
              >
                <IconLayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "join-item btn btn-xs px-2.5 rounded-lg border-none text-[10px] cursor-pointer",
                  viewMode === "list" ? "bg-primary text-primary-content shadow-sm" : "bg-transparent text-base-content/50 hover:text-base-content"
                )}
                title="List view"
              >
                <IconList className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sorting, Filtering and Upload Controls */}
        <div className="grid gap-4 md:grid-cols-12 items-center">
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/40 pointer-events-none">
              <IconSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search library assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-9 rounded-xl bg-base-200 border-base-content/10 text-base-content text-xs focus:border-primary focus:outline-none placeholder-base-content/30"
            />
          </div>

          {/* Sort Controller */}
          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-[10px] text-base-content/50 font-bold uppercase shrink-0">Sort By</span>
            <div className="join border border-base-content/10 rounded-xl p-0.5 bg-base-200 w-full justify-between">
              <button
                onClick={() => setSortBy("date")}
                className={cn(
                  "join-item btn btn-xs flex-1 rounded-lg border-none text-[10px] font-semibold transition-all cursor-pointer",
                  sortBy === "date" ? "bg-primary text-primary-content shadow-md" : "bg-transparent text-base-content/50 hover:text-base-content"
                )}
              >
                Date Created
              </button>
              <button
                onClick={() => setSortBy("savings")}
                className={cn(
                  "join-item btn btn-xs flex-1 rounded-lg border-none text-[10px] font-semibold transition-all cursor-pointer",
                  sortBy === "savings" ? "bg-primary text-primary-content shadow-md" : "bg-transparent text-base-content/50 hover:text-base-content"
                )}
              >
                Storage Saved
              </button>
            </div>
          </div>

          {/* Drag & Drop Dragzone Status / Active progress */}
          <div className="md:col-span-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-2xl flex items-center justify-center px-4 py-2 transition-all text-xs h-10 select-none",
                isDragOver ? "border-primary bg-primary/5 text-primary scale-[1.02]" : "border-base-content/10 bg-base-200/50 text-base-content/50",
                isUploading && "border-solid border-primary bg-primary/5 text-primary"
              )}
            >
              {isUploading ? (
                <div className="flex items-center gap-2.5 w-full">
                  <span className="loading loading-spinner loading-xs text-primary shrink-0"></span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between font-bold text-[10px] mb-0.5">
                      <span>Uploading/Compressing...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <progress className="progress progress-primary w-full h-1 bg-base-300" value={uploadProgress} max="100"></progress>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-semibold text-[10px] text-center w-full justify-center">
                  <IconCloudUpload className="w-4 h-4 shrink-0 text-primary animate-bounce" />
                  <span>Drag & Drop video file here to quick-upload</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Card Grid or List table */}
        {filteredVideos.length === 0 ? (
          <div className="card bg-base-200 border border-base-content/10 p-16 text-center rounded-2xl transition-all">
            <div className="flex flex-col items-center gap-4 text-base-content/40 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center border border-base-content/10">
                <IconVideo className="w-8 h-8 opacity-60" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base-content text-sm">
                  {searchQuery.trim() ? "No matching files" : "Your video library vault is empty"}
                </h3>
                <p className="text-xs text-base-content/50 leading-normal">
                  {searchQuery.trim()
                    ? "Try checking your query keywords or adjusting sorting filters."
                    : "Drag-and-drop a video above or enter the Video Compressor workspace to transcode assets."}
                </p>
              </div>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          /* High-Fidelity Video Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
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
          /* Table List View */
          <div className="overflow-x-auto bg-base-200 border border-base-content/10 rounded-2xl shadow-xl">
            <table className="table table-md w-full text-xs">
              <thead>
                <tr className="border-b border-base-content/10 text-base-content/50 text-[10px] uppercase tracking-wider font-extrabold bg-base-300/40">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Original Size</th>
                  <th className="py-3 px-4">Compressed Size</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Savings Ratio</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-content/5">
                {filteredVideos.map((video) => {
                  const savings = Math.round(
                    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
                  );
                  const minutes = Math.floor(video.duration / 60);
                  const seconds = Math.round(video.duration % 60);
                  const durationStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

                  return (
                    <tr key={video.id} className="hover:bg-base-100/50 transition-colors">
                      <td className="py-3 px-4 font-bold max-w-xs truncate">
                        <div>
                          <p className="truncate text-base-content font-bold">{video.title}</p>
                          <p className="text-[10px] text-base-content/40 truncate mt-0.5">{video.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-base-content/70">
                        {filesize(Number(video.originalSize), { round: 1 })}
                      </td>
                      <td className="py-3 px-4 font-mono text-primary font-bold">
                        {filesize(Number(video.compressedSize), { round: 1 })}
                      </td>
                      <td className="py-3 px-4 font-mono text-base-content/60">{durationStr}</td>
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
  );
}
