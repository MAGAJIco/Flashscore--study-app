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
      <head><link rel="manifest" href="/manifest.json" /><meta name="theme-color" content="#000000" /></head>
      {/* PWAServiceWorker from original code is kept */}
      {/* The body class and style are updated based on the changes */}
      <body className="sports" style={{ contentVisibility: 'auto' }}>
        <PWAServiceWorker />
        {children}
      </body>
    </html>
  );
}