"use client";

import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { IconShieldLock, IconEye, IconLock, IconFolderOpen } from "@tabler/icons-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-base-300 text-base-content relative overflow-x-hidden transition-colors duration-300 flex flex-col justify-between">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-120 h-120 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Global Navbar Header */}
      <Header />

      {/* Main Content Container */}
      <main className="flex-grow max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10 w-full">
        <div className="space-y-8">
          
          {/* Page Title & Last Updated */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-lg">
              <IconShieldLock className="w-3.5 h-3.5" />
              Legal & Privacy Workspace
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-base-content/50 font-semibold uppercase tracking-wider font-mono">
              Last Updated: June 13, 2026
            </p>
          </div>

          {/* Intro description */}
          <p className="text-xs md:text-sm text-base-content/75 leading-relaxed bg-base-200/50 p-4 border border-base-content/10 rounded-2xl backdrop-blur-sm">
            At Cosmica, your digital privacy is of paramount importance to us. This Privacy Policy details how we collect, process, secure, and manage your data, media assets, and authentication credentials when using the Cosmica AI Studio.
          </p>

          <div className="divider opacity-10"></div>

          {/* Content Sections */}
          <div className="space-y-8 text-xs md:text-sm text-base-content/80 leading-relaxed font-medium">
            
            {/* Section 1 */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-base-content flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold shrink-0">1</span>
                Information We Collect
              </h2>
              <p>
                To provide our suite of media transform tools, Cosmica collects and processes the following parameters:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 font-semibold">
                <li>
                  <span className="text-base-content">Account & Profile Metadata</span>: Managed securely through Clerk authentication (emails, usernames, and profile photos).
                </li>
                <li>
                  <span className="text-base-content">Digital Assets (Media Files)</span>: Images and videos uploaded to our sandbox workspace are temporarily uploaded to Cloudinary for transformation and compression pipelines.
                </li>
                <li>
                  <span className="text-base-content">Telemetry & Analytical Logs</span>: System performance parameters, resolution sizing records, and browser details to improve engine throughput.
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-base-content flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold shrink-0">2</span>
                How We Process Your Assets
              </h2>
              <p>
                When you perform transformations (like background removal, upscaling, or merging PDFs), our backend coordinates eager transformations through third-party media infrastructure providers (e.g. Cloudinary).
              </p>
              <p>
                Your assets are stored temporarily and are subjected to automated lifecycle policies. We do not sell, inspect, or manually monitor your raw uploaded media contents.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-base-content flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold shrink-0">3</span>
                Security and Data Isolation
              </h2>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-base-content/10 flex gap-3.5 items-start">
                <IconLock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs">
                  We utilize enterprise-grade security layers, TLS encryption protocols for all assets in transit, and isolate database transactions securely using Prisma ORM adapters. Clerk-validated tokens block unauthorized API access requests to your personal library vault.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-base-content flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold shrink-0">4</span>
                Cookies & Persistent LocalStorage
              </h2>
              <p>
                Cosmica uses basic browser session cookies and local storage tokens to store workspace preferences (like active themes, visual layout presets, and command palette keys). No marketing or advertising tracker cookies are served.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-base-content flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold shrink-0">5</span>
                Contact Legal Team
              </h2>
              <p>
                For any concerns, data deletion requests, or questions regarding our privacy sandbox, please reach out to the workspace administrators at <span className="text-primary hover:underline">privacy@cosmica.ai</span>.
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
