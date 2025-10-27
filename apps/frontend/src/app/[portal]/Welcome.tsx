// apps/frontend/src/app/(portal)/welcome.tsx

"use client";

import React from "react";
import { Welcome } from "@/app/components/Welcome";

export default function WelcomePage() {
  return (
    <div className="welcome-page-wrapper">
      {/* Use the shared Welcome component with internationalization */}
      <Welcome />

      {/* Additional portal-specific content below the welcome */}
      <section className="portal-features py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="feature-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                AI Predictions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                ML-powered sports forecasts with real-time analytics
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="feature-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Live Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time match updates and live scores
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="feature-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Social Hub
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with sports fans worldwide
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="feature-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Rewards System
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Earn achievements and Pi Coins
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="feature-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Kids Mode
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Safe sports learning for children
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="feature-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Deep insights and performance tracking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="quick-start py-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Get Started in 3 Easy Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="step-card">
              <div className="text-5xl mb-4">1️⃣</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                Choose Your Sport
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Select from football, basketball, tennis, and more
              </p>
            </div>
            <div className="step-card">
              <div className="text-5xl mb-4">2️⃣</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                Get Predictions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access AI-powered match predictions
              </p>
            </div>
            <div className="step-card">
              <div className="text-5xl mb-4">3️⃣</div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                Track & Earn
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor results and earn rewards
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================
// EXISTING COMPONENT (for reference)
// apps/frontend/src/shared/components/Welcome.tsx
// ============================================

/*
"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export function Welcome() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('home');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Show a lightweight skeleton during hydration
    return (
      <section className="text-center py-12">
        <div className="h-14 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg mx-auto max-w-2xl mb-4 animate-pulse" />
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg mx-auto max-w-xl animate-pulse" />
      </section>
    );
  }

  return (
    <section className="text-center py-12 animate-fade-in">
      <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
        {t('welcome', { defaultValue: 'Welcome to MagajiCo' })}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        {t('tagline', { defaultValue: 'AI-Powered Sports Predictions & Analytics' })}
      </p>
    </section>
  );
}
*/
