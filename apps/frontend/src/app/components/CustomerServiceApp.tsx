"use client";
import React, { useState, useEffect } from "react";
import { MagajiCoManager } from "@components/MagajiCoManager";

export function CustomerServiceApp() {
  const [highlightedMatch, setHighlightedMatch] = useState<string | null>(null);

  // Listen for CEO highlights
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setHighlightedMatch(customEvent.detail);
    };
    window.addEventListener("highlightMatch", handler);
    return () => window.removeEventListener("highlightMatch", handler);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-800 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">⚽ Customer Service App</h1>

      <MagajiCoManager />

      {highlightedMatch && (
        <div className="mt-6 p-4 bg-yellow-500 text-black rounded-lg font-semibold">
          🌟 Highlighted Match: {highlightedMatch}
        </div>
      )}
    </div>
  );
}