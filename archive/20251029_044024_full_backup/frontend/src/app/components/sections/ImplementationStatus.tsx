
"use client";

import { StatusBadge } from '@/components/ui/StatusBadge';
import { TIMELINE_ITEMS } from '@/lib/constant/mockData';

export function ImplementationStatus() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">📊 Implementation Status</h2>
      <div className="space-y-4">
        {TIMELINE_ITEMS.map((item, index) => (
          <div 
            key={index}
            className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border-l-4 border-indigo-500"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
              <StatusBadge status={item.status} />
            </div>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
