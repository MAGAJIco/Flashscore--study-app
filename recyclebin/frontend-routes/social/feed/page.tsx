"use client";

import React from 'react';
import { Users, MessageCircle, Trophy, Flame, TrendingUp, Heart } from 'lucide-react';

export default function SocialFeedPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/30">
        <div className="flex items-center gap-4 mb-4">
          <Users className="w-12 h-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-bold text-white">Social Hub</h1>
            <p className="text-gray-300">Connect, compete, and share your predictions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Social Feed</h2>
          
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white">User {item}</h3>
                    <span className="text-gray-400 text-sm">2h ago</span>
                  </div>
                  <p className="text-gray-300 mb-3">
                    Just predicted Manchester United to win! My confidence is high for this one. 
                    What do you all think? 🔥
                  </p>
                  <div className="flex items-center gap-4 text-gray-400">
                    <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>24</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>8</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                      <TrendingUp className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Top Experts</h3>
            {[1, 2, 3, 4].map((expert) => (
              <div key={expert} className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-700 last:border-0">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">Expert {expert}</h4>
                  <p className="text-sm text-gray-400">92% accuracy</p>
                </div>
                <button className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-semibold transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 backdrop-blur-xl rounded-xl p-6 border-2 border-amber-500/30">
            <h3 className="text-xl font-bold text-white mb-2">Leaderboard</h3>
            <p className="text-gray-300 mb-4">You're in the top 30%!</p>
            <button className="w-full px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg font-semibold transition-colors">
              View Full Leaderboard
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-xl p-6 border border-green-500/30">
          <Flame className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Active Challenges</h3>
          <p className="text-3xl font-bold text-green-400">12</p>
          <p className="text-gray-400 text-sm">Compete with friends</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/20 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30">
          <MessageCircle className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Live Chats</h3>
          <p className="text-3xl font-bold text-blue-400">5</p>
          <p className="text-gray-400 text-sm">Ongoing discussions</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
          <Trophy className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Your Rank</h3>
          <p className="text-3xl font-bold text-purple-400">#247</p>
          <p className="text-gray-400 text-sm">Global leaderboard</p>
        </div>
      </div>
    </div>
  );
}
