
"use client";

import React from 'react';
import { SocialIcon } from '@/components/icons/SVGIcons';

export default function SocialFeedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <SocialIcon size={32} className="text-pink-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Social Hub
            </h1>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Connect with Sports Fans
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Share predictions, discuss matches, and compete with friends in real-time.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-bold text-pink-600 mb-2">🎯 Challenges</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create prediction challenges with friends
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-bold text-purple-600 mb-2">💬 Live Chat</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Discuss matches in real-time
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-bold text-blue-600 mb-2">🏆 Leaderboards</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Compete globally or with friends
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-bold text-green-600 mb-2">👥 Follow Experts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learn from top predictors
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Coming soon: Full social features including friend challenges, community discussions, and expert predictions!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
