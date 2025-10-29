
"use client";

import { KEY_BENEFITS } from '@/lib/constant/mockData';

export function BenefitsGrid() {
  const benefitColors = [
    'from-orange-100 to-pink-200 dark:from-orange-900/30 dark:to-pink-900/30',
    'from-blue-100 to-cyan-200 dark:from-blue-900/30 dark:to-cyan-900/30',
    'from-purple-100 to-pink-200 dark:from-purple-900/30 dark:to-pink-900/30',
    'from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-900/30',
    'from-yellow-100 to-amber-200 dark:from-yellow-900/30 dark:to-amber-900/30',
    'from-red-100 to-rose-200 dark:from-red-900/30 dark:to-rose-900/30',
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 flex items-center gap-3">
        <span className="text-4xl">🚀</span>
        Key Benefits
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {KEY_BENEFITS.map((benefit, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br ${benefitColors[index % benefitColors.length]} p-6 rounded-xl font-semibold text-gray-900 dark:text-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer transform`}
          >
            {benefit}
          </div>
        ))}
      </div>
    </div>
  );
}
