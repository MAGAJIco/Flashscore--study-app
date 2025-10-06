import "./styles/globals.css";
import type { Metadata } from "next";
import PWAServiceWorker from "./components/PWAServiceWorker";
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

// Assume 'inter' font is defined elsewhere or will be imported
// For example: import { Inter } from 'next/font/google'; const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Sports Central",
  description: "Your complete sports prediction and live scores platform",
  applicationName: "Sports Central",
  manifest: "/manifest.json",
  themeColor: "#00ff88",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://api.sportsdata.io" />
        {/* The viewport meta tag from the original code is kept for compatibility */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
        {/* The following meta tags are updated/added based on the changes provided */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Theme color meta tags from original and changes are merged */}
        <meta name="theme-color" content="#00ff88" /> {/* Original theme color */}
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" /> {/* From changes */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" /> {/* From original */}
        <meta name="color-scheme" content="light dark" /> {/* From original */}
        <meta name="format-detection" content="telephone=no" /> {/* From original */}
        <link rel="manifest" href="/manifest.json" /> {/* From changes */}
      </head>
      {/* PWAServiceWorker from original code is kept */}
      {/* The body class and style are updated based on the changes */}
      <body className="sports" style={{ contentVisibility: 'auto' }}>
        <PWAServiceWorker />
        {children}
      </body>
    </html>
  );
}