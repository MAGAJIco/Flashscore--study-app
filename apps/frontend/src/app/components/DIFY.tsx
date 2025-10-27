
"use client";

import React, { ReactNode } from 'react';

interface DIFYProps {
  children: ReactNode;
  title?: string;
}

export function DIFY({ children, title = "Sports Central" }: DIFYProps) {
  return (
    <div className="dify-wrapper min-h-screen bg-gradient-to-br from-purple-600 to-purple-900">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-purple-600">
                🏗️ {title}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100">🔍</button>
              <button className="p-2 rounded-full hover:bg-gray-100">❓</button>
              <button className="p-2 rounded-full hover:bg-gray-100">⚙️</button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
