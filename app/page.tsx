'use client'
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Home from "@/app/(app)/home/page";
import Headers from "@/app/components/Header"
import Footer from "@/app/components/Footer"

//
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




export default function LandingPage() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      router.replace("/home");
    }
  }, [router]);
  return (
    <div>
      <Headers />
      <div className=" m-24">
         <div className="space-y-12 pb-16 animate-fade-in">
      {/* Greetings Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary uppercase">
            <IconSparkles className="w-4 h-4 text-primary animate-pulse" />
            Digital Hub Unified Workspace
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-base-content">
            Welcome back, "Creator"!
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
            <span className="text-2xl font-extrabold text-base-content leading-tight">{0}</span>
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
              : "0.0 MB"
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
          <div className="dark:text-white text-black">
            <span className="text-[10px] text-base-content/50 block uppercase font-bold tracking-wider">Avg Savings</span>
            <span className="text-2xl font-extrabold text-accent leading-tight">
              0%
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
              0.0 MB
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

        </div>

      </div>
      <Footer />
    </div>
    </div>
  )
}

