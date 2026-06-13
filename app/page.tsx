"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { motion } from "motion/react";
import {
  IconSparkles,
  IconVideo,
  IconDatabase,
  IconPercentage,
  IconPlus,
  IconPhoto,
  IconFileText,
  IconCpu,
  IconArrowRight,
  IconChevronRight,
  IconShieldLock,
} from "@tabler/icons-react";
import Loader from "@/components/ui/Loader";
import Link from "next/link";

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // Redirect authenticated users immediately to /home
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/home");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-base-300">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300 text-base-content relative overflow-x-hidden transition-colors duration-300 flex flex-col justify-between">
      {/* Dynamic Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-28 relative z-10 space-y-24">
        {/* Hero Banner Section */}
        <div className="text-center max-w-4xl mx-auto space-y-8 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider"
          >
            <IconSparkles className="w-3.5 h-3.5 animate-pulse" />
            Next-Generation Media Management
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-none"
          >
            Your Complete Media{" "}
            <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Creative Studio
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-lg text-base-content/75 leading-relaxed max-w-2xl mx-auto"
          >
            A high-performance SaaS engine for creators and developers. Automatically crop social assets, optimize heavy video payloads, process PDF structures, and apply advanced AI filters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/home"
              className="btn btn-primary text-primary-content border-none shadow-lg shadow-primary/25 rounded-2xl px-8 py-4 flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105"
            >
              Get Started for Free
              <IconArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#workspaces"
              className="btn btn-outline border-base-content/10 hover:bg-base-200 rounded-2xl px-8 py-4 flex items-center gap-2 cursor-pointer text-base-content"
            >
              Explore Features
            </a>
          </motion.div>
        </div>

        {/* Feature Workspace Map Grid */}
        <div id="workspaces" className="space-y-8 scroll-mt-24">
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Integrated Core Workspaces</h2>
            <p className="text-xs sm:text-sm text-base-content/60 leading-normal">
              Explore the five advanced media suites engineered into Cosmica.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Social Share */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card bg-base-200 border border-base-content/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                  <IconPhoto className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base text-base-content">Social Share Studio</h4>
                  <p className="text-xs text-base-content/60 leading-relaxed">
                    Upload images and crop them into exact social dimensions (Instagram, X, Facebook) using content-aware gravity focus.
                  </p>
                </div>
                <ul className="space-y-1.5 text-[10px] text-base-content/50 font-semibold">
                  <li className="flex items-center gap-1.5">
                    <IconChevronRight className="w-3 h-3 text-pink-400" /> Auto Face Gravity
                  </li>
                  <li className="flex items-center gap-1.5">
                    <IconChevronRight className="w-3 h-3 text-pink-400" /> Presets list (1:1, 16:9, 3:1)
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  href="/social-share"
                  className="btn btn-outline btn-sm border-base-content/10 hover:bg-base-300 rounded-xl w-full text-[11px]"
                >
                  Enter Studio
                </Link>
              </div>
            </motion.div>

            {/* Card 2: AI Image */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card bg-base-200 border border-base-content/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <IconSparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base text-base-content">AI Image Workspace</h4>
                  <p className="text-xs text-base-content/60 leading-relaxed">
                    Strip background layers, erase objects with natural prompts, upscale pixels to 4K, and optimize compression settings.
                  </p>
                </div>
                <ul className="space-y-1.5 text-[10px] text-base-content/50 font-semibold">
                  <li className="flex items-center gap-1.5">
                    <IconChevronRight className="w-3 h-3 text-emerald-400" /> AI Background Eraser
                  </li>
                  <li className="flex items-center gap-1.5">
                    <IconChevronRight className="w-3 h-3 text-emerald-400" /> 4K Super-Resolution
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  href="/ai-image"
                  className="btn btn-outline btn-sm border-base-content/10 hover:bg-base-300 rounded-xl w-full text-[11px]"
                >
                  Enter AI Workspace
                </Link>
              </div>
            </motion.div>

            {/* Card 3: Video Compressor */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card bg-base-200 border border-base-content/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <IconVideo className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base text-base-content">Video Compressor</h4>
                  <p className="text-xs text-base-content/60 leading-relaxed">
                    Compress and transcode video payloads up to 70MB. Shrink file sizes by up to 80% with codec preservation.
                  </p>
                </div>
                <ul className="space-y-1.5 text-[10px] text-base-content/50 font-semibold">
                  <li className="flex items-center gap-1.5">
                    <IconChevronRight className="w-3 h-3 text-indigo-400" /> Balanced quality codecs
                  </li>
                  <li className="flex items-center gap-1.5">
                    <IconChevronRight className="w-3 h-3 text-indigo-400" /> Live compression statistics
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  href="/video-share"
                  className="btn btn-outline btn-sm border-base-content/10 hover:bg-base-300 rounded-xl w-full text-[11px]"
                >
                  Enter Compressor
                </Link>
              </div>
            </motion.div>

            {/* Card 4: PDF Suite */}
            <motion.div
              whileHover={{ y: -5 }}
              className="card bg-base-200 border border-base-content/10 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <IconFileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base text-base-content">Document PDF Suite</h4>
                  <p className="text-xs text-base-content/60 leading-relaxed">
                    Merge files, rotate pages, remove/extract sections, and watermark documents visually with Cloudinary rendering.
                  </p>
                </div>
                <ul className="space-y-1.5 text-[10px] text-base-content/50 font-semibold">
                  <li className="flex items-center gap-1.5">
                    <IconChevronRight className="w-3 h-3 text-purple-400" /> Visual Page Editor Grid
                  </li>
                  <li className="flex items-center gap-1.5">
                    <IconChevronRight className="w-3 h-3 text-purple-400" /> Custom Watermark overlays
                  </li>
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  href="/pdf-suite"
                  className="btn btn-outline btn-sm border-base-content/10 hover:bg-base-300 rounded-xl w-full text-[11px]"
                >
                  Enter PDF Suite
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Security / Technology Showcase Section */}
        <div className="grid gap-10 md:grid-cols-2 items-center bg-base-200/55 border border-base-content/10 rounded-3xl p-8 md:p-12">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <IconShieldLock className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-black tracking-tight text-base-content">
              Enterprise Route Security & Infrastructure
            </h3>
            <p className="text-sm text-base-content/75 leading-relaxed">
              Cosmica is backed by Clerk NextJS token routing, ensuring strict protection of your media workspaces and API requests. The core database operates via Neon Serverless Postgres, providing blazing-fast query speeds and high durability.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {["Clerk Security", "Serverless Neon", "Prisma pg", "Cloudinary CDN"].map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold uppercase tracking-wider bg-base-300/80 border border-base-content/10 text-base-content/75 rounded-lg px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-square bg-linear-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full border border-base-content/10 flex items-center justify-center overflow-hidden">
              <div className="absolute w-[80%] h-[80%] rounded-full border border-dashed border-base-content/10 animate-spin-around --speed:60s"></div>
              <div className="absolute w-[60%] h-[60%] rounded-full bg-base-200 flex items-center justify-center border border-base-content/5 shadow-2xl">
                <IconCpu className="w-16 h-16 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
