"use client";

import React from 'react';
import { OptimizedDashboard } from '@/app/components/OptimizedDashboard';
import { MagajiCoAppLauncher } from '@/app/components/MagajiCoAppLauncher';
import { MagajiCoCommandCenter } from '@/app/components/MagajiCoCommandCenter';

export default function HomePage() {
  return (
    <div className="relative">
      <OptimizedDashboard />
      <MagajiCoAppLauncher />
      <MagajiCoCommandCenter />
    </div>
  );
}