"use client";

import { useState, useEffect } from "react";
import MagajiCoManager from "./components/MagajiCoManager";

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState("checking...");

  useEffect(() => {
    // Test backend health endpoint with retry logic
    const checkBackend = async () => {
      try {
        const response = await fetch("/api/backend/health");
        if (response.ok) {
          setBackendStatus("✅ Connected");
        } else {
          throw new Error(`Backend returned ${response.status}`);
        }
      } catch (error) {
        console.warn("Backend connection failed:", error);
        setBackendStatus("❌ Disconnected");
        // Retry after 5 seconds
        setTimeout(checkBackend, 5000);
      }
    };
    
    checkBackend();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white p-5 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl mb-2">⚽ MagajiCo</h1>
        <p className="text-lg opacity-90">Smart Football Predictions Platform</p>
      </header>

      <div className="max-w-6xl mx-auto grid gap-5 grid-cols-1 md:grid-cols-2">
        <div className="bg-white/10 backdrop-blur rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">System Status</h2>
          <p>Backend: {backendStatus}</p>
          <p>Frontend: ✅ Running</p>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-2">
            View Predictions
          </button>
          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
            Test Backend
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-6 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Welcome to MagajiCo</h2>
          <p>This is a smart football predictions platform. The application is now running successfully with both frontend and backend services connected.</p>
        </div>
      </div>

      <footer className="text-center mt-10 opacity-70">
        <p>🏆 Powered by MagajiCo Technology | Next.js + Fastify</p>
      </footer>
      
      <MagajiCoManager />
    </div>
  );
}