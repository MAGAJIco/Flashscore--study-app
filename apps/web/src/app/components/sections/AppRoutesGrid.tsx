
"use client";

import { FEATURE_APPS } from '@/lib/constant/mockData';

export function AppRoutesGrid() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 flex items-center gap-3">
        <span className="text-4xl">🎯</span>
        Feature Routes
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURE_APPS.map((app, index) => (
          <div 
            key={index}
            className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/30 rounded-xl p-6 border-2 border-transparent hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
          >
            <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-3">
              <span className="text-2xl">{app.icon}</span>
              {app.title}
            </h3>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                <strong>Routes:</strong>
              </p>
              <ul className="space-y-2">
                {app.routes.map((route, rIndex) => (
                  <li 
                    key={rIndex}
                    className="text-gray-700 dark:text-gray-200 py-2 px-3 bg-gray-50 dark:bg-gray-700 border-l-4 border-indigo-500 rounded transition-all duration-200 hover:pl-5 hover:shadow-md"
                  >
                    <code className="text-sm font-mono text-indigo-600 dark:text-indigo-400">
                      {route}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
