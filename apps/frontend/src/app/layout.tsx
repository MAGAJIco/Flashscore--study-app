import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { KidsModeProvider } from "../context/KidsModeContext";
import { UserPreferencesProvider } from "./providers/UserPreferencesProvider";
import "./styles/globals.css";
import type { Metadata } from "next";
import PWAServiceWorker from "./components/PWAServiceWorker";
import PushNotificationManager from "./components/PushNotificationManager";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import MobilePerformanceOptimizer from "./components/MobilePerformanceOptimizer";

export const viewport = {
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: "Sports Central",
  description: "Your complete sports prediction and live scores platform",
  applicationName: "Sports Central",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sports Central",
  },
  icons: {
    icon: [
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport = {
  themeColor: "#00ff88",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: { locale?: string };
}) {
  const messages = await getMessages();
  const locale = params?.locale || "en";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://api.sportsdata.io" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
      </head>
      <body className="sports">
        <PWAServiceWorker />
        <PushNotificationManager />
        {children}
      </body>
    </html>
  );
}