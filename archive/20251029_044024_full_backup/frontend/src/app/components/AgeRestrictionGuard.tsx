"use client";

import React from 'react';

interface AgeRestrictionGuardProps {
  children: React.ReactNode;
  feature?: 'betting' | 'payments' | 'fullContent';
}

export function AgeRestrictionGuard({ children, feature = 'fullContent' }: AgeRestrictionGuardProps) {
  // Remove all age restrictions - allow all users
  return <>{children}</>;
}

