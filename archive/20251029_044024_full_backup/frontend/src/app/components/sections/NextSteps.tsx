
"use client";

import { NEXT_STEPS } from '@/lib/constant/mockData';

export function NextSteps() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">🎯 Next Steps</h2>
      <div className="space-y-3">
        {NEXT_STEPS.map((step, index) => (
          <div 
            key={index}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-l-4 border-indigo-600 text-gray-800 font-medium transition-all hover:shadow-md"
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
