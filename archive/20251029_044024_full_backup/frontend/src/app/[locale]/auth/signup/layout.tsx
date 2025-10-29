"use client";

import React from 'react';

//app/[locale]/auth/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      {children}
      <style jsx global>{`
        .auth-layout {
          min-height: 100vh;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        
        /* Remove any inherited padding/margins */
        .auth-layout > * {
          margin: 0;
        }
        
        /* Ensure body has no padding on auth pages */
        body:has(.auth-layout) {
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>
    </div>
  );
}