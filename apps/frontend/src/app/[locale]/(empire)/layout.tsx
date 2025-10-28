
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';

export default function EmpireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Track visibility changes
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Extract breadcrumb info from pathname
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const items = [];
    
    // Remove locale from paths
    const relevantPaths = paths.slice(1);
    
    if (relevantPaths.includes('empire')) {
      items.push({ label: 'Empire', href: '/empire' });
    }

    return items;
  };

  return (
    <div className="empire-layout min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-6">
        {isVisible && (
          <div className="mb-4">
            <Breadcrumbs items={getBreadcrumbs()} />
          </div>
        )}
        <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-50'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
