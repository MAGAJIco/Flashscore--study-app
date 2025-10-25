
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
