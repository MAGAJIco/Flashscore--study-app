
"use client";

import React from 'react';
import { 
  UnifiedSportsHub, 
  PortalWidgetSystem, 
  PortalCommandCenter 
} from '@/app/components';

export default function HomePage() {
  return (
    <>
      <div style={{ marginBottom: '40px' }}>
        <PortalWidgetSystem />
      </div>
      <UnifiedSportsHub initialTab="overview" showPortalView={true} />
      <PortalCommandCenter />
    </>
  );
}
