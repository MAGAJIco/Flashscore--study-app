
"use client";

import React from 'react';

export function ArchitectureOverview() {
  return (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fadeInUp">
      <h2 className="text-3xl font-bold text-purple-600 mb-4">📋 Overview</h2>
      <p className="text-lg leading-relaxed text-gray-700">
        Sports Central is organized into feature-based apps within a monorepo structure. 
        Each feature app is independent but shares common infrastructure, enabling better 
        organization, easier maintenance, and improved performance.
      </p>
    </section>
  );
}
