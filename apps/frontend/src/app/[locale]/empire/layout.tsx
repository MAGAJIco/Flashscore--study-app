"use client";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased empire-layout">
        {children}
        <style jsx global>{`
          .empire-layout [style*="position: fixed"][style*="right"] {
            display: none !important;
          }

          .empire-layout button[style*="position: fixed"][style*="right"] {
            display: none !important;
          }
        `}</style>
      </body>
    </html>
  );
}