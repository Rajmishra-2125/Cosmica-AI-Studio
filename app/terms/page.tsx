"use client";

import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { IconFileText, IconAlertCircle, IconChecklist, IconShield } from "@tabler/icons-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-base-300 text-base-content relative overflow-x-hidden transition-colors duration-300 flex flex-col justify-between">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-120 h-120 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none"></div>

      {/* Global Navbar Header */}
      <Header />

      {/* Main Content Container */}
      <main className="grow max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10 w-full">
        <div className="space-y-8">
          
          {/* Page Title & Last Updated */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-lg">
              <IconFileText className="w-3.5 h-3.5" />
              Platform Policy Agreements
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-base-content/50 font-semibold uppercase tracking-wider font-mono">
              Last Updated: June 13, 2026
            </p>
          </div>

          {/* Intro description */}
          <p className="text-xs md:text-sm text-base-content/75 leading-relaxed bg-base-200/50 p-4 border border-base-content/10 rounded-2xl backdrop-blur-sm">
            Welcome to Cosmica AI Studio. By registering an account, mounting your media library vault, or using our automated AI tools, you agree to comply with and be bound by the following Terms of Service.
          </p>

          <div className="divider opacity-10"></div>

          {/* Content Sections */}
          <div className="space-y-8 text-xs md:text-sm text-base-content/80 leading-relaxed font-medium">
            
            {/* Section 1 */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-base-content flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold shrink-0">1</span>
                Acceptance & Workspace Account
              </h2>
              <p>
                To utilize our tools, you must authenticate securely via Clerk. You are solely responsible for maintaining the confidentiality of your session tokens, API keys, and database connections. You must immediately notify Cosmica of any unauthorized usage of your account.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-base-content flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold shrink-0">2</span>
                Acceptable Use & Sizing Limits
              </h2>
              <p>
                You agree to respect the physical limits defined by our serverless stack constraints:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 font-semibold">
                <li>
                  <span className="text-base-content">Image Assets</span>: Limited to a maximum of 10MB per upload.
                </li>
                <li>
                  <span className="text-base-content">Video Assets</span>: Limited to a maximum of 70MB per upload for active video compression pipelines.
                </li>
                <li>
                  <span className="text-base-content">No Malicious Payloads</span>: You must not upload viruses, trojans, corrupt document packages, or use our API endpoints for denial-of-service attempts.
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-base-content flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold shrink-0">3</span>
                Intellectual Property & Media Rights
              </h2>
              <p>
                Cosmica makes no claims of ownership over the content you upload, compile, or transform. All copyrights, metadata, and visual ownership rights remain with you.
              </p>
              <p>
                By uploading assets, you grant Cosmica a temporary, non-exclusive license only to store, optimize, and perform requested operations (e.g. upscaling or compressing) to complete your user actions.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-base-content flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold shrink-0">4</span>
                Service Provision and Disclaimers
              </h2>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-base-content/10 flex gap-3.5 items-start">
                <IconAlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs">
                  The media engines are provided "as is" and "as available". While we utilize Cloudinary's dynamic CDN infrastructure to guarantee high-performance, we do not warrant that transformations will be completely error-free or that the servers will never experience downtime.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-base-content flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold shrink-0">5</span>
                Termination of Service
              </h2>
              <p>
                We reserve the right to suspend or block access to Cosmica AI Studio APIs for users found abusing limits, hacking authentication layers, or violating standard laws in their respective jurisdictions.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-base-content flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-bold shrink-0">6</span>
                Modifications to Terms
              </h2>
              <p>
                Cosmica may update these terms as new AI models, billing cycles, or pipeline components are introduced. Continued usage of the workspace after changes indicates acceptance of the revised agreements.
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
