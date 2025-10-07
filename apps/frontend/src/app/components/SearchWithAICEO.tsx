
"use client";
import React, { useState } from 'react';
import MagajiCoManager from './MagajiCoManager';

interface SearchWithAICEOProps {
  onSearch: (query: string) => void;
}

export default function SearchWithAICEO({ onSearch }: SearchWithAICEOProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAICEO, setShowAICEO] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="relative">
      {/* Search Bar with AI CEO Toggle */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search matches, predictions, or ask AI CEO..."
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowAICEO(!showAICEO)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            🧠 AI
          </button>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Embedded AI CEO */}
      {showAICEO && (
        <div className="mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">🧠 AI CEO Assistant</h3>
              <button
                onClick={() => setShowAICEO(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <MagajiCoManager isOpen={true} />
          </div>
        </div>
      )}
    </div>
  );
}
