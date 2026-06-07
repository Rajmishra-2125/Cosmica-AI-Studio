"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
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
} from "@tabler/icons-react";
import VideoCard from "@/generated/VideoCard";
import Loader from "@/components/ui/Loader";
import Link from "next/link";

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
      })
      .catch((error) => {
        console.error("Direct download failed, opening in new tab:", error);
        const link = document.createElement("a");
        link.href = urlString;
        link.setAttribute("target", "_blank");
        link.click();
      });
  }, []);

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
    return <Loader />;
  }

  return (
    <div className="space-y-12 pb-16 animate-fade-in">
      {/* Greetings Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
            <IconSparkles className="w-4 h-4 text-primary animate-pulse" />
            Digital Hub Unified Workspace
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-base-content">
            Welcome back, {user?.firstName || "Creator"}!
          </h1>
          <p className="text-base-content/75 text-sm md:text-base max-w-2xl leading-relaxed">
            Your centralized control console. Monitor asset volume, run AI transformations, crop social layouts, transcode video packets, and manage PDF documents.
          </p>
        </div>

        <Link
          href="/video-share"
          className="btn btn-primary text-primary-content border-none shadow-lg shadow-primary/20 rounded-xl px-5 py-3.5 flex items-center gap-2 self-start md:self-auto transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <IconPlus className="w-4 h-4" />
          New Video Upload
        </Link>
      </div>

      {/* Dynamic Workspace Capabilities & Feature Map */}
      <div className="space-y-6">
        <div className="border-b border-base-content/5 pb-3">
          <h3 className="text-lg font-bold text-base-content uppercase tracking-wider flex items-center gap-2">
            <IconCpu className="w-5 h-5 text-secondary" />
            Studio Core Workspaces & Capabilities
          </h3>
          <p className="text-xs text-base-content/50 mt-1 leading-normal">
            Explore the advanced multi-media management suites built into the Cosmica SaaS engine.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Social Share Studio */}
          <motion.div
            whileHover={{ y: -4 }}
            className="card bg-base-200 border border-base-content/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shadow-inner">
                <IconPhoto className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-base-content">🖼️ AI Social Share Studio</h4>
                <p className="text-xs text-base-content/60 leading-relaxed">
                  Upload raw canvas images and automatically crop them into matching social presets (Instagram portrait, Facebook cover, Twitter header) utilizing dynamic asset parameters.
                </p>
              </div>
              <ul className="space-y-1 text-[10px] text-base-content/50 list-disc list-inside">
                <li>AI content-aware crop positioning</li>
                <li>Signed secure CDN asset delivery</li>
                <li>Immediate, high-res local downloads</li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                href="/social-share"
                className="btn btn-outline btn-xs border-base-content/10 hover:bg-base-300 hover:text-base-content rounded-lg w-full text-[11px]"
              >
                Enter Social Studio
              </Link>
            </div>
          </motion.div>

          {/* Card 2: AI Image Studio */}
          <motion.div
            whileHover={{ y: -4 }}
            className="card bg-base-200 border border-base-content/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                <IconSparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-base-content">🔮 AI Image Studio</h4>
                <p className="text-xs text-base-content/60 leading-relaxed">
                  Leverage advanced Cloudinary AI parameters to instantly strip backgrounds, remove unwanted objects via prompt inputs, and upscale images.
                </p>
              </div>
              <ul className="space-y-1 text-[10px] text-base-content/50 list-disc list-inside">
                <li>Smart background removal engine</li>
                <li>Generative fill object removal</li>
                <li>AI super-resolution upscaler</li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                href="/ai-image"
                className="btn btn-outline btn-xs border-base-content/10 hover:bg-base-300 hover:text-base-content rounded-lg w-full text-[11px]"
              >
                Enter AI Image Studio
              </Link>
            </div>
          </motion.div>

          {/* Card 3: Video Compressor Hub */}
          <motion.div
            whileHover={{ y: -4 }}
            className="card bg-base-200 border border-base-content/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                <IconVideo className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-base-content">📹 Video Compressor Hub</h4>
                <p className="text-xs text-base-content/60 leading-relaxed">
                  Transcode and compress heavy video files up to 70MB. Leverage optimized codec profiles to drop file sizes by up to 80% while keeping visual details sharp.
                </p>
              </div>
              <ul className="space-y-1 text-[10px] text-base-content/50 list-disc list-inside">
                <li>Automatic format conversion (MP4)</li>
                <li>Interactive progress bar tracker</li>
                <li>Comprehensive compression metrics card</li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                href="/video-share"
                className="btn btn-outline btn-xs border-base-content/10 hover:bg-base-300 hover:text-base-content rounded-lg w-full text-[11px]"
              >
                Enter Video Compressor
              </Link>
            </div>
          </motion.div>

          {/* Card 4: Document PDF Suite */}
          <motion.div
            whileHover={{ y: -4 }}
            className="card bg-base-200 border border-base-content/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
                <IconFileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-base-content">📄 Document PDF Suite</h4>
                <p className="text-xs text-base-content/60 leading-relaxed">
                  Consolidate, crop, merge, rotate, and stamp watermark overlays on PDF documents in the backend. Seamlessly integrated into serverless API endpoint paths.
                </p>
              </div>
              <ul className="space-y-1 text-[10px] text-base-content/50 list-disc list-inside">
                <li>Multi-document sequential merges</li>
                <li>Secure metadata and EXIF stripping</li>
                <li>Page rotations and visual watermark overlays</li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                href="/pdf-suite"
                className="btn btn-outline btn-xs border-base-content/10 hover:bg-base-300 hover:text-base-content rounded-lg w-full text-[11px]"
              >
                Enter PDF Suite
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Metrics Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Assets */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="card bg-base-200 border border-base-content/10 rounded-2xl p-6 flex flex-row items-center gap-5 shadow-xl transition-colors duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <IconVideo className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-base-content/50 block uppercase font-bold tracking-wider">Total Videos</span>
            <span className="text-2xl font-extrabold text-base-content leading-tight">{stats.totalCount}</span>
          </div>
        </motion.div>

        {/* Space Saved */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="card bg-base-200 border border-base-content/10 rounded-2xl p-6 flex flex-row items-center gap-5 shadow-xl transition-colors duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-inner">
            <IconDatabase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-base-content/50 block uppercase font-bold tracking-wider">Storage Saved</span>
            <span className="text-2xl font-extrabold text-base-content leading-tight">
              {stats.savedTotal > 0 ? filesize(stats.savedTotal, { round: 1 }) : "0.0 MB"}
            </span>
          </div>
        </motion.div>

        {/* Compression Efficiency */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="card bg-base-200 border border-base-content/10 rounded-2xl p-6 flex flex-row items-center gap-5 shadow-xl transition-colors duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-inner">
            <IconPercentage className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-base-content/50 block uppercase font-bold tracking-wider">Avg Savings</span>
            <span className="text-2xl font-extrabold text-accent leading-tight">
              {stats.avgRatio}%
            </span>
          </div>
        </motion.div>

        {/* Compressed Size */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="card bg-base-200 border border-base-content/10 rounded-2xl p-6 flex flex-row items-center gap-5 shadow-xl transition-colors duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-info/10 border border-info/20 flex items-center justify-center text-info shadow-inner">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
          </div>
          <div>
            <span className="text-[10px] text-base-content/50 block uppercase font-bold tracking-wider">Vault Usage</span>
            <span className="text-2xl font-extrabold text-base-content leading-tight">
              {stats.compressedTotal > 0 ? filesize(stats.compressedTotal, { round: 1 }) : "0.0 MB"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Library Visualizer Portal */}
      <div className="space-y-6">
        <div className="border-b border-base-content/5 pb-3">
          <h3 className="text-lg font-bold text-base-content uppercase tracking-wider flex items-center gap-2">
            <IconVideo className="w-5 h-5 text-indigo-400" />
            Media Vault Library
          </h3>
          <p className="text-xs text-base-content/50 mt-1 leading-normal">
            Locate, search, sort, and download processed video assets stored in the database.
          </p>
        </div>

        {/* Sorting, Filtering and Live Search bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-200/50 border border-base-content/10 backdrop-blur-sm p-4 rounded-2xl transition-colors duration-300">
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-base-content/50 pointer-events-none">
              <IconSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search library assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-10 rounded-xl bg-base-100 border-base-content/10 text-base-content text-sm focus:border-primary focus:outline-none placeholder-base-content/30"
            />
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-base-content/50 font-semibold uppercase">Sort By</span>
            <div className="join border border-base-content/10 rounded-xl p-0.5 bg-base-100/40">
              <button
                onClick={() => setSortBy("date")}
                className={`join-item btn btn-xs px-3 rounded-lg border-none text-[11px] font-semibold transition-all cursor-pointer ${
                  sortBy === "date" ? "bg-primary text-primary-content shadow-md" : "bg-transparent text-base-content/50 hover:text-base-content"
                }`}
              >
                Date Created
              </button>
              <button
                onClick={() => setSortBy("savings")}
                className={`join-item btn btn-xs px-3 rounded-lg border-none text-[11px] font-semibold transition-all cursor-pointer ${
                  sortBy === "savings" ? "bg-primary text-primary-content shadow-md" : "bg-transparent text-base-content/50 hover:text-base-content"
                }`}
              >
                Storage Saved
              </button>
            </div>
          </div>
        </div>

        {/* Video Card Grid */}
        {filteredVideos.length === 0 ? (
          /* Empty Search or Empty Library placeholder */
          <div className="card bg-base-200/50 border border-base-content/10 p-16 text-center rounded-2xl transition-colors duration-300">
            <div className="flex flex-col items-center gap-4 text-base-content/40 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center border border-base-content/10">
                <IconVideo className="w-8 h-8 opacity-60" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base-content text-base">
                  {searchQuery.trim() ? "No search results match" : "No compressed assets inside library"}
                </h3>
                <p className="text-xs text-base-content/50 leading-normal">
                  {searchQuery.trim()
                    ? "Try adjusting your search terms or query filters."
                    : "Instantly upload a video file to run optimized transcodes."}
                </p>
              </div>
              {!searchQuery.trim() && (
                <Link
                  href="/video-share"
                  className="btn btn-outline btn-sm border-base-content/10 hover:bg-base-300 hover:text-base-content rounded-xl mt-2 px-5 py-2 flex items-center gap-1.5"
                >
                  <IconPlus className="w-3.5 h-3.5" />
                  Compress First Video
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* High-Fidelity Video Cards Grid */
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
        )}
      </div>
    </div>
  );
}
