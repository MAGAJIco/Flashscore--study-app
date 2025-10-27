
"use client";

import React from 'react';

export function DocsFooter() {
  return (
    <footer className="text-center text-white/60 py-8 border-t border-white/20">
      <p className="font-bold">Sports Central v2.0.0</p>
      <p className="text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      <p className="text-xs mt-4">All documentation consolidated into InteractiveDocsComponent</p>
    </footer>
  );
}
