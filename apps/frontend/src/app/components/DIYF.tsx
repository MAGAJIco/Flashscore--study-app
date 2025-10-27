"use client";

import React from 'react';

/**
 * DIYF - Do It Yourself Framework
 * A simple wrapper component for the main app content
 */
export function DIYF({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}
