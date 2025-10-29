
"use client";

import { CrossPlatformSync } from '@/app/components/CrossPlatformSync';

export default function SyncManagementPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Cross-Platform Sync Management</h1>
      <CrossPlatformSync />
    </div>
  );
}

