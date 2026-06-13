"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconGitMerge,
  IconRotate,
  IconAward,
  IconDatabase,
  IconLayoutGrid,
  IconExchange,
} from "@tabler/icons-react";
import { toast } from "@/app/store/Toast";
import { cn } from "@/app/lib/utils";

// Subcomponents
import PdfMerge from "./components/PdfMerge";
import PdfRotate from "./components/PdfRotate";
import PdfWatermark from "./components/PdfWatermark";
import PdfOptimize from "./components/PdfOptimize";
import PdfPages from "./components/PdfPages";
import PdfConverter from "./components/PdfConverter";

type TabType = "merge" | "rotate" | "watermark" | "optimize" | "pages" | "converter";

export default function PDFSuite() {
  const [activeTab, setActiveTab] = useState<TabType>("merge");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDownload = (url: string, filename: string) => {
    toast("Downloading PDF document...", "info");
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const localUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = localUrl;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(localUrl);
        toast("Download finished!", "success");
      })
      .catch((error) => {
        console.error("Direct download failed, opening in new tab:", error);
        window.open(url, "_blank");
      });
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "merge", label: "Merge PDFs", icon: <IconGitMerge className="w-5 h-5" />, desc: "Combine multiple PDF files into one" },
    { id: "rotate", label: "Rotate PDF", icon: <IconRotate className="w-5 h-5" />, desc: "Rotate all pages clockwise" },
    { id: "watermark", label: "Watermark", icon: <IconAward className="w-5 h-5" />, desc: "Stamp watermark overlays" },
    { id: "optimize", label: "Optimize Size", icon: <IconDatabase className="w-5 h-5" />, desc: "Compress document data" },
    { id: "pages", label: "Page Manager", icon: <IconLayoutGrid className="w-5 h-5" />, desc: "Extract or remove visual sheets" },
    { id: "converter", label: "Format Converter", icon: <IconExchange className="w-5 h-5" />, desc: "Rasterize PDF / compile images" },
  ];

  return (
    <div className="space-y-6 pb-10 animate-fade-in">
      <div className="grid gap-6 lg:grid-cols-12 items-stretch min-h-[70vh]">
        {/* Navigation Tabs - Left Pane (lg:col-span-3) */}
        <div className="lg:col-span-3 flex flex-col gap-2 bg-base-200 p-4 border border-base-content/10 rounded-2xl shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 px-3 mb-1">
            PDF Operations
          </span>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrorMsg(null);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer text-xs font-semibold",
                  isActive
                    ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                    : "text-base-content/75 hover:bg-base-300 hover:text-base-content"
                )}
              >
                {tab.icon}
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Workspace Operations Panel - Right Pane (lg:col-span-9) */}
        <div className="lg:col-span-9 flex flex-col justify-between bg-base-200 border border-base-content/10 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-xl min-h-[500px]">
          <div className="space-y-6">
            {/* Header info */}
            <div className="border-b border-base-content/5 pb-4">
              <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
                {tabs.find((t) => t.id === activeTab)?.icon}
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-base-content/55 mt-0.5 font-semibold">
                {tabs.find((t) => t.id === activeTab)?.desc}. Secure serverless compilation.
              </p>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="alert alert-error text-xs rounded-xl py-2.5 px-4 shadow-sm text-error-content bg-error/15 border border-error/20">
                <span>{errorMsg}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {activeTab === "merge" && (
                  <PdfMerge
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    setErrorMsg={setErrorMsg}
                    handleDownload={handleDownload}
                  />
                )}

                {activeTab === "rotate" && (
                  <PdfRotate
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    setErrorMsg={setErrorMsg}
                    handleDownload={handleDownload}
                  />
                )}

                {activeTab === "watermark" && (
                  <PdfWatermark
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    setErrorMsg={setErrorMsg}
                    handleDownload={handleDownload}
                  />
                )}

                {activeTab === "optimize" && (
                  <PdfOptimize
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    setErrorMsg={setErrorMsg}
                    handleDownload={handleDownload}
                  />
                )}

                {activeTab === "pages" && (
                  <PdfPages
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    setErrorMsg={setErrorMsg}
                    handleDownload={handleDownload}
                  />
                )}

                {activeTab === "converter" && (
                  <PdfConverter
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    setErrorMsg={setErrorMsg}
                    handleDownload={handleDownload}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
