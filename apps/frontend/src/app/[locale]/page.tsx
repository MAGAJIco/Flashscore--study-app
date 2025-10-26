
"use client";

import React from 'react';
import { 
  ComprehensiveSportsHub, 
  PortalWidgetSystem, 
  PortalCommandCenter 
} from '@/app/components';

export default function HomePage() {
  return (
    <>
      <div style={{ marginBottom: '40px' }}>
        <PortalWidgetSystem />
      </div>
      <ComprehensiveSportsHub />
      <PortalCommandCenter />
    </>
  );
}
