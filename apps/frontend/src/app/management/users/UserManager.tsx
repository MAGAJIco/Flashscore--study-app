"use client";
import React from "react";

export default function UserManager() {
  return (
    <div className="glass-card p-8 rounded-2xl" style={{
      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.04) 100%)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-2xl">👥</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 text-sm">Manage and monitor user accounts</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-3xl font-bold text-blue-400">1,234</div>
          <div className="text-gray-400 text-sm mt-1">Total Users</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-3xl font-bold text-green-400">856</div>
          <div className="text-gray-400 text-sm mt-1">Active Today</div>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-3xl font-bold text-purple-400">42</div>
          <div className="text-gray-400 text-sm mt-1">New This Week</div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Users</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600" />
                  <div>
                    <div className="text-white font-medium">User {i}</div>
                    <div className="text-gray-400 text-sm">user{i}@example.com</div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}