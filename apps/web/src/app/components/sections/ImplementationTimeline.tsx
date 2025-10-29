
"use client";

import { TIMELINE_ITEMS } from '@/lib/constant/mockData';

export function ImplementationTimeline() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'border-green-500 bg-green-500';
      case 'progress':
        return 'border-orange-500 bg-orange-500';
      case 'pending':
        return 'border-gray-400 bg-gray-400';
      default:
        return 'border-blue-500 bg-blue-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 flex items-center gap-3">
        <span className="text-4xl">📊</span>
        Implementation Timeline
      </h2>
      
      <div className="relative pl-10">
        {/* Gradient line */}
        <div className="absolute left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-400" />
        
        <div className="space-y-6">
          {TIMELINE_ITEMS.map((item, index) => (
            <div 
              key={index}
              className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              {/* Circle indicator */}
              <div 
                className={`absolute -left-10 top-8 w-4 h-4 rounded-full border-4 ${getStatusColor(item.status)}`}
              />
              
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.status === 'complete' 
                    ? 'bg-green-500 text-white' 
                    : item.status === 'progress'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
