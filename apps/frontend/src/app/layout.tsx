import "./styles/globals.css";
import type { Metadata } from "next";
import PWAServiceWorker from "./components/PWAServiceWorker";
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <PWAServiceWorker />
        {children}
      </body>
    </html>
  );
}