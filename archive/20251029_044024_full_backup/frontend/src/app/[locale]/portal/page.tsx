
"use client";

import React, { useState } from 'react';
import { PortalDashboard } from '@/app/components/PortalDashboard';
import { MagajiCoUnifiedDashboard } from '@/app/components/MagajiCoUnifiedDashboard';

export default function PortalPage() {
  // Toggle between original portal and new unified dashboard
  const [useUnified, setUseUnified] = useState(true);

  return (
    <>
      <div className="fixed top-20 right-4 z-50">
        <button
          onClick={() => setUseUnified(!useUnified)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-sm font-medium"
        >
          {useUnified ? '📊 Classic View' : '⚡ Unified View'}
        </button>
      </div>
      {useUnified ? <MagajiCoUnifiedDashboard /> : <PortalDashboard />}
    </>
  );
}
