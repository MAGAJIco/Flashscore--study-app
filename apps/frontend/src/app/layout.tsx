import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { KidsModeProvider } from "../context/KidsModeContext";
import { UserPreferencesProvider } from "./providers/UserPreferencesProvider";
import { SessionProvider as NextAuthSessionProvider } from './providers/SessionProvider';
import './styles/globals.css'
import './styles/mobile-optimizations.css'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from "next";
import PWAServiceWorker from "./components/PWAServiceWorker";
import PushNotificationManager from "./components/PushNotificationManager";
import MobilePerformanceOptimizer from "./components/MobilePerformanceOptimizer";
import { ErrorBoundaryWithPerformance } from "./components/ErrorBoundary/ErrorBoundaryWithPerformance";
import { ErrorMonitor } from './components/ErrorMonitor';
import BackendStatusIndicator from './components/BackendStatusIndicator';
import ThemeToggle from './components/ThemeToggle';
import MobileMetaOptimizer from "./components/MobileMetaOptimizer";

export const metadata: Metadata = {
  title: 'Sports Central - AI-Powered Predictions',
  description: 'Get AI-powered sports predictions, live scores, and real-time odds',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sports Central',
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Sports Central',
    'application-name': 'Sports Central',
    'msapplication-TileColor': '#1a1f3a',
    'msapplication-tap-highlight': 'no',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1f3a' }
  ],
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
        {/* Theme is now handled in ThemeToggle component to prevent SSR hydration errors */}
      </head>
      <body className="antialiased">
        <ErrorBoundaryWithPerformance>
          <NextAuthSessionProvider>
            <NextIntlClientProvider messages={messages} locale={locale}>
              <KidsModeProvider>
                <UserPreferencesProvider>
                  <PWAServiceWorker />
                  <PushNotificationManager />
                  <MobileMetaOptimizer />
                  <MobilePerformanceOptimizer />
                  <ThemeToggle />
                  {children}
                  <Analytics />
                  <SpeedInsights />
                  <ErrorMonitor />
                  <BackendStatusIndicator />
                </UserPreferencesProvider>
              </KidsModeProvider>
            </NextIntlClientProvider>
          </NextAuthSessionProvider>
        </ErrorBoundaryWithPerformance>
      </body>
    </html>
  );
}