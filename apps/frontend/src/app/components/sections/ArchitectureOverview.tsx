"use client";

export function ArchitectureOverview() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">🏗️ Architecture Overview</h2>
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
        <p className="text-gray-700 text-lg mb-4">
          Sports Central uses a modern feature-based architecture that separates concerns
          and enables independent development and deployment of features.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-indigo-600 mb-2">Frontend</h3>
            <p className="text-sm text-gray-600">
              Next.js 14 with App Router, organized in feature-based route groups
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-indigo-600 mb-2">Backend</h3>
            <p className="text-sm text-gray-600">
              Fastify with modular services and MongoDB for data persistence
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-indigo-600 mb-2">ML Service</h3>
            <p className="text-sm text-gray-600">
              FastAPI with scikit-learn for AI-powered predictions
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-indigo-600 mb-2">Shared Package</h3>
            <p className="text-sm text-gray-600">
              TypeScript types and utilities shared across the monorepo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
