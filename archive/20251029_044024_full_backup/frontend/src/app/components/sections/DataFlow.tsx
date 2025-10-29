
"use client";

export function DataFlow() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">🔄 Data Flow</h2>
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="bg-white px-6 py-3 rounded-lg shadow-md font-semibold text-gray-700">
            Client Request
          </div>
          <span className="text-2xl">→</span>
          <div className="bg-white px-6 py-3 rounded-lg shadow-md font-semibold text-gray-700">
            Next.js API Route
          </div>
          <span className="text-2xl">→</span>
          <div className="bg-white px-6 py-3 rounded-lg shadow-md font-semibold text-gray-700">
            Backend Module
          </div>
          <span className="text-2xl">→</span>
          <div className="bg-white px-6 py-3 rounded-lg shadow-md font-semibold text-gray-700">
            Service Layer
          </div>
          <span className="text-2xl">→</span>
          <div className="bg-white px-6 py-3 rounded-lg shadow-md font-semibold text-gray-700">
            Database/API
          </div>
        </div>
      </div>
    </div>
  );
}
