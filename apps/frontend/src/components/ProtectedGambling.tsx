"use client";

import React from "react";
import { useKidsMode } from "../hooks/useKidsMode";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export const ProtectedGambling: React.FC<Props> = ({
  children,
  fallback = null,
}) => {
  const { kidsMode } = useKidsMode();
  
  if (kidsMode) {
    return <>{fallback || (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        background: '#f0f0f0', 
        borderRadius: '8px',
        margin: '10px 0'
      }}>
        <p>🔒 This content is hidden in Kids Mode</p>
      </div>
    )}</>;
  }
  
  return <>{children}</>;
};
