"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import Sidebar from "../components/Sidebar";
import Toaster from "@/components/ui/Toaster";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const getBreadcrumbName = (path: string) => {
    switch (path) {
      case "/home":
        return "Media Library Vault";
      case "/social-share":
        return "AI Social Share Studio";
      case "/ai-image":
        return "AI Image Transform Studio";
      case "/video-share":
        return "Video Compressor Hub";
      case "/pdf-suite":
        return "Document PDF Suite";
      case "/image-convert":
        return "Image Format Converter";
      default:
        return path.replace(/^\//, "").split("/")[0]?.replace("-", " ") || "Dashboard";
    }
  };

  return (
    <div className={cn(inter.className, "min-h-screen flex bg-base-300 text-base-content relative overflow-hidden transition-colors duration-300")}>
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>

      {/* Premium Sidebar Component */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header bar with dynamic breadcrumbs (padded on mobile due to absolute mobile header) */}
        <header className="h-16 border-b border-base-content/10 bg-base-200/50 backdrop-blur-md flex items-center justify-between px-6 z-20 shrink-0 mt-16 md:mt-0 transition-colors">
          {/* Breadcrumb Indicators */}
          <div className="flex items-center gap-2 text-xs font-semibold text-base-content/50 uppercase tracking-wider">
            <span>Cosmica Workspace</span>
            <span className="opacity-40 font-mono">/</span>
            <span className="text-primary font-bold">{getBreadcrumbName(pathname)}</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-[10px] bg-base-100 border border-base-content/10 rounded-md px-1.5 py-0.5 font-bold tracking-wider uppercase text-base-content/40">
              Cloudinary Sandbox
            </span>
          </div>
        </header>

        {/* Dynamic Studio Workspace Scroll Port */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-8 relative z-10">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  );
}
