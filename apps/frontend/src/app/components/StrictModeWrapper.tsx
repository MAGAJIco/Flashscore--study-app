
"use client";

import { ReactNode, useEffect, useState } from 'react';

interface StrictModeWrapperProps {
  children: ReactNode;
  suppressStrictMode?: boolean;
}

export default function StrictModeWrapper({ 
  children, 
  suppressStrictMode = false 
}: StrictModeWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (suppressStrictMode && typeof window !== 'undefined') {
    // For pages with third-party libraries that don't support StrictMode
    return <>{children}</>;
  }

  return <>{children}</>;
}
