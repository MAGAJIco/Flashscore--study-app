
'use client';

import React from 'react';

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="predictions-app min-h-screen">
      {children}
    </div>
  );
}
