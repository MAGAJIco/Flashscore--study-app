"use client";

import React, { useState, useEffect } from 'react';
import { useSidebar } from '@/contexts/SidebarContext';

interface MainLayoutWrapperProps {
  children: React.ReactNode;
}

export function MainLayoutWrapper({ children }: MainLayoutWrapperProps) {
  const { isOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div 
      className={`
        min-h-screen transition-all duration-300
        ${isOpen ? 'lg:ml-64' : 'lg:ml-20'}
      `}
    >
      {children}
    </div>
  );
}
