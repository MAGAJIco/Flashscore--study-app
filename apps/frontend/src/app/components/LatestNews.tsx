"use client";

import React from 'react';

export function LatestNews() {
  return (
    <section className="glass-card p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        Latest Sports News
      </h2>
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          Loading latest sports news...
        </p>
      </div>
    </section>
  );
}