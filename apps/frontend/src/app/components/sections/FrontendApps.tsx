"use client";

import { FeatureCard } from '@/app/components/cards/FeatureCard';
import { FEATURE_APPS } from '@/lib/constant/features';

export function FrontendApps() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">📱 Frontend Apps Structure</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURE_APPS.map((app, index) => (
          <FeatureCard
            key={index}
            icon={app.icon}
            title={app.title}
            description={app.description}
            items={app.items}
          />
        ))}
      </div>
    </div>
  );
}