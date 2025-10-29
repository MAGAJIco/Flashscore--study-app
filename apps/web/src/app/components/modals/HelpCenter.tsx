
"use client";

import React, { useState } from 'react';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const helpTopics = [
  {
    category: 'Getting Started',
    icon: '🚀',
    items: [
      { title: 'How to use Sports Central', link: '#' },
      { title: 'Understanding AI Predictions', link: '#' },
      { title: 'Navigating the Portal', link: '#' },
    ]
  },
  {
    category: 'Features',
    icon: '⚡',
    items: [
      { title: 'Live Match Tracking', link: '#' },
      { title: 'Social Feed & Challenges', link: '#' },
      { title: 'Rewards System', link: '#' },
    ]
  },
  {
    category: 'Account',
    icon: '👤',
    items: [
      { title: 'Managing Your Profile', link: '#' },
      { title: 'Privacy Settings', link: '#' },
      { title: 'Notifications', link: '#' },
    ]
  },
];

export function HelpCenter({ isOpen, onClose }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              ❓ Help Center
            </h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            className="w-full px-4 py-3 rounded-lg text-gray-900 outline-none"
          />
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          {helpTopics.map((topic, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">{topic.icon}</span>
                {topic.category}
              </h3>
              <div className="space-y-2">
                {topic.items.map((item, i) => (
                  <a 
                    key={i}
                    href={item.link}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-indigo-600 hover:text-indigo-700 font-medium">
                      {item.title} →
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8 p-4 bg-indigo-50 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-2">Can't find what you're looking for?</h3>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
              Contact Support 💬
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
