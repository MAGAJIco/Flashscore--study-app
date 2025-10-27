
"use client";

import React from 'react';

const statuses = [
  {
    title: 'Frontend Route Groups',
    status: 'complete',
    description: 'All feature route groups created with proper layouts and navigation updated'
  },
  {
    title: 'Backend Modules',
    status: 'complete',
    description: 'Module structure created and routes reorganized with feature grouping'
  },
  {
    title: 'Service Layer',
    status: 'progress',
    description: 'Currently refactoring service layers for each module'
  },
  {
    title: 'Testing & Deployment',
    status: 'pending',
    description: 'Feature-specific testing and deployment pipeline setup'
  }
];

export function ImplementationStatus() {
  return (
    <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-3xl font-bold text-purple-600 mb-6">📊 Implementation Status</h2>
      <div className="relative pl-10">
        <div className="absolute left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-600"></div>
        {statuses.map((item, i) => (
          <div key={i} className="relative mb-6 last:mb-0">
            <div className={`absolute -left-10 top-5 w-4 h-4 rounded-full border-4 border-purple-500 ${
              item.status === 'complete' ? 'bg-green-500' :
              item.status === 'progress' ? 'bg-yellow-500' : 'bg-gray-300'
            }`}></div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                {item.title}
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  item.status === 'complete' ? 'bg-green-500 text-white' :
                  item.status === 'progress' ? 'bg-yellow-500 text-white' :
                  'bg-gray-400 text-white'
                }`}>
                  {item.status === 'complete' ? '✅ Complete' :
                   item.status === 'progress' ? '🔄 In Progress' : '⏳ Pending'}
                </span>
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
