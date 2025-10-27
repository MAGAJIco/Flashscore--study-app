
"use client";

import React from 'react';

export function DocsOverview() {
  return (
    <div className="bg-white rounded-2xl p-8 mb-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-violet-600 mb-4">📋 Overview</h2>
      <p className="text-lg leading-relaxed text-gray-700">
        Sports Central is organized into feature-based apps within a monorepo structure.
        Each feature app is independent but shares common infrastructure, enabling better
        organization, easier maintenance, and improved performance.
      </p>
    </div>
  );
}
