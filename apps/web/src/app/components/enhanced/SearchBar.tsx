
"use client";

import React, { useState } from 'react';

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-xl"
      >
        🔍
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-scale-in">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔍</span>
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search matches, teams, players..."
                  className="flex-1 text-lg outline-none"
                  autoFocus
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            {query && (
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="text-sm text-gray-500 mb-3">Search Results</div>
                <div className="space-y-2">
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="font-semibold">Man United vs Arsenal</div>
                    <div className="text-sm text-gray-500">Live Match</div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="font-semibold">Lakers vs Warriors</div>
                    <div className="text-sm text-gray-500">Live Match</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
