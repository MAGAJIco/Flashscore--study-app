import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MagajiCo Empire Builder",
  description: "Build your empire from Foundation to Legendary Rooftop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
