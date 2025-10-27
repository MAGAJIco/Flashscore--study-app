
'use client';

import React from 'react';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';

export default function SocialFeedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Social" }, { label: "Feed" }]} />
      
      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-4">Social Feed</h1>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-8 text-center">
          <p className="text-blue-400 text-lg mb-2">🚧 Coming Soon</p>
          <p className="text-gray-400">Connect with other sports fans and share your predictions!</p>
        </div>
      </div>
    </div>
  );
}
