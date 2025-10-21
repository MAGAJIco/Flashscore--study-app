
import React from 'react';

interface ComponentLoaderProps {
  children: React.ReactNode;
}

export const ComponentLoader: React.FC<ComponentLoaderProps> = ({ children }) => {
  return (
    <div className="relative">
      {children}
    </div>
  );
};
