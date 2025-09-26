// apps/frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./styles/globals.css";
import React from "react";
import { Inter } from "next/font/google";

import BackgroundParticles from "@components/BackgroundParticles";
import OfflineManager from "@components/OfflineManager";
import MobileNav from "@components/MobileNav";
import SidebarNav from "@components/SidebarNav";
import { navItems } from "./config/navItems";

import NextAuthSessionProvider from "./providers/SessionProvider";
import ProductionErrorBoundary from "./components/ProductionErrorBoundary";
import PrivacyNotice from "./components/PrivacyNotice";
import MobileInstallPrompter from "./components/MobileInstallPrompter";
import PWAServiceWorker from "./components/PWAServiceWorker";
import iOSInterface from "./components/iOSInterface";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sports Central - Live Sports Predictions, Scores & Community",
  description:
    "Free AI-powered sports predictions for NFL, NBA, MLB, Soccer. Live scores, interactive quizzes, community forum, and earn Pi coins. Join 1000+ sports fans!",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://flashstudy-ri0g.onrender.com" />
        <link rel="dns-prefetch" href="https://flashstudy-ri0g.onrender.com" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00ff88" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="SportsApp" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="relative flex sports">
        <NextAuthSessionProvider>
          <ProductionErrorBoundary>
            <iOSInterface showStatusBar enableHapticFeedback>
              <React.Suspense fallback={null}>
                <BackgroundParticles />
              </React.Suspense>

              <OfflineManager>
                {/* Sidebar for desktop */}
                <React.Suspense fallback={null}>
                  <SidebarNav items={navItems} />
                </React.Suspense>

                {/* Main content area */}
                <div className="flex-1 min-h-screen flex flex-col">
                  {children}

                  {/* Mobile nav (always visible at bottom on small screens) */}
                  <React.Suspense fallback={null}>
                    <MobileNav items={navItems} />
                  </React.Suspense>
                </div>
              </OfflineManager>

              <MobileInstallPrompter />
              <PWAServiceWorker />
            </iOSInterface>
          </ProductionErrorBoundary>
        </NextAuthSessionProvider>
        <PrivacyNotice />
      </body>
    </html>
  );
}